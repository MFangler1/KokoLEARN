import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KokoLearn — Personalised Learning for UK Children (Ages 5-14)",
  description:
    "Helping children thrive through personalised learning. Curriculum-aligned lessons for KS1, KS2, KS3 and SEND learners that adapt to every child's unique learning journey.",
  openGraph: {
    title: "KokoLearn — Personalised Learning for Ages 5-14",
    description:
      "Helping children thrive through personalised learning. Curriculum-aligned lessons for KS1, KS2, KS3 and SEND learners.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-GB"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
