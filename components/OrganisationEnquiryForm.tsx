"use client";

import { useState } from "react";
import { Loader2, Send, CheckCircle } from "lucide-react";

const ORG_TYPES = [
  "Primary school",
  "Secondary school",
  "Academy trust / MAT",
  "Local council",
  "SEND / specialist provision",
  "Alternative provision",
  "Mental health / care organisation",
  "Tutoring business",
  "Other",
];

const inputClass =
  "mt-1 w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";

export default function OrganisationEnquiryForm() {
  const [form, setForm] = useState({
    organisation: "",
    orgType: "",
    contactName: "",
    role: "",
    email: "",
    phone: "",
    learners: "",
    message: "",
    website: "", // honeypot — hidden from humans
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);

  const update = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setStatus("sending");
    try {
      const res = await fetch("/api/organisations/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || "We couldn't send that. Please try again.");
      }
      setStatus("sent");
    } catch (err) {
      setStatus("idle");
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  };

  if (status === "sent") {
    return (
      <div className="rounded-3xl border border-emerald-100 bg-emerald-50/60 p-8 text-center">
        <CheckCircle className="mx-auto h-10 w-10 text-emerald-600" />
        <h3 className="mt-3 text-xl font-bold text-gray-900">Enquiry received</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-gray-600">
          Thank you — we&apos;ve sent a confirmation to <strong>{form.email}</strong>. A member of the team will
          reply personally within one working day, usually with a suggested walkthrough call.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-1">
          <label htmlFor="organisation" className="block text-sm font-medium text-gray-700">
            Organisation name *
          </label>
          <input
            id="organisation"
            className={inputClass}
            value={form.organisation}
            onChange={(e) => update("organisation", e.target.value)}
            required
          />
        </div>
        <div className="sm:col-span-1">
          <label htmlFor="orgType" className="block text-sm font-medium text-gray-700">
            Type of setting
          </label>
          <select
            id="orgType"
            className={inputClass}
            value={form.orgType}
            onChange={(e) => update("orgType", e.target.value)}
          >
            <option value="">Please choose…</option>
            {ORG_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-1">
          <label htmlFor="contactName" className="block text-sm font-medium text-gray-700">
            Your name *
          </label>
          <input
            id="contactName"
            className={inputClass}
            value={form.contactName}
            onChange={(e) => update("contactName", e.target.value)}
            required
          />
        </div>
        <div className="sm:col-span-1">
          <label htmlFor="role" className="block text-sm font-medium text-gray-700">
            Your role
          </label>
          <input
            id="role"
            className={inputClass}
            placeholder="e.g. SENCO, Head of Inclusion"
            value={form.role}
            onChange={(e) => update("role", e.target.value)}
          />
        </div>
        <div className="sm:col-span-1">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Work email *
          </label>
          <input
            id="email"
            type="email"
            className={inputClass}
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            required
          />
        </div>
        <div className="sm:col-span-1">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone (optional)
          </label>
          <input
            id="phone"
            className={inputClass}
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="learners" className="block text-sm font-medium text-gray-700">
            Roughly how many learners would use KokoLearn?
          </label>
          <input
            id="learners"
            className={inputClass}
            placeholder="e.g. 25, 120, whole trust"
            value={form.learners}
            onChange={(e) => update("learners", e.target.value)}
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="message" className="block text-sm font-medium text-gray-700">
            What would you like to achieve? *
          </label>
          <textarea
            id="message"
            rows={5}
            className={inputClass}
            placeholder="Tell us about your setting, the pupils you have in mind, and any timescales."
            value={form.message}
            onChange={(e) => update("message", e.target.value)}
            required
          />
        </div>
      </div>

      {/* Honeypot — bots fill this, humans never see it */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          tabIndex={-1}
          autoComplete="off"
          value={form.website}
          onChange={(e) => update("website", e.target.value)}
        />
      </div>

      {error && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-secondary px-6 py-3.5 font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:shadow-xl disabled:opacity-70 sm:w-auto"
      >
        {status === "sending" ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" /> Sending…
          </>
        ) : (
          <>
            Send enquiry <Send className="h-4 w-4" />
          </>
        )}
      </button>

      <p className="mt-4 text-xs text-gray-500">
        We only use these details to reply to your enquiry. No pupil data is collected here — see our{" "}
        <a href="/legal/privacy" className="text-primary hover:underline">
          privacy policy
        </a>
        .
      </p>
    </form>
  );
}
