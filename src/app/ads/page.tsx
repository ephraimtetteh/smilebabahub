"use client";

// src/app/ads/page.tsx — Marketplace listing page
// Handles URL → state sync for category, search, sort, etc.

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useAds } from "@/src/hooks/useAds";
import { useAppSelector } from "@/src/app/redux";
import { AdCondition, AdCurrency } from "@/src/types/ad.types";
import { CATEGORIES } from "./(components)/ad.constants";
import AdsHero from "./(components)/AdsHero";
import CategoryTabs from "./(components)/CategoryTabs";
import FiltersPanel from "./(components)/FiltersPanel";
import BestsellersRow from "./(components)/BestSellingAd";
import AdGrid from "./(components)/AdGrid";
import AdsPagination from "./(components)/AdsPagination";
import PostAdCTA from "./(components)/PostAdCTA";


// ── Valid category IDs from the constants file ────────────────────────────
const VALID_CATEGORIES = CATEGORIES.map((c) => c.id) as readonly string[];

function isValidCategory(
  c: string | null,
): c is (typeof VALID_CATEGORIES)[number] {
  return !!c && (VALID_CATEGORIES as readonly string[]).includes(c);
}

export default function AdsLandingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const {
    ads,
    meta,
    feedLoading,
    feedError,
    loadAds,
    goToPage,
    userCurrency,
    userCountry,
  } = useAds();

  const hasCheckedAuth = useAppSelector((s) => s.auth.hasCheckedAuth);

  // ── Source of truth: URL params, not local state ────────────────────────
  // Read directly from URL so back/forward buttons work and direct links
  // to /ads?category=apartments load the correct category.
  const rawCategory = searchParams.get("category");
  const urlCategory = isValidCategory(rawCategory) ? rawCategory : "all";
  const urlSearch = searchParams.get("search") ?? "";
  const urlSort = searchParams.get("sort") ?? "newest";
  const urlMin = searchParams.get("minPrice") ?? "";
  const urlMax = searchParams.get("maxPrice") ?? "";
  const urlCond = searchParams.get("condition") ?? "all";
  const urlPage = Number(searchParams.get("page") ?? 1) || 1;

  // Local state mirrors URL — controlled by URL changes via effect below
  const [search, setSearch] = useState(urlSearch);
  const [condition, setCondition] = useState(urlCond);
  const [minPrice, setMinPrice] = useState(urlMin);
  const [maxPrice, setMaxPrice] = useState(urlMax);
  const [showFilters, setShowFilters] = useState(false);

  const sym = userCurrency === "NGN" ? "₦" : "₵";

  // ── URL → fetch ─────────────────────────────────────────────────────────
  // ONE useEffect that fires whenever URL params or country resolves.
  // This is the SINGLE source of fetch — no other effect should call loadAds.
  useEffect(() => {
    if (!userCountry) return;

    loadAds({
      country: userCountry as any,
      currency: userCurrency as AdCurrency,
      sort: urlSort as any,
      page: urlPage,
      limit: 24,
      ...(urlSearch.trim() && { search: urlSearch.trim() }),
      ...(urlCategory !== "all" && { category: urlCategory }),
      ...(urlCond !== "all" && { condition: urlCond as AdCondition }),
      ...(urlMin && { minPrice: Number(urlMin) }),
      ...(urlMax && { maxPrice: Number(urlMax) }),
    });

    // Sync local form state with URL on URL change
    setSearch(urlSearch);
    setCondition(urlCond);
    setMinPrice(urlMin);
    setMaxPrice(urlMax);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    hasCheckedAuth,
    userCountry,
    urlCategory,
    urlSearch,
    urlSort,
    urlMin,
    urlMax,
    urlCond,
    urlPage,
  ]);

  // ── Helper: update URL params (triggers the effect above to re-fetch) ──
  const updateUrl = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (
          value === null ||
          value === "" ||
          value === "all" ||
          value === undefined
        ) {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });
      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname);
    },
    [searchParams, router, pathname],
  );

  // ── Handlers ────────────────────────────────────────────────────────────
  const handleCategoryChange = (cat: string) => {
    // Changing category clears search and pagination but keeps sort
    updateUrl({
      category: cat === "all" ? null : cat,
      search: null,
      condition: null,
      minPrice: null,
      maxPrice: null,
      page: null,
    });
  };

  const handleSortChange = (s: string) => {
    updateUrl({ sort: s === "newest" ? null : s, page: null });
  };

  const handleSearch = () => {
    updateUrl({ search: search.trim() || null, page: null });
  };

  const handleApplyFilters = () => {
    updateUrl({
      condition: condition === "all" ? null : condition,
      minPrice: minPrice || null,
      maxPrice: maxPrice || null,
      page: null,
    });
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    setCondition("all");
    setMinPrice("");
    setMaxPrice("");
    setSearch("");
    updateUrl({
      search: null,
      condition: null,
      minPrice: null,
      maxPrice: null,
      sort: null,
      page: null,
    });
  };

  const handlePage = (page: number) => {
    goToPage(page);
    updateUrl({ page: page === 1 ? null : String(page) });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Bestsellers = boosted ads, main grid = non-boosted
  const boostedAds = ads.filter((a) => a.boost?.isBoosted);
  const mainAds = ads.filter((a) => !a.boost?.isBoosted);

  const activeCount = [
    urlCategory !== "all",
    urlCond !== "all",
    !!urlMin,
    !!urlMax,
    !!urlSearch.trim(),
  ].filter(Boolean).length;

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* ── Hero with search bar ── */}
      <AdsHero
        country={userCountry}
        search={search}
        onSearch={setSearch}
        onSubmit={handleSearch}
      />

      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        {/* ── Active filter summary ── */}
        {activeCount > 0 && (
          <div className="flex items-center gap-2 mb-4 text-xs text-gray-500">
            <span className="font-medium">
              {meta?.total ?? 0} result{(meta?.total ?? 0) !== 1 ? "s" : ""}
            </span>
            <span className="text-gray-300">·</span>
            <span>
              {urlCategory !== "all" && (
                <span
                  className="inline-block bg-yellow-100 text-yellow-700 px-2 py-0.5
                  rounded-full text-[10px] font-bold mr-1.5"
                >
                  {CATEGORIES.find((c) => c.id === urlCategory)?.label ??
                    urlCategory}
                </span>
              )}
              {urlSearch && (
                <span
                  className="inline-block bg-blue-100 text-blue-700 px-2 py-0.5
                  rounded-full text-[10px] font-bold mr-1.5"
                >
                  "{urlSearch}"
                </span>
              )}
            </span>
            <button
              onClick={handleClearFilters}
              className="ml-auto text-xs text-yellow-600 hover:underline font-semibold"
            >
              Clear all
            </button>
          </div>
        )}

        {/* ── Category tabs ── */}
        <CategoryTabs
          active={urlCategory}
          onChange={handleCategoryChange}
          showFilterBtn={true}
          filtersOpen={showFilters}
          onFilterToggle={() => setShowFilters((v) => !v)}
        />

        {/* ── Filters + sort row ── */}
        <FiltersPanel
          sym={sym}
          condition={condition}
          onCondition={setCondition}
          minPrice={minPrice}
          onMinPrice={setMinPrice}
          maxPrice={maxPrice}
          onMaxPrice={setMaxPrice}
          sort={urlSort}
          onSort={handleSortChange}
          onApply={handleApplyFilters}
          onClear={handleClearFilters}
        />

        {/* ── Boosted row ── */}
        {boostedAds.length > 0 && !urlSearch && (
          <BestsellersRow ads={boostedAds.slice(0, 6)} />
        )}

        {/* ── Main grid header ── */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-black text-gray-800">
            {urlCategory === "all"
              ? urlSearch
                ? `Results for "${urlSearch}"`
                : "All listings"
              : (CATEGORIES.find((c) => c.id === urlCategory)?.label ??
                urlCategory)}
            {meta?.total !== undefined && (
              <span className="text-gray-400 font-normal ml-2 text-xs">
                ({meta.total.toLocaleString()})
              </span>
            )}
          </h2>
        </div>

        {/* ── Error state ── */}
        {feedError && !feedLoading && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5 text-center mb-4">
            <p className="text-red-600 text-sm font-semibold">{feedError}</p>
            <button
              onClick={() =>
                loadAds({
                  country: userCountry as any,
                  currency: userCurrency as AdCurrency,
                  sort: urlSort as any,
                  page: urlPage,
                  limit: 24,
                  ...(urlCategory !== "all" && { category: urlCategory }),
                })
              }
              className="mt-2 text-xs text-red-600 underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* ── Main grid ── */}
        <AdGrid
          ads={mainAds}
          loading={feedLoading}
          count={12}
          emptyMessage={
            urlCategory !== "all"
              ? `No ${(CATEGORIES.find((c) => c.id === urlCategory)?.label ?? urlCategory).toLowerCase()} listings yet`
              : urlSearch
                ? `No results for "${urlSearch}"`
                : undefined
          }
        />

        {/* ── Pagination ── */}
        {meta && meta.totalPages > 1 && (
          <div className="mt-6">
            <AdsPagination meta={meta} onPage={handlePage} />
          </div>
        )}

        {/* ── Post ad CTA ── */}
        <PostAdCTA />
      </div>
    </div>
  );
}
