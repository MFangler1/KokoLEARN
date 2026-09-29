import type { Metadata } from "next";

// Not for search engines - this is an application screen, not a public page.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
