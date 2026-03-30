"use client";
// src/app/admin/page.tsx  — Overview / Dashboard

import { useEffect } from "react";
import { useAdmin } from "@/src/hooks/useAdmin";
import { useViewCountry } from "@/src/hooks/useViewCountry";
import {
  Users,
  CreditCard,
  ShoppingBag,
  Megaphone,
  TrendingUp,
  Loader2,
} from "lucide-react";

function StatCard({
  label,
  value,
  icon,
  sub,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  sub?: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4">
      <div
        className="w-11 h-11 rounded-xl bg-[#ffc105]/10 flex items-center
        justify-center flex-shrink-0 text-[#ffc105]"
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-gray-400 font-medium">{label}</p>
        <p className="text-2xl font-black text-gray-900 leading-tight">
          {value}
        </p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GH", { dateStyle: "medium" });
}

export default function AdminOverviewPage() {
  const { data, loading, error, fetch } = useAdmin<any>("overview");
  const { sym, currency } = useViewCountry();

  useEffect(() => {
    fetch();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={32} className="animate-spin text-[#ffc105]" />
      </div>
    );
  if (error) return <p className="text-red-500 text-sm">{error}</p>;
  if (!data) return null;

  const { stats, recentUsers, recentPurchases } = data;
  const revenue =
    currency === "NGN"
      ? `₦${stats.revenueNGN.toLocaleString()}`
      : `₵${stats.revenueGHS.toLocaleString()}`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-black text-gray-900">Overview</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          Platform health at a glance
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total users"
          value={stats.totalUsers.toLocaleString()}
          icon={<Users size={20} />}
          sub={`${stats.totalVendors} vendors`}
        />
        <StatCard
          label="Active ads"
          value={stats.totalAds.toLocaleString()}
          icon={<ShoppingBag size={20} />}
        />
        <StatCard
          label="Marketers"
          value={stats.totalMarketers.toLocaleString()}
          icon={<Megaphone size={20} />}
        />
        <StatCard
          label={`Revenue (${currency})`}
          value={revenue}
          icon={<TrendingUp size={20} />}
          sub="All time"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recent signups */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50 flex items-center gap-2">
            <Users size={15} className="text-[#ffc105]" />
            <h3 className="font-bold text-sm text-gray-900">Recent signups</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {recentUsers.map((u: any) => (
              <div
                key={u._id}
                className="px-5 py-3 flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {u.username}
                  </p>
                  <p className="text-xs text-gray-400">{u.email}</p>
                </div>
                <div className="text-right">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full
                    ${
                      u.role === "vendor"
                        ? "bg-green-100 text-green-700"
                        : u.role === "admin"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {u.role}
                  </span>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    {formatDate(u.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent payments */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50 flex items-center gap-2">
            <CreditCard size={15} className="text-[#ffc105]" />
            <h3 className="font-bold text-sm text-gray-900">Recent payments</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {recentPurchases.map((p: any) => (
              <div
                key={p._id}
                className="px-5 py-3 flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-semibold text-gray-900 truncate max-w-[180px]">
                    {p.title}
                  </p>
                  <p className="text-xs text-gray-400">
                    {p.user?.username ?? "—"}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-black text-gray-900">
                    {p.currency === "NGN" ? "₦" : "₵"}
                    {p.amount.toLocaleString()}
                  </p>
                  <p className="text-[11px] text-gray-400">
                    {formatDate(p.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
