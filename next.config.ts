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

// ── Socket URL resolution (mirrors useChat.ts logic) ──────────────────────
// Derives the socket origin from the API base URL at build time so we don't
// need a separate env var. e.g. https://backend.onrender.com/smilebaba → https://backend.onrender.com
function deriveSocketUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SOCKET_URL;
  if (explicit?.startsWith("http")) return explicit.replace(/\/$/, "");

  const api = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (api?.startsWith("http")) {
    try {
      return new URL(api).origin; // strips the /smilebaba path safely
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
      // Cloudinary — both the main subdomain and any delivery subdomains
      { protocol: "https", hostname: "res.cloudinary.com", pathname: "/**" },
      { protocol: "https", hostname: "*.cloudinary.com", pathname: "/**" },
    ],
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
