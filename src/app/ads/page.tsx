"use client";

// app/ads/page.tsx — thin orchestrator, all UI is in components/ads/
import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useAds } from "@/src/hooks/useAds";
import { AdCondition, AdCurrency } from "@/src/types/ad.types";
import AdsHero from "./(components)/AdsHero";
import CategoryTabs from "./(components)/CategoryTabs";
import FiltersPanel from "./(components)/FiltersPanel";
import BestsellersRow from "./(components)/BestSellingAd";
import AdGrid from "./(components)/AdGrid";
import AdsPagination from "./(components)/AdsPagination";
import PostAdCTA from "./(components)/PostAdCTA";
import { SORT_OPTIONS } from "./(components)/ad.constants";
import { useAppSelector } from "../redux";

export default function AdsLandingPage() {
  const searchParams = useSearchParams();

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

  // Local filter state — NOT sourced from Redux to avoid stale filter bleed
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [category, setCategory] = useState(
    searchParams.get("category") ?? "all",
  );
  const [condition, setCondition] = useState("all");
  const [sort, setSort] = useState("newest");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const sym = userCurrency === "NGN" ? "₦" : "₵";

  // Build a clean params object from local state — never spreads stale Redux filters
  const buildParams = useCallback(
    (overrides: Record<string, unknown> = {}) => ({
      country: userCountry as any,
      currency: userCurrency as AdCurrency,
      sort: sort as any,
      page: 1,
      limit: 24,
      ...(search.trim() && { search: search.trim() }),
      ...(category !== "all" && { category }),
      ...(condition !== "all" && { condition: condition as AdCondition }),
      ...(minPrice && { minPrice: Number(minPrice) }),
      ...(maxPrice && { maxPrice: Number(maxPrice) }),
      ...overrides,
    }),
    [
      userCountry,
      userCurrency,
      sort,
      search,
      category,
      condition,
      minPrice,
      maxPrice,
    ],
  );

  // Fetch whenever country resolves — fires for guests (Ghana fallback) AND
  // logged-in users (user.country). No auth gate needed.
  useEffect(() => {
    loadAds({
      country: userCountry as any,
      currency: userCurrency as AdCurrency,
      sort: "newest",
      page: 1,
      limit: 24,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasCheckedAuth, userCountry]);

  const handleSearch = useCallback(() => {
    loadAds(buildParams());
  }, [buildParams, loadAds]);

  // Category change resets all other filters
  const handleCategoryChange = (cat: string) => {
    setCategory(cat);
    setCondition("all");
    setMinPrice("");
    setMaxPrice("");
    setSearch("");
    loadAds({
      country: userCountry as any,
      currency: userCurrency as AdCurrency,
      category: cat === "all" ? undefined : cat,
      sort: sort as any,
      page: 1,
      limit: 24,
    });
  };

  const handleSortChange = (s: string) => {
    setSort(s);
    loadAds(buildParams({ sort: s, page: 1 }));
  };

  const handleClearFilters = () => {
    setCondition("all");
    setMinPrice("");
    setMaxPrice("");
    setSort("newest");
    setSearch("");
    loadAds({
      country: userCountry as any,
      currency: userCurrency as AdCurrency,
      sort: "newest",
      page: 1,
      limit: 24,
    });
  };

  const handlePage = (page: number) => {
    goToPage(page);
    loadAds(buildParams({ page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Boosted ads for bestsellers, non-boosted for main grid
  const boostedAds = ads.filter((a) => a.boost?.isBoosted);
  const mainAds = ads.filter((a) => !a.boost?.isBoosted);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdsHero
        country={userCountry}
        search={search}
        onSearch={setSearch}
        onSubmit={handleSearch}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Country filter indicator — always shown (defaults to Ghana for guests) */}
        <div className="flex items-center gap-2 mb-4 text-xs text-gray-500">
          <span className="text-base">
            {userCountry === "Nigeria" ? "🇳🇬" : "🇬🇭"}
          </span>
          <span>
            Showing ads in{" "}
            <strong className="text-gray-700">{userCountry || "Ghana"}</strong>
          </span>
          <span className="text-gray-300">·</span>
          <span className="text-gray-400">
            Prices in {userCurrency === "NGN" ? "₦ NGN" : "₵ GHS"}
          </span>
        </div>
        <CategoryTabs
          active={category}
          onChange={handleCategoryChange}
          showFilterBtn
          filtersOpen={showFilters}
          onFilterToggle={() => setShowFilters((v) => !v)}
        />

        {showFilters && (
          <FiltersPanel
            sym={sym}
            condition={condition}
            minPrice={minPrice}
            maxPrice={maxPrice}
            sort={sort}
            onCondition={setCondition}
            onMinPrice={setMinPrice}
            onMaxPrice={setMaxPrice}
            onSort={handleSortChange}
            onApply={handleSearch}
            onClear={handleClearFilters}
          />
        )}

        {/* Boosted ads from the current page — shown separately at the top */}
        {!feedLoading && boostedAds.length > 0 && (
          <BestsellersRow ads={boostedAds} />
        )}

        {/* Results header */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-500">
            {feedLoading
              ? "Loading…"
              : `${meta?.total?.toLocaleString() ?? 0} ads found`}
          </p>
          <select
            value={sort}
            onChange={(e) => handleSortChange(e.target.value)}
            className="text-xs border border-gray-200 rounded-xl px-3 py-1.5
              text-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white"
          >
            {SORT_OPTIONS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {feedError && !feedLoading && (
          <div
            className="bg-red-50 border border-red-200 rounded-2xl p-5
            text-red-600 text-sm text-center mb-6"
          >
            {feedError}
          </div>
        )}

        <AdGrid ads={mainAds} loading={feedLoading} count={12} />

        {meta && <AdsPagination meta={meta} onPage={handlePage} />}

        <PostAdCTA country={userCountry} />
      </div>
    </div>
  );
}