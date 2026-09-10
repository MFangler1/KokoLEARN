import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Check,
  CheckCircle2,
  Flame,
  GraduationCap,
  Heart,
  LineChart,
  Printer,
  Shield,
  Sparkles,
  Star,
  Target,
  Trophy,
  Users,
} from "lucide-react";

export const metadata = {
  title: "What Parents See | KokoLearn",
  description:
    "See exactly what KokoLearn shows parents: your child's dashboard, progress tracking, lessons, achievements and printable reports.",
};

const included = [
  "A private dashboard for each child",
  "Personalised lessons built around their interests",
  "Progress tracking across English, Maths, Science and more",
  "Curriculum-aligned objectives (KS1 & KS2)",
  "Achievements, stars and merits to celebrate effort",
  "Weekly and monthly progress views",
  "Lesson history with scores for every activity",
  "Printable progress reports",
  "Safe environment: no ads, no social features",
  "Up to 2 free trial lessons in the first 24 hours",
];

const dashboardCards = [
  {
    icon: <LineChart className="h-5 w-5 text-primary" />,
    title: "Progress over time",
    body: "See weekly and monthly trends so you know they are moving forward, not just busy.",
  },
  {
    icon: <Target className="h-5 w-5 text-secondary" />,
    title: "Subject breakdown",
    body: "English, Maths, Science, Geography, History, Art and Computing at a glance.",
  },
  {
    icon: <BookOpen className="h-5 w-5 text-emerald-600" />,
    title: "Lesson history",
    body: "Every lesson, its topic, when it was taken and the score achieved.",
  },
  {
    icon: <Trophy className="h-5 w-5 text-amber-500" />,
    title: "Achievements & merits",
    body: "Stars, streaks and badges that reward effort and keep children motivated.",
  },
];

const subjects = [
  { name: "Maths", progress: 80, colour: "#F97316" },
  { name: "English", progress: 65, colour: "#EA580C" },
  { name: "Science", progress: 55, colour: "#F59E0B" },
  { name: "Geography", progress: 45, colour: "#3B82F6" },
  { name: "History", progress: 35, colour: "#10B981" },
  { name: "Art & Design", progress: 70, colour: "#8B5CF6" },
];

const recentLessons = [
  { topic: "Dinosaur Plant Adventures", subject: "Science", score: 9, total: 10 },
  { topic: "Space Maths: Mission Addition", subject: "Maths", score: 8, total: 10 },
  { topic: "Reading with Professor Koko", subject: "English", score: 10, total: 10 },
];

export default function WhatParentsSeePage() {
  return (
    <div className="flex min-h-full flex-col bg-gradient-to-b from-primary-50 via-white to-primary-50/30">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-primary-100/50 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/images/kokolearn-logo.png" alt="KokoLearn.org" width={140} height={42} className="object-contain" />
          </Link>
          <nav className="hidden items-center gap-6 lg:flex">
            <Link href="/#how-it-works" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">How It Works</Link>
            <Link href="/#features" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">Features</Link>
            <Link href="/pricing" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">Pricing</Link>
            <Link href="/what-parents-see" className="text-sm font-semibold text-primary">For Parents</Link>
            <Link href="/curriculum" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">Curriculum</Link>
            <Link href="/dashboard" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">User Dashboard</Link>
            <Link href="/sign-in" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">Sign In</Link>
            <Link href="/sign-up" className="rounded-xl bg-gradient-to-r from-primary to-secondary px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 hover:shadow-xl transition-all">
              FREE TRIAL
            </Link>
          </nav>
          <Link href="/sign-up" className="rounded-xl bg-gradient-to-r from-primary to-secondary px-4 py-2 text-sm font-semibold text-white lg:hidden">
            FREE TRIAL
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto w-full max-w-7xl px-4 pt-12 pb-8 sm:px-6 lg:px-8 lg:pt-16">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-4 py-1.5 text-sm font-medium text-primary">
            <Users className="h-4 w-4" />
            For parents
          </span>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            What parents see in KokoLearn
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-gray-600">
            A clear, private view of your child&apos;s learning: their lessons, progress,
            achievements and reports. No guesswork, no jargon - just the things that
            help you support them.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link href="/sign-up" className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-secondary px-6 py-3 text-base font-semibold text-white shadow-lg shadow-primary/25 hover:shadow-xl transition-all">
              Start Your FREE 24 Hour Trial
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/pricing" className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white/80 px-6 py-3 text-base font-semibold text-gray-700 hover:border-primary/30 hover:text-primary transition-all">
              See pricing
            </Link>
          </div>
          <p className="mt-3 text-xs font-semibold text-amber-600">
            Only 2 lesson trials in FREE 24 hour period
          </p>
        </div>
      </section>

      {/* Dashboard preview */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-primary-100/60 bg-white p-5 shadow-sm sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary">Your parent dashboard</p>
              <h2 className="mt-1 text-2xl font-bold text-gray-900">Welcome back, Sarah - here is Alex&apos;s learning overview</h2>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-2 text-xs font-semibold text-primary">
              <Flame className="h-4 w-4" /> 12 day streak
            </span>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Lessons completed", value: "47", icon: <BookOpen className="h-4 w-4 text-primary" /> },
              { label: "Learning time", value: "23h 15m", icon: <Sparkles className="h-4 w-4 text-secondary" /> },
              { label: "Average progress", value: "65%", icon: <BarChart3 className="h-4 w-4 text-emerald-600" /> },
              { label: "Current streak", value: "12 days", icon: <Flame className="h-4 w-4 text-amber-500" /> },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border border-gray-100 bg-gray-50/60 p-4">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-500">{s.icon}{s.label}</div>
                <div className="mt-1 text-2xl font-bold text-gray-900">{s.value}</div>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-gray-100 bg-white p-5">
              <h3 className="text-sm font-bold text-gray-900">Subject breakdown</h3>
              <div className="mt-4 space-y-3">
                {subjects.map((s) => (
                  <div key={s.name}>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-gray-700">{s.name}</span>
                      <span className="text-gray-500">{s.progress}%</span>
                    </div>
                    <div className="mt-1 h-2 w-full rounded-full bg-gray-100">
                      <div className="h-2 rounded-full" style={{ width: `${s.progress}%`, backgroundColor: s.colour }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-5">
              <h3 className="text-sm font-bold text-gray-900">Recent lessons</h3>
              <ul className="mt-4 space-y-3">
                {recentLessons.map((l) => (
                  <li key={l.topic} className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-gray-50/60 p-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{l.topic}</p>
                      <p className="text-xs text-gray-500">{l.subject}</p>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                      <Star className="h-3.5 w-3.5" /> {l.score}/{l.total}
                    </span>
                  </li>
                ))}
              </ul>
              <h3 className="mt-6 text-sm font-bold text-gray-900">Achievements &amp; merits</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {["12 day streak", "Maths star", "Super reader", "Science explorer", "Perfect week"].map((b) => (
                  <span key={b} className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                    <Trophy className="h-3.5 w-3.5" /> {b}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-primary-100 bg-primary-50/50 p-4">
            <div className="flex items-center gap-3">
              <Printer className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-semibold text-gray-900">Printable progress report</p>
                <p className="text-xs text-gray-600">A professional report for your child - download as PDF or Word.</p>
              </div>
            </div>
            <Link href="/dashboard/reports" className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-primary shadow-sm hover:shadow-md transition-all">
              Preview report
            </Link>
          </div>
        </div>
      </section>

      {/* What parents get */}
      <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">What you get as a parent</h2>
          <p className="mt-3 text-base text-gray-600">Everything below is included from the moment you start your free trial.</p>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {included.map((item) => (
            <div key={item} className="flex items-start gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
              <span className="text-sm text-gray-700">{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Your dashboard at a glance cards */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-10 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {dashboardCards.map((c) => (
            <div key={c.title} className="rounded-2xl border border-primary-100/40 bg-white p-5 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50">{c.icon}</div>
              <h3 className="mt-3 text-sm font-semibold text-gray-900">{c.title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-gray-600">{c.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Plans & purchase options */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Choose what suits your family</h2>
          <p className="mt-3 text-base text-gray-600">Tick what you would like and start in seconds - you can change plan at any time.</p>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900">24 Hour Trial</h3>
            <p className="mt-1 text-3xl font-bold text-primary">£0</p>
            <p className="text-xs text-gray-500">for 24 hours</p>
            <ul className="mt-4 space-y-2">
              {["2 personalised lessons", "Voice narration", "Basic progress tracking", "1 child profile"].map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" /> {f}
                </li>
              ))}
            </ul>
            <Link href="/sign-up" className="mt-6 block rounded-xl bg-gradient-to-r from-primary to-secondary px-5 py-3 text-center text-sm font-semibold text-white shadow-sm hover:shadow-md transition-all">
              Start Free Trial
            </Link>
          </div>

          <div className="relative rounded-3xl border-2 border-primary bg-white p-6 shadow-md">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary to-secondary px-4 py-1 text-xs font-bold text-white shadow">
              Most popular
            </span>
            <h3 className="text-lg font-bold text-gray-900">Premium</h3>
            <p className="mt-1 text-3xl font-bold text-primary">£9.99</p>
            <p className="text-xs text-gray-500">per month</p>
            <ul className="mt-4 space-y-2">
              {["Unlimited personalised lessons", "Full progress tracking & reports", "All subjects & curriculum objectives", "Achievements, stars and merits", "1 child profile", "Cancel anytime"].map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" /> {f}
                </li>
              ))}
            </ul>
            <Link href="/pricing" className="mt-6 block rounded-xl bg-gradient-to-r from-primary to-secondary px-5 py-3 text-center text-sm font-semibold text-white shadow-sm hover:shadow-md transition-all">
              Choose Premium
            </Link>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900">Family</h3>
            <p className="mt-1 text-3xl font-bold text-primary">£19.99</p>
            <p className="text-xs text-gray-500">per month</p>
            <ul className="mt-4 space-y-2">
              {["Everything in Premium", "Up to 4 child profiles", "Family progress overview", "Priority support", "Cancel anytime"].map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" /> {f}
                </li>
              ))}
            </ul>
            <Link href="/pricing" className="mt-6 block rounded-xl border border-primary/30 px-5 py-3 text-center text-sm font-semibold text-primary hover:bg-primary-50 transition-all">
              Choose Family
            </Link>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-gray-500">
          Optional extras (add later from your dashboard): Extended Questions +£2/month.
        </p>
      </section>

      {/* Safety + close */}
      <section className="border-t border-primary-100/40 bg-white py-12">
        <div className="mx-auto w-full max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <h2 className="mt-4 text-2xl font-bold text-gray-900">Safe, private, and built for families</h2>
          <p className="mt-3 text-sm text-gray-600">
            Each child has their own profile and progress. No advertising, no social features,
            and parents control everything from their own dashboard.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link href="/sign-up" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-secondary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 hover:shadow-xl transition-all">
              <GraduationCap className="h-4 w-4" /> Start your free trial
            </Link>
            <Link href="/pricing" className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 hover:border-primary/30 hover:text-primary transition-all">
              Compare plans
            </Link>
          </div>
          <p className="mt-4 inline-flex items-center gap-1.5 text-xs text-gray-500">
            <Heart className="h-3.5 w-3.5 text-primary" /> Loved by UK families - curriculum aligned for ages 5-11
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-primary-100/50 bg-primary-50/30">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <Image src="/images/kokolearn-logo.png" alt="KokoLearn.org" width={140} height={42} className="object-contain" />
              <p className="mt-2 text-xs text-gray-500">Helping UK families and institutions adopt personalised learning.</p>
            </div>
            <div className="flex flex-wrap gap-6 text-xs text-gray-600">
              <Link href="/" className="hover:text-primary">Home</Link>
              <Link href="/pricing" className="hover:text-primary">Pricing</Link>
              <Link href="/curriculum" className="hover:text-primary">Curriculum</Link>
              <Link href="/for-organisations" className="hover:text-primary">Institutions</Link>
              <Link href="/legal/privacy" className="hover:text-primary">Privacy</Link>
              <Link href="/legal/terms" className="hover:text-primary">Terms</Link>
            </div>
          </div>
          <div className="mt-6 border-t border-primary-100/50 pt-4 text-center text-2xs text-gray-400">
            <span>&copy; {new Date().getFullYear()} KokoLearn.org. A PAD-CIC initiative. Operated by AiConsultancy.org.uk (Grimsby).</span>
            <Link href="/admin" className="ml-2 text-2xs text-gray-400 underline hover:text-primary transition-colors">Admin</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
