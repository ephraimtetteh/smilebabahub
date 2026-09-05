

import { NextRequest, NextResponse } from "next/server";

const API =
  process.env.API_URL ??
  "https://smilebababackend-vvok.onrender.com/smilebaba";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const res = await fetch(`${API}/support/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch {
    // The backend being down shouldn't look like the user's mistake
    return NextResponse.json(
      { message: "We couldn't send that. Please email support@smilebabahub.com." },
      { status: 502 },
    );
  }
}