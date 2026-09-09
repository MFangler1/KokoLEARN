// ── Prof. Koko AI Tutor Chat Widget ──
// Floating chat panel accessible from any page

"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";

interface ChatMessage {
  role: "user" | "assistant";
  text: string;
}

interface TutorChatProps {
  childAge?: number;
  subject?: string;
  lessonContext?: string;
}

export default function TutorChat({ childAge = 7, subject = "", lessonContext = "" }: TutorChatProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", text: "Hoot hoot! I'm Professor Koko 🦉 Ask me anything about your lesson!" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open, messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg,
          childAge,
          subject,
          context: lessonContext,
        }),
      });

      if (!res.ok) throw new Error("Chat failed");
      const data = await res.json();
      setMessages(prev => [...prev, { role: "assistant", text: data.reply }]);
    } catch {
      setMessages(prev => [...prev, {
        role: "assistant",
        text: "Hoot! I got a bit tangled up there. Can you try asking again? 🦉",
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating chat button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-primary to-secondary text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all animate-pulse"
          title="Ask Professor Koko"
        >
          <MessageCircle className="h-7 w-7" />
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 flex w-80 sm:w-96 flex-col rounded-2xl border border-gray-200 bg-white shadow-2xl overflow-hidden animate-fade-in-up">
          {/* Header */}
          <div className="flex items-center justify-between bg-gradient-to-r from-primary to-secondary px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <span className="text-xl">🦉</span>
              <div>
                <p className="text-sm font-bold">Professor Koko</p>
                <p className="text-xs text-white/70">AI Tutor</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="rounded-lg p-1 hover:bg-white/20 transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ maxHeight: 350, minHeight: 250 }}>
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-primary text-white rounded-br-md"
                      : "bg-gray-100 text-gray-800 rounded-bl-md"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-2xl rounded-bl-md bg-gray-100 px-4 py-3 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    <span>Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-100 p-3">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask Professor Koko..."
                className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
                disabled={loading}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-primary to-secondary text-white shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </button>
            </div>
            <p className="mt-1.5 text-[10px] text-gray-400 text-center">
              Powered by AI · All answers are child-friendly
            </p>
          </div>
        </div>
      )}


    </>
  );
}
