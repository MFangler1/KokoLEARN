// ── Random Owl Presenter ──
// Shows a random presenter owl image on lesson/test pages
// All images rendered at the same size for consistency

"use client";

import Image from "next/image";

interface PresenterOwlProps {
  size?: number;
  className?: string;
}

const presenterImages = [
  { src: "/images/presenter-001.png", alt: "Friendly owl waving" },
  { src: "/images/presenter-002.png", alt: "Friendly owl with book" },
  { src: "/images/presenter-003.png", alt: "Friendly owl smiling" },
  { src: "/images/presenter-004.png", alt: "Friendly owl pointing" },
  { src: "/images/presenter-005.png", alt: "Friendly owl sitting" },
];

export default function PresenterOwl({ size = 120, className = "" }: PresenterOwlProps) {
  const img = presenterImages[0];

  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <Image
        src={img.src}
        alt={img.alt}
        width={size}
        height={size}
        className="object-contain"
        style={{ width: size, height: size }}
        priority
      />
    </div>
  );
}
