// src/middleware.ts
// Next.js edge middleware — runs before every request.
// Handles:
//   1. /login → /auth/login  (catch stale redirects from old code / third-party links)
//   2. /vendor  → /vendor/dashboard  (bare vendor path has no page)
//   3. /vendor/history → /account/orders  (route was renamed)
//   4. /vendor/ads → /ads/my  (stale ExpiryModal link fallback)

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ── 1. Bare /login → /auth/login ──────────────────────────────────────
  // Some components or third-party tools link to /login directly.
  // The correct Next.js page is at /auth/login.
  if (pathname === "/login") {
    const url = req.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url, 308); // permanent
  }

  // ── 2. /vendor (bare) → /vendor/dashboard ─────────────────────────────
  // /vendor with no subpath has no page file — returns empty RSC shell.
  if (pathname === "/vendor" || pathname === "/vendor/") {
    const url = req.nextUrl.clone();
    url.pathname = "/vendor/dashboard";
    return NextResponse.redirect(url, 307);
  }

  // ── 3. /vendor/history → /account/orders ──────────────────────────────
  // Old route — page was moved to /account/orders.
  if (pathname === "/vendor/history") {
    const url = req.nextUrl.clone();
    url.pathname = "/account/orders";
    return NextResponse.redirect(url, 308);
  }

  // ── 4. /vendor/ads → /ads/my ─────────────────────────────────────────
  // ExpiryModal previously linked to /vendor/ads?filter=expired.
  // Fixed in our output but catch any remaining links.
  if (pathname.startsWith("/vendor/ads")) {
    const url = req.nextUrl.clone();
    const filter = req.nextUrl.searchParams.get("filter");
    url.pathname = "/ads/my";
    url.search = filter ? `?status=${filter}` : "";
    return NextResponse.redirect(url, 308);
  }

  // ── 5. /subscription → /subscribe ───────────────────────────────────────
  // Old URL used in some emails and older links.
  if (pathname === "/subscription") {
    const url = req.nextUrl.clone();
    url.pathname = "/subscribe";
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/vendor",
    "/vendor/",
    "/vendor/history",
    "/vendor/ads",
    "/vendor/ads/:path*",
    "/subscription",
  ],
};
