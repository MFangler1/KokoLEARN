"use client";

import Link from "next/link";

export default function HomeButton({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`group inline-flex animate-slide-up items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-gray-500 transition-all duration-300 hover:-translate-y-0.5 hover:text-primary hover:shadow-sm ${className}`}
    >
      <svg
        className="h-4 w-4 transition-transform duration-300 group-hover:scale-110"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
      Home
    </Link>
  );
}
