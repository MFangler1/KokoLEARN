// ── Professional child report (PDF) ──
// A4 portrait, clean professional layout: Arial-class typography, teal headings,
// no emoji, no em dashes. Mirrors the .docx export payload so both can be
// generated from the same data.

import { NextRequest, NextResponse } from "next/server";
import { initAuth } from "@/lib/auth/server";
import { canGenerateReport } from "@/lib/entitlements";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

const TEAL = rgb(0, 0.502, 0.502);
const INK = rgb(0.13, 0.15, 0.18);
const MUTED = rgb(0.45, 0.47, 0.5);
const LINE = rgb(0.85, 0.87, 0.89);

const PAGE_W = 595.28; // A4 portrait
const PAGE_H = 841.89;
const MARGIN = 56.7; // ~20mm
const CONTENT_W = PAGE_W - MARGIN * 2;

type ExportChild = {
  id?: string;
  name: string;
  age: number;
  stats: {
    lessonsCompleted: number;
    learningHours: string;
    avgProgress: number;
    currentStreak: number;
  };
  subjectProgress: { subject: string; progress: number; color?: string }[];
  curriculumObjectives?: { stage: string; subject: string; total: number; completed: number }[];
  achievements?: { label: string; description?: string }[];
  recentLessons?: { topic: string; subject: string; score?: number }[];
};

export async function POST(request: NextRequest) {
  try {
    const { child, filename } = (await request.json()) as {
      child: ExportChild;
      filename?: string;
    };

    // ── Entitlement check ──
    const auth = await initAuth();
    const session = await auth.api.getSession({ headers: new Headers(request.headers) });
    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const entitlement = await canGenerateReport(
      session.user.id,
      session.user.email,
      child?.id ?? null
    );
    if (!entitlement.allowed) {
      return NextResponse.json(
        {
          error: "Professional report is not active for this child. Add it for £3/month to download.",
          code: "report_addon_required",
        },
        { status: 403 }
      );
    }

    const pdf = await PDFDocument.create();
    const regular = await pdf.embedFont(StandardFonts.Helvetica);
    const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
    const italic = await pdf.embedFont(StandardFonts.HelveticaOblique);

    const page = pdf.addPage([PAGE_W, PAGE_H]);
    let y = PAGE_H - MARGIN;

    const wrap = (text: string, font: typeof regular, size: number, maxWidth: number) => {
      const words = text.split(/\s+/);
      const lines: string[] = [];
      let current = "";
      for (const w of words) {
        const candidate = current ? `${current} ${w}` : w;
        if (font.widthOfTextAtSize(candidate, size) > maxWidth && current) {
          lines.push(current);
          current = w;
        } else {
          current = candidate;
        }
      }
      if (current) lines.push(current);
      return lines;
    };

    const ensureSpace = (needed: number) => {
      if (y - needed < MARGIN) {
        const next = pdf.addPage([PAGE_W, PAGE_H]);
        y = PAGE_H - MARGIN;
        return next;
      }
      return page;
    };

    // ── Cover header with logo ──
    try {
      const base = process.env.NEXT_PUBLIC_SITE_URL || "https://kokolearn.org";
      let logoRes: Response | null = null;
      try {
        const { getCloudflareContext } = await import("@opennextjs/cloudflare");
        const { env } = await getCloudflareContext({ async: true });
        const assets = (env as unknown as { ASSETS?: { fetch: (u: URL | string) => Promise<Response> } }).ASSETS;
        if (assets) {
          logoRes = await assets.fetch(new URL("/images/kokolearn-logo-report.png", base));
        }
      } catch {
        logoRes = null;
      }
      if (!logoRes || !logoRes.ok) {
        logoRes = await fetch(`${base}/images/kokolearn-logo-report.png`);
      }
      if (logoRes.ok) {
        const logoBytes = await logoRes.arrayBuffer();
        const logo = await pdf.embedPng(logoBytes);
        const logoW = 170;
        const logoH = (logo.height / logo.width) * logoW;
        page.drawImage(logo, { x: MARGIN, y: y - logoH, width: logoW, height: logoH });
        y -= logoH + 18;
      }
    } catch {
      // Logo is optional; continue without it.
    }

    // ── Title ──
    page.drawText("KokoLearn Progress Report", {
      x: MARGIN,
      y: y - 26,
      size: 22,
      font: bold,
      color: TEAL,
    });
    y -= 46;

    page.drawText("Personalised learning aligned to the UK National Curriculum", {
      x: MARGIN,
      y,
      size: 10.5,
      font: regular,
      color: MUTED,
    });
    y -= 18;

    const today = new Date().toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const stage = child.id === "alex" ? "KS1" : "KS2";
    page.drawText(
      `Report for: ${child.name}, age ${child.age}   |   Stage: ${stage}   |   Generated: ${today}`,
      { x: MARGIN, y, size: 10, font: regular, color: INK }
    );
    y -= 16;

    page.drawLine({
      start: { x: MARGIN, y },
      end: { x: PAGE_W - MARGIN, y },
      thickness: 1.4,
      color: TEAL,
    });
    y -= 26;

    // ── Overview ──
    page.drawText("Overview", { x: MARGIN, y, size: 14, font: bold, color: TEAL });
    y -= 20;

    const stats = [
      ["Lessons completed", String(child.stats.lessonsCompleted)],
      ["Learning time", String(child.stats.learningHours)],
      ["Average progress", `${child.stats.avgProgress}%`],
      ["Current streak", `${child.stats.currentStreak} days`],
    ];
    const colW = CONTENT_W / 4;
    stats.forEach(([label, value], i) => {
      const x = MARGIN + colW * i;
      page.drawRectangle({
        x,
        y: y - 42,
        width: colW - 10,
        height: 42,
        borderColor: LINE,
        borderWidth: 1,
        color: rgb(0.98, 0.99, 0.99),
      });
      page.drawText(value, { x: x + 8, y: y - 20, size: 13, font: bold, color: INK });
      page.drawText(label, { x: x + 8, y: y - 34, size: 8.5, font: regular, color: MUTED });
    });
    y -= 62;

    // ── Subject breakdown ──
    page.drawText("Subject breakdown", { x: MARGIN, y, size: 14, font: bold, color: TEAL });
    y -= 20;

    const barW = CONTENT_W - 170;
    child.subjectProgress.forEach((s) => {
      ensureSpace(24);
      page.drawText(s.subject, { x: MARGIN, y, size: 10.5, font: bold, color: INK });
      const trackX = MARGIN + 130;
      page.drawRectangle({ x: trackX, y: y - 1, width: barW, height: 9, color: rgb(0.93, 0.94, 0.95) });
      const filled = Math.max(0, Math.min(100, s.progress));
      page.drawRectangle({
        x: trackX,
        y: y - 1,
        width: (barW * filled) / 100,
        height: 9,
        color: TEAL,
      });
      page.drawText(`${s.progress}%`, {
        x: trackX + barW + 8,
        y,
        size: 10,
        font: bold,
        color: INK,
      });
      y -= 22;
    });
    y -= 8;

    // ── Achievements and merits ──
    const merits = (child.achievements ?? []).length
      ? child.achievements!.map((a) => a.label)
      : [
          `${child.stats.currentStreak} day learning streak`,
          "Consistent weekly effort",
          "Curriculum objectives met",
        ];
    page.drawText("Achievements and merits", { x: MARGIN, y, size: 14, font: bold, color: TEAL });
    y -= 20;
    merits.slice(0, 8).forEach((m) => {
      ensureSpace(18);
      page.drawText(`- ${m}`, { x: MARGIN + 4, y, size: 10.5, font: regular, color: INK });
      y -= 16;
    });
    y -= 10;

    // ── Curriculum coverage ──
    if (child.curriculumObjectives?.length) {
      page.drawText("National Curriculum coverage", { x: MARGIN, y, size: 14, font: bold, color: TEAL });
      y -= 20;
      child.curriculumObjectives.slice(0, 10).forEach((o) => {
        ensureSpace(18);
        page.drawText(`${o.stage} ${o.subject}: ${o.completed} of ${o.total} objectives`, {
          x: MARGIN + 4,
          y,
          size: 10.5,
          font: regular,
          color: INK,
        });
        y -= 16;
      });
      y -= 10;
    }

    // ── Notes and next steps ──
    ensureSpace(90);
    page.drawText("Notes and next steps", { x: MARGIN, y, size: 14, font: bold, color: TEAL });
    y -= 20;
    const notes = [
      `${child.name} has completed ${child.stats.lessonsCompleted} lessons with an average progress of ${child.stats.avgProgress}%.`,
      "Continue with short, regular sessions to keep the learning streak going.",
      "Focus areas: build on the strongest subjects while giving extra time to the lower-progress ones.",
      "Celebrate effort as well as scores - the merit badges are designed for this.",
    ];
    notes.forEach((n) => {
      wrap(n, regular, 10.5, CONTENT_W - 10).forEach((line) => {
        ensureSpace(16);
        page.drawText(line, { x: MARGIN + 4, y, size: 10.5, font: regular, color: INK });
        y -= 15;
      });
      y -= 4;
    });

    // ── Footer on every page ──
    const pages = pdf.getPages();
    pages.forEach((p, i) => {
      p.drawLine({
        start: { x: MARGIN, y: MARGIN - 14 },
        end: { x: PAGE_W - MARGIN, y: MARGIN - 14 },
        thickness: 0.7,
        color: LINE,
      });
      p.drawText("KokoLearn.org - personalised learning for UK children", {
        x: MARGIN,
        y: MARGIN - 26,
        size: 8.5,
        font: italic,
        color: MUTED,
      });
      p.drawText(`Page ${i + 1} of ${pages.length}`, {
        x: PAGE_W - MARGIN - 60,
        y: MARGIN - 26,
        size: 8.5,
        font: regular,
        color: MUTED,
      });
    });

    const bytes = await pdf.save();
    const safeName = (filename || `${child.name}-progress-report`).replace(/[^a-zA-Z0-9-_]/g, "-");

    return new NextResponse(Buffer.from(bytes), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${safeName}.pdf"`,
      },
    });
  } catch (err) {
    console.error("PDF report generation failed:", err);
    return NextResponse.json({ error: "Failed to generate PDF report" }, { status: 500 });
  }
}
