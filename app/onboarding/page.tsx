"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Brain, ArrowLeft, ArrowRight, Sparkles } from "lucide-react";

const interests = [
  { emoji: "🦕", label: "Dinosaurs", category: "Science" },
  { emoji: "🌌", label: "Space", category: "Science" },
  { emoji: "⚽", label: "Football", category: "Sports" },
  { emoji: "🎨", label: "Art & Drawing", category: "Creative" },
  { emoji: "🐶", label: "Animals", category: "Science" },
  { emoji: "📚", label: "Reading", category: "English" },
  { emoji: "🧮", label: "Maths", category: "Maths" },
  { emoji: "🎵", label: "Music", category: "Creative" },
  { emoji: "🏰", label: "History", category: "Humanities" },
  { emoji: "🌍", label: "Geography", category: "Humanities" },
  { emoji: "🤖", label: "Robots", category: "Technology" },
  { emoji: "🌿", label: "Nature", category: "Science" },
  { emoji: "🧪", label: "Science", category: "Science" },
  { emoji: "✈️", label: "Travel", category: "Humanities" },
  { emoji: "🎮", label: "Gaming", category: "Technology" },
  { emoji: "🏊", label: "Swimming", category: "Sports" },
];

const learningPaths = [
  { id: "ks1", title: "KS1 Child (Ages 5-7)", desc: "Early primary — building foundational skills in reading, writing, and maths.", icon: "🌱", color: "from-emerald-400 to-emerald-600" },
  { id: "ks2", title: "KS2 Child (Ages 7-11)", desc: "Upper primary — deepening knowledge across all curriculum subjects.", icon: "🌳", color: "from-primary to-secondary" },
  { id: "send", title: "SEND Learner", desc: "Personalised pathways that adapt to individual learning needs, pace and interests.", icon: "🌈", color: "from-purple-400 to-purple-600" },
];

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [learningPath, setLearningPath] = useState<string | null>(null);
  const [childName, setChildName] = useState("");
  const [childAge, setChildAge] = useState("5");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const toggleInterest = (label: string) => {
    setSelectedInterests((prev) =>
      prev.includes(label)
        ? prev.filter((i) => i !== label)
        : prev.length < 5
        ? [...prev, label]
        : prev
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 relative">
      <div className="hidden lg:block absolute right-4 bottom-20 pointer-events-none">
        <Image src="/images/presenter-002.webp" alt="" width={100} height={150} className="object-contain opacity-70" />
      </div>
      <div className="mx-auto flex w-full max-w-2xl flex-col px-4 pt-16 pb-6">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-600 hover:shadow-md transition-all self-start"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>Step {step + 1} of 4</span>
            <span>{Math.round(((step + 1) / 4) * 100)}%</span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 0: Learning Path Selection */}
        {step === 0 && (
          <div className="animate-slide-up">
            <div className="mb-8 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50">
                <Brain className="h-8 w-8 text-primary" />
              </div>
              <h1 className="mt-4 text-3xl font-bold text-gray-900">
                Which best describes your child?
              </h1>
              <p className="mt-2 text-gray-600">
                We&apos;ll tailor everything to their learning stage from the start.
              </p>
            </div>
            <div className="space-y-4">
              {learningPaths.map((path) => (
                <button
                  key={path.id}
                  onClick={() => {
                    setLearningPath(path.id);
                    setStep(1);
                  }}
                  className={`group w-full rounded-2xl border-2 p-6 text-left transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg ${
                    learningPath === path.id
                      ? "border-primary bg-primary-50 shadow-md"
                      : "border-gray-200 bg-white hover:border-primary/30"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <span className="text-3xl">{path.icon}</span>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{path.title}</h3>
                      <p className="mt-1 text-sm text-gray-500">{path.desc}</p>
                    </div>
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r ${path.color} text-white opacity-0 group-hover:opacity-100 transition-opacity`}>
                      <ArrowRight className="h-5 w-5" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-8 rounded-xl border border-purple-100 bg-purple-50 p-4">
              <p className="text-sm text-purple-700">
                <strong>SEND:</strong> KokoLearn adapts to individual learning needs. This is an educational support platform, not a medical or diagnostic service.
              </p>
            </div>
          </div>
        )}

        {/* Step 1: Child's name & age */}
        {step === 1 && (
          <div className="animate-slide-up">
            <div className="mb-8 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50">
                <Brain className="h-8 w-8 text-primary" />
              </div>
              <h1 className="mt-4 text-3xl font-bold text-gray-900">
                Tell us about your child
              </h1>
              <p className="mt-2 text-gray-600">
                We&apos;ll personalise everything for them.
              </p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Child&apos;s name
                  </label>
                  <input
                    type="text"
                    value={childName}
                    onChange={(e) => setChildName(e.target.value)}
                    placeholder="e.g. Alex"
                    className="mt-1 block w-full rounded-xl border border-gray-200 px-4 py-3 text-lg placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Age
                  </label>
                  <select
                    value={childAge}
                    onChange={(e) => setChildAge(e.target.value)}
                    className="mt-1 block w-full rounded-xl border border-gray-200 px-4 py-3 text-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
                  >
                    {Array.from({ length: 7 }, (_, i) => i + 5).map((age) => (
                      <option key={age} value={age}>
                        {age} years old
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                onClick={() => setStep(2)}
                disabled={!childName.trim()}
                className="group mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-secondary py-3 font-semibold text-white shadow-lg shadow-primary/20 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Interests */}
        {step === 2 && (
          <div className="animate-slide-up">
            <div className="mb-8 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50">
                <Sparkles className="h-8 w-8 text-purple" />
              </div>
              <h1 className="mt-4 text-3xl font-bold text-gray-900">
                What are they interested in?
              </h1>
              <p className="mt-2 text-gray-600">
                Pick up to 5 topics. We&apos;ll use these to create their first
                lessons. ({selectedInterests.length}/5)
              </p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {interests.map((interest) => (
                  <button
                    key={interest.label}
                    onClick={() => toggleInterest(interest.label)}
                    className={`flex flex-col items-center gap-1 rounded-xl p-4 text-sm transition-all ${
                      selectedInterests.includes(interest.label)
                        ? "border-2 border-primary bg-primary-50 shadow-sm"
                        : "border border-gray-200 hover:border-primary/30 hover:bg-gray-50"
                    }`}
                  >
                    <span className="text-2xl">{interest.emoji}</span>
                    <span className="font-medium text-gray-700">
                      {interest.label}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {interest.category}
                    </span>
                  </button>
                ))}
              </div>
              <div className="mt-8 flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 rounded-xl bg-primary py-3 font-semibold text-white shadow-sm hover:bg-primary-600 hover:shadow-md transition-all"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={selectedInterests.length === 0}
                  className="group flex-[2] flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-secondary py-3 font-semibold text-white shadow-lg shadow-primary/20 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Confirmation */}
        {step === 3 && (
          <div className="animate-slide-up text-center">
            <div className="mb-8">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary-50">
                <span className="text-4xl">🎉</span>
              </div>
              <h1 className="mt-6 text-3xl font-bold text-gray-900">
                You&apos;re all set, {childName}!
              </h1>
              <p className="mt-2 text-gray-600">
                We&apos;ve created a personalised learning plan based on their
                interests.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm text-left">
              <h3 className="text-lg font-semibold text-gray-900">Learning Profile</h3>
              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <span className="font-medium text-gray-500">Name:</span>
                  <span className="text-gray-900">{childName}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="font-medium text-gray-500">Age:</span>
                  <span className="text-gray-900">{childAge} years</span>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <span className="font-medium text-gray-500 shrink-0">Interests:</span>
                  <div className="flex flex-wrap gap-2">
                    {selectedInterests.map((i) => (
                      <span key={i} className="rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary">
                        {i}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                // Save child data to localStorage
                const existing = JSON.parse(localStorage.getItem("kokolearn_children") || "[]");
                existing.push({
                  id: crypto.randomUUID(),
                  name: childName,
                  age: parseInt(childAge),
                  interests: selectedInterests,
                  createdAt: new Date().toISOString(),
                });
                localStorage.setItem("kokolearn_children", JSON.stringify(existing));
                window.location.href = "/dashboard";
              }}
              className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-secondary px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-primary/20 hover:shadow-xl transition-all hover:-translate-y-0.5"
            >
              Go to Dashboard
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
