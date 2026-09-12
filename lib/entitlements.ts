// ── Entitlements ──
// Central place to answer "what is this account allowed to do?".
// Subscriptions and add-ons live in D1; the admin allowlist is env-driven.

import { getDb } from "@/lib/db";
import { subscriptions, reportAddons } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

const BUILT_IN_ADMINS = ["mark.fenty+admin@gmail.com"];

export function adminEmails(): string[] {
  const fromEnv = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  // De-duplicate: an address may appear in both the built-in list and ADMIN_EMAILS.
  return [...new Set([...BUILT_IN_ADMINS.map((e) => e.trim().toLowerCase()), ...fromEnv])];
}

export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  return adminEmails().includes(email.toLowerCase());
}

/** Active paid subscription (any plan other than the free trial). */
export async function hasPremium(userId: string): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  try {
    const sub = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId))
      .get();
    if (!sub) return false;
    const active = ["active", "trialing", "past_due"].includes(sub.status);
    return active && sub.plan !== "free_trial";
  } catch (err) {
    console.error("entitlements: hasPremium failed", err);
    return false;
  }
}

/** Active Professional Report add-on for a specific child. */
export async function hasReportAddon(userId: string, childId: string): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  try {
    const row = await db
      .select()
      .from(reportAddons)
      .where(and(eq(reportAddons.userId, userId), eq(reportAddons.childId, childId)))
      .get();
    return !!row && row.status === "active";
  } catch (err) {
    console.error("entitlements: hasReportAddon failed", err);
    return false;
  }
}

/** Premium OR admin. Used for tutor chat and similar paid features. */
export async function canUsePremiumFeatures(userId: string, email?: string | null): Promise<boolean> {
  if (isAdminEmail(email)) return true;
  return hasPremium(userId);
}

/** Report generation: admin, premium, or the £3/month report add-on for that child. */
export async function canGenerateReport(
  userId: string,
  email: string | null | undefined,
  childId: string | null | undefined
): Promise<{ allowed: boolean; reason: "admin" | "premium" | "addon" | "none" }> {
  if (isAdminEmail(email)) return { allowed: true, reason: "admin" };
  if (await hasPremium(userId)) return { allowed: true, reason: "premium" };
  if (childId && (await hasReportAddon(userId, childId))) return { allowed: true, reason: "addon" };
  return { allowed: false, reason: "none" };
}
