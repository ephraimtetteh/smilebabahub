"use client";
// src/app/admin/subscriptions/page.tsx

import { useEffect, useState } from "react";
import { useAdmin } from "@/src/hooks/useAdmin";
import { Search, Loader2, ChevronLeft, ChevronRight } from "lucide-react";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GH", { dateStyle: "medium" });
}

const PLANS = ["Basic", "standard", "popular", "premium"];

export default function AdminSubscriptionsPage() {
  const { data, loading, error, fetch } = useAdmin<any>("subscriptions");
  const [search, setSearch] = useState("");
  const [currency, setCurrency] = useState("");
  const [planId, setPlanId] = useState("");
  const [page, setPage] = useState(1);

  const load = (overrides?: object) =>
    fetch({ search, currency, planId, page, limit: 20, ...overrides });

  useEffect(() => {
    load();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    load({ page: 1 });
  };

  const meta = data?.meta;
  const purchases = data?.purchases ?? [];
  const revenue = data?.revenue ?? [];

  const revenueMap: Record<string, number> = {};
  revenue.forEach((r: any) => {
    revenueMap[r._id] = r.total;
  });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-black text-gray-900">Subscriptions</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          {meta?.total
            ? `${meta.total.toLocaleString()} successful payments`
            : "All subscription payments"}
        </p>
      </div>

      {/* Revenue summary */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: "Revenue (GHS)", sym: "₵", key: "GHS" },
          { label: "Revenue (NGN)", sym: "₦", key: "NGN" },
        ].map((r) => (
          <div
            key={r.key}
            className="bg-white rounded-2xl border border-gray-100 p-5"
          >
            <p className="text-xs text-gray-400 font-medium mb-1">{r.label}</p>
            <p className="text-2xl font-black text-gray-900">
              {r.sym}
              {(revenueMap[r.key] ?? 0).toLocaleString()}
            </p>
          </div>
        ))}
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
              placeholder="Search by username or email…"
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
          value={currency}
          onChange={(e) => {
            setCurrency(e.target.value);
            setPage(1);
            load({ currency: e.target.value, page: 1 });
          }}
          className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white
            focus:outline-none focus:ring-2 focus:ring-yellow-400"
        >
          <option value="">All currencies</option>
          <option value="GHS">GHS (Ghana)</option>
          <option value="NGN">NGN (Nigeria)</option>
        </select>

        <select
          value={planId}
          onChange={(e) => {
            setPlanId(e.target.value);
            setPage(1);
            load({ planId: e.target.value, page: 1 });
          }}
          className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white
            focus:outline-none focus:ring-2 focus:ring-yellow-400"
        >
          <option value="">All plans</option>
          {PLANS.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
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
                      "Vendor",
                      "Plan",
                      "Billing",
                      "Amount",
                      "Currency",
                      "Date",
                      "Ref",
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
                  {purchases.map((p: any) => (
                    <tr key={p._id} className="hover:bg-gray-50/50">
                      <td className="px-5 py-3">
                        <p className="font-semibold text-gray-900">
                          {p.user?.username ?? "—"}
                        </p>
                        <p className="text-xs text-gray-400">{p.user?.email}</p>
                      </td>
                      <td className="px-5 py-3 capitalize font-medium text-gray-800">
                        {p.planId}
                      </td>
                      <td className="px-5 py-3 text-gray-500 capitalize">
                        {p.billingCycle}
                      </td>
                      <td className="px-5 py-3 font-black text-gray-900">
                        {p.currency === "NGN" ? "₦" : "₵"}
                        {p.amount.toLocaleString()}
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full
                          ${
                            p.currency === "NGN"
                              ? "bg-green-100 text-green-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {p.currency}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-gray-400 whitespace-nowrap">
                        {formatDate(p.createdAt)}
                      </td>
                      <td className="px-5 py-3 font-mono text-xs text-gray-400 max-w-[120px] truncate">
                        {p.txRef}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {meta && meta.pages > 1 && (
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
