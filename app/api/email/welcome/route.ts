// ── Welcome Email API ──
// Sends the welcome email to the new member, and a heads-up notification to
// Support@kokolearn.org so staff can spot suspicious sign-ups early.

import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { sendEmail } from "@/lib/email/send";
import { welcomeEmail } from "@/lib/email/templates";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, name } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const emailContent = welcomeEmail({ name: name || "there" });
    const sent = await sendEmail({ to: email, ...emailContent });

    // Staff notification — fire and forget, never blocks the sign-up.
    let ip = "unknown";
    let country = "unknown";
    let city = "";
    try {
      const h = await headers();
      ip = h.get("cf-connecting-ip") ?? h.get("x-forwarded-for") ?? "unknown";
      country = h.get("cf-ipcountry") ?? "unknown";
      city = h.get("cf-ipcity") ?? "";
    } catch {
      // headers unavailable — keep the placeholders
    }

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
          <tr><td style="padding:2px 12px 2px 0;color:#64748b">IP</td><td>${escapeHtml(String(ip))}</td></tr>
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

    return NextResponse.json({ sent });
  } catch (err) {
    console.error("Welcome email error:", err);
    return NextResponse.json({ sent: false });
  }
}
