// ── Email unsubscribe ──
// Verifies an HMAC token bound to the address, records the opt-out, and shows a
// simple confirmation page. No session required (it is clicked from an inbox).

import { getDb } from "@/lib/db";
import { emailOptouts } from "@/lib/db/schema";
import { signEmail } from "@/lib/email/token";

function page(title: string, body: string, ok: boolean): Response {
  const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title} — KokoLearn</title></head>
<body style="margin:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
<div style="max-width:520px;margin:80px auto;background:#fff;border-radius:20px;padding:40px 32px;text-align:center;box-shadow:0 4px 16px rgba(0,0,0,0.05)">
  <img src="https://kokolearn.org/images/kokolearn-brand-logo.png" alt="KokoLearn.org" width="110" height="110" style="display:block;margin:0 auto" />
  <h1 style="margin:20px 0 10px;font-size:22px;color:#1e293b">${title}</h1>
  <p style="margin:0;font-size:15px;line-height:1.6;color:#64748b">${body}</p>
  <a href="https://kokolearn.org" style="display:inline-block;margin-top:24px;background:linear-gradient(135deg,#F97316,#EA580C);color:#fff;text-decoration:none;padding:12px 28px;border-radius:12px;font-size:14px;font-weight:600">Back to KokoLearn</a>
  ${ok ? "" : '<p style="margin:18px 0 0;font-size:13px;color:#94a3b8">If this keeps happening, email support@kokolearn.org and we will sort it.</p>'}
</div></body></html>`;
  return new Response(html, {
    status: ok ? 200 : 400,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const email = (url.searchParams.get("e") ?? "").toLowerCase().trim();
  const token = url.searchParams.get("t") ?? "";
  const secret = process.env.BETTER_AUTH_SECRET ?? process.env.CRON_SECRET ?? "";

  if (!email || !token) {
    return page("Link not valid", "That unsubscribe link is incomplete. Please use the link at the foot of the email.", false);
  }

  const expected = await signEmail(email, secret);
  if (expected !== token) {
    return page("Link not valid", "That unsubscribe link could not be verified. Please use the most recent email you received.", false);
  }

  try {
    const db = await getDb();
    if (db) {
      const existing = await db.select().from(emailOptouts);
      if (!existing.some((row) => (row.email ?? "").toLowerCase() === email)) {
        await db.insert(emailOptouts).values({ email, createdAt: Date.now() });
      }
    }
  } catch (err) {
    console.warn("[UNSUBSCRIBE] could not record opt-out:", err);
  }

  return page(
    "You've been unsubscribed",
    `We won't send any more follow-up emails to <strong>${email}</strong>. Your KokoLearn account and your child's progress are untouched, so you can still sign in whenever you like.`,
    true
  );
}
