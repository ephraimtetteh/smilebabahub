"use client";
// src/components/SafeImage.tsx
// Drop-in replacement for next/image that handles Cloudinary 404s gracefully.
//
// When a Cloudinary image doesn't exist, the browser gets a 404 directly
// (via our custom cloudinaryLoader — no server proxy). SafeImage catches
// the error with onError and renders a clean placeholder instead of a
// broken image icon.
//
// Usage — same API as next/image:
//   <SafeImage src={ad.images?.[0]?.url} alt={ad.title} fill className="object-cover" />
//   <SafeImage src={user.profilePicture} alt="avatar" width={40} height={40} />

import React, { useState } from "react";
import Image, { ImageProps } from "next/image";
import { ImageOff } from "lucide-react";

type SafeImageProps = Omit<ImageProps, "src"> & {
  src?: string | null; // allow null/undefined — shows placeholder
  fallbackClassName?: string; // extra classes on the fallback container
  fallbackIcon?: React.ReactNode; // custom fallback icon
};

export default function SafeImage({
  src,
  alt = "",
  fallbackClassName = "",
  fallbackIcon,
  className = "",
  ...props
}: SafeImageProps) {
  const [errored, setErrored] = useState(false);

  const showFallback = errored || !src || src.trim() === "";

  if (showFallback) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-100 w-full h-full
          ${fallbackClassName}`}
        role="img"
        aria-label={alt || "Image unavailable"}
      >
        {fallbackIcon ?? <ImageOff size={24} className="text-gray-300" />}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      onError={() => setErrored(true)}
      // Prevent Next.js from throwing on 404 — we handle it via onError
      unoptimized={false}
      {...props}
    />
  );
}
