import { NextRequest, NextResponse } from "next/server";

const API =
  process.env.API_URL ??
  "https://smilebababackend-vvok.onrender.com/smilebaba";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const res = await fetch(`${API}/support/deletion-request`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { message: "We couldn't submit that. Please email privacy@smilebabahub.com." },
      { status: 502 },
    );
  }
}