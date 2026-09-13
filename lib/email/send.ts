// ── Email Sender ──
// Sends via Cloudflare's send_email binding — the only send path since
// 13-09-2026, when the Gmail relay fallback was retired. Failures are logged
// loudly instead of silently emailing from a personal address.

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

  // No relay fallback: the Gmail relay was retired 13-09-2026 so nothing can
  // ever go out from a personal address again. A binding failure is loud here
  // and visible in the worker logs.

  console.log(`[EMAIL] NOT SENT to ${payload.to}: ${payload.subject}`);
  return false;
}
