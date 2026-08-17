"use client";

import { X, CheckCircle, Sparkles, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

// ── Feature / Step Data ──
export interface FeatureData {
  id: string;
  title: string;
  subtitle: string;
  headline: string;
  paragraphs: string[];
  bullets: string[];
  image: string;
  icon?: React.ReactNode;
  color: string;
  gradient: string;
}

export const howItWorksData: FeatureData[] = [
  {
    id: "tell-us-interest",
    title: "Tell us their interest",
    subtitle: "From spark to lesson",
    headline: "One conversation changes everything",
    paragraphs: [
      "It starts with something simple — a fascination. Maybe it's dinosaurs (like every seven-year-old). Maybe it's space, football, horses, Minecraft, or how chocolate is made. Whatever makes their eyes light up, that's where we begin.",
      "You tell us what they love, and our AI gets to work. No forms, no assessments, no pressure. Just a single spark that ignites a whole learning journey. We take their passion and build an entire educational experience around it — from Ancient Egypt to electricity, from phonics to photosynthesis.",
      "The magic? They don't even realise they're learning. To them, it's an adventure about the thing they love most. To you, it's National Curriculum-aligned education disguised as pure fun."
    ],
    bullets: [
      "Start with any interest your child already loves",
      "No assessments or forms — just tell us what excites them",
      "AI instantly builds a full learning path around their passion",
      "They stay engaged because the content is about THEM",
      "Takes less than 60 seconds to get started"
    ],
    image: "/images/howitworks-interest.webp",
    color: "bg-primary-50",
    gradient: "from-primary to-secondary"
  },
  {
    id: "ai-creates-lesson",
    title: "AI creates the lesson",
    subtitle: "Powered by smart AI",
    headline: "Their passion, their curriculum, their pace",
    paragraphs: [
      "This is where the real magic happens. Our AI engine takes your child's chosen interest and cross-references it against the UK National Curriculum (KS1-KS2). Result? A perfectly tailored lesson that teaches exactly what they need to know, wrapped in exactly what they love.",
      "Love football? Here's a maths lesson about calculating goal averages. Obsessed with space? That's a science lesson on the solar system. Into baking? That's chemistry, fractions, and reading comprehension all rolled into one delicious lesson.",
      "The AI adapts in real time as your child works through the material. Stuck on a concept? It breaks it down further. Flying through? It accelerates. Every millisecond, the lesson is optimised for your child's unique learning journey."
    ],
    bullets: [
      "AI maps their interest to UK National Curriculum objectives",
      "Creates multi-subject lessons from a single interest",
      "Auto-adjusts difficulty based on real-time performance",
      "Generates quizzes, activities, and discussion prompts",
      "Every lesson is unique — never the same content twice"
    ],
    image: "/images/howitworks-ai-lesson.webp",
    color: "bg-secondary-50",
    gradient: "from-secondary to-primary"
  },
  {
    id: "they-learn-explore",
    title: "They learn & explore",
    subtitle: "Interactive fun",
    headline: "Learning that feels like playtime",
    paragraphs: [
      "This is where the magic becomes real. Your child dives into an interactive world of learning that doesn't look, feel, or sound like schoolwork. Video-style lessons with voice narration, animated graphics, interactive quizzes, and rewards that keep them coming back for more.",
      "Prof. Koko guides them through every step with encouragement and gentle correction. Wrong answer? That's okay — Prof. Koko explains why and helps them find the right one. The tone is always warm, always encouraging, always child-friendly.",
      "Voice narration reads everything aloud with natural-sounding text-to-speech. Early readers can follow along word-by-word. Kids who struggle with reading get the same content audibly. Every child learns differently, and KokoLearn makes sure every style is supported."
    ],
    bullets: [
      "Voice-narrated lessons with read-along highlighting",
      "Interactive quizzes with instant feedback and hints",
      "Earn stars, badges, and achievements as they progress",
      "Prof. Koko guides with warm, encouraging support",
      "Works on any device — desktop, tablet, or phone"
    ],
    image: "/images/howitworks-learn-explore.webp",
    color: "bg-accent-50",
    gradient: "from-accent to-primary"
  },
  {
    id: "track-progress",
    title: "Track progress",
    subtitle: "See every milestone",
    headline: "Know exactly how they're growing — in real time",
    paragraphs: [
      "No more guessing. No more 'How was school today?' — 'Fine.' The parent dashboard gives you a real-time, beautifully visual window into your child's learning journey. See exactly what they learned, how long they spent, and how well they understood it.",
      "Every week, you receive a clear, jargon-free email report. Strengths, areas for improvement, time spent, topics covered — all mapped to the UK National Curriculum. You'll walk into parents' evening with more insight than most teachers have.",
      "Multiple children? Each one gets their own dashboard and report. One login, full visibility across the whole family. No more wondering if they're keeping up — you'll know, and you'll love what you see."
    ],
    bullets: [
      "Real-time dashboard showing every lesson completed",
      "Weekly email reports with curriculum-aligned insights",
      "Track multiple children from one parent account",
      "See time spent, accuracy, topics covered, and trends",
      "Jargon-free — designed for busy parents, not teachers"
    ],
    image: "/images/howitworks-progress.webp",
    color: "bg-primary-50",
    gradient: "from-primary to-secondary"
  }
];

export const featuresData: FeatureData[] = [
  {
    id: "personalised-lessons",
    title: "Personalised Lessons",
    subtitle: "Learning that fits them perfectly",
    headline: "Watch their eyes light up as learning comes alive",
    paragraphs: [
      "Every child is different — so why should their lessons be the same? KokoLearn's AI builds each lesson around what your child actually loves. Dinosaurs, space, football, unicorns — if they're passionate about it, we turn it into a learning adventure.",
      "Our smart engine adapts in real time. If your child breezes through maths but needs extra help with spelling, the lesson adjusts automatically. No more boring worksheets or one-size-fits-all curricula. Just learning that feels like play."
    ],
    bullets: [
      "AI adapts to your child's interests in real time",
      "Lessons built around what they actually love",
      "Automatically adjusts difficulty based on performance",
      "Covers all core subjects: Maths, English, Science, and more"
    ],
    image: "/images/feature-personalised.png",
    color: "bg-primary-50",
    gradient: "from-primary to-secondary"
  },
  {
    id: "voice-narration",
    title: "Voice Narration",
    subtitle: "Let them listen & learn",
    headline: "Turn every screen into a storytime adventure",
    paragraphs: [
      "Not every child learns best by reading. Our built-in voice narration reads every lesson aloud with warm, engaging natural speech — perfect for early readers, dyslexic learners, or any child who just loves being read to.",
      "Follow along with highlighted text as the narrator speaks, building reading fluency and comprehension simultaneously. It's like having a personal tutor who reads with them every step of the way."
    ],
    bullets: [
      "Natural-sounding text-to-speech reads every lesson",
      "Perfect for early readers and reluctant readers",
      "Builds reading fluency with word highlighting",
      "Great for dyslexic learners and auditory processors"
    ],
    image: "/images/feature-narration.png",
    color: "bg-secondary-50",
    gradient: "from-secondary to-primary"
  },
  {
    id: "progress-tracking",
    title: "Progress Tracking",
    subtitle: "See every milestone",
    headline: "Know exactly how they're growing — in real time",
    paragraphs: [
      "Stop guessing and start knowing. KokoLearn's detailed progress tracking shows you exactly what your child has learned, where they're excelling, and where they need a little extra support — all mapped to the UK National Curriculum.",
      "Weekly reports land in your inbox with clear visuals and actionable insights. No jargon, no confusion. Just a crystal-clear picture of your child's educational journey."
    ],
    bullets: [
      "Real-time progress across all subjects and topics",
      "Aligned to UK National Curriculum objectives",
      "Weekly email reports with clear visual dashboards",
      "Identifies strengths and areas for improvement"
    ],
    image: "/images/feature-progress.png",
    color: "bg-accent-50",
    gradient: "from-accent to-primary"
  },
  {
    id: "multiple-children",
    title: "Multiple Children",
    subtitle: "One account, all your kids",
    headline: "Every child gets their own learning journey",
    paragraphs: [
      "Why pay for separate accounts when one covers the whole family? With KokoLearn Family, each child gets their own personalised learning path, tailored to their unique interests and academic needs — all under one simple account.",
      "Switch between children in seconds. Each profile stores progress, preferences, and learning history independently. Whether you have two kids or five, everyone learns at their own pace."
    ],
    bullets: [
      "One account covers the entire family",
      "Each child gets their own personalised learning path",
      "Independent progress tracking per child",
      "Save up to 60% compared to individual accounts"
    ],
    image: "/images/feature-family.png",
    color: "bg-primary-50",
    gradient: "from-primary to-accent"
  },
  {
    id: "ai-tutor-chat",
    title: "AI Tutor Chat",
    subtitle: "Real-time Q&A with Prof. Koko",
    headline: "Got a question? Prof. Koko has the answer — instantly",
    paragraphs: [
      "Imagine having a patient, encouraging tutor available 24/7. Prof. Koko is KokoLearn's AI tutor who answers questions, explains tricky concepts, and guides your child through challenges — all in a safe, friendly, and age-appropriate way.",
      "Stuck on a maths problem? Confused about the water cycle? Just ask. Prof. Koko breaks it down into bite-sized pieces your child will actually understand. No judgment, no rushing — just learning at their pace."
    ],
    bullets: [
      "24/7 AI tutor for instant homework help",
      "Safe, age-appropriate, and fully moderated",
      "Explains concepts in child-friendly language",
      "Encourages curiosity and independent thinking"
    ],
    image: "/images/feature-tutor-chat.png",
    color: "bg-secondary-50",
    gradient: "from-secondary to-accent"
  },
  {
    id: "curriculum-matching",
    title: "Curriculum Matching",
    subtitle: "Exactly follows UK National Curriculum",
    headline: "Every lesson mapped to what they need to know",
    paragraphs: [
      "Rest easy knowing your child's learning is 100% aligned with the UK National Curriculum (KS1-KS2). KokoLearn's AI is trained on official curriculum standards, so every lesson, quiz, and activity targets exactly what schools are teaching.",
      "No more worrying about learning gaps or off-topic content. Our curriculum engine ensures every lesson builds toward real educational outcomes — whether your child is preparing for SATs, 11+, or just keeping ahead in class."
    ],
    bullets: [
      "Fully aligned to UK National Curriculum (KS1-KS2)",
      "Covers Maths, English, Science, and Humanities",
      "SATs and 11+ preparation support",
      "Closes learning gaps with targeted lessons"
    ],
    image: "/images/feature-curriculum.png",
    color: "bg-primary-50",
    gradient: "from-primary to-secondary"
  },
  {
    id: "parent-dashboard",
    title: "Parent Dashboard",
    subtitle: "Real-time insights, weekly reports",
    headline: "Stay in the loop without lifting a finger",
    paragraphs: [
      "You don't need to be a teacher to know how your child is doing. KokoLearn's Parent Dashboard gives you beautiful, easy-to-understand insights into your child's learning journey — time spent, topics covered, strengths, and areas to work on.",
      "Get weekly reports delivered straight to your inbox. See exactly which subjects they've conquered, which need more practice, and how excited they are about learning. It's the closest thing to sitting in on every lesson."
    ],
    bullets: [
      "Beautiful real-time dashboard with key metrics",
      "Weekly email reports with actionable insights",
      "Track time spent, topics covered, and progress",
      "Compare progress across subjects at a glance"
    ],
    image: "/images/feature-dashboard.png",
    color: "bg-accent-50",
    gradient: "from-accent to-secondary"
  },
  {
    id: "interactive-quizzes",
    title: "Interactive Quizzes",
    subtitle: "Gamified learning with rewards",
    headline: 'Turning "More Practice" Into "Can We Do That Again?!"',
    paragraphs: [
      "Kids love games. Kids love rewards. KokoLearn's interactive quizzes combine both into a learning experience that actually gets them excited about practice. Earn stars, unlock achievements, and climb the leaderboard — all while mastering the National Curriculum.",
      "Every quiz adapts to your child's skill level, asking harder questions as they improve and offering hints when they're stuck. Wrong answers become learning moments with instant explanations. It's practice that doesn't feel like practice."
    ],
    bullets: [
      "Gamified quizzes with stars, rewards, and achievements",
      "Adaptive difficulty that grows with your child",
      "Instant explanations for every answer",
      "Weekly challenges keep motivation high"
    ],
    image: "/images/feature-quizzes.png",
    color: "bg-secondary-50",
    gradient: "from-secondary to-primary"
  }
];

// ── Feature Modal Component ──
interface FeatureModalProps {
  feature: FeatureData | null;
  onClose: () => void;
}

export default function FeatureModal({ feature, onClose }: FeatureModalProps) {
  // Close on Escape key
  useEffect(() => {
    if (!feature) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [feature, onClose]);

  if (!feature) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col overflow-y-auto bg-white animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative mx-auto w-full max-w-4xl flex-1"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Back button at top */}
        <div className="sticky top-0 z-20 flex items-center justify-between bg-white/95 backdrop-blur-sm border-b border-primary-100/30 px-4 sm:px-8 py-3">
          <button onClick={onClose} className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-600 hover:shadow-md transition-all group">
            <ArrowRight className="h-4 w-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
            Back
          </button>
          <button onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white hover:bg-primary-600 shadow-sm transition-all" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Image + Scroll side by side, landscape, equal sized */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-4 px-5 sm:px-8 lg:px-12 pt-6 sm:pt-8">
          
          {/* Image - 16:9, equal width with scroll */}
          <div className="relative w-full sm:w-1/2 aspect-video">
            <Image
              src={feature.image}
              alt={feature.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover brightness-125"
              priority
            />
            <div className="absolute bottom-2 left-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur-sm px-2.5 py-0.5 text-[10px] font-semibold text-gray-900 shadow-sm">
                <Sparkles className="h-3 w-3 text-primary" />
                {feature.subtitle}
              </span>
            </div>
          </div>

          {/* Scroll - same size as image, landscape */}
          <div className="w-full sm:w-1/2 aspect-video">
            <div className="h-full w-full rounded-lg border-2 border-primary/30 bg-amber-50/80 shadow-sm overflow-hidden relative">
              {/* semi-transparent overlay for readability */}
              <div className="relative z-10 h-full w-full p-5 flex flex-col items-center justify-center text-center">
              <span className="text-xs font-bold tracking-wider text-gray-900 mb-2">Bespoke session created from your input</span>
              <ul className="space-y-2">
                {[
                  { q: "What’s your name and how old are you?", icon: "👋" },
                  { q: "What subjects do you enjoy most at school?", icon: "📚" },
                  { q: "Tell me something you’re really curious about!", icon: "🧠" },
                  { q: "Any topics you find a bit tricky?", icon: "🤔" },
                  { q: "Would you like a fun quiz at the end?", icon: "🌟" },
                ].map((item) => (
                  <li key={item.q} className="flex items-center justify-center gap-1.5 text-sm text-gray-900">
                    <span className="flex-shrink-0 text-base">{item.icon}</span>
                    <span>“{item.q}”</span>
                  </li>
                ))}
              </ul>
              <div className="mt-1">
                <span className="text-[10px] text-gray-500">AI builds lesson from answers →</span>
              </div>
            </div>
            </div>
          </div>

        </div>

        {/* Content */}
        <div className="px-5 sm:px-8 lg:px-12 py-6 sm:py-8">
          <h2 className="text-xl font-bold text-gray-900 sm:text-2xl lg:text-3xl leading-tight">
            {feature.headline}
          </h2>

          {feature.paragraphs.map((p, i) => (
            <p key={i} className="mt-3 text-sm leading-relaxed text-gray-600 sm:text-base">
              {p}
            </p>
          ))}

          {/* Bullet points */}
          <ul className="mt-5 grid gap-2 sm:grid-cols-2">
            {feature.bullets.map((b, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                <CheckCircle className={`mt-0.5 h-4 w-4 flex-shrink-0 text-primary`} />
                <span>{b}</span>
              </li>
            ))}
          </ul>



          {/* CTA */}
          <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 border-t border-primary-100/30 pt-8">
            <Link
              href="/sign-up"
              className={`group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r ${feature.gradient} px-6 py-3 text-base font-semibold text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all`}
              onClick={onClose}
            >
              Start Your FREE 24 Hour Trial
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <p className="text-xs text-gray-400">— No credit card needed</p>
          </div>
        </div>
      </div>
    </div>
  );
}
