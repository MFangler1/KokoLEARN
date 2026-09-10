// ── KokoLearn picture library ──
// Static, kid-safe artwork used by image questions. Only entries with
// approved: true are ever served. See public/images/library/README.md.

import manifest from "@/public/images/library/manifest.json";

export interface LibraryImage {
  key: string;
  subject: string;
  keyStages: string[];
  topics: string[];
  file: string;
  alt: string;
  approved: boolean;
  credit?: string;
}

interface Manifest {
  version: number;
  basePath: string;
  updatedAt?: string;
  entries: LibraryImage[];
}

const library = manifest as Manifest;

export function libraryBasePath(): string {
  return library.basePath;
}

export function allImages(): LibraryImage[] {
  return library.entries.filter((e) => e.approved);
}

/** Path the UI can render directly. */
export function imagePath(entry: LibraryImage): string {
  return `${library.basePath}/${entry.file}`;
}

/**
 * Pick an approved image for a lesson. Matches on subject (exact, case-insensitive)
 * and at least one interest/topic overlap. Returns null when the library has
 * nothing suitable - questions simply render without a picture.
 */
export function pickImageForLesson(
  subject: string,
  interests: string[],
  keyStage?: string
): LibraryImage | null {
  const subjectLc = subject.toLowerCase();
  const interestLc = interests.map((i) => i.toLowerCase());
  const candidates = allImages().filter((e) => {
    if (e.subject.toLowerCase() !== subjectLc) return false;
    if (keyStage && e.keyStages?.length && !e.keyStages.includes(keyStage)) return false;
    if (!e.topics?.length) return true;
    return e.topics.some((t) => interestLc.includes(t.toLowerCase()));
  });
  if (candidates.length === 0) return null;
  // Deterministic rotation: pick the least-used looking key by hashing lesson keyStage+subject.
  const seed = `${subjectLc}:${keyStage ?? ""}`.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return candidates[seed % candidates.length];
}

/** Attach pictures to up to `max` questions (mutates nothing; returns a copy). */
export function attachImagesToQuestions<T extends { question: string; imageKey?: string; imagePath?: string; imageAlt?: string }>(
  questions: T[],
  subject: string,
  interests: string[],
  keyStage?: string,
  max = 2
): T[] {
  const image = pickImageForLesson(subject, interests, keyStage);
  if (!image) return questions;
  const path = imagePath(image);
  return questions.map((q, i) => {
    if (i >= max) return q;
    return { ...q, imageKey: image.key, imagePath: path, imageAlt: image.alt };
  });
}
