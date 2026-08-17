import { getCloudflareContext } from "@opennextjs/cloudflare";
import { drizzle } from "drizzle-orm/d1";
import { schema } from "./schema";

/**
 * Get the D1 database instance.
 * Falls back gracefully if D1 binding is not available.
 */
export async function getDb() {
  try {
    const { env } = await getCloudflareContext({ async: true });
    if (env && typeof env === "object" && "DB" in env) {
      return drizzle(env.DB, { schema, logger: true });
    }
  } catch {
    // D1 binding not available — return null
  }
  return null;
}

// Re-exports for convenience
export * from "drizzle-orm";
export * from "./schema";
