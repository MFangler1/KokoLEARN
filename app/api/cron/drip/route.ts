// ── In-house lifecycle email runner ──
// Called on a schedule (OpenClaw cron → GET /api/cron/drip?key=...).
// Sends the day-1 / day-3 / day-7 follow-ups once each per member.
//
// Deliberately skips:
//   - unverified emails (protects deliverability against typo/fake addresses)
//   - anyone who unsubscribed
//   - anyone with an active paid plan
//   - staff/admin accounts

import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { users } from "@/lib/db/auth.schema";
import { subscriptions, emailSequence, emailOptouts } from "@/lib/db/schema";
import { sendEmail } from "@/lib/email/send";
import {
  trialEndedEmail,
  feedbackRequestEmail,
  anotherTrialEmail,
  verifyEmailTemplate,
  welcomeEmail,
  passwordResetEmail,
} from "@/lib/email/templates";
import { eq } from "drizzle-orm";
import { signEmail } from "@/lib/email/token";

const STAGES = [1, 3, 7] as const;
const DAY_MS = 86400000;

const BUILT_IN_ADMINS = ["mark.fenty+admin@gmail.com"];

function staffEmails(): string[] {
  const fromEnv = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return [
    ...new Set([
      ...BUILT_IN_ADMINS,
      ...fromEnv,
      "mark.fenty@gmail.com",
      "test-payment@kokolearn.org",
    ]),
  ];
}

function templateFor(stage: number) {
  if (stage === 1) return trialEndedEmail;
  if (stage === 3) return feedbackRequestEmail;
  return anotherTrialEmail;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const provided = req.headers.get("x-cron-secret") ?? url.searchParams.get("key") ?? "";
  const expected = process.env.CRON_SECRET ?? "";
  if (!expected) {
    return NextResponse.json({ ok: false, error: "CRON_SECRET not configured" }, { status: 500 });
  }
  if (provided !== expected) {
    return NextResponse.json({ ok: false, error: "unauthorised" }, { status: 401 });
  }

  const dryRun = url.searchParams.get("dry") === "1";

  // Preview mode: send one stage to a given address without touching any data.
  // Used to review copy before it goes out: /api/cron/drip?preview=1&stage=1&to=you@example.com
  const previewTo = url.searchParams.get("to");
  if (previewTo && url.searchParams.get("preview") === "1") {
    const stage = Number(url.searchParams.get("stage") ?? "1");
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kokolearn.org";
    const secret = process.env.BETTER_AUTH_SECRET ?? process.env.CRON_SECRET ?? "";
    const unsubscribeUrl = `${baseUrl}/api/email/unsubscribe?e=${encodeURIComponent(previewTo)}&t=${await signEmail(previewTo, secret)}`;

    // ?template=verify|welcome|password-reset  (omit for the lifecycle stages)
    const tpl = (url.searchParams.get("template") ?? "").toLowerCase();
    let content: { subject: string; html: string };
    if (tpl === "verify") {
      content = verifyEmailTemplate({ name: "Preview", url: `${baseUrl}/sign-in` });
    } else if (tpl === "welcome") {
      content = welcomeEmail({ name: "Preview" });
    } else if (tpl === "password-reset") {
      content = passwordResetEmail({ url: `${baseUrl}/sign-in` });
    } else {
      content = templateFor(stage)({ name: "Preview", unsubscribeUrl });
    }

    const ok = await sendEmail({ to: previewTo, ...content });
    return NextResponse.json({ ok, preview: true, template: tpl || `stage-${stage}`, to: previewTo, sent: ok });
  }

  const db = await getDb();
  if (!db) return NextResponse.json({ ok: false, error: "no database" }, { status: 500 });

  const now = Date.now();
  const stageDays = url.searchParams.get("stage");
  const onlyStage = stageDays ? Number(stageDays) : null;

  const allUsers = (await db.select().from(users)) as Array<{
    id: string;
    email: string;
    name?: string | null;
    emailVerified?: boolean;
    createdAt?: Date;
  }>;
  const subs = (await db.select().from(subscriptions)) as Array<{ userId?: string; plan?: string; status?: string }>;
  const sent = (await db.select().from(emailSequence)) as Array<{ userId?: string; stage?: number }>;
  const optouts = (await db.select().from(emailOptouts)) as Array<{ email?: string }>;

  const paid = new Set(
    subs
      .filter((s) => (s.status ?? "active") === "active" && (s.plan ?? "free_trial") !== "free_trial")
      .map((s) => s.userId)
  );
  const alreadySent = new Set(sent.map((s) => `${s.userId}:${s.stage}`));
  const optedOut = new Set(optouts.map((o) => (o.email ?? "").toLowerCase()));
  const staff = new Set(staffEmails());
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kokolearn.org";
  const secret = process.env.BETTER_AUTH_SECRET ?? process.env.CRON_SECRET ?? "";

  const results: Array<Record<string, unknown>> = [];

  for (const user of allUsers) {
    const email = (user.email ?? "").toLowerCase();
    if (!email || staff.has(email)) continue;
    if (!user.emailVerified) continue; // only real, confirmed addresses
    if (optedOut.has(email)) continue;
    if (paid.has(user.id)) continue;

    const created = user.createdAt ? new Date(user.createdAt).getTime() : now;
    const ageDays = (now - created) / DAY_MS;

    for (const stage of STAGES) {
      if (onlyStage !== null && onlyStage !== stage) continue;
      if (ageDays < stage) continue;
      if (alreadySent.has(`${user.id}:${stage}`)) continue;

      const unsubscribeUrl = `${baseUrl}/api/email/unsubscribe?e=${encodeURIComponent(email)}&t=${await signEmail(email, secret)}`;
      const content = templateFor(stage)({ name: user.name ?? undefined, unsubscribeUrl });

      if (dryRun) {
        results.push({ email, stage, dryRun: true });
        break;
      }

      const ok = await sendEmail({ to: user.email, ...content });
      if (ok) {
        await db.insert(emailSequence).values({
          userId: user.id,
          email,
          stage,
          sentAt: now,
        });
        results.push({ email, stage, sent: true });
      } else {
        results.push({ email, stage, sent: false });
      }
      break; // one email per member per run
    }
  }

  return NextResponse.json({ ok: true, checked: allUsers.length, sent: results.length, results });
}
