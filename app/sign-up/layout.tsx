import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/sign-up" },
  title: "Start your free 24 hour trial — KokoLearn.org",
  description: "Create a KokoLearn account and start a free 24 hour trial of personalised, curriculum-aligned lessons for UK children aged 5-11.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
