// ── Send Referral Invite API ──
import { NextResponse } from "next/server";
import { initAuth } from "@/lib/auth/server";
import { getDb } from "@/lib/db";
import { referrals } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const auth = await initAuth();
    const session = await auth.api.getSession({ headers: new Headers(req.headers) });
    if (!session?.user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const body = await req.json();
    const { email } = body;
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }

    const db = await getDb();
    if (!db) return NextResponse.json({ error: "Database unavailable" }, { status: 500 });

    let existing = await db
      .select()
      .from(referrals)
      .where(eq(referrals.referrerUserId, session.user.id))
      .get();

    let code: string;
    if (existing) {
      code = existing.referralCode;
    } else {
      code = session.user.id.slice(0, 8).toUpperCase();
      await db.insert(referrals).values({
        id: crypto.randomUUID(),
        referrerUserId: session.user.id,
        referredEmail: email,
        referralCode: code,
        status: "sent",
        createdAt: new Date(),
      });
    }

    const refUrl = `https://kokolearn.org?ref=${code}`;
    const shareText = `I'm using KokoLearn for my child's learning — it's brilliant! Try it free: ${refUrl}`;

    return NextResponse.json({ code, url: refUrl, email, message: shareText });
  } catch (err) {
    console.error("Referral invite error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
