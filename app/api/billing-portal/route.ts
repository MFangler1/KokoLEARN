import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { initAuth } from "@/lib/auth/server";
import { getDb } from "@/lib/db";
import { subscriptions } from "@/lib/db/schema";
import { hasTrustedOrigin } from "@/lib/security/origin";
import { getSiteUrl, getStripe } from "@/lib/stripe/server";

export async function POST(req: Request) {
  try {
    if (!hasTrustedOrigin(req)) return NextResponse.json({ error: "Invalid request origin" }, { status: 403 });
    const auth = await initAuth();
    const session = await auth.api.getSession({ headers: new Headers(req.headers) });
    if (!session?.user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const db = await getDb();
    if (!db) return NextResponse.json({ error: "Billing service is unavailable" }, { status: 503 });
    const subscription = await db.select().from(subscriptions)
      .where(eq(subscriptions.userId, session.user.id)).get();
    if (!subscription?.stripeCustomerId) {
      return NextResponse.json({ error: "No billing account exists" }, { status: 404 });
    }

    const siteUrl = getSiteUrl();
    const portal = await getStripe().billingPortal.sessions.create({
      customer: subscription.stripeCustomerId,
      return_url: `${siteUrl}/dashboard`,
    });
    return NextResponse.json({ url: portal.url });
  } catch (error) {
    console.error("Billing portal error", error);
    return NextResponse.json({ error: "Unable to open billing management" }, { status: 500 });
  }
}
