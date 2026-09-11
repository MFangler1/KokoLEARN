// ── KokoLearn picture library ──
// Static, kid-safe artwork used by image questions. Only entries with
// approved: true are ever served. See public/images/library/README.md.
//
// Each picture also has a set of ready-made questions (10 per picture) so the
// same picture can come back with a DIFFERENT question. Questions live in
// lib/library/questions.json, which is server-side only and never served by
// the public /api/library route.

import manifest from "@/public/images/library/manifest.json";
import questionSets from "@/lib/library/questions.json";

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

export interface LibraryQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: "normal" | "medium" | "advanced";
}

interface Manifest {
  version: number;
  basePath: string;
  updatedAt?: string;
  entries: LibraryImage[];
}

interface QuestionFile {
  version: number;
  perImage: number;
  questions: Record<string, LibraryQuestion[]>;
}

const library = manifest as Manifest;
const questionFile = questionSets as unknown as QuestionFile;

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

/** All ready-made questions for one picture. */
export function questionsForImage(key: string): LibraryQuestion[] {
  const qs = questionFile.questions?.[key];
  return Array.isArray(qs) ? qs : [];
}

const STOP = new Set(["the", "a", "an", "and", "or", "of", "to", "in", "is", "are", "was", "were", "with", "from", "for", "on", "at", "it", "this", "that", "as", "by", "be", "can", "will", "you", "your", "how", "what", "which", "why"]);

function words(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3 && !STOP.has(w));
}

/** How well a picture's topics match the lesson interest + objective words. */
function topicScore(entry: LibraryImage, contextWords: string[]): number {
  const topics = (entry.topics ?? []).map((t) => t.toLowerCase());
  let score = 0;
  for (const topic of topics) {
    const parts = topic.split(/\s+/).filter((p) => p.length > 3);
    for (const w of contextWords) {
      if (topic === w) score += 4;
      else if (parts.includes(w)) score += 3;
      else if (topic.includes(w) || w.includes(topic)) score += 2;
      else if (parts.some((p) => w.includes(p) || p.includes(w))) score += 1;
    }
  }
  return score;
}

function normalise(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim().slice(0, 160);
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

export type PictureQuestion = LibraryQuestion & {
  imageKey: string;
  imagePath: string;
  imageAlt: string;
};

/**
 * Ready-made picture questions that fit this lesson, best match first and
 * never repeating a question this child has already seen.
 */
export function pickPictureQuestions(opts: {
  subject: string;
  interests: string[];
  objective?: string;
  keyStage?: string;
  difficulty?: "normal" | "medium" | "advanced";
  seenKeys?: string[];
  count?: number;
}): PictureQuestion[] {
  const count = opts.count ?? 2;
  const subjectLc = opts.subject.toLowerCase();
  const seen = new Set(opts.seenKeys ?? []);
  const contextWords = words([...(opts.interests ?? []), opts.objective ?? ""].join(" "));

  const candidates: Array<PictureQuestion & { score: number }> = [];
  for (const image of allImages()) {
    if (image.subject.toLowerCase() !== subjectLc) continue;
    if (opts.keyStage && image.keyStages?.length && !image.keyStages.includes(opts.keyStage)) continue;
    const score = topicScore(image, contextWords);
    for (const q of questionsForImage(image.key)) {
      if (!q?.question || !Array.isArray(q.options) || q.options.length !== 4) continue;
      if (seen.has(normalise(q.question))) continue;
      candidates.push({
        ...q,
        imageKey: image.key,
        imagePath: imagePath(image),
        imageAlt: image.alt,
        score,
      });
    }
  }
  if (candidates.length === 0) return [];

  // Stable rotation so different lessons starting from the same score vary,
  // but a child never gets the same picture twice in a row.
  const seedBase = [...`${subjectLc}:${opts.difficulty ?? ""}`].reduce((a, c) => a + c.charCodeAt(0), 0);
  candidates.sort((a, b) => {
    const difficultyA = a.difficulty === opts.difficulty ? 1 : 0;
    const difficultyB = b.difficulty === opts.difficulty ? 1 : 0;
    if (b.score !== a.score) return b.score - a.score;
    if (difficultyB !== difficultyA) return difficultyB - difficultyA;
    const hashA = (seedBase + a.question.length + a.imageKey.length) % 97;
    const hashB = (seedBase + b.question.length + b.imageKey.length) % 97;
    return hashA - hashB;
  });

  const picked: PictureQuestion[] = [];
  const usedImages = new Set<string>();
  for (const candidate of candidates) {
    if (picked.length >= count) break;
    if (usedImages.has(candidate.imageKey)) continue;
    usedImages.add(candidate.imageKey);
    const { score: _score, ...rest } = candidate;
    picked.push(rest);
  }
  // If there were fewer distinct pictures than asked for, top up with any left.
  for (const candidate of candidates) {
    if (picked.length >= count) break;
    if (picked.some((p) => p.question === candidate.question)) continue;
    const { score: _score, ...rest } = candidate;
    picked.push(rest);
  }
  return picked;
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
