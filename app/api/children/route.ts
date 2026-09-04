import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { initAuth } from "@/lib/auth/server";
import { children, subscriptions } from "@/lib/db/schema";
import { getDb } from "@/lib/db";
import { hasTrustedOrigin } from "@/lib/security/origin";
import { parseChildAge, parseChildName, parseInterests } from "@/lib/validation/child";

async function currentUser(req: Request) {
  const auth = await initAuth();
  return (await auth.api.getSession({ headers: new Headers(req.headers) }))?.user;
}

export async function GET(req: Request) {
  try {
    const user = await currentUser(req);
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    const db = await getDb();
    if (!db) return NextResponse.json({ error: "Profile service is unavailable" }, { status: 503 });
    const rows = await db.select().from(children).where(eq(children.userId, user.id)).all();
    return NextResponse.json({
      children: rows.map((child) => ({ ...child, interests: JSON.parse(child.interests) as string[] })),
    });
  } catch (error) {
    console.error("Child profile lookup failed", error);
    return NextResponse.json({ error: "Unable to load child profiles" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    if (!hasTrustedOrigin(req)) return NextResponse.json({ error: "Invalid request origin" }, { status: 403 });
    const user = await currentUser(req);
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    const body = await req.json();
    const name = parseChildName(body.name);
    const age = parseChildAge(body.age);
    const interests = parseInterests(body.interests);
    if (!name || age === null || !interests) {
      return NextResponse.json({ error: "Invalid child profile" }, { status: 400 });
    }

    const db = await getDb();
    if (!db) return NextResponse.json({ error: "Profile service is unavailable" }, { status: 503 });
    const existing = await db.select().from(children).where(eq(children.userId, user.id)).all();
    const subscription = await db.select().from(subscriptions).where(eq(subscriptions.userId, user.id)).get();
    const familyAccess = subscription?.plan === "family" && ["active", "trialing"].includes(subscription.status);
    if (existing.length >= (familyAccess ? 4 : 1)) {
      return NextResponse.json({ error: "Your plan's child profile limit has been reached" }, { status: 409 });
    }

    const duplicate = await db.select().from(children)
      .where(and(eq(children.userId, user.id), eq(children.name, name))).get();
    if (duplicate) return NextResponse.json({ error: "A child profile with this name already exists" }, { status: 409 });

    const child = { id: crypto.randomUUID(), userId: user.id, name, age, interests: JSON.stringify(interests), createdAt: new Date(), updatedAt: new Date() };
    await db.insert(children).values(child);
    return NextResponse.json({ child: { ...child, interests } }, { status: 201 });
  } catch (error) {
    console.error("Child profile creation failed", error);
    return NextResponse.json({ error: "Unable to create child profile" }, { status: 500 });
  }
}
