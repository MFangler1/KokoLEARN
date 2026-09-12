// ── Organisation / school enquiry API ──
// Stores the enquiry in D1, notifies Support@kokolearn.org, and sends the
// enquirer a confirmation. Deliberately keeps a human in the loop: schools and
// larger organisations get a personal reply rather than an instant account.

import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { getDb } from "@/lib/db";
import { organisationEnquiries } from "@/lib/db/schema";
import { sendEmail } from "@/lib/email/send";

const FORMS = new Set([
  "Primary school",
  "Secondary school",
  "Academy trust / MAT",
  "Local council",
  "SEND / specialist provision",
  "Alternative provision",
  "Mental health / care organisation",
  "Tutoring business",
  "Other",
]);

function clean(value: unknown, max = 500): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

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

    const organisation = clean(body.organisation, 200);
    const contactName = clean(body.contactName, 120);
    const email = clean(body.email, 200).toLowerCase();
    const orgType = clean(body.orgType, 80);
    const role = clean(body.role, 120);
    const phone = clean(body.phone, 60);
    const learners = clean(body.learners, 60);
    const message = clean(body.message, 3000);
    const honeypot = clean(body.website, 100);

    // Bots fill hidden fields; humans never see this one.
    if (honeypot) {
      return NextResponse.json({ ok: true });
    }

    if (!organisation || !contactName || !email || !message) {
      return NextResponse.json(
        { ok: false, error: "Please complete your organisation, name, email and a short message." },
        { status: 400 }
      );
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return NextResponse.json({ ok: false, error: "Please enter a valid email address." }, { status: 400 });
    }

    let ip = "";
    try {
      const h = await headers();
      ip = h.get("cf-connecting-ip") ?? h.get("x-forwarded-for") ?? "";
    } catch {
      // headers unavailable
    }

    const id = crypto.randomUUID();
    const createdAt = Date.now();
    const type = FORMS.has(orgType) ? orgType : orgType || "Not specified";

    try {
      const db = await getDb();
      if (db) {
        await db.insert(organisationEnquiries).values({
          id,
          organisation,
          orgType: type,
          contactName,
          role,
          email,
          phone,
          learners,
          message,
          status: "new",
          ipAddress: ip,
          createdAt,
        });
      }
    } catch (err) {
      console.warn("[ENQUIRY] Could not store enquiry:", err);
    }

    const when = new Date().toLocaleString("en-GB", { timeZone: "Europe/London" });
    const rows: Array<[string, string]> = [
      ["Organisation", organisation],
      ["Type", type],
      ["Contact", contactName],
      ["Role", role],
      ["Email", email],
      ["Phone", phone],
      ["Learners", learners],
      ["Received", `${when} (UK)`],
      ["IP", ip],
    ];

    await sendEmail({
      to: "support@kokolearn.org",
      subject: `School/org enquiry: ${organisation}`,
      replyTo: { name: contactName, email },
      html: `
        <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:14px;color:#1e293b">
          <h2 style="margin:0 0 12px">New organisation enquiry</h2>
          <table cellpadding="0" cellspacing="0" style="font-size:13px">
            ${rows
              .filter(([, v]) => v)
              .map(
                ([k, v]) =>
                  `<tr><td style="padding:3px 14px 3px 0;color:#64748b;vertical-align:top">${escapeHtml(k)}</td><td>${escapeHtml(v)}</td></tr>`
              )
              .join("")}
          </table>
          <h3 style="margin:18px 0 6px;font-size:13px;color:#64748b">Message</h3>
          <p style="margin:0;white-space:pre-wrap">${escapeHtml(message)}</p>
          <p style="margin:18px 0 0;color:#64748b;font-size:12px">Reply directly to this email to reach ${escapeHtml(contactName)}.</p>
        </div>`,
    });

    await sendEmail({
      to: email,
      subject: "We've got your KokoLearn enquiry",
      replyTo: { name: "KokoLearn Support", email: "support@kokolearn.org" },
      html: `
        <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:15px;color:#1e293b">
          <h2 style="margin:0 0 10px">Thanks, ${escapeHtml(contactName)}</h2>
          <p style="margin:0 0 12px;line-height:1.6">We've received your enquiry about bringing KokoLearn to <strong>${escapeHtml(organisation)}</strong>.</p>
          <p style="margin:0 0 12px;line-height:1.6">A member of the team will reply personally within one working day with options for your setting, including a short walkthrough call if that would help.</p>
          <p style="margin:0 0 12px;line-height:1.6">If anything is urgent, just reply to this email and it comes straight to us.</p>
          <p style="margin:18px 0 0;color:#64748b;font-size:13px">KokoLearn.org — personalised learning aligned to the UK National Curriculum</p>
        </div>`,
    });

    return NextResponse.json({ ok: true, id });
  } catch (err) {
    console.error("[ENQUIRY] Failed:", err);
    return NextResponse.json(
      { ok: false, error: "Something went wrong sending your enquiry. Please email support@kokolearn.org." },
      { status: 500 }
    );
  }
}
