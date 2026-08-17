// ── Supabase Server Client (for API routes) ──

import { createClient } from "@supabase/supabase-js";

let supabaseInstance: ReturnType<typeof createClient> | null = null;

export function getSupabase() {
  if (supabaseInstance) return supabaseInstance;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    console.warn("Supabase not configured — lessons will use localStorage only");
    return null;
  }

  supabaseInstance = createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return supabaseInstance;
}

// ── Lesson Types ──

export interface LessonRecord {
  id: string;
  user_id: string;
  child_name: string;
  subject: string;
  objective_id: string;
  objective: string;
  key_stage: string;
  title: string;
  content: any;
  score: number;
  total_questions: number;
  completed: boolean;
  created_at: string;
}

export interface AnswerRecord {
  id: string;
  lesson_id: string;
  user_id: string;
  question_index: number;
  selected_answer: number;
  correct_answer: number;
  is_correct: boolean;
  created_at: string;
}

export interface ProgressRecord {
  id: string;
  user_id: string;
  child_name: string;
  objective_id: string;
  subject: string;
  completed: boolean;
  best_score: number;
  attempts: number;
  last_lesson_id: string | null;
  created_at: string;
  updated_at: string;
}
