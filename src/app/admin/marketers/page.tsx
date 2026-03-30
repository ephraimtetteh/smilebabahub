"use client";
// src/app/admin/marketers/page.tsx

import { useEffect, useState } from "react";
import { useAdmin } from "@/src/hooks/useAdmin";
import {
  Search,
  Loader2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "react-toastify";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GH", { dateStyle: "medium" });
}

export default function AdminMarketersPage() {
  const { data, loading, error, fetch, patch } = useAdmin<any>("marketers");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [paying, setPaying] = useState<string | null>(null);

  const load = (overrides?: object) =>
    fetch({ search, page, limit: 20, ...overrides });

  useEffect(() => {
    load();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    load({ page: 1 });
  };

  const handlePayout = async (marketerId: string, currency: "GHS" | "NGN") => {
    setPaying(`${marketerId}-${currency}`);
    try {
      await patch(marketerId, "payout", { currency });
      toast.success(`Marked ${currency} payout as settled`);
      load();
    } catch {
      toast.error("Failed to mark payout");
    } finally {
      setPaying(null);
    }
  };

  const meta = data?.meta ?? {};
  const marketers = data?.marketers ?? [];
  const totals = data?.totals ?? {};

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-black text-gray-900">Marketers</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          {meta.total ? `${meta.total} registered marketers` : "All marketers"}
        </p>
      </div>

      {/* Totals */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total referrals",
            value: totals.totalReferrals ?? 0,
            sym: "",
          },
          {
            label: "Earnings (GHS)",
            value: totals.totalEarningsGHS ?? 0,
            sym: "₵",
          },
          {
            label: "Earnings (NGN)",
            value: totals.totalEarningsNGN ?? 0,
            sym: "₦",
          },
          { label: "Pending GHS", value: totals.pendingGHS ?? 0, sym: "₵" },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-2xl border border-gray-100 p-4"
          >
            <p className="text-xs text-gray-400 mb-1">{s.label}</p>
            <p className="text-xl font-black text-gray-900">
              {s.sym}
              {Number(s.value).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2 max-w-md">
        <div className="relative flex-1">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, code…"
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
                      "Marketer",
                      "Code",
                      "Referrals",
                      "Earned GHS",
                      "Earned NGN",
                      "Pending GHS",
                      "Pending NGN",
                      "Joined",
                      "Payout",
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left px-4 py-3 text-xs font-bold
                        text-gray-400 uppercase tracking-wider whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {marketers.map((m: any) => (
                    <tr key={m._id} className="hover:bg-gray-50/50">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-gray-900">{m.name}</p>
                        <p className="text-xs text-gray-400">{m.email}</p>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs font-bold text-[#ffc105]">
                        {m.referralCode}
                      </td>
                      <td className="px-4 py-3 font-bold text-center">
                        {m.totalReferrals}
                      </td>
                      <td className="px-4 py-3 font-medium">
                        ₵{m.totalEarningsGHS.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 font-medium">
                        ₦{m.totalEarningsNGN.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={
                            m.pendingPayoutGHS > 0
                              ? "text-orange-600 font-bold"
                              : "text-gray-400"
                          }
                        >
                          ₵{m.pendingPayoutGHS.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={
                            m.pendingPayoutNGN > 0
                              ? "text-orange-600 font-bold"
                              : "text-gray-400"
                          }
                        >
                          ₦{m.pendingPayoutNGN.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-400 whitespace-nowrap">
                        {formatDate(m.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1.5 flex-wrap">
                          {m.pendingPayoutGHS > 0 && (
                            <button
                              onClick={() => handlePayout(m._id, "GHS")}
                              disabled={paying === `${m._id}-GHS`}
                              className="flex items-center gap-1 text-[10px] font-bold
                                px-2 py-1 bg-blue-100 text-blue-700 rounded-lg
                                hover:bg-blue-200 transition disabled:opacity-50"
                            >
                              <CheckCircle2 size={10} />
                              Pay GHS
                            </button>
                          )}
                          {m.pendingPayoutNGN > 0 && (
                            <button
                              onClick={() => handlePayout(m._id, "NGN")}
                              disabled={paying === `${m._id}-NGN`}
                              className="flex items-center gap-1 text-[10px] font-bold
                                px-2 py-1 bg-green-100 text-green-700 rounded-lg
                                hover:bg-green-200 transition disabled:opacity-50"
                            >
                              <CheckCircle2 size={10} />
                              Pay NGN
                            </button>
                          )}
                          {m.pendingPayoutGHS === 0 &&
                            m.pendingPayoutNGN === 0 && (
                              <span className="text-[10px] text-gray-400">
                                Settled
                              </span>
                            )}
                        </div>
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
