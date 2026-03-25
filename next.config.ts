import type { NextConfig } from "next";

// ── Build-time guard ───────────────────────────────────────────────────────
// Fails the build immediately if the API URL is missing in production
// so you never silently deploy a broken build again.
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

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "source.unsplash.com" },
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },

  async rewrites() {
    return [
      {
        // All /api/* calls from the browser are proxied to your Express backend.
        // This means you never expose the backend URL in client-side code
        // and avoids CORS issues entirely.
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/:path*`,
      },
    ];
  },
};

export default nextConfig;
