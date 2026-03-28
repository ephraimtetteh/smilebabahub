"use client";

// src/components/NewSearch.tsx
// Marketplace search bar — routes to /ads with correct params.
// Params match what adController.getAds accepts:
//   search, category, city, maxPrice, country (injected from Redux)
// Supports autocomplete suggestions from GET /ads/suggestions?q=&country=

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  MapPin,
  Tag,
  SlidersHorizontal,
  ArrowRight,
  Clock,
  TrendingUp,
} from "lucide-react";
import { useAppSelector } from "@/src/app/redux";
import axiosInstance from "@/src/lib/api/axios";

const CATEGORIES = [
  { value: "", label: "All categories" },
  { value: "marketplace", label: "Marketplace" },
  { value: "food", label: "Food" },
  { value: "apartments", label: "Apartments" },
];

type Suggestion = { label: string; category?: string; slug?: string };

export default function MarketplaceSearch() {
  const router = useRouter();
  const user = useAppSelector((s) => s.auth.user);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [sugLoading, setSugLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const country = user?.country;
  const currency = user?.currency ?? "GHS";
  const sym = currency === "NGN" ? "₦" : "₵";

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem("smileSearchHistory") ?? "[]",
      );
      setRecentSearches(saved.slice(0, 5));
    } catch {}
  }, []);

  // Autocomplete from backend
  const fetchSuggestions = useCallback(
    async (q: string) => {
      if (q.length < 2) {
        setSuggestions([]);
        return;
      }
      setSugLoading(true);
      try {
        const res = await axiosInstance.get("/ads/suggestions", {
          params: { q, ...(country && { country }) },
        });
        setSuggestions(res.data.suggestions ?? []);
      } catch {
        setSuggestions([]);
      } finally {
        setSugLoading(false);
      }
    },
    [country],
  );

  const handleQueryChange = (val: string) => {
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(val), 300);
  };

  const saveToHistory = (q: string) => {
    if (!q.trim()) return;
    try {
      const prev = JSON.parse(
        localStorage.getItem("smileSearchHistory") ?? "[]",
      ) as string[];
      const next = [q, ...prev.filter((s) => s !== q)].slice(0, 5);
      localStorage.setItem("smileSearchHistory", JSON.stringify(next));
      setRecentSearches(next);
    } catch {}
  };

  const buildUrl = (overrides: Record<string, string> = {}) => {
    const params = new URLSearchParams();
    const q = overrides.query ?? query.trim();
    const cat = overrides.category ?? category;
    const c = overrides.city ?? city.trim();
    const mp = overrides.maxPrice ?? maxPrice;

    if (q) params.set("search", q);
    if (cat) params.set("category", cat);
    if (c) params.set("city", c);
    if (mp) params.set("maxPrice", mp);
    if (country) params.set("country", country);

    return `/ads?${params.toString()}`;
  };

  const handleSearch = (overrides: Record<string, string> = {}) => {
    const q = overrides.query ?? query.trim();
    if (q) saveToHistory(q);
    setOpen(false);
    router.push(buildUrl(overrides));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
    if (e.key === "Escape") setOpen(false);
  };

  const handleClear = () => {
    setQuery("");
    setCategory("");
    setCity("");
    setMaxPrice("");
    setSuggestions([]);
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className="w-full flex justify-center px-3 mb-6">
      <div className="w-full max-w-6xl">
        {/* ── Collapsed pill ── */}
        {!open && (
          <div
            onClick={() => setOpen(true)}
            className="bg-white shadow-md rounded-full px-5 py-3 flex items-center
              justify-between cursor-pointer hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-2 text-gray-400">
              <Search size={16} />
              <span className="text-sm">
                Search products, food, apartments
                {country ? ` in ${country}` : ""}…
              </span>
            </div>
            <div className="flex items-center gap-2">
              {country && (
                <span
                  className="hidden sm:flex items-center gap-1 text-xs
                  text-gray-400 bg-gray-50 px-2 py-1 rounded-full border border-gray-100"
                >
                  <MapPin size={11} />
                  {country}
                </span>
              )}
              <div className="bg-[#ffc105] p-2 rounded-full">
                <Search size={16} className="text-black" />
              </div>
            </div>
          </div>
        )}

        {/* ── Expanded panel ── */}
        {open && (
          <div
            className="bg-white shadow-xl rounded-3xl overflow-visible
            border border-gray-100 transition-all duration-200"
          >
            {/* ── Main inputs row ── */}
            <div className="flex flex-col md:flex-row">
              {/* Keyword */}
              <div
                className="flex flex-col px-5 py-4 flex-[2] group
                hover:bg-gray-50 rounded-tl-3xl rounded-tr-3xl md:rounded-tr-none"
              >
                <label
                  className="text-[11px] font-bold text-gray-400 uppercase
                  tracking-wide mb-1"
                >
                  What are you looking for?
                </label>
                <div className="flex items-center gap-2">
                  <Search size={15} className="text-gray-300 flex-shrink-0" />
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="products, food, apartments…"
                    value={query}
                    onChange={(e) => handleQueryChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="outline-none text-sm bg-transparent w-full text-gray-800
                      placeholder:text-gray-300"
                  />
                  {query && (
                    <button
                      onClick={() => {
                        setQuery("");
                        setSuggestions([]);
                      }}
                      className="text-gray-300 hover:text-gray-500 flex-shrink-0"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>

              <div className="hidden md:block w-px bg-gray-100 my-3" />

              {/* Category */}
              <div className="flex flex-col px-5 py-4 flex-1 hover:bg-gray-50">
                <label
                  className="text-[11px] font-bold text-gray-400 uppercase
                  tracking-wide mb-1 flex items-center gap-1"
                >
                  <Tag size={10} /> Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="outline-none text-sm bg-transparent text-gray-700
                    cursor-pointer"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="hidden md:block w-px bg-gray-100 my-3" />

              {/* City */}
              <div className="flex flex-col px-5 py-4 flex-1 hover:bg-gray-50">
                <label
                  className="text-[11px] font-bold text-gray-400 uppercase
                  tracking-wide mb-1 flex items-center gap-1"
                >
                  <MapPin size={10} /> City / Area
                </label>
                <input
                  type="text"
                  placeholder={
                    country === "Nigeria" ? "e.g. Lagos" : "e.g. Accra"
                  }
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="outline-none text-sm bg-transparent text-gray-700
                    placeholder:text-gray-300"
                />
              </div>

              <div className="hidden md:block w-px bg-gray-100 my-3" />

              {/* Max price */}
              <div className="flex flex-col px-5 py-4 flex-1 hover:bg-gray-50">
                <label
                  className="text-[11px] font-bold text-gray-400 uppercase
                  tracking-wide mb-1 flex items-center gap-1"
                >
                  <SlidersHorizontal size={10} /> Max price ({sym})
                </label>
                <input
                  type="number"
                  min="0"
                  inputMode="numeric"
                  placeholder="Any budget"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="outline-none text-sm bg-transparent text-gray-700
                    placeholder:text-gray-300"
                />
              </div>

              {/* Actions */}
              <div
                className="flex items-center gap-2 px-4 py-3 border-t
                md:border-t-0 border-gray-100"
              >
                {(query || category || city || maxPrice) && (
                  <button
                    onClick={handleClear}
                    className="flex items-center gap-1 text-xs text-gray-400
                      hover:text-gray-600 transition px-2 py-1.5 rounded-xl
                      hover:bg-gray-100"
                  >
                    <X size={12} /> Clear
                  </button>
                )}
                <button
                  onClick={() => setOpen(false)}
                  className="text-xs text-gray-400 hover:text-gray-600
                    transition px-2 py-1.5 rounded-xl hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSearch()}
                  className="flex items-center gap-2 bg-[#ffc105] hover:bg-amber-400
                    transition text-black font-bold px-5 py-2.5 rounded-2xl text-sm
                    active:scale-95"
                >
                  <Search size={15} />
                  <span className="hidden sm:inline">Search</span>
                </button>
              </div>
            </div>

            {/* ── Suggestions / recent searches dropdown ── */}
            {(suggestions.length > 0 || recentSearches.length > 0) && (
              <div className="border-t border-gray-100 px-4 py-3">
                {/* Autocomplete suggestions */}
                {suggestions.length > 0 && (
                  <div className="mb-3">
                    <p
                      className="text-[10px] font-bold text-gray-400 uppercase
                      tracking-wide mb-2 flex items-center gap-1"
                    >
                      <TrendingUp size={10} /> Suggestions
                    </p>
                    <div className="flex flex-col gap-0.5">
                      {suggestions.slice(0, 5).map((s, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            setQuery(s.label);
                            if (s.category) setCategory(s.category);
                            handleSearch({
                              query: s.label,
                              category: s.category ?? category,
                            });
                          }}
                          className="flex items-center justify-between px-3 py-2.5
                            rounded-xl hover:bg-gray-50 text-left group transition"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <Search
                              size={13}
                              className="text-gray-300 flex-shrink-0"
                            />
                            <span className="text-sm text-gray-700 truncate">
                              {s.label}
                            </span>
                            {s.category && (
                              <span
                                className="text-[10px] text-gray-400 bg-gray-100
                                px-2 py-0.5 rounded-full flex-shrink-0 capitalize"
                              >
                                {s.category}
                              </span>
                            )}
                          </div>
                          <ArrowRight
                            size={13}
                            className="text-gray-300 opacity-0 group-hover:opacity-100
                              flex-shrink-0 transition"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recent searches (only when no suggestions) */}
                {suggestions.length === 0 && recentSearches.length > 0 && (
                  <div>
                    <p
                      className="text-[10px] font-bold text-gray-400 uppercase
                      tracking-wide mb-2 flex items-center gap-1"
                    >
                      <Clock size={10} /> Recent searches
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((s, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            setQuery(s);
                            handleSearch({ query: s });
                          }}
                          className="flex items-center gap-1.5 text-xs text-gray-600
                            bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full
                            transition"
                        >
                          <Clock size={10} className="text-gray-400" /> {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Loading */}
                {sugLoading && (
                  <div className="flex items-center gap-2 px-3 py-2 text-xs text-gray-400">
                    <div
                      className="w-3 h-3 border-2 border-gray-200 border-t-gray-400
                      rounded-full animate-spin"
                    />
                    Searching…
                  </div>
                )}
              </div>
            )}

            {/* ── Country lock reminder ── */}
            {country && (
              <div
                className="border-t border-gray-50 px-5 py-2.5 flex items-center
                gap-1.5 text-[11px] text-gray-400"
              >
                <MapPin size={11} />
                Showing results in{" "}
                <strong className="text-gray-600">{country}</strong>
                <span className="ml-auto text-gray-300">·</span>
                <span className="text-gray-300">{currency}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
