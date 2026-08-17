import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle, Sparkles, BookOpen } from "lucide-react";
import BackButton from "@/app/components/BackButton";
import HomeButton from "@/app/components/HomeButton";

export const metadata = {
  title: "UK National Curriculum — KokoLearn.org",
  description: "KokoLearn.org is fully aligned to the UK National Curriculum (KS1-KS2). Personalised learning across all core subjects for ages 5-11.",
};

export default function CurriculumPage() {
  return (
    <div className="flex min-h-full flex-col bg-white">
      {/* Simple header */}
      <header className="sticky top-0 z-50 w-full border-b border-primary-100/30 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/images/kokolearn-logo.png" alt="KokoLearn.org" width={44} height={44} className="drop-shadow-sm" />
          </Link>
          <div className="flex items-center gap-3">
            <BackButton className="font-semibold text-gray-600 hover:text-primary" />
            <HomeButton className="font-semibold text-gray-600 hover:text-primary" />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-4 pt-24 pb-8 sm:px-6 lg:px-8">
        {/* Hero section */}
        <div className="flex flex-col lg:flex-row gap-8 items-center mb-12">
          <div className="relative w-full lg:w-1/2 aspect-video">
            <Image src="/images/feature-curriculum-hero.webp" alt="UK National Curriculum" fill className="object-cover brightness-110 rounded-xl shadow-lg" priority sizes="(max-width: 768px) 100vw, 50vw" />
          </div>
          <div className="w-full lg:w-1/2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              UK National Curriculum Aligned
            </span>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Education you can trust, mapped to what matters</h1>
            <p className="mt-4 text-base leading-relaxed text-gray-600">
              Every lesson, quiz, and activity on KokoLearn is aligned to the UK National Curriculum (KS1-KS2). 
              Your child learns exactly what they need to know — no gaps, no guesswork.
            </p>
          </div>
        </div>

        {/* Key selling points */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-12">
          {[
            { title: "Full KS1-KS2 coverage", desc: "Years 1-6 covered across Maths, English, Science, History, and Geography.", icon: "📚" },
            { title: "SATs & 11+ preparation", desc: "Targeted lessons that build confidence for key exams.", icon: "🎯" },
            { title: "Curriculum-aligned progress", desc: "Every lesson mapped to official National Curriculum objectives.", icon: "📊" },
            { title: "Multi-subject approach", desc: "Cross-curricular lessons that connect subjects through your child's interests.", icon: "🔗" },
            { title: "Adaptive difficulty", desc: "Lessons adjust to your child's year group and ability level automatically.", icon: "⚡" },
            { title: "Parent-friendly reports", desc: "Clear weekly reports showing exactly what they've learned vs curriculum goals.", icon: "📋" },
          ].map((sp) => (
            <div key={sp.title} className="rounded-xl border border-primary-100/30 bg-white p-5 shadow-sm hover:shadow-md transition-all">
              <span className="text-2xl">{sp.icon}</span>
              <h3 className="mt-3 text-base font-semibold text-gray-900">{sp.title}</h3>
              <p className="mt-1.5 text-sm text-gray-600">{sp.desc}</p>
            </div>
          ))}
        </div>

        {/* Curriculum breakdown */}
        <div className="rounded-2xl border border-primary-100/30 bg-primary-50/30 p-6 sm:p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-900">Core subjects covered</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {[
              { subject: "Mathematics", topics: "Number, algebra, geometry, statistics, ratio, measurement", years: "KS1-KS2" },
              { subject: "English", topics: "Reading, writing, grammar, punctuation, spelling, comprehension", years: "KS1-KS2" },
              { subject: "Science", topics: "Biology, chemistry, physics, scientific enquiry, working scientifically", years: "KS1-KS2" },
              { subject: "History", topics: "British history, world history, chronological awareness", years: "KS1-KS2" },
              { subject: "Geography", topics: "Physical geography, human geography, map skills", years: "KS1-KS2" },
            ].map((subj) => (
              <div key={subj.subject} className="rounded-xl bg-white p-4 border border-primary-100/20">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">{subj.subject}</h3>
                  <span className="rounded-full bg-primary-100 px-2.5 py-0.5 text-[10px] font-semibold text-primary">{subj.years}</span>
                </div>
                <p className="mt-1.5 text-xs text-gray-500">{subj.topics}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link href="/sign-up" className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-secondary px-8 py-4 text-lg font-semibold text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
            Start your FREE 24 Hour Trial
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <p className="mt-2 text-xs text-gray-400">No credit card needed</p>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-primary-100/30 py-8 relative">
        <div className="absolute right-4 bottom-4 hidden lg:block pointer-events-none">
          <Image src="/images/presenter-004.webp" alt="" width={60} height={60} className="object-contain opacity-70" />
        </div>
        <div className="mx-auto max-w-5xl px-4 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} KokoLearn.org — Built by AiConsultancy.org.uk (Grimsby)</p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-4">
            <Link href="/" className="inline-flex items-center rounded-lg bg-primary px-2.5 py-1 text-xs font-semibold text-white hover:bg-primary-600 transition-all">Home</Link>
            <Link href="/legal/privacy" className="text-primary hover:underline">Privacy</Link>
            <Link href="/legal/terms" className="text-primary hover:underline">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
