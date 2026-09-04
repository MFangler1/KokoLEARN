import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe, isExpectedLivemode, isPlan } from "@/lib/stripe/server";
import { getDb } from "@/lib/db";
import { subscriptions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const ACCESS_STATUSES = new Set<Stripe.Subscription.Status>(["active", "trialing"]);

function periodEnd(subscription: Stripe.Subscription): Date | null {
  const timestamp = subscription.items.data[0]?.current_period_end;
  return timestamp ? new Date(timestamp * 1000) : null;
}

async function syncPlanSubscription(
  db: NonNullable<Awaited<ReturnType<typeof getDb>>>,
  subscription: Stripe.Subscription,
  fallbackUserId?: string,
  fallbackPlan?: string
) {
  const userId = subscription.metadata.user_id || fallbackUserId;
  const plan = subscription.metadata.plan || fallbackPlan;
  if (!userId || !isPlan(plan)) throw new Error("Subscription is missing valid user or plan metadata");

  const existing = await db.select().from(subscriptions).where(eq(subscriptions.userId, userId)).get();
  const values = {
    plan,
    status: subscription.status,
    stripeSubscriptionId: subscription.id,
    stripePriceId: subscription.items.data[0]?.price.id ?? null,
    stripeCustomerId: typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id,
    currentPeriodEnd: periodEnd(subscription),
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
    updatedAt: new Date(),
  };
  if (existing) {
    await db.update(subscriptions).set(values).where(eq(subscriptions.userId, userId));
  } else {
    await db.insert(subscriptions).values({ id: crypto.randomUUID(), userId, createdAt: new Date(), ...values });
  }
}

async function syncAddonSubscription(
  db: NonNullable<Awaited<ReturnType<typeof getDb>>>,
  subscription: Stripe.Subscription,
  fallbackUserId?: string
) {
  const userId = subscription.metadata.user_id || fallbackUserId;
  if (!userId) throw new Error("Add-on subscription is missing user metadata");
  const existing = await db.select().from(subscriptions).where(eq(subscriptions.userId, userId)).get();
  if (!existing) throw new Error("Add-on subscription has no parent plan record");
  const enabled = ACCESS_STATUSES.has(subscription.status);
  await db.update(subscriptions).set({
    extendedQuestions: enabled ? 1 : 0,
    stripeAddonSubscriptionId: subscription.id,
    addonStatus: subscription.status,
    updatedAt: new Date(),
  }).where(eq(subscriptions.userId, userId));
}

export async function POST(req: Request) {
  try {
    const signature = req.headers.get("stripe-signature");
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!signature) return NextResponse.json({ error: "No signature header" }, { status: 400 });
    if (!webhookSecret) return NextResponse.json({ error: "Webhook secret not configured" }, { status: 503 });

    const stripe = getStripe();
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(await req.text(), signature, webhookSecret);
    } catch (error) {
      console.error("Stripe webhook signature verification failed", error);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }
    if (!isExpectedLivemode(event.livemode)) {
      return NextResponse.json({ error: "Webhook mode does not match STRIPE_MODE" }, { status: 400 });
    }

    const db = await getDb();
    if (!db) throw new Error("Billing database is unavailable");

    if (event.type === "checkout.session.completed") {
      const checkout = event.data.object;
      if (typeof checkout.subscription !== "string") throw new Error("Checkout has no subscription ID");
      const subscription = await stripe.subscriptions.retrieve(checkout.subscription);
      if (checkout.metadata?.addon === "extended_questions") {
        await syncAddonSubscription(db, subscription, checkout.metadata.user_id);
      } else {
        await syncPlanSubscription(db, subscription, checkout.metadata?.user_id, checkout.metadata?.plan);
      }
    }

    if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.deleted") {
      const subscription = event.data.object;
      const existingAddon = await db.select().from(subscriptions)
        .where(eq(subscriptions.stripeAddonSubscriptionId, subscription.id)).get();
      if (subscription.metadata.addon === "extended_questions" || existingAddon) {
        await syncAddonSubscription(db, subscription, existingAddon?.userId);
      } else {
        const existingPlan = await db.select().from(subscriptions)
          .where(eq(subscriptions.stripeSubscriptionId, subscription.id)).get();
        await syncPlanSubscription(db, subscription, existingPlan?.userId, existingPlan?.plan);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook processing failed", error);
    // A non-2xx response makes Stripe retry instead of silently losing billing state.
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
