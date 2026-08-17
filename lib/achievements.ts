// ── Achievement Definitions & Check Logic ──

export const ACHIEVEMENTS = {
  first_lesson:    { label: "First Steps",       description: "Complete your first lesson",             icon: "🌱" },
  perfect_score:   { label: "Perfect Score",      description: "Get 100% on any lesson",               icon: "🏆" },
  great_score:     { label: "Great Effort",       description: "Score 80% or higher",                  icon: "🌟" },
  streak_3:        { label: "On a Roll",          description: "Complete lessons 3 days in a row",      icon: "🔥" },
  streak_7:        { label: "Weekly Warrior",     description: "Complete lessons 7 days in a row",      icon: "⚡" },
  ten_lessons:     { label: "Dedicated Learner",  description: "Complete 10 lessons total",             icon: "🎯" },
  all_subjects:    { label: "Explorer",           description: "Complete lessons in all 5 subjects",    icon: "🌍" },
  fast_learner:    { label: "Quick Thinker",      description: "Complete a lesson in under 3 minutes", icon: "💨" },
} as const;

export type AchievementType = keyof typeof ACHIEVEMENTS;

export interface NewAchievement {
  type: string;
  label: string;
  description: string;
  icon: string;
}

export function getStarsForScore(score: number): number {
  if (score >= 90) return 3;
  if (score >= 70) return 2;
  if (score >= 40) return 1;
  return 0;
}
