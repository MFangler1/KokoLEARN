// ── Generate Referral Code API ──
import { NextResponse } from "next/server";
import { initAuth } from "@/lib/auth/server";
import { getDb } from "@/lib/db";
import { referrals } from "@/lib/db/schema";
import { and, eq, isNull } from "drizzle-orm";
import { hasTrustedOrigin } from "@/lib/security/origin";

export async function POST(req: Request) {
  try {
    if (!hasTrustedOrigin(req)) return NextResponse.json({ error: "Invalid request origin" }, { status: 403 });
    const auth = await initAuth();
    const session = await auth.api.getSession({ headers: new Headers(req.headers) });
    if (!session?.user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const db = await getDb();
    if (!db) return NextResponse.json({ error: "Database unavailable" }, { status: 500 });

    const existing = await db
      .select()
      .from(referrals)
      .where(and(eq(referrals.referrerUserId, session.user.id), isNull(referrals.referredUserId)))
      .get();

    if (existing) {
      return NextResponse.json({ code: existing.referralCode, url: `https://kokolearn.org?ref=${existing.referralCode}` });
    }

    const code = session.user.id.slice(0, 8).toUpperCase();

    await db.insert(referrals).values({
      id: crypto.randomUUID(),
      referrerUserId: session.user.id,
      referredEmail: "",
      referralCode: code,
      status: "active",
      createdAt: new Date(),
    });

    return NextResponse.json({ code, url: `https://kokolearn.org?ref=${code}` });
  } catch (err) {
    console.error("Referral generate error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
