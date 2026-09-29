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

const SITE_URL = "https://kokolearn.org";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "KokoLearn — Personalised Learning for UK Children (Ages 5-11)",
  description:
    "Helping children thrive through personalised learning. Curriculum-aligned lessons for KS1, KS2 and SEND learners that adapt to every child's unique learning journey.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "KokoLearn — Personalised Learning for Ages 5-11",
    description:
      "Helping children thrive through personalised learning. Curriculum-aligned lessons for KS1, KS2 and SEND learners.",
    type: "website",
    url: SITE_URL,
    siteName: "KokoLearn",
    locale: "en_GB",
    images: [
      {
        url: "/images/og-kokolearn.jpg",
        width: 1200,
        height: 630,
        alt: "KokoLearn — personalised learning for UK children aged 5 to 11",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KokoLearn — Personalised Learning for Ages 5-11",
    description:
      "Curriculum-aligned lessons for KS1, KS2 and SEND learners.",
    images: ["/images/og-kokolearn.jpg"],
  },
};

// Structured data (schema.org) so search engines describe the site correctly.
const organisationJsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "KokoLearn",
  url: SITE_URL,
  logo: `${SITE_URL}/images/kokolearn-brand-logo.png`,
  email: "support@kokolearn.org",
  areaServed: "GB",
  description:
    "Curriculum-aligned, personalised learning for UK children aged 5-11, covering KS1, KS2 and SEND.",
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "KokoLearn",
  url: SITE_URL,
  inLanguage: "en-GB",
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
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organisationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
