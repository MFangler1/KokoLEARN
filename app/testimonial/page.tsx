"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Star, ArrowLeft, Loader2, Send, Check, Sparkles } from "lucide-react";

export default function TestimonialPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    childName: "",
    quote: "",
    rating: 5,
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");

      setSubmitted(true);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <div className="flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <Check className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <h1 className="mt-4 text-2xl font-bold text-gray-900">
              Thank You! 🎉
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Your testimonial has been received and will be reviewed by our team.
              We truly appreciate you taking the time to share your experience.
            </p>
            <div className="mt-6 flex justify-center gap-1">
              {[...Array(form.rating)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <blockquote className="mt-4 italic text-gray-600 text-sm border-l-4 border-primary-200 pl-4 text-left">
              &ldquo;{form.quote}&rdquo;
            </blockquote>
            <p className="mt-2 text-sm font-semibold text-gray-900">
              — {form.name}
              {form.childName && <> · parent of {form.childName}</>}
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Link href="/dashboard" className="rounded-xl bg-gradient-to-r from-primary to-secondary px-6 py-2.5 text-sm font-semibold text-white shadow-lg">
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-lg px-4 pt-16 pb-6 sm:px-6">
        <Link href="/dashboard" className="mb-6 inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-600 transition-all">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50">
              <Sparkles className="h-7 w-7 text-primary" />
            </div>
            <h1 className="mt-4 text-2xl font-bold text-gray-900">
              Share Your Story
            </h1>
            <p className="mt-2 text-sm text-gray-500 max-w-sm">
              We&apos;d love to hear how KokoLearn is helping your child.
              Your testimonial could inspire other families.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Your name <span className="text-red-400">*</span>
              </label>
              <input
                type="text" id="name" required
                value={form.name}
                onChange={(e) => { setForm((p) => ({ ...p, name: e.target.value })); setError(null); }}
                placeholder="e.g. Sarah Jones"
                className="mt-1 block w-full rounded-lg border border-gray-200 px-4 py-3 text-sm placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
              />
            </div>
            <div>
              <label htmlFor="childName" className="block text-sm font-medium text-gray-700">
                Your child&apos;s name <span className="text-gray-400">(optional)</span>
              </label>
              <input
                type="text" id="childName"
                value={form.childName}
                onChange={(e) => setForm((p) => ({ ...p, childName: e.target.value }))}
                placeholder="e.g. Alex"
                className="mt-1 block w-full rounded-lg border border-gray-200 px-4 py-3 text-sm placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
              />
            </div>
            <div>
              <label htmlFor="quote" className="block text-sm font-medium text-gray-700">
                Your testimonial <span className="text-red-400">*</span>
              </label>
              <textarea
                id="quote" required rows={4}
                value={form.quote}
                onChange={(e) => {
                  setForm((p) => ({ ...p, quote: e.target.value }));
                  setError(null);
                }}
                placeholder="What difference has KokoLearn made for your child? Feel free to mention their favourite subjects, how their confidence has grown, or anything you'd like to share..."
                className="mt-1 block w-full rounded-lg border border-gray-200 px-4 py-3 text-sm placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors resize-y"
              />
              <p className="mt-1 text-xs text-gray-400">
                {form.quote.length} characters (we recommend 50–300)
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating <span className="text-red-400">*</span>
              </label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, rating: star }))}
                    className="p-1 transition-all hover:scale-110"
                    aria-label={`${star} star`}
                  >
                    <Star
                      className={`h-8 w-8 ${
                        star <= form.rating
                          ? "fill-amber-400 text-amber-400"
                          : "text-gray-200"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group w-full rounded-xl bg-gradient-to-r from-primary to-secondary py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting…
                </span>
              ) : (
                <span className="inline-flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  Submit Testimonial
                </span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
