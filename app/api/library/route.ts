// ── Picture library manifest (read-only) ──
// Used by the quiz UI tooling and admins to see what art is available/approved.

import { NextResponse } from "next/server";
import { allImages, libraryBasePath } from "@/lib/imageLibrary";

export async function GET() {
  try {
    const images = allImages().map((e) => ({
      key: e.key,
      subject: e.subject,
      keyStages: e.keyStages,
      topics: e.topics,
      path: `${libraryBasePath()}/${e.file}`,
      alt: e.alt,
      credit: e.credit ?? null,
    }));
    return NextResponse.json({ basePath: libraryBasePath(), count: images.length, images });
  } catch (err) {
    console.error("library manifest failed:", err);
    return NextResponse.json({ error: "Library unavailable" }, { status: 500 });
  }
}
