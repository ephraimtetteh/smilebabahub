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
import { useState, useEffect, JSX } from "react";
import { ImageOff } from "lucide-react";
import cloudinaryLoader from "@/src/utils/cloudinaryLoader";

const isCloudinary = (u?: string | null) => !!u && u.includes("res.cloudinary.com") && u.includes("/image/upload/");

// A tiny transparent 1x1 as final fallback so Image never explodes
const TRANSPARENT_PX =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

interface SafeImageProps extends Omit<ImageProps, "src" | "onError"> {
  src?: string | null;
  fallbackSrc?: string;
  fallbackEmoji?: string; // shown when the fallback also fails
  showBrokenIcon?: boolean; // show ImageOff icon instead of emoji
  fallbackIcon?: JSX.Element;
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
  // Cloudinary photos: 0 = resized copy from Cloudinary's CDN (f_auto also
  // converts iPhone HEIC), 1 = the original file as uploaded. Neither goes
  // through /_next/image, which times out on big photos and has a quota.
  const [stage, setStage] = useState(0);

  // Reset when the incoming src changes (parent re-render with new promo, etc.)
  useEffect(() => {
    setCurrent(src ?? null);
    setBroken(false);
    setStage(0);
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

  if (isCloudinary(current)) {
    const w = typeof rest.width === "number" ? Math.min(1600, rest.width * 2) : 1200;
    const url = stage === 0 ? cloudinaryLoader({ src: current, width: w }) : current;
    return (
      <Image
        {...rest}
        key={url}
        src={url}
        alt={alt}
        className={className}
        unoptimized
        onError={() => {
          if (stage === 0 && url !== current) {
            console.warn(`[SafeImage] resized copy failed, trying original: ${current}`);
            setStage(1);
          } else if (fallbackSrc && current !== fallbackSrc) {
            setCurrent(fallbackSrc);
            setStage(0);
          } else {
            console.warn(`[SafeImage] ${current} failed, showing placeholder`);
            setBroken(true);
          }
        }}
      />
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