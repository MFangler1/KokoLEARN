// ── Prof. Koko AI Tutor Chat API ──
// Child-friendly Q&A using DeepSeek with a warm, encouraging persona

import { NextResponse } from "next/server";
import { initAuth } from "@/lib/auth/server";

const SYSTEM_PROMPT = `You are Professor Koko, a friendly cartoon owl who teaches children aged 5-11 in the UK. You are warm, encouraging, and make learning fun.

RULES:
- You are a wise, friendly owl who LOVES helping children learn
- Use British English spelling and grammar
- Keep responses short (2-4 sentences) and simple
- Be VERY encouraging - say "Well done!", "Great thinking!", "That's a brilliant question!"
- Use occasional emojis to be friendly (🦉, 🌟, 💡, ✨, 📚)
- NEVER give direct answers to homework - guide the child to discover it themselves
- If you don't know something, say "That's a wonderful question! Let me think... I'd suggest asking your teacher about that one!"
- Age-appropriate language: for ages 5-7 use very simple words, for 8-11 you can use slightly more advanced vocabulary
- Always end with an encouraging question or next step
- Stay in character as Professor Koko the owl at ALL times`;

export async function POST(req: Request) {
  try {
    const auth = await initAuth();
    const session = await auth.api.getSession({
      headers: new Headers(req.headers),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await req.json();
    const { message, childAge, subject, context } = body;

    if (!message || !message.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const age = parseInt(childAge || "7");
    const ageGuidance = age <= 7
      ? "Use very simple words. Short sentences."
      : "Can use slightly more advanced vocabulary.";

    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "AI API key not configured" }, { status: 500 });
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
          { role: "system", content: SYSTEM_PROMPT },
          { role: "system", content: `The child is ${age} years old. ${ageGuidance} Their current subject is: ${subject || "general learning"}.` },
          ...(context ? [{ role: "assistant", content: `The child was just learning about: ${context}` }] : []),
          { role: "user", content: message },
        ],
        temperature: 0.8,
        max_tokens: 500,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("DeepSeek chat error:", aiResponse.status, errorText);
      return NextResponse.json({ error: "AI chat failed" }, { status: 502 });
    }

    const aiData = await aiResponse.json();
    const reply = aiData.choices?.[0]?.message?.content?.trim() || "Hoot! I'm not sure what to say. Can you ask me again? 🦉";

    return NextResponse.json({
      reply,
      character: "Professor Koko",
      emoji: "🦉",
    });
  } catch (err) {
    console.error("Chat API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
