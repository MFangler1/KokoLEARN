"use client";

import { useState } from "react";
import { Mail, CheckCircle, Loader2 } from "lucide-react";

type Props = { variant?: "inline" | "card" };

export default function NewsletterSignup({ variant = "inline" }: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    // In production: POST to /api/newsletter or SendFox webhook
    setTimeout(() => {
      setStatus("success");
      setEmail("");
    }, 1000);
  };

  if (status === "success") {
    return (
      <div className={`rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-center ${variant === "card" ? "shadow-sm" : ""}`}>
        <CheckCircle className="h-6 w-6 text-emerald-500 mx-auto mb-1" />
        <p className="text-sm font-semibold text-emerald-700">You&apos;re in!</p>
        <p className="text-xs text-emerald-600 mt-0.5">Check your inbox for a welcome email.</p>
      </div>
    );
  }

  if (variant === "card") {
    return (
      <div className="rounded-2xl bg-gradient-to-br from-primary-50 to-secondary-50 border border-primary-100/30 p-6">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Mail className="h-5 w-5 text-primary" />
          Join Our Newsletter
        </h3>
        <p className="mt-1 text-sm text-gray-600">Weekly tips, activities, and guidance for your child&apos;s learning journey — straight to your inbox.</p>
        <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            required
            className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-primary to-secondary px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:shadow-lg transition-all disabled:opacity-60"
          >
            {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
            Subscribe
          </button>
        </form>
        <p className="mt-2 text-xs text-gray-400">No spam, ever. Unsubscribe anytime.</p>
      </div>
    );
  }

  // Inline variant (for footer etc.)
  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email address"
        required
        className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-primary to-secondary px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:shadow-lg transition-all disabled:opacity-60 whitespace-nowrap"
      >
        {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
        Subscribe
      </button>
    </form>
  );
}
