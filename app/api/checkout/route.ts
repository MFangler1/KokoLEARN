import { NextResponse } from "next/server";
import {
  EXPECTED_ADDON_PRICE,
  expectedPlanPrice,
  getAddonPriceId,
  getPlanPriceId,
  getSiteUrl,
  getStripe,
  isBillingInterval,
  isPlan,
  verifyRecurringPrice,
} from "@/lib/stripe/server";
import { initAuth } from "@/lib/auth/server";
import { getDb } from "@/lib/db";
import { subscriptions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { hasTrustedOrigin } from "@/lib/security/origin";

export async function POST(req: Request) {
  try {
    if (!hasTrustedOrigin(req)) {
      return NextResponse.json({ error: "Invalid request origin" }, { status: 403 });
    }
    const auth = await initAuth();
    const session = await auth.api.getSession({
      headers: new Headers(req.headers),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await req.json();
    const { plan, interval, addon } = body;
    const db = await getDb();
    if (!db) return NextResponse.json({ error: "Billing service is unavailable" }, { status: 503 });
    const existing = await db.select().from(subscriptions)
      .where(eq(subscriptions.userId, session.user.id)).get();
    const stripe = getStripe();
    const siteUrl = getSiteUrl();

    // If purchasing add-on only
    if (addon === "extended_questions") {
      if (!existing || !["active", "trialing"].includes(existing.status)) {
        return NextResponse.json({ error: "An active paid plan is required for this add-on" }, { status: 409 });
      }
      if (existing.addonStatus === "active" || existing.addonStatus === "trialing") {
        return NextResponse.json({ error: "The add-on is already active" }, { status: 409 });
      }
      const priceId = getAddonPriceId();
      await verifyRecurringPrice(stripe, priceId, EXPECTED_ADDON_PRICE);

      const checkout = await stripe.checkout.sessions.create({
        mode: "subscription",
        payment_method_types: ["card"],
        line_items: [{ price: priceId, quantity: 1 }],
        metadata: {
          user_id: session.user.id,
          addon: "extended_questions",
        },
        subscription_data: {
          metadata: { user_id: session.user.id, addon: "extended_questions" },
        },
        customer: existing.stripeCustomerId || undefined,
        success_url: `${siteUrl}/dashboard?upgraded=1`,
        cancel_url: `${siteUrl}/dashboard`,
      });

      return NextResponse.json({ url: checkout.url });
    }

    if (!isPlan(plan) || !isBillingInterval(interval)) {
      return NextResponse.json(
        { error: "Missing plan or interval" },
        { status: 400 }
      );
    }

    if (existing && ["active", "trialing", "past_due"].includes(existing.status)) {
      return NextResponse.json({ error: "Use Manage Billing to change an existing subscription" }, { status: 409 });
    }
    const priceId = getPlanPriceId(plan, interval);
    await verifyRecurringPrice(stripe, priceId, expectedPlanPrice(plan, interval));

    const stripeSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      customer: existing?.stripeCustomerId || undefined,
      customer_email: existing?.stripeCustomerId ? undefined : session.user.email,
      client_reference_id: session.user.id,
      metadata: {
        user_id: session.user.id,
        plan,
      },
      subscription_data: {
        metadata: { user_id: session.user.id, plan },
      },
      success_url: `${siteUrl}/dashboard?checkout=success`,
      cancel_url: `${siteUrl}/pricing`,
    });

    return NextResponse.json({ url: stripeSession.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
