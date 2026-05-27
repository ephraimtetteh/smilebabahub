"use client";

// src/components/home/NewsCards.tsx
// MOBILE-ONLY horizontal news cards.
// Fetches from GET /smilebaba/news/ticker — same endpoint as NewsTicker.

import Link from "next/link";
import { useProducts } from "@/src/hooks/useProducts";
import { useNewsTicker } from "./useNewsTicker";

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function NewsCards() {
  const { userCountry } = useProducts();
  const { items, loading } = useNewsTicker(userCountry || undefined);

  // Don't render anything if no news
  if (!loading && items.length === 0) return null;

  return (
    <section className="lg:hidden bg-white">
      <div className="px-3 pt-3">
        <div className="flex items-center justify-between mb-2.5">
          <span
            className="bg-yellow-400 text-black text-[10px] font-black
            px-2 py-1 rounded uppercase tracking-wider"
          >
            Latest News
          </span>
          <Link
            href="/news"
            className="text-xs text-gray-700 font-bold
            flex items-center gap-1"
          >
            View all news →
          </Link>
        </div>

        <div
          className="flex gap-2.5 overflow-x-auto -mx-3 px-3 pb-3"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {loading
            ? [1, 2, 3, 4].map((i) => (
                <div key={i} className="w-36 flex-shrink-0 animate-pulse">
                  <div className="aspect-[4/3] bg-gray-100 rounded-xl mb-1.5" />
                  <div className="h-3 bg-gray-100 rounded w-3/4 mb-1" />
                  <div className="h-2 bg-gray-100 rounded w-1/3" />
                </div>
              ))
            : items.map((item) => (
                <Link
                  key={item.slug}
                  href={`/news/${item.slug}`}
                  className="w-36 flex-shrink-0 group"
                >
                  <div
                    className={`aspect-[4/3] ${item.coverBg ?? "bg-gray-100"} rounded-xl
                    flex items-center justify-center overflow-hidden mb-1.5
                    relative group-active:scale-95 transition`}
                  >
                    {item.coverImage ? (
                      <img
                        src={item.coverImage}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-5xl">
                        {item.coverEmoji ?? "📰"}
                      </span>
                    )}
                  </div>

                  <p
                    className="text-[11px] font-bold text-gray-900 leading-snug
                    line-clamp-2 mb-1"
                  >
                    {item.title}
                  </p>

                  <p className="text-[10px] text-gray-400">
                    {timeAgo(item.publishedAt)}
                  </p>
                </Link>
              ))}
        </div>
      </div>
    </section>
  );
}
