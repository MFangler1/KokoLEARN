// ── Picture library manifest (read-only) ──
// Used by the quiz UI tooling and admins to see what art is available/approved.

import { NextResponse } from "next/server";
import { initAuth } from "@/lib/auth/server";
import { allImages, libraryBasePath } from "@/lib/imageLibrary";
import manifest from "@/public/images/library/manifest.json";

// Always read the current manifest - never serve a cached copy.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: Request) {
  try {
    const wantsPending = new URL(req.url).searchParams.get("includePending") === "1";
    // Unapproved artwork metadata is admin-only; the approved manifest is public.
    let includePending = false;
    if (wantsPending) {
      const auth = await initAuth();
      const session = await auth.api.getSession({ headers: new Headers(req.headers) });
      includePending = Boolean(session?.user);
    }
    const source = includePending
      ? (manifest as { entries: Array<{ approved: boolean; key: string; subject: string; keyStages: string[]; topics: string[]; file: string; alt: string; credit?: string }> }).entries
      : allImages();
    const images = source.map((e) => ({
      key: e.key,
      subject: e.subject,
      keyStages: e.keyStages,
      topics: e.topics,
      path: `${libraryBasePath()}/${e.file}`,
      alt: e.alt,
      credit: e.credit ?? null,
      approved: e.approved,
    }));
    return NextResponse.json({ basePath: libraryBasePath(), count: images.length, includePending, images });
  } catch (err) {
    console.error("library manifest failed:", err);
    return NextResponse.json({ error: "Library unavailable" }, { status: 500 });
  }
}
