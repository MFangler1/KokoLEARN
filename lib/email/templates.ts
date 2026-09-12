// ── HTML Email Templates ──
// Email-safe HTML: tables for layout, inline styles only, no flex/grid.
// The logo is a remote image that many clients block by default, so every
// header also carries a text wordmark and the layout still reads well without it.

const brandColor = "#F97316";
const brandDark = "#EA580C";
const ink = "#0f172a";
const body = "#334155";
const muted = "#64748b";
const faint = "#94a3b8";
const line = "#e2e8f0";
const logoUrl = "https://kokolearn.org/images/kokolearn-brand-logo.png";

function button(href: string, label: string): string {
  return `<table cellpadding="0" cellspacing="0" style="margin:0 0 8px"><tr>
<td style="background:${brandColor};border-radius:10px">
<a href="${href}" style="display:inline-block;padding:14px 30px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none">${label}</a>
</td></tr></table>`;
}

function p(text: string, last = false): string {
  return `<p style="margin:0 0 ${last ? "0" : "16px"};font-size:15px;line-height:1.65;color:${body}">${text}</p>`;
}

function h1(text: string): string {
  return `<h1 style="margin:0 0 14px;font-size:22px;line-height:1.3;font-weight:700;color:${ink}">${text}</h1>`;
}

function bulletList(items: string[]): string {
  return `<table cellpadding="0" cellspacing="0" style="margin:0 0 20px">${items
    .map(
      (item) => `<tr>
<td style="width:22px;vertical-align:top;padding:0 0 8px;font-size:15px;color:${brandColor};font-weight:700">&#10003;</td>
<td style="padding:0 0 8px;font-size:14px;line-height:1.55;color:${body}">${item}</td>
</tr>`
    )
    .join("")}</table>`;
}

function planRow(name: string, price: string, blurb: string, highlight = false): string {
  return `<table cellpadding="0" cellspacing="0" width="100%" style="margin:0 0 10px">
<tr><td style="border:1px solid ${highlight ? brandColor : line};border-radius:12px;padding:14px 16px;background:${highlight ? "#fff7ed" : "#ffffff"}">
  <span style="font-size:15px;font-weight:700;color:${ink}">${name}</span>
  <span style="font-size:15px;font-weight:700;color:${brandDark}">&nbsp;${price}</span>
  <div style="font-size:13px;line-height:1.55;color:${muted};margin-top:4px">${blurb}</div>
</td></tr></table>`;
}

function wrapper(content: string, title: string, opts: { preheader?: string } = {}): string {
  const preheader = opts.preheader
    ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0">${opts.preheader}</div>`
    : "";
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light only">
<title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif">
${preheader}
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9">
<tr><td align="center" style="padding:32px 12px">

<table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid ${line};border-radius:16px;overflow:hidden">

<tr><td align="center" style="padding:28px 32px 22px;background:#ffffff">
  <img src="${logoUrl}" alt="KokoLearn.org" width="104" height="104" style="display:block;margin:0 auto;width:104px;height:104px;border:0;outline:none;text-decoration:none">
  <div style="margin-top:10px;font-size:17px;font-weight:700;letter-spacing:-0.2px;color:${ink}">KokoLearn.org</div>
  <div style="margin-top:2px;font-size:12px;color:${faint}">Personalised learning, aligned to the UK National Curriculum</div>
</td></tr>
<tr><td style="height:4px;background:${brandColor};line-height:4px;font-size:0">&nbsp;</td></tr>

<tr><td style="padding:32px">
${content}
</td></tr>

<tr><td style="padding:22px 32px 26px;background:#f8fafc;border-top:1px solid ${line}">
  <p style="margin:0 0 6px;font-size:12px;line-height:1.6;color:${faint}">
    KokoLearn.org &mdash; a PAD-CIC initiative. Questions? Reply to this email or write to
    <a href="mailto:support@kokolearn.org" style="color:${muted};text-decoration:underline">support@kokolearn.org</a>.
  </p>
  <p style="margin:0;font-size:12px;line-height:1.6;color:${faint}">
    <a href="https://kokolearn.org/legal/privacy" style="color:${faint};text-decoration:underline">Privacy</a> &nbsp;&middot;&nbsp;
    <a href="https://kokolearn.org/legal/terms" style="color:${faint};text-decoration:underline">Terms</a> &nbsp;&middot;&nbsp;
    <a href="https://kokolearn.org/legal/cookies" style="color:${faint};text-decoration:underline">Cookies</a>
  </p>
</td></tr>

</table>
</td></tr></table>
</body></html>`;
}

/** Appended only to lifecycle (marketing) emails — not to service emails. */
function unsubscribeNote(url?: string): string {
  if (!url) return "";
  return `<p style="margin:22px 0 0;padding-top:16px;border-top:1px solid ${line};font-size:12px;line-height:1.6;color:${faint}">
  You received this because you started a KokoLearn trial.
  <a href="${url}" style="color:${faint};text-decoration:underline">Unsubscribe from follow-up emails</a>.
</p>`;
}

export function welcomeEmail(params: { name: string }): { subject: string; html: string } {
  return {
    subject: "Welcome to KokoLearn",
    html: wrapper(
      `
      ${h1(`Welcome, ${params.name}`)}
      ${p("Your account is ready. KokoLearn builds lessons around what your child is actually interested in, then keeps them moving at the right pace.")}
      ${bulletList([
        "Personalised lessons, generated for your child",
        "KS1 and KS2 objectives across all subjects",
        "Progress tracked so you can see what's working",
      ])}
      ${button("https://kokolearn.org/dashboard", "Go to your dashboard")}
      ${p("Your free 24-hour trial includes 2 lessons. If it's a good fit, plans start at &pound;9.99 a month.", true)}
      `,
      "Welcome to KokoLearn",
      { preheader: "Your KokoLearn account is ready — start with your child's first lesson." }
    ),
  };
}

export function passwordResetEmail(params: { url: string }): { subject: string; html: string } {
  return {
    subject: "Reset your KokoLearn password",
    html: wrapper(
      `
      ${h1("Reset your password")}
      ${p("Click the button below to choose a new password for your KokoLearn account.")}
      ${button(params.url, "Choose a new password")}
      <p style="margin:20px 0 0;font-size:12px;line-height:1.6;color:${faint}">This link expires in 1 hour. If you didn't ask for a reset you can ignore this email — your password stays the same.</p>
      `,
      "Reset your password",
      { preheader: "Choose a new password for your KokoLearn account." }
    ),
  };
}

export function welcomeBackEmail(params: { name: string }): { subject: string; html: string } {
  return {
    subject: "Welcome back to KokoLearn",
    html: wrapper(
      `
      ${h1(`Good to see you again, ${params.name}`)}
      ${p("Your child's progress is saved. Pick up wherever you left off.")}
      ${button("https://kokolearn.org/dashboard", "Go to your dashboard")}
      `,
      "Welcome back",
      { preheader: "Your child's progress is saved — pick up where you left off." }
    ),
  };
}

export function verifyEmailTemplate(params: { name?: string; url: string }): { subject: string; html: string } {
  const who = params.name ? `, ${params.name}` : "";
  return {
    subject: "Confirm your email to start KokoLearn",
    html: wrapper(
      `
      ${h1(`Confirm your email${who}`)}
      ${p("One click and your child's free 24-hour trial is ready to go.")}
      ${button(params.url, "Confirm my email")}
      <p style="margin:20px 0 0;font-size:12px;line-height:1.6;color:${faint}">This link expires in 1 hour. If you didn't create a KokoLearn account you can safely ignore this email.</p>
      `,
      "Confirm your KokoLearn email",
      { preheader: "One click to start your child's free trial." }
    ),
  };
}

// ── Lifecycle (drip) emails ──

export function trialEndedEmail(params: { name?: string; unsubscribeUrl?: string }): { subject: string; html: string } {
  const who = params.name ? `, ${params.name.split(" ")[0]}` : "";
  return {
    subject: "Your KokoLearn trial has ended",
    html: wrapper(
      `
      ${h1(`Your free trial has ended${who}`)}
      ${p("We hope your child enjoyed their first lessons. To carry on with unlimited lessons, progress reports and every subject, choose a plan below.")}
      ${planRow("Premium", "&pound;9.99 / month", "Unlimited personalised lessons, detailed and printable progress reports, full National Curriculum coverage, AI tutor chat, 1 child profile.")}
      ${planRow("Family", "&pound;19.99 / month", "Everything in Premium, plus up to 4 child profiles, individual progress tracking and a family dashboard.", true)}
      ${p("Both are month to month — you can cancel any time and there's no tie-in.")}
      ${button("https://kokolearn.org/pricing", "Compare the plans")}
      ${p("Your child's progress and lesson history are saved, so nothing is lost while you decide.", true)}
      ${unsubscribeNote(params.unsubscribeUrl)}
      `,
      "Your KokoLearn trial has ended",
      { preheader: "Plans start at £9.99 a month — your child's progress is saved." }
    ),
  };
}

export function feedbackRequestEmail(params: { name?: string; unsubscribeUrl?: string }): { subject: string; html: string } {
  const first = params.name ? params.name.split(" ")[0] : "";
  return {
    subject: "How did your child get on with KokoLearn?",
    html: wrapper(
      `
      ${h1("We'd value your thoughts")}
      ${p(`${first ? `${first}, you` : "You"} tried KokoLearn a few days ago. We'd genuinely like to know how it went — what worked, what didn't, and whether anything got in the way.`)}
      ${p("Just reply to this email with a sentence or two. Every reply is read by a person, and it directly shapes what we build next.")}
      ${button("mailto:support@kokolearn.org?subject=My%20KokoLearn%20feedback", "Reply with your feedback")}
      ${p("Thank you — it genuinely helps.", true)}
      ${unsubscribeNote(params.unsubscribeUrl)}
      `,
      "How did it go?",
      { preheader: "A sentence or two is all we need — every reply is read." }
    ),
  };
}

export function anotherTrialEmail(params: { name?: string; unsubscribeUrl?: string }): { subject: string; html: string } {
  const first = params.name ? params.name.split(" ")[0] : "";
  return {
    subject: "Your child's progress is still here",
    html: wrapper(
      `
      ${h1(`Ready to pick things up again${first ? `, ${first}` : ""}?`)}
      ${p("Everything your child completed is saved — lessons, scores and progress — so starting again takes seconds.")}
      ${p("Your account also still includes free trial lessons: 2 personalised lessons every 24 hours, no payment details needed.")}
      ${button("https://kokolearn.org/sign-in", "Sign in and carry on")}
      ${p("If it's not the right time, no action is needed — your account stays exactly as it is.", true)}
      ${unsubscribeNote(params.unsubscribeUrl)}
      `,
      "Come back to KokoLearn",
      { preheader: "Your child's progress is saved, and free trial lessons are still available." }
    ),
  };
}
