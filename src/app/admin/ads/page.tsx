"use client";
// src/app/admin/ads/page.tsx

import { useEffect, useState } from "react";
import { useAdmin } from "@/src/hooks/useAdmin";
import { Search, Loader2, ChevronLeft, ChevronRight, Zap } from "lucide-react";
import Link from "next/link";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GH", { dateStyle: "medium" });
}

const CATEGORIES = [
  "marketplace",
  "food",
  "apartments",
  "vehicles",
  "services",
];

export default function AdminAdsPage() {
  const { data, loading, error, fetch } = useAdmin<any>("ads");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [boosted, setBoosted] = useState("");
  const [page, setPage] = useState(1);

  const load = (overrides?: object) =>
    fetch({ search, category, boosted, page, limit: 20, ...overrides });

  useEffect(() => {
    load();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    load({ page: 1 });
  };

  const meta = data?.meta ?? {};
  const ads = data?.ads ?? [];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-black text-gray-900">Ads</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          {meta.total
            ? `${meta.total.toLocaleString()} total active ads`
            : "All listings"}
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <form
          onSubmit={handleSearch}
          className="flex gap-2 flex-1 min-w-[220px]"
        >
          <div className="relative flex-1">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search title or description…"
              className="w-full pl-8 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm
                focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 bg-[#ffc105] text-black font-bold text-sm
              rounded-xl hover:bg-amber-400 transition"
          >
            Search
          </button>
        </form>

        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setPage(1);
            load({ category: e.target.value, page: 1 });
          }}
          className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white
            focus:outline-none focus:ring-2 focus:ring-yellow-400"
        >
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c} className="capitalize">
              {c}
            </option>
          ))}
        </select>

        <select
          value={boosted}
          onChange={(e) => {
            setBoosted(e.target.value);
            setPage(1);
            load({ boosted: e.target.value, page: 1 });
          }}
          className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white
            focus:outline-none focus:ring-2 focus:ring-yellow-400"
        >
          <option value="">All ads</option>
          <option value="true">Boosted only</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 size={28} className="animate-spin text-[#ffc105]" />
          </div>
        ) : error ? (
          <p className="text-red-500 text-sm p-6">{error}</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    {[
                      "Title",
                      "Vendor",
                      "Category",
                      "Price",
                      "Boost",
                      "Posted",
                      "",
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left px-5 py-3 text-xs font-bold
                        text-gray-400 uppercase tracking-wider whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {ads.map((ad: any) => (
                    <tr key={ad._id} className="hover:bg-gray-50/50">
                      <td className="px-5 py-3 max-w-[200px]">
                        <p className="font-semibold text-gray-900 truncate">
                          {ad.title}
                        </p>
                      </td>
                      <td className="px-5 py-3">
                        <p className="font-medium text-gray-800">
                          {ad.postedBy?.username ?? "—"}
                        </p>
                        <p className="text-xs text-gray-400">
                          {ad.postedBy?.email}
                        </p>
                      </td>
                      <td className="px-5 py-3 capitalize text-gray-500">
                        {ad.category?.main ?? "—"}
                      </td>
                      <td className="px-5 py-3 font-bold text-gray-900">
                        {ad.price?.currency === "NGN" ? "₦" : "₵"}
                        {(ad.price?.amount ?? 0).toLocaleString()}
                      </td>
                      <td className="px-5 py-3">
                        {ad.boost?.isBoosted ? (
                          <span
                            className="flex items-center gap-1 text-[10px] font-bold
                            text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full w-fit"
                          >
                            <Zap size={9} /> {ad.boost.boostTier}
                          </span>
                        ) : (
                          <span className="text-gray-300 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-gray-400 whitespace-nowrap">
                        {formatDate(ad.createdAt)}
                      </td>
                      <td className="px-5 py-3">
                        <Link
                          href={`/ads/${ad._id}`}
                          target="_blank"
                          className="text-xs text-[#ffc105] font-semibold hover:underline"
                        >
                          View →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {meta.pages > 1 && (
              <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
                <p className="text-xs text-gray-400">
                  Page {meta.page} of {meta.pages}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const p = page - 1;
                      setPage(p);
                      load({ page: p });
                    }}
                    disabled={page === 1}
                    className="w-8 h-8 flex items-center justify-center rounded-lg
                      border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <button
                    onClick={() => {
                      const p = page + 1;
                      setPage(p);
                      load({ page: p });
                    }}
                    disabled={page >= meta.pages}
                    className="w-8 h-8 flex items-center justify-center rounded-lg
                      border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
