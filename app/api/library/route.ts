// ── Picture library manifest (read-only) ──
// Used by the quiz UI tooling and admins to see what art is available/approved.

import { NextResponse } from "next/server";
import { allImages, libraryBasePath } from "@/lib/imageLibrary";
import manifest from "@/public/images/library/manifest.json";

export async function GET(req: Request) {
  try {
    const includePending = new URL(req.url).searchParams.get("includePending") === "1";
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
