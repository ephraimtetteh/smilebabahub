"use client";

// src/components/home/ProductCarousel.tsx
// Horizontal scrolling carousel — uses the same product priority as everywhere else
// (boost → active → plan tier → recency).

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
      left: dir === "left" ? -400 : 400,
      behavior: "smooth",
    });
  };

  return (
    <section className="max-w-[1340px] mx-auto px-3 sm:px-4 py-3">
      <div className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-black text-gray-900 tracking-wide">
            {title}
          </h3>
          <Link
            href={viewAllHref}
            className="text-xs text-gray-500 hover:text-yellow-600 font-bold"
          >
            View all →
          </Link>
        </div>

        {loading && (
          <div
            className="flex gap-3 overflow-x-auto pb-2"
            style={{ scrollbarWidth: "none" }}
          >
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-44 flex-shrink-0 animate-pulse">
                <div className="aspect-square bg-gray-100 rounded-xl mb-2" />
                <div className="h-3 bg-gray-100 rounded w-3/4 mb-1.5" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        )}

        {!loading && items.length === 0 && (
          <div className="text-center py-10">
            <p className="text-sm text-gray-400">{emptyHint}</p>
          </div>
        )}

        {!loading && items.length > 0 && (
          <div className="relative">
            <button
              onClick={() => scroll("left")}
              className="absolute -left-3 top-1/3 -translate-y-1/2 w-8 h-8 bg-white
                shadow-lg border border-gray-100 rounded-full flex items-center
                justify-center z-10 hover:bg-yellow-50 hover:border-yellow-200 transition"
            >
              <ChevronLeft size={16} />
            </button>

            <div
              ref={scrollRef}
              className="flex gap-3 overflow-x-auto scroll-smooth pb-2"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {items.slice(0, 12).map((p: any) => {
                const sym = p.currency === "NGN" ? "₦" : "₵";
                const isBestSeller =
                  p.isBoosted || p.planPriority >= 2 || (p.views ?? 0) > 100;

                return (
                  <Link
                    key={p._id}
                    href={`/ads/${p._id}`}
                    className="w-44 flex-shrink-0 group"
                  >
                    <div
                      className="relative aspect-square rounded-xl
                      overflow-hidden bg-gray-100 mb-2"
                    >
                      {p.coverImage ? (
                        <SafeImage
                          src={p.coverImage}
                          alt={p.title}
                          fill
                          sizes="176px"
                          className="object-cover group-hover:scale-105 transition"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag size={28} className="text-gray-200" />
                        </div>
                      )}

                      {showBestSellerBadge && isBestSeller && (
                        <span
                          className="absolute top-1.5 left-1.5 bg-yellow-400
                          text-black text-[9px] font-black px-2 py-0.5 rounded-full
                          flex items-center gap-0.5"
                        >
                          <Star size={8} fill="currentColor" /> Best Seller
                        </span>
                      )}

                      {showDiscount &&
                        p.originalPrice &&
                        p.originalPrice > p.price && (
                          <span
                            className="absolute top-1.5 right-1.5 bg-red-500 text-white
                          text-[9px] font-black px-2 py-0.5 rounded-full"
                          >
                            -{Math.round((1 - p.price / p.originalPrice) * 100)}
                            %
                          </span>
                        )}
                    </div>

                    <p className="text-xs font-bold text-gray-900 truncate">
                      {p.title}
                    </p>

                    <div className="flex items-center gap-0.5 mt-0.5">
                      <MapPin
                        size={9}
                        className="text-gray-400 flex-shrink-0"
                      />
                      <p className="text-[10px] text-gray-400 truncate">
                        {p.location?.city ?? p.country ?? "—"}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-0.5">
                      <p className="text-xs font-black text-gray-900">
                        {sym}
                        {Number(p.price ?? 0).toLocaleString()}
                      </p>
                      <div className="flex items-center gap-0.5">
                        <Star
                          size={9}
                          className="text-yellow-400 fill-yellow-400"
                        />
                        <span className="text-[10px] text-gray-500">
                          {(p.rating ?? 4.5).toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            <button
              onClick={() => scroll("right")}
              className="absolute -right-3 top-1/3 -translate-y-1/2 w-8 h-8 bg-white
                shadow-lg border border-gray-100 rounded-full flex items-center
                justify-center z-10 hover:bg-yellow-50 hover:border-yellow-200 transition"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
