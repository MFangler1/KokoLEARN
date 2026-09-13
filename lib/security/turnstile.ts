// ── Server-side Turnstile verification ──
// The browser widget proves a human filled the form. This checks the token with
// Cloudflare before we do anything expensive (sending email, calling an API).

import { getCloudflareContext } from "@opennextjs/cloudflare";

const SITEVERIFY = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export interface TurnstileResult {
  ok: boolean;
  reason?: string;
  /** true when no secret key is configured (local dev) — callers decide. */
  unconfigured?: boolean;
}

export async function verifyTurnstile(
  token: string | null | undefined,
  remoteIp?: string
): Promise<TurnstileResult> {
  let secret = process.env.TURNSTILE_SECRET_KEY;
  try {
    const { env } = await getCloudflareContext({ async: true });
    secret = (env as { TURNSTILE_SECRET_KEY?: string }).TURNSTILE_SECRET_KEY ?? secret;
  } catch {
    // fall back to process.env
  }

  if (!secret) {
    // No secret configured: treat as unconfigured so the caller can decide
    // (production always has it set).
    return { ok: false, unconfigured: true, reason: "verification-not-configured" };
  }

  if (!token || typeof token !== "string" || token.length > 4096) {
    return { ok: false, reason: "missing-token" };
  }

  try {
    const form = new FormData();
    form.append("secret", secret);
    form.append("response", token);
    if (remoteIp) form.append("remoteip", remoteIp);

    const res = await fetch(SITEVERIFY, {
      method: "POST",
      body: form,
      signal: AbortSignal.timeout(8000),
    });
    const data = (await res.json()) as { success?: boolean; "error-codes"?: string[] };
    if (data.success) return { ok: true };
    return { ok: false, reason: (data["error-codes"] ?? ["verification-failed"]).join(",") };
  } catch (err) {
    return { ok: false, reason: err instanceof Error ? err.message : "verify-error" };
  }
}
