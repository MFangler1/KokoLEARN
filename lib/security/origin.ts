const LOCAL_ORIGINS = new Set(["http://localhost:3000", "http://localhost:3001"]);

function configuredOrigins(): Set<string> {
  const origins = new Set(["https://kokolearn.org"]);
  for (const value of (process.env.BETTER_AUTH_TRUSTED_ORIGINS ?? "").split(",")) {
    const origin = value.trim();
    if (origin) origins.add(origin);
  }
  if (process.env.NODE_ENV !== "production") {
    for (const origin of LOCAL_ORIGINS) origins.add(origin);
  }
  return origins;
}

export function hasTrustedOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  return origin !== null && configuredOrigins().has(origin);
}
