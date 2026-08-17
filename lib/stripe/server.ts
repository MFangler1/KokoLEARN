import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-05-27.dahlia",
  typescript: true,
  httpClient: Stripe.createFetchHttpClient(),
});

/** Price IDs for each plan */
// TEST MODE prices — switch to LIVE prices when Mark approves
export const PRICE_IDS = {
  premium: {
    monthly: "price_1ThnviBNbAfrXFszkm1edI5j",     // TEST £9.99/mo
    annual: "price_1ThnviBNbAfrXFszyY4KGH9E",         // TEST £79.99/yr
  },
  family: {
    monthly: "price_1ThnvjBNbAfrXFszfrBtH0yx",        // TEST £19.99/mo
    annual: "price_1ThnvjBNbAfrXFszvFW391vs",          // TEST £159.99/yr
  },
} as const;

/** Extended Questions add-on price ID */
// Set this after creating the Stripe product (run: stripe products create)
export const EXTENDED_QUESTIONS_PRICE_ID = "REPLACE_WITH_REAL_PRICE_ID";

export type PlanType = keyof typeof PRICE_IDS;
export type BillingInterval = "monthly" | "annual";
