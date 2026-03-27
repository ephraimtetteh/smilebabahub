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


export default function AdsLandingPage() {
  const searchParams = useSearchParams();
  const {
    ads,
    meta,
    feedLoading,
    feedError,
    loadAds,
    applyFilters,
    goToPage,
    filters,
    userCurrency,
    userCountry,
  } = useAds();

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

  // Initial load filtered to user's country
  useEffect(() => {
    loadAds({
      country: userCountry as any,
      currency: userCurrency as AdCurrency,
      sort: "newest",
      page: 1,
      limit: 24,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userCountry]);

  const handleSearch = useCallback(() => {
    loadAds({
      search: search.trim() || undefined,
      category: category === "all" ? undefined : category,
      condition: condition === "all" ? undefined : (condition as AdCondition),
      sort: sort as any,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      country: userCountry as any,
      page: 1,
    });
  }, [
    search,
    category,
    condition,
    sort,
    minPrice,
    maxPrice,
    userCountry,
    loadAds,
  ]);

  const handleCategoryChange = (cat: string) => {
    setCategory(cat);
    loadAds({
      category: cat === "all" ? undefined : cat,
      country: userCountry as any,
      sort: sort as any,
      page: 1,
    });
  };

  const handleSortChange = (s: string) => {
    setSort(s);
    loadAds({ ...filters, sort: s as any, page: 1 });
  };

  const handleClearFilters = () => {
    setCondition("all");
    setMinPrice("");
    setMaxPrice("");
    setSort("newest");
    loadAds({ country: userCountry as any, sort: "newest", page: 1 });
  };

  const handlePage = (page: number) => {
    goToPage(page);
    loadAds({ ...filters, page });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Non-boosted ads for the main grid
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

        {/* Boosted ads shown first */}
        {!feedLoading && <BestsellersRow ads={ads} />}

        {/* Results count + sort */}
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
            {[
              { id: "newest", label: "Newest first" },
              { id: "price_asc", label: "Price: Low → High" },
              { id: "price_desc", label: "Price: High → Low" },
              { id: "popular", label: "Most viewed" },
            ].map((s) => (
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
