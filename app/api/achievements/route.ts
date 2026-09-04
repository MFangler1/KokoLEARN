// ── Achievements API ──
// Returns user's earned achievements and available ones

import { NextResponse } from "next/server";
import { initAuth } from "@/lib/auth/server";
import { getDb } from "@/lib/db";
import { achievements } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { ACHIEVEMENTS } from "@/lib/achievements";

type EarnedAchievement = {
  type: string;
  label: string;
  description: string;
  icon: string;
  earnedAt: Date;
};

export async function GET(req: Request) {
  try {
    const auth = await initAuth();
    const session = await auth.api.getSession({ headers: new Headers(req.headers) });
    if (!session?.user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const db = await getDb();
    let earned: EarnedAchievement[] = [];
    if (db) {
      earned = await db
        .select()
        .from(achievements)
        .where(eq(achievements.userId, session.user.id))
        .all();
    }

    return NextResponse.json({
      earned: earned.map((a) => ({
        type: a.type,
        label: a.label,
        description: a.description,
        icon: a.icon || "⭐",
        earnedAt: a.earnedAt,
      })),
      available: Object.entries(ACHIEVEMENTS).map(([type, def]) => ({
        type,
        ...def,
        earned: earned.some((a) => a.type === type),
      })),
    });
  } catch (err) {
    console.error("Achievements error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
