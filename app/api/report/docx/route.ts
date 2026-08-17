import { NextRequest, NextResponse } from "next/server";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle,
  ShadingType,
  TabStopPosition,
  TabStopType,
} from "docx";

export async function POST(request: NextRequest) {
  try {
    const { child, filename } = await request.json();

    const today = new Date().toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const primaryColor = "F97316";
    const secondaryColor = "EA580C";

    const doc = new Document({
      styles: {
        default: {
          document: {
            run: { font: "Calibri", size: 22 },
          },
        },
      },
      sections: [
        {
          properties: {
            page: {
              margin: { top: 1134, right: 1134, bottom: 1134, left: 1134 },
            },
          },
          children: [
            // ── Header ──
            new Paragraph({
              text: "KokoLearn Progress Report",
              heading: HeadingLevel.HEADING_1,
              alignment: AlignmentType.CENTER,
              spacing: { after: 100 },
              run: { color: primaryColor, bold: true, size: 48 },
            }),
            new Paragraph({
              text: "AI-powered tutoring aligned to the UK National Curriculum",
              alignment: AlignmentType.CENTER,
              spacing: { after: 400 },
              run: { color: "888888", size: 20 },
            }),
            new Paragraph({
              text: `Generated: ${today}    |    Report for: ${child.name}, Age ${child.age}    |    Stage: ${child.id === "alex" ? "KS1" : "KS2"}`,
              alignment: AlignmentType.CENTER,
              spacing: { after: 400 },
              run: { color: "666666", size: 18 },
            }),

            // ── Horizontal Rule ──
            new Paragraph({
              border: {
                bottom: { color: primaryColor, space: 1, style: BorderStyle.SINGLE, size: 6 },
              },
              spacing: { after: 400 },
            }),

            // ── Overview ──
            new Paragraph({
              text: "📊 Overview",
              heading: HeadingLevel.HEADING_2,
              spacing: { after: 200 },
              run: { color: primaryColor, bold: true, size: 28 },
            }),

            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [
                new TableRow({
                  children: [
                    createStatCell("Lessons Completed", String(child.stats.lessonsCompleted), primaryColor),
                    createStatCell("Learning Hours", String(child.stats.learningHours), "D97706"),
                    createStatCell("Average Progress", `${child.stats.avgProgress}%`, "059669"),
                    createStatCell("Current Streak", `${child.stats.currentStreak} days`, "DC2626"),
                  ],
                }),
              ],
            }),

            new Paragraph({ spacing: { after: 300 }, children: [] }),

            // ── Subject Breakdown ──
            new Paragraph({
              text: "📚 Subject Breakdown",
              heading: HeadingLevel.HEADING_2,
              spacing: { after: 200 },
              run: { color: secondaryColor, bold: true, size: 28 },
            }),

            ...child.subjectProgress.map(
              (s: { subject: string; progress: number; color: string }) =>
                new Paragraph({
                  spacing: { after: 100 },
                  children: [
                    new TextRun({ text: s.subject.padEnd(18, " "), bold: true, size: 20, font: "Calibri" }),
                    new TextRun({
                      text: `${"█".repeat(Math.round(s.progress / 5))}${"░".repeat(20 - Math.round(s.progress / 5))}`,
                      color: s.color.replace("#", ""),
                      size: 16,
                    }),
                    new TextRun({ text: `  ${s.progress}%`, bold: true, size: 20, color: s.color.replace("#", "") }),
                  ],
                })
            ),

            new Paragraph({ spacing: { after: 300 }, children: [] }),

            // ── Skill Heatmap ──
            new Paragraph({
              text: "🔥 Skill Heatmap",
              heading: HeadingLevel.HEADING_2,
              spacing: { after: 200 },
              run: { color: "D97706", bold: true, size: 28 },
            }),

            new Paragraph({
              spacing: { after: 100 },
              children: [
                new TextRun({ text: "Key: ", size: 18, color: "888888" }),
                new TextRun({ text: "■ Strong (70-100%)  ", size: 18, color: primaryColor, bold: true }),
                new TextRun({ text: "■ Developing (40-69%)  ", size: 18, color: secondaryColor, bold: true }),
                new TextRun({ text: "■ Needs Focus (0-39%)", size: 18, color: "9A3412", bold: true }),
              ],
            }),

            new Paragraph({ spacing: { after: 150 }, children: [] }),

            ...(() => {
              const skills = [
                { skill: "Addition", lvl: 90 }, { skill: "Subtraction", lvl: 85 }, { skill: "Multiplication", lvl: 60 },
                { skill: "Division", lvl: 45 }, { skill: "Reading", lvl: 75 }, { skill: "Writing", lvl: 65 },
                { skill: "Spelling", lvl: 70 }, { skill: "Biology", lvl: 55 }, { skill: "Physics", lvl: 40 },
                { skill: "Chemistry", lvl: 35 }, { skill: "Maps", lvl: 50 }, { skill: "Timelines", lvl: 30 },
                { skill: "Creativity", lvl: 80 }, { skill: "Problem Solving", lvl: 68 }, { skill: "Memory", lvl: 72 },
                { skill: "Focus", lvl: 60 },
              ];
              const paragraphs: Paragraph[] = [];
              for (let i = 0; i < skills.length; i += 4) {
                const row = skills.slice(i, i + 4);
                paragraphs.push(
                  new Paragraph({
                    spacing: { after: 80 },
                    children: row.map((s) =>
                      new TextRun({
                        text: `${s.skill.padEnd(14, " ")}${s.lvl}%  `,
                        size: 18,
                        bold: true,
                        color: s.lvl >= 70 ? primaryColor : s.lvl >= 40 ? secondaryColor : "9A3412",
                      })
                    ),
                  })
                );
              }
              return paragraphs;
            })(),

            new Paragraph({ spacing: { after: 300 }, children: [] }),

            // ── Personalised Insights ──
            new Paragraph({
              text: "💡 Personalised Insights",
              heading: HeadingLevel.HEADING_2,
              spacing: { after: 200 },
              run: { color: "059669", bold: true, size: 28 },
            }),

            new Paragraph({
              text: "✅ Strengths",
              heading: HeadingLevel.HEADING_3,
              spacing: { after: 100 },
              run: { color: "059669", bold: true, size: 24 },
            }),
            new Paragraph({ spacing: { after: 80 }, text: `• Strong engagement with dinosaur-themed maths lessons — uses interest-driven learning effectively`, bullet: { level: 0 } }),
            new Paragraph({ spacing: { after: 80 }, text: `• Maintains a ${child.stats.currentStreak}-day learning streak — shows consistent commitment`, bullet: { level: 0 } }),
            new Paragraph({ spacing: { after: 200 }, text: `• Excels in creative subjects — Art & Design at ${child.subjectProgress.find((s: { subject: string }) => s.subject.includes("Art"))?.progress || 70}%`, bullet: { level: 0 } }),

            new Paragraph({
              text: "🎯 Areas to Focus",
              heading: HeadingLevel.HEADING_3,
              spacing: { after: 100 },
              run: { color: "D97706", bold: true, size: 24 },
            }),
            new Paragraph({ spacing: { after: 80 }, text: "• History and Geography need more attention — try adventure-themed lessons", bullet: { level: 0 } }),
            new Paragraph({ spacing: { after: 80 }, text: "• Science scores dip mid-week — consider shorter, more frequent sessions", bullet: { level: 0 } }),
            new Paragraph({ spacing: { after: 200 }, text: "• Weekend engagement drops ~15% — gamified weekend challenges could help", bullet: { level: 0 } }),

            // ── Curriculum Coverage ──
            new Paragraph({
              text: `📋 National Curriculum Coverage — ${child.id === "alex" ? "KS1" : "KS2"}`,
              heading: HeadingLevel.HEADING_2,
              spacing: { after: 200 },
              run: { color: primaryColor, bold: true, size: 28 },
            }),

            ...child.curriculumObjectives.map(
              (obj: { stage: string; subject: string; total: number; completed: number }) => {
                const pct = Math.round((obj.completed / obj.total) * 100);
                return new Paragraph({
                  spacing: { after: 80 },
                  children: [
                    new TextRun({ text: `${obj.stage} ${obj.subject}  `, bold: true, size: 20 }),
                    new TextRun({ text: `${obj.completed}/${obj.total} objectives  `, size: 20, color: "666666" }),
                    new TextRun({
                      text: `${"█".repeat(Math.round(pct / 5))}${"░".repeat(20 - Math.round(pct / 5))}`,
                      color: primaryColor,
                      size: 16,
                    }),
                    new TextRun({ text: `  ${pct}%`, bold: true, size: 20, color: primaryColor }),
                  ],
                });
              }
            ),

            new Paragraph({ spacing: { after: 300 }, children: [] }),

            // ── Recent Activity ──
            new Paragraph({
              text: "🕐 Recent Lesson Activity",
              heading: HeadingLevel.HEADING_2,
              spacing: { after: 200 },
              run: { color: secondaryColor, bold: true, size: 28 },
            }),

            ...child.recentLessons.map(
              (l: { emoji: string; topic: string; subject: string; timeAgo: string; score: number }) =>
                new Paragraph({
                  spacing: { after: 80 },
                  children: [
                    new TextRun({ text: `${l.emoji}  ${l.topic}  `, size: 20 }),
                    new TextRun({ text: `${l.subject} · ${l.timeAgo}  `, size: 18, color: "888888" }),
                    new TextRun({
                      text: `${l.score}%`,
                      bold: true,
                      size: 20,
                      color: l.score >= 80 ? "059669" : l.score >= 60 ? "D97706" : "DC2626",
                    }),
                  ],
                })
            ),

            new Paragraph({ spacing: { after: 300 }, children: [] }),

            // ── Recommendations ──
            new Paragraph({
              text: "🎯 Recommended Next Steps",
              heading: HeadingLevel.HEADING_2,
              spacing: { after: 200 },
              run: { color: primaryColor, bold: true, size: 28 },
            }),

            new Paragraph({
              spacing: { after: 80 },
              children: [
                new TextRun({ text: "🦕  ", size: 20 }),
                new TextRun({ text: "Continue dinosaur-themed maths — introduce multiplication through 'Dino Pack Counting'", size: 20 }),
              ],
            }),
            new Paragraph({
              spacing: { after: 80 },
              children: [
                new TextRun({ text: "🗺️  ", size: 20 }),
                new TextRun({ text: "Start a weekly 'Country of the Week' geography challenge to boost map skills", size: 20 }),
              ],
            }),
            new Paragraph({
              spacing: { after: 80 },
              children: [
                new TextRun({ text: "🧪  ", size: 20 }),
                new TextRun({ text: "Add 2 short science quizzes per week — aim for Tuesday and Thursday when engagement peaks", size: 20 }),
              ],
            }),

            // ── Footer ──
            new Paragraph({
              border: {
                top: { color: primaryColor, space: 1, style: BorderStyle.SINGLE, size: 6 },
              },
              spacing: { before: 400, after: 100 },
            }),
            new Paragraph({
              text: "Generated by KokoLearn.org — AI-powered tutoring aligned to the UK National Curriculum",
              alignment: AlignmentType.CENTER,
              run: { size: 16, color: "999999" },
            }),
            new Paragraph({
              text: "A PAD-CIC initiative · https://kokolearn.org",
              alignment: AlignmentType.CENTER,
              run: { size: 16, color: "999999" },
            }),
            new Paragraph({
              text: "This report is saved to our secure system for future reference.",
              alignment: AlignmentType.CENTER,
              run: { size: 16, color: "BBBBBB" },
            }),
          ],
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);
    const body = new Uint8Array(buffer);

    return new NextResponse(body, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${filename}.docx"`,
      },
    });
  } catch (error) {
    console.error("DOCX generation failed:", error);
    return NextResponse.json({ error: "Failed to generate DOCX" }, { status: 500 });
  }
}

// Helper: create a styled stat table cell
function createStatCell(label: string, value: string, color: string) {
  return new TableCell({
    width: { size: 25, type: WidthType.PERCENTAGE },
    shading: { type: ShadingType.SOLID, color: "FFFFFF", fill: "FFF7ED" },
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 50 },
        children: [new TextRun({ text: label, size: 16, color: "888888" })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: value, size: 28, bold: true, color: color })],
      }),
    ],
  });
}
