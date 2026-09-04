// ── Process Referral on Sign-up API ──
import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { referrals } from "@/lib/db/schema";
import { and, eq, isNull } from "drizzle-orm";
import { initAuth } from "@/lib/auth/server";
import { hasTrustedOrigin } from "@/lib/security/origin";

export async function POST(req: Request) {
  try {
    if (!hasTrustedOrigin(req)) return NextResponse.json({ error: "Invalid request origin" }, { status: 403 });
    const auth = await initAuth();
    const session = await auth.api.getSession({ headers: new Headers(req.headers) });
    if (!session?.user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    const body = await req.json();
    const code = typeof body.code === "string" ? body.code.trim().toUpperCase() : "";
    const newUserId = session.user.id;
    if (!code) {
      return NextResponse.json({ error: "Missing code or userId" }, { status: 400 });
    }

    const db = await getDb();
    if (!db) return NextResponse.json({ error: "DB unavailable" }, { status: 500 });

    // Find the referral by code
    const ref = await db
      .select()
      .from(referrals)
      .where(and(eq(referrals.referralCode, code), isNull(referrals.referredUserId)))
      .get();

    if (!ref) {
      return NextResponse.json({ error: "Invalid referral code" }, { status: 404 });
    }

    // Don't allow self-referral
    if (ref.referrerUserId === newUserId) {
      return NextResponse.json({ error: "Cannot refer yourself" }, { status: 400 });
    }
    const prior = await db.select().from(referrals).where(eq(referrals.referredUserId, newUserId)).get();
    if (prior) return NextResponse.json({ status: "already_tracked" });

    // Create a new referral tracking record for this specific invite
    await db.insert(referrals).values({
      id: crypto.randomUUID(),
      referrerUserId: ref.referrerUserId,
      referredEmail: "",
      referredUserId: newUserId,
      referralCode: code,
      status: "signed_up",
      createdAt: new Date(),
    });

    console.log(`✅ Referral processed: ${ref.referrerUserId} referred ${newUserId}`);

    return NextResponse.json({ status: "tracked" });
  } catch (err) {
    console.error("Referral process error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
