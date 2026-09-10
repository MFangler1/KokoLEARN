// ── Question memory ──
// Remembers which questions a child has already seen (per subject) so the
// generator can avoid repeats, and detects near-duplicates after generation.

import { getDb } from "@/lib/db";
import { seenQuestions } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";

const STOP = new Set(["the","a","an","and","or","of","to","in","is","are","was","were","what","which","how","why","does","do","did","for","on","at","it","this","that","with","from","as","by","be","can","will","you","your"]);

export function normaliseQuestion(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function keywords(normalised: string): Set<string> {
  return new Set(normalised.split(" ").filter((w) => w.length > 2 && !STOP.has(w)));
}

/** Similarity 0..1 based on keyword overlap (Jaccard). */
export function similarity(a: string, b: string): number {
  const A = keywords(a);
  const B = keywords(b);
  if (A.size === 0 || B.size === 0) return 0;
  let inter = 0;
  for (const w of A) if (B.has(w)) inter++;
  return inter / (A.size + B.size - inter);
}

export function isNearDuplicate(normalised: string, seen: string[], threshold = 0.8): boolean {
  return seen.some((s) => similarity(normalised, s) >= threshold);
}

export async function recentSeenQuestions(
  userId: string,
  childId: string,
  subject: string,
  limit = 40
): Promise<{ keys: string[]; samples: string[] }> {
  const db = await getDb();
  if (!db) return { keys: [], samples: [] };
  try {
    const rows = await db
      .select()
      .from(seenQuestions)
      .where(
        and(
          eq(seenQuestions.userId, userId),
          eq(seenQuestions.childId, childId),
          eq(seenQuestions.subject, subject)
        )
      )
      .orderBy(desc(seenQuestions.createdAt))
      .limit(limit);
    return {
      keys: rows.map((r) => r.questionKey),
      samples: rows.map((r) => r.sample ?? "").filter(Boolean),
    };
  } catch (err) {
    console.error("questionMemory: read failed", err);
    return { keys: [], samples: [] };
  }
}

export async function recordSeenQuestions(
  userId: string,
  childId: string,
  subject: string,
  questions: string[]
): Promise<void> {
  const db = await getDb();
  if (!db) return;
  try {
    for (const q of questions) {
      const key = normaliseQuestion(q).slice(0, 160);
      if (!key) continue;
      await db
        .insert(seenQuestions)
        .values({
          userId,
          childId,
          subject,
          questionKey: key,
          sample: q.slice(0, 160),
          createdAt: new Date(),
        })
        .onConflictDoNothing();
    }
  } catch (err) {
    console.error("questionMemory: write failed", err);
  }
}
