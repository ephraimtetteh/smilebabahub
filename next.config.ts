import type { NextConfig } from "next";

// ── Build-time guard ───────────────────────────────────────────────────────
if (
  process.env.NODE_ENV === "production" &&
  !process.env.NEXT_PUBLIC_API_BASE_URL
) {
  throw new Error(
    "Missing env var: NEXT_PUBLIC_API_BASE_URL\n" +
      "Add it in Render → your frontend service → Environment:\n" +
      "NEXT_PUBLIC_API_BASE_URL = https://smilebababackend.onrender.com/smilebaba",
  );
}

// ── Socket URL resolution ──────────────────────────────────────────────────
// Socket.IO needs just the origin (no /smilebaba path).
// We derive it from NEXT_PUBLIC_API_BASE_URL at build time so you never need
// a separate NEXT_PUBLIC_SOCKET_URL env var.
//
// Example:
//   NEXT_PUBLIC_API_BASE_URL = https://smilebababackend.onrender.com/smilebaba
//   → socket origin           = https://smilebababackend.onrender.com
function deriveSocketUrl(): string {
  const api = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (api?.startsWith("http")) {
    try {
      return new URL(api).origin;
    } catch {}
  }
  return "http://localhost:3001";
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "source.unsplash.com" },
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "res.cloudinary.com", pathname: "/**" },
      { protocol: "https", hostname: "*.cloudinary.com", pathname: "/**" },
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 86400,
    deviceSizes: [360, 480, 640, 828, 1080, 1200, 1920],
    imageSizes: [56, 96, 128, 256, 384],
    dangerouslyAllowSVG: false,
    // When the upstream image (e.g. Cloudinary) returns 4xx/5xx,
    // Next.js will throw "upstream image response failed".
    // Setting this to true makes it return a 400 to the browser instead
    // of crashing the optimizer — the browser then shows the broken image
    // placeholder rather than an unhandled error.
    // Individual components handle this with the onError prop.
  },

  // Expose the derived socket URL so useChat.ts can pick it up
  // without needing a separate NEXT_PUBLIC_SOCKET_URL env var
  env: {
    NEXT_PUBLIC_SOCKET_URL:
      process.env.NEXT_PUBLIC_SOCKET_URL ?? deriveSocketUrl(),
  },

  async rewrites() {
    return [
      {
        // All /api/* calls from the browser are proxied to your Express backend.
        // Avoids CORS issues and never exposes the backend URL in client code.
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/:path*`,
      },
    ];
  },
};

export default nextConfig;
