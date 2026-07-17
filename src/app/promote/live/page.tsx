"use client";

// frontend/src/app/promote/live/page.tsx
//
// Public grid page listing every live promotion. Reached from:
//   - "View all →" link in the ActivePromotions homepage row
//   - Direct navigation / SEO landing
//   - Category tags on the /promote/[id] detail page

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ChevronLeft,
  Play,
  Eye,
  Sparkles,
  Loader2,
  Search,
  ChevronDown,
  X,
  ArrowRight,
} from "lucide-react";
import axiosInstance from "@/src/lib/api/axios";

interface LivePromo {
  _id: string;
  businessName: string;
  title?: string;
  description?: string;
  category?: string;
  coverImage?: string;
  thumbnailUrl?: string;
  videoUrl: string;
  tier: string;
  country: string;
  liveAt?: string;
  expiresAt?: string;
  views: number;
}

interface ApiResponse {
  promotions: LivePromo[];
  categories: string[];
  pagination: { page: number; limit: number; total: number; pages: number };
}

export default function LivePromotionsPage() {
  const router = useRouter();
  const search = useSearchParams();

  const [promos, setPromos] = useState<LivePromo[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  // Filters
  const [country, setCountry] = useState<"" | "Ghana" | "Nigeria">(
    (search.get("country") as any) ?? "",
  );
  const [category, setCategory] = useState<string>(
    search.get("category") ?? "",
  );
  const [q, setQ] = useState(search.get("q") ?? "");

  // Debounce search
  const [dq, setDq] = useState(q);
  useEffect(() => {
    const id = setTimeout(() => setDq(q), 300);
    return () => clearTimeout(id);
  }, [q]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [country, category, dq]);

  // Fetch
  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page),
      limit: "24",
    });
    if (country) params.set("country", country);
    if (category) params.set("category", category);
    if (dq) params.set("search", dq);

    axiosInstance
      .get<ApiResponse>(`/promote/active?${params}`)
      .then(({ data }) => {
        setPromos(data.promotions);
        setCategories(data.categories);
        setTotal(data.pagination.total);
        setPages(data.pagination.pages);
      })
      .catch((e) => console.warn("[live] load failed:", e))
      .finally(() => setLoading(false));
  }, [page, country, category, dq]);

  const clearFilters = () => {
    setCountry("");
    setCategory("");
    setQ("");
  };

  const anyFilterActive = country || category || q;

  return (
    <main className="min-h-screen bg-gray-50">
      {/* ─── Hero ─── */}
      <section className="bg-gradient-to-br from-orange-600 via-red-600 to-pink-700 text-white">
        <div className="max-w-[1340px] mx-auto px-3 sm:px-4 py-8 sm:py-10">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-xs text-white/70 hover:text-white mb-3 font-medium"
          >
            <ChevronLeft size={14} /> Back to home
          </Link>

          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1 bg-red-500 border border-white/20 text-white text-[10px] font-black px-2 py-0.5 rounded">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />{" "}
                  LIVE NOW
                </span>
                {!loading && (
                  <span className="text-xs text-yellow-200 font-black">
                    {total} {total === 1 ? "business" : "businesses"} on air
                  </span>
                )}
              </div>
              <h1 className="text-3xl sm:text-4xl font-black leading-tight">
                Featured on SmileBaba
              </h1>
              <p className="mt-2 text-sm text-white/80 max-w-lg">
                Every business promoting right now across TV, Radio, Social, and
                our web platform.
              </p>
            </div>

            <Link
              href="/promote"
              className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-black font-black px-5 py-3 rounded-2xl text-sm shadow-xl active:scale-95"
            >
              <Sparkles size={14} /> Promote yours
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Filters ─── */}
      <section className="bg-white border-b border-gray-100 sticky top-0 z-20">
        <div className="max-w-[1340px] mx-auto px-3 sm:px-4 py-3">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Search */}
            <div className="relative flex-1 min-w-[180px] max-w-md">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search businesses, campaigns…"
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-sm bg-gray-50 focus:bg-white focus:border-yellow-400 outline-none"
              />
            </div>

            {/* Country */}
            <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
              {[
                { v: "", label: "All" },
                { v: "Ghana", label: "🇬🇭" },
                { v: "Nigeria", label: "🇳🇬" },
              ].map((c) => (
                <button
                  key={c.v}
                  onClick={() => setCountry(c.v as any)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-black ${
                    country === c.v
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Category */}
            {categories.length > 0 && (
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2 rounded-xl border border-gray-200 text-xs font-black text-gray-700 bg-white outline-none focus:border-yellow-400 cursor-pointer"
                >
                  <option value="">All categories</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={12}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
            )}

            {/* Clear */}
            {anyFilterActive && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-black text-gray-500 hover:text-gray-900 hover:bg-gray-100"
              >
                <X size={12} /> Clear
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ─── Grid ─── */}
      <div className="max-w-[1340px] mx-auto px-3 sm:px-4 py-6 sm:py-8">
        {loading ? (
          <div className="py-16 flex justify-center">
            <Loader2 size={32} className="animate-spin text-yellow-500" />
          </div>
        ) : promos.length === 0 ? (
          <EmptyState
            anyFilterActive={!!anyFilterActive}
            onClear={clearFilters}
          />
        ) : (
          <>
            {/* Result count */}
            <p className="text-xs text-gray-500 mb-4">
              Showing{" "}
              <strong className="text-gray-900">
                {(page - 1) * 24 + 1}–{Math.min(page * 24, total)}
              </strong>{" "}
              of <strong className="text-gray-900">{total}</strong> live
              promotion{total === 1 ? "" : "s"}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {promos.map((p) => (
                <PromoCard key={p._id} promo={p} />
              ))}
            </div>

            {/* Pagination */}
            {pages > 1 && (
              <Pagination page={page} pages={pages} onChange={setPage} />
            )}
          </>
        )}
      </div>

      {/* ─── Bottom CTA ─── */}
      <section className="bg-gray-900 text-white mt-8">
        <div className="max-w-[1340px] mx-auto px-3 sm:px-4 py-10 text-center">
          <h2 className="text-2xl sm:text-3xl font-black mb-2">
            Ready to join them?
          </h2>
          <p className="text-sm text-gray-400 max-w-md mx-auto mb-5">
            Get your business featured across TV, Radio, Social, and here on the
            web.
          </p>
          <Link
            href="/promote"
            className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-black font-black px-6 py-3 rounded-2xl text-sm shadow-xl active:scale-95"
          >
            <Sparkles size={14} /> See pricing
          </Link>
        </div>
      </section>
    </main>
  );
}

// ─── Card ────────────────────────────────────────────────────────────
function PromoCard({ promo }: { promo: LivePromo }) {
  const image = promo.coverImage || promo.thumbnailUrl;
  const daysLeft = promo.expiresAt
    ? Math.max(
        0,
        Math.ceil(
          (new Date(promo.expiresAt).getTime() - Date.now()) / 86400000,
        ),
      )
    : null;

  return (
    <Link
      href={`/promote/${promo._id}`}
      className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl hover:-translate-y-0.5 transition group block"
    >
      {/* Cover */}
      <div className="relative aspect-video bg-gray-900">
        {image ? (
          <img
            src={image}
            alt={promo.businessName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-3xl bg-gradient-to-br from-gray-800 to-gray-900">
            📺
          </div>
        )}

        {/* Play overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/30 transition">
          <div className="w-11 h-11 sm:w-12 sm:h-12 bg-white/95 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition">
            <Play
              size={18}
              className="text-gray-900 ml-1"
              fill="currentColor"
            />
          </div>
        </div>

        {/* Live badge */}
        <div className="absolute top-2 left-2">
          <span className="inline-flex items-center gap-1 bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded">
            <span className="w-1 h-1 bg-white rounded-full" /> LIVE
          </span>
        </div>

        {/* Views */}
        {promo.views > 0 && (
          <div className="absolute bottom-2 right-2">
            <span className="inline-flex items-center gap-1 bg-black/60 backdrop-blur text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
              <Eye size={9} /> {formatViews(promo.views)}
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-3 sm:p-4">
        <div className="font-black text-sm text-gray-900 truncate">
          {promo.businessName}
        </div>
        {promo.title && (
          <div className="text-xs text-gray-500 mt-0.5 line-clamp-1">
            {promo.title}
          </div>
        )}
        {promo.description && (
          <div className="text-[11px] text-gray-500 mt-1 line-clamp-2 hidden sm:block">
            {promo.description}
          </div>
        )}

        <div className="mt-2 flex items-center justify-between gap-2">
          {promo.category && (
            <span className="text-[9px] font-black text-yellow-700 bg-yellow-50 px-1.5 py-0.5 rounded truncate">
              {promo.category}
            </span>
          )}
          {daysLeft !== null && daysLeft > 0 && (
            <span className="text-[9px] font-black text-gray-400 flex-shrink-0">
              {daysLeft}d left
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

// ─── Pagination ──────────────────────────────────────────────────────
function Pagination({
  page,
  pages,
  onChange,
}: {
  page: number;
  pages: number;
  onChange: (p: number) => void;
}) {
  // Generate page numbers to show: current, ±2 around, first, last
  const numbers = useMemo(() => {
    const set = new Set<number>();
    set.add(1);
    set.add(pages);
    for (let i = Math.max(1, page - 2); i <= Math.min(pages, page + 2); i++)
      set.add(i);
    return Array.from(set).sort((a, b) => a - b);
  }, [page, pages]);

  return (
    <div className="mt-8 flex items-center justify-center gap-1 flex-wrap">
      <button
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        className="px-3 py-2 rounded-lg border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        ← Prev
      </button>

      {numbers.map((n, i) => {
        const prev = numbers[i - 1];
        const gap = prev !== undefined && n - prev > 1;
        return (
          <div key={n} className="flex items-center gap-1">
            {gap && <span className="text-gray-400 px-1">…</span>}
            <button
              onClick={() => onChange(n)}
              className={`min-w-[36px] px-2 py-2 rounded-lg text-xs font-black ${
                page === n
                  ? "bg-gray-900 text-yellow-400"
                  : "border border-gray-200 text-gray-700 hover:bg-gray-100"
              }`}
            >
              {n}
            </button>
          </div>
        );
      })}

      <button
        disabled={page === pages}
        onClick={() => onChange(page + 1)}
        className="px-3 py-2 rounded-lg border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Next →
      </button>
    </div>
  );
}

// ─── Empty state ─────────────────────────────────────────────────────
function EmptyState({
  anyFilterActive,
  onClear,
}: {
  anyFilterActive: boolean;
  onClear: () => void;
}) {
  if (anyFilterActive) {
    return (
      <div className="py-16 text-center">
        <div className="text-4xl mb-3">🔍</div>
        <h3 className="text-lg font-black text-gray-900 mb-1">
          No promotions match those filters
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Try broadening your search or clearing the filters.
        </p>
        <button
          onClick={onClear}
          className="inline-flex items-center gap-1 text-xs font-black text-yellow-700 hover:underline"
        >
          Clear filters
        </button>
      </div>
    );
  }

  return (
    <div className="py-12 text-center bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-3xl">
      <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-3">
        <Sparkles size={26} className="text-black" />
      </div>
      <h3 className="text-xl font-black text-gray-900 mb-1">
        Be the first business here
      </h3>
      <p className="text-sm text-gray-600 max-w-md mx-auto mb-4">
        No businesses promoting right now — this spot is wide open. Get yours
        featured for as little as GHC 749.
      </p>
      <Link
        href="/promote"
        className="inline-flex items-center gap-2 bg-black hover:bg-gray-800 text-yellow-400 font-black px-5 py-2.5 rounded-2xl text-sm"
      >
        <Sparkles size={14} /> Launch a campaign
        <ArrowRight size={12} />
      </Link>
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────
function formatViews(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return String(n);
}
