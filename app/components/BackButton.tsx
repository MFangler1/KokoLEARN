"use client";

export default function BackButton({ className = "" }: { className?: string }) {
  return (
    <button
      onClick={() => window.history.back()}
      className={`group inline-flex animate-fade-in items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm transition-all duration-300 hover:-translate-x-0.5 hover:shadow-sm ${className}`}
    >
      <svg
        className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
      Back
    </button>
  );
}
