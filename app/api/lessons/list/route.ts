// ── Recent Lessons API ──

import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase/server";
import { initAuth } from "@/lib/auth/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { childName } = body;

    const auth = await initAuth();
    const session = await auth.api.getSession({ headers: new Headers(req.headers) });
    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const userId = session.user.id;

    if (!childName) {
      return NextResponse.json({ error: "Missing childName" }, { status: 400 });
    }

    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json({ lessons: [] });
    }

    const { data: lessons, error } = await supabase
      .from("lessons")
      .select("id, title, subject, score, total_questions, completed, created_at, objective, duration_seconds")
      .eq("user_id", userId)
      .eq("child_name", childName)
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) {
      console.error("Failed to fetch lessons:", error);
      return NextResponse.json({ lessons: [] });
    }

    return NextResponse.json({ lessons: lessons || [] });
  } catch (err) {
    console.error("Lessons list error:", err);
    return NextResponse.json({ lessons: [] });
  }
}
