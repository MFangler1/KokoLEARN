// ── Stripe Webhook Handler ──
// Processes checkout completed, subscription updates/cancellations

import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe/server";
import { getDb } from "@/lib/db";
import { subscriptions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

/**
 * Map a Stripe subscription status to the app's stored status.
 * Only clearly-ended states cancel access; trialing stays active,
 * and past_due/unpaid/paused keep whatever access they had while
 * Stripe keeps trying to collect (they are NOT treated as canceled).
 */
function mapSubscriptionStatus(status: string, current: string | null): string {
  if (status === "active" || status === "trialing") return "active";
  if (status === "past_due" || status === "unpaid" || status === "paused") {
    // Still in the collection window: preserve current access, don't cancel.
    return current && current !== "canceled" ? current : "active";
  }
  // canceled, incomplete, incomplete_expired, etc.
  return "canceled";
}

export async function POST(req: Request) {
  let stripe;
  try {
    stripe = getStripe();
  } catch {
    return NextResponse.json(
      { error: "Stripe not configured" },
      { status: 500 }
    );
  }

  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json({ error: "No signature header" }, { status: 400 });
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      return NextResponse.json(
        { error: "Webhook secret not configured" },
        { status: 500 }
      );
    }

    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Signature verification failed";
      console.error("Webhook signature verification failed:", message);
      return NextResponse.json({ error: message }, { status: 400 });
    }

    const db = await getDb();

    // Entitlement events MUST fail closed: if we cannot persist the grant,
    // tell Stripe to retry rather than silently swallowing a paid signup.
    switch (event.type) {
      case "checkout.session.completed": {
        if (!db) {
          console.error("Webhook: D1 database unavailable — cannot grant access");
          return NextResponse.json(
            { error: "Database unavailable" },
            { status: 500 }
          );
        }

        const session = event.data.object;
        const userId = session.metadata?.user_id;
        if (!userId) {
          return NextResponse.json({ received: true });
        }
        const addon = session.metadata?.addon;
        const now = new Date();

        try {
          const existing = await db
            .select()
            .from(subscriptions)
            .where(eq(subscriptions.userId, userId))
            .get();

          if (addon === "extended_questions") {
            if (existing) {
              await db
                .update(subscriptions)
                .set({ extendedQuestions: 1, updatedAt: now })
                .where(eq(subscriptions.userId, userId));
            } else {
              await db.insert(subscriptions).values({
                id: crypto.randomUUID(),
                userId,
                plan: "free_trial",
                status: "active",
                extendedQuestions: 1,
                stripeCustomerId:
                  typeof session.customer === "string" ? session.customer : null,
                createdAt: now,
                updatedAt: now,
              });
            }
            console.log(`✅ Extended Questions add-on activated for user ${userId}`);
          } else {
            const plan = session.metadata?.plan || "premium";
            if (existing) {
              await db
                .update(subscriptions)
                .set({
                  plan,
                  status: "active",
                  stripeSubscriptionId:
                    typeof session.subscription === "string"
                      ? session.subscription
                      : existing.stripeSubscriptionId,
                  stripeCustomerId:
                    typeof session.customer === "string"
                      ? session.customer
                      : existing.stripeCustomerId,
                  updatedAt: now,
                })
                .where(eq(subscriptions.userId, userId));
            } else {
              await db.insert(subscriptions).values({
                id: crypto.randomUUID(),
                userId,
                plan,
                status: "active",
                stripeSubscriptionId:
                  typeof session.subscription === "string"
                    ? session.subscription
                    : null,
                stripeCustomerId:
                  typeof session.customer === "string"
                    ? session.customer
                    : null,
                createdAt: now,
                updatedAt: now,
              });
            }
            console.log(`✅ Subscription activated for user ${userId}: ${plan}`);
          }
        } catch (err) {
          console.error("Webhook: failed to persist grant for user", userId, err);
          return NextResponse.json(
            { error: "Failed to persist grant" },
            { status: 500 }
          );
        }
        break;
      }

      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        if (!db) {
          console.error("Webhook: D1 database unavailable — cannot update status");
          return NextResponse.json(
            { error: "Database unavailable" },
            { status: 500 }
          );
        }

        const subscription = event.data.object;
        const stripeSubId = subscription.id;

        // Add-on (Extended Questions) subscription cancelled?
        const productId = subscription.items?.data?.[0]?.price?.product;
        const addonPriceId = process.env.EXTENDED_QUESTIONS_PRICE_ID;
        if (typeof productId === "string" && addonPriceId) {
          try {
            const price = await stripe.prices.retrieve(addonPriceId);
            if (price.product === productId) {
              const sub = await db
                .select()
                .from(subscriptions)
                .where(eq(subscriptions.stripeSubscriptionId, stripeSubId))
                .get();
              if (sub) {
                const active = ["active", "trialing", "past_due", "unpaid"].includes(
                  subscription.status
                );
                await db
                  .update(subscriptions)
                  .set({
                    extendedQuestions: active ? 1 : 0,
                    updatedAt: new Date(),
                  })
                  .where(eq(subscriptions.stripeSubscriptionId, stripeSubId));
                console.log(
                  `📦 Extended Questions add-on ${active ? "kept" : "removed"} for user ${sub.userId}`
                );
                return NextResponse.json({ received: true });
              }
            }
          } catch (err) {
            // Price lookup failure: retry rather than guessing wrong.
            console.error("Webhook: add-on product check failed", err);
            return NextResponse.json({ error: "Add-on check failed" }, { status: 500 });
          }
        }

        try {
          const sub = await db
            .select()
            .from(subscriptions)
            .where(eq(subscriptions.stripeSubscriptionId, stripeSubId))
            .get();

          const nextStatus = mapSubscriptionStatus(
            subscription.status,
            sub?.status ?? null
          );
          await db
            .update(subscriptions)
            .set({ status: nextStatus, updatedAt: new Date() })
            .where(eq(subscriptions.stripeSubscriptionId, stripeSubId));

          console.log(`📦 Subscription ${stripeSubId} updated: ${subscription.status} -> ${nextStatus}`);
        } catch (err) {
          console.error("Webhook: failed to update subscription", err);
          return NextResponse.json(
            { error: "Failed to update subscription" },
            { status: 500 }
          );
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Stripe webhook error:", err);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
