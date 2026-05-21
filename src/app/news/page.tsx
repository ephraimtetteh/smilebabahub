"use client";

// src/app/news/page.tsx — news index page

import { useState } from "react";
import Link from "next/link";
import { Newspaper, Filter, Clock, ChevronLeft } from "lucide-react";
import { LATEST_NEWS } from "@/src/components/home/home.constants";

const CATEGORIES = [
  "All",
  "Economy",
  "Jobs",
  "Trade",
  "Sports",
  "Tech",
  "Politics",
];

export default function NewsPage() {
  const [active, setActive] = useState("All");

  const filtered =
    active === "All"
      ? LATEST_NEWS
      : LATEST_NEWS.filter((n) => n.category === active);

  return (
    <main className="bg-gray-50 min-h-screen">
      {/* Yellow hero */}
      <div className="bg-gradient-to-r from-yellow-400 to-amber-500">
        <div className="max-w-[1340px] mx-auto px-3 sm:px-4 py-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-xs text-black/70
              hover:text-black mb-3 font-medium"
          >
            <ChevronLeft size={14} /> Back to home
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center">
              <Newspaper size={22} className="text-yellow-400" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-black">
                Latest News
              </h1>
              <p className="text-xs text-black/70">
                Stay updated on business, economy, and culture across Africa
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-[1340px] mx-auto px-3 sm:px-4 py-3">
          <div
            className="flex items-center gap-2 overflow-x-auto"
            style={{ scrollbarWidth: "none" }}
          >
            <Filter size={14} className="text-gray-400 flex-shrink-0" />
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold
                  whitespace-nowrap transition
                  ${
                    active === cat
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Articles grid */}
      <div className="max-w-[1340px] mx-auto px-3 sm:px-4 py-6">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <Newspaper size={48} className="text-gray-200 mx-auto mb-3" />
            <p className="text-sm text-gray-400">
              No articles in {active} yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Featured article — first item, large emoji hero */}
            {filtered[0] && (
              <Link
                href={`/news/${filtered[0].slug}`}
                className={`sm:col-span-2 lg:col-span-3 relative ${filtered[0].bg}
                  rounded-2xl overflow-hidden group shadow-sm hover:shadow-xl
                  transition aspect-[2.5/1]`}
              >
                <div
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-[180px]
                  opacity-30 group-hover:opacity-50 transition"
                >
                  {filtered[0].emoji}
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                  <span
                    className="inline-block bg-black text-yellow-400 text-[10px]
                    font-black px-2 py-1 rounded mb-2"
                  >
                    {filtered[0].category}
                  </span>
                  <h2
                    className="text-xl sm:text-2xl font-black text-gray-900 leading-tight
                    max-w-2xl mb-1"
                  >
                    {filtered[0].title}
                  </h2>
                  {filtered[0].excerpt && (
                    <p className="text-sm text-gray-700 max-w-xl line-clamp-2 mb-2">
                      {filtered[0].excerpt}
                    </p>
                  )}
                  <p className="text-xs text-gray-600 flex items-center gap-1">
                    <Clock size={11} />
                    {new Date(filtered[0].date).toLocaleDateString("en-GH", {
                      dateStyle: "long",
                    })}
                  </p>
                </div>
              </Link>
            )}

            {/* Remaining articles */}
            {filtered.slice(1).map((article) => (
              <Link
                key={article.slug}
                href={`/news/${article.slug}`}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden
                  hover:shadow-lg hover:-translate-y-0.5 transition group"
              >
                <div
                  className={`relative aspect-[16/9] ${article.bg}
                  flex items-center justify-center overflow-hidden`}
                >
                  <span className="text-7xl group-hover:scale-110 transition">
                    {article.emoji}
                  </span>
                  <span
                    className="absolute top-2 left-2 bg-black text-yellow-400
                    text-[10px] font-black px-2 py-0.5 rounded"
                  >
                    {article.category}
                  </span>
                </div>
                <div className="p-4">
                  <h3
                    className="text-sm font-black text-gray-900 leading-snug mb-2
                    line-clamp-2 group-hover:text-yellow-600 transition"
                  >
                    {article.title}
                  </h3>
                  {article.excerpt && (
                    <p className="text-[11px] text-gray-500 line-clamp-2 mb-2">
                      {article.excerpt}
                    </p>
                  )}
                  <p className="text-[11px] text-gray-400 flex items-center gap-1">
                    <Clock size={10} />
                    {new Date(article.date).toLocaleDateString("en-GH", {
                      dateStyle: "medium",
                    })}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
