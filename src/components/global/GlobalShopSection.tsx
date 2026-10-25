"use client";
// src/components/global/GlobalShopSection.tsx
//
// "SmileBaba Global" — the AliExpress catalogue as the main block on
// /ecommerce. Search, departments, sort, load more. Renders nothing at all
// until the backend reports the shop is switched on (keys set, kill switch
// off), so a missing key can't leave a broken section on the page.

import { useCallback, useEffect, useRef, useState } from "react";
import { Globe, Search, Loader2, X } from "lucide-react";
import GlobalProductCard from "./GlobalProductCard";
import {
  fetchGlobalStatus,
  fetchGlobalProducts,
  GLOBAL_DEPARTMENTS,
  type GlobalProduct,
  type GlobalSort,
} from "@/src/lib/aliexpress";

const SORTS: { id: GlobalSort; label: string }[] = [
  { id: "popular", label: "Best selling" },
  { id: "price_asc", label: "Price: low to high" },
  { id: "price_desc", label: "Price: high to low" },
];

export default function GlobalShopSection({ country }: { country?: string }) {
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");
  const [dept, setDept] = useState("all");
  const [sort, setSort] = useState<GlobalSort>("popular");
  const [items, setItems] = useState<GlobalProduct[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const req = useRef(0);

  useEffect(() => {
    fetchGlobalStatus().then(setEnabled);
  }, []);

  const q = query.trim() || GLOBAL_DEPARTMENTS.find((d) => d.id === dept)?.q || "";

  const load = useCallback(
    async (next = 1) => {
      const id = ++req.current;
      next === 1 ? setLoading(true) : setLoadingMore(true);
      setError(null);
      try {
        const res = await fetchGlobalProducts({ q, page: next, sort, country });
        if (id !== req.current) return;
        if (!res.enabled) setEnabled(false);
        setItems((prev) => {
          if (next === 1) return res.items;
          const seen = new Set(prev.map((p) => p.id));
          return [...prev, ...res.items.filter((p) => !seen.has(p.id))];
        });
        setPage(next);
        setHasMore(res.hasMore);
      } catch (err: any) {
        if (id === req.current) setError(err?.response?.data?.message ?? "Couldn't load products. Try again.");
      } finally {
        if (id === req.current) {
          setLoading(false);
          setLoadingMore(false);
        }
      }
    },
    [q, sort, country],
  );

  useEffect(() => {
    if (enabled) load(1);
  }, [enabled, load]);

  if (!enabled) return null;

  return (
    <section className="mt-8 overflow-hidden rounded-3xl bg-gray-900 p-4 sm:p-6">
      {/* Heading */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFC105]">
            <Globe size={20} className="text-gray-900" />
          </span>
          <div>
            <h2 className="text-xl font-extrabold tracking-tight text-white sm:text-2xl">
              SmileBaba <span className="text-[#FFC105]">Global</span>
            </h2>
            <p className="text-xs text-white/60 sm:text-sm">
              Millions of products, shipped to you via AliExpress
            </p>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setQuery(input);
          }}
          className="flex w-full items-center gap-2 rounded-full bg-white px-4 py-2.5 sm:w-96"
          role="search"
        >
          <Search size={16} className="text-gray-400" />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            maxLength={80}
            placeholder="Search millions of products…"
            aria-label="Search SmileBaba Global"
            className="flex-1 bg-transparent text-sm text-gray-900 outline-none"
          />
          {input && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => {
                setInput("");
                setQuery("");
              }}
            >
              <X size={15} className="text-gray-400" />
            </button>
          )}
        </form>
      </div>

      {/* Departments */}
      <div className="-mx-1 mt-4 flex gap-2 overflow-x-auto px-1 pb-1">
        {GLOBAL_DEPARTMENTS.map((d) => {
          const on = !query.trim() && dept === d.id;
          return (
            <button
              key={d.id}
              onClick={() => {
                setDept(d.id);
                setQuery("");
                setInput("");
              }}
              className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                on ? "bg-[#FFC105] text-gray-900" : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              {d.label}
            </button>
          );
        })}
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex gap-3">
          {SORTS.map((s) => (
            <button
              key={s.id}
              onClick={() => setSort(s.id)}
              className={`text-xs ${sort === s.id ? "font-bold text-[#FFC105] underline" : "text-white/60 hover:text-white"}`}
            >
              {s.label}
            </button>
          ))}
        </div>
        <p className="text-[11px] text-white/50">
          Approximate prices · you pay AliExpress at checkout · SmileBaba may earn a commission
        </p>
      </div>

      {/* Grid */}
      <div className="mt-4">
        {loading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="h-64 animate-pulse rounded-2xl bg-white/10" />
            ))}
          </div>
        ) : error ? (
          <p className="py-12 text-center text-sm text-red-300">{error}</p>
        ) : items.length === 0 ? (
          <p className="py-12 text-center text-sm text-white/60">
            Nothing found that ships to you. Try another search.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {items.map((it) => (
                <GlobalProductCard key={it.id} item={it} />
              ))}
            </div>
            {hasMore && (
              <div className="mt-5 text-center">
                <button
                  onClick={() => load(page + 1)}
                  disabled={loadingMore}
                  className="inline-flex items-center gap-2 rounded-full bg-[#FFC105] px-6 py-2.5 text-sm font-bold text-gray-900 hover:bg-yellow-300 disabled:opacity-60"
                >
                  {loadingMore && <Loader2 size={14} className="animate-spin" />}
                  Load more
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
