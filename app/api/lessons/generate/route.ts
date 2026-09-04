// ── AI Lesson Generation API ──
// Generates curriculum-aligned, interest-driven lessons using DeepSeek

import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase/server";
import { buildLessonPrompt, parseLessonResponse, type GeneratedLesson } from "@/lib/curriculum/prompts";
import { getNextObjective, getKeyStage, type Subject } from "@/lib/curriculum/data";
import { initAuth } from "@/lib/auth/server";
import { getDb } from "@/lib/db";
import { children, subscriptions } from "@/lib/db/schema";
import { users } from "@/lib/db/auth.schema";
import { and, eq } from "drizzle-orm";
import { hasTrustedOrigin } from "@/lib/security/origin";
import { parseChildAge, parseChildName, parseInterests, parseSubject } from "@/lib/validation/child";

function validateAndShuffleLesson(lesson: GeneratedLesson, expectedQuestions: number): GeneratedLesson | null {
  if (!lesson.title || !lesson.subject || !lesson.objective || !lesson.explanation) return null;
  if (!Array.isArray(lesson.questions) || lesson.questions.length !== expectedQuestions) return null;

  const questions = lesson.questions.map((question) => {
    if (!question.question || !question.explanation || !Array.isArray(question.options) || question.options.length !== 4) {
      return null;
    }
    if (!Number.isInteger(question.correctIndex) || question.correctIndex < 0 || question.correctIndex > 3) {
      return null;
    }

    const options = question.options.map((option, index) => ({
      text: String(option).replace(/^[A-D][).:]\s*/i, "").trim(),
      correct: index === question.correctIndex,
    }));
    for (let index = options.length - 1; index > 0; index--) {
      const swapIndex = crypto.getRandomValues(new Uint32Array(1))[0] % (index + 1);
      [options[index], options[swapIndex]] = [options[swapIndex], options[index]];
    }
    const correctIndex = options.findIndex((option) => option.correct);
    return {
      ...question,
      options: options.map((option, index) => `${String.fromCharCode(65 + index)}) ${option.text}`),
      correctIndex,
    };
  });

  if (questions.some((question) => question === null)) return null;
  return { ...lesson, questions: questions as GeneratedLesson["questions"] };
}

export async function POST(req: Request) {
  try {
    if (!hasTrustedOrigin(req)) {
      return NextResponse.json({ error: "Invalid request origin" }, { status: 403 });
    }
    const body = await req.json();
    const subject = parseSubject(body.subject);
    const childId = typeof body.childId === "string" ? body.childId : "";

    const auth = await initAuth();
    const session = await auth.api.getSession({ headers: new Headers(req.headers) });
    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const userId = session.user.id;

    if (!childId || !subject) {
      return NextResponse.json(
        { error: "Invalid child profile or subject" },
        { status: 400 }
      );
    }

    const db = await getDb();
    if (!db) {
      return NextResponse.json({ error: "Subscription service is unavailable" }, { status: 503 });
    }
    const child = await db.select().from(children)
      .where(and(eq(children.id, childId), eq(children.userId, userId))).get();
    if (!child) return NextResponse.json({ error: "Child profile not found" }, { status: 404 });
    const childName = parseChildName(child.name);
    const age = parseChildAge(child.age);
    let interests: string[] | null = null;
    try { interests = parseInterests(JSON.parse(child.interests)); } catch {}
    if (!childName || age === null || !interests) {
      return NextResponse.json({ error: "Stored child profile is invalid" }, { status: 500 });
    }
    const keyStage = getKeyStage(age);
    const subscription = await db.select().from(subscriptions)
      .where(eq(subscriptions.userId, userId)).get();
    const hasPaidAccess = Boolean(subscription && subscription.plan !== "free_trial" && ["active", "trialing"].includes(subscription.status));
    const hasExtendedQuestions = Boolean(subscription?.extendedQuestions === 1 && ["active", "trialing", "granted"].includes(subscription.addonStatus));
    const questionCount = hasExtendedQuestions ? 10 : 5;

    // Get the next uncompleted objective for this child
    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json(
        { error: "Lesson storage is not configured. Please try again later." },
        { status: 503 }
      );
    }

    if (!hasPaidAccess) {
      const user = await db.select({ createdAt: users.createdAt }).from(users).where(eq(users.id, userId)).get();
      const trialEndsAt = user ? user.createdAt.getTime() + 24 * 60 * 60 * 1000 : 0;
      if (!user || Date.now() >= trialEndsAt) {
        return NextResponse.json({ error: "Your free trial has ended. Choose a plan to continue." }, { status: 402 });
      }
      const lessonCount = await supabase.from("lessons")
        .select("id", { count: "exact", head: true }).eq("user_id", userId);
      if (lessonCount.error) throw lessonCount.error;
      if ((lessonCount.count ?? 0) >= 3) {
        return NextResponse.json({ error: "Your three free lessons have been used. Choose a plan to continue." }, { status: 402 });
      }
    }

    let completedIds: string[] = [];

    const { data: progress, error: progressError } = await supabase
      .from("curriculum_progress")
      .select("objective_id")
      .eq("user_id", userId)
      .eq("child_name", childName)
      .eq("completed", true);

    if (progressError) {
      console.error("Failed to fetch curriculum progress:", progressError);
    }

    if (progress) {
      completedIds = progress.map((p: { objective_id: string }) => p.objective_id);
    }

    const objective = getNextObjective(completedIds, age, subject as Subject);
    if (!objective) {
      return NextResponse.json(
        { error: "All curriculum objectives completed for this subject and age group" },
        { status: 404 }
      );
    }

    // Build the AI prompt
    const prompt = buildLessonPrompt({
      childName,
      childAge: age,
      interests,
      subject,
      objective: objective.objective,
      objectiveId: objective.id,
      keyStage,
      questionCount,
    });

    // Call DeepSeek API
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "AI API key not configured" },
        { status: 500 }
      );
    }

    const aiResponse = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: "You are an expert UK teacher for ages 5-14. Create safe, personalised, curriculum-aligned lessons and respond with valid JSON only.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 4000,
        response_format: { type: "json_object" },
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("DeepSeek API error:", aiResponse.status, errorText);
      return NextResponse.json(
        { error: "AI generation failed", details: errorText.substring(0, 200) },
        { status: 502 }
      );
    }

    const aiData = await aiResponse.json();
    const lessonRaw = aiData.choices?.[0]?.message?.content;

    if (!lessonRaw) {
      return NextResponse.json(
        { error: "Empty response from AI" },
        { status: 502 }
      );
    }

    // Parse the generated lesson
    const parsedLesson = parseLessonResponse(lessonRaw);
    const expectedQuestions = questionCount;
    const lesson = parsedLesson && validateAndShuffleLesson(parsedLesson, expectedQuestions);
    if (!lesson) {
      return NextResponse.json(
        { error: "The generated lesson was incomplete. Please try again." },
        { status: 502 }
      );
    }

    // Add metadata
    const lessonData: GeneratedLesson & { objectiveId: string; keyStage: string } = {
      ...lesson,
      objectiveId: objective.id,
      keyStage,
    };

    // Store the lesson before returning it. The client needs a real ID for submission.
    const { data: stored, error: storeError } = await supabase
      .from("lessons")
      .insert({
        user_id: userId,
        child_name: childName,
        subject,
        objective_id: objective.id,
        objective: objective.objective,
        key_stage: keyStage,
        title: lesson.title,
        content: lessonData,
        score: 0,
        total_questions: lesson.questions.length,
        completed: false,
      })
      .select("id")
      .single();

    if (storeError || !stored?.id) {
      console.error("Failed to store lesson:", storeError);
      return NextResponse.json(
        { error: "Lesson could not be saved. Please try again." },
        { status: 500 }
      );
    }

    const lessonId = stored.id;

    // Track this as an attempt in progress
    const { error: upsertError } = await supabase
      .from("curriculum_progress")
      .upsert(
        {
          user_id: userId,
          child_name: childName,
          objective_id: objective.id,
          subject,
          completed: false,
          attempts: completedIds.length + 1,
        },
        { onConflict: "user_id,child_name,objective_id" }
      );

    if (upsertError) {
      console.error("Failed to track lesson progress:", upsertError);
    }

    return NextResponse.json({
      lessonId,
      lesson: {
        ...lessonData,
        id: lessonId,
      },
      objective: {
        id: objective.id,
        text: objective.objective,
        topic: objective.topic,
        keyStage,
      },
    });
  } catch (err) {
    console.error("Lesson generation error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
