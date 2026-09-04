import { getCloudflareContext } from "@opennextjs/cloudflare";
import { drizzle } from "drizzle-orm/d1";
import { schema } from "./schema";

/**
 * Get the D1 database instance.
 * Returns null when D1 is unavailable. Security-sensitive callers must fail
 * closed instead of substituting an in-memory store.
 */
export async function getDb() {
  try {
    const { env } = await getCloudflareContext({ async: true });
    if (env && typeof env === "object" && "DB" in env) {
      return drizzle(env.DB, { schema, logger: true });
    }
  } catch (error) {
    console.error("D1 binding is unavailable", error);
  }
  return null;
}

// Re-exports for convenience
export * from "drizzle-orm";
export * from "./schema";
