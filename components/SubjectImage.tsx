// ── Subject Image Component ──
// Shows a randomly selected Pixar-style image for the child's chosen subject
// Images are appropriate to the subject and attempt to avoid repeats

"use client";

import Image from "next/image";

interface SubjectImageProps {
  subject: string;
  size?: number;
  className?: string;
  priority?: boolean;
}

// Subject → available image mappings
const subjectImages: Record<string, string[]> = {
  Maths: ["/images/subjects/subject-maths-001.png", "/images/subjects/subject-maths-002.png"],
  English: ["/images/subjects/subject-english-001.png", "/images/subjects/subject-english-002.png"],
  Science: ["/images/subjects/subject-science-001.png", "/images/subjects/subject-science-002.png"],
  Geography: ["/images/subjects/subject-geography-001.png", "/images/subjects/subject-geography-002.png"],
  History: ["/images/subjects/subject-history-001.png", "/images/subjects/subject-history-002.png"],
  Art: ["/images/subjects/subject-art-001.png"],
  Computing: ["/images/subjects/subject-computing-001.png"],
  AI: ["/images/subjects/subject-ai-001.png"],
};

// Fallback emoji per subject
const subjectEmoji: Record<string, string> = {
  Maths: "🔢",
  English: "📖",
  Science: "🔬",
  Geography: "🌍",
  History: "🏰",
  Art: "🎨",
  Computing: "💻",
  AI: "🤖",
};

export default function SubjectImage({ subject, size = 280, className = "", priority = false }: SubjectImageProps) {
  const normalized = subject.charAt(0).toUpperCase() + subject.slice(1).toLowerCase();
  const images = subjectImages[normalized];

  const imageData = !images?.length
    ? { type: "emoji" as const, emoji: subjectEmoji[normalized] || "📚" }
    : { type: "image" as const, src: images[0], alt: `${normalized} lesson illustration` };

  if (imageData.type === "emoji") {
    return (
      <div
        className={`flex items-center justify-center rounded-2xl bg-primary-50 ${className}`}
        style={{ width: size, height: size }}
      >
        <span className="text-6xl">{imageData.emoji}</span>
      </div>
    );
  }

  return (
    <div className={`${className}`} style={{ width: size, height: size }}>
      <Image
        src={imageData.src}
        alt={imageData.alt}
        width={size}
        height={size}
        className="rounded-2xl object-cover shadow-md"
        style={{ width: size, height: size }}
        priority={priority}
      />
    </div>
  );
}
