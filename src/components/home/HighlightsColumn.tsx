"use client";

// src/components/home/HighlightsColumn.tsx
// Right column of the homepage hero row.
//
// Two animated highlight blocks:
//   1. FOOD HIGHLIGHTS — live products, country-scoped, plan-priority sorted
//   2. NEWS HIGHLIGHTS — latest articles, auto-rotating
//
// Both blocks rotate items every ~4 seconds with a slide-in animation so
// the column feels alive without the user needing to scroll.

import { useState, useEffect } from "react";
import Link from "next/link";
import SafeImage from "@/src/components/SafeImage";
import { ShoppingBag, ArrowRight, Clock } from "lucide-react";
import { useProducts } from "@/src/hooks/useProducts";
import { LATEST_NEWS } from "./home.constants";

// ── Auto-rotating highlight: shows N items at a time, rotates window ───────
function useRotatingWindow<T>(
  items: T[],
  windowSize: number,
  intervalMs = 4000,
) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (items.length <= windowSize) return;
    const id = setInterval(() => {
      setOffset((prev) => (prev + 1) % items.length);
    }, intervalMs);
    return () => clearInterval(id);
  }, [items.length, windowSize, intervalMs]);

  if (items.length <= windowSize) return items;
  // Take the windowSize items starting at offset, wrapping around
  return Array.from(
    { length: windowSize },
    (_, i) => items[(offset + i) % items.length],
  );
}

// ── FOOD HIGHLIGHTS — country-scoped live data ─────────────────────────────
function FoodHighlights() {
  const { featured, loadFeatured, userCountry, userCurrency } = useProducts();
  const sym = userCurrency === "NGN" ? "₦" : "₵";

  useEffect(() => {
    if (userCountry) loadFeatured(userCountry, "food");
  }, [userCountry, loadFeatured]);

  const all = featured?.food ?? [];
  const visible = useRotatingWindow(all, 3, 4500);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-[11px] font-black text-gray-900 tracking-wider">
          FOOD HIGHLIGHTS
        </h3>
        <Link
          href="/ads?category=food"
          className="text-[11px] text-gray-500 hover:text-yellow-600 font-bold"
        >
          View all →
        </Link>
      </div>

      <div className="space-y-2">
        {all.length === 0
          ? // Skeleton
            [0, 1, 2].map((i) => (
              <div
                key={i}
                className="bg-white border border-gray-100 rounded-xl
              p-2.5 flex items-center gap-2.5 animate-pulse"
              >
                <div className="w-14 h-14 bg-gray-100 rounded-lg" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 bg-gray-100 rounded w-3/4" />
                  <div className="h-2 bg-gray-100 rounded w-1/2" />
                  <div className="h-3 bg-gray-100 rounded w-1/3" />
                </div>
              </div>
            ))
          : visible.map((p: any, i) => {
              const price = sym + Number(p.price ?? 0).toLocaleString();
              return (
                <Link
                  key={`${p._id}-${i}`}
                  href={`/ads/${p._id}`}
                  className="bg-white border border-gray-100 rounded-xl p-2.5
                  flex items-center gap-2.5 hover:shadow-md hover:border-yellow-200
                  transition group animate-fadeslide"
                >
                  <div className="w-14 h-14 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 relative">
                    {p.coverImage ? (
                      <SafeImage
                        src={p.coverImage}
                        alt={p.title}
                        fill
                        sizes="56px"
                        className="object-cover group-hover:scale-105 transition"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag size={18} className="text-gray-300" />
                      </div>
                    )}
                    {p.isBoosted && (
                      <span
                        className="absolute top-0.5 left-0.5 bg-yellow-400
                      text-black text-[8px] font-black px-1 rounded"
                      >
                        ⚡
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black text-gray-900 truncate">
                      {p.title}
                    </p>
                    <p className="text-[10px] text-gray-500 truncate">
                      {p.location?.city ?? p.country ?? ""}
                    </p>
                    <p className="text-xs font-black text-yellow-600 mt-0.5">
                      {price}
                    </p>
                  </div>
                </Link>
              );
            })}

        <Link
          href="/ads?category=food"
          className="flex items-center justify-center gap-1 bg-yellow-400
            hover:bg-yellow-300 text-black text-xs font-black py-2.5
            rounded-xl transition group"
        >
          Order Food{" "}
          <ArrowRight
            size={12}
            className="group-hover:translate-x-0.5 transition"
          />
        </Link>
      </div>
    </div>
  );
}

// ── NEWS HIGHLIGHTS — auto-rotating preview ────────────────────────────────
function NewsHighlights() {
  const visible = useRotatingWindow(LATEST_NEWS, 3, 5000);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-[11px] font-black text-gray-900 tracking-wider">
          NEWS HIGHLIGHTS
        </h3>
        <Link
          href="/news"
          className="text-[11px] text-gray-500 hover:text-yellow-600 font-bold"
        >
          View all →
        </Link>
      </div>

      <div className="space-y-2">
        {visible.map((n, i) => (
          <Link
            key={`${n.slug}-${i}`}
            href={`/news/${n.slug}`}
            className="bg-white border border-gray-100 rounded-xl p-2.5
              flex items-center gap-2.5 hover:shadow-md hover:border-yellow-200
              transition group animate-fadeslide"
          >
            <div
              className={`w-14 h-14 ${n.bg} rounded-lg flex items-center
              justify-center flex-shrink-0 text-2xl group-hover:scale-105 transition`}
            >
              {n.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <span
                className="inline-block bg-gray-100 text-gray-700 text-[9px]
                font-black px-1.5 py-0.5 rounded mb-1"
              >
                {n.category}
              </span>
              <p className="text-[11px] font-bold text-gray-900 line-clamp-2 leading-tight">
                {n.title}
              </p>
              <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                <Clock size={9} />
                {new Date(n.date).toLocaleDateString("en-GH", {
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
          </Link>
        ))}

        <Link
          href="/news"
          className="flex items-center justify-center gap-1 bg-gray-900
            hover:bg-gray-800 text-white text-xs font-black py-2.5
            rounded-xl transition group"
        >
          Read News{" "}
          <ArrowRight
            size={12}
            className="group-hover:translate-x-0.5 transition"
          />
        </Link>
      </div>
    </div>
  );
}

// ── Export — both stacked ──────────────────────────────────────────────────
export default function HighlightsColumn() {
  return (
    <div className="space-y-5">
      <FoodHighlights />
      <NewsHighlights />

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes fadeslide {
          0%   { opacity: 0; transform: translateY(8px); }
          100% { opacity: 1; transform: translateY(0);  }
        }
        .animate-fadeslide {
          animation: fadeslide 500ms ease-out;
        }
      `,
        }}
      />
    </div>
  );
}
