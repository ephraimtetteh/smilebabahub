// src/utils/cloudinaryLoader.ts
// Custom Next.js image loader (wired in next.config.ts → images.loaderFile).
//
// Why: with the default loader every <Image> is proxied through /_next/image.
// That (a) burns the host's image-optimisation quota — on Vercel, once it is
// used up images return 402 and simply don't show — and (b) rejects any host
// not listed in remotePatterns (Google / Facebook avatars, old /uploads files).
//
// Now: Cloudinary URLs get Cloudinary's own CDN resizing (f_auto,q_auto,w_N);
// everything else is loaded directly by the browser, untouched.

interface LoaderParams {
  src: string;
  width: number;
  quality?: number;
}

const API_ORIGIN = (() => {
  try {
    const u = process.env.NEXT_PUBLIC_API_BASE_URL;
    return u?.startsWith("http") ? new URL(u).origin : "";
  } catch {
    return "";
  }
})();

export default function cloudinaryLoader({ src, width, quality }: LoaderParams): string {
  if (!src) return src;

  // Old local-disk uploads stored as "/uploads/..." live on the API server
  if (src.startsWith("/uploads/") && API_ORIGIN) src = `${API_ORIGIN}${src}`;

  // Local static assets (/_next/static, /public) — leave alone
  if (src.startsWith("/") || src.startsWith("data:") || src.startsWith("blob:")) return src;

  src = src.replace(/^http:\/\//i, "https://");

  if (!src.includes("res.cloudinary.com") || !src.includes("/upload/")) return src;

  // iPhone HEIC originals: only Safari can show them. Changing the
  // extension makes Cloudinary convert.
  src = src.replace(/\.(heic|heif)(\?.*)?$/i, ".jpg$2");

  const i = src.indexOf("/upload/") + "/upload/".length;
  const before = src.slice(0, i);
  const after = src.slice(i);

  // Already transformed (e.g. "c_fill,w_800/v123/...") — respect it
  if (/^[a-z]{1,3}_[^/]+\//i.test(after)) return src;

  const q = quality ? `q_${quality}` : "q_auto";
  return `${before}f_auto,${q},c_limit,w_${width}/${after}`;
}
