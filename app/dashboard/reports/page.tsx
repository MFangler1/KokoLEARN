"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Download,
  FileText,
  Mail,
  Printer,
  Check,
  Loader2,
  Users,
  Clock,
  TrendingUp,
  Target,
  Flame,
  Calendar,
  ChevronDown,
  SendHorizonal,
  UserPlus,
  Save,
  FileDown,
} from "lucide-react";

// ── Types ──
type Child = {
  id: string;
  name: string;
  age: number;
  avatar: string;
  stats: { lessonsCompleted: number; learningHours: string; avgProgress: number; currentStreak: number };
  subjectProgress: { subject: string; progress: number; color: string }[];
  weeklyProgress: { week: string; progress: number }[];
  monthlyProgress: { month: string; progress: number }[];
  curriculumObjectives: { stage: string; subject: string; total: number; completed: number }[];
  recentLessons: { topic: string; emoji: string; subject: string; timeAgo: string; score: number }[];
};

// ── Mock Data (same as dashboard) ──
const childrenData: Child[] = [
  {
    id: "alex", name: "Alex", age: 7, avatar: "👦",
    stats: { lessonsCompleted: 47, learningHours: "23h 15m", avgProgress: 65, currentStreak: 12 },
    subjectProgress: [
      { subject: "Maths", progress: 80, color: "#F97316" },
      { subject: "English", progress: 65, color: "#EA580C" },
      { subject: "Science", progress: 55, color: "#F59E0B" },
      { subject: "Geography", progress: 45, color: "#3B82F6" },
      { subject: "History", progress: 35, color: "#10B981" },
      { subject: "Art & Design", progress: 70, color: "#8B5CF6" },
    ],
    weeklyProgress: [
      { week: "Mon", progress: 62 }, { week: "Tue", progress: 58 }, { week: "Wed", progress: 70 },
      { week: "Thu", progress: 65 }, { week: "Fri", progress: 72 }, { week: "Sat", progress: 68 }, { week: "Sun", progress: 55 },
    ],
    monthlyProgress: [
      { month: "Jan", progress: 40 }, { month: "Feb", progress: 45 }, { month: "Mar", progress: 52 },
      { month: "Apr", progress: 58 }, { month: "May", progress: 65 },
    ],
    curriculumObjectives: [
      { stage: "KS1", subject: "Maths", total: 28, completed: 22 },
      { stage: "KS1", subject: "English", total: 32, completed: 20 },
      { stage: "KS1", subject: "Science", total: 18, completed: 10 },
      { stage: "KS1", subject: "Geography", total: 12, completed: 5 },
    ],
    recentLessons: [
      { topic: "Dinosaurs & Addition", emoji: "🦕", subject: "Maths", timeAgo: "2 hours ago", score: 92 },
      { topic: "Continents of the World", emoji: "🌍", subject: "Geography", timeAgo: "Yesterday", score: 85 },
      { topic: "Story Writing: Space Adventure", emoji: "🚀", subject: "English", timeAgo: "2 days ago", score: 78 },
      { topic: "Plant Life Cycles", emoji: "🌱", subject: "Science", timeAgo: "3 days ago", score: 90 },
      { topic: "Knights & Castles", emoji: "🏰", subject: "History", timeAgo: "5 days ago", score: 73 },
    ],
  },
  {
    id: "mia", name: "Mia", age: 9, avatar: "👧",
    stats: { lessonsCompleted: 32, learningHours: "16h 40m", avgProgress: 42, currentStreak: 8 },
    subjectProgress: [
      { subject: "Maths", progress: 50, color: "#F97316" },
      { subject: "English", progress: 55, color: "#EA580C" },
      { subject: "Science", progress: 40, color: "#F59E0B" },
      { subject: "Geography", progress: 30, color: "#3B82F6" },
      { subject: "History", progress: 25, color: "#10B981" },
      { subject: "Computing", progress: 60, color: "#8B5CF6" },
    ],
    weeklyProgress: [
      { week: "Mon", progress: 38 }, { week: "Tue", progress: 42 }, { week: "Wed", progress: 40 },
      { week: "Thu", progress: 45 }, { week: "Fri", progress: 48 }, { week: "Sat", progress: 35 }, { week: "Sun", progress: 42 },
    ],
    monthlyProgress: [
      { month: "Jan", progress: 20 }, { month: "Feb", progress: 25 }, { month: "Mar", progress: 30 },
      { month: "Apr", progress: 35 }, { month: "May", progress: 42 },
    ],
    curriculumObjectives: [
      { stage: "KS2", subject: "Maths", total: 36, completed: 18 },
      { stage: "KS2", subject: "English", total: 40, completed: 22 },
      { stage: "KS2", subject: "Science", total: 24, completed: 10 },
      { stage: "KS2", subject: "Geography", total: 16, completed: 5 },
    ],
    recentLessons: [
      { topic: "Space & Multiplication", emoji: "🌌", subject: "Maths", timeAgo: "1 hour ago", score: 88 },
      { topic: "Creative Writing: Fantasy World", emoji: "📝", subject: "English", timeAgo: "Yesterday", score: 91 },
      { topic: "Solar System Exploration", emoji: "🪐", subject: "Science", timeAgo: "3 days ago", score: 76 },
      { topic: "Coding: Scratch Basics", emoji: "💻", subject: "Computing", timeAgo: "4 days ago", score: 95 },
    ],
  },
];

type ExportFormat = "pdf" | "docx" | "email" | null;
type EmailTarget = "primary" | "alternative";

export default function ReportPage() {
  const [activeChild, setActiveChild] = useState(childrenData[0]);
  const [exportFormat, setExportFormat] = useState<ExportFormat>(null);
  const [emailTarget, setEmailTarget] = useState<EmailTarget>("primary");
  const [primaryEmail, setPrimaryEmail] = useState("mark.fenty@gmail.com");
  const [altEmail, setAltEmail] = useState("");
  const [altName, setAltName] = useState("");
  const [customFilename, setCustomFilename] = useState(`KokoLearn-Report-${activeChild.name}-${new Date().toISOString().split("T")[0]}`);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const child = activeChild;

  // ── Update filename when child changes ──
  const handleChildChange = (c: Child) => {
    setActiveChild(c);
    setCustomFilename(`KokoLearn-Report-${c.name}-${new Date().toISOString().split("T")[0]}`);
  };

  // ── PDF Export (browser print → Save as PDF) ──
  const handlePdfExport = () => {
    setIsGenerating(true);
    setExportFormat("pdf");
    // Small delay to let state update, then print
    setTimeout(() => {
      window.print();
      setIsGenerating(false);
      setExportFormat(null);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 4000);
    }, 300);
  };

  // ── DOCX Export ──
  const handleDocxExport = async () => {
    setIsGenerating(true);
    setExportFormat("docx");
    try {
      const res = await fetch("/api/report/docx", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ child, filename: customFilename }),
      });
      if (!res.ok) throw new Error("Generation failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${customFilename}.docx`;
      a.click();
      URL.revokeObjectURL(url);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 4000);
    } catch (err) {
      alert("DOCX generation failed. Please try PDF instead.");
    } finally {
      setIsGenerating(false);
      setExportFormat(null);
    }
  };

  // ── Email Export ──
  const handleEmailExport = (target: EmailTarget) => {
    setEmailTarget(target);
    setIsGenerating(true);
    setExportFormat("email");
    const recipient = target === "primary" ? primaryEmail : altEmail;
    // Mock — in production, POST to /api/report/email
    setTimeout(() => {
      setIsGenerating(false);
      setExportFormat(null);
      setIsSent(true);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setIsSent(false);
      }, 4000);
    }, 1500);
  };

  const today = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Header ── */}
      <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-primary transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-sm font-bold text-white">
              MF
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* ── Export Controls ── */}
        <div className="mb-8 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm print:hidden">
          <h1 className="text-xl font-bold text-gray-900 mb-1">Generate Report</h1>
          <p className="text-sm text-gray-500 mb-6">Select a format below to export {child.name}&apos;s progress report.</p>

          {/* Child selector */}
          <div className="mb-6 flex flex-wrap items-center gap-2">
            {childrenData.map((c) => (
              <button
                key={c.id}
                onClick={() => handleChildChange(c)}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                  activeChild.id === c.id
                    ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/20"
                    : "bg-white border border-gray-200 text-gray-600 hover:border-primary/30"
                }`}
              >
                <span className="text-lg">{c.avatar}</span>
                {c.name}, age {c.age}
              </button>
            ))}
          </div>

          {/* Filename */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
              <FileText className="h-4 w-4 text-gray-400" />
              Filename
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={customFilename}
                onChange={(e) => setCustomFilename(e.target.value)}
                className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
              <span className="text-sm text-gray-400 font-medium">.pdf / .docx</span>
            </div>
          </div>

          {/* Export buttons — 3-column grid */}
          <div className="grid gap-4 sm:grid-cols-3">
            {/* PDF */}
            <button
              onClick={handlePdfExport}
              disabled={isGenerating}
              className="group flex flex-col items-center gap-3 rounded-2xl border-2 border-gray-200 bg-white p-6 hover:border-red-300 hover:bg-red-50/30 transition-all disabled:opacity-50"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 group-hover:bg-red-100 transition-colors">
                {isGenerating && exportFormat === "pdf" ? (
                  <Loader2 className="h-7 w-7 text-red-500 animate-spin" />
                ) : (
                  <FileText className="h-7 w-7 text-red-500" />
                )}
              </div>
              <div className="text-center">
                <p className="font-bold text-gray-900">Save as PDF</p>
                <p className="text-xs text-gray-500 mt-0.5">Opens print dialog → Save as PDF</p>
              </div>
            </button>

            {/* DOCX */}
            <button
              onClick={handleDocxExport}
              disabled={isGenerating}
              className="group flex flex-col items-center gap-3 rounded-2xl border-2 border-gray-200 bg-white p-6 hover:border-blue-300 hover:bg-blue-50/30 transition-all disabled:opacity-50"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 group-hover:bg-blue-100 transition-colors">
                {isGenerating && exportFormat === "docx" ? (
                  <Loader2 className="h-7 w-7 text-blue-500 animate-spin" />
                ) : (
                  <FileDown className="h-7 w-7 text-blue-500" />
                )}
              </div>
              <div className="text-center">
                <p className="font-bold text-gray-900">Download .docx</p>
                <p className="text-xs text-gray-500 mt-0.5">Editable Word document</p>
              </div>
            </button>

            {/* Email */}
            <div className="rounded-2xl border-2 border-gray-200 bg-white p-6 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50">
                  <Mail className="h-7 w-7 text-green-500" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Email Report</p>
                  <p className="text-xs text-gray-500">Send directly to inbox</p>
                </div>
              </div>

              {/* Primary email */}
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Your email</label>
                <input
                  type="email"
                  value={primaryEmail}
                  onChange={(e) => setPrimaryEmail(e.target.value)}
                  placeholder="parent@email.com"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>

              {/* Alternative email */}
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block flex items-center gap-1">
                  <UserPlus className="h-3 w-3" />
                  Also send to (e.g., grandparent, tutor)
                </label>
                <div className="space-y-1.5">
                  <input
                    type="text"
                    value={altName}
                    onChange={(e) => setAltName(e.target.value)}
                    placeholder="Their name (optional)"
                    className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                  <input
                    type="email"
                    value={altEmail}
                    onChange={(e) => setAltEmail(e.target.value)}
                    placeholder="grandparent@email.com"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Send buttons */}
              <div className="flex gap-2 mt-1">
                <button
                  onClick={() => handleEmailExport("primary")}
                  disabled={isGenerating || !primaryEmail}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-primary to-secondary px-3 py-2 text-sm font-semibold text-white hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {isGenerating && exportFormat === "email" && emailTarget === "primary" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <SendHorizonal className="h-4 w-4" />
                  )}
                  Send to Me
                </button>
                {altEmail && (
                  <button
                    onClick={() => handleEmailExport("alternative")}
                    disabled={isGenerating}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border-2 border-primary/30 px-3 py-2 text-sm font-semibold text-primary hover:bg-primary-50 transition-all disabled:opacity-50"
                  >
                    {isGenerating && exportFormat === "email" && emailTarget === "alternative" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <SendHorizonal className="h-4 w-4" />
                    )}
                    Send to {altName || "Other"}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Success toast */}
          {showSuccess && (
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm font-medium text-emerald-700 animate-fade-in">
              <Check className="h-4 w-4" />
              {exportFormat === "email" ? `Report emailed to ${emailTarget === "primary" ? primaryEmail : altEmail}!` : "Report downloaded successfully!"}
              <span className="text-emerald-500 text-xs ml-1">(saved to our system)</span>
            </div>
          )}
        </div>

        {/* ── Report Preview ── */}
        <div ref={reportRef} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden report-preview">
          {/* Print header (visible only when printing) */}
          <div className="hidden print:block p-8 border-b-4 border-primary">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">KokoLearn Progress Report</h1>
                <p className="text-gray-500 mt-1">AI-powered tutoring aligned to the UK National Curriculum</p>
              </div>
              <div className="text-right text-sm text-gray-500">
                <p>Generated: {today}</p>
                <p>Report for: {child.name}, Age {child.age}</p>
              </div>
            </div>
          </div>

          {/* Screen header */}
          <div className="print:hidden p-6 sm:p-8 border-b border-gray-100 bg-gradient-to-r from-primary-50 to-white">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-1">Progress Report</p>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  {child.avatar} {child.name}&apos;s Learning Journey
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">Generated {today} · Age {child.age} · {child.id === "alex" ? "KS1" : "KS2"}</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Calendar className="h-4 w-4" />
                {today}
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-8">
            {/* ── Stats Overview ── */}
            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Overview
              </h3>
              <div className="grid gap-4 xs:grid-cols-2 lg:grid-cols-4">
                {[
                  { label: "Lessons Completed", value: child.stats.lessonsCompleted, bg: "bg-primary-50", color: "text-primary" },
                  { label: "Learning Hours", value: child.stats.learningHours, bg: "bg-amber-50", color: "text-amber-600" },
                  { label: "Average Progress", value: `${child.stats.avgProgress}%`, bg: "bg-emerald-50", color: "text-emerald-600" },
                  { label: "Current Streak", value: `${child.stats.currentStreak} days 🔥`, bg: "bg-red-50", color: "text-red-500" },
                ].map((s) => (
                  <div key={s.label} className={`rounded-xl ${s.bg} p-4`}>
                    <p className="text-xs font-medium text-gray-500">{s.label}</p>
                    <p className={`text-2xl font-bold ${s.color} mt-1`}>{s.value}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* ── Subject Breakdown ── */}
            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Target className="h-5 w-5 text-secondary" />
                Subject Breakdown
              </h3>
              <div className="space-y-3">
                {child.subjectProgress.map((s) => (
                  <div key={s.subject} className="flex items-center gap-4">
                    <span className="w-24 text-sm font-medium text-gray-700">{s.subject}</span>
                    <div className="flex-1 h-3 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${s.progress}%`, background: s.color }}
                      />
                    </div>
                    <span className="w-10 text-right text-sm font-bold" style={{ color: s.color }}>{s.progress}%</span>
                  </div>
                ))}
              </div>
            </section>

            {/* ── Skill Heatmap ── */}
            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Flame className="h-5 w-5 text-amber-500" />
                Skill Heatmap
              </h3>
              <p className="text-xs text-gray-500 mb-3">Darker = more progress. Hover for details.</p>
              <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2">
                {[
                  { skill: "Addition", lvl: 90 }, { skill: "Subtraction", lvl: 85 }, { skill: "Multiplication", lvl: 60 },
                  { skill: "Division", lvl: 45 }, { skill: "Reading", lvl: 75 }, { skill: "Writing", lvl: 65 },
                  { skill: "Spelling", lvl: 70 }, { skill: "Biology", lvl: 55 }, { skill: "Physics", lvl: 40 },
                  { skill: "Chemistry", lvl: 35 }, { skill: "Maps", lvl: 50 }, { skill: "Timelines", lvl: 30 },
                  { skill: "Creativity", lvl: 80 }, { skill: "Problem Solving", lvl: 68 }, { skill: "Memory", lvl: 72 },
                  { skill: "Focus", lvl: 60 },
                ].map((s) => {
                  const alpha = 0.15 + (s.lvl / 100) * 0.85;
                  return (
                    <div
                      key={s.skill}
                      className="group relative rounded-lg p-3 text-center cursor-help transition-transform hover:scale-105"
                      style={{ backgroundColor: `rgba(249, 115, 22, ${alpha})` }}
                    >
                      <p className="text-xs font-semibold text-gray-800">{s.skill}</p>
                      <p className="text-lg font-bold" style={{ color: s.lvl >= 70 ? "#F97316" : s.lvl >= 40 ? "#EA580C" : "#9A3412" }}>{s.lvl}%</p>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 flex flex-wrap gap-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded" style={{ background: "rgba(249,115,22,0.85)" }} />
                  <span className="text-gray-500">Strong (70-100%)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded" style={{ background: "rgba(249,115,22,0.55)" }} />
                  <span className="text-gray-500">Developing (40-69%)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded" style={{ background: "rgba(249,115,22,0.25)" }} />
                  <span className="text-gray-500">Needs Focus (0-39%)</span>
                </div>
              </div>
            </section>

            {/* ── Strengths & Areas for Improvement ── */}
            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Personalised Insights</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-5">
                  <h4 className="font-bold text-emerald-700 text-sm flex items-center gap-1.5 mb-3">
                    ✅ Strengths
                  </h4>
                  <ul className="space-y-1.5 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-500 mt-0.5">•</span>
                      Strong engagement with dinosaur-themed maths lessons — uses interest-driven learning effectively
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-500 mt-0.5">•</span>
                      Maintains a {child.stats.currentStreak}-day learning streak — shows consistent commitment
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-500 mt-0.5">•</span>
                      Excels in creative subjects — Art & Design at {child.subjectProgress.find(s => s.subject.includes("Art"))?.progress || 70}%
                    </li>
                  </ul>
                </div>
                <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-5">
                  <h4 className="font-bold text-amber-700 text-sm flex items-center gap-1.5 mb-3">
                    🎯 Areas to Focus
                  </h4>
                  <ul className="space-y-1.5 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 mt-0.5">•</span>
                      History and Geography need more attention — try adventure-themed lessons
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 mt-0.5">•</span>
                      Science scores dip mid-week — consider shorter, more frequent sessions
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 mt-0.5">•</span>
                      Weekend engagement drops ~15% — gamified weekend challenges could help
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* ── Curriculum Coverage ── */}
            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                National Curriculum Coverage — {child.id === "alex" ? "KS1" : "KS2"}
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {child.curriculumObjectives.map((obj) => {
                  const pct = Math.round((obj.completed / obj.total) * 100);
                  return (
                    <div key={`${obj.stage}-${obj.subject}`} className="rounded-xl border border-gray-100 p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-semibold text-primary">
                          {obj.stage}
                        </span>
                        <span className="text-xs font-bold text-gray-400">{obj.completed}/{obj.total} objectives</span>
                      </div>
                      <h4 className="text-sm font-semibold text-gray-900">{obj.subject}</h4>
                      <div className="mt-2 flex items-center gap-3">
                        <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                          <div className="h-full rounded-full bg-gradient-to-r from-primary to-secondary" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-sm font-bold text-primary">{pct}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* ── Recent Activity ── */}
            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-secondary" />
                Recent Lesson Activity
              </h3>
              <div className="space-y-2">
                {child.recentLessons.map((lesson) => (
                  <div key={lesson.topic} className="flex items-center gap-3 rounded-xl border border-gray-100 p-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-xl">
                      {lesson.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{lesson.topic}</p>
                      <p className="text-xs text-gray-400">{lesson.subject} · {lesson.timeAgo}</p>
                    </div>
                    <div className={`flex items-center gap-1 text-sm font-bold ${lesson.score >= 80 ? "text-emerald-600" : lesson.score >= 60 ? "text-amber-600" : "text-red-500"}`}>
                      {lesson.score}%
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ── Recommendations ── */}
            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Recommended Next Steps</h3>
              <div className="space-y-3">
                {[
                  { emoji: "🦕", text: "Continue dinosaur-themed maths — it's working brilliantly. Try introducing multiplication through 'Dino Pack Counting'." },
                  { emoji: "🗺️", text: "Start a weekly 'Country of the Week' geography challenge to boost map skills and cultural awareness." },
                  { emoji: "🧪", text: "Add 2 short science quizzes per week — aim for Tuesday and Thursday when engagement peaks." },
                ].map((rec, i) => (
                  <div key={i} className="flex items-start gap-3 rounded-xl border border-primary-100 bg-primary-50/20 p-4">
                    <span className="text-xl mt-0.5">{rec.emoji}</span>
                    <p className="text-sm text-gray-700">{rec.text}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* ── Footer ── */}
          <div className="border-t border-gray-100 p-6 sm:p-8 text-center text-xs text-gray-400">
            <p>Generated by KokoLearn.org — AI-powered tutoring aligned to the UK National Curriculum</p>
            <p className="mt-1">A PAD-CIC initiative · <span className="underline">https://kokolearn.org</span></p>
            <p className="mt-1">Report saved to our system for future reference.</p>
          </div>
        </div>

        {/* ── Bottom CTA (for returning to dashboard) ── */}
        <div className="mt-6 text-center print:hidden">
          <Link href="/dashboard" className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 font-medium text-gray-600 hover:border-primary/30 hover:text-primary transition-all">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>
      </main>

      {/* ── Print Styles ── */}
      <style jsx global>{`
        @media print {
          body * { visibility: hidden; }
          .report-preview, .report-preview * { visibility: visible; }
          .report-preview { position: absolute; left: 0; top: 0; width: 100%; border: none !important; box-shadow: none !important; }
          .print\\:hidden { display: none !important; }
          .print\\:block { display: block !important; }
          @page { margin: 15mm; size: A4; }
        }
      `}</style>
    </div>
  );
}
