import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle, Sparkles, TrendingUp, Users, DollarSign, Shield, Zap } from "lucide-react";

export const metadata = {
  title: "Become a Solopreneur — KokoLearn.org",
  description: "Turn your network into recurring income. Become a KokoLearn Solopreneur and earn 35% commissions on every subscription you refer.",
};

const benefits = [
  {
    img: "/images/solopreneur-earnings.webp",
    title: "One-off setup, lifetime earnings",
    desc: "Pay £497 once for your branded portal. Earn 35% recurring commission on every subscription. As your sales grow, your rate scales up to 45%.",
  },
  {
    img: "/images/solopreneur-brand.webp",
    title: "Your brand, our platform",
    desc: "We build you a white-labelled copy of KokoLearn with your logo, colours, and domain. Your customers never see our name — you're the brand they trust.",
  },
  {
    img: "/images/solopreneur-support.webp",
    title: "We handle everything",
    desc: "Hosting, AI tutoring, payments via Stripe, customer support, legal compliance — all taken care of. You just market and earn.",
  },
  {
    img: "/images/solopreneur-growth.webp",
    title: "Scaling commissions",
    desc: "35% on first 50 sales, 40% at 100, 45% at 250+. The more you sell, the more you earn per customer — forever.",
  },
  {
    img: "/images/solopreneur-lifestyle.webp",
    title: "Designed for solopreneurs & retirees",
    desc: "Perfect side income. No stock, no employees, no overhead. Share with parents' groups, schools, your network — everyone needs better tutoring.",
  },
  {
    img: "/images/solopreneur-marketing.webp",
    title: "Full marketing toolkit",
    desc: "Branded social media images, email templates, flyers, video scripts — everything you need to promote professionally from day one.",
  },
];

const commissionTiers = [
  { sales: "0-50", rate: "35%", label: "Starter" },
  { sales: "51-100", rate: "40%", label: "Growth" },
  { sales: "101-250", rate: "42.5%", label: "Pro" },
  { sales: "250+", rate: "45%", label: "Elite" },
];

export default function SolopreneurPage() {
  return (
    <div className="flex min-h-full flex-col bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-primary-100/30 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/images/kokolearn-logo.png" alt="KokoLearn.org" width={44} height={44} className="drop-shadow-sm" />
          </Link>
          <Link href="/" className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-600 hover:shadow-md transition-all">← Back to Home</Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">🌟 New Opportunity</span>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Turn your network into <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">recurring income</span>
            </h1>
            <p className="mt-5 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
              Become a KokoLearn Solopreneur. One small investment, your own branded tutoring platform, 
              and 35-45% recurring commissions on every subscription your customers pay.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link href="/sign-up" className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-secondary px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 transition-all">
                Try KokoLearn FREE
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="#how-it-works" className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white/80 px-8 py-4 text-lg font-semibold text-gray-700 hover:border-primary/30 hover:text-primary transition-all backdrop-blur-sm">
                See the opportunity
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">Simple Model</span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">How the Solopreneur Model Works</h2>
            <p className="mt-4 text-lg text-gray-600">One payment. Your brand. Recurring income for life.</p>
          </div>

          <div className="mt-14 mx-auto max-w-4xl">
            <div className="space-y-8">
              {[
                { step: "1", title: "Pay £497 once", desc: "That's it. No monthly fees, no hidden costs. One payment covers your branded portal setup, domain configuration, marketing toolkit, and access to our entire platform infrastructure." },
                { step: "2", title: "We build your branded portal", desc: "We create a fully white-labelled copy of KokoLearn with your logo, brand colours, chosen domain name, and legal pages. Your customers see your brand only — from sign-up through to daily use." },
                { step: "3", title: "You promote, we handle everything else", desc: "Share your unique referral link with parents, schools, community groups. We handle hosting, AI tutoring, payments via Stripe, customer support, and all technical operations." },
                { step: "4", title: "You earn 35-45% recurring commissions", desc: "Every time someone you refer pays for a Premium (£9.99/mo) or Family (£19.99/mo) subscription, you earn a commission — every month, for as long as they stay subscribed." },
              ].map((item) => (
                <div key={item.step} className="flex gap-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-primary to-secondary text-sm font-bold text-white shadow-md">
                    {item.step}
                  </div>
                  <div className="pt-1.5">
                    <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                    <p className="mt-1.5 text-base text-gray-600 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Commission Tiers */}
      <section className="bg-primary-50/20 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">Scaling rewards</span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">The More You Sell, The More You Earn</h2>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {commissionTiers.map((tier) => (
              <div key={tier.label} className="rounded-2xl border border-primary-100/30 bg-white p-6 text-center shadow-sm">
                <div className="text-4xl font-bold text-primary">{tier.rate}</div>
                <div className="mt-2 text-sm font-semibold text-gray-900">{tier.label}</div>
                <div className="mt-1 text-xs text-gray-500">{tier.sales} subscribers</div>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-2xl border border-primary/20 bg-white p-6 sm:p-8 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">What does that mean in real money?</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {[
                { subs: "10 families", premium: "£35/mo", family: "£70/mo" },
                { subs: "50 families", premium: "£175/mo", family: "£350/mo" },
                { subs: "100 families", premium: "£400/mo", family: "£800/mo" },
              ].map((row) => (
                <div key={row.subs} className="rounded-xl border border-primary-100/20 bg-primary-50/30 p-4 text-center">
                  <div className="text-sm font-semibold text-gray-900">{row.subs}</div>
                  <div className="mt-1 text-[10px] text-gray-500">at 35-40% commission</div>
                  <div className="mt-2 flex justify-center gap-3 text-xs">
                    <span>Premium: <strong className="text-primary">{row.premium}</strong></span>
                    <span>Family: <strong className="text-primary">{row.family}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Everything You Need to Succeed</h2>
            <p className="mt-4 text-lg text-gray-600">We provide the platform. You bring the audience.</p>
          </div>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((b) => (
              <div key={b.title} className="group rounded-2xl border border-primary-100/30 bg-white p-6 shadow-sm hover:shadow-md transition-all">
                <div className="relative h-40 w-full overflow-hidden rounded-xl mb-4">
                  <Image src={b.img} alt={b.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">{b.title}</h3>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — Try KokoLearn + Express Interest */}
      <section className="bg-gradient-to-r from-primary to-secondary py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Ready to become a KokoLearn Solopreneur?</h2>
            <p className="mt-4 text-lg text-white/80">
              Try the platform FREE for 24 hours, then express your interest and we&apos;ll walk you through everything.
            </p>
            <div className="mt-10 flex flex-col items-center gap-6">
              <Link href="/sign-up" className="group inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-lg font-semibold text-primary shadow-lg hover:bg-gray-100 hover:shadow-xl transition-all hover:-translate-y-0.5">
                Try KokoLearn FREE <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <p className="text-sm text-white/60">Already tried it? Express your interest below.</p>

              {/* Express Interest — Mailto */}
              <div className="w-full max-w-xl rounded-2xl bg-white/20 p-8 backdrop-blur-sm">
                <h3 className="text-xl font-bold text-white text-center">Express Your Interest</h3>
                <p className="mt-2 text-sm text-white/70 text-center">
                  Fill in your details and we&apos;ll get back to you within 24 hours.
                </p>
                <div className="mt-6 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" id="solFirstName" placeholder="First name"
                      className="w-full rounded-lg border border-white/30 bg-white/30 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50" />
                    <input type="text" id="solLastName" placeholder="Last name"
                      className="w-full rounded-lg border border-white/30 bg-white/30 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50" />
                  </div>
                  <input type="email" id="solEmail" placeholder="Your email address"
                    className="w-full rounded-lg border border-white/30 bg-white/30 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50" />
                  <input type="tel" id="solPhone" placeholder="Phone number (optional)"
                    className="w-full rounded-lg border border-white/30 bg-white/30 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50" />
                  <select id="solAudience"
                    className="w-full rounded-lg border border-white/30 bg-white/30 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/50">
                    <option value="" className="text-gray-800">Who would you promote to?</option>
                    <option value="parents" className="text-gray-800">Parent groups</option>
                    <option value="schools" className="text-gray-800">Schools & educators</option>
                    <option value="network" className="text-gray-800">My professional network</option>
                    <option value="multiple" className="text-gray-800">Multiple audiences</option>
                  </select>
                  <a href="mailto:Support@AiConsultancy.org.uk?subject=KokoLearn%20Solopreneur%20Enquiry&body=Hi%20Mark%2C%0A%0AI%27m%20interested%20in%20becoming%20a%20KokoLearn%20Solopreneur.%20Please%20contact%20me%20with%20more%20information.%0A%0AThanks"
                    className="block w-full rounded-xl bg-white py-3 text-sm font-semibold text-primary text-center shadow-lg hover:bg-gray-100 hover:shadow-xl transition-all">
                    Send Enquiry →
                  </a>
                </div>
                <p className="mt-4 text-xs text-white/50 text-center">
                  Your enquiry opens your email client. Just hit send — we&apos;ll take it from there.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-primary-50 to-white border-t border-primary-100/30 pt-10 pb-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="sm:col-span-2 lg:col-span-1">
              <Link href="/" className="inline-block">
                <Image src="/images/kokolearn-logo.png" alt="KokoLearn.org" width={120} height={120} className="object-contain" />
              </Link>
              <p className="mt-3 text-sm text-gray-500 leading-relaxed max-w-xs">
                AI-powered tutoring aligned to the UK National Curriculum. Making every child&apos;s learning journey as unique as they are.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-primary">Product</h4>
              <ul className="mt-4 space-y-3 text-sm">
                {["How it works", "Features", "Pricing", "Institutions"].map((l) => {
                    const href = l === "How it works" ? "/#how-it-works" :
                                 l === "Features" ? "/#features" :
                                 l === "Pricing" ? "/#pricing" :
                                 l === "Institutions" ? "/for-organisations" : "/" + l.toLowerCase();
                                 l === "Institutions" ? "/for-organisations" : "/" + l.toLowerCase();
                    return (
                      <li key={l}><Link href={href} className="text-gray-600 hover:text-primary transition-colors">{l}</Link></li>
                    );
                  })
                }
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-primary">Legal</h4>
              <ul className="mt-4 space-y-3 text-sm">
                {["Privacy Policy", "Terms & Conditions", "Child Safety Policy", "Refund Policy", "Cookies Policy", "FAQ"].map((l) => (
                  <li key={l}><Link href={`/legal/${l.toLowerCase().replace(/[&\s]+/g, "-").replace(/--+/g, "-").replace(/^-|-$/g, "").replace("privacy-policy", "privacy").replace("terms-conditions", "terms").replace("child-safety-policy", "child-safety").replace("refund-policy", "refund").replace("cookies-policy", "cookies")}`} className="text-gray-600 hover:text-primary transition-colors">{l}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-primary">Connect</h4>
              <ul className="mt-4 space-y-3 text-sm">
                <li><Link href="https://AiConsultancy.org.uk" target="_blank" className="text-gray-600 hover:text-primary transition-colors flex items-center gap-1">
                  Built by AiConsultancy.org.uk
                </Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-primary-100/30 pt-6 text-center">
            <p className="text-xs text-gray-400">&copy; {new Date().getFullYear()} KokoLearn.org. A PAD-CIC initiative.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
