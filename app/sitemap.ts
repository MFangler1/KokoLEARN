import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://kokolearn.org";

  const staticPages = [
    { path: "", priority: 1.0, changeFrequency: "weekly" as const },
    { path: "/pricing", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/sign-up", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/sign-in", priority: 0.5, changeFrequency: "monthly" as const },
    { path: "/curriculum", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/for-organisations", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/solopreneur", priority: 0.6, changeFrequency: "monthly" as const },
    { path: "/blog", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/blog/ai-transforming-home-learning", priority: 0.6, changeFrequency: "monthly" as const },
    { path: "/blog/5-tips-homework-stress", priority: 0.6, changeFrequency: "monthly" as const },
    { path: "/blog/interest-led-learning-works", priority: 0.6, changeFrequency: "monthly" as const },
    { path: "/blog/understanding-national-curriculum-at-home", priority: 0.6, changeFrequency: "monthly" as const },
    { path: "/dashboard", priority: 0.4, changeFrequency: "monthly" as const },
    { path: "/dashboard/reports", priority: 0.3, changeFrequency: "monthly" as const },
    { path: "/onboarding", priority: 0.4, changeFrequency: "monthly" as const },
    { path: "/legal/privacy", priority: 0.3, changeFrequency: "yearly" as const },
    { path: "/legal/terms", priority: 0.3, changeFrequency: "yearly" as const },
    { path: "/legal/cookies", priority: 0.3, changeFrequency: "yearly" as const },
    { path: "/legal/faq", priority: 0.4, changeFrequency: "monthly" as const },
    { path: "/legal/child-safety", priority: 0.4, changeFrequency: "monthly" as const },
    { path: "/legal/refund", priority: 0.4, changeFrequency: "monthly" as const },
  ];

  return staticPages.map(({ path, priority, changeFrequency }) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));
}
