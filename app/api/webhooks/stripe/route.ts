// ── Stripe Webhook Handler ──
// Processes checkout completed, subscription updates/cancellations

import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/server";
import { getDb } from "@/lib/db";
import { subscriptions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "No signature header" },
        { status: 400 }
      );
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

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const userId = session.metadata?.user_id;
        const addon = session.metadata?.addon;

        if (!userId) break;

        // Handle Extended Questions add-on
        if (addon === "extended_questions") {
          if (db) {
            try {
              const existing = await db
                .select()
                .from(subscriptions)
                .where(eq(subscriptions.userId, userId))
                .get();

              if (existing) {
                await db
                  .update(subscriptions)
                  .set({ extendedQuestions: 1, updatedAt: new Date() })
                  .where(eq(subscriptions.userId, userId));
              } else {
                await db.insert(subscriptions).values({
                  id: crypto.randomUUID(),
                  userId,
                  plan: "free_trial",
                  status: "active",
                  extendedQuestions: 1,
                  stripeCustomerId: typeof session.customer === "string" ? session.customer : null,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                });
              }
              console.log(`✅ Extended Questions add-on activated for user ${userId}`);
            } catch (err) {
              console.error("Failed to set extended_questions:", err);
            }
          }
          break;
        }

        // Handle regular plan subscription
        const plan = session.metadata?.plan || "premium";
        if (db) {
          try {
            const existing = await db
              .select()
              .from(subscriptions)
              .where(eq(subscriptions.userId, userId))
              .get();

            const now = new Date();
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
          } catch (err) {
            console.error("Failed to upsert subscription in D1:", err);
          }
        }

        console.log(`✅ Subscription activated for user ${userId}: ${plan}`);
        break;
      }

      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        const stripeSubId = subscription.id;
        const status = subscription.status;

        // Check if this is the add-on subscription being cancelled
        const productId = subscription.items?.data?.[0]?.price?.product;
        if (typeof productId === "string" && db) {
          const addonPriceId = process.env.EXTENDED_QUESTIONS_PRICE_ID;
          if (addonPriceId) {
            try {
              const price = await stripe.prices.retrieve(addonPriceId);
              if (price.product === productId && status !== "active") {
                const sub = await db
                  .select()
                  .from(subscriptions)
                  .where(eq(subscriptions.stripeSubscriptionId, stripeSubId))
                  .get();
                if (sub) {
                  await db
                    .update(subscriptions)
                    .set({ extendedQuestions: 0, updatedAt: new Date() })
                    .where(eq(subscriptions.stripeSubscriptionId, stripeSubId));
                  console.log(`📦 Extended Questions add-on removed for user ${sub.userId}`);
                  break;
                }
              }
            } catch {}
          }
        }

        if (db) {
          try {
            await db
              .update(subscriptions)
              .set({
                status: status === "active" ? "active" : "canceled",
                updatedAt: new Date(),
              })
              .where(eq(subscriptions.stripeSubscriptionId, stripeSubId));
          } catch (err) {
            console.error("Failed to update subscription in D1:", err);
          }
        }

        console.log(`📦 Subscription ${stripeSubId} updated: ${status}`);
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
