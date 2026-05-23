"use client";

// src/components/home/NewsCards.tsx
// MOBILE-ONLY: horizontal scrolling news cards with thumbnails matching the mockup.
// Each card shows: emoji-tile image, title, time-ago label.

import Link from "next/link";
import { LATEST_NEWS } from "./home.constants";

// Convert YYYY-MM-DD into "Xh ago" / "Xd ago" relative time
function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function NewsCards() {
  return (
    <section className="lg:hidden bg-white mt-20">
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

        {/* Horizontal scrolling cards */}
        <div
          className="flex gap-2.5 overflow-x-auto -mx-3 px-3 pb-3"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {LATEST_NEWS.map((item) => (
            <Link
              key={item.slug}
              href={`/news/${item.slug}`}
              className="w-36 flex-shrink-0 group"
            >
              {/* Thumbnail tile */}
              <div
                className={`aspect-[4/3] ${item.bg} rounded-xl
                flex items-center justify-center overflow-hidden mb-1.5
                relative group-active:scale-95 transition`}
              >
                <span className="text-5xl">{item.emoji}</span>
              </div>

              {/* Title */}
              <p
                className="text-[11px] font-bold text-gray-900 leading-snug
                line-clamp-2 mb-1"
              >
                {item.title}
              </p>

              {/* Time ago */}
              <p className="text-[10px] text-gray-400">{timeAgo(item.date)}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
