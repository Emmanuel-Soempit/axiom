import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Auth-only paths that shouldn't be accessible when logged in
const AUTH_PATHS = ["/sign-in", "/sign-up"];

// Protected paths that require authentication
const PROTECTED_PATHS = ["/(protected)/", "/profile", "/settings"];

export async function middleware(request: any) {
  const token = request.cookies.get("session-token")?.value;
  const { pathname } = request.nextUrl;

  // 1. If user is logged in and trying to access sign-in/sign-up, redirect to root
  if (token && AUTH_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 2. If user is NOT logged in and trying to access protected paths, redirect to sign-in
  if (!token && PROTECTED_PATHS.some((path) => pathname.startsWith(path))) {
    const signInUrl = new URL("/sign-in", request.url);
    // Optional: add callback url
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  // 3. Project ID Validation
  if (token && pathname.startsWith("/project")) {
    // Exclude the base /project path (project creation/selection)
    if (pathname === "/project" || pathname === "/project/") {
      return NextResponse.next();
    }

    const segments = pathname.split("/");
    // Path format: /project/[projectId]/...
    if (segments.length >= 3) {
      const projectIdFromUrl = segments[2];

      // Exclude the not-found page itself to avoid infinite loops
      if (segments[3] === "not-found") {
        return NextResponse.next();
      }

      const userCookie = request.cookies.get("session-user")?.value;
      if (userCookie) {
        try {
          const user = JSON.parse(userCookie);
          const activeProjectId = user?.project?.id;

          if (activeProjectId && projectIdFromUrl !== activeProjectId) {
            return NextResponse.redirect(
              new URL(`/project/${projectIdFromUrl}/not-found`, request.url),
            );
          }
        } catch (e) {
          console.error("Middleware session-user parse error:", e);
        }
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
