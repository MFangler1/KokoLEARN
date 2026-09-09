// ── Subscription Status API ──
// Returns the user's subscription status and add-on flags

import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { subscriptions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { initAuth } from "@/lib/auth/server";
import { getTrialUsage } from "@/lib/trial";

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
    let extendedQuestions = false;

    if (db) {
      try {
        const sub = await db
          .select()
          .from(subscriptions)
          .where(eq(subscriptions.userId, session.user.id))
          .get();

        if (sub) {
          extendedQuestions = sub.extendedQuestions === 1;
        }
      } catch (err) {
        console.error("Failed to fetch subscription:", err);
      }
    }

    const trialUsage = await getTrialUsage(session.user.id);

    return NextResponse.json({
      extendedQuestions,
      questionCount: extendedQuestions ? 10 : 5,
      isPremium: trialUsage.isPremium,
      lessonsUsed: trialUsage.lessonsUsed,
      lessonLimit: trialUsage.lessonLimit,
      lessonsRemaining: trialUsage.lessonsRemaining,
      limitReached: trialUsage.limitReached,
    });
  } catch (err) {
    console.error("Subscription status error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
