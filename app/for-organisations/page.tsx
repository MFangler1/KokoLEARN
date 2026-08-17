import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Building2, Heart, School, Users, Shield, BarChart3, Globe, CheckCircle, Sparkles } from "lucide-react";
import BackButton from "../components/BackButton";
import HomeButton from "../components/HomeButton";

export const metadata = {
  title: "Institutions — KokoLearn.org",
  description: "Bulk pricing for schools, councils, SEND groups & mental health organisations. Personalised learning aligned to the UK National Curriculum, at scale.",
};

// ── Pricing tiers ──
const orgPricing = [
  {
    name: "Small Group",
    seats: "Up to 10 seats",
    pricePerSeat: "£7.99",
    monthlyTotal: "£79.90",
    discount: "20% off",
    popular: false,
    features: ["10 individual learner profiles", "Admin dashboard", "Progress reports per learner", "UK National Curriculum tracking", "Email support"],
    cta: "Start FREE Trial",
  },
  {
    name: "Medium Group",
    seats: "Up to 30 seats",
    pricePerSeat: "£6.49",
    monthlyTotal: "£194.70",
    discount: "35% off",
    popular: true,
    features: ["30 individual learner profiles", "Admin dashboard + bulk reports", "Progress reports per learner", "UK National Curriculum tracking", "Priority support", "Dedicated onboarding session"],
    cta: "Start FREE Trial",
  },
  {
    name: "Large Group",
    seats: "Up to 100 seats",
    pricePerSeat: "£4.99",
    monthlyTotal: "£499",
    discount: "50% off",
    popular: false,
    features: ["100 individual learner profiles", "Admin dashboard + bulk reports", "Progress reports per learner", "UK National Curriculum tracking", "Priority phone & email support", "Dedicated onboarding session", "Custom reporting"],
    cta: "Start FREE Trial",
  },
  {
    name: "Enterprise",
    seats: "100+ seats",
    pricePerSeat: "Custom",
    monthlyTotal: "Talk to us",
    discount: "Bespoke",
    popular: false,
    features: ["Unlimited learner profiles", "Everything in Large Group", "Dedicated account manager", "Custom integrations", "SLA guarantee", "Staff training sessions"],
    cta: "Contact Us",
  },
];

// ── Who it's for ──
const audiences = [
  {
    icon: <School className="h-8 w-8" />,
    title: "Infant & Primary Schools",
    desc: "Supplement classroom teaching with AI-powered personalised learning. Cover teacher absences, support homework, and target individual gaps — every child gets lessons built around their interests.",
    img: "/images/org-schools.webp",
    bullets: ["Covers KS1-KS2 curriculum", "Individual progress tracking", "Perfect for homework & catch-up", "Reduces teacher workload"],
  },
  {
    icon: <Heart className="h-8 w-8" />,
    title: "SEND & Mental Health Organisations",
    desc: "Calm, structured, interest-led learning ideal for children with additional needs. No pressure, no pace expectations — just gentle, engaging activities that build confidence and routine.",
    img: "/images/org-send.webp",
    bullets: ["Calm, sensory-friendly interface", "Self-paced, no pressure", "Voice narration for accessibility", "Builds confidence through interests"],
  },
  {
    icon: <Building2 className="h-8 w-8" />,
    title: "Local Councils & Authorities",
    desc: "Fulfill statutory education responsibilities at scale. Provide consistent, curriculum-aligned tutoring to children across your authority — trackable, reportable, and cost-effective.",
    img: "/images/org-council.webp",
    bullets: ["Statutory education coverage", "Bulk reporting & analytics", "Scalable across entire authorities", "Cost-effective per-learner pricing"],
  },
];

export default function OrganisationsPage() {
  const today = new Date().getFullYear();

  return (
    <div className="flex min-h-full flex-col bg-white">
      {/* ── HEADER ── */}
      <header className="sticky top-0 z-50 w-full border-b border-primary-100/30 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/images/kokolearn-logo.png" alt="KokoLearn.org" width={44} height={44} className="drop-shadow-sm" />
          </Link>
          <div className="flex items-center gap-3">
            <BackButton className="text-sm font-medium text-gray-600" />
            <HomeButton className="text-sm font-medium text-gray-600" />
            <Link href="/sign-in" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">Sign In</Link>
            <Link href="/sign-up" className="rounded-xl bg-gradient-to-r from-primary to-secondary px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 transition-all">FREE TRIAL</Link>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-16 lg:py-24">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary-100/30 animate-float" />
          <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-secondary-100/30 animate-float" style={{ animationDelay: "1.5s" }} />
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">Institutions</span>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              AI tutoring at <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">organisational scale</span>
            </h1>
            <p className="mt-5 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
              Equip your school, council, or care organisation with personalised learning for every child.
              Bulk pricing from just £4.99 per seat. Same great platform, built for teams.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link href="/sign-up" className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-secondary px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 transition-all">
                Start FREE 24 Hour Trial
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a href="#pricing" className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white/80 px-8 py-4 text-lg font-semibold text-gray-700 hover:border-primary/30 hover:text-primary transition-all backdrop-blur-sm">
                See pricing
              </a>
            </div>
            <p className="mt-3 text-sm text-gray-500">No credit card required. Full access for 24 hours, for your whole team.</p>
          </div>
        </div>
      </section>

      {/* ── WHO IT'S FOR ── */}
      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">Who it&apos;s for</span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Built for organisations that care about children&apos;s learning</h2>
            <p className="mt-4 text-lg text-gray-600">Whether you&apos;re a school looking to supplement teaching, a council delivering statutory education, or a care organisation supporting children with additional needs — we&apos;ve got you covered.</p>
          </div>

          <div className="mt-14 space-y-16">
            {audiences.map((audience, i) => (
              <div key={audience.title} className={`grid items-center gap-10 lg:grid-cols-2 ${i % 2 === 1 ? "lg:grid-flow-dense" : ""}`}>
                <div className={i % 2 === 1 ? "lg:col-start-2" : ""}>
                  <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl ${i === 0 ? "bg-primary-50 text-primary" : i === 1 ? "bg-purple-50 text-accent" : "bg-blue-50 text-blue"}`}>
                    {audience.icon}
                  </div>
                  <h3 className="mt-4 text-2xl font-bold text-gray-900">{audience.title}</h3>
                  <p className="mt-3 text-base text-gray-600 leading-relaxed">{audience.desc}</p>
                  <ul className="mt-5 space-y-2">
                    {audience.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                        {b}
                      </li>
                    ))}
                  </ul>
                  <Link href="/sign-up" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-secondary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 hover:shadow-xl transition-all">
                    Start FREE Trial <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-lg">
                  <Image src={audience.img} alt={audience.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="bg-primary-50/20 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">Bulk Pricing</span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Volume discounts that scale with you</h2>
            <p className="mt-4 text-lg text-gray-600">All plans include a FREE 24-hour trial. No credit card required. Cancel anytime.</p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {orgPricing.map((plan) => (
              <div key={plan.name} className={`relative rounded-2xl p-6 sm:p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${plan.popular ? "border-2 border-primary bg-white shadow-lg shadow-primary/10" : "border border-primary-100/30 bg-white shadow-sm hover:shadow-md"}`}>
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary to-secondary px-4 py-1 text-xs font-semibold text-white shadow-lg">
                    Most Popular
                  </span>
                )}
                <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{plan.seats}</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-gray-900">{plan.pricePerSeat}</span>
                  <span className="text-sm text-gray-500">/seat/mo</span>
                </div>
                <p className="mt-1 text-xs text-emerald-600 font-semibold">{plan.discount}</p>
                <p className="mt-2 text-sm text-gray-500">From <span className="font-semibold text-gray-700">{plan.monthlyTotal}</span>/mo total</p>
                <ul className="mt-6 space-y-2.5 text-sm text-gray-600">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.cta === "Contact Us" ? "mailto:Support@AiConsultancy.org.uk?subject=KokoLearn%20Enterprise%20Enquiry" : "/sign-up"}
                  className={`mt-8 block rounded-xl px-6 py-3 text-center font-semibold transition-all ${plan.popular || plan.cta === "Start FREE Trial" ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/25 hover:shadow-xl" : "border-2 border-primary text-primary hover:bg-primary-50"}`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY KOKOLEARN ── */}
      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">Why organisations choose us</span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Everything you need to manage learning at scale</h2>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: <BarChart3 className="h-7 w-7" />, title: "Bulk Reporting", desc: "Export progress reports for all learners at once. Perfect for Ofsted inspections, council reviews, and stakeholder updates.", color: "bg-primary-50 text-primary" },
              { icon: <Shield className="h-7 w-7" />, title: "Safeguarding Built-In", desc: "No chatrooms, no strangers, no unsafe content. Every interaction is AI-controlled. COPPA and UK KCSIE compliant.", color: "bg-emerald-50 text-emerald-600" },
              { icon: <Users className="h-7 w-7" />, title: "Staff Management", desc: "Add staff accounts with role-based permissions. Teachers see their class. Admins see everything.", color: "bg-blue-50 text-blue" },
              { icon: <Globe className="h-7 w-7" />, title: "Accessible Anywhere", desc: "Works on tablets, laptops, and desktops. Learners can access from school, home, or care settings — all they need is a browser.", color: "bg-purple-50 text-purple-600" },
              { icon: <Sparkles className="h-7 w-7" />, title: "AI That Adapts", desc: "Every lesson is personalised to the child's interests, pace, and level. No two learning journeys are the same.", color: "bg-amber-50 text-amber-600" },
              { icon: <Shield className="h-7 w-7" />, title: "Dedicated Support", desc: "Onboarding sessions, priority phone support, and a named account manager for Large Group and Enterprise plans.", color: "bg-rose-50 text-rose-600" },
            ].map((feature) => (
              <div key={feature.title} className="group rounded-2xl border border-primary-100/20 bg-white p-6 shadow-sm hover:shadow-md transition-all">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${feature.color}`}>
                  {feature.icon}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">{feature.title}</h3>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative overflow-hidden bg-gradient-to-r from-primary to-secondary py-16 lg:py-20">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-white/10 animate-float" />
          <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-white/10 animate-float" style={{ animationDelay: "1.5s" }} />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Ready to bring KokoLearn to your organisation?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">Try FREE for 24 hours with your team. No credit card, no commitment. See the difference personalised AI tutoring makes.</p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href="/sign-up" className="group inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 font-semibold text-primary shadow-lg hover:bg-gray-100 hover:shadow-xl transition-all hover:-translate-y-0.5">
              Start FREE 24 Hour Trial <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="mailto:Support@AiConsultancy.org.uk?subject=KokoLearn%20Organisation%20Enquiry" className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-8 py-4 font-semibold text-white hover:bg-white/10 transition-all">
              Talk to Our Team
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-gradient-to-b from-primary-50 to-white border-t border-primary-100/30 pt-10 pb-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="sm:col-span-2 lg:col-span-1">
              <Link href="/" className="inline-block">
                <Image src="/images/kokolearn-logo.png" alt="KokoLearn.org" width={120} height={120} className="object-contain" />
              </Link>
              <p className="mt-3 text-sm text-gray-500 leading-relaxed max-w-xs">
                Personalised learning aligned to the UK National Curriculum. For schools, councils, and care organisations.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-primary">Product</h4>
              <ul className="mt-4 space-y-3 text-sm">
                {["How it works", "Features", "Pricing", "Institutions"].map((l) => {
                    const href = l === "How it works" ? "/#how-it-works" :
                                 l === "Features" ? "/#features" :
                                 l === "Pricing" ? "/#pricing" :
                                 l === "Institutions" ? "/for-organisations" :
                                 "/";
                    return (
                      <li key={l}><Link href={href} className="text-gray-600 hover:text-primary transition-colors">{l}</Link></li>
                    );
                  })}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-primary">Legal</h4>
              <ul className="mt-4 space-y-3 text-sm">
                <li><Link href="/legal/privacy" className="text-gray-600 hover:text-primary transition-colors">Privacy Policy</Link></li>
                <li><Link href="/legal/terms" className="text-gray-600 hover:text-primary transition-colors">Terms &amp; Conditions</Link></li>
                <li><Link href="/legal/child-safety" className="text-gray-600 hover:text-primary transition-colors">Child Safety Policy</Link></li>
                <li><Link href="/legal/refund" className="text-gray-600 hover:text-primary transition-colors">Refund Policy</Link></li>
                <li><Link href="/legal/cookies" className="text-gray-600 hover:text-primary transition-colors">Cookies Policy</Link></li>
                <li><Link href="/legal/faq" className="text-gray-600 hover:text-primary transition-colors">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-primary">Connect</h4>
              <ul className="mt-4 space-y-3 text-sm">
                <li><Link href="https://AiConsultancy.org.uk" target="_blank" className="text-gray-600 hover:text-primary transition-colors">AiConsultancy.org.uk</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-primary-100/30 pt-6 text-center">
            <p className="text-xs text-gray-400">&copy; {today} KokoLearn.org. A PAD-CIC initiative.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
