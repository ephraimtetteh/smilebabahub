"use client";
// src/components/SafeImage.tsx
// Drop-in replacement for next/image that handles Cloudinary 404s gracefully.
//
// When Cloudinary returns a 404 (deleted image, wrong path, storage limit hit),
// Next.js image optimiser throws "upstream image response failed" which crashes
// the page in production. This component catches the error and shows a clean
// placeholder instead.
//
// Usage — anywhere you'd use next/image:
//   import SafeImage from "@/src/components/SafeImage";
//   <SafeImage src={ad.coverImage} alt={ad.title} fill className="object-cover" />

import React, { useState } from "react";
import Image, { ImageProps } from "next/image";
import { ImageOff } from "lucide-react";

type SafeImageProps = ImageProps & {
  fallbackClassName?: string; // extra class on the fallback container
};

export default function SafeImage({
  src,
  alt,
  fallbackClassName = "",
  className = "",
  ...props
}: SafeImageProps) {
  const [errored, setErrored] = useState(false);

  // If the image 404s (Cloudinary deleted, etc.), show a placeholder
  if (errored || !src) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-100
          w-full h-full ${fallbackClassName}`}
        aria-label={alt ?? "Image unavailable"}
      >
        <ImageOff size={28} className="text-gray-300" />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      onError={() => setErrored(true)}
      {...props}
    />
  );
}
