// ── Sign-up notifications ──
// Sends the welcome email to the new member and a heads-up to support@
// so staff can spot suspicious sign-ups early.
//
// This deliberately lives on the server and is called from the auth
// database hook when a user row is created — there is NO public HTTP
// endpoint for it, so it cannot be used by anyone else to send mail.

import { sendEmail } from "@/lib/email/send";
import { welcomeEmail } from "@/lib/email/templates";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export interface SignupNotificationParams {
  email: string;
  name?: string;
  ip?: string;
  country?: string;
  city?: string;
}

export async function sendSignupNotifications({
  email,
  name,
  ip,
  country,
  city,
}: SignupNotificationParams): Promise<void> {
  if (!email) return;

  // 1. Welcome email to the new member.
  try {
    const emailContent = welcomeEmail({ name: name || "there" });
    await sendEmail({ to: email, ...emailContent });
  } catch (err) {
    console.error("[SIGNUP] Welcome email failed:", err);
  }

  // 2. Staff notification — never allowed to affect the sign-up itself.
  try {
    const when = new Date().toLocaleString("en-GB", { timeZone: "Europe/London" });
    const where = [city, country].filter(Boolean).join(", ") || "unknown";
    const notifyHtml = `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:14px;color:#1e293b">
        <h2 style="margin:0 0 12px">New KokoLearn.org sign-up</h2>
        <p style="margin:0 0 12px"><strong>${escapeHtml(String(name || "(no name)"))}</strong> just started a free trial.</p>
        <table cellpadding="0" cellspacing="0" style="font-size:13px">
          <tr><td style="padding:2px 12px 2px 0;color:#64748b">Email</td><td>${escapeHtml(String(email))}</td></tr>
          <tr><td style="padding:2px 12px 2px 0;color:#64748b">When</td><td>${escapeHtml(when)} (UK)</td></tr>
          <tr><td style="padding:2px 12px 2px 0;color:#64748b">Location</td><td>${escapeHtml(where)}</td></tr>
          <tr><td style="padding:2px 12px 2px 0;color:#64748b">IP</td><td>${escapeHtml(String(ip || "unknown"))}</td></tr>
        </table>
        <p style="margin:16px 0 0;color:#64748b;font-size:12px">
          Review the full list in the admin panel: https://kokolearn.org/admin
        </p>
      </div>`;

    await sendEmail({
      to: "support@kokolearn.org",
      subject: `New free trial: ${email}`,
      html: notifyHtml,
      replyTo: { name: "Professor KokoLearn", email: "support@kokolearn.org" },
    });
  } catch (err) {
    console.error("[SIGNUP] Staff notification failed:", err);
  }
}
