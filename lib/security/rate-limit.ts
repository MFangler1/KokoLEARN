// ── Simple KV-backed rate limit ──
// Coarse abuse control for the few endpoints that can cost money or send mail.
// KV is eventually consistent, so this stops sustained abuse rather than
// guaranteeing an exact count.

import { getCloudflareContext } from "@opennextjs/cloudflare";

interface BucketRecord {
  count: number;
  reset: number; // epoch ms
}

export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  /** Seconds until the window resets when blocked. */
  retryAfter: number;
}

interface KVLike {
  get: (key: string) => Promise<string | null>;
  put: (key: string, value: string, options?: { expirationTtl?: number }) => Promise<void>;
}

async function kv(): Promise<KVLike | undefined> {
  try {
    const { env } = await getCloudflareContext({ async: true });
    return (env as { KV?: KVLike }).KV;
  } catch {
    return undefined;
  }
}

export async function rateLimit(
  bucket: string,
  identifier: string,
  limit: number,
  windowSeconds: number
): Promise<RateLimitResult> {
  const store = await kv();
  // No KV available (local dev): fail open rather than block the site.
  if (!store || !identifier) return { ok: true, remaining: limit, retryAfter: 0 };

  const key = `rl:${bucket}:${identifier}`;
  const now = Date.now();
  let record: BucketRecord = { count: 0, reset: now + windowSeconds * 1000 };

  try {
    const raw = await store.get(key);
    if (raw) {
      const parsed = JSON.parse(raw) as BucketRecord;
      if (parsed && typeof parsed.count === "number" && parsed.reset > now) {
        record = parsed;
      }
    }
  } catch {
    // treat as a fresh window
  }

  if (record.count >= limit) {
    return { ok: false, remaining: 0, retryAfter: Math.max(1, Math.ceil((record.reset - now) / 1000)) };
  }

  record.count += 1;
  try {
    await store.put(key, JSON.stringify(record), {
      expirationTtl: Math.max(60, Math.ceil((record.reset - now) / 1000)),
    });
  } catch {
    // a failed write must not block a legitimate request
  }

  return { ok: true, remaining: Math.max(0, limit - record.count), retryAfter: 0 };
}
