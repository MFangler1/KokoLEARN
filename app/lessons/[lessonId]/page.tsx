// ── Lesson Viewer Page ──
// Interactive lesson with questions, scoring, and curriculum tracking

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Sparkles, CheckCircle, XCircle, Star, Home, Loader2, Clock } from "lucide-react";
import { useSession } from "@/lib/auth/client";
import type { Subject } from "@/lib/curriculum/data";
import SpeakButton from "@/components/SpeakButton";
import PresenterOwl from "@/components/PresenterOwl";
import SubjectImage from "@/components/SubjectImage";
import TutorChat from "@/components/TutorChat";

// ── Types ──
interface Question {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface LessonData {
  id: string | null;
  title: string;
  subject: string;
  objectiveId: string;
  objective: string;
  keyStage: string;
  explanation: string;
  keyPoints: string[];
  questions: Question[];
  funFact: string;
  nextSteps: string;
}

interface AnswerState {
  questionIndex: number;
  selectedAnswer: number;
  correctAnswer: number;
  isCorrect: boolean;
}

type Phase = "generating" | "learning" | "questions" | "results";

export default function LessonPage({ params }: { params: { lessonId: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, isPending: sessionLoading } = useSession();

  const childName = searchParams.get("child") || "Alex";
  const childAge = parseInt(searchParams.get("age") || "7");
  const subject = (searchParams.get("subject") || "Maths") as Subject;
  const interestsStr = searchParams.get("interests") || "Dinosaurs,Space";
  const interests = interestsStr.split(",").filter(Boolean);
  const sessionUserId = session?.user?.id;

  const [phase, setPhase] = useState<Phase>("generating");
  const [lesson, setLesson] = useState<LessonData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [chatSubject, setChatSubject] = useState(subject);
  const [chatContext, setChatContext] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<AnswerState[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [stars, setStars] = useState(0);
  const [newAchievements, setNewAchievements] = useState<any[]>([]);
  const [showReward, setShowReward] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [generated, setGenerated] = useState(false);
  // ── Check if user has Extended Questions add-on ──
  const [questionCount, setQuestionCount] = useState(5);

  useEffect(() => {
    if (!sessionUserId) return;
    fetch("/api/subscription/status")
      .then(r => r.json())
      .then(data => {
        if (data.extendedQuestions) setQuestionCount(10);
      })
      .catch(() => {});
  }, [sessionUserId]);

  // ── Timer / Duration ──
  const lessonStartRef = useRef<number>(0);
  const [elapsed, setElapsed] = useState(0);

  // Generate lesson on mount (runs once only, safe regardless of session changes)
  const hasGenerated = useRef(false);

  const generateLesson = useCallback(async () => {
    if (hasGenerated.current) return;
    if (sessionLoading) return;
    if (!sessionUserId) {
      setError("Please sign in again before starting a lesson.");
      setPhase("learning");
      return;
    }
    hasGenerated.current = true;
    try {
      setPhase("generating");
      setGenerated(true);
      const res = await fetch("/api/lessons/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          childName,
          childAge,
          interests: interestsStr.split(",").filter(Boolean),
          subject,
          userId: sessionUserId,
          questionCount,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Failed to generate lesson (${res.status})`);
      }

      const data = await res.json();
      if (!data.lesson?.id) {
        throw new Error("Lesson was generated but could not be saved. Please try again.");
      }
      setLesson(data.lesson);
      setChatSubject(data.lesson.subject);
      setChatContext(data.lesson.explanation?.substring(0, 200) || "");
      lessonStartRef.current = Date.now();
      setPhase("learning");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setPhase("learning"); // Show error state
    }
  }, [childName, childAge, interestsStr, subject, sessionUserId, sessionLoading, questionCount]);

  const retryGeneration = () => {
    hasGenerated.current = false;
    setGenerated(false);
    setError(null);
    void generateLesson();
  };

  useEffect(() => {
    if (generated) return;
    // Small delay to show the generating animation
    const timer = setTimeout(generateLesson, 800);
    return () => clearTimeout(timer);
  }, [generateLesson, generated]);

  // Start questions phase
  const startQuestions = () => {
    lessonStartRef.current = Date.now();
    setElapsed(0);
    setPhase("questions");
    setCurrentQuestion(0);
    setAnswers([]);
  };

  // Handle answer selection
  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null || !lesson) return;
    setSelectedAnswer(index);
    setShowExplanation(true);

    const isCorrect = index === lesson.questions[currentQuestion].correctIndex;
    setAnswers(prev => [...prev, {
      questionIndex: currentQuestion,
      selectedAnswer: index,
      correctAnswer: lesson.questions[currentQuestion].correctIndex,
      isCorrect,
    }]);

    if (isCorrect) setCorrectCount(c => c + 1);
  };

  // Go to next question
  const nextQuestion = () => {
    if (!lesson) return;
    if (currentQuestion < lesson.questions.length - 1) {
      setCurrentQuestion(q => q + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      finishLesson();
    }
  };

  // ── Timer tick effect ──
  useEffect(() => {
    if (phase !== "questions") return;
    const interval = setInterval(() => {
      if (lessonStartRef.current > 0) {
        setElapsed(Math.floor((Date.now() - lessonStartRef.current) / 1000));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [phase]);

  function formatDuration(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  // Submit answers and show results
  const finishLesson = async () => {
    const total = lesson?.questions.length || 1;
    const finalScore = Math.round((correctCount / total) * 100);
    setScore(finalScore);
    setStars(finalScore >= 90 ? 3 : finalScore >= 70 ? 2 : finalScore >= 40 ? 1 : 0);
    setPhase("results");

    const durationSeconds = lessonStartRef.current > 0
      ? Math.floor((Date.now() - lessonStartRef.current) / 1000)
      : 0;

    // Submit to backend
    try {
      setSaveError(null);
      if (!session?.user?.id) {
        setSaveError("Please sign in again so this result can be saved.");
        return;
      }
      const res = await fetch("/api/lessons/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId: lesson?.id,
          answers: answers.map(a => ({
            questionIndex: a.questionIndex,
            selectedAnswer: a.selectedAnswer,
            correctAnswer: a.correctAnswer,
            isCorrect: a.isCorrect,
          })),
          userId: session.user.id,
          childName,
          objectiveId: lesson?.objectiveId,
          subject: lesson?.subject,
          durationSeconds,
        }),
      });
      if (res.ok) {
        const submitData = await res.json();
        if (submitData.stars !== undefined) setStars(submitData.stars);
        if (submitData.newAchievements?.length > 0) {
          setNewAchievements(submitData.newAchievements);
          setTimeout(() => setShowReward(true), 500);
        }
      } else {
        const submitData = await res.json().catch(() => ({}));
        setSaveError(submitData.error || "Your result could not be saved. Please try again.");
      }
    } catch {
      setSaveError("Your result could not be saved. Please check your connection and try again.");
    }
  };

  // ── Loading State ──
  if (phase === "generating") {
    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 px-4">
        {/* Home button */}
        <div className="absolute top-4 left-4">
          <Link href="/dashboard" className="inline-flex items-center gap-1.5 rounded-lg bg-white border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-primary hover:border-primary/30 transition-all shadow-sm">
            <Home className="h-4 w-4" /> Home
          </Link>
        </div>
        <div className="text-center">
          <div className="mx-auto mb-6">
            <SubjectImage subject={subject} size={220} className="animate-float" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Creating Your Lesson...</h1>
          <p className="text-gray-500 mb-6">Teaching &ldquo;{subject}&rdquo; through {interests[0]} &amp; {interests[1]}!</p>
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <span className="text-sm text-gray-400">AI is building your personalised lesson</span>
          </div>
        </div>
      </div>
    );
  }

  // ── Error State ──
  if (error && !lesson) {
    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 px-4">
        {/* Home button */}
        <div className="absolute top-4 left-4">
          <Link href="/dashboard" className="inline-flex items-center gap-1.5 rounded-lg bg-white border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-primary hover:border-primary/30 transition-all shadow-sm">
            <Home className="h-4 w-4" /> Home
          </Link>
        </div>
        <div className="max-w-md text-center">
          <div className="mx-auto mb-6">
            <SubjectImage subject={subject} size={160} className="opacity-80" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h1>
          <p className="text-gray-500 mb-6">{error}</p>
          <button onClick={retryGeneration} className="rounded-xl bg-gradient-to-r from-primary to-secondary px-6 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!lesson) return null;

  // ── Learning Phase (explanation) ──
  if (phase === "learning") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        <div className="mx-auto max-w-3xl px-4 py-8">
          {/* Header with Home button */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link href="/dashboard" className="inline-flex items-center gap-1.5 rounded-lg bg-white border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-primary hover:border-primary/30 transition-all shadow-sm">
                <Home className="h-4 w-4" /> Home
              </Link>
            </div>
            <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary">
              {lesson.subject} · {lesson.keyStage}
            </span>
          </div>

          {/* Title */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4">
              <SubjectImage subject={lesson.subject} size={200} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">{lesson.title}</h1>
            <p className="mt-2 text-sm text-gray-500">{lesson.objective}</p>
          </div>

          {/* Explanation with audio */}
          <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <div className="flex items-start justify-between gap-4 mb-4">
              <h3 className="text-lg font-bold text-gray-900">📖 Lesson</h3>
              <SpeakButton text={lesson.title + ". " + lesson.explanation} label="Lesson" />
            </div>
            <div className="prose-custom text-gray-700 leading-relaxed whitespace-pre-line">
              {lesson.explanation}
            </div>
          </div>

          {/* Key Points with audio */}
          <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <div className="flex items-start justify-between gap-4 mb-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Star className="h-5 w-5 text-amber-500" />
                Key Points to Remember
              </h3>
              <SpeakButton text={lesson.keyPoints.join(". ")} label="Key Points" />
            </div>
            <ul className="space-y-3">
              {lesson.keyPoints.map((point, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-700">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-50 text-xs font-bold text-primary">{i + 1}</span>
                  <span className="flex-1">{point}</span>
                  <SpeakButton text={point} size="sm" className="shrink-0" />
                </li>
              ))}
            </ul>
          </div>

          {/* Fun Fact with audio */}
          <div className="mb-8 rounded-2xl border border-amber-200 bg-amber-50 p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="text-sm font-semibold text-amber-800 mb-1">💡 Fun Fact</p>
                <p className="text-amber-700">{lesson.funFact}</p>
              </div>
              <SpeakButton text={lesson.funFact} label="Fun Fact" />
            </div>
          </div>

          {/* Start Questions */}
          <button onClick={startQuestions} className="group w-full rounded-xl bg-gradient-to-r from-primary to-secondary py-4 text-lg font-bold text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
            Ready for Questions? 🎯
          </button>
        </div>
        {/* Tutor Chat */}
        <TutorChat childAge={childAge} subject={chatSubject} lessonContext={chatContext} />
      </div>
    );
  }

  // ── Questions Phase ──
  if (phase === "questions") {
    const q = lesson.questions[currentQuestion];
    if (!q) return null;

    const progressPercent = Math.round(((currentQuestion + 1) / lesson.questions.length) * 100);

    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        <div className="mx-auto max-w-2xl px-4 py-8">
          {/* Back button + Home + timer */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPhase("learning")}
                className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary transition-colors"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              <Link href="/dashboard" className="inline-flex items-center gap-1.5 rounded-lg bg-white border border-gray-200 px-2.5 py-1.5 text-sm font-medium text-gray-600 hover:text-primary hover:border-primary/30 transition-all shadow-sm">
                <Home className="h-4 w-4" /> Home
              </Link>
            </div>
            <div className="flex items-center gap-1.5 text-sm font-mono text-gray-500 bg-gray-100 px-2.5 py-1 rounded-lg">
              <Clock className="h-3.5 w-3.5" />
              {formatDuration(elapsed)}
            </div>
          </div>
          {/* Progress bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
              <span>Question {currentQuestion + 1} of {lesson.questions.length}</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
              <div className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-500" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>

          {/* Question card with audio */}
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <div className="flex items-start justify-between gap-4 mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex-1">{q.question}</h2>
              <SpeakButton text={q.question + ". Options: " + q.options.join(". ")} label="Read question" />
            </div>
            <div className="space-y-3">
              {q.options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrectOption = q.correctIndex === index;
                let buttonStyle = "border-gray-200 hover:border-primary/30 hover:bg-gray-50";

                if (showExplanation) {
                  if (isCorrectOption) buttonStyle = "border-green-500 bg-green-50 ring-2 ring-green-200";
                  else if (isSelected && !isCorrectOption) buttonStyle = "border-red-400 bg-red-50 ring-2 ring-red-200";
                } else if (isSelected) {
                  buttonStyle = "border-primary bg-primary-50";
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    disabled={showExplanation}
                    className={`flex w-full items-center gap-4 rounded-xl border-2 p-4 text-left transition-all ${buttonStyle}`}
                  >
                    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${
                      showExplanation && isCorrectOption ? "bg-green-500 text-white" :
                      showExplanation && isSelected && !isCorrectOption ? "bg-red-500 text-white" :
                      "bg-gray-100 text-gray-600"
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="text-gray-700 font-medium">{option.replace(/^[A-D]\)\s*/, "")}</span>
                    {showExplanation && isCorrectOption && <CheckCircle className="ml-auto h-5 w-5 text-green-600 shrink-0" />}
                    {showExplanation && isSelected && !isCorrectOption && <XCircle className="ml-auto h-5 w-5 text-red-500 shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Explanation */}
            {showExplanation && (
              <div className={`mt-6 rounded-xl p-4 ${selectedAnswer === q.correctIndex ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
                <p className="text-sm font-semibold mb-1">
                  {selectedAnswer === q.correctIndex ? "✨ Correct!" : "👀 Not quite!"}
                </p>
                <p className="text-sm text-gray-600">{q.explanation}</p>
                <button
                  onClick={nextQuestion}
                  className="mt-4 rounded-xl bg-gradient-to-r from-primary to-secondary px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:shadow-lg transition-all"
                >
                  {currentQuestion < lesson.questions.length - 1 ? "Next Question →" : "See Results 🏆"}
                </button>
              </div>
            )}
          </div>
          {/* Tutor Chat */}
          <TutorChat childAge={childAge} subject={chatSubject} lessonContext={chatContext} />
        </div>
      </div>
    );
  }

  // ── Results Phase ──
  if (phase === "results") {
    const passed = score >= 60;
    const nextLink = `/lessons/new?child=${childName}&age=${childAge}&subject=${subject}&interests=${interestsStr}`;

    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        <div className="mx-auto max-w-lg px-4 py-16 text-center">
          <div className="mx-auto mb-6 animate-fade-in">
            <SubjectImage subject={lesson.subject} size={200} />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {passed ? "Amazing Work! 🌟" : "Great Effort! 💪"}
          </h1>
          <p className="text-gray-500 mb-8">{lesson.title}</p>

          {/* Star rating */}
          <div className="mb-4 flex justify-center gap-2">
            {[1, 2, 3].map(n => (
              <span
                key={n}
                className={`text-4xl transition-all duration-500 ${
                  n <= stars ? "scale-100 opacity-100" : "scale-75 opacity-20"
                } ${n <= stars ? "animate-bounce" : ""}`}
                style={{ animationDelay: `${n * 200}ms` }}
              >
                ⭐
              </span>
            ))}
          </div>

          {/* Score display */}
          <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <div className="mb-4">
              <div className="text-5xl font-bold mb-2" style={{ color: passed ? "#22C55E" : "#F97316" }}>
                {score}%
              </div>
              <p className="text-gray-500 text-sm">{correctCount} of {lesson.questions.length} correct</p>
              {elapsed > 0 && (
                <p className="text-xs text-gray-400 mt-1">⏱ Completed in {formatDuration(elapsed)}</p>
              )}
            </div>

            {/* Progress ring visual */}
            <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
              <div className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all" style={{ width: `${score}%` }} />
            </div>
          </div>

          {saveError && (
            <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 p-4 text-left">
              <p className="text-sm font-semibold text-red-700">Progress not saved</p>
              <p className="mt-1 text-sm text-red-600">{saveError}</p>
            </div>
          )}

          {/* New achievements celebration */}
          {newAchievements.length > 0 && showReward && (
            <div className="mb-8 animate-fade-in">
              <div className="rounded-2xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50 p-6 shadow-lg">
                <p className="text-sm font-bold text-amber-800 mb-3">🏅 New Achievement{newAchievements.length > 1 ? "s" : ""} Unlocked!</p>
                <div className="flex flex-wrap justify-center gap-3">
                  {newAchievements.map((ach, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 shadow-sm border border-amber-100 animate-bounce"
                      style={{ animationDelay: `${i * 300}ms` }}
                    >
                      <span className="text-2xl">{ach.icon}</span>
                      <div className="text-left">
                        <p className="text-sm font-bold text-gray-900">{ach.label}</p>
                        <p className="text-xs text-gray-500">{ach.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Feedback per question */}
          <div className="mb-8 space-y-3 text-left">
            {lesson.questions.map((q, i) => {
              const answer = answers[i];
              if (!answer) return null;
              return (
                <div key={i} className={`rounded-xl border p-4 ${answer.isCorrect ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
                  <div className="flex items-start gap-3">
                    {answer.isCorrect ? <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 shrink-0" /> : <XCircle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />}
                    <div>
                      <p className="text-sm font-medium text-gray-900">Q{i + 1}: {q.question.length > 60 ? q.question.substring(0, 60) + "..." : q.question}</p>
                      <p className="text-xs text-gray-500 mt-1">{q.explanation}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Next steps */}
          <div className="mb-8 rounded-2xl border border-primary-100 bg-primary-50 p-6">
            <p className="text-sm font-semibold text-primary mb-1">📖 Next Step</p>
            <p className="text-sm text-gray-600">{lesson.nextSteps}</p>
          </div>

          {/* Quick subject picker */}
          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-700 mb-3">Try a different subject:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {[
                { subject: "Maths", emoji: "🔢" },
                { subject: "English", emoji: "📖" },
                { subject: "Science", emoji: "🔬" },
                { subject: "Geography", emoji: "🌍" },
                { subject: "History", emoji: "🏰" },
                { subject: "Art", emoji: "🎨" },
                { subject: "Computing", emoji: "💻" },
                { subject: "AI", emoji: "🤖" },
              ].filter(s => s.subject !== subject).map(s => (
                <Link
                  key={s.subject}
                  href={`/lessons/new?child=${childName}&age=${childAge}&subject=${s.subject}&interests=${interestsStr}`}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:border-primary/30 hover:text-primary hover:bg-primary-50 transition-all shadow-sm"
                >
                  <span>{s.emoji}</span>
                  {s.subject}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-3">
            <Link href={nextLink} className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-secondary px-8 py-4 text-lg font-semibold text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
              <Sparkles className="h-5 w-5" />
              Generate New Lesson
            </Link>
            <Link href="/dashboard" className="inline-flex items-center justify-center gap-2 rounded-xl bg-white border border-gray-200 px-8 py-3 text-sm font-medium text-gray-600 hover:border-primary/30 hover:text-primary hover:bg-primary-50 transition-all shadow-sm">
              <Home className="h-4 w-4" />
              Home
            </Link>
          </div>
          {/* Tutor Chat */}
          <TutorChat childAge={childAge} subject={chatSubject} lessonContext={chatContext} />
        </div>
      </div>
    );
  }

  return null;
}
