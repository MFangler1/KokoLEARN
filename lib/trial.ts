// ── Free Trial Limits ──
// Free accounts may create a fixed number of lessons in total, account-wide.
// The count is keyed on the authenticated user id, so it cannot be reset by
// switching browser or clearing local storage.

import { getDb } from "@/lib/db";
import { subscriptions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getSupabase } from "@/lib/supabase/server";

export const FREE_TRIAL_LESSON_LIMIT = 2;

export type TrialUsage = {
  isPremium: boolean;
  lessonsUsed: number;
  /** null means unlimited (paid, active subscription) */
  lessonLimit: number | null;
  lessonsRemaining: number | null;
  limitReached: boolean;
};

/**
 * True when the account has a paid subscription that is currently active.
 * A `free_trial` plan row never counts as paid, whatever its status.
 */
export async function hasActiveSubscription(userId: string): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    const sub = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId))
      .get();

    if (!sub) return false;
    return sub.status === "active" && sub.plan !== "free_trial";
  } catch (err) {
    console.error("Failed to check subscription for trial cap:", err);
    return false;
  }
}

/**
 * Total lessons this account has created. Returns null when the count could
 * not be read, so callers can fail open rather than block a paying customer.
 */
export async function countLessonsCreated(userId: string): Promise<number | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  try {
    const { count, error } = await supabase
      .from("lessons")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId);

    if (error) {
      console.error("Failed to count lessons for trial cap:", error);
      return null;
    }

    return typeof count === "number" ? count : null;
  } catch (err) {
    console.error("Failed to count lessons for trial cap:", err);
    return null;
  }
}

/**
 * Trial usage for a user. Premium accounts are never capped; free accounts are
 * capped at FREE_TRIAL_LESSON_LIMIT lessons in total. Fails open — if the
 * lesson count is unreadable, `limitReached` stays false.
 */
export async function getTrialUsage(userId: string): Promise<TrialUsage> {
  const isPremium = await hasActiveSubscription(userId);

  if (isPremium) {
    return {
      isPremium: true,
      lessonsUsed: 0,
      lessonLimit: null,
      lessonsRemaining: null,
      limitReached: false,
    };
  }

  const count = await countLessonsCreated(userId);
  const lessonsUsed = count ?? 0;

  return {
    isPremium: false,
    lessonsUsed,
    lessonLimit: FREE_TRIAL_LESSON_LIMIT,
    lessonsRemaining: Math.max(0, FREE_TRIAL_LESSON_LIMIT - lessonsUsed),
    limitReached: count !== null && lessonsUsed >= FREE_TRIAL_LESSON_LIMIT,
  };
}
