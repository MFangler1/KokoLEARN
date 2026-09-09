import { NextResponse } from "next/server";
import { PRICE_IDS } from "@/lib/stripe/server";
import { getStripe } from "@/lib/stripe/server";
import type { PlanType, BillingInterval } from "@/lib/stripe/server";
import { initAuth } from "@/lib/auth/server";

export async function POST(req: Request) {
  try {
    const stripe = getStripe();
    const auth = await initAuth();
    const session = await auth.api.getSession({
      headers: new Headers(req.headers),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await req.json();
    const { plan, interval, addon }: { plan: PlanType; interval: BillingInterval; addon?: string } =
      body;

    // If purchasing add-on only
    if (addon === "extended_questions") {
      const priceId = process.env.EXTENDED_QUESTIONS_PRICE_ID || "";
      if (!priceId) {
        return NextResponse.json({ error: "Add-on not configured yet — check EXTENDED_QUESTIONS_PRICE_ID secret" }, { status: 501 });
      }

      const checkout = await stripe.checkout.sessions.create({
        mode: "subscription",
        payment_method_types: ["card"],
        line_items: [{ price: priceId, quantity: 1 }],
        metadata: {
          user_id: session.user.id,
          addon: "extended_questions",
        },
        success_url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://kokolearn.org"}/dashboard?upgraded=1`,
        cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://kokolearn.org"}/dashboard`,
      });

      return NextResponse.json({ url: checkout.url });
    }

    if (!plan || !interval) {
      return NextResponse.json(
        { error: "Missing plan or interval" },
        { status: 400 }
      );
    }

    const priceId = PRICE_IDS[plan]?.[interval];
    if (!priceId) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001";

    const stripeSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: session.user.email,
      metadata: {
        user_id: session.user.id,
        plan,
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
