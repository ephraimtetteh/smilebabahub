// src/components/SafeImage.tsx
//
// Wraps Next.js Image with a fallback that renders when Cloudinary
// (or any remote host) returns 404. Instead of a broken image icon or
// server-log spam, users see a subtle placeholder.
//
// Uses the custom cloudinaryLoader configured in next.config.ts, so
// Cloudinary URLs are fetched directly by the browser — no server proxy.
//
// USAGE:
//   <SafeImage src={promo.coverImage} alt={promo.title} width={640} height={360} />
//   <SafeImage src={ad.coverImage} alt={ad.title} fill className="object-cover" />

"use client";

import Image, { type ImageProps } from "next/image";
import { useState, useEffect } from "react";
import { ImageOff } from "lucide-react";

// A tiny transparent 1x1 as final fallback so Image never explodes
const TRANSPARENT_PX =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

interface SafeImageProps extends Omit<ImageProps, "src" | "onError"> {
  src?: string | null;
  fallbackSrc?: string;
  fallbackEmoji?: string;   // shown when the fallback also fails
  showBrokenIcon?: boolean; // show ImageOff icon instead of emoji
}

export default function SafeImage({
  src,
  alt,
  fallbackSrc,
  fallbackEmoji = "📺",
  showBrokenIcon = false,
  className,
  ...rest
}: SafeImageProps) {
  // Track which src we're trying
  const [current, setCurrent] = useState<string | null>(src ?? null);
  const [broken,  setBroken]  = useState(false);

  // Reset when the incoming src changes (parent re-render with new promo, etc.)
  useEffect(() => {
    setCurrent(src ?? null);
    setBroken(false);
  }, [src]);

  // No src at all, or completely broken — render placeholder
  if (!current || broken) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 ${className ?? ""}`}
        style={rest.fill ? { position: "absolute", inset: 0 } : undefined}
      >
        {showBrokenIcon ? (
          <ImageOff size={24} className="text-gray-400" />
        ) : (
          <span className="text-3xl opacity-50">{fallbackEmoji}</span>
        )}
      </div>
    );
  }

  return (
    <Image
      {...rest}
      src={current}
      alt={alt}
      className={className}
      onError={() => {
        // Try the fallback src once, then give up and show placeholder
        if (fallbackSrc && current !== fallbackSrc) {
          console.warn(`[SafeImage] ${current} failed, trying fallback`);
          setCurrent(fallbackSrc);
        } else {
          console.warn(`[SafeImage] ${current} failed, showing placeholder`);
          setBroken(true);
        }
      }}
    />
  );
}

// ─── Alternative: plain <img> version ────────────────────────────────
// If you're NOT using next/image everywhere and prefer plain img tags,
// use this instead. Same fallback behavior, no Next.js dependency.
//
// USAGE:
//   <SafeImg src={promo.coverImage} alt="..." className="w-full aspect-video" />

interface SafeImgProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src"> {
  src?: string | null;
  fallbackSrc?: string;
  fallbackEmoji?: string;
}

export function SafeImg({
  src,
  fallbackSrc,
  fallbackEmoji = "📺",
  alt = "",
  className,
  ...rest
}: SafeImgProps) {
  const [current, setCurrent] = useState<string | null>(src ?? null);
  const [broken,  setBroken]  = useState(false);

  useEffect(() => {
    setCurrent(src ?? null);
    setBroken(false);
  }, [src]);

  if (!current || broken) {
    return (
      <div className={`flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 ${className ?? ""}`}>
        <span className="text-3xl opacity-50">{fallbackEmoji}</span>
      </div>
    );
  }

  return (
    <img
      {...rest}
      src={current}
      alt={alt}
      className={className}
      onError={() => {
        if (fallbackSrc && current !== fallbackSrc) {
          setCurrent(fallbackSrc);
        } else {
          setBroken(true);
        }
      }}
    />
  );
}