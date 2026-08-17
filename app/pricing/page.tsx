import Image from "next/image";
import Link from "next/link";
import { Check, Sparkles, Users, ArrowRight, Star } from "lucide-react";

const plans = [
  {
    name: "24 Hour Trial",
    price: "£0",
    period: "for 24 hours",
    badge: "FREE",
    badgeColor: "bg-green-100 text-green-700",
    features: [
      "3 personalised lessons",
      "Voice narration (AI)",
      "Basic progress tracking",
      "1 child profile",
    ],
    cta: "Start Free Trial",
    href: "/sign-up",
    popular: false,
  },
  {
    name: "Premium",
    price: "£9.99",
    period: "per month",
    badge: "Most Popular",
    badgeColor: "bg-primary-100 text-primary",
    features: [
      "Unlimited personalised lessons",
      "Detailed progress reports",
      "Printable PDF reports",
      "Full National Curriculum coverage",
      "AI-powered tutor chat",
      "1 child profile",
      "Email support",
    ],
    cta: "Subscribe Now",
    href: "/sign-up?plan=premium",
    popular: true,
  },
  {
    name: "Family",
    price: "£19.99",
    period: "per month",
    badge: "Best Value",
    badgeColor: "bg-secondary-100 text-secondary",
    features: [
      "Everything in Premium",
      "Up to 4 child profiles",
      "Individual progress tracking",
      "Family dashboard",
      "Priority email support",
    ],
    cta: "Subscribe Now",
    href: "/sign-up?plan=family",
    popular: false,
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/images/kokolearn-logo.png" alt="KokoLearn" width={44} height={44} className="drop-shadow-sm" />
          </Link>
          <Link href="/sign-in" className="rounded-xl bg-gradient-to-r from-primary to-secondary px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-primary/20 hover:shadow-xl transition-all">
            Sign In
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pt-24 pb-10 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            Simple, transparent pricing
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Start with a free trial — no credit card required. Upgrade when you&apos;re ready for more.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid gap-8 lg:grid-cols-3 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border bg-white p-8 shadow-sm transition-all hover:shadow-lg ${
                plan.popular
                  ? "border-primary/30 ring-2 ring-primary/20 scale-105 lg:scale-110"
                  : "border-gray-200"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-primary to-secondary px-4 py-1 text-xs font-semibold text-white shadow-lg">
                    <Star className="h-3 w-3 fill-white" />
                    {plan.badge}
                  </span>
                </div>
              )}
              {!plan.popular && plan.badge !== "FREE" && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className={`inline-flex items-center gap-1 rounded-full px-4 py-1 text-xs font-semibold shadow-sm ${plan.badgeColor}`}>
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                <div className="mt-4 flex items-baseline justify-center gap-1">
                  <span className="text-5xl font-extrabold text-gray-900">{plan.price}</span>
                  <span className="text-sm text-gray-500">{plan.period}</span>
                </div>
              </div>

              <ul className="mt-8 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`mt-8 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-all ${
                  plan.popular
                    ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5"
                    : "border border-gray-200 text-gray-700 hover:border-primary/30 hover:text-primary"
                }`}
              >
                {plan.cta}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {[
              { q: "Can I cancel anytime?", a: "Yes. You can cancel your subscription at any time. Your access continues until the end of your billing period." },
              { q: "Is there a free trial?", a: "Yes! You get 24 hours of full access with 3 free lessons — no credit card required." },
              { q: "Can I switch plans?", a: "Absolutely. You can upgrade or downgrade at any time. Changes take effect on your next billing date." },
              { q: "Do you offer refunds?", a: "We offer a full refund within 14 days of purchase if you're not satisfied. See our Refund Policy for details." },
            ].map((faq) => (
              <div key={faq.q} className="rounded-xl border border-gray-200 bg-white p-6">
                <h3 className="font-semibold text-gray-900">{faq.q}</h3>
                <p className="mt-2 text-sm text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20 rounded-2xl bg-gradient-to-r from-primary to-secondary p-8 sm:p-12 text-center text-white">
          <h2 className="text-3xl font-bold">Start your free trial today</h2>
          <p className="mt-3 text-white/80 max-w-lg mx-auto">
            No credit card required. Full access for 24 hours.
          </p>
          <Link
            href="/sign-up"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3 font-semibold text-primary shadow-lg hover:bg-gray-100 transition-all"
          >
            <Sparkles className="h-4 w-4" />
            Start Free Trial
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-sm text-gray-500">© 2026 KokoLearn. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/legal/privacy" className="text-sm text-gray-500 hover:text-primary">Privacy</Link>
            <Link href="/legal/terms" className="text-sm text-gray-500 hover:text-primary">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
