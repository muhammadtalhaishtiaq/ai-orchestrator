/**
 * Next.js Middleware - Auth Route Protection
 * 
 * 🎓 LESSON: Next.js Middleware
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * Middleware runs BEFORE your pages load.
 * 
 * Middleware reads httpOnly cookie set by backend (nebula_token)
 * to block/allow routes BEFORE page render.
 */

import { NextRequest, NextResponse } from "next/server";

// Public routes - anyone can access
const PUBLIC_ROUTES = ["/login", "/register", "/forgot-password"];

// Protected routes - only logged in users
const PROTECTED_ROUTES = ["/", "/profile", "/settings"];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const token = request.cookies.get("nebula_token")?.value;

  if (token) {
    if (PUBLIC_ROUTES.includes(pathname)) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  if (PROTECTED_ROUTES.includes(pathname) || pathname === "/") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// Run middleware on these paths
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
