// ── Email Sender ──
// 1. Tries Cloudflare's send_email binding (production)
// 2. Falls back to the email relay (EMAIL_RELAY_URL secret)
// 3. Falls back to console.log so nothing fails silently

import { getCloudflareContext } from "@opennextjs/cloudflare";

export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  from?: { name: string; email: string };
  replyTo?: { name: string; email: string };
}

const DEFAULT_FROM = { name: "KokoLearn", email: "noreply@kokolearn.org" };

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

  // 1. Cloudflare send_email binding
  const binding = env?.SEND_EMAIL as { send?: (msg: unknown) => Promise<unknown> } | undefined;
  if (binding?.send) {
    try {
      await binding.send({
        from,
        to: [{ email: payload.to }],
        subject: payload.subject,
        html: payload.html,
        ...(payload.replyTo ? { reply_to: payload.replyTo } : {}),
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
