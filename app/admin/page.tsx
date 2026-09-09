import Link from "next/link";

export default function AdminPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-2xl">
          🔐
        </div>
        <h1 className="mt-4 text-2xl font-bold text-gray-900">Admin area</h1>
        <p className="mt-2 text-sm text-gray-600">
          The KokoLearn admin area is being set up. Mark and his selected
          staff will get full access here for demos and management.
        </p>
        <p className="mt-3 text-xs font-medium text-amber-600">
          Coming online shortly - check back soon.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            href="/"
            className="rounded-xl bg-gradient-to-r from-primary to-secondary px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:shadow-md transition-all"
          >
            Back to home
          </Link>
          <Link
            href="/sign-in"
            className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:border-primary/30 hover:text-primary transition-all"
          >
            Staff sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
