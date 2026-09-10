// ── Text-to-Speech API ──
// ElevenLabs ONLY (Gathos removed 10-09-2026 - subscription cancelled).
// If ElevenLabs fails we say so honestly; there is no silent fallback.

import { NextResponse } from "next/server";

// Professor Koko voice - "Drew" (British male, warm and encouraging)
const ELEVENLABS_VOICE_ID = "pNInz6obpgDQGcFmaJgB";
const ELEVENLABS_MODEL = "eleven_multilingual_v2";
const ELEVENLABS_BASE = "https://api.elevenlabs.io/v1";

/** Spoken-text hygiene: no emoji, no em dashes, tidy whitespace. */
function spokenText(input: string): string {
  return input
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/gu, " ")
    .replace(/\u2014/g, ", ")
    .replace(/\s+/g, " ")
    .trim()
    .substring(0, 2500);
}

export async function GET() {
  // Capability / usage probe for the dashboard + admin. Never returns the key.
  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) {
    return NextResponse.json({ provider: "elevenlabs", configured: false, ok: false });
  }

  const out: Record<string, unknown> = { provider: "elevenlabs", configured: true };

  try {
    const userRes = await fetch(`${ELEVENLABS_BASE}/user`, { headers: { "xi-api-key": key } });
    out.accountOk = userRes.ok;
    out.accountStatus = userRes.status;
    if (userRes.ok) {
      const data = await userRes.json();
      const sub = data?.subscription ?? {};
      out.tier = sub.tier ?? null;
      out.charactersUsed = sub.character_count ?? null;
      out.charactersLimit = sub.character_limit ?? null;
      out.resetUnix = sub.next_character_count_reset_unix ?? null;
    }
  } catch (err) {
    out.accountOk = false;
    out.accountError = String(err).slice(0, 120);
  }

  try {
    const voiceRes = await fetch(`${ELEVENLABS_BASE}/voices/${ELEVENLABS_VOICE_ID}`, {
      headers: { "xi-api-key": key },
    });
    out.voiceOk = voiceRes.ok;
    out.voiceStatus = voiceRes.status;
    out.voiceId = ELEVENLABS_VOICE_ID;
    if (voiceRes.ok) {
      const v = await voiceRes.json();
      out.voiceName = v?.name ?? null;
    }
  } catch (err) {
    out.voiceOk = false;
    out.voiceError = String(err).slice(0, 120);
  }

  return NextResponse.json(out);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const cleanText = spokenText(typeof body?.text === "string" ? body.text : "");

    if (!cleanText) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const key = process.env.ELEVENLABS_API_KEY;
    if (!key) {
      return NextResponse.json(
        { error: "Voice is not configured", detail: "ELEVENLABS_API_KEY is missing", code: "voice_unconfigured" },
        { status: 503 }
      );
    }

    const response = await fetch(`${ELEVENLABS_BASE}/text-to-speech/${ELEVENLABS_VOICE_ID}`, {
      method: "POST",
      headers: {
        "xi-api-key": key,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text: cleanText,
        model_id: ELEVENLABS_MODEL,
        voice_settings: {
          stability: 0.4,
          similarity_boost: 0.85,
          style: 0.45,
          use_speaker_boost: true,
          speed: 0.95,
        },
      }),
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => "");
      console.error("ElevenLabs TTS failed:", response.status, errText.substring(0, 200));
      return NextResponse.json(
        {
          error: "Professor Koko's voice is unavailable right now",
          detail: `ElevenLabs responded ${response.status}`,
          code: response.status === 401 ? "voice_key_rejected" : "voice_provider_error",
          status: response.status,
        },
        { status: 502 }
      );
    }

    const audioBuffer = await response.arrayBuffer();
    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": audioBuffer.byteLength.toString(),
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (err) {
    console.error("TTS API error:", err);
    return NextResponse.json(
      { error: "Voice service error", detail: String(err).slice(0, 120), code: "voice_error" },
      { status: 500 }
    );
  }
}
