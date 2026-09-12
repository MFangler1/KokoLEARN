import { getCloudflareContext } from "@opennextjs/cloudflare";
import { betterAuth } from "better-auth";
import { captcha } from "better-auth/plugins";
import { withCloudflare } from "better-auth-cloudflare";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { getDb } from "@/lib/db";

function buildResetEmail(url: string): string {
  return '<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,sans-serif"><table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:40px 16px"><table width="480" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.05)"><tr><td style="background:linear-gradient(135deg,#F97316,#EA580C);padding:32px;text-align:center"><img src="https://kokolearn.org/images/kokolearn-logo-sm.webp" alt="KokoLearn" width="160" style="display:block;margin:0 auto" /></td></tr><tr><td style="padding:32px"><h1 style="margin:0 0 8px;font-size:24px;color:#1e293b">Reset your password</h1><p style="margin:0 0 20px;font-size:15px;color:#64748b;line-height:1.6">Click the button below to reset your KokoLearn password.</p><a href="' + url + '" style="display:inline-block;background:linear-gradient(135deg,#F97316,#EA580C);color:#fff;text-decoration:none;padding:14px 32px;border-radius:12px;font-size:15px;font-weight:600">Reset Password</a><p style="margin:20px 0 0;font-size:13px;color:#94a3b8">This link expires in 1 hour.</p></td></tr><tr><td style="padding:24px 32px;background:#fafafa;text-align:center"><p style="margin:0;font-size:12px;color:#94a3b8">KokoLearn.org &mdash; AI-powered tutoring for UK children</p></td></tr></table></td></tr></table></body></html>';
}

async function sendPasswordResetEmail(env: any, email: string, url: string) {
  const html = buildResetEmail(url);

  // Try Cloudflare's send_email binding first
  if (env.SEND_EMAIL) {
    try {
      await env.SEND_EMAIL.send({
        from: { name: "KokoLearn", email: "noreply@kokolearn.org" },
        to: [{ email }],
        subject: "Reset Your KokoLearn Password 🔐",
        html,
      });
      console.log("[AUTH] Password reset email sent via Cloudflare to", email);
      return;
    } catch (e) {
      console.error("[AUTH] Cloudflare email failed, trying relay:", e);
    }
  }

  // Fallback: try the local relay
  try {
    await fetch("https://email-relay.kokolearn.org", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to: email, subject: "Reset Your KokoLearn Password 🔐", html }),
      signal: AbortSignal.timeout(10000),
    });
  } catch (e) {
    console.error("[AUTH] Relay email also failed:", e);
  }
}

async function authBuilder() {
  const dbInstance = await getDb();

  // If no database is available, auth will work in memory-only mode
  // (sessions persist via cookies, users are ephemeral)
  if (!dbInstance) {
    const cfCtx = getCloudflareContext();
    return betterAuth({
      ...withCloudflare(
        {
          autoDetectIpAddress: true,
          geolocationTracking: true,
          cf: cfCtx.cf,
        },
        {
          baseURL: cfCtx.env.BETTER_AUTH_URL ?? process.env.BETTER_AUTH_URL,
          secret: cfCtx.env.BETTER_AUTH_SECRET ?? process.env.BETTER_AUTH_SECRET,
          trustedOrigins: [
            ...(cfCtx.env.BETTER_AUTH_TRUSTED_ORIGINS ?? "")
              .split(",")
              .filter(Boolean),
            "https://kokolearn.org",
            "https://kokolearn.mark-fenty.workers.dev",
          ],
          rateLimit: {
            enabled: true,
            window: 60,
            max: 100,
            customRules: {
              "/sign-up/email": { window: 3600, max: 5 },
              "/sign-in/email": { window: 300, max: 10 },
              "/request-password-reset": { window: 900, max: 3 },
            },
          },
        }
      ),
      emailAndPassword: {
        enabled: true,
        autoSignIn: true,
        sendResetPassword: async (data) => {
          const cfCtx = getCloudflareContext();
          await sendPasswordResetEmail(cfCtx.env, data.user.email, data.url);
        },
      },
    });
  }

  const cfCtx = getCloudflareContext();

  return betterAuth({
    ...withCloudflare(
      {
        autoDetectIpAddress: true,
        geolocationTracking: true,
        cf: cfCtx.cf,
        d1: {
          db: dbInstance!,
          options: {
            usePlural: true,
            debugLogs: false,
          },
        },
      },
      {
        baseURL: cfCtx.env.BETTER_AUTH_URL ?? process.env.BETTER_AUTH_URL,
        secret: cfCtx.env.BETTER_AUTH_SECRET ?? process.env.BETTER_AUTH_SECRET,
        trustedOrigins: [
          ...(cfCtx.env.BETTER_AUTH_TRUSTED_ORIGINS ?? "")
            .split(",")
            .filter(Boolean),
          "https://kokolearn.org",
          "https://kokolearn.mark-fenty.workers.dev",
        ],
        rateLimit: {
          enabled: true,
          window: 60,
          max: 100,
          customRules: {
            "/sign-up/email": { window: 3600, max: 5 },
            "/sign-in/email": { window: 300, max: 10 },
            "/request-password-reset": { window: 900, max: 3 },
          },
        },
      }
    ),
    emailAndPassword: {
      enabled: true,
      autoSignIn: true,
      sendResetPassword: async (data) => {
        await sendPasswordResetEmail(cfCtx.env, data.user.email, data.url);
      },
    },
    // Bot protection on account creation only, so existing flows (sign-in,
    // password reset) keep working untouched while we roll this out.
    plugins: cfCtx.env.TURNSTILE_SECRET_KEY
      ? [
          captcha({
            provider: "cloudflare-turnstile",
            secretKey: cfCtx.env.TURNSTILE_SECRET_KEY as string,
            endpoints: ["/sign-up/email"],
          }),
        ]
      : [],
  });
}

// Singleton pattern for Cloudflare Workers
let authInstance: Awaited<ReturnType<typeof authBuilder>> | null = null;

export async function initAuth() {
  if (!authInstance) {
    authInstance = await authBuilder();
  }
  return authInstance;
}

// Static config for CLI schema generation (runs outside Cloudflare context)
export const auth = betterAuth({
  ...withCloudflare(
    {
      autoDetectIpAddress: true,
      geolocationTracking: true,
      cf: {},
    },
    {
      // This export is used only by the schema-generation CLI, outside Workers.
      // Runtime requests always use initAuth() and the deployed Cloudflare secrets.
      baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
      secret: process.env.BETTER_AUTH_SECRET || "kokolearn-schema-generation-only-secret",
    }
  ),
  database: drizzleAdapter(process.env.DATABASE as any, {
    provider: "sqlite",
    usePlural: true,
  }),
});
