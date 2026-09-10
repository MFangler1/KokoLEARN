// ── AI Lesson Generation API ──
// Generates curriculum-aligned, interest-driven lessons using DeepSeek

import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase/server";
import { buildLessonPrompt, parseLessonResponse, type GeneratedLesson } from "@/lib/curriculum/prompts";
import { getNextObjective, getKeyStage, type Subject } from "@/lib/curriculum/data";
import { initAuth } from "@/lib/auth/server";
import { getTrialUsage } from "@/lib/trial";
import { recentSeenQuestions, recordSeenQuestions, normaliseQuestion, isNearDuplicate } from "@/lib/questionMemory";

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
    const body = await req.json();
    const { childName, childAge, interests, subject, questionCount } = body;

    const auth = await initAuth();
    const session = await auth.api.getSession({ headers: new Headers(req.headers) });
    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const userId = session.user.id;

    // Validate inputs
    if (!childName || !childAge || !interests?.length || !subject) {
      return NextResponse.json(
        { error: "Missing required fields: childName, childAge, interests, subject" },
        { status: 400 }
      );
    }

    const age = parseInt(childAge);
    const keyStage = getKeyStage(age);

    // Difficulty: parent override wins, otherwise derive from age (three tiers).
    const difficulty: "normal" | "medium" | "advanced" =
      body.difficulty === "medium" || body.difficulty === "advanced" || body.difficulty === "normal"
        ? body.difficulty
        : age <= 7
          ? "normal"
          : age <= 9
            ? "medium"
            : "advanced";

    // Get the next uncompleted objective for this child
    const supabase = getSupabase() as any;
    if (!supabase) {
      return NextResponse.json(
        { error: "Lesson storage is not configured. Please try again later." },
        { status: 503 }
      );
    }

    // ── Free trial cap (account-wide, checked before any AI spend) ──
    const trialUsage = await getTrialUsage(userId);
    if (trialUsage.limitReached) {
      return NextResponse.json(
        {
          error: `Free trial limit reached — ${trialUsage.lessonsUsed} lessons used. Upgrade to Premium for unlimited lessons.`,
          code: "free_trial_limit_reached",
          lessonsUsed: trialUsage.lessonsUsed,
          lessonLimit: trialUsage.lessonLimit,
        },
        { status: 403 }
      );
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
      completedIds = progress.map((p: any) => p.objective_id);
    }

    const objective = getNextObjective(completedIds, age, subject as Subject);
    if (!objective) {
      return NextResponse.json(
        { error: "All curriculum objectives completed for this subject and age group" },
        { status: 404 }
      );
    }

    // Previously seen questions for this child + subject (avoid repeats).
    const seen = await recentSeenQuestions(userId, childName, subject);

    // Build the AI prompt
    const prompt = buildLessonPrompt({
      childName,
      childAge: age,
      interests,
      subject,
      objective: objective.objective,
      objectiveId: objective.id,
      keyStage,
      questionCount: questionCount || 5,
      difficulty,
      avoidQuestions: seen.samples,
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
            content: "You are an expert UK primary school teacher. You create personalised, curriculum-aligned lessons. Always respond with valid JSON only.",
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
    const expectedQuestions = questionCount === 10 ? 10 : 5;
    const lesson = parsedLesson && validateAndShuffleLesson(parsedLesson, expectedQuestions);
    if (!lesson) {
      return NextResponse.json(
        { error: "The generated lesson was incomplete. Please try again." },
        { status: 502 }
      );
    }

    // ── Duplicate avoidance (one retry with a stricter exclusion list) ──
    let chosenLesson = lesson;
    let chosenNormalised = chosenLesson.questions.map((q) => normaliseQuestion(q.question));
    if (seen.keys.length && chosenNormalised.some((n) => isNearDuplicate(n, seen.keys))) {
      try {
        const retryPrompt = buildLessonPrompt({
          childName,
          childAge: age,
          interests,
          subject,
          objective: objective.objective,
          objectiveId: objective.id,
          keyStage,
          questionCount: questionCount || 5,
          difficulty,
          avoidQuestions: [...seen.samples, ...chosenLesson.questions.map((q) => q.question)],
        });
        const retryRes = await fetch("https://api.deepseek.com/v1/chat/completions", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
          body: JSON.stringify({
            model: "deepseek-chat",
            messages: [
              { role: "system", content: "You are an expert UK primary school teacher. You create personalised, curriculum-aligned lessons. Always respond with valid JSON only." },
              { role: "user", content: retryPrompt },
            ],
            temperature: 0.8,
            max_tokens: 4000,
            response_format: { type: "json_object" },
          }),
        });
        if (retryRes.ok) {
          const retryData = await retryRes.json();
          const retryRaw = retryData.choices?.[0]?.message?.content;
          const retryParsed = retryRaw ? parseLessonResponse(retryRaw) : null;
          const retryLesson = retryParsed && validateAndShuffleLesson(retryParsed, expectedQuestions);
          if (retryLesson) {
            chosenLesson = retryLesson;
            chosenNormalised = retryLesson.questions.map((q) => normaliseQuestion(q.question));
          }
        }
      } catch (err) {
        console.error("Duplicate-avoidance retry failed:", err);
      }
    }

    // Remember what this child has now seen, so future lessons differ.
    await recordSeenQuestions(userId, childName, subject, chosenLesson.questions.map((q) => q.question));

    // Add metadata
    const lessonData: GeneratedLesson & { objectiveId: string; keyStage: string } = {
      ...chosenLesson,
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
