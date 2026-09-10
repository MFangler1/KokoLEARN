import * as authSchema from "./auth.schema";

// Custom application schemas go here
import { sqliteTable, text, integer, primaryKey } from "drizzle-orm/sqlite-core";

// Example: Custom user profile extensions
export const profiles = sqliteTable("profiles", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().unique(),
  fullName: text("full_name"),
  avatarUrl: text("avatar_url"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

// Application schemas
export const subscriptions = sqliteTable("subscriptions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  stripeSubscriptionId: text("stripe_subscription_id"),
  stripeCustomerId: text("stripe_customer_id"),
  plan: text("plan").notNull().default("free_trial"),
  status: text("status").notNull().default("active"),
  currentPeriodEnd: integer("current_period_end", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  extendedQuestions: integer("extended_questions").default(0),
});

// ── Achievements ──
export const achievements = sqliteTable("achievements", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  type: text("type").notNull(),
  label: text("label").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull().default("⭐"),
  earnedAt: integer("earned_at", { mode: "timestamp" }).notNull(),
});

// ── Referrals ──
export const referrals = sqliteTable("referrals", {
  id: text("id").primaryKey(),
  referrerUserId: text("referrer_user_id").notNull(),
  referredEmail: text("referred_email").notNull(),
  referredUserId: text("referred_user_id"),
  referralCode: text("referral_code").notNull().unique(),
  status: text("status").notNull().default("sent"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  rewardedAt: integer("rewarded_at", { mode: "timestamp" }),
});

// ── Professional Report add-on (per child) ──
export const reportAddons = sqliteTable("report_addons", {
  userId: text("user_id").notNull(),
  childId: text("child_id").notNull(),
  stripeSubscriptionId: text("stripe_subscription_id"),
  status: text("status").notNull().default("active"),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

// ── Seen questions (per child + subject) so lessons don't repeat ──
export const seenQuestions = sqliteTable(
  "seen_questions",
  {
    userId: text("user_id").notNull(),
    childId: text("child_id").notNull(),
    subject: text("subject").notNull(),
    questionKey: text("question_key").notNull(),
    sample: text("sample"),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.childId, t.subject, t.questionKey] })]
);

// Combine all schemas for exports
export const schema = {
  reportAddons,
  seenQuestions,
  ...authSchema,
  subscriptions,
  achievements,
  referrals,
} as const;

