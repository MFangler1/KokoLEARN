"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Brain, ArrowLeft, Loader2, Eye, EyeOff, Mail, Home, LayoutDashboard, CheckCircle2, PlusCircle } from "lucide-react";
import { signIn } from "@/lib/auth/client";

// Where the user chose to land after signing in, remembered across sessions
const DESTINATION_KEY = "kokolearn_signin_destination";
type Destination = "home" | "dashboard" | "lesson";

function destinationPath(destination: Destination) {
    if (destination === "lesson") return "/lessons/new";
    return destination === "dashboard" ? "/dashboard?welcome=1" : "/";
}

function readSavedDestination(): Destination | null {
  try {
    const saved = localStorage.getItem(DESTINATION_KEY);
    return saved === "home" || saved === "dashboard" || saved === "lesson" ? saved : null;
  } catch {
    return null;
  }
}

export default function SignIn() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <SignInContent />
    </Suspense>
  );
}

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const explicitRedirect = searchParams.get("redirect");
  const message = searchParams.get("message");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Post-sign-in destination chooser
  const [showChooser, setShowChooser] = useState(false);
  const [rememberChoice, setRememberChoice] = useState(false);

  // Forgot password state
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await signIn.email({ email, password });
      if (result?.error) {
        throw new Error(result.error.message || "Invalid email or password.");
      }

      // An explicit ?redirect= always wins — the user was sent here from a
      // protected page and expects to land back on it.
      if (explicitRedirect) {
        router.push(explicitRedirect);
        return;
      }

      // Otherwise honour a previously saved preference, or ask.
      const saved = readSavedDestination();
      if (saved) {
        router.push(destinationPath(saved));
        return;
      }

      setShowChooser(true);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Invalid email or password.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const goToDestination = (destination: Destination) => {
    if (rememberChoice) {
      try {
        localStorage.setItem(DESTINATION_KEY, destination);
      } catch {
        // Preference is a convenience only — ignore storage failures
      }
    }
    router.push(destinationPath(destination));
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);
    setForgotLoading(true);

    try {
      const res = await fetch("/api/auth/request-password-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: forgotEmail,
          redirectTo: `${window.location.origin}/sign-in`,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || data.message || "Failed to send reset email");
      }

      setForgotSent(true);
    } catch (err: unknown) {
      setForgotError(
        err instanceof Error ? err.message : "Something went wrong. Try again."
      );
    } finally {
      setForgotLoading(false);
    }
  };

  const openForgotPassword = () => {
    setForgotEmail(email || "");
    setForgotSent(false);
    setForgotError(null);
    setShowForgot(true);
  };

  return (
    <div className="flex min-h-screen flex-row bg-gradient-to-br from-white via-gray-50 to-primary-50/40">
      {/* Left panel — Pixar imagery (same style as the free trial page) */}
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
            width={220}
            height={220}
            className="object-contain mb-5 drop-shadow-lg"
          />
          <h2 className="text-3xl font-bold text-gray-900">Welcome Back!</h2>
          <p className="mt-3 text-sm text-gray-700">
            Your child&apos;s personalised learning journey continues here.
          </p>
          <div className="mt-6 flex items-center justify-center gap-x-5">
            <div className="flex flex-col items-center text-center">
              <Image src="/images/presenter-004.webp" alt="" width={90} height={90} className="object-contain" />
              <p className="mt-1 text-xs font-semibold text-gray-900">Personalised</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Image src="/images/presenter-sitting-005.webp" alt="" width={110} height={165} className="object-contain" />
              <p className="mt-1 text-xs font-semibold text-gray-900">Interactive</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Image src="/images/presenter-002.webp" alt="" width={90} height={135} className="object-contain" />
              <p className="mt-1 text-xs font-semibold text-gray-900">Fun</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel — Form */}
      <div className="flex w-full lg:w-1/2 flex-col justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 px-4 py-12 relative">
        <div className="mx-auto w-full max-w-lg">
          <div className="mb-6 flex justify-center">
            <Link href="/">
              <Image
                src="/images/kokolearn-logo.png"
                alt="KokoLearn.org"
                width={140}
                height={42}
                className="object-contain"
              />
            </Link>
          </div>
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-600 hover:shadow-md transition-all self-start"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>

          {showChooser ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50">
                  <CheckCircle2 className="h-7 w-7 text-green-600" />
                </div>
                <h1 className="mt-4 text-2xl font-bold text-gray-900">
                  You&apos;re signed in!
                </h1>
                <p className="mt-2 text-sm text-gray-600">
                  Where would you like to go next?
                </p>
              </div>

              <div className="mt-8 grid gap-3">
                <button type="button" onClick={() => goToDestination("dashboard")} className="group flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 text-left hover:border-primary/30 hover:bg-primary-50 hover:shadow-sm transition-all">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-secondary-50 text-secondary"><LayoutDashboard className="h-5 w-5" /></span>
                  <span className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-900 group-hover:text-primary">Let&apos;s go to users dashboard</span>
                    <span className="text-xs text-gray-500">Progress, reports &amp; lessons</span>
                  </span>
                </button>
                <button type="button" onClick={() => goToDestination("lesson")} className="group flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 text-left hover:border-primary/30 hover:bg-primary-50 hover:shadow-sm transition-all">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary"><PlusCircle className="h-5 w-5" /></span>
                  <span className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-900 group-hover:text-primary">Let&apos;s create a brand new lesson</span>
                    <span className="text-xs text-gray-500">Pick a subject and get started</span>
                  </span>
                </button>
                <button type="button" onClick={() => goToDestination("home")} className="group flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 text-left hover:border-primary/30 hover:bg-primary-50 hover:shadow-sm transition-all">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary"><Home className="h-5 w-5" /></span>
                  <span className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-900 group-hover:text-primary">Let&apos;s go to HOME page</span>
                    <span className="text-xs text-gray-500">Back to the KokoLearn home page</span>
                  </span>
                </button>
              </div>
              <p className="mt-4 text-center text-xs font-medium text-gray-500">Only 2 lesson trials in FREE 24 hour period</p>
              <label className="mt-5 flex items-start gap-2.5 text-xs text-gray-500">
                <input
                  type="checkbox"
                  checked={rememberChoice}
                  onChange={(e) => setRememberChoice(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary/20"
                />
                Always take me there next time - future sign-ins will go straight to whichever option you pick.
              </label>
            </div>
          ) : (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm relative">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50">
                <Brain className="h-7 w-7 text-primary" />
              </div>
              <h1 className="mt-4 text-2xl font-bold text-gray-900">
                Sign in
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Sign in to your KokoLearn account
              </p>
            </div>

            {message && (
              <div className="mt-4 rounded-lg bg-blue-50 border border-blue-200 px-4 py-3 text-sm text-blue-700">
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
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
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError(null);
                  }}
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
                <div className="relative mt-1">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError(null);
                    }}
                    required
                    placeholder="Enter your password"
                    className="block w-full rounded-lg border border-gray-200 px-4 py-3 pr-11 text-sm placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
                  />
                  <p className="mt-1 text-xs font-semibold text-amber-600">Please enter details - CASE SENSITIVE</p>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center h-8 w-8 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={openForgotPassword}
                  className="text-xs font-medium text-primary hover:text-primary-600 transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="group w-full rounded-xl bg-gradient-to-r from-primary to-secondary py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing in…
                  </span>
                ) : (
                  "Sign in →"
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500 border-t border-gray-100 pt-6">
              Don&apos;t have an account?{" "}
              <Link
                href="/sign-up"
                className="font-semibold text-primary hover:text-primary-600"
              >
                Start FREE trial
              </Link>
            </p>
          </div>
          )}
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/75 backdrop-blur-md px-4">
          <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-2xl relative animate-in fade-in zoom-in-95">
            {/* Close button */}
            <button
              onClick={() => setShowForgot(false)}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-all"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>

            {!forgotSent ? (
              <>
                <div className="flex flex-col items-center text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="mt-4 text-xl font-bold text-gray-900">Reset your password</h2>
                  <p className="mt-2 text-sm text-gray-500">
                    Enter your email address and we&apos;ll send you a link to reset your password.
                  </p>
                </div>

                <form onSubmit={handleForgotPassword} className="mt-6 space-y-4">
                  <div>
                    <label htmlFor="forgot-email" className="block text-sm font-medium text-gray-700">
                      Email address
                    </label>
                    <input
                      type="email"
                      id="forgot-email"
                      value={forgotEmail}
                      onChange={(e) => {
                        setForgotEmail(e.target.value);
                        setForgotError(null);
                      }}
                      required
                      placeholder="you@example.com"
                      className="mt-1 block w-full rounded-lg border border-gray-200 px-4 py-3 text-sm placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
                    />
                  </div>

                  {forgotError && (
                    <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                      {forgotError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="w-full rounded-xl bg-gradient-to-r from-primary to-secondary py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {forgotLoading ? (
                      <span className="inline-flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Sending reset link…
                      </span>
                    ) : (
                      "Send reset link"
                    )}
                  </button>
                </form>
              </>
            ) : (
              <div className="flex flex-col items-center text-center py-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <Mail className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="mt-4 text-xl font-bold text-gray-900">Check your email</h2>
                <p className="mt-2 text-sm text-gray-500">
                  We&apos;ve sent a password reset link to <strong className="text-gray-700">{forgotEmail}</strong>.
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  Didn&apos;t receive it? Check your spam folder or{" "}
                  <button onClick={() => { setForgotSent(false); }} className="text-primary underline font-medium">
                    try again
                  </button>.
                </p>
                <div className="mt-3 rounded-lg bg-amber-50 border border-amber-200 px-4 py-2.5">
                  <p className="text-xs text-amber-700">
                    📬 Please check your <strong>spam folder</strong> and mark KokoLearn emails as &ldquo;Not spam&rdquo; to ensure future emails reach your inbox.
                  </p>
                </div>
                <button
                  onClick={() => setShowForgot(false)}
                  className="mt-6 rounded-xl border border-gray-200 px-8 py-2.5 text-sm font-semibold text-gray-700 hover:border-primary/30 hover:text-primary transition-all"
                >
                  Back to sign in
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
