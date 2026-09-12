"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, ArrowLeft, Loader2 } from "lucide-react";
import BackButton from "../components/BackButton";
import HomeButton from "../components/HomeButton";
import TurnstileWidget from "@/components/TurnstileWidget";
import { signUp } from "@/lib/auth/client";

export default function SignUp() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!captchaToken) {
      setError("Please complete the quick verification just above the button.");
      return;
    }

    setLoading(true);

    try {
      await signUp.email({
        email: form.email,
        password: form.password,
        name: `${form.firstName} ${form.lastName}`.trim(),
        callbackURL: "/onboarding",
        fetchOptions: {
          headers: { "x-captcha-response": captchaToken },
        },
      });

      // Send welcome email (fire-and-forget)
      fetch("/api/email/welcome", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, name: form.firstName }),
      }).catch(() => {});

      router.push("/onboarding");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong. Try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen justify-center bg-white">
      <div className="flex w-full max-w-6xl flex-row">
      {/* Left panel — Pixar imagery */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-white">
        <div className="relative z-10 mx-auto flex h-full max-w-md flex-col items-center justify-center px-8 text-center">
          <div className="mb-3">
            <Link href="/">
              <Image
                src="/images/kokolearn-logo.png"
                alt="KokoLearn.org"
                width={160}
                height={48}
                className="object-contain"
              />
            </Link>
          </div>
          <Image
            src="/images/presenter-001.webp"
            alt=""
            width={200}
            height={200}
            className="object-contain mb-4 drop-shadow-lg"
          />
          <h2 className="text-3xl font-bold text-gray-900">
            Start Learning Today
          </h2>
          <p className="mt-3 text-sm text-gray-700">
            Your child&apos;s interests become their lessons — personalised,
            engaging, and aligned to the UK National Curriculum.
          </p>
          <div className="mt-6 flex items-center justify-center gap-x-5">
            <div className="flex flex-col items-center text-center">
              <Image
                src="/images/presenter-004.webp"
                alt=""
                width={100}
                height={100}
                className="object-contain"
              />
              <p className="mt-2 text-xs font-semibold text-gray-900">
                Personalised
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Image
                src="/images/presenter-sitting-005.webp"
                alt=""
                width={130}
                height={195}
                className="object-contain"
              />
              <p className="mt-2 text-xs font-semibold text-gray-900">
                Interactive
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Image
                src="/images/presenter-002.webp"
                alt=""
                width={100}
                height={150}
                className="object-contain"
              />
              <p className="mt-2 text-xs font-semibold text-gray-900">Fun</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel — Form */}
      <div className="flex w-full lg:w-1/2 flex-col justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 px-4 py-12 relative">
        <div className="mx-auto w-full max-w-lg">
          <div className="mb-8 flex items-center gap-3 self-start">
            <BackButton className="text-sm font-semibold" />
            <HomeButton className="text-sm font-semibold" />
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm relative">
            {/* Close button */}
            <Link
              href="/"
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#F97316] text-white hover:bg-[#EA580C] shadow-sm transition-all"
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </Link>
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50">
                <Sparkles className="h-7 w-7 text-primary" />
              </div>
              <h1 className="mt-4 text-2xl font-bold text-gray-900">
                Start Your FREE 24 Hour Trial
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                24 HOUR FREE TRIAL - No credit card required.
              </p>
              <p className="mt-1 text-center text-xs font-semibold text-amber-600">Only 2 lesson trials in FREE 24 hour period</p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    First name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    required
                    placeholder="Sarah"
                    className="mt-1 block w-full rounded-lg border border-gray-200 px-4 py-3 text-sm placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Last name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    required
                    placeholder="Jones"
                    className="mt-1 block w-full rounded-lg border border-gray-200 px-4 py-3 text-sm placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                  className="mt-1 block w-full rounded-lg border border-gray-200 px-4 py-3 text-sm placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  minLength={8}
                  placeholder="Create a password (min. 8 characters)"
                  className="mt-1 block w-full rounded-lg border border-gray-200 px-4 py-3 text-sm placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
                />
                  <p className="mt-1 text-xs font-semibold text-amber-600">Please enter details - CASE SENSITIVE</p>
              </div>
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Repeat password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="Re-enter your password"
                  className="mt-1 block w-full rounded-lg border border-gray-200 px-4 py-3 text-sm placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
                />
                  <p className="mt-1 text-xs font-semibold text-amber-600">Please enter details - CASE SENSITIVE</p>
              </div>

              {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <TurnstileWidget onToken={setCaptchaToken} className="flex justify-center" />

              <button
                type="submit"
                disabled={loading}
                className="group w-full rounded-xl bg-gradient-to-r from-primary to-secondary py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating your account…
                  </span>
                ) : (
                  "Start Learning Free →"
                )}
              </button>

              <p className="text-xs text-gray-400 text-center">
                By signing up, you agree to our{" "}
                <Link
                  href="/legal/terms"
                  className="underline hover:text-primary"
                >
                  Terms &amp; Conditions
                </Link>
                .
              </p>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500 border-t border-gray-100 pt-6">
              Already have an account?{' '}
              <Link
                href="/sign-in"
                className="font-semibold text-primary hover:text-primary-600"
              >
                Sign in
              </Link>
            </p>

            <div className="mt-4 rounded-lg bg-amber-50 border border-amber-200 px-4 py-3">
              <p className="text-xs text-amber-700">
                📬 If you receive emails from KokoLearn, please check your spam folder and mark them as [Not spam] to ensure future emails reach your inbox.
              </p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}