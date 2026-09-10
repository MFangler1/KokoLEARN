// ── Children (account-scoped) ──
// Child profiles belong to the signed-in account, not the browser.
// The browser may keep a local cache, but the source of truth is here.

import { NextResponse } from "next/server";
import { initAuth } from "@/lib/auth/server";
import { getSupabase } from "@/lib/supabase/server";

type ChildRow = {
  id: string;
  name: string;
  age: number | null;
  interests: unknown;
  created_at?: string;
};

async function getSessionUser(req: Request) {
  const auth = await initAuth();
  const session = await auth.api.getSession({
    headers: new Headers(req.headers),
  });
  return session?.user ?? null;
}

export async function GET(req: Request) {
  const user = await getSessionUser(req);
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Typed as any: the Supabase client here has no generated DB types.
  const supabase: any = getSupabase();
  if (!supabase) {
    // Storage unavailable: client falls back to its local cache.
    return NextResponse.json({ children: [], storage: "unavailable" });
  }

  const { data, error } = await supabase
    .from("children")
    .select("id,name,age,interests,created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Failed to load children:", error);
    return NextResponse.json({ error: "Failed to load children" }, { status: 500 });
  }

  return NextResponse.json({ children: (data as ChildRow[]) ?? [] });
}

export async function POST(req: Request) {
  const user = await getSessionUser(req);
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const ageRaw = Number(body?.age);
  const age = Number.isFinite(ageRaw) ? ageRaw : null;
  const interests = Array.isArray(body?.interests) ? body.interests : [];

  if (!name) {
    return NextResponse.json({ error: "Child name is required" }, { status: 400 });
  }

  // Typed as any: the Supabase client here has no generated DB types.
  const supabase: any = getSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "Storage unavailable" }, { status: 503 });
  }

  const { data, error } = await supabase
    .from("children")
    .insert({ user_id: user.id, name, age, interests })
    .select("id,name,age,interests,created_at")
    .single();

  if (error) {
    console.error("Failed to save child:", error);
    return NextResponse.json({ error: "Failed to save child" }, { status: 500 });
  }

  return NextResponse.json({ child: data });
}

export async function DELETE(req: Request) {
  const user = await getSessionUser(req);
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const id = new URL(req.url).searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing child id" }, { status: 400 });
  }

  // Typed as any: the Supabase client here has no generated DB types.
  const supabase: any = getSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "Storage unavailable" }, { status: 503 });
  }

  const { error } = await supabase
    .from("children")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Failed to delete child:", error);
    return NextResponse.json({ error: "Failed to delete child" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
