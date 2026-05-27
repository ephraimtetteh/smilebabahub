"use client";

// src/components/home/NewsTicker.tsx
// Slim breaking-news strip under the header (desktop).
// Fetches latest 5 articles from GET /smilebaba/news/ticker.

import Link from "next/link";
import { useProducts } from "@/src/hooks/useProducts";
import { useNewsTicker } from "./useNewsTicker";

export default function NewsTicker() {
  const { userCountry } = useProducts();
  const { items, loading } = useNewsTicker(userCountry || undefined);

  // Don't render anything if no news yet — saves layout space
  if (!loading && items.length === 0) return null;

  return (
    <div className="bg-white border-b border-gray-100 mt-20">
      <div
        className="max-w-[1340px] mx-auto px-3 sm:px-4 py-1.5
        flex items-center gap-3 min-h-[34px]"
      >
        <span
          className="bg-yellow-400 text-black text-[9px] font-black
          px-1.5 py-0.5 rounded uppercase tracking-wider flex-shrink-0"
        >
          Latest
        </span>

        <div className="flex-1 overflow-hidden">
          {loading ? (
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-3 w-32 bg-gray-100 rounded animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-5 whitespace-nowrap animate-newsmarquee">
              {[...items, ...items].map((item, i) => (
                <Link
                  key={`${item.slug}-${i}`}
                  href={`/news/${item.slug}`}
                  className="flex items-center gap-1.5 group flex-shrink-0"
                >
                  <span
                    className={`w-5 h-5 rounded-full ${item.coverBg ?? "bg-gray-100"}
                    flex items-center justify-center text-[11px] overflow-hidden`}
                  >
                    {item.coverImage ? (
                      <img
                        src={item.coverImage}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      (item.coverEmoji ?? "📰")
                    )}
                  </span>
                  <span
                    className="text-[11px] text-gray-700 group-hover:text-yellow-600
                    transition font-medium"
                  >
                    {item.title}
                  </span>
                  <span className="text-yellow-400 text-[10px]">•</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        <Link
          href="/news"
          className="text-[10px] text-gray-500 hover:text-yellow-600 font-bold
            whitespace-nowrap flex-shrink-0"
        >
          View all →
        </Link>
      </div>
    </div>
  );
}
