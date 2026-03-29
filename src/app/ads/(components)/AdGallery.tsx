"use client";
// src/components/ads/ProductDetail/AdGallery.tsx

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ImageOff } from "lucide-react";

interface AdImage {
  url: string;
  isCover?: boolean;
}

interface AdGalleryProps {
  images: AdImage[];
  title: string;
  boostBadge?: { label: string; cls: string } | null;
}

export default function AdGallery({
  images,
  title,
  boostBadge,
}: AdGalleryProps) {
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [activeThumb, setActiveThumb] = useState(0);

  useEffect(() => {
    if (images.length) {
      const cover = images.find((i) => i.isCover) ?? images[0];
      setMainImage(cover?.url ?? null);
    }
  }, [images]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Main image */}
      <div className="relative aspect-[4/3]">
        {mainImage ? (
          <Image
            src={mainImage}
            alt={title}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 60vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-50">
            <ImageOff size={52} className="text-gray-200" />
          </div>
        )}

        {boostBadge && (
          <span
            className={`absolute top-3 left-3 text-[11px] font-bold px-2.5
            py-1 rounded-full border ${boostBadge.cls}`}
          >
            {boostBadge.label}
          </span>
        )}

        {images.length > 1 && (
          <div
            className="absolute bottom-3 right-3 bg-black/60 text-white
            text-xs px-2.5 py-1 rounded-full"
          >
            {activeThumb + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 p-3 overflow-x-auto scrollbar-none">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => {
                setMainImage(img.url);
                setActiveThumb(i);
              }}
              className={`relative flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden
                border-2 transition-colors
                ${
                  i === activeThumb
                    ? "border-yellow-400"
                    : "border-transparent hover:border-gray-300"
                }`}
            >
              <Image
                src={img.url}
                alt={`thumb ${i}`}
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
