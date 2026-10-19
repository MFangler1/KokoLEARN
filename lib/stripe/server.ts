import Stripe from "stripe";

let _stripe: Stripe | null = null;

/**
 * Lazy singleton: Stripe is only created when first actually needed,
 * so builds/imports work even when STRIPE_SECRET_KEY is not present yet.
 */
export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }
    _stripe = new Stripe(key, {
      apiVersion: "2026-05-27.dahlia",
      typescript: true,
      httpClient: Stripe.createFetchHttpClient(),
    });
  }
  return _stripe;
}

/** Price IDs for each plan */
// LIVE prices (switched 19-10-2026)
export const PRICE_IDS = {
  premium: {
    monthly: "price_1TbekLBNbAfrXFsz827b7qeL",     // LIVE £9.99/mo
    annual: "price_1TbggoBNbAfrXFszDkOe61rL",         // LIVE £79.99/yr
  },
  family: {
    monthly: "price_1TbggpBNbAfrXFszr94y4NCg",        // LIVE £19.99/mo
    annual: "price_1TbggqBNbAfrXFszD4Z1ZLro",          // LIVE £159.99/yr
  },
} as const;

/** Extended Questions add-on price ID */
// Set this after creating the Stripe product (run: stripe products create)
export const EXTENDED_QUESTIONS_PRICE_ID = "REPLACE_WITH_REAL_PRICE_ID";

export type PlanType = keyof typeof PRICE_IDS;
export type BillingInterval = "monthly" | "annual";
