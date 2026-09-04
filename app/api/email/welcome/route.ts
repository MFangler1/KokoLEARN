// ── Welcome Email API ──

import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email/send";
import { welcomeEmail } from "@/lib/email/templates";
import { initAuth } from "@/lib/auth/server";
import { hasTrustedOrigin } from "@/lib/security/origin";

export async function POST(req: Request) {
  try {
    if (!hasTrustedOrigin(req)) return NextResponse.json({ error: "Invalid request origin" }, { status: 403 });
    const auth = await initAuth();
    const session = await auth.api.getSession({ headers: new Headers(req.headers) });
    if (!session?.user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    const email = session.user.email;
    const name = session.user.name?.split(" ")[0] || "there";

    const emailContent = welcomeEmail({ name });
    const sent = await sendEmail({ to: email, ...emailContent });

    return NextResponse.json({ sent });
  } catch (err) {
    console.error("Welcome email error:", err);
    return NextResponse.json({ sent: false });
  }
}
