"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Check, X, Star, Loader2, Mail } from "lucide-react";

type Testimonial = {
  id: string;
  name: string;
  childName: string;
  quote: string;
  rating: number;
  status: string;
  createdAt: string;
};

export default function TestimonialsReview() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const fetchTestimonials = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/testimonials");
      const data = await res.json();
      setTestimonials(data.testimonials || []);
    } catch (err) {
      console.error("Failed to fetch testimonials:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void fetchTestimonials(), 0);
    return () => window.clearTimeout(timer);
  }, [fetchTestimonials]);

  const handleAction = async (id: string, action: "approve" | "reject") => {
    setActionLoading(id);
    try {
      await fetch("/api/testimonials", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action }),
      });
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Action failed:", err);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              📝 Pending Testimonials
            </h1>
            <p className="text-sm text-gray-500">
              Review and approve or reject submissions
            </p>
          </div>
          <Link
            href="/dashboard"
            className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:border-primary/30 hover:text-primary transition-all"
          >
            Dashboard
          </Link>
        </div>

        {/* Admin email hint */}
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm text-amber-800 flex items-start gap-2">
            <Mail className="h-4 w-4 mt-0.5 shrink-0" />
            <span>
              Testimonials will be sent to <strong>Support@KokoLEARN.org</strong> for review once
              Cloudflare Email Routing is set up. For now, approve/reject them here.
            </span>
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : testimonials.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
            <Check className="h-12 w-12 text-green-400 mx-auto mb-3" />
            <h2 className="text-lg font-semibold text-gray-900">All caught up!</h2>
            <p className="text-sm text-gray-500">No pending testimonials to review.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900">{t.name}</span>
                      {t.childName && (
                        <span className="text-xs text-gray-400">
                          · parent of {t.childName}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-0.5 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 ${
                            i < t.rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    <blockquote className="text-sm text-gray-600 italic border-l-3 border-primary-200 pl-3">
                      &ldquo;{t.quote}&rdquo;
                    </blockquote>
                    <p className="mt-2 text-xs text-gray-400">
                      Submitted {new Date(t.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => handleAction(t.id, "approve")}
                      disabled={actionLoading === t.id}
                      className="flex items-center gap-1.5 rounded-xl bg-green-50 border border-green-200 px-3 py-2 text-xs font-semibold text-green-700 hover:bg-green-100 transition-all disabled:opacity-50"
                    >
                      {actionLoading === t.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Check className="h-3.5 w-3.5" />
                      )}
                      Approve
                    </button>
                    <button
                      onClick={() => handleAction(t.id, "reject")}
                      disabled={actionLoading === t.id}
                      className="flex items-center gap-1.5 rounded-xl bg-red-50 border border-red-200 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100 transition-all disabled:opacity-50"
                    >
                      <X className="h-3.5 w-3.5" />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
