// src/utils/cloudinaryLoader.ts
// Custom Next.js image loader for Cloudinary.
//
// With the default Next.js loader, every <Image src="https://res.cloudinary.com/...">
// is proxied through /_next/image on your server. When the Cloudinary file
// doesn't exist (404), Next.js logs "upstream image response failed" on every
// page render — once per image per request.
//
// This loader bypasses the proxy for Cloudinary URLs: the browser fetches
// the image directly from Cloudinary's CDN. A 404 is then caught client-side
// by SafeImage's onError handler → shows placeholder, no server log spam.
//
// For non-Cloudinary URLs, it falls back to the standard behaviour.
//
// next.config.ts:
//   images: { loader: "custom", loaderFile: "./src/lib/cloudinaryLoader.ts" }

interface LoaderParams {
  src: string;
  width: number;
  quality?: number;
}

export default function cloudinaryLoader({
  src,
  width,
  quality = 75,
}: LoaderParams): string {
  // Only transform actual Cloudinary URLs
  if (!src.includes("res.cloudinary.com")) {
    // Non-Cloudinary: as-is (static assets, Google avatars, external images)
    return src;
  }
  // Videos and raw files are left alone
  if (!src.includes("/image/upload/")) return src;

  // Already has Cloudinary transformations in the URL — return directly
  // (e.g. URLs already containing /c_fill/ or /w_800/)
  if (/\/upload\/[^/]*\b(c|w|f|q|t)_/.test(src)) {
    return src;
  }

  // Inject responsive width + format + quality transformations.
  // Cloudinary transformation syntax: /upload/t_params/v.../public_id
  // We insert after /upload/
  const uploadIndex = src.indexOf("/upload/");
  if (uploadIndex === -1) return src;

  const before = src.slice(0, uploadIndex + "/upload/".length);
  const after = src.slice(uploadIndex + "/upload/".length);

  // f_auto  → serve WebP/AVIF to browsers that support it
  // q_auto  → Cloudinary picks optimal quality (ignores our q param for simplicity)
  // w_{n}   → resize to requested width
  // c_limit never upscales; f_auto also turns iPhone HEIC into JPEG/WebP
  const transform = `f_auto,q_auto:${quality >= 80 ? "good" : "eco"},c_limit,w_${width}`;

  return `${before}${transform}/${after}`;
}
