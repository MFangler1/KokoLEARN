// ── Subscription Status API ──
// Returns the user's subscription status and add-on flags

import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { subscriptions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { initAuth } from "@/lib/auth/server";

export async function GET(req: Request) {
  try {
    const auth = await initAuth();
    const session = await auth.api.getSession({
      headers: new Headers(req.headers),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const db = await getDb();
    if (!db) return NextResponse.json({ error: "Subscription service is unavailable" }, { status: 503 });
    const sub = await db.select().from(subscriptions)
      .where(eq(subscriptions.userId, session.user.id)).get();
    const hasPaidAccess = Boolean(sub && sub.plan !== "free_trial" && ["active", "trialing"].includes(sub.status));
    const extendedQuestions = Boolean(sub?.extendedQuestions === 1 && ["active", "trialing", "granted"].includes(sub.addonStatus));

    return NextResponse.json({
      plan: sub?.plan ?? "free_trial",
      status: sub?.status ?? "inactive",
      hasPaidAccess,
      currentPeriodEnd: sub?.currentPeriodEnd?.toISOString() ?? null,
      cancelAtPeriodEnd: sub?.cancelAtPeriodEnd ?? false,
      extendedQuestions,
      addonAvailable: Boolean(process.env.STRIPE_PRICE_EXTENDED_QUESTIONS_MONTHLY?.startsWith("price_")),
      questionCount: extendedQuestions ? 10 : 5,
    });
  } catch (err) {
    console.error("Subscription status error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
