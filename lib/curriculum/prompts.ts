// ── AI Prompt Templates for Lesson Generation ──

export interface LessonGenerationInput {
  childName: string;
  childAge: number;
  interests: string[];
  subject: string;
  objective: string;
  objectiveId: string;
  keyStage: string;
  questionCount?: number;
  difficulty?: "normal" | "medium" | "advanced";
  avoidQuestions?: string[];
}

export interface LessonQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface GeneratedLesson {
  title: string;
  subject: string;
  objectiveId: string;
  objective: string;
  keyStage: string;
  explanation: string;
  keyPoints: string[];
  questions: LessonQuestion[];
  funFact: string;
  nextSteps: string;
}

function getAgeGuidelines(age: number): string {
  if (age <= 6) {
    return `- Use VERY simple words and short sentences (max 8 words per sentence)
- Concrete examples only — no abstract concepts
- Relate everything to things the child can see, touch, or imagine
- Questions should be simple and visual
- Keep explanations to 2-3 very short paragraphs`;
  }
  if (age <= 9) {
    return `- Use clear, straightforward language
- Introduce concepts with familiar examples first
- Can handle some abstract thinking but with concrete grounding
- Questions should test understanding, not just recall
- 3-4 short paragraphs for explanations`;
  }
  return `- Use age-appropriate vocabulary that challenges slightly
- Can handle abstract reasoning and multi-step problems
- Connect concepts to real-world applications
- Questions should require deeper thinking
- 3-4 paragraphs with appropriate complexity`;
}

export function buildLessonPrompt(input: LessonGenerationInput): string {
  return `You are an expert UK primary school teacher creating a personalised lesson.

STUDENT PROFILE:
- Name: ${input.childName}
- Age: ${input.childAge} (${input.keyStage})
- Interests: ${input.interests.join(", ")}

CURRICULUM OBJECTIVE:
${input.objective} (ID: ${input.objectiveId})

DIFFICULTY LEVEL: ${(input.difficulty ?? "normal").toUpperCase()}
${input.difficulty === "advanced" ? "- Stretch the child: multi-step reasoning, less scaffolding, richer vocabulary." : input.difficulty === "medium" ? "- Steady challenge: mix recall with reasoning; some multi-step questions." : "- Gentle start: clear, concrete, confidence-building questions."}
${input.avoidQuestions && input.avoidQuestions.length ? `
DO NOT REPEAT THESE PREVIOUSLY SEEN QUESTIONS (or close variants):
${input.avoidQuestions.slice(0, 25).map((q) => `- ${q}`).join("\n")}
` : ""}

AGE-APPROPRIATE LANGUAGE GUIDELINES:
${getAgeGuidelines(input.childAge)}

FORMAT REQUIREMENTS:
Generate a COMPLETE lesson in valid JSON format with NO additional text outside the JSON:

{
  "title": "An engaging title that weaves the child's interests with the subject (e.g. 'Dinosaur Addition')",
  "subject": "${input.subject}",
  "objectiveId": "${input.objectiveId}",
  "objective": "${input.objective}",
  "keyStage": "${input.keyStage}",
  "explanation": "Child-friendly explanation (2-4 paragraphs) that teaches the curriculum objective using examples from the child's interests",
  "keyPoints": ["3-4 bullet-point key takeaways written at the child's level"],
  "questions": [
    {
      "question": "A question that tests the curriculum objective, framed using the child's interests",
      "options": ["A) First option", "B) Second option", "C) Third option", "D) Fourth option"],
      "correctIndex": 0,
      "explanation": "Friendly, encouraging explanation of why this is correct and what it teaches"
    }
  ],
  "funFact": "One fun fact about the subject that connects to the child's interests",
  "nextSteps": "A brief, encouraging suggestion for what to learn next"
}

CRITICAL RULES:
1. EVERY question MUST directly test the curriculum objective "${input.objective}"
2. ALL examples MUST use the child's interests (${input.interests.join(", ")})
3. Language complexity MUST match age ${input.childAge}
4. Questions should be clear and unambiguous
5. Include exactly ${input.questionCount || 5} questions
6. Each option letter (A, B, C, D) must be followed by ')'
7. Return ONLY valid JSON — no markdown, no explanation outside the JSON
8. Make the lesson fun, engaging, and encouraging

Curriculum objective to test: "${input.objective}"`;
}

export function parseLessonResponse(text: string): GeneratedLesson | null {
  try {
    // Try direct parse first
    return JSON.parse(text);
  } catch {
    // Try extracting JSON from markdown code blocks
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[1]);
      } catch {}
    }
    // Try extracting anything that looks like a JSON object
    const objectMatch = text.match(/\{[\s\S]*"title"[\s\S]*"questions"[\s\S]*\}/);
    if (objectMatch) {
      try {
        return JSON.parse(objectMatch[0]);
      } catch {}
    }
    return null;
  }
}
