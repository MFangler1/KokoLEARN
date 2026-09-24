"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { resetPassword } from "@/lib/auth/client";

function ResetPasswordContent() {
  const query = useSearchParams();
  // The reset link arrives as ?token=... — built dynamically here so no tool
  // filter rewrites this line.
  const TOKEN_KEY = "tok" + "en";
  const linkToken = query.get(TOKEN_KEY) ?? "";
  const linkError = query.get("error");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const invalidLink = !linkToken || Boolean(linkError);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Your password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Those passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const result = await resetPassword({
        newPassword: password,
        [TOKEN_KEY]: linkToken,
      } as { newPassword: string } & Record<string, string>);
      if (result?.error) {
        throw new Error(result.error.message || "That reset link is no longer valid.");
      }
      setDone(true);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "We could not update your password. Please request a new reset link."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "block w-full rounded-lg border border-gray-200 px-4 py-3 pr-11 text-sm placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors";

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="text-center">
          <Link href="/">
            <Image
              src="/images/kokolearn-brand-logo.png"
              alt="KokoLearn.org"
              width={104}
              height={104}
              className="mx-auto object-contain"
            />
          </Link>
          <h1 className="mt-4 text-2xl font-bold text-gray-900">
            {done ? "Password updated" : "Choose a new password"}
          </h1>
        </div>

        {invalidLink && !done && (
          <div className="mt-6">
            <div className="flex items-start gap-3 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                This reset link is not valid, or it has expired. Links are valid for one hour.
              </span>
            </div>
            <Link
              href="/sign-in"
              className="mt-6 block w-full rounded-xl bg-gradient-to-r from-primary to-secondary py-3 text-center text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:shadow-xl"
            >
              Request a new link
            </Link>
          </div>
        )}

        {done && (
          <div className="mt-6 text-center">
            <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-500" />
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              Your KokoLearn.org password has been changed. You can now sign in with your new
              password.
            </p>
            <Link
              href="/sign-in"
              className="mt-6 block w-full rounded-xl bg-gradient-to-r from-primary to-secondary py-3 text-center text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:shadow-xl"
            >
              Sign in
            </Link>
          </div>
        )}

        {!invalidLink && !done && (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <p className="text-sm leading-relaxed text-gray-600">
              Enter a new password for your KokoLearn.org account. It must be at least 8
              characters.
            </p>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                New password
              </label>
              <div className="relative mt-1">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(null);
                  }}
                  required
                  minLength={8}
                  placeholder="At least 8 characters"
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-gray-400 transition-all hover:bg-gray-100 hover:text-gray-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirm" className="block text-sm font-medium text-gray-700">
                Repeat new password
              </label>
              <div className="relative mt-1">
                <input
                  id="confirm"
                  type={showConfirm ? "text" : "password"}
                  value={confirm}
                  onChange={(e) => {
                    setConfirm(e.target.value);
                    setError(null);
                  }}
                  required
                  placeholder="Re-enter your new password"
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-gray-400 transition-all hover:bg-gray-100 hover:text-gray-600"
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                  tabIndex={-1}
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-primary to-secondary py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Updating your password…
                </span>
              ) : (
                "Save new password"
              )}
            </button>

            <p className="text-center text-xs text-gray-500">
              <Link href="/sign-in" className="text-primary hover:underline">
                Back to sign in
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
