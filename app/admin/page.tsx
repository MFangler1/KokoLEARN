// ── Admin area ──
// Access: only email addresses on the admin allowlist (ADMIN_EMAILS secret,
// plus the built-in KokoLearn admin address). Everyone else sees a polite
// access-restricted page. Data shown is read-only and safe for demos.

import Link from "next/link";
import { headers } from "next/headers";
import { initAuth } from "@/lib/auth/server";
import { getDb } from "@/lib/db";
import { users, sessions } from "@/lib/db/auth.schema";
import { subscriptions } from "@/lib/db/schema";
import { getSupabase } from "@/lib/supabase/server";
import { desc } from "drizzle-orm";

const BUILT_IN_ADMINS = ["mark.fenty+admin@gmail.com"];

function adminEmails(): string[] {
  const fromEnv = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  // De-duplicate: an address may appear in both the built-in list and ADMIN_EMAILS.
  return [...new Set([...BUILT_IN_ADMINS.map((e) => e.trim().toLowerCase()), ...fromEnv])];
}

async function getAdminSession() {
  try {
    const auth = await initAuth();
    const session = await auth.api.getSession({ headers: await headers() });
    return session?.user ?? null;
  } catch {
    return null;
  }
}

async function countRows(table: "users" | "subscriptions") {
  try {
    const db = await getDb();
    if (!db) return null;
    const rows = table === "users" ? await db.select().from(users) : await db.select().from(subscriptions);
    return rows.length;
  } catch {
    return null;
  }
}

async function listUsers() {
  try {
    const db = await getDb();
    if (!db) return [];
    const rows = await db.select().from(users).orderBy(desc(users.createdAt)).limit(50);
    return rows as Array<{
      id?: string;
      email?: string;
      name?: string;
      emailVerified?: boolean;
      createdAt?: Date;
    }>;
  } catch {
    return [];
  }
}

// Sign-in records, so staff can see where a new account came from.
async function listSessions() {
  try {
    const db = await getDb();
    if (!db) return [];
    const rows = await db.select().from(sessions).orderBy(desc(sessions.createdAt)).limit(500);
    return rows as Array<{
      userId?: string;
      ipAddress?: string | null;
      city?: string | null;
      country?: string | null;
      createdAt?: Date;
    }>;
  } catch {
    return [];
  }
}

async function listSubs() {
  try {
    const db = await getDb();
    if (!db) return [];
    const rows = await db.select().from(subscriptions).limit(50);
    return rows as Array<{ userId?: string; plan?: string; status?: string }>;
  } catch {
    return [];
  }
}

async function supabaseCount(table: "children" | "lessons") {
  try {
    const supabase = getSupabase();
    if (!supabase) return null;
    const { count } = await supabase.from(table).select("id", { count: "exact", head: true });
    return count ?? 0;
  } catch {
    return null;
  }
}

export default async function AdminPage() {
  const user = await getAdminSession();

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-2xl">🔐</div>
          <h1 className="mt-4 text-2xl font-bold text-gray-900">Admin area</h1>
          <p className="mt-2 text-sm text-gray-600">Please sign in with your admin account to continue.</p>
          <Link
            href="/sign-in?redirect=/admin"
            className="mt-6 inline-block rounded-xl bg-gradient-to-r from-primary to-secondary px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:shadow-md transition-all"
          >
            Staff sign in
          </Link>
        </div>
      </div>
    );
  }

  const email = (user.email ?? "").toLowerCase();
  const allowed = adminEmails().includes(email);

  if (!allowed) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-2xl">⛔</div>
          <h1 className="mt-4 text-2xl font-bold text-gray-900">Access restricted</h1>
          <p className="mt-2 text-sm text-gray-600">
            This area is for KokoLearn staff. You are signed in as <span className="font-semibold">{email}</span>.
          </p>
          <p className="mt-2 text-xs text-gray-500">Ask Mark to add this address to the admin list.</p>
          <Link href="/dashboard" className="mt-6 inline-block rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:border-primary/30 hover:text-primary transition-all">
            Go to my dashboard
          </Link>
        </div>
      </div>
    );
  }

  const [userCount, subCount, childrenCount, lessonCount, userList, subList, sessionList] = await Promise.all([
    countRows("users"),
    countRows("subscriptions"),
    supabaseCount("children"),
    supabaseCount("lessons"),
    listUsers(),
    listSubs(),
    listSessions(),
  ]);

  // Most recent sign-in per account, for the monitoring list below.
  const lastSession = new Map<string, { city?: string | null; country?: string | null; ipAddress?: string | null }>();
  for (const s of sessionList) {
    if (s.userId && !lastSession.has(s.userId)) lastSession.set(s.userId, s);
  }

  // Anyone with an active non-trial plan is a paying customer; everyone else is on the free trial.
  const paidSubs = subList.filter(
    (s) => (s.status ?? "active") === "active" && (s.plan ?? "free_trial") !== "free_trial"
  ).length;
  const freeTrialCount = Math.max(0, (userCount ?? 0) - paidSubs);

  const stats = [
    { label: "Registered accounts", value: userCount ?? "-" },
    { label: "Free trials", value: freeTrialCount },
    { label: "Paying customers", value: paidSubs },
    { label: "Subscriptions", value: subCount ?? "-" },
    { label: "Children", value: childrenCount ?? "-" },
    { label: "Lessons created", value: lessonCount ?? "-" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">KokoLearn admin</h1>
            <p className="text-sm text-gray-600">
              Signed in as <span className="font-medium">{email}</span> - full access for demos and management.
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/dashboard" className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:border-primary/30 hover:text-primary transition-all">
              Customer dashboard
            </Link>
            <Link href="/testimonials/review" className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:border-primary/30 hover:text-primary transition-all">
              Testimonials review
            </Link>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="text-3xl font-bold text-primary">{s.value}</div>
              <div className="mt-1 text-xs font-medium text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-bold text-gray-900">Accounts to review</h2>
            <p className="mt-1 text-xs text-gray-500">
              Newest first, with sign-up date, last sign-in location and whether the email is verified.
            </p>
            {userList.length === 0 ? (
              <p className="mt-2 text-xs text-gray-500">No accounts yet.</p>
            ) : (
              <ul className="mt-3 divide-y divide-gray-100">
                {userList.slice(0, 20).map((u, i) => {
                  const s = u.id ? lastSession.get(u.id) : undefined;
                  const where = s?.city
                    ? `${s.city}, ${s.country ?? ""}`.trim().replace(/,$/, "")
                    : s?.country ?? null;
                  const when = u.createdAt
                    ? new Date(u.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
                    : null;
                  return (
                    <li key={i} className="flex items-start justify-between gap-3 py-2 text-xs">
                      <span className="min-w-0">
                        <span className="block truncate font-medium text-gray-800">{u.email ?? "(no email)"}</span>
                        <span className="block truncate text-gray-400">
                          {[u.name, when ? `joined ${when}` : null, where, s?.ipAddress].filter(Boolean).join(" · ")}
                        </span>
                      </span>
                      <span
                        className={
                          u.emailVerified
                            ? "shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 font-medium text-emerald-700"
                            : "shrink-0 rounded-full bg-amber-50 px-2 py-0.5 font-medium text-amber-700"
                        }
                      >
                        {u.emailVerified ? "verified" : "unverified"}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-bold text-gray-900">Recent subscriptions</h2>
            {subList.length === 0 ? (
              <p className="mt-2 text-xs text-gray-500">No subscriptions yet (all accounts on free trial).</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {subList.slice(0, 12).map((s, i) => (
                  <li key={i} className="flex items-center justify-between gap-3 text-xs">
                    <span className="truncate text-gray-700">{s.userId ?? "(user)"}</span>
                    <span className="text-gray-500">
                      {s.plan ?? "-"} · {s.status ?? "-"}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-bold text-gray-900">Admin access list</h2>
          <p className="mt-1 text-xs text-gray-500">
            Staff added to the admin list get full demo access. Current list:
          </p>
          <ul className="mt-2 space-y-1">
            {adminEmails().map((e) => (
              <li key={e} className="text-xs text-gray-700">{e}</li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-gray-400">
            To add a tester, set the ADMIN_EMAILS setting (comma-separated) - ask Claw to do it.
          </p>
        </div>
      </div>
    </div>
  );
}
