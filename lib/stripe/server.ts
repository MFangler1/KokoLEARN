import Stripe from "stripe";

export type PlanType = "premium" | "family";
export type BillingInterval = "monthly" | "annual";

const PRICE_ENV: Record<PlanType, Record<BillingInterval, string>> = {
  premium: { monthly: "STRIPE_PRICE_PREMIUM_MONTHLY", annual: "STRIPE_PRICE_PREMIUM_ANNUAL" },
  family: { monthly: "STRIPE_PRICE_FAMILY_MONTHLY", annual: "STRIPE_PRICE_FAMILY_ANNUAL" },
};

const EXPECTED_PRICE: Record<PlanType, Record<BillingInterval, { amount: number; interval: "month" | "year" }>> = {
  premium: { monthly: { amount: 999, interval: "month" }, annual: { amount: 7999, interval: "year" } },
  family: { monthly: { amount: 1999, interval: "month" }, annual: { amount: 15999, interval: "year" } },
};

let stripeInstance: Stripe | null = null;

function stripeMode(): "test" | "live" {
  const mode = process.env.STRIPE_MODE;
  if (mode === "test" || mode === "live") return mode;
  if (process.env.NODE_ENV === "production") throw new Error("STRIPE_MODE must be explicitly set to test or live");
  return "test";
}

export function isExpectedLivemode(livemode: boolean): boolean {
  return livemode === (stripeMode() === "live");
}

export function getStripe(): Stripe {
  if (stripeInstance) return stripeInstance;
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) throw new Error("STRIPE_SECRET_KEY is not configured");
  if ((stripeMode() === "live") !== secret.startsWith("sk_live_")) {
    throw new Error("STRIPE_SECRET_KEY does not match STRIPE_MODE");
  }
  stripeInstance = new Stripe(secret, {
    apiVersion: "2026-05-27.dahlia",
    typescript: true,
    httpClient: Stripe.createFetchHttpClient(),
  });
  return stripeInstance;
}

function requiredEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value || !value.startsWith("price_")) throw new Error(`${name} is not configured with a Stripe price ID`);
  return value;
}

export function getPlanPriceId(plan: PlanType, interval: BillingInterval): string {
  return requiredEnv(PRICE_ENV[plan][interval]);
}

export function getAddonPriceId(): string {
  return requiredEnv("STRIPE_PRICE_EXTENDED_QUESTIONS_MONTHLY");
}

export function getSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!configured && process.env.NODE_ENV === "production") {
    throw new Error("NEXT_PUBLIC_SITE_URL must be configured in production");
  }

  const url = new URL(configured || "http://localhost:3001");
  if (process.env.NODE_ENV === "production" && url.protocol !== "https:") {
    throw new Error("NEXT_PUBLIC_SITE_URL must use HTTPS in production");
  }
  return url.origin;
}

export async function verifyRecurringPrice(
  stripe: Stripe,
  priceId: string,
  expected: { amount: number; interval: "month" | "year" }
): Promise<void> {
  const price = await stripe.prices.retrieve(priceId);
  if (!price.active || price.livemode !== (stripeMode() === "live") || price.currency !== "gbp" ||
      price.unit_amount !== expected.amount || price.recurring?.interval !== expected.interval) {
    throw new Error("Stripe price configuration does not match the approved product");
  }
}

export function expectedPlanPrice(plan: PlanType, interval: BillingInterval) {
  return EXPECTED_PRICE[plan][interval];
}

export const EXPECTED_ADDON_PRICE = { amount: 200, interval: "month" as const };

export function isPlan(value: unknown): value is PlanType {
  return value === "premium" || value === "family";
}

export function isBillingInterval(value: unknown): value is BillingInterval {
  return value === "monthly" || value === "annual";
}
