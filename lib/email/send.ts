// ── Email Sender ──
// Sends via local relay (gog/Gmail) on the Mac Mini
// Falls back to console.log if relay is unreachable

const RELAY_URL = process.env.EMAIL_RELAY_URL || "http://localhost:53820";

export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(payload: EmailPayload): Promise<boolean> {
  // Try the local relay server first
  try {
    const res = await fetch(RELAY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: payload.to,
        subject: payload.subject,
        html: payload.html,
      }),
      signal: AbortSignal.timeout(5000),
    });

    if (res.ok) {
      console.log(`[EMAIL] Sent via relay to ${payload.to}: ${payload.subject}`);
      return true;
    }

    const err = await res.text();
    console.warn(`[EMAIL] Relay returned ${res.status}: ${err}`);
  } catch (err) {
    console.warn(`[EMAIL] Relay unreachable (${err instanceof Error ? err.message : err}) — email logged`);
  }

  // Fallback: log to console
  console.log(`[EMAIL] Would send to ${payload.to}: ${payload.subject}`);
  console.log(`[EMAIL] Set EMAIL_RELAY_URL or add a Resend API key`);
  return false;
}
