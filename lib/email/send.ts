// ── Email Sender ──
// 1. Tries Cloudflare's send_email binding (production)
// 2. Falls back to the email relay (EMAIL_RELAY_URL secret)
// 3. Falls back to console.log so nothing fails silently

import { getCloudflareContext } from "@opennextjs/cloudflare";

export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  /** Optional plain-text part. Generated from `html` when omitted. */
  text?: string;
  from?: { name: string; email: string };
  replyTo?: { name: string; email: string };
}

const DEFAULT_FROM = { name: "KokoLearn", email: "noreply@kokolearn.org" };

/**
 * Crude HTML → text conversion. Every <a href> is preserved as
 * "label: url" so confirmation links survive any client or relay that
 * renders only the plain-text part.
 */
export function htmlToText(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<head[\s\S]*?<\/head>/gi, "")
    .replace(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, (_m, href: string, label: string) => {
      const text = String(label).replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
      return text && text !== href ? `${text}: ${href}` : href;
    })
    .replace(/<(br|\/p|\/div|\/tr|\/h[1-6]|\/li)\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&mdash;/g, "\u2014")
    .replace(/&ndash;/g, "\u2013")
    .replace(/&pound;/g, "\u00a3")
    .replace(/&([a-z]+);/gi, " ")
    .replace(/&#(\d+);/g, (_m, d: string) => String.fromCharCode(Number(d)))
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

async function workerEnv(): Promise<Record<string, unknown> | undefined> {
  try {
    const { env } = await getCloudflareContext({ async: true });
    return env as unknown as Record<string, unknown>;
  } catch {
    return undefined;
  }
}

export async function sendEmail(payload: EmailPayload): Promise<boolean> {
  const env = await workerEnv();
  const from = payload.from ?? DEFAULT_FROM;
  // Cloudflare's send_email binding rejects address objects whose `name` is not
  // a string, so `to` is passed as a plain string and a text part always goes
  // along with the HTML — that way the links survive a text-only renderer.
  const text = payload.text ?? htmlToText(payload.html);

  // 1. Cloudflare send_email binding
  const binding = env?.SEND_EMAIL as { send?: (msg: unknown) => Promise<unknown> } | undefined;
  if (binding?.send) {
    try {
      await binding.send({
        from: { name: from.name, email: from.email },
        to: payload.to,
        subject: payload.subject,
        html: payload.html,
        text,
        ...(payload.replyTo ? { replyTo: payload.replyTo } : {}),
      });
      console.log(`[EMAIL] Sent via Cloudflare to ${payload.to}: ${payload.subject}`);
      return true;
    } catch (err) {
      console.warn(`[EMAIL] Cloudflare binding failed for ${payload.to}:`, err);
    }
  }

  // 2. Relay
  const relay =
    (env?.EMAIL_RELAY_URL as string | undefined) ||
    process.env.EMAIL_RELAY_URL ||
    "http://localhost:53820";
  try {
    const res = await fetch(relay, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: payload.to,
        subject: payload.subject,
        html: payload.html,
        text,
        from,
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (res.ok) {
      console.log(`[EMAIL] Sent via relay to ${payload.to}: ${payload.subject}`);
      return true;
    }
    console.warn(`[EMAIL] Relay returned ${res.status} for ${payload.to}`);
  } catch (err) {
    console.warn(
      `[EMAIL] Relay unreachable (${err instanceof Error ? err.message : err}) — email logged only`
    );
  }

  console.log(`[EMAIL] NOT SENT to ${payload.to}: ${payload.subject}`);
  return false;
}
