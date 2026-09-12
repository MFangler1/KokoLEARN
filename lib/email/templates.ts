// ── HTML Email Templates ──

const brandColor = "#F97316";
const bgColor = "#f8fafc";

function wrapper(content: string, title: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title></head>
<body style="margin:0;padding:0;background:${bgColor};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:40px 16px">
<table width="480" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.05)">
<tr><td style="background:#ffffff;padding:28px 32px 18px;text-align:center;border-bottom:4px solid ${brandColor}">
<img src="https://kokolearn.org/images/kokolearn-brand-logo.png" alt="KokoLearn.org" width="128" height="128" style="display:block;margin:0 auto;width:128px;height:128px" />
</td></tr>
<tr><td style="padding:32px">
${content}
</td></tr>
<tr><td style="padding:24px 32px;background:#fafafa;text-align:center">
<p style="margin:0;font-size:12px;color:#94a3b8">
KokoLearn.org — A PAD-CIC initiative<br>
AI-powered tutoring aligned to the UK National Curriculum</p>
</td></tr>
</table>
</td></tr></table></body></html>`;
}

export function welcomeEmail(params: { name: string }): { subject: string; html: string } {
  return {
    subject: "Welcome to KokoLearn! 🎉",
    html: wrapper(`
      <h1 style="margin:0 0 8px;font-size:24px;color:#1e293b">Welcome, ${params.name}!</h1>
      <p style="margin:0 0 20px;font-size:15px;color:#64748b;line-height:1.6">
        We're thrilled to have you and your child on board. KokoLearn creates personalised,
        curriculum-aligned lessons based on your child's unique interests.
      </p>
      <table cellpadding="0" cellspacing="0" style="margin:0 0 24px">
        <tr><td style="padding:0 0 12px;font-size:14px;color:#475569">
          <span style="font-size:20px;margin-right:8px">📚</span>
          Personalised lessons — every child learns differently
        </td></tr>
        <tr><td style="padding:0 0 12px;font-size:14px;color:#475569">
          <span style="font-size:20px;margin-right:8px">🎯</span>
          UK National Curriculum aligned — KS1 & KS2
        </td></tr>
        <tr><td style="padding:0 0 12px;font-size:14px;color:#475569">
          <span style="font-size:20px;margin-right:8px">📊</span>
          Track progress across all subjects
        </td></tr>
      </table>
      <a href="https://kokolearn.org/dashboard" style="display:inline-block;background:linear-gradient(135deg,${brandColor},#EA580C);color:#fff;text-decoration:none;padding:14px 32px;border-radius:12px;font-size:15px;font-weight:600">
        Go to Dashboard
      </a>
      <p style="margin:20px 0 0;font-size:13px;color:#94a3b8">
        Start by creating your child's learning profile — pick their interests and we'll generate the perfect first lesson!
      </p>
    `, "Welcome to KokoLearn"),
  };
}

export function passwordResetEmail(params: { url: string }): { subject: string; html: string } {
  return {
    subject: "Reset Your KokoLearn Password 🔐",
    html: wrapper(`
      <h1 style="margin:0 0 8px;font-size:24px;color:#1e293b">Reset your password</h1>
      <p style="margin:0 0 20px;font-size:15px;color:#64748b;line-height:1.6">
        We received a request to reset your KokoLearn account password. 
        Click the button below to create a new password.
      </p>
      <a href="${params.url}" style="display:inline-block;background:linear-gradient(135deg,${brandColor},#EA580C);color:#fff;text-decoration:none;padding:14px 32px;border-radius:12px;font-size:15px;font-weight:600">
        Reset Password
      </a>
      <p style="margin:20px 0 0;font-size:13px;color:#94a3b8">
        This link expires in 1 hour. If you didn't request a password reset, you can safely ignore this email.
      </p>
    `, "Reset Your Password"),
  };
}

export function welcomeBackEmail(params: { name: string }): { subject: string; html: string } {
  return {
    subject: "Welcome back to KokoLearn! 🌟",
    html: wrapper(`
      <h1 style="margin:0 0 8px;font-size:24px;color:#1e293b">You're back, ${params.name}!</h1>
      <p style="margin:0 0 20px;font-size:15px;color:#64748b;line-height:1.6">
        Great to see you again! Jump back into your child's learning journey.
      </p>
      <a href="https://kokolearn.org/dashboard" style="display:inline-block;background:linear-gradient(135deg,${brandColor},#EA580C);color:#fff;text-decoration:none;padding:14px 32px;border-radius:12px;font-size:15px;font-weight:600">
        Go to Dashboard
      </a>
    `, "Welcome Back"),
  };
}

export function verifyEmailTemplate(params: { name?: string; url: string }): { subject: string; html: string } {
  const who = params.name ? `, ${params.name}` : "";
  return {
    subject: "One quick click to start KokoLearn ✉️",
    html: wrapper(`
      <h1 style="margin:0 0 8px;font-size:24px;color:#1e293b">Confirm your email${who}</h1>
      <p style="margin:0 0 20px;font-size:15px;color:#64748b;line-height:1.6">
        Thanks for joining KokoLearn. Please confirm this is your email address and your
        child's free 24-hour trial is ready to go.
      </p>
      <a href="${params.url}" style="display:inline-block;background:linear-gradient(135deg,${brandColor},#EA580C);color:#fff;text-decoration:none;padding:14px 32px;border-radius:12px;font-size:15px;font-weight:600">
        Confirm my email
      </a>
      <p style="margin:20px 0 0;font-size:13px;color:#94a3b8">
        This link expires in 1 hour. If you didn't create a KokoLearn account, you can safely ignore this email.
      </p>
    `, "Confirm your KokoLearn email"),
  };
}
