"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  BookOpen, Clock, TrendingUp, Flame, ArrowRight, Plus,
  Download, Calendar, Star, Target, Zap, Crown, Sparkles,
  Users, Check, ChevronRight, Smile, HelpCircle, MessageSquare,
} from "lucide-react";

// ── Types ──
type Child = {
  id: string; name: string; age: number; avatar: string;
  stats: { lessonsCompleted: number; learningHours: string; avgProgress: number; currentStreak: number };
  subjectProgress: { subject: string; progress: number; color: string }[];
  recentLessons: { topic: string; emoji: string; subject: string; timeAgo: string; score: number }[];
};

const childrenData: Child[] = [
  { id: "alex", name: "Alex", age: 7, avatar: "👦",
    stats: { lessonsCompleted: 47, learningHours: "23h 15m", avgProgress: 65, currentStreak: 12 },
    subjectProgress: [
      { subject: "Maths", progress: 80, color: "#F97316" },
      { subject: "English", progress: 65, color: "#EA580C" },
      { subject: "Science", progress: 55, color: "#F59E0B" },
      { subject: "Geography", progress: 45, color: "#3B82F6" },
      { subject: "History", progress: 35, color: "#10B981" },
    ],
    recentLessons: [
      { topic: "Dinosaurs & Addition", emoji: "🦕", subject: "Maths", timeAgo: "2 hours ago", score: 92 },
      { topic: "Continents of the World", emoji: "🌍", subject: "Geography", timeAgo: "Yesterday", score: 85 },
      { topic: "Story Writing: Space Adventure", emoji: "🚀", subject: "English", timeAgo: "2 days ago", score: 78 },
    ],
  },
  { id: "mia", name: "Mia", age: 9, avatar: "👧",
    stats: { lessonsCompleted: 32, learningHours: "16h 40m", avgProgress: 42, currentStreak: 8 },
    subjectProgress: [
      { subject: "Maths", progress: 50, color: "#F97316" },
      { subject: "English", progress: 55, color: "#EA580C" },
      { subject: "Science", progress: 40, color: "#F59E0B" },
      { subject: "Computing", progress: 60, color: "#8B5CF6" },
    ],
    recentLessons: [
      { topic: "Space & Multiplication", emoji: "🌌", subject: "Maths", timeAgo: "1 hour ago", score: 88 },
      { topic: "Creative Writing: Fantasy World", emoji: "📝", subject: "English", timeAgo: "Yesterday", score: 91 },
      { topic: "Solar System Exploration", emoji: "🪐", subject: "Science", timeAgo: "3 days ago", score: 76 },
    ],
  },
];

export default function DemoPage() {
  const [activeChild, setActiveChild] = useState(childrenData[0]);
  const [activeTab, setActiveTab] = useState<"dashboard" | "signup" | "questionnaire" | "pricing">("dashboard");
  const [questionStep, setQuestionStep] = useState(0);

  const child = activeChild;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Demo Banner ── */}
      <div className="bg-gradient-to-r from-primary to-secondary px-4 py-2 text-center text-sm text-white">
        🎯 <strong>Demo Mode</strong> — This is a live demonstration.{" "}
        <Link href="/sign-up" className="underline font-semibold">Try the real thing</Link> or{" "}
        <Link href="/pricing" className="underline font-semibold">see pricing</Link>.
      </div>

      {/* ── Header ── */}
      <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/images/kokolearn-logo.png" alt="KokoLearn" width={44} height={44} className="drop-shadow-sm" />
          </Link>
          <div className="flex items-center gap-2 overflow-x-auto">
            {(["dashboard", "signup", "questionnaire", "pricing"] as const).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                  activeTab === tab ? "bg-primary text-white shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {tab === "dashboard" && "📊 Dashboard"}
                {tab === "signup" && "✍️ Sign-up Flow"}
                {tab === "questionnaire" && "📋 Questionnaire"}
                {tab === "pricing" && "💰 Pricing"}
              </button>
            ))}
            <Link href="/sign-up" className="ml-2 rounded-xl bg-gradient-to-r from-primary to-secondary px-4 py-1.5 text-xs font-semibold text-white shadow-sm">
              Try Free →
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

        {/* ═══ DASHBOARD TAB ═══ */}
        {activeTab === "dashboard" && (
          <>
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Welcome back, Sarah! 👋</h1>
                <p className="mt-1 text-sm text-gray-500">Here&apos;s {child.name}&apos;s learning overview.</p>
                <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-medium text-amber-700">
                  <Crown className="h-3 w-3" />
                  <span>Free Trial — <button onClick={() => setActiveTab("pricing")} className="underline font-semibold hover:text-amber-800">Subscribe to unlock unlimited lessons</button></span>
                </div>
              </div>
            </div>

            {/* Child Selector */}
            <div className="mb-6 flex flex-wrap items-center gap-2">
              {childrenData.map((c) => (
                <button key={c.id} onClick={() => setActiveChild(c)}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                    activeChild.id === c.id
                      ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/20"
                      : "bg-white border border-gray-200 text-gray-600 hover:border-primary/30"
                  }`}
                >
                  <span className="text-lg">{c.avatar}</span> {c.name} <span className="text-xs opacity-60">age {c.age}</span>
                </button>
              ))}
              <button className="inline-flex items-center gap-1.5 rounded-full border-2 border-dashed border-gray-300 px-4 py-2 text-sm font-medium text-gray-400 hover:border-primary/50 hover:text-primary">
                <Plus className="h-4 w-4" /> Add Child
              </button>
            </div>

            {/* Stats */}
            <div className="mb-8 grid gap-4 grid-cols-2 lg:grid-cols-4">
              {[
                { icon: <BookOpen className="h-5 w-5" />, label: "Lessons Completed", value: child.stats.lessonsCompleted, bg: "bg-primary-50", color: "text-primary" },
                { icon: <Clock className="h-5 w-5" />, label: "Learning Hours", value: child.stats.learningHours, bg: "bg-amber-50", color: "text-amber-600" },
                { icon: <TrendingUp className="h-5 w-5" />, label: "Avg. Progress", value: `${child.stats.avgProgress}%`, bg: "bg-emerald-50", color: "text-emerald-600" },
                { icon: <Flame className="h-5 w-5" />, label: "Current Streak", value: `${child.stats.currentStreak} days`, bg: "bg-red-50", color: "text-red-500" },
              ].map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.bg}`}>
                      <span className={stat.color}>{stat.icon}</span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
                      <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Subject + Recent */}
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                  <Target className="h-5 w-5 text-secondary" /> Subject Breakdown
                </h2>
                <div className="space-y-4">
                  {child.subjectProgress.map((s) => (
                    <div key={s.subject}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">{s.subject}</span>
                        <span className="text-xs font-semibold text-gray-400">{s.progress}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{ width: `${s.progress}%`, background: s.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                  <Zap className="h-5 w-5 text-amber-500" /> Recent Lessons
                </h2>
                <div className="space-y-3">
                  {child.recentLessons.map((lesson) => (
                    <div key={lesson.topic} className="flex items-center gap-3 rounded-xl border border-gray-100 p-3 hover:border-primary/20 transition-all">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-xl">{lesson.emoji}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{lesson.topic}</p>
                        <p className="text-xs text-gray-400">{lesson.subject} · {lesson.timeAgo}</p>
                      </div>
                      <div className={`text-sm font-bold ${lesson.score >= 80 ? "text-emerald-600" : "text-amber-600"}`}>{lesson.score}%</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* ═══ SIGN-UP FLOW TAB ═══ */}
        {activeTab === "signup" && (
          <div className="max-w-lg mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Demo: Sign-up Flow</h1>
              <p className="mt-2 text-gray-500">This shows what parents see when they create an account.</p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50">
                  <Sparkles className="h-7 w-7 text-primary" />
                </div>
                <h2 className="mt-4 text-xl font-bold text-gray-900">Start Your FREE 24 Hour Trial</h2>
                <p className="mt-1 text-sm text-gray-500">No credit card required.</p>
              </div>

              <div className="mt-6 space-y-3">
                {[
                  { label: "Parent name", demo: "Sarah Jones", icon: "👤" },
                  { label: "Email address", demo: "sarah@example.com", icon: "📧" },
                  { label: "Password", demo: "••••••••", icon: "🔒" },
                ].map((field) => (
                  <div key={field.label} className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50/50 p-4">
                    <span className="text-lg">{field.icon}</span>
                    <div>
                      <p className="text-xs text-gray-400">{field.label}</p>
                      <p className="text-sm font-semibold text-gray-700">{field.demo}</p>
                    </div>
                    <Check className="ml-auto h-4 w-4 text-green-500" />
                  </div>
                ))}
              </div>

              <button className="mt-6 w-full rounded-xl bg-gradient-to-r from-gray-300 to-gray-400 py-3 text-sm font-semibold text-white cursor-not-allowed flex items-center justify-center gap-2">
                <Sparkles className="h-4 w-4" />
                Start Learning Free →
              </button>

              <div className="mt-6 rounded-xl bg-amber-50 border border-amber-200 p-4">
                <p className="text-xs text-amber-800 font-medium">🔑 Demo account:</p>
                <p className="text-sm text-amber-700 mt-1">Email: <strong>mark.fenty@gmail.com</strong><br />Password: <strong>KokoDemo24!</strong></p>
                <Link href="/sign-in" className="mt-2 inline-block text-xs font-semibold text-primary underline">Try signing in now →</Link>
              </div>
            </div>

            {/* Flow arrows */}
            <div className="flex items-center justify-center gap-4 mt-8 text-sm text-gray-400">
              <span className="rounded-full bg-primary-50 text-primary px-3 py-1 font-semibold">1. Sign up</span>
              <ChevronRight className="h-4 w-4" />
              <span className="rounded-full bg-gray-100 text-gray-500 px-3 py-1">2. Confirm email</span>
              <ChevronRight className="h-4 w-4" />
              <span className="rounded-full bg-gray-100 text-gray-500 px-3 py-1">3. Dashboard</span>
              <ChevronRight className="h-4 w-4" />
              <span className="rounded-full bg-gray-100 text-gray-500 px-3 py-1">4. Subscribe</span>
            </div>
          </div>
        )}

        {/* ═══ QUESTIONNAIRE TAB ═══ */}
        {activeTab === "questionnaire" && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Demo: Child Setup Questionnaire</h1>
              <p className="mt-2 text-gray-500">Parents fill this in during onboarding — it tailors lessons to each child.</p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              {/* Stepper */}
              <div className="flex items-center justify-center gap-2 mb-8">
                {["Child Profile", "Interests", "Subjects", "Goals"].map((step, i) => (
                  <div key={step} className={`flex items-center gap-1.5 ${i <= questionStep ? "text-primary" : "text-gray-300"}`}>
                    <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                      i < questionStep ? "bg-primary text-white" : i === questionStep ? "border-2 border-primary text-primary" : "border-2 border-gray-200 text-gray-300"
                    }`}>{i + 1}</div>
                    <span className="text-xs font-medium hidden sm:inline">{step}</span>
                    {i < 3 && <ChevronRight className="h-3 w-3" />}
                  </div>
                ))}
              </div>

              {/* Step Content */}
              {questionStep === 0 && (
                <div className="space-y-4">
                  <h3 className="font-bold text-gray-900 text-lg">About Your Child</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {["👦 Boy", "👧 Girl", "⚧ Other", "🤫 Prefer not to say"].map((opt) => (
                      <button key={opt} className={`rounded-xl border p-3 text-sm font-medium transition-all text-left ${
                        opt === "👦 Boy" ? "border-primary/30 bg-primary-50 text-primary" : "border-gray-200 text-gray-600 hover:border-primary/30"
                      }`}>{opt}</button>
                    ))}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Child&apos;s name</label>
                    <input type="text" value="Alex" readOnly className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm bg-gray-50 text-gray-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                    <div className="flex gap-2">
                      {[5, 6, 7, 8, 9, 10, 11].map((age) => (
                        <button key={age} className={`h-10 w-10 rounded-xl text-sm font-semibold transition-all ${
                          age === 7 ? "bg-primary text-white shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}>{age}</button>
                      ))}
                    </div>
                  </div>
                  <button onClick={() => setQuestionStep(1)} className="mt-4 w-full rounded-xl bg-gradient-to-r from-primary to-secondary py-3 text-sm font-semibold text-white shadow-lg">
                    Next Step →
                  </button>
                </div>
              )}

              {questionStep === 1 && (
                <div className="space-y-4">
                  <h3 className="font-bold text-gray-900 text-lg">What Does Alex Love?</h3>
                  <p className="text-sm text-gray-500">We turn their interests into lessons! Pick a few:</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {["🦖 Dinosaurs", "🚀 Space", "🐶 Animals", "🏰 Knights", "🌊 Oceans", "🎨 Art", "🎵 Music", "⚽ Sports", "🤖 Robots", "🌍 Countries", "🔬 Science", "📖 Stories"].map((interest) => (
                      <button key={interest}
                        className={`rounded-xl border p-3 text-sm font-medium transition-all ${
                          ["🦖 Dinosaurs", "🚀 Space", "🌊 Oceans"].includes(interest)
                            ? "border-primary/30 bg-primary-50 text-primary"
                            : "border-gray-200 text-gray-600 hover:border-gray-300"
                        }`}
                      >{interest}</button>
                    ))}
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button onClick={() => setQuestionStep(0)} className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-600">← Back</button>
                    <button onClick={() => setQuestionStep(2)} className="flex-[2] rounded-xl bg-gradient-to-r from-primary to-secondary py-3 text-sm font-semibold text-white shadow-lg">Next Step →</button>
                  </div>
                </div>
              )}

              {questionStep === 2 && (
                <div className="space-y-4">
                  <h3 className="font-bold text-gray-900 text-lg">Subjects to Focus On</h3>
                  <p className="text-sm text-gray-500">We&apos;ll prioritise these in Alex&apos;s lessons:</p>
                  <div className="space-y-3">
                    {[
                      { name: "Maths", level: "⭐ Confident", color: "text-emerald-600" },
                      { name: "English", level: "📈 Improving", color: "text-amber-600" },
                      { name: "Science", level: "📈 Improving", color: "text-amber-600" },
                      { name: "Geography", level: "🌱 Needs practice", color: "text-blue-600" },
                    ].map((subj) => (
                      <div key={subj.name} className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50/50 p-4">
                        <span className="font-semibold text-gray-900">{subj.name}</span>
                        <span className={`text-xs font-medium ${subj.color}`}>{subj.level}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button onClick={() => setQuestionStep(1)} className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-600">← Back</button>
                    <button onClick={() => setQuestionStep(3)} className="flex-[2] rounded-xl bg-gradient-to-r from-primary to-secondary py-3 text-sm font-semibold text-white shadow-lg">Next Step →</button>
                  </div>
                </div>
              )}

              {questionStep === 3 && (
                <div className="space-y-4 text-center">
                  <div className="flex justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                      <Check className="h-8 w-8 text-green-600" />
                    </div>
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg">All Set! 🎉</h3>
                  <p className="text-sm text-gray-500">KokoLearn will create personalised lessons for Alex based on their interests and needs.</p>
                  <div className="rounded-xl bg-primary-50 border border-primary-100 p-4 text-left">
                    <p className="text-xs font-semibold text-primary mb-2">🎯 Alex&apos;s Learning Plan</p>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Weekly focus: Maths &amp; English (KS1)</li>
                      <li>• Interest-driven: Dinosaur maths, space stories</li>
                      <li>• 2 personalised lessons in the free trial</li>
                    </ul>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button onClick={() => setQuestionStep(0)} className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-600">Start Over</button>
                    <Link href="/demo" className="flex-[2] rounded-xl bg-gradient-to-r from-primary to-secondary py-3 text-sm font-semibold text-white shadow-lg text-center">View Dashboard →</Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ═══ PRICING TAB ═══ */}
        {activeTab === "pricing" && (
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold text-gray-900">Simple Pricing</h1>
              <p className="mt-2 text-gray-500">Start free, upgrade when you&apos;re ready.</p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {[
                { name: "24 Hour Trial", price: "£0", period: "24 hours", badge: "FREE", color: "bg-green-100 text-green-700",
                  features: ["2 personalised lessons", "Voice narration", "Basic progress", "1 child"],
                  popular: false, cta: "Try Free", href: "/sign-up" },
                { name: "Premium", price: "£9.99", period: "per month", badge: "Most Popular", color: "bg-primary-100 text-primary",
                  features: ["Unlimited lessons", "PDF reports", "Full curriculum", "AI tutor chat", "1 child", "Email support"],
                  popular: true, cta: "Subscribe", href: "/sign-up?plan=premium" },
                { name: "Family", price: "£19.99", period: "per month", badge: "Best Value", color: "bg-secondary-100 text-secondary",
                  features: ["Everything in Premium", "Up to 4 children", "Individual tracking", "Family dashboard", "Priority support"],
                  popular: false, cta: "Subscribe", href: "/sign-up?plan=family" },
              ].map((plan) => (
                <div key={plan.name} className={`relative rounded-2xl border bg-white p-8 shadow-sm ${
                  plan.popular ? "border-primary/30 ring-2 ring-primary/20 scale-105 lg:scale-110" : "border-gray-200"
                }`}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-primary to-secondary px-4 py-1 text-xs font-semibold text-white shadow-lg">
                        <Star className="h-3 w-3 fill-white" /> {plan.badge}
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
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-600">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href={plan.href} className={`mt-8 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-all ${
                    plan.popular
                      ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg hover:shadow-xl"
                      : "border border-gray-200 text-gray-700 hover:border-primary/30"
                  }`}>
                    {plan.cta} →</Link>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
