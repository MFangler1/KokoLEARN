"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  BookOpen,
  Clock,
  TrendingUp,
  Flame,
  ArrowRight,
  ChevronDown,
  Plus,
  Download,
  Calendar,
  Star,
  Target,
  Zap,
  LogOut,
  Crown,
  Loader2,
} from "lucide-react";
import { useSession, signOut } from "@/lib/auth/client";
import ReferAFriend from "@/components/ReferAFriend";

// ── Types ──
type Child = {
  id: string;
  name: string;
  age: number;
  avatar: string;
  stats: {
    lessonsCompleted: number;
    learningHours: string;
    avgProgress: number;
    currentStreak: number;
  };
  subjectProgress: { subject: string; progress: number; color: string }[];
  weeklyProgress: { week: string; progress: number }[];
  monthlyProgress: { month: string; progress: number }[];
  curriculumObjectives: {
    stage: string;
    subject: string;
    total: number;
    completed: number;
  }[];
  recentLessons: {
    topic: string;
    emoji: string;
    subject: string;
    timeAgo: string;
    score: number;
  }[];
};

// ── Sync with localStorage ──
// ── Zero-state (used when no lessons exist yet) ──
const zeroChild: Child = {
  id: "new",
  name: "Your Child",
  age: 5,
  avatar: "👶",
  stats: { lessonsCompleted: 0, learningHours: "0h 0m", avgProgress: 0, currentStreak: 0 },
  subjectProgress: [],
  weeklyProgress: [],
  monthlyProgress: [],
  curriculumObjectives: [],
  recentLessons: [],
};

// ── Default display data (zeros from zeroChild + name/age/avatar) ──
const childrenData: Child[] = [
  {
    ...zeroChild,
    id: "alex",
    name: "Alex",
    age: 7,
    avatar: "👦",
  },
  {
    ...zeroChild,
    id: "mia",
    name: "Mia",
    age: 9,
    avatar: "👧",
  },
];

// ── SVG Line Chart ──
function LineChart({
  data,
  color = "#F97316",
  height = 160,
}: {
  data: { label: string; value: number }[];
  color?: string;
  height?: number;
}) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center text-gray-400 text-sm" style={{ height }}>
        Complete your first lesson to see progress over time
      </div>
    );
  }
  const w = 600;
  const h = height;
  const pad = { top: 20, right: 20, bottom: 30, left: 10 };
  const chartW = w - pad.left - pad.right;
  const chartH = h - pad.top - pad.bottom;
  const maxVal = 100;
  const points = data.map((d, i) => {
    const x = pad.left + (i / Math.max(data.length - 1, 1)) * chartW;
    const y = pad.top + chartH - (d.value / maxVal) * chartH;
    return `${x},${y}`;
  });

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
      {/* Grid lines */}
      {[0, 25, 50, 75, 100].map((v) => {
        const y = pad.top + chartH - (v / maxVal) * chartH;
        return (
          <g key={v}>
            <line x1={pad.left} y1={y} x2={w - pad.right} y2={y} stroke="#f1f5f9" strokeWidth="1" />
            <text x={pad.left - 4} y={y + 3} textAnchor="end" className="text-[8px] fill-gray-400">{v}%</text>
          </g>
        );
      })}
      {/* Area fill */}
      <polygon
        points={`${pad.left},${pad.top + chartH} ${points.join(" ")} ${w - pad.right},${pad.top + chartH}`}
        fill={color}
        fillOpacity="0.08"
      />
      {/* Line */}
      <polyline points={points.join(" ")} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Dots */}
      {data.map((d, i) => {
        const x = pad.left + (i / Math.max(data.length - 1, 1)) * chartW;
        const y = pad.top + chartH - (d.value / maxVal) * chartH;
        return (
          <g key={i}>
            <circle cx={x} cy={y} r="4" fill="white" stroke={color} strokeWidth="2" />
            <text x={x} y={h - 8} textAnchor="middle" className="text-[9px] fill-gray-400">{d.label}</text>
          </g>
        );
      })}
    </svg>
  );
}

// ── Progress Bar (reusable) ──
function ProgressBar({ value, color = "#F97316", height = 8, showLabel = true }: { value: number; color?: string; height?: number; showLabel?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden" style={{ height }}>
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${value}%`, background: color }}
        />
      </div>
      {showLabel && <span className="text-xs font-semibold text-gray-500 w-9 text-right">{value}%</span>}
    </div>
  );
}

// ── Testimonial Welcome Banner ──
function TestimonialWelcome() {
  const [visible, setVisible] = useState(true);
  const [showTestimonialForm, setShowTestimonialForm] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if user just signed in
    const params = new URLSearchParams(window.location.search);
    if (params.get("welcome") === "1" && !sessionStorage.getItem("testimonial_asked")) {
      setVisible(true);
      // Clean up URL
      const url = new URL(window.location.href);
      url.searchParams.delete("welcome");
      window.history.replaceState({}, "", url.toString());
    }
  }, []);

  if (dismissed) return null;

  if (showTestimonialForm) {
    return (
      <div className="mb-6 rounded-2xl border border-primary-100 bg-gradient-to-br from-primary-50 to-white p-6 shadow-sm">
        <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-3">
          <Star className="h-5 w-5 text-primary fill-primary" />
          Share your story
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          We&apos;d love to feature your experience on our blog. If you&apos;d like to write a testimonial, click below — it takes 2 minutes.
        </p>
        <div className="flex gap-3">
          <Link
            href="/testimonial"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-secondary px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:shadow-lg transition-all"
          >
            <Star className="h-4 w-4" />
            Write a Testimonial
          </Link>
          <button
            onClick={() => {
              setDismissed(true);
              sessionStorage.setItem("testimonial_asked", "1");
            }}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 transition-all"
          >
            Maybe later
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {visible && (
        <div className="mb-6 rounded-2xl border border-green-100 bg-gradient-to-br from-green-50 to-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-bold text-gray-900 flex items-center gap-2">
                Great to see you again! 🎉
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                Thank you for signing in. We hope your child is enjoying their learning journey with KokoLearn.
              </p>
            </div>
            <button
              onClick={() => setShowTestimonialForm(true)}
              className="shrink-0 rounded-xl bg-gradient-to-r from-primary to-secondary px-4 py-2 text-xs font-semibold text-white shadow-md hover:shadow-lg transition-all whitespace-nowrap"
            >
              Share feedback 💬
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// ── Main Dashboard ──



// ── Free Trial Usage (from /api/subscription/status) ──
type TrialStatus = {
  isPremium: boolean;
  lessonsUsed: number;
  lessonLimit: number | null;
  lessonsRemaining: number | null;
  limitReached: boolean;
};

// ── Lesson Helpers ──
function getLessonEmoji(subject: string): string {
  const map: Record<string, string> = { Maths: "🔢", English: "📖", Science: "🔬", Geography: "🌍", History: "🏰", Art: "🎨", Computing: "💻", AI: "🤖" };
  return map[subject] || "📚";
}

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return mins + " min ago";
  const hours = Math.floor(mins / 60);
  if (hours < 24) return hours + "h ago";
  const days = Math.floor(hours / 24);
  return days + "d ago";
}

function formatLearningTime(totalSeconds: number): string {
  if (!totalSeconds) return "0h 0m";
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.round((totalSeconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
}

function countCurrentStreak(lessons: any[]): number {
  const dates = new Set(
    lessons
      .map((lesson) => lesson.created_at?.slice(0, 10))
      .filter(Boolean)
  );

  let streak = 0;
  const cursor = new Date();

  while (dates.has(cursor.toISOString().slice(0, 10))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

export default function Dashboard() {
  const router = useRouter();
  const { data: session, isPending: loading } = useSession();
  const [activeChild, setActiveChild] = useState(childrenData[0]);
  // Load real child data from onboarding if available
  const [realChildren, setRealChildren] = useState<Child[] | null>(null);
  const [showSubjectPicker, setShowSubjectPicker] = useState(false);
  
  useEffect(() => {
    const apply = (list: any[]) => {
      if (!list.length) return;
      const mapped = list.map((c: any) => ({
        ...childrenData[0],
        id: c.id,
        name: c.name,
        age: c.age,
        avatar: c.age <= 7 ? "👦" : "👧",
      }));
      setRealChildren(mapped);
      setActiveChild({ ...childrenData[0], id: mapped[0].id, name: mapped[0].name, age: mapped[0].age });
    };

    const readCache = (): any[] => {
      try {
        return JSON.parse(localStorage.getItem("kokolearn_children") || "[]");
      } catch {
        return [];
      }
    };

    (async () => {
      try {
        const res = await fetch("/api/children");
        if (res.ok) {
          const data = await res.json();
          const children = Array.isArray(data.children) ? data.children : [];
          if (children.length > 0) {
            apply(children);
            try {
              localStorage.setItem("kokolearn_children", JSON.stringify(children));
            } catch {}
            return;
          }
          // Account has no children yet: import any locally cached ones (one-time migration).
          const cached = readCache();
          if (cached.length > 0) {
            const imported: any[] = [];
            for (const c of cached) {
              try {
                const r = await fetch("/api/children", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ name: c.name, age: c.age, interests: c.interests || [] }),
                });
                if (r.ok) {
                  const j = await r.json();
                  if (j.child) imported.push(j.child);
                }
              } catch {}
            }
            if (imported.length > 0) {
              apply(imported);
              try {
                localStorage.setItem("kokolearn_children", JSON.stringify(imported));
              } catch {}
              return;
            }
          }
        }
      } catch {}

      // Offline / storage unavailable: fall back to the local cache.
      const cached = readCache();
      if (cached.length > 0) apply(cached);
    })();
  }, []);
  
  // Fetch real recent lessons from the API
  const [realLessons, setRealLessons] = useState<any[] | null>(null);
  
  useEffect(() => {
    const child = typeof activeChild === "object" ? activeChild : null;
    if (!child || !session?.user?.id) return;
    
    fetch("/api/lessons/list", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: session.user.id,
        childName: child.name,
      }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.lessons?.length > 0) {
          setRealLessons(data.lessons);
        } else {
          setRealLessons([]); // empty but loaded
        }
      })
      .catch(() => { setRealLessons([]); });
  }, [activeChild, session]);
  
  const [timeView, setTimeView] = useState<"weekly" | "monthly">("weekly");
  const [hasExtendedQuestions, setHasExtendedQuestions] = useState(false);
  const [questionCount, setQuestionCount] = useState(5);
  const [trialStatus, setTrialStatus] = useState<TrialStatus | null>(null);

  // Check subscription status for extended questions and free trial usage
  useEffect(() => {
    if (!session?.user?.id) return;
    fetch("/api/subscription/status")
      .then(r => r.json())
      .then(data => {
        setHasExtendedQuestions(data.extendedQuestions);
        setQuestionCount(data.questionCount);
        setTrialStatus({
          isPremium: Boolean(data.isPremium),
          lessonsUsed: data.lessonsUsed ?? 0,
          lessonLimit: data.lessonLimit ?? null,
          lessonsRemaining: data.lessonsRemaining ?? null,
          limitReached: Boolean(data.limitReached),
        });
      })
      .catch(() => {});
  }, [session]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const handleUpgrade = async (plan: string) => {
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: plan === "premium" ? "premium" : "family",
          interval: "monthly",
        }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (err) {
      console.error("Upgrade failed:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) return null;

  const authUser = session.user;
  const fullName = authUser.name || authUser.email || "User";
  const email = authUser.email || "";
  const user = {
    email,
    name: fullName,
    plan: (authUser as any).plan || "free_trial",
    subscription_status: (authUser as any).subscriptionStatus || "active",
    initials: fullName
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2),
  };

  const isPremium = trialStatus
    ? trialStatus.isPremium
    : user.plan !== "free_trial" && user.subscription_status === "active";
  const trialLimitReached = !isPremium && Boolean(trialStatus?.limitReached);

  // ── Compute stats from real lesson data ──
  const completedLessons = realLessons?.filter((l: any) => l.completed) || [];
  const hasRealData = completedLessons.length > 0;
  const lessonsLoaded = realLessons !== null;

  let computedStats = { lessonsCompleted: 0, learningHours: "0h 0m", avgProgress: 0, currentStreak: 0 };
  let computedSubjectProgress: { subject: string; progress: number; color: string }[] = [];
  let computedWeeklyProgress: { week: string; progress: number }[] = [];
  let computedMonthlyProgress: { month: string; progress: number }[] = [];
  let computedCurriculumObjectives: { stage: string; subject: string; total: number; completed: number }[] = [];

  if (hasRealData) {
    const lessonCount = completedLessons.length;
    const totalDurationSeconds = completedLessons.reduce((s: number, l: any) => s + (l.duration_seconds || 0), 0);
    const avgScore = lessonCount > 0
      ? Math.round(completedLessons.reduce((s: number, l: any) => s + (l.score || 0), 0) / lessonCount)
      : 0;

    computedStats = {
      lessonsCompleted: lessonCount,
      learningHours: formatLearningTime(totalDurationSeconds),
      avgProgress: avgScore,
      currentStreak: countCurrentStreak(completedLessons),
    };

    // Subject progress from real lessons
    const subjects = [...new Set(completedLessons.map((l: any) => l.subject))];
    const colors = ["#F97316", "#EA580C", "#F59E0B", "#3B82F6", "#10B981", "#8B5CF6"];
    computedSubjectProgress = subjects.map((s, i) => {
      const subLessons = completedLessons.filter((l: any) => l.subject === s);
      const pct = subLessons.length > 0
        ? Math.round(subLessons.reduce((acc: number, l: any) => acc + (l.score || 0), 0) / subLessons.length)
        : 0;
      return { subject: s as string, progress: pct, color: colors[i % colors.length] };
    });

    // Weekly chart from lesson dates
    const dayNames = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
    const today = new Date();
    const weekDays = Array.from({length: 7}, (_, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() - (6 - i));
      return d;
    });
    computedWeeklyProgress = weekDays.map(d => {
      const dayStr = d.toISOString().slice(0, 10);
      const dayLessons = completedLessons.filter((l: any) =>
        l.created_at && l.created_at.startsWith(dayStr)
      );
      const avg = dayLessons.length > 0
        ? Math.round(dayLessons.reduce((s: number, l: any) => s + (l.score || 0), 0) / dayLessons.length)
        : 0;
      return { week: dayNames[d.getDay()], progress: avg };
    });

    // Monthly chart
    const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const months = Array.from({length: 5}, (_, i) => {
      const d = new Date(today.getFullYear(), today.getMonth() - (4 - i), 1);
      return d;
    });
    computedMonthlyProgress = months.map(d => {
      const prefix = d.toISOString().slice(0, 7);
      const monthLessons = completedLessons.filter((l: any) =>
        l.created_at && l.created_at.startsWith(prefix)
      );
      const avg = monthLessons.length > 0
        ? Math.round(monthLessons.reduce((s: number, l: any) => s + (l.score || 0), 0) / monthLessons.length)
        : 0;
      return { month: monthNames[d.getMonth()], progress: avg };
    });

    // Curriculum objectives
    const subjectGroups = [...new Set(completedLessons.map((l: any) => l.subject))];
    computedCurriculumObjectives = subjectGroups.map(s => ({
      stage: "KS1",
      subject: s as string,
      total: 10,
      completed: completedLessons.filter((l: any) => l.subject === s).length,
    }));
  }

  const showEmptyState = lessonsLoaded && !hasRealData;

  // For chart, use computed data if real, else empty
  const chartData: { label: string; value: number }[] =
    timeView === "weekly"
      ? (hasRealData ? computedWeeklyProgress.map(d => ({ label: d.week, value: d.progress })) : [])
      : (hasRealData ? computedMonthlyProgress.map(d => ({ label: d.month, value: d.progress })) : []);

  const child = showEmptyState
    ? { ...zeroChild, ...activeChild, stats: computedStats, recentLessons: [] as any[], subjectProgress: [], weeklyProgress: [], monthlyProgress: [], curriculumObjectives: [] }
    : activeChild;

  const displayStats = hasRealData ? computedStats : child.stats;
  const displaySubjectProgress = hasRealData ? computedSubjectProgress : child.subjectProgress;
  const displayCurriculumObjectives = hasRealData ? computedCurriculumObjectives : child.curriculumObjectives;
  const lessonCount = hasRealData ? completedLessons.length : displayStats.lessonsCompleted;

  const statCards = [
    { icon: <BookOpen className="h-5 w-5" />, label: "Lessons Completed", value: lessonCount, bg: "bg-primary-50", color: "text-primary" },
    { icon: <Clock className="h-5 w-5" />, label: "Learning Hours", value: displayStats.learningHours, bg: "bg-amber-50", color: "text-amber-600" },
    { icon: <TrendingUp className="h-5 w-5" />, label: "Avg. Progress", value: `${displayStats.avgProgress}%`, bg: "bg-emerald-50", color: "text-emerald-600" },
    { icon: <Flame className="h-5 w-5" />, label: "Current Streak", value: `${displayStats.currentStreak} days`, bg: "bg-red-50", color: "text-red-500" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Header ── */}
      <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1 sm:px-4 lg:px-6">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/images/kokolearn-logo.png" alt="KokoLearn" width={44} height={44} className="drop-shadow-sm" />
          </Link>
          <div className="flex items-center gap-3">
            {!isPremium && (
              <button
                onClick={() => handleUpgrade("premium")}
                className="hidden sm:inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-secondary px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-primary/20 hover:shadow-xl transition-all"
              >
                <Crown className="h-4 w-4" />
                Upgrade
              </button>
            )}
            {isPremium && (
              <span className="hidden sm:inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-1.5 text-sm font-medium text-primary">
                <Star className="h-4 w-4 fill-primary" />
                {user.plan === "family" ? "Family" : "Premium"}
              </span>
            )}
            <Link
              href="/dashboard/reports"
              className="hidden sm:inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:border-primary/30 hover:text-primary transition-all"
            >
              <Download className="h-4 w-4" />
              Print Report
            </Link>
            <button
              onClick={handleSignOut}
              className="hidden sm:inline-flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium text-gray-500 hover:text-red-500 hover:border-red-200 transition-all"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-sm font-bold text-white shadow-sm">
              {user.initials}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* ── Welcome Thank-You Banner ── */}
        <TestimonialWelcome />

        {/* ── Welcome + Child Selector ── */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.name.split(" ")[0]}! 👋</h1>
            <p className="mt-1 text-sm text-gray-500">Here&apos;s {child.name}&apos;s learning overview.</p>
            {!isPremium && (
              <div className="mt-2 inline-flex max-w-full flex-wrap items-center gap-x-2 gap-y-1 rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-medium text-amber-700">
                <Crown className="h-3 w-3" />
                <span>
                  {trialStatus?.lessonLimit
                    ? trialLimitReached
                      ? `Free Trial — all ${trialStatus.lessonLimit} lessons used`
                      : `Free Trial — ${trialStatus.lessonsUsed} of ${trialStatus.lessonLimit} lessons used`
                    : "Free Trial"}
                  {" —"}
                </span>
                <button
                  onClick={() => handleUpgrade("premium")}
                  className="underline font-semibold hover:text-amber-800"
                >
                  Subscribe to unlock unlimited lessons
                </button>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/reports"
              className="sm:hidden inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:border-primary/30 hover:text-primary transition-all"
            >
              <Download className="h-4 w-4" />
              Print
            </Link>
          </div>
        </div>

        {/* ── Child Pills ── */}
        <div className="mb-6 flex flex-wrap items-center gap-2">
          {(realChildren || childrenData).map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveChild(c)}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                activeChild.id === c.id
                  ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/20"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-primary/30 hover:text-primary"
              }`}
            >
              <span className="text-lg">{c.avatar}</span>
              {c.name}
              <span className="text-xs opacity-60">age {c.age}</span>
            </button>
          ))}
          <Link href="/onboarding?add=1" className="inline-flex items-center gap-1.5 rounded-full border-2 border-dashed border-gray-300 px-4 py-2 text-sm font-medium text-gray-400 hover:border-primary/50 hover:text-primary transition-all">
            <Plus className="h-4 w-4" />
            Add Child
          </Link>
        </div>

        {/* ── Quick Actions (Top) ── */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {(
              [
                { icon: <Zap className="h-5 w-5" />, label: trialLimitReached ? "Free trial limit reached" : `Generate New Lesson${lessonCount > 0 ? ` (${lessonCount} completed)` : ""}`, desc: trialLimitReached ? `All ${trialStatus?.lessonLimit} free lessons used — subscribe for unlimited` : `${questionCount} questions per lesson`, href: "", color: trialLimitReached ? "text-primary" : "text-amber-600", bg: trialLimitReached ? "bg-primary-50" : "bg-amber-50", onClick: trialLimitReached ? () => handleUpgrade("premium") : () => setShowSubjectPicker(true) },
                { icon: <BookOpen className="h-5 w-5" />, label: "Browse Curriculum", desc: "Full UK National Curriculum map", href: "/curriculum", color: "text-purple-600", bg: "bg-purple-50", onClick: undefined },
                ...(isPremium
                  ? []
                  : [{
                      icon: <Crown className="h-5 w-5" />,
                      label: "Upgrade Plan",
                      desc: "Unlock unlimited lessons & features",
                      onClick: () => handleUpgrade("premium"),
                      color: "text-primary",
                      bg: "bg-primary-50",
                    }]
                ),
                { icon: <LogOut className="h-5 w-5" />, label: "Sign Out", desc: "End your session", onClick: handleSignOut, color: "text-gray-500", bg: "bg-gray-100" },
              ] as const
            ).map((action: any) => {
              const content = (
                <>
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${action.bg}`}>
                    <span className={action.color}>{action.icon}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900 group-hover:text-primary transition-colors">{action.label}</p>
                    <p className="text-xs text-gray-500">{action.desc}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </>
              );

              if (action.onClick) {
                return (
                  <button
                    key={action.label}
                    onClick={action.onClick}
                    className="group flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm hover:shadow-md hover:border-primary/20 transition-all text-left"
                  >
                    {content}
                  </button>
                );
              }

              return (
                <Link
                  key={action.label}
                  href={action.href}
                  className="group flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm hover:shadow-md hover:border-primary/20 transition-all"
                >
                  {content}
                </Link>
              );
            })}
          </div>
        </div>

        {/* ── Stats Row ── */}
        <div className="mb-8 grid gap-4 xs:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
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

        {/* ── Main Grid ── */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* ── Progress Chart (spans 2 cols) ── */}
          <div className="lg:col-span-2 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Progress Over Time
              </h2>
              <div className="flex rounded-lg bg-gray-100 p-0.5">
                {(["weekly", "monthly"] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setTimeView(v)}
                    className={`rounded-md px-3 py-1 text-xs font-semibold transition-all ${
                      timeView === v ? "bg-white text-primary shadow-sm" : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {v === "weekly" ? "Week" : "Month"}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-2">
              <LineChart data={chartData} color="#F97316" height={180} />
            </div>
          </div>

          {/* ── Subject Breakdown ── */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
              <Target className="h-5 w-5 text-secondary" />
              Subject Breakdown
            </h2>
            <div className="space-y-4">
              {displaySubjectProgress.length > 0 ? displaySubjectProgress.map((s) => (
                <div key={s.subject}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{s.subject}</span>
                    <span className="text-xs font-semibold text-gray-400">{s.progress}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${s.progress}%`, background: s.color }}
                    />
                  </div>
                </div>
              )) : (
                <div className="py-8 text-center">
                  <p className="text-gray-400 text-sm">Complete a lesson to see your progress breakdown</p>
                </div>
              )}
            </div>
          </div>

          {/* ── Extended Questions Add-on ── */}
          {!hasExtendedQuestions && session && (
            <div className="lg:col-span-2 rounded-2xl border border-dashed border-primary-200 bg-primary-50/30 p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                    Extended Questions — £2/month
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Get <strong>10 questions</strong> per lesson instead of 5. More practice, deeper learning, better results.
                  </p>
                </div>
                <button
                  onClick={async () => {
                    try {
                      const res = await fetch("/api/checkout", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ addon: "extended_questions" }),
                      });
                      const data = await res.json();
                      if (data.url) window.location.href = data.url;
                    } catch (err) {
                      console.error("Add-on checkout failed:", err);
                    }
                  }}
                  className="shrink-0 rounded-xl bg-gradient-to-r from-primary to-secondary px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:shadow-lg transition-all whitespace-nowrap"
                >
                  Add Extended Questions +£2/mo
                </button>
              </div>
            </div>
          )}

          {/* ── Refer-a-Friend ── */}
          <div className="lg:col-span-2">
            <ReferAFriend />
          </div>

          {/* ── National Curriculum Tracker (spans 2 cols) ── */}
          <div className="lg:col-span-2 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
              <BookOpen className="h-5 w-5 text-primary" />
              UK National Curriculum Objectives — {child.name}, {child.age}yo
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {displayCurriculumObjectives.length > 0 ? displayCurriculumObjectives.map((obj) => (
                <div key={`${obj.stage}-${obj.subject}`} className="rounded-xl border border-gray-100 bg-gray-50/50 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-semibold text-primary">
                      {obj.stage}
                    </span>
                    <span className="text-xs font-bold text-gray-400">{obj.completed}/{obj.total}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900">{obj.subject}</h3>
                  <div className="mt-2">
                    <ProgressBar value={Math.round((obj.completed / obj.total) * 100)} color="#F97316" />
                  </div>
                  <p className="mt-1.5 text-xs text-gray-400">
                    {obj.total - obj.completed} objectives remaining • {Math.round((obj.completed / obj.total) * 100)}% done
                  </p>
                </div>
              )) : (
                <div className="py-8 text-center col-span-2">
                  <p className="text-gray-400 text-sm">Complete a lesson to track your National Curriculum progress</p>
                </div>
              )}
            </div>
          </div>

          {/* ── Recent Lessons ── */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Zap className="h-5 w-5 text-amber-500" />
                Recent Lessons
              </h2>
            </div>
            <div className="space-y-3">
              {completedLessons.length > 0 ? (
                completedLessons.map((lesson) => (
                  <div key={lesson.id} className="group flex items-center gap-3 rounded-xl border border-gray-100 p-3 hover:border-primary/20 hover:bg-primary-50/30 transition-all cursor-pointer">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-xl">
                      {getLessonEmoji(lesson.subject)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{lesson.title}</p>
                      <p className="text-xs text-gray-400">{lesson.subject} · {timeAgo(lesson.created_at)}</p>
                    </div>
                    <div className={`flex items-center gap-1 text-sm font-bold ${lesson.score >= 80 ? "text-emerald-600" : lesson.score >= 60 ? "text-amber-600" : "text-red-500"}`}>
                      {lesson.score}%
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-6 text-center">
                  <p className="text-gray-400 text-sm">No lessons completed yet. Start your first lesson above! 🚀</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Quick Actions ── */}
        <div className="mt-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {(
              [
                { icon: <Zap className="h-5 w-5" />, label: "Generate New Lesson", desc: "Pick a topic and get started", href: "", color: "text-amber-600", bg: "bg-amber-50", onClick: () => setShowSubjectPicker(true) },
                { icon: <Download className="h-5 w-5" />, label: "Download Report", desc: "Printable PDF progress report", href: "/dashboard/reports", color: "text-blue-600", bg: "bg-blue-50", onClick: undefined },
                { icon: <BookOpen className="h-5 w-5" />, label: "Browse Curriculum", desc: "Full UK National Curriculum map", href: "/curriculum", color: "text-purple-600", bg: "bg-purple-50", onClick: undefined },
                ...(isPremium
                  ? []
                  : [{
                      icon: <Crown className="h-5 w-5" />,
                      label: "Upgrade Plan",
                      desc: "Unlock unlimited lessons & features",
                      onClick: () => handleUpgrade("premium"),
                      color: "text-primary",
                      bg: "bg-primary-50",
                    }]
                ),
                { icon: <LogOut className="h-5 w-5" />, label: "Sign Out", desc: "End your session", onClick: handleSignOut, color: "text-gray-500", bg: "bg-gray-100" },
              ] as const
            ).map((action: any) => {
              const content = (
                <>
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${action.bg}`}>
                    <span className={action.color}>{action.icon}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900 group-hover:text-primary transition-colors">{action.label}</p>
                    <p className="text-xs text-gray-500">{action.desc}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </>
              );

              if (action.onClick) {
                return (
                  <button
                    key={action.label}
                    onClick={action.onClick}
                    className="group flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm hover:shadow-md hover:border-primary/20 transition-all text-left"
                  >
                    {content}
                  </button>
                );
              }

              return (
                <Link
                  key={action.label}
                  href={action.href}
                  className="group flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm hover:shadow-md hover:border-primary/20 transition-all"
                >
                  {content}
                </Link>
              );
            })}
          </div>
        </div>

        {/* ── Print Report Banner ── */}
        <div className="mt-8 rounded-2xl bg-gradient-to-r from-primary to-secondary p-6 sm:p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-white/10" />
            <div className="absolute -bottom-10 -left-10 h-24 w-24 rounded-full bg-white/10" />
          </div>
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Download className="h-5 w-5" />
                Want a printable report?
              </h2>
              <p className="mt-1 text-white/80 max-w-lg">
                Download a detailed PDF showing {child.name}&apos;s progress, skill heatmap, curriculum coverage, and personalised recommendations.
              </p>
            </div>
            <Link
              href="/dashboard/reports"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-primary shadow-lg hover:bg-gray-100 transition-all whitespace-nowrap"
            >
              <Download className="h-4 w-4" />
              Generate Report
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

      {/* ── Subject Picker Modal ── */}
      {showSubjectPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4" onClick={() => setShowSubjectPicker(false)}>
          <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl animate-fade-in" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-gray-900 text-center mb-2">What would you like to learn?</h2>
            <p className="text-sm text-gray-500 text-center mb-6">Pick a subject for your next lesson</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { subject: "Maths", emoji: "\ud83d\udd22", desc: "Numbers & problem solving" },
                { subject: "English", emoji: "\ud83d\udcd6", desc: "Reading, writing & grammar" },
                { subject: "Science", emoji: "\ud83d\udd2c", desc: "Animals, plants & experiments" },
                { subject: "Geography", emoji: "\ud83c\udf0d", desc: "Maps, places & environments" },
                { subject: "History", emoji: "\ud83c\udff0", desc: "Past events & civilisations" },
                { subject: "Art", emoji: "🎨", desc: "Drawing, painting & creativity" },
                { subject: "Computing", emoji: "💻", desc: "Coding, algorithms & digital skills" },
                { subject: "AI", emoji: "🤖", desc: "Smart tech & future skills" },
              ].map((s) => (
                <button
                  key={s.subject}
                  onClick={() => {
                    const interests = ["Dinosaurs", "Space", "Animals", "Science", "Reading"];
                    window.location.href = "/lessons/new?child=" + encodeURIComponent(activeChild?.name || "Alex") + "&age=" + (activeChild?.age || 7) + "&subject=" + s.subject + "&interests=" + encodeURIComponent(interests.join(","));
                  }}
                  className="flex flex-col items-center gap-2 rounded-xl border border-gray-200 p-5 hover:border-primary/30 hover:bg-primary-50 hover:shadow-sm transition-all group"
                >
                  <span className="text-3xl">{s.emoji}</span>
                  <span className="text-sm font-semibold text-gray-900 group-hover:text-primary">{s.subject}</span>
                  <span className="text-xs text-gray-400 text-center">{s.desc}</span>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowSubjectPicker(false)}
              className="mt-4 w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      </main>
    </div>
  );
}
