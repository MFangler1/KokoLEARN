import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/demo" },
  title: "Demo — KokoLearn.org",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
