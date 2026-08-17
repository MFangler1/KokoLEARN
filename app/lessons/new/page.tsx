// ── New Lesson Redirect (client-side) ──
"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2, Home } from "lucide-react";

function RedirectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const lessonId = crypto.randomUUID();
    router.replace(`/lessons/${lessonId}?${params.toString()}`);
  }, [router, searchParams]);

  return (
    <div className="text-center">
      <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary" />
      <p className="mt-4 text-gray-500">Starting your lesson...</p>
    </div>
  );
}

export default function NewLessonPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Home button */}
      <div className="absolute top-4 left-4">
        <Link href="/dashboard" className="inline-flex items-center gap-1.5 rounded-lg bg-white border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-primary hover:border-primary/30 transition-all shadow-sm">
          <Home className="h-4 w-4" /> Home
        </Link>
      </div>
      <Suspense fallback={<Loader2 className="h-10 w-10 animate-spin text-primary" />}>
        <RedirectContent />
      </Suspense>
    </div>
  );
}
