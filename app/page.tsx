"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  BookOpen,
  Brain,
  ArrowRight,
  Menu,
  X,
  Star,
  ChevronRight,
  MessageCircle,
  BookMarked,
  LayoutDashboard,
  Gamepad2,
  Heart,
  Clock,
  Shield,
  Users,
  CheckCircle2,
  Home as HomeIco,
  Sun,
  Award,
  Smile,
  TrendingUp,
  Target,
  Globe,
  GraduationCap,
  Lightbulb,
  BarChart3,
  RefreshCw,
  Zap,
  Mic,
} from "lucide-react";


// ── Scroll Fade-in ──
function FadeInSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}>
      {children}
    </div>
  );
}

export default function Home() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-full flex-col bg-gradient-to-b from-primary-50 via-white to-primary-50/30">
      {/* ── HEADER ── */}
      <header className="sticky top-0 z-50 w-full border-b border-primary-100/30 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/images/kokolearn-full-logo-lg.webp" alt="KokoLearn.org" width={144} height={144} className="drop-shadow-md" />
          </Link>
          <nav className="hidden items-center gap-8 sm:flex">
            <Link href="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">How It Works</Link>
            <Link href="#features" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">Features</Link>
            <Link href="#pricing" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">Pricing</Link>
            <Link href="/curriculum" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">Curriculum</Link>
            <Link href="/blog" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">Blog</Link>
            <Link href="/for-organisations" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">Institutions</Link>
            <Link href="/sign-in" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">Sign In</Link>
            <Link href="/sign-up" className="rounded-xl bg-gradient-to-r from-primary to-secondary px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 transition-all">FREE TRIAL</Link>
          </nav>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="sm:hidden rounded-lg p-2 text-gray-600 hover:bg-gray-100">
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        {mobileOpen && (
          <div className="border-t border-primary-100/30 bg-white px-4 pb-6 pt-4 sm:hidden animate-fade-in">
            <nav className="flex flex-col gap-3">
              <Link href="#how-it-works" className="text-sm font-medium text-gray-600 py-2" onClick={() => setMobileOpen(false)}>How It Works</Link>
              <Link href="#features" className="text-sm font-medium text-gray-600 py-2" onClick={() => setMobileOpen(false)}>Features</Link>
              <Link href="#pricing" className="text-sm font-medium text-gray-600 py-2" onClick={() => setMobileOpen(false)}>Pricing</Link>
              <Link href="/curriculum" className="text-sm font-medium text-gray-600 py-2" onClick={() => setMobileOpen(false)}>Curriculum</Link>
              <Link href="/blog" className="text-sm font-medium text-gray-600 py-2" onClick={() => setMobileOpen(false)}>Blog</Link>
              <Link href="/for-organisations" className="text-sm font-medium text-gray-600 py-2" onClick={() => setMobileOpen(false)}>Institutions</Link>
              <Link href="/sign-in" className="text-sm font-medium text-gray-600 py-2">Sign In</Link>
              <Link href="/sign-up" className="rounded-xl bg-gradient-to-r from-primary to-secondary px-5 py-2.5 text-center text-sm font-semibold text-white">FREE TRIAL</Link>
            </nav>
          </div>
        )}
      </header>

      {/* ═══════════════════════════════════════════════════════
         HERO — REPOSITIONED
         ═══════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none">
            <Image src="/images/presenter-001.webp" alt="" width={140} height={140} className="object-contain opacity-90" />
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div className="animate-slide-up">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Link href="/curriculum" className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-4 py-1.5 text-sm font-medium text-primary hover:bg-primary-100 transition-all">
                  <Sparkles className="h-4 w-4" />
                  KS1 & KS2 Curriculum Aligned
                </Link>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm font-medium text-emerald-700">
                  👶 Ages 5–11
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-200 bg-purple-50 px-4 py-1.5 text-sm font-medium text-purple-700">
                  🌈 SEND Friendly
                </span>
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-5xl leading-tight">
                Helping children thrive through{" "}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  personalised learning
                </span>
              </h1>
              <p className="mt-4 text-lg leading-relaxed text-gray-600 max-w-xl">
                Supporting ages 5–11 and SEND learners with curriculum-aligned lessons 
                that adapt to every child&apos;s unique learning journey. Building confidence, 
                progress, and a love of learning.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link href="/sign-up" className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-secondary px-6 py-3 text-base font-semibold text-white shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 transition-all">
                  Start Your Child&apos;s Learning Journey
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="#how-it-works" className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white/80 px-6 py-3 text-base font-semibold text-gray-700 hover:border-primary/30 hover:text-primary transition-all backdrop-blur-sm">
                  Discover How It Works <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
              <p className="mt-3 flex items-center gap-1.5 text-xs text-gray-500">
                <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-green-50 text-xs text-green-600 font-bold">✓</span>
                No credit card required. Full access for 24 hours.
              </p>
            </div>
            <div className="relative animate-fade-in">
              <div className="relative mx-auto w-full max-w-lg">
                <Image
                  src="/images/hero-pixar.png"
                  alt="Children learning with KokoLearn — personalised education for ages 5-11"
                  width={768}
                  height={512}
                  className="rounded-2xl shadow-2xl"
                  priority
                />
                <div className="absolute -top-4 -right-4 rounded-xl bg-gradient-to-r from-primary to-secondary px-4 py-2 text-white shadow-lg animate-float">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 fill-white" />
                    <span className="text-sm font-bold">Trusted by UK Parents</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUSTED BY ── */}
      <FadeInSection>
        <div className="border-y border-primary-100/30 bg-primary-50/30 py-4">
          <p className="text-center text-xs font-medium uppercase tracking-widest text-primary mb-2">Trusted by parents &amp; educators across the UK</p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {["National Curriculum", "UK Schools", "Parent Choice Award", "EduTech UK", "Ofsted Aligned"].map((name) => (
              <span key={name} className="text-sm font-semibold text-primary/60 uppercase tracking-wider">{name}</span>
            ))}
          </div>
        </div>
      </FadeInSection>

      {/* ═══════════════════════════════════════════════════════
         SEND FRIENDLY SECTION
         ═══════════════════════════════════════════════════════ */}
      <FadeInSection>
        <section className="bg-white/50 py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-8 lg:grid-cols-2">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700 mb-3">
                  SEND Friendly Learning Support
                </span>
                <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                  Supporting every child&apos;s unique learning journey
                </h2>
                <p className="mt-3 text-base text-gray-600 leading-relaxed">
                  KokoLearn.org helps support a wide range of learning needs through personalised 
                  learning pathways that adapt to individual learning styles, pace and interests.
                </p>
                <p className="mt-3 text-base text-gray-600 leading-relaxed">
                  Suitable for learners who may benefit from additional support including:
                </p>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {["ADHD", "Autism", "Dyslexia", "Dyspraxia", "Processing difficulties", "Anxiety related challenges"].map((need) => (
                    <div key={need} className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 shadow-sm border border-primary-100/20">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{need}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-xs text-gray-400 italic">
                  KokoLearn.org is an educational support platform and is not a medical or diagnostic service.
                </p>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-purple-50 to-primary-50 p-6 shadow-sm">
                <div className="space-y-3">
                  <div className="flex items-start gap-3 rounded-xl bg-white p-4 shadow-sm">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 flex-shrink-0"><RefreshCw className="h-5 w-5 text-purple-600" /></div>
                    <div><p className="text-sm font-semibold text-gray-900">Adapts to learning pace</p><p className="text-xs text-gray-500">Lessons move at your child&apos;s speed, not a class timetable</p></div>
                  </div>
                  <div className="flex items-start gap-3 rounded-xl bg-white p-4 shadow-sm">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 flex-shrink-0"><Sun className="h-5 w-5 text-primary" /></div>
                    <div><p className="text-sm font-semibold text-gray-900">Interest-led engagement</p><p className="text-xs text-gray-500">Learning through what your child loves — not what fits a curriculum schedule</p></div>
                  </div>
                  <div className="flex items-start gap-3 rounded-xl bg-white p-4 shadow-sm">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 flex-shrink-0"><Shield className="h-5 w-5 text-emerald-600" /></div>
                    <div><p className="text-sm font-semibold text-gray-900">Positive encouragement</p><p className="text-xs text-gray-500">Achievement rewards and encouraging feedback build confidence</p></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* ═══════════════════════════════════════════════════════
         CURRICULUM ALIGNMENT SECTION
         ═══════════════════════════════════════════════════════ */}
      <FadeInSection>
        <section className="bg-primary-50/20 py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-8">
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">Curriculum Alignment</span>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Aligned To The UK National Curriculum</h2>
              <p className="mt-2 text-base text-gray-600">
                Learning activities and assessments are designed to reinforce key curriculum 
                objectives for KS1 and KS2 learners.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { icon: <BookOpen className="h-6 w-6 text-primary" />, subject: "English", topics: "Reading, writing, grammar, comprehension" },
                { icon: <BookOpen className="h-6 w-6 text-secondary" />, subject: "Mathematics", topics: "Number, algebra, geometry, statistics" },
                { icon: <Brain className="h-6 w-6 text-emerald-600" />, subject: "Science", topics: "Biology, chemistry, physics " },
                { icon: <Globe className="h-6 w-6 text-purple-600" />, subject: "Geography", topics: "Physical, human geography, map skills" },
                { icon: <GraduationCap className="h-6 w-6 text-primary" />, subject: "History", topics: "British history, world history" },
                { icon: <Lightbulb className="h-6 w-6 text-secondary" />, subject: "Computing & AI", topics: "Digital literacy, programming, online safety" },
              ].map((s) => (
                <div key={s.subject} className="flex items-start gap-3 rounded-xl bg-white p-4 shadow-sm border border-primary-100/20 hover:shadow-md transition-all">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 flex-shrink-0">{s.icon}</div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">{s.subject}</h3>
                    <p className="text-xs text-gray-500">{s.topics}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">Covers KS1 and KS2 (ages 5-11). Future subjects can be added through platform expansion.</p>
              <Link href="/curriculum" className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-secondary hover:text-primary transition-colors">
                View full curriculum details <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* ═══════════════════════════════════════════════════════
         PARENT BENEFITS
         ═══════════════════════════════════════════════════════ */}
      <FadeInSection>
        <section className="bg-white/50 py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-8">
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">For Parents</span>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Designed For Busy Families</h2>
              <p className="mt-2 text-base text-gray-600">Support your child&apos;s learning without adding stress to your day.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: <Clock className="h-6 w-6 text-primary" />, title: "Learn anytime", desc: "Fit learning around your family schedule — mornings, evenings, or weekends." },
                { icon: <Sun className="h-6 w-6 text-secondary" />, title: "Reduce homework stress", desc: "Turn frustrating homework battles into enjoyable learning moments." },
                { icon: <BarChart3 className="h-6 w-6 text-emerald-600" />, title: "Track progress", desc: "See exactly how your child is progressing across every subject." },
                { icon: <HomeIco className="h-6 w-6 text-purple-600" />, title: "Support learning at home", desc: "Feel confident helping your child, even if you&apos;re not a teacher." },
                { icon: <Award className="h-6 w-6 text-primary" />, title: "Build confidence", desc: "Celebrate achievements and watch your child&apos;s self-belief grow." },
                { icon: <RefreshCw className="h-6 w-6 text-secondary" />, title: "Flexible around schedules", desc: "No fixed class times. Pause, rewind, and revisit whenever you need." },
                { icon: <Users className="h-6 w-6 text-emerald-600" />, title: "Personalised for each child", desc: "Each child gets their own learning path, even on one account." },
                { icon: <Heart className="h-6 w-6 text-purple-600" />, title: "Peace of mind", desc: "Safe, ad-free, and parent-controlled. No surprises." },
              ].map((b) => (
                <div key={b.title} className="flex flex-col items-center text-center rounded-xl bg-white p-5 shadow-sm border border-primary-100/20 hover:shadow-md transition-all">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50">{b.icon}</div>
                  <h3 className="mt-3 text-sm font-semibold text-gray-900">{b.title}</h3>
                  <p className="mt-1 text-xs text-gray-500">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* ═══════════════════════════════════════════════════════
         CHILD BENEFITS
         ═══════════════════════════════════════════════════════ */}
      <FadeInSection>
        <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-8 lg:grid-cols-2">
              <div>
                <span className="text-xs font-semibold uppercase tracking-widest text-primary">For Children</span>
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Built Around Your Child</h2>
                <p className="mt-2 text-base text-gray-600">Every child learns differently. KokoLearn adapts to them — not the other way around.</p>
                <div className="mt-4 space-y-3">
                  {[
                    { icon: <Target className="h-5 w-5 text-primary" />, text: "Learn at their own pace — no rushing, no waiting" },
                    { icon: <Lightbulb className="h-5 w-5 text-secondary" />, text: "Personalised lessons built around their interests" },
                    { icon: <Gamepad2 className="h-5 w-5 text-emerald-600" />, text: "Interactive learning that feels like play" },
                    { icon: <Smile className="h-5 w-5 text-purple-600" />, text: "Positive encouragement at every step" },
                    { icon: <Award className="h-5 w-5 text-primary" />, text: "Achievement rewards that celebrate progress" },
                    { icon: <TrendingUp className="h-5 w-5 text-secondary" />, text: "Increased confidence as skills grow" },
                    { icon: <Sun className="h-5 w-5 text-emerald-600" />, text: "Enjoy learning again — rediscover the joy" },
                  ].map((b) => (
                    <div key={b.text} className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/80 flex-shrink-0 shadow-sm">{b.icon}</div>
                      <span className="text-sm text-gray-700">{b.text}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="rounded-2xl bg-white p-6 shadow-lg border border-primary-100/20">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-white text-lg font-bold">⭐</div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">What children say</p>
                      <p className="text-xs text-gray-500">Real feedback from young learners</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {[
                      { quote: "I like that it doesn't tell me I'm wrong. It just helps me try again.", age: "Age 8" },
                      { quote: "Mum says I actually ask to do learning now. I like the stars!", age: "Age 7" },
                      { quote: "The dinosaur maths is my favourite. I learned times tables without noticing.", age: "Age 9" },
                    ].map((t) => (
                      <div key={t.quote} className="rounded-lg bg-primary-50/50 p-3">
                        <p className="text-sm text-gray-700">&ldquo;{t.quote}&rdquo;</p>
                        <p className="text-xs text-gray-400 mt-1">— {t.age}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* ═══════════════════════════════════════════════════════
         LEARNING ASSESSMENT WORKFLOW (was How It Works)
         ═══════════════════════════════════════════════════════ */}
      <section id="how-it-works" className="bg-white/50 py-12 relative scroll-mt-24">
        <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
          <Image src="/images/presenter-002.webp" alt="" width={130} height={200} className="object-contain opacity-85" />
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeInSection>
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">How It Works</span>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">A Simple Learning Journey</h2>
              <p className="mt-2 text-base text-gray-600">From first check to confident learner — in five simple steps.</p>
            </div>
          </FadeInSection>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { step: "01", icon: <CheckCircle2 className="h-7 w-7 text-primary" />, title: "Complete a short learning check", desc: "During sign-up, you tell us your child's name, age, year group, interests, and any learning needs. This automatically sets their starting point.", color: "bg-primary-50" },
              { step: "02", icon: <Target className="h-7 w-7 text-secondary" />, title: "Identify strengths & areas", desc: "The system cross-references your child's year group against UK National Curriculum objectives to identify expected learning outcomes.", color: "bg-secondary-50" },
              { step: "03", icon: <RefreshCw className="h-7 w-7 text-emerald-600" />, title: "Generate a personalised pathway", desc: "AI creates a unique learning pathway that combines your child's interests with curriculum requirements.", color: "bg-emerald-50" },
              { step: "04", icon: <Brain className="h-7 w-7 text-purple-600" />, title: "Adaptive lessons & activities", desc: "Lessons adapt in real time — questions adjust difficulty based on answers, and Prof. Koko provides help when needed.", color: "bg-purple-50" },
              { step: "05", icon: <Award className="h-7 w-7 text-primary" />, title: "Track progress & celebrate", desc: "Dashboard shows lesson history, star ratings, achievement badges, and subject breakdown for both parents and children.", color: "bg-primary-50" },
            ].map((step, i) => (
              <FadeInSection key={step.title}>
                <div className="group rounded-2xl border border-primary-100/30 bg-white p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center">
                  <div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-xl ${step.color} mb-3 group-hover:scale-110 transition-transform`}>
                    {step.icon}
                  </div>
                  <div className="mx-auto mb-2 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-primary to-secondary text-2xs font-bold text-white">{step.step}</div>
                  <h3 className="text-sm font-semibold text-gray-900">{step.title}</h3>
                  <p className="mt-1 text-xs text-gray-500">{step.desc}</p>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
         WHY PARENTS CHOOSE (Trust Signals)
         ═══════════════════════════════════════════════════════ */}
      <FadeInSection>
        <section className="bg-primary-50/20 py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-8">
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">Why Parents Choose Us</span>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Trusted by UK Families</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { icon: <Globe className="h-6 w-6 text-primary" />, title: "UK focused learning", desc: "Content built around the UK National Curriculum, not a generic international programme." },
                { icon: <BookOpen className="h-6 w-6 text-secondary" />, title: "KS1 & KS2 curriculum support", desc: "Covers Maths, English, Science, Geography, History, and Computing." },
                { icon: <Heart className="h-6 w-6 text-purple-600" />, title: "SEND friendly design", desc: "Adaptive pathways that support a wide range of learning needs." },
                { icon: <Target className="h-6 w-6 text-emerald-600" />, title: "Personalised learning pathways", desc: "Every child gets a unique learning journey built around their interests." },
                { icon: <BarChart3 className="h-6 w-6 text-primary" />, title: "Parent progress tracking", desc: "Clear, simple reports so you always know how your child is doing." },
                { icon: <Shield className="h-6 w-6 text-secondary" />, title: "Safe online environment", desc: "Parent-controlled profiles, no advertising, no social features. Safe and secure." },
              ].map((t) => (
                <div key={t.title} className="flex items-start gap-3 rounded-xl bg-white p-4 shadow-sm border border-primary-100/20 hover:shadow-md transition-all">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 flex-shrink-0">{t.icon}</div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">{t.title}</h3>
                    <p className="text-xs text-gray-500">{t.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* ── FEATURES ── */}
      <section id="features" className="bg-white/50 py-8 relative overflow-hidden scroll-mt-24">
        <div className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none">
          <Image src="/images/presenter-003.webp" alt="" width={120} height={180} className="object-contain opacity-85" />
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeInSection>
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">Everything you need</span>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Powerful Features for Growing Minds</h2>
              <p className="mt-2 text-base text-gray-600">KokoLearn combines personalised learning with proven educational methods.</p>
            </div>
          </FadeInSection>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: <Brain className="h-7 w-7 text-primary" />, title: "Personalised lessons", desc: "Every lesson adapts to your child's interests, strengths, and areas for improvement." },
              { icon: <Sparkles className="h-7 w-7 text-secondary" />, title: "Interest-led learning", desc: "From dinosaurs to space — lessons are built around what your child loves." },
              { icon: <TrendingUp className="h-7 w-7 text-emerald-600" />, title: "Progress tracking", desc: "Detailed reports showing progress across subjects and National Curriculum objectives." },
              { icon: <Users className="h-7 w-7 text-purple-600" />, title: "Multiple children", desc: "One account covers the whole family. Each child gets their own learning path." },
              { icon: <MessageCircle className="h-7 w-7 text-primary" />, title: "Learning support chat", desc: "Real-time Q&A with Prof. Koko. Your child gets instant help and encouragement." },
              { icon: <BookMarked className="h-7 w-7 text-secondary" />, title: "Curriculum matching", desc: "Exactly follows UK National Curriculum (KS1-KS2) — covering all core subjects." },
              { icon: <LayoutDashboard className="h-7 w-7 text-emerald-600" />, title: "Parent dashboard", desc: "Real-time insights and weekly reports so you always know how they're progressing." },
              { icon: <Gamepad2 className="h-7 w-7 text-purple-600" />, title: "Interactive quizzes", desc: "Gamified learning with rewards, stars, and achievements — practice that feels like play!" },
            ].map((f, i) => (
              <FadeInSection key={f.title}>
                <div className="group rounded-2xl bg-white p-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-primary-100/20">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 group-hover:scale-110 transition-transform duration-300">{f.icon}</div>
                  <h3 className="mt-2 text-sm font-semibold text-gray-900">{f.title}</h3>
                  <p className="mt-0.5 text-xs text-gray-600 leading-relaxed">{f.desc}</p>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <FadeInSection>
        <div className="bg-gradient-to-r from-primary to-secondary py-6 relative overflow-hidden">
          <div className="hidden lg:block absolute right-10 top-1/2 -translate-y-1/2 pointer-events-none">
            <Image src="/images/presenter-004.webp" alt="" width={120} height={120} className="object-contain opacity-85" />
          </div>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-4 text-center lg:grid-cols-4">
              {[
                { number: "10,000+", label: "Lessons created" },
                { number: "5,000+", label: "Happy students" },
                { number: "95%", label: "Engagement rate" },
                { number: "4.9★", label: "Parent rating" },
              ].map((stat) => (
                <div key={stat.label} className="animate-pulse-soft">
                  <div className="text-2xl font-bold text-white sm:text-3xl">{stat.number}</div>
                  <div className="mt-0.5 text-xs text-primary-100">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </FadeInSection>

      {/* ═══════════════════════════════════════════════════════
         FUTURE ROADMAP
         ═══════════════════════════════════════════════════════ */}
      <FadeInSection>
        <section className="bg-primary-50/20 py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-6">
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">Coming Soon</span>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">On Our Roadmap</h2>
              <p className="mt-2 text-sm text-gray-500">We&apos;re building more ways to support your child&apos;s learning journey.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: <GraduationCap />, title: "KS3 support", desc: "Expanding to Key Stage 3" },
                { icon: <Mic />, title: "Speech assistance", desc: "Voice-based learning support" },
                { icon: <BookOpen />, title: "Reading assistant", desc: "Guided reading practice" },
                { icon: <Brain />, title: "Parent AI coach", desc: "Personalised advice for parents" },
                { icon: <Award />, title: "Progress certificates", desc: "Formal achievement recognition" },
                { icon: <BarChart3 />, title: "Teacher reports", desc: "School-ready progress summaries" },
              ].map((f) => (
                <div key={f.title} className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm border border-dashed border-primary-100/30 opacity-75">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-400">{f.icon}</div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500">{f.title}</h3>
                    <p className="text-xs text-gray-400">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* ── PRICING ── */}
      <section id="pricing" className="bg-white/50 py-8 scroll-mt-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeInSection>
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">Pricing</span>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Simple, Transparent Pricing</h2>
              <p className="mt-2 text-base text-gray-600">Try free for 24 hours. Upgrade when you&apos;re ready. No hidden fees, no credit card required.</p>
            </div>
          </FadeInSection>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { name: "24 Hour Trial", price: "£0", period: "24 hours free", popular: false, features: ["3 personalised lessons", "Voice narration", "Basic progress tracking"] },
              { name: "Premium", price: "£9.99", period: "per month", popular: true, features: ["Unlimited lessons", "Voice narration", "Full progress reports", "1 child"] },
              { name: "Family", price: "£19.99", period: "per month", popular: false, features: ["Everything in Premium", "Up to 4 children", "Shared dashboard", "Priority support"] },
            ].map((plan) => (
              <FadeInSection key={plan.name}>
                <div className={`relative rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${plan.popular ? "border-2 border-primary bg-white shadow-lg shadow-primary/10" : "border border-primary-100/30 bg-white shadow-sm hover:shadow-md"}`}>
                  {plan.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary to-secondary px-4 py-1 text-xs font-semibold text-white shadow-lg">
                      Most Popular
                    </span>
                  )}
                  <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-xs text-gray-500">/{plan.period}</span>
                  </div>
                  <ul className="mt-4 space-y-2 text-sm text-gray-600">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2">
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary-50 text-primary"><span className="text-2xs">✓</span></span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link href="/sign-up" className={`mt-4 block rounded-xl px-5 py-2.5 text-center text-sm font-semibold transition-all ${plan.popular ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/25 hover:shadow-xl" : "border border-primary text-primary hover:bg-primary-50"}`}>
                    Start Your Journey
                  </Link>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="bg-primary-50/20 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeInSection>
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-xs font-semibold uppercase tracking-widest text-accent">Testimonials</span>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">What Parents Say</h2>
            </div>
          </FadeInSection>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {[
              { quote: "My son loves dinosaurs and used to hate maths. KokoLearn turned it into a Jurassic adventure — now he asks to do maths!", name: "Sarah", role: "Parent of 7-year-old" },
              { quote: "The voice narration is a game-changer for my dyslexic daughter. She can finally learn independently without frustration.", name: "James", role: "Parent of 9-year-old" },
              { quote: "We have four kids and one account. The individual learning paths mean everyone gets what they need, when they need it.", name: "Priya", role: "Parent of 4 children" },
            ].map((t) => (
              <FadeInSection key={t.name}>
                <div className="rounded-2xl bg-white p-4 shadow-sm hover:shadow-lg transition-all duration-300 border border-primary-100/20">
                  <div className="flex gap-1 mb-2">{[...Array(5)].map((_, j) => <Star key={j} className="h-3 w-3 fill-yellow-400 text-yellow-400" />)}</div>
                  <p className="text-sm text-gray-600 leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                  <div className="mt-3 flex items-center gap-2">
                    <div className="relative h-9 w-9 overflow-hidden rounded-full border-2 border-primary-200">
                      <Image src={`/images/avatar-${t.name.toLowerCase()}.jpg`} alt={t.name} width={36} height={36} className="object-cover rounded-full" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                      <p className="text-xs text-gray-500">{t.role}</p>
                    </div>
                  </div>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <FadeInSection>
        <section className="relative overflow-hidden bg-gradient-to-r from-primary to-secondary py-10">
          <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">Start your child&apos;s personalised learning journey today</h2>
            <p className="mx-auto mt-2 max-w-2xl text-base text-white/80">Give your child the confidence to succeed. Try free for 24 hours — no credit card required.</p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link href="/sign-up" className="group inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-primary shadow-lg hover:bg-gray-100 hover:shadow-xl transition-all hover:-translate-y-0.5">
                Give Your Child The Confidence To Succeed <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="#how-it-works" className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-all">
                Discover A Smarter Way To Support Learning
              </Link>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* ── FOOTER ── */}
      <footer className="bg-gradient-to-b from-primary-50 to-white border-t border-primary-100/30 pt-4 pb-3">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="sm:col-span-2 lg:col-span-1">
              <Link href="/" className="inline-block">
                <Image src="/images/kokolearn-logo.png" alt="KokoLearn.org" width={80} height={80} className="object-contain" />
              </Link>
              <p className="mt-1 text-xs text-gray-500 leading-relaxed max-w-xs">
                Helping children thrive through personalised learning. Curriculum-aligned support for KS1, KS2 and SEND learners.
              </p>
              <p className="mt-1 text-xs text-gray-400">Operated by PAD-CIC and AiConsultancy.org.uk</p>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-primary">Product</h4>
              <ul className="mt-2 space-y-1.5 text-xs">
                {["How it works", "Features", "Pricing", "Curriculum", "Institutions"].map((l) => {
                    const href = l === "Institutions" ? "/for-organisations" : l === "Curriculum" ? "/curriculum" : `#${l.toLowerCase().replace(/\s+/g, "-")}`;
                    return (
                      <li key={l}><Link href={href} className="text-gray-500 hover:text-primary transition-colors">{l}</Link></li>
                    );
                  })}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-primary">Company</h4>
              <ul className="mt-2 space-y-1.5 text-xs">
                <li><Link href="/blog" className="text-gray-600 hover:text-primary transition-colors">Blog</Link></li>
                <li><Link href="/legal/faq" className="text-gray-600 hover:text-primary transition-colors">FAQ</Link></li>
                <li><a href="mailto:Support@AiConsultancy.org.uk?subject=KokoLearn%20Enquiry" className="text-gray-600 hover:text-primary transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-primary">Legal</h4>
              <ul className="mt-2 space-y-1.5 text-xs">
                <li><Link href="/legal/privacy" className="text-gray-600 hover:text-primary transition-colors">Privacy Policy</Link></li>
                <li><Link href="/legal/terms" className="text-gray-600 hover:text-primary transition-colors">Terms &amp; Conditions</Link></li>
                <li><Link href="/legal/child-safety" className="text-gray-600 hover:text-primary transition-colors">Child Safety Policy</Link></li>
                <li><Link href="/legal/refund" className="text-gray-600 hover:text-primary transition-colors">Refund Policy</Link></li>
                <li><Link href="/legal/cookies" className="text-gray-600 hover:text-primary transition-colors">Cookies Policy</Link></li>
                <li><Link href="/legal/faq" className="text-gray-600 hover:text-primary transition-colors">FAQ</Link></li>
              </ul>
              <div className="mt-4 pt-3 border-t border-primary-100">
                <Link href="https://AiConsultancy.org.uk" target="_blank" className="text-xs font-medium text-secondary hover:text-primary transition-colors flex items-center gap-1">
                  Built with support from AiConsultancy.org.uk →
                </Link>
                <p className="mt-0.5 text-2xs text-gray-400">Helping UK families and institutions adopt personalised learning.</p>
              </div>
            </div>
          </div>
          <div className="mt-4 border-t border-primary-100/50 pt-3 text-center">
            <div className="flex flex-wrap items-center justify-center gap-1 text-2xs text-gray-400">
              <span>&copy; {new Date().getFullYear()} KokoLearn.org. A PAD-CIC initiative. Operated by AiConsultancy.org.uk (Grimsby).</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
