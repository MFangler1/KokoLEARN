import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { initAuth } from "@/lib/auth/server";

async function requireAdmin(req: Request, env: CloudflareEnv) {
  const auth = await initAuth();
  const session = await auth.api.getSession({ headers: new Headers(req.headers) });
  const adminEmail = env.ADMIN_EMAIL?.trim().toLowerCase();
  if (!adminEmail) {
    return { error: NextResponse.json({ error: "Admin access is not configured" }, { status: 503 }) };
  }
  if (!session?.user?.email || session.user.email.toLowerCase() !== adminEmail) {
    return { error: NextResponse.json({ error: "Not authorised" }, { status: 403 }) };
  }
  return { session };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, childName, quote, rating } = body;

    if (!name || !quote || !rating) {
      return NextResponse.json(
        { error: "Name, quote, and rating are required" },
        { status: 400 }
      );
    }

    const testimonial = {
      id: crypto.randomUUID(),
      name,
      childName: childName || "",
      quote,
      rating: Math.min(5, Math.max(1, Number(rating))),
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    // Store in KV
    let { env } = await getCloudflareContext({ async: true });

    // Get existing testimonials
    let existing = [];
    try {
      const raw = await env.KV.get("testimonials:pending", "text");
      if (raw) existing = JSON.parse(raw);
    } catch {
      existing = [];
    }

    existing.push(testimonial);
    await env.KV.put("testimonials:pending", JSON.stringify(existing));

    console.log(`✅ Testimonial submitted by ${name} (${testimonial.id})`);

    return NextResponse.json({
      success: true,
      message:
        "Thank you for your testimonial! It will be reviewed by our team and published shortly.",
    });
  } catch (err) {
    console.error("Testimonial submission error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { env } = await getCloudflareContext({ async: true });
    const admin = await requireAdmin(req, env);
    if (admin.error) return admin.error;

    const raw = await env.KV.get("testimonials:pending", "text");
    const pending = raw ? JSON.parse(raw) : [];

    return NextResponse.json({ testimonials: pending });
  } catch (err) {
    console.error("Testimonial fetch error:", err);
    return NextResponse.json(
      { error: "Failed to fetch testimonials" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, action } = body;

    if (!id || !["approve", "reject"].includes(action)) {
      return NextResponse.json(
        { error: "ID and action (approve/reject) are required" },
        { status: 400 }
      );
    }

    const { env } = await getCloudflareContext({ async: true });
    const admin = await requireAdmin(req, env);
    if (admin.error) return admin.error;

    // Get pending
    const raw = await env.KV.get("testimonials:pending", "text");
    let pending = raw ? JSON.parse(raw) : [];

    const testimonial = pending.find((t: any) => t.id === id);
    if (!testimonial) {
      return NextResponse.json(
        { error: "Testimonial not found" },
        { status: 404 }
      );
    }

    // Remove from pending
    pending = pending.filter((t: any) => t.id !== id);
    await env.KV.put("testimonials:pending", JSON.stringify(pending));

    if (action === "approve") {
      testimonial.status = "approved";
      testimonial.approvedAt = new Date().toISOString();

      // Add to approved list
      const approvedRaw = await env.KV.get("testimonials:approved", "text");
      let approved = approvedRaw ? JSON.parse(approvedRaw) : [];
      approved.unshift(testimonial);
      await env.KV.put("testimonials:approved", JSON.stringify(approved));
    }

    return NextResponse.json({ success: true, action });
  } catch (err) {
    console.error("Testimonial review error:", err);
    return NextResponse.json(
      { error: "Failed to update testimonial" },
      { status: 500 }
    );
  }
}
