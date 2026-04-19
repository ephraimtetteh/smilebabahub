// src/app/api/auth/refresh/route.ts
// Proxies POST /api/auth/refresh → Express backend POST /auth/refresh
//
// WHY this is a real route handler instead of a next.config.js rewrite:
// Rewrites forward the request server-side, but Vercel's edge runtime
// does not always forward httpOnly cookies from the original browser request
// to the upstream backend. This handler explicitly reads the refreshToken
// cookie and forwards it, guaranteeing the backend receives it.

import { NextRequest, NextResponse } from "next/server";

const BACKEND =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001/smilebaba";

export async function POST(req: NextRequest) {
  try {
    const refreshToken = req.cookies.get("refreshToken")?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { message: "No refresh token" },
        { status: 401 },
      );
    }

    const backendRes = await fetch(`${BACKEND}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Explicitly forward the cookie — this is what rewrites miss
        Cookie: `refreshToken=${refreshToken}`,
      },
      cache: "no-store",
    });

    const data = await backendRes.json().catch(() => ({}));

    if (!backendRes.ok) {
      return NextResponse.json(data, { status: backendRes.status });
    }

    const response = NextResponse.json(data, { status: 200 });

    // Forward any Set-Cookie headers so the frontend domain gets them
    // (e.g. if the backend rotates the refreshToken)
    const setCookie = backendRes.headers.get("set-cookie");
    if (setCookie) {
      response.headers.set("set-cookie", setCookie);
    }

    return response;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[/api/auth/refresh] error:", message);
    return NextResponse.json({ message: "Gateway error" }, { status: 502 });
  }
}

// Also handle GET in case any client accidentally calls it
export async function GET() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}
