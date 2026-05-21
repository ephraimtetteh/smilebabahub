"use client";

// src/components/home/NewsTicker.tsx
// Slim breaking-news strip directly under the site header.

import Link from "next/link";
import { LATEST_NEWS } from "./home.constants";

export default function NewsTicker() {
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
          <div className="flex items-center gap-5 whitespace-nowrap animate-newsmarquee">
            {[...LATEST_NEWS, ...LATEST_NEWS].map((item, i) => (
              <Link
                key={`${item.slug}-${i}`}
                href={`/news/${item.slug}`}
                className="flex items-center gap-1.5 group flex-shrink-0"
              >
                <span
                  className={`w-5 h-5 rounded-full ${item.bg}
                  flex items-center justify-center text-[11px]`}
                >
                  {item.emoji}
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
        </div>

        <Link
          href="/news"
          className="text-[10px] text-gray-500 hover:text-yellow-600 font-bold
            whitespace-nowrap flex-shrink-0"
        >
          View all →
        </Link>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes newsmarquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-newsmarquee {
          animation: newsmarquee 60s linear infinite;
          width: max-content;
        }
        .animate-newsmarquee:hover { animation-play-state: paused; }
      `,
        }}
      />
    </div>
  );
}
