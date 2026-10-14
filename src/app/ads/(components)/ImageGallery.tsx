"use client";

// src/components/ads/ImageGallery.tsx
import { memo, useState } from "react";
import Image from "next/image";
import { AdImage } from "@/src/types/ad.types";
import { ImageOff } from "lucide-react";

interface ImageGalleryProps {
  images: AdImage[];
  title: string;
}

const ImageGallery = memo(function ImageGallery({
  images,
  title,
}: ImageGalleryProps) {
  const [active, setActive] = useState(0);
  const list = images?.length ? images : [];

  if (!list.length) {
    return (
      <div className="aspect-[4/3] bg-gray-100 rounded-2xl flex items-center justify-center">
        <ImageOff size={40} className="text-gray-200" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100">
        <Image
          src={list[active].url}
          alt={`${title} — image ${active + 1}`}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 60vw"
          className="object-cover"
        />
        <div
          className="absolute bottom-3 right-3 bg-black/60 text-white text-xs
          px-2.5 py-1 rounded-full font-medium"
        >
          {active + 1} / {list.length}
        </div>
      </div>

      {/* Thumbnails */}
      {list.length > 1 && (
        <div className="flex gap-2 overflow-x-auto scrollbar-none">
          {list.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`relative flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden
                border-2 transition-colors
                ${i === active ? "border-yellow-400" : "border-transparent hover:border-gray-300"}`}
            >
              <Image
                src={img.url}
                alt={`thumbnail ${i + 1}`}
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
});

export default ImageGallery;
