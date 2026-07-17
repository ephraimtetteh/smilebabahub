"use client";

// src/components/promote/ActivePromotions.tsx
//
// Compact vertical list of live promotions — same visual style as
// FoodHighlights. Cycles through all live campaigns 3 at a time with
// a soft slide animation, so a small sidebar spot surfaces many
// businesses over time.

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Play, Eye, Sparkles } from "lucide-react";
import axiosInstance from "@/src/lib/api/axios";
import  SafeImage  from "@/src/components/SafeImage";

// ─── Types ─────────────────────────────────────────────────────────
interface LivePromo {
  _id: string;
  businessName: string;
  title?: string;
  category?: string;
  coverImage?: string;
  thumbnailUrl?: string;
  tier: string;
  country: string;
  views: number;
  liveAt?: string;
}

// ─── Rotating window hook ──────────────────────────────────────────
// If you already have this at src/lib/hooks/useRotatingWindow.ts,
// delete this local copy and import from there instead.
function useRotatingWindow<T>(
  items: T[],
  size: number,
  intervalMs: number,
): T[] {
  const [start, setStart] = useState(0);

  useEffect(() => {
    if (items.length <= size) return;
    const id = setInterval(() => {
      setStart((s) => (s + 1) % items.length);
    }, intervalMs);
    return () => clearInterval(id);
  }, [items.length, size, intervalMs]);

  return useMemo(() => {
    if (items.length === 0) return [];
    if (items.length <= size) return items;
    const out: T[] = [];
    for (let i = 0; i < size; i++) out.push(items[(start + i) % items.length]);
    return out;
  }, [items, start, size]);
}

// ═══════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════
export function ActivePromotions({
  country,
  limit = 12,
  windowSize = 3,
  rotateMs = 4500,
}: {
  country?: string;
  limit?: number;
  windowSize?: number;
  rotateMs?: number;
}) {
  const [promos, setPromos] = useState<LivePromo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams({ limit: String(limit) });
    if (country) params.set("country", country);

    axiosInstance
      .get(`/promote/active?${params}`)
      .then((r) => setPromos(r.data.promotions ?? []))
      .catch((e) => console.warn("[ActivePromotions]", e?.message))
      .finally(() => setLoading(false));
  }, [country, limit]);

  const visible = useRotatingWindow(promos, windowSize, rotateMs);

  // Silent hide when there's nothing live
  if (!loading && promos.length === 0) return null;

  return (
    <div>
      {/* ─── Header ─── */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-[11px] font-black text-gray-900 tracking-wider flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1 bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded">
            <span className="w-1 h-1 bg-white rounded-full animate-pulse" />{" "}
            LIVE
          </span>
          FEATURED PROMOTIONS
        </h3>
        <Link
          href="/promote/live"
          className="text-[11px] text-gray-500 hover:text-yellow-600 font-bold"
        >
          View all →
        </Link>
      </div>

      {/* ─── List ─── */}
      <div className="space-y-2">
        {loading
          ? // Skeleton
            [0, 1, 2].map((i) => (
              <div
                key={i}
                className="bg-white border border-gray-100 rounded-xl p-2.5 flex items-center gap-2.5 animate-pulse"
              >
                <div className="w-14 h-14 bg-gray-100 rounded-lg" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 bg-gray-100 rounded w-3/4" />
                  <div className="h-2 bg-gray-100 rounded w-1/2" />
                  <div className="h-3 bg-gray-100 rounded w-1/3" />
                </div>
              </div>
            ))
          : visible.map((p, i) => {
              const image = p.coverImage || p.thumbnailUrl;
              return (
                <Link
                  key={`${p._id}-${i}`}
                  href={`/promote/${p._id}`}
                  className="bg-white border border-gray-100 rounded-xl p-2.5
                  flex items-center gap-2.5 hover:shadow-md hover:border-yellow-200
                  transition group animate-fadeslide"
                >
                  {/* Thumbnail */}
                  <div className="w-14 h-14 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 relative">
                    {image ? (
                      <SafeImage
                        src={image}
                        alt={p.businessName}
                        fill
                        sizes="56px"
                        className="object-cover group-hover:scale-105 transition"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Play
                          size={16}
                          className="text-gray-300"
                          fill="currentColor"
                        />
                      </div>
                    )}
                    {/* Live dot badge */}
                    <span
                      className="absolute top-0.5 left-0.5 bg-red-500 text-white
                    text-[8px] font-black px-1 rounded flex items-center gap-0.5"
                    >
                      <span className="w-0.5 h-0.5 bg-white rounded-full animate-pulse" />
                      LIVE
                    </span>
                    {/* Play overlay on hover */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/25 transition">
                      <Play
                        size={14}
                        className="text-white opacity-0 group-hover:opacity-100 transition drop-shadow-lg"
                        fill="currentColor"
                      />
                    </div>
                  </div>

                  {/* Meta */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black text-gray-900 truncate">
                      {p.businessName}
                    </p>
                    <p className="text-[10px] text-gray-500 truncate">
                      {p.title || p.category || "On air now"}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {p.views > 0 && (
                        <span className="text-[10px] text-gray-500 flex items-center gap-0.5">
                          <Eye size={9} /> {formatViews(p.views)}
                        </span>
                      )}
                      {p.category && (
                        <span className="text-[9px] font-black text-yellow-700 bg-yellow-50 px-1.5 py-0.5 rounded truncate">
                          {p.category}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}

        {/* Bottom CTA */}
        <Link
          href="/promote"
          className="flex items-center justify-center gap-1 bg-yellow-400
            hover:bg-yellow-300 text-black text-xs font-black py-2.5
            rounded-xl transition group"
        >
          <Sparkles size={12} className="text-black" />
          Promote your business
          <ArrowRight
            size={12}
            className="group-hover:translate-x-0.5 transition"
          />
        </Link>
      </div>
    </div>
  );
}

// ─── Helpers ───────────────────────────────────────────────────────
function formatViews(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return String(n);
}
