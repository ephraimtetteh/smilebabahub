"use client";

// src/components/home/ProductCarousel.tsx
// Horizontal product carousel — used in the 3-column row on desktop and
// stacked on mobile. Cards are larger on mobile to match the design mockup.

import { useRef } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Star,
  MapPin,
} from "lucide-react";
import SafeImage from "@/src/components/SafeImage";

interface Props {
  title: string;
  items: any[];
  loading: boolean;
  viewAllHref: string;
  emptyHint: string;
  showBestSellerBadge?: boolean;
  showDiscount?: boolean;
}

export default function ProductCarousel({
  title,
  items,
  loading,
  viewAllHref,
  emptyHint,
  showBestSellerBadge = false,
  showDiscount = false,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -300 : 300,
      behavior: "smooth",
    });
  };

  return (
    <div
      className="bg-white border border-gray-100 rounded-2xl p-3 sm:p-4 h-full
      flex flex-col"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs sm:text-sm font-black text-gray-900 tracking-wide truncate">
          {title}
        </h3>
        <Link
          href={viewAllHref}
          className="text-xs text-blue-600 hover:underline font-bold flex-shrink-0 ml-2"
        >
          View all →
        </Link>
      </div>

      {loading && (
        <div className="flex gap-2 overflow-hidden">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-32 sm:w-36 flex-shrink-0 animate-pulse">
              <div className="aspect-square bg-gray-100 rounded-lg mb-1.5" />
              <div className="h-2.5 bg-gray-100 rounded w-3/4 mb-1" />
              <div className="h-2.5 bg-gray-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      )}

      {!loading && items.length === 0 && (
        <div className="flex-1 flex items-center justify-center py-8">
          <p className="text-xs text-gray-400 text-center px-4">{emptyHint}</p>
        </div>
      )}

      {!loading && items.length > 0 && (
        <div className="relative flex-1">
          {/* Left chevron - hidden on mobile (use swipe) */}
          <button
            onClick={() => scroll("left")}
            className="hidden md:flex absolute -left-2 top-1/3 -translate-y-1/2
              w-7 h-7 bg-white shadow-lg border border-gray-100 rounded-full
              items-center justify-center z-10 hover:bg-yellow-50
              hover:border-yellow-200 transition"
          >
            <ChevronLeft size={14} />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-2.5 overflow-x-auto scroll-smooth pb-2 -mx-1 px-1"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {items.slice(0, 12).map((p: any) => {
              const sym = p.currency === "NGN" ? "₦" : "₵";
              const isBestSeller =
                p.isBoosted ||
                (p.planPriority ?? 0) >= 2 ||
                (p.views ?? 0) > 100;

              return (
                <Link
                  key={p._id}
                  href={`/ads/${p._id}`}
                  className="w-32 sm:w-36 flex-shrink-0 group"
                >
                  <div
                    className="relative aspect-square rounded-xl overflow-hidden
                    bg-gray-100 mb-2"
                  >
                    {p.coverImage ? (
                      <SafeImage
                        src={p.coverImage}
                        alt={p.title}
                        fill
                        sizes="(max-width:640px) 128px, 144px"
                        className="object-cover group-hover:scale-105 transition"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag size={24} className="text-gray-200" />
                      </div>
                    )}

                    {showBestSellerBadge && isBestSeller && (
                      <span
                        className="absolute top-1 left-1 bg-yellow-400
                        text-black text-[9px] font-black px-1.5 py-0.5 rounded-full
                        flex items-center gap-0.5"
                      >
                        <Star size={7} fill="currentColor" /> Best Seller
                      </span>
                    )}

                    {showDiscount &&
                      p.originalPrice &&
                      p.originalPrice > p.price && (
                        <span
                          className="absolute top-1 right-1 bg-red-500 text-white
                        text-[9px] font-black px-1.5 py-0.5 rounded-full"
                        >
                          -{Math.round((1 - p.price / p.originalPrice) * 100)}%
                        </span>
                      )}
                  </div>

                  <p className="text-xs font-bold text-gray-900 truncate leading-tight">
                    {p.title}
                  </p>

                  <p className="text-[10px] text-gray-400 truncate mt-0.5">
                    {p.location?.city ?? p.country ?? "—"}
                  </p>

                  <p className="text-xs font-black text-gray-900 mt-0.5">
                    {sym}
                    {Number(p.price ?? 0).toLocaleString()}
                  </p>

                  <div className="flex items-center gap-0.5 mt-0.5">
                    <Star
                      size={9}
                      className="text-yellow-400 fill-yellow-400"
                    />
                    <span className="text-[10px] text-gray-500">
                      {(p.rating ?? 4.5).toFixed(1)}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          <button
            onClick={() => scroll("right")}
            className="hidden md:flex absolute -right-2 top-1/3 -translate-y-1/2
              w-7 h-7 bg-white shadow-lg border border-gray-100 rounded-full
              items-center justify-center z-10 hover:bg-yellow-50
              hover:border-yellow-200 transition"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
