// ── Reusable Text-to-Speech Button ──
// Uses server-side TTS API (ElevenLabs / Gathos) for professional quality audio
// Falls back to browser Web Speech API if server TTS is unavailable

"use client";

import { useState, useRef, useCallback } from "react";
import { Volume2, VolumeX, Loader2 } from "lucide-react";

interface SpeakButtonProps {
  text: string;
  label?: string;
  size?: "sm" | "md";
  className?: string;
}

export default function SpeakButton({ text, label, size = "sm", className = "" }: SpeakButtonProps) {
  const [speaking, setSpeaking] = useState(false);
  const [loading, setLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    window.speechSynthesis.cancel();
    setSpeaking(false);
    setLoading(false);
  }, []);

  const speak = useCallback(async () => {
    if (speaking) {
      stop();
      return;
    }

    setLoading(true);

    try {
      // Try server-side TTS API first
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.substring(0, 2000) }),
      });

      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audioRef.current = audio;

        audio.onended = () => {
          setSpeaking(false);
          URL.revokeObjectURL(url);
        };
        audio.onerror = () => {
          setSpeaking(false);
          URL.revokeObjectURL(url);
        };

        setLoading(false);
        setSpeaking(true);
        await audio.play();
        return;
      }
    } catch {
      // Server TTS failed, fall through to browser TTS
    }

    // Fallback: browser Web Speech API
    setLoading(false);
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    utterance.volume = 1;
    utterance.lang = "en-GB";

    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  }, [text, speaking, stop]);

  const sizeClass = size === "sm" ? "h-8 w-8" : "h-10 w-10";
  const iconSize = size === "sm" ? "h-4 w-4" : "h-5 w-5";

  return (
    <button
      onClick={speak}
      title={speaking ? "Stop" : `Read aloud${label ? `: ${label}` : ""}`}
      disabled={loading}
      className={`inline-flex items-center justify-center rounded-lg transition-all ${
        loading
          ? "bg-gray-100 text-gray-400 cursor-wait"
          : speaking
            ? "bg-primary text-white shadow-sm ring-2 ring-primary/30"
            : "bg-gray-100 text-gray-500 hover:bg-primary-50 hover:text-primary hover:ring-2 hover:ring-primary/20"
      } ${sizeClass} ${className}`}
    >
      {loading ? <Loader2 className={`${iconSize} animate-spin`} /> : speaking ? <VolumeX className={iconSize} /> : <Volume2 className={iconSize} />}
    </button>
  );
}
