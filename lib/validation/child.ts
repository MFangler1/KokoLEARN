import { SUBJECTS, type Subject } from "@/lib/curriculum/data";

export const MIN_CHILD_AGE = 5;
export const MAX_CHILD_AGE = 14;
const ALLOWED_INTERESTS = new Set([
  "Dinosaurs", "Space", "Football", "Art & Drawing", "Animals", "Reading",
  "Maths", "Music", "History", "Geography", "Robots", "Nature", "Science",
  "Travel", "Gaming", "Swimming",
]);

export function parseChildAge(value: unknown): number | null {
  const age = typeof value === "number" ? value : Number(value);
  return Number.isInteger(age) && age >= MIN_CHILD_AGE && age <= MAX_CHILD_AGE
    ? age
    : null;
}

export function parseChildName(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const name = value.trim().replace(/\s+/g, " ");
  return name.length >= 1 && name.length <= 50 ? name : null;
}

export function parseInterests(value: unknown): string[] | null {
  if (!Array.isArray(value) || value.length < 1 || value.length > 5) return null;
  const interests = value.map((item) =>
    typeof item === "string" ? item.trim().replace(/\s+/g, " ") : ""
  );
  if (interests.some((item) => !ALLOWED_INTERESTS.has(item))) return null;
  return [...new Set(interests)];
}

export function parseSubject(value: unknown): Subject | null {
  return typeof value === "string" && SUBJECTS.includes(value as Subject)
    ? (value as Subject)
    : null;
}
