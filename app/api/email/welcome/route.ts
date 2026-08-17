// ── Welcome Email API ──

import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email/send";
import { welcomeEmail } from "@/lib/email/templates";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, name } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const emailContent = welcomeEmail({ name: name || "there" });
    const sent = await sendEmail({ to: email, ...emailContent });

    return NextResponse.json({ sent });
  } catch (err) {
    console.error("Welcome email error:", err);
    return NextResponse.json({ sent: false });
  }
}
