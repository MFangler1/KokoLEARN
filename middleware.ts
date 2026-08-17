import { type NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Better Auth session cookie name(s)
// On Cloudflare Workers (HTTPS), Better Auth uses the __Secure- prefix
const SESSION_COOKIE = "__Secure-better-auth.session_token";
const SESSION_COOKIE_FALLBACK = "better-auth.session_token";

function hasSessionCookie(request: NextRequest): boolean {
  const cookies = request.headers.get("cookie") || "";
  return cookies.includes(SESSION_COOKIE) || cookies.includes(SESSION_COOKIE_FALLBACK);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const protectedPaths = ["/dashboard", "/onboarding", "/lessons"];
  const authPaths = ["/sign-in", "/sign-up"];

  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));
  const isAuthPage = authPaths.some((p) => pathname.startsWith(p));

  if (isProtected) {
    if (!hasSessionCookie(request)) {
      const url = request.nextUrl.clone();
      url.pathname = "/sign-in";
      url.searchParams.set("redirect", request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
  }

  if (isAuthPage) {
    if (hasSessionCookie(request)) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/onboarding/:path*",
    "/lessons/:path*",
    "/sign-in",
    "/sign-up",
  ],
};
