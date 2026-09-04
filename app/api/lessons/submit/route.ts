// ── Lesson Answer Submission API ──
// Saves individual answers and calculates final scores

import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase/server";
import { getDb } from "@/lib/db";
import { achievements, referrals, subscriptions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { ACHIEVEMENTS, getStarsForScore } from "@/lib/achievements";
import { initAuth } from "@/lib/auth/server";
import { hasTrustedOrigin } from "@/lib/security/origin";

export async function POST(req: Request) {
  try {
    if (!hasTrustedOrigin(req)) return NextResponse.json({ error: "Invalid request origin" }, { status: 403 });
    const body = await req.json();
    const { lessonId, answers, childName, objectiveId, subject, durationSeconds } = body;

    const auth = await initAuth();
    const session = await auth.api.getSession({ headers: new Headers(req.headers) });
    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const userId = session.user.id;

    if (typeof lessonId !== "string" || lessonId.length > 100 || !Array.isArray(answers) || answers.length === 0 || answers.length > 10 ||
        !Number.isFinite(Number(durationSeconds)) || Number(durationSeconds) < 0 || Number(durationSeconds) > 86400) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json(
        { error: "Lesson storage is not configured. Please try again later." },
        { status: 503 }
      );
    }

    const { data: storedLesson, error: lessonReadError } = await supabase
      .from("lessons")
      .select("id, child_name, subject, objective_id, content, completed")
      .eq("id", lessonId)
      .eq("user_id", userId)
      .single();

    if (lessonReadError || !storedLesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }
    if (storedLesson.completed) {
      return NextResponse.json({ error: "This lesson has already been submitted" }, { status: 409 });
    }

    const questions = storedLesson.content?.questions;
    if (!Array.isArray(questions) || answers.length !== questions.length) {
      return NextResponse.json({ error: "Please answer every question before submitting" }, { status: 400 });
    }

    const normalizedAnswers = answers.map((answer: { questionIndex?: number; selectedAnswer?: number }) => {
      const questionIndex = Number(answer.questionIndex);
      const selectedAnswer = Number(answer.selectedAnswer);
      const question = questions[questionIndex];
      if (!question || !Number.isInteger(selectedAnswer) || selectedAnswer < 0 || selectedAnswer >= question.options.length) {
        throw new Error("Invalid lesson answer");
      }
      const correctAnswer = Number(question.correctIndex);
      return {
        questionIndex,
        selectedAnswer,
        correctAnswer,
        isCorrect: selectedAnswer === correctAnswer,
      };
    });

    // Save answers after verifying them against the server-side lesson.
    const answerRows = normalizedAnswers.map((a) => ({
      lesson_id: lessonId,
      user_id: userId,
      question_index: a.questionIndex,
      selected_answer: a.selectedAnswer,
      correct_answer: a.correctAnswer,
      is_correct: a.isCorrect,
    }));

    const { error: answerError } = await supabase
      .from("lesson_answers")
      .insert(answerRows);

    if (answerError) {
      console.error("Failed to save answers:", answerError);
      return NextResponse.json(
        { error: "Lesson answers could not be saved. Please try again." },
        { status: 500 }
      );
    }

    // Calculate score
    const totalQuestions = normalizedAnswers.length;
    const correctCount = normalizedAnswers.filter((a) => a.isCorrect).length;
    const score = Math.round((correctCount / totalQuestions) * 100);

    // Update lesson record
    const { data: updatedLesson, error: lessonUpdateError } = await supabase
      .from("lessons")
      .update({
        score,
        total_questions: totalQuestions,
        completed: true,
        duration_seconds: durationSeconds || 0,
        updated_at: new Date().toISOString(),
      })
      .eq("id", lessonId)
      .eq("user_id", userId)
      .select("id")
      .single();

    if (lessonUpdateError || !updatedLesson?.id) {
      console.error("Failed to update lesson:", lessonUpdateError);
      return NextResponse.json(
        { error: "Completed lesson could not be saved. Please try again." },
        { status: 500 }
      );
    }

    // Update curriculum progress
    const trustedObjectiveId = storedLesson.objective_id || objectiveId;
    const trustedChildName = storedLesson.child_name || childName || "";
    const trustedSubject = storedLesson.subject || subject || "";
    if (trustedObjectiveId) {
      const { data: existing } = await supabase
        .from("curriculum_progress")
        .select("*")
        .eq("user_id", userId)
        .eq("child_name", trustedChildName)
        .eq("objective_id", trustedObjectiveId)
        .maybeSingle();

      const progressPayload = {
        user_id: userId,
        child_name: trustedChildName,
        objective_id: trustedObjectiveId,
        subject: trustedSubject,
        completed: score >= 60,
        best_score: Math.max(existing?.best_score || 0, score),
        attempts: (existing?.attempts || 0) + 1,
        last_lesson_id: lessonId,
        updated_at: new Date().toISOString(),
      };

      const progressResult = existing
        ? await supabase
            .from("curriculum_progress")
            .update(progressPayload)
            .eq("id", existing.id)
        : await supabase
            .from("curriculum_progress")
            .insert(progressPayload);

      if (progressResult.error) {
        console.error("Failed to update curriculum progress:", progressResult.error);
      }
    }

    // ── Achievement Checking ──
    const stars = getStarsForScore(score);
    const newAchievements: { type: string; label: string; description: string; icon: string }[] = [];

    const db = await getDb();
    if (db) {
      try {
        const earned = await db
          .select({ type: achievements.type })
          .from(achievements)
          .where(eq(achievements.userId, userId))
          .all();
        const earnedTypes = new Set(earned.map((e) => e.type));

        const checkAchievement = (type: string) => {
          if (!earnedTypes.has(type) && ACHIEVEMENTS[type as keyof typeof ACHIEVEMENTS]) {
            const def = ACHIEVEMENTS[type as keyof typeof ACHIEVEMENTS];
            newAchievements.push({ type, ...def });
            // Store in D1
            db.insert(achievements).values({
              id: crypto.randomUUID(),
              userId,
              type,
              label: def.label,
              description: def.description,
              icon: def.icon,
              earnedAt: new Date(),
            }).run().catch(() => {});
          }
        };

        // Check each achievement condition
        checkAchievement("first_lesson");
        if (score === 100) checkAchievement("perfect_score");
        if (score >= 80) checkAchievement("great_score");
        if (durationSeconds && durationSeconds < 180) checkAchievement("fast_learner");

        // Check streak: count consecutive days with lessons
        if (!earnedTypes.has("streak_3") || !earnedTypes.has("streak_7")) {
          const recent = await getSupabase()
            ?.from("lessons")
            .select("created_at")
            .eq("user_id", userId)
            .eq("completed", true)
            .order("created_at", { ascending: false });
          if (recent?.data) {
            const dates = [...new Set(recent.data.map((lesson: { created_at?: string }) => lesson.created_at?.slice(0, 10)).filter((date): date is string => Boolean(date)))];
            // Check consecutive days from today
            let streak = 0;
            for (let i = 0; i < dates.length; i++) {
              const expected = new Date();
              expected.setDate(expected.getDate() - i);
              const expectedStr = expected.toISOString().slice(0, 10);
              if (dates.includes(expectedStr)) streak++;
              else break;
            }
            if (streak >= 7) checkAchievement("streak_7");
            else if (streak >= 3) checkAchievement("streak_3");
          }
        }

        // Check: completed 10 lessons
        if (!earnedTypes.has("ten_lessons")) {
          const countResult = await getSupabase()
            ?.from("lessons")
            .select("id", { count: "exact", head: true })
            .eq("user_id", userId)
            .eq("completed", true);
          if (countResult?.count && countResult.count >= 10) {
            checkAchievement("ten_lessons");
          }
        }

        // Check: completed lessons in all 5 subjects
        if (!earnedTypes.has("all_subjects")) {
          const subjectsResult = await getSupabase()
            ?.from("lessons")
            .select("subject")
            .eq("user_id", userId)
            .eq("completed", true);
          if (subjectsResult?.data) {
            const uniqueSubjects = new Set(subjectsResult.data.map((lesson: { subject: string }) => lesson.subject));
            if (uniqueSubjects.size >= 5) checkAchievement("all_subjects");
          }
        }
      } catch (achievementError) {
        console.error("Achievement checks skipped:", achievementError);
      }

      // ── Referral Reward Check ──
      // If this is the referred user's first lesson, reward the referrer
      try {
        const referralEntry = await db
          .select()
          .from(referrals)
          .where(eq(referrals.referredUserId, userId))
          .get();

        if (referralEntry && referralEntry.status === "signed_up") {
          // Check if this is the referred user's first completed lesson
          const userLessons = await getSupabase()
            ?.from("lessons")
            .select("id", { count: "exact", head: true })
            .eq("user_id", userId)
            .eq("completed", true);

          if (userLessons?.count && userLessons.count <= 3) {
            // Reward the referrer with Extended Questions add-on
            const referrerSub = await db
              .select()
              .from(subscriptions)
              .where(eq(subscriptions.userId, referralEntry.referrerUserId))
              .get();

            if (referrerSub) {
              await db
                .update(subscriptions)
                .set({ extendedQuestions: 1, addonStatus: "granted", updatedAt: new Date() })
                .where(eq(subscriptions.userId, referralEntry.referrerUserId));
              console.log(`🎉 Referral reward: ${referralEntry.referrerUserId} got Extended Questions free!`);
            } else {
              await db.insert(subscriptions).values({
                id: crypto.randomUUID(),
                userId: referralEntry.referrerUserId,
                plan: "free_trial",
                status: "active",
                extendedQuestions: 1,
                addonStatus: "granted",
                createdAt: new Date(),
                updatedAt: new Date(),
              });
            }

            // Mark referral as rewarded
            await db
              .update(referrals)
              .set({ status: "rewarded", rewardedAt: new Date() })
              .where(eq(referrals.id, referralEntry.id));
          }
        }
      } catch (referralError) {
        console.error("Referral reward check skipped:", referralError);
      }
    }

    // Determine if child levels up (score >= 60% = pass)
    const passed = score >= 60;

    return NextResponse.json({
      score,
      correctCount,
      totalQuestions,
      passed,
      stars,
      newAchievements,
      feedback: passed
        ? `Amazing! You got ${correctCount} out of ${totalQuestions} correct! 🌟`
        : `Good try! You got ${correctCount} out of ${totalQuestions} correct. Let's try again! 💪`,
    });
  } catch (err) {
    console.error("Lesson submit error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
