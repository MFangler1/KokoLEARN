// ── Text-to-Speech API ──
// High-quality TTS using ElevenLabs (primary) with Gathos fallback

import { NextResponse } from "next/server";

// Professor Koko voice - "Drew" (British male, warm and authoritative)
// Optimised settings for a wise, older, professor-like delivery
const ELEVENLABS_VOICE_ID = "pNInz6obpgDQGcFmaJgB";
const ELEVENLABS_MODEL = "eleven_monolingual_v1";
const GATHOS_BASE = "https://gathos.com/api/v1";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { text } = body;

    if (!text || !text.trim()) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const cleanText = text.trim().substring(0, 2000);

    // ── ElevenLabs (primary) ──
    const elevenKey = process.env.ELEVENLABS_API_KEY;
    if (elevenKey) {
      try {
        const response = await fetch(
          `https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`,
          {
            method: "POST",
            headers: {
              "Accept": "audio/mpeg",
              "Content-Type": "application/json",
              "xi-api-key": elevenKey,
            },
            body: JSON.stringify({
              text: cleanText,
              model_id: ELEVENLABS_MODEL,
              voice_settings: {
                stability: 0.45,
                similarity_boost: 0.8,
                style: 0.3,
                speed: 0.85,
              },
            }),
          }
        );

        if (response.ok) {
          const audioBuffer = await response.arrayBuffer();
          return new NextResponse(audioBuffer, {
            status: 200,
            headers: {
              "Content-Type": "audio/mpeg",
              "Content-Length": audioBuffer.byteLength.toString(),
              "Cache-Control": "public, max-age=86400",
            },
          });
        }

        // 401 = key issue, 404 = voice/model not on this account
        if (response.status !== 401 && response.status !== 404) {
          const errText = await response.text().catch(() => "");
          console.warn("ElevenLabs TTS error:", response.status, errText.substring(0, 200));
        }
      } catch (err) {
        console.warn("ElevenLabs error:", err);
      }
    }

    // ── Gathos fallback ──
    const gathosKey = process.env.GATHOS_TTS_KEY;
    if (gathosKey) {
      try {
        const submitRes = await fetch(`${GATHOS_BASE}/tts`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${gathosKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: cleanText, voice: "josh" }),
        });

        if (submitRes.ok) {
          const { job_id } = await submitRes.json();
          const pollStart = Date.now();
          while (Date.now() - pollStart < 30000) {
            await new Promise(r => setTimeout(r, 2000));
            const pollRes = await fetch(`${GATHOS_BASE}/tts/jobs/${job_id}`, {
              headers: { "Authorization": `Bearer ${gathosKey}` },
            });
            if (pollRes.ok) {
              const pollData = await pollRes.json();
              if (pollData.status === "completed") {
                const audioB64 = pollData.result?.audio_base64
                  || pollData.result?.audio_wav
                  || pollData.result?.audio;
                if (audioB64) {
                  const audioBuffer = Buffer.from(audioB64, "base64");
                  return new NextResponse(audioBuffer, {
                    status: 200,
                    headers: { "Content-Type": "audio/wav", "Cache-Control": "public, max-age=86400" },
                  });
                }
              }
              if (pollData.status === "failed") break;
            }
          }
        }
      } catch (err) {
        console.warn("Gathos TTS error:", err);
      }
    }

    return NextResponse.json({
      error: "TTS unavailable",
      detail: !elevenKey && !gathosKey ? "No TTS keys configured" : "All TTS providers failed",
    }, { status: 501 });
  } catch (err) {
    console.error("TTS API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
