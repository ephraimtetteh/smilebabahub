"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/src/lib/api/axios";
import { safeStorage } from "@/src/utils/safeStorage";

// ── Types ──────────────────────────────────────────────────────────────────
type Marketer = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  referralCode: string;
  totalReferrals: number;
  activeReferrals: number;
  totalEarningsGHS: number;
  totalEarningsNGN: number;
  pendingPayoutGHS: number;
  pendingPayoutNGN: number;
  payoutMethod: string;
  createdAt: string;
};

type Commission = {
  _id: string;
  planId: string;
  billingCycle: string;
  originalAmount: number;
  commission: number;
  currency: string;
  paidOut: boolean;
  createdAt: string;
};

type DailyPoint = {
  date: string;
  label: string;
  earningsGHS: number;
  earningsNGN: number;
  count: number;
};
type PlanPoint = {
  plan: string;
  count: number;
  earningsGHS: number;
  earningsNGN: number;
};

type DashboardData = {
  marketer: Marketer;
  recentCommissions: Commission[];
  stats: {
    totalReferrals: number;
    activeReferrals: number;
    totalEarningsGHS: number;
    totalEarningsNGN: number;
    pendingPayoutGHS: number;
    pendingPayoutNGN: number;
    // New dynamic fields
    thisWeekGHS: number;
    lastWeekGHS: number;
    weekChange: number;
    monthEarningsGHS: number;
    monthEarningsNGN: number;
    monthReferrals: number;
  };
  charts: {
    dailyEarnings: DailyPoint[];
    planBreakdown: PlanPoint[];
  };
};

// ── Helpers ────────────────────────────────────────────────────────────────
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GH", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function fmt(n: number | undefined | null): string {
  const v = Number(n ?? 0);
  if (isNaN(v)) return "0.00";
  return v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v.toFixed(2);
}

// Mini bar chart for earnings sparkline
function EarningsChart({
  data,
  currency = "GHS",
}: {
  data: DailyPoint[];
  currency?: "GHS" | "NGN";
}) {
  const values = data.map((d) =>
    currency === "NGN" ? d.earningsNGN : d.earningsGHS,
  );
  const max = Math.max(...values, 0.01);
  const hasData = values.some((v) => v > 0);

  if (!hasData)
    return (
      <div className="flex items-center justify-center h-16 text-xs text-gray-600">
        No earnings yet this month
      </div>
    );

  return (
    <div className="flex items-end gap-0.5 h-16">
      {data.map((d, i) => {
        const v = currency === "NGN" ? d.earningsNGN : d.earningsGHS;
        const pct = Math.max((v / max) * 100, v > 0 ? 5 : 1);
        const isToday = i === data.length - 1;
        return (
          <div
            key={d.date}
            className="flex-1 group relative"
            title={`${d.label}: ${currency === "NGN" ? "₦" : "₵"}${Number(v ?? 0).toFixed(2)}`}
          >
            <div
              className={`w-full rounded-sm transition-all duration-300
                ${isToday ? "bg-[#ffc105]" : v > 0 ? "bg-[#ffc105]/40 group-hover:bg-[#ffc105]/70" : "bg-white/5"}`}
              style={{ height: `${pct}%` }}
            />
          </div>
        );
      })}
    </div>
  );
}

function getFirstName(name: string) {
  return name.split(" ")[0];
}

// Use the Next.js rewrite proxy (/api → backend) so the hardcoded
// localhost URL never leaks into the production bundle.
// marketerFetch bypasses axiosInstance (which overwrites the Authorization
// header with the vendor token) but still routes through the same proxy.
const API_BASE = "/api";

// Plain fetch helper for marketer routes — bypasses the axiosInstance
// request interceptor which always overwrites Authorization with the vendor token
async function marketerFetch(path: string, options: RequestInit = {}) {
  const token = safeStorage.get("marketerAccessToken");
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
      ...(options.headers ?? {}),
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw { status: res.status, message: body.message ?? "Request failed" };
  }
  return res.json();
}

// ── Dashboard ──────────────────────────────────────────────────────────────
export default function MarketerDashboard() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "overview" | "commissions" | "payout"
  >("overview");
  const [payoutForm, setPayoutForm] = useState({
    payoutMethod: "",
    accountName: "",
    accountNumber: "",
    bankOrNetwork: "",
  });
  const [savingPayout, setSavingPayout] = useState(false);
  const [payoutMsg, setPayoutMsg] = useState<string | null>(null);
  const esRef = useRef<EventSource | null>(null);

  // ── Fetch dashboard ──────────────────────────────────────────────────────
  const fetchDashboard = async () => {
    try {
      if (!safeStorage.get("marketerAccessToken")) {
        router.push("/marketer/login");
        return;
      }

      const res = await marketerFetch("/marketers/dashboard");
      setData(res);
      setPayoutForm((p) => ({
        ...p,
        payoutMethod: res.marketer.payoutMethod ?? "",
        accountName: res.marketer.payoutDetails?.accountName ?? "",
        accountNumber: res.marketer.payoutDetails?.accountNumber ?? "",
        bankOrNetwork: res.marketer.payoutDetails?.bankOrNetwork ?? "",
      }));
    } catch {
      setError("Session expired. Please log in again.");
      safeStorage.remove("marketerAccessToken");
      router.push("/marketer/login");
    } finally {
      setLoading(false);
    }
  };

  // ── SSE: live stats updates ───────────────────────────────────────────────
  useEffect(() => {
    fetchDashboard();

    const token = safeStorage.get("marketerAccessToken");
    if (!token) return;

    // SSE needs the direct backend URL — it's a long-lived stream that
    // Next.js rewrites can't proxy. Use NEXT_PUBLIC_API_BASE_URL which
    // is set in Render env vars to the actual backend domain.
    const sseBase =
      process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001/smilebaba";

    let retryCount = 0;
    let retryTimer: ReturnType<typeof setTimeout> | null = null;

    const connect = () => {
      const es = new EventSource(`${sseBase}/marketers/stream`, {
        withCredentials: true,
      });
      esRef.current = es;

      es.addEventListener("stats-update", () => {
        retryCount = 0; // reset backoff on successful event
        fetchDashboard();
      });

      // Exponential backoff: 2s, 4s, 8s, max 30s — prevents reconnect flood
      es.onerror = () => {
        es.close();
        if (retryCount < 6) {
          const delay = Math.min(2000 * Math.pow(2, retryCount), 30_000);
          retryCount++;
          retryTimer = setTimeout(connect, delay);
        }
        // After 6 attempts (~2min), give up silently — dashboard still works via fetchDashboard poll
      };
    };

    connect();

    return () => {
      esRef.current?.close();
      if (retryTimer) clearTimeout(retryTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const copyCode = async () => {
    if (!data) return;
    await navigator.clipboard.writeText(data.marketer.referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogout = () => {
    safeStorage.remove("marketerAccessToken");
    router.push("/marketer/login");
  };

  const handleSavePayout = async () => {
    setSavingPayout(true);
    setPayoutMsg(null);
    try {
      await marketerFetch("/marketers/payout", {
        method: "PATCH",
        body: JSON.stringify(payoutForm),
      });
      setPayoutMsg("Payout details saved ✓");
    } catch {
      setPayoutMsg("Failed to save. Please try again.");
    } finally {
      setSavingPayout(false);
    }
  };

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-[#111] flex items-center justify-center">
        <div className="text-center">
          <div
            className="w-10 h-10 border-2 border-[#ffc105] border-t-transparent
            rounded-full animate-spin mx-auto mb-3"
          />
          <p className="text-gray-500 text-sm">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#111] flex items-center justify-center">
        <p className="text-red-400 text-sm">{error}</p>
      </div>
    );
  }

  const { marketer, recentCommissions, stats: rawStats } = data;

  // Normalise every numeric field to 0 when the API returns undefined
  // (new marketers with no earnings get empty aggregation results).
  // We do NOT spread with duplicate keys — instead we coerce each field individually.
  const s = rawStats ?? {};
  const stats = {
    totalReferrals: Number(s.totalReferrals ?? 0),
    activeReferrals: Number(s.activeReferrals ?? 0),
    monthReferrals: Number(s.monthReferrals ?? 0),
    totalEarningsGHS: Number(s.totalEarningsGHS ?? 0),
    totalEarningsNGN: Number(s.totalEarningsNGN ?? 0),
    pendingPayoutGHS: Number(s.pendingPayoutGHS ?? 0),
    pendingPayoutNGN: Number(s.pendingPayoutNGN ?? 0),
    monthEarningsGHS: Number(s.monthEarningsGHS ?? 0),
    monthEarningsNGN: Number(s.monthEarningsNGN ?? 0),
    thisWeekGHS: Number(s.thisWeekGHS ?? 0),
    weekChange: Number(s.weekChange ?? 0),
  };
  const firstName = getFirstName(marketer.name);

  return (
    <div
      className="min-h-screen bg-[#111] text-white"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Syne:wght@700;800&display=swap"
        rel="stylesheet"
      />

      {/* ── Top bar ── */}
      <header
        className="sticky top-0 z-20 bg-[#111]/90 backdrop-blur-md
        border-b border-white/8 px-4 sm:px-8 py-4 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-xl bg-[#ffc105] text-black font-black
            flex items-center justify-center text-sm"
          >
            {firstName.charAt(0)}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-white leading-tight">
              {firstName}
            </p>
            <p className="text-xs text-gray-500 leading-tight">Marketer</p>
          </div>
        </div>

        <div className="text-center">
          <p className="text-xs font-bold text-white">
            Smile<span className="text-[#ffc105]">Baba</span>
          </p>
          <p className="text-[10px] text-gray-600 tracking-widest uppercase">
            Marketer Dashboard
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="text-xs text-gray-500 hover:text-red-400 transition px-3 py-1.5
            border border-white/10 rounded-xl hover:border-red-400/30"
        >
          Log out
        </button>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-7">
        {/* ── Greeting ── */}
        <div className="mb-7">
          <h1
            className="text-2xl sm:text-3xl font-black"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Hey, {firstName} 👋
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Member since {formatDate(marketer.createdAt)}
          </p>
        </div>

        {/* ── Referral code card ── */}
        <div
          className="bg-gradient-to-br from-[#ffc105]/15 to-[#ffc105]/5
          border border-[#ffc105]/25 rounded-2xl p-5 sm:p-6 mb-6 flex flex-col sm:flex-row
          items-center sm:justify-between gap-4"
        >
          <div>
            <p className="text-xs text-[#ffc105]/70 uppercase tracking-widest font-semibold mb-1">
              Your referral code
            </p>
            <p
              className="text-3xl sm:text-4xl font-black tracking-widest text-[#ffc105]"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              {marketer.referralCode}
            </p>
            <p className="text-xs text-gray-500 mt-1.5">
              Share this code with vendors. They get 15% off their first paid
              plan, you earn 15% commission.
            </p>
          </div>
          <button
            onClick={copyCode}
            className="flex-shrink-0 px-6 py-3 bg-[#ffc105] text-black font-bold
              rounded-xl hover:bg-amber-300 transition text-sm active:scale-95 whitespace-nowrap"
          >
            {copied ? "✓ Copied!" : "Copy code"}
          </button>
        </div>

        {/* ── Stats grid ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          {[
            {
              label: "Total referrals",
              value: stats.totalReferrals,
              icon: "🤝",
            },
            {
              label: "Active vendors",
              value: stats.activeReferrals,
              icon: "✅",
            },
            { label: "This month", value: stats.monthReferrals, icon: "📅" },
            {
              label: "Pending payout",
              value: `₵${fmt(stats.pendingPayoutGHS)}`,
              icon: "⏳",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-[#1a1a1a] border border-white/8 rounded-2xl p-4"
            >
              <p className="text-xl mb-1">{s.icon}</p>
              <p
                className="text-xl sm:text-2xl font-black text-white"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                {s.value}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* ── Earnings overview ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {/* GHS earnings card + sparkline */}
          <div className="bg-[#1a1a1a] border border-white/8 rounded-2xl p-4">
            <div className="flex items-start justify-between mb-1">
              <div>
                <p className="text-xs text-gray-500">Total earnings (GHS)</p>
                <p className="text-2xl font-black text-[#ffc105]">
                  ₵
                  {stats.totalEarningsGHS.toLocaleString("en-GH", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
              {stats.weekChange !== 0 && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full
                  ${stats.weekChange > 0 ? "bg-green-900/40 text-green-400" : "bg-red-900/40 text-red-400"}`}
                >
                  {stats.weekChange > 0 ? "↑" : "↓"}
                  {Math.abs(stats.weekChange)}% WoW
                </span>
              )}
            </div>
            <p className="text-xs text-gray-600 mb-3">
              This month: ₵{fmt(stats.monthEarningsGHS)} · This week: ₵
              {fmt(stats.thisWeekGHS)}
            </p>
            {data.charts && (
              <EarningsChart data={data.charts.dailyEarnings} currency="GHS" />
            )}
            <p className="text-[10px] text-gray-700 mt-1 text-right">
              last 30 days
            </p>
          </div>

          {/* NGN earnings (shown always, greyed out if zero) */}
          <div className="bg-[#1a1a1a] border border-white/8 rounded-2xl p-4">
            <div className="flex items-start justify-between mb-1">
              <div>
                <p className="text-xs text-gray-500">Total earnings (NGN)</p>
                <p
                  className={`text-2xl font-black ${stats.totalEarningsNGN > 0 ? "text-green-400" : "text-gray-700"}`}
                >
                  ₦{Number(stats.totalEarningsNGN ?? 0).toLocaleString()}
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-600 mb-3">
              This month: ₦{fmt(stats.monthEarningsNGN)} · Pending: ₦
              {fmt(stats.pendingPayoutNGN)}
            </p>
            {data.charts && stats.totalEarningsNGN > 0 ? (
              <EarningsChart data={data.charts.dailyEarnings} currency="NGN" />
            ) : (
              <div className="flex items-center justify-center h-16 text-xs text-gray-700">
                Refer Nigerian vendors to earn ₦
              </div>
            )}
          </div>
        </div>

        {/* ── Plan breakdown ── */}
        {data.charts?.planBreakdown?.length > 0 && (
          <div className="bg-[#1a1a1a] border border-white/8 rounded-2xl p-4 mb-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              By plan referred
            </p>
            <div className="space-y-2">
              {data.charts.planBreakdown
                .sort((a, b) => b.count - a.count)
                .map((p) => {
                  const total = data.charts.planBreakdown.reduce(
                    (s, x) => s + x.count,
                    0,
                  );
                  const pct =
                    total > 0 ? Math.round((p.count / total) * 100) : 0;
                  return (
                    <div key={p.plan} className="flex items-center gap-3">
                      <span className="text-xs text-gray-400 capitalize w-24 flex-shrink-0">
                        {p.plan}
                      </span>
                      <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#ffc105] rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-gray-300 w-6 text-right">
                        {p.count}
                      </span>
                      {p.earningsGHS > 0 && (
                        <span className="text-[10px] text-[#ffc105] w-20 text-right">
                          ₵{Number(p.earningsGHS ?? 0).toFixed(2)}
                        </span>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* ── Tabs ── */}
        <div className="flex gap-1 bg-[#1a1a1a] border border-white/8 rounded-2xl p-1 mb-5">
          {(["overview", "commissions", "payout"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold capitalize transition
                ${
                  activeTab === t
                    ? "bg-[#ffc105] text-black"
                    : "text-gray-500 hover:text-white"
                }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* ── Overview tab ── */}
        {activeTab === "overview" && (
          <div className="space-y-4">
            <div className="bg-[#1a1a1a] border border-white/8 rounded-2xl p-5">
              <h3 className="font-bold text-sm mb-4">
                {stats.totalReferrals === 0
                  ? "Getting started guide"
                  : stats.weekChange < 0
                    ? "📉 Boost your referrals this week"
                    : "How to maximise your earnings"}
              </h3>
              <div className="space-y-3">
                {[
                  {
                    icon: "🎯",
                    text: "Target active businesses — restaurants, boutiques, car dealers, landlords posting rooms.",
                  },
                  {
                    icon: "📱",
                    text: "Share your code on WhatsApp status and social media to reach more potential vendors.",
                  },
                  {
                    icon: "🤝",
                    text: "Follow up with vendors you've referred to help them post their first listing — active vendors renew.",
                  },
                  {
                    icon: "📊",
                    text: "Check your dashboard weekly to see who converted and who might need a nudge.",
                  },
                ].map((tip, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <span className="text-base flex-shrink-0 mt-0.5">
                      {tip.icon}
                    </span>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      {tip.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#1a1a1a] border border-white/8 rounded-2xl p-5">
              <h3 className="font-bold text-sm mb-3">
                Subscription plans you can promote
              </h3>
              <div className="space-y-2">
                {[
                  {
                    name: "BasicSmile",
                    monthly: "GHS 99.99",
                    commission: "GHS 15.00",
                  },
                  {
                    name: "HappySmile ⭐",
                    monthly: "GHS 249.99",
                    commission: "GHS 37.50",
                  },
                  {
                    name: "SuperSmile",
                    monthly: "GHS 499.99",
                    commission: "GHS 75.00",
                  },
                ].map((p) => (
                  <div
                    key={p.name}
                    className="flex items-center justify-between py-2 border-b border-white/5 last:border-0"
                  >
                    <div>
                      <p className="text-sm font-medium text-white">{p.name}</p>
                      <p className="text-xs text-gray-500">{p.monthly}/month</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-[#ffc105]">
                        {p.commission}
                      </p>
                      <p className="text-xs text-gray-600">your cut</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Commissions tab ── */}
        {activeTab === "commissions" && (
          <div className="bg-[#1a1a1a] border border-white/8 rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-white/8 flex items-center justify-between">
              <h3 className="font-bold text-sm">Recent commissions</h3>
              <span className="text-xs text-gray-500">
                {recentCommissions.length} records
              </span>
            </div>

            {recentCommissions.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-3xl mb-3">📭</p>
                <p className="text-sm text-gray-500">No commissions yet.</p>
                <p className="text-xs text-gray-600 mt-1">
                  Start sharing your referral code!
                </p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {recentCommissions.map((c) => (
                  <div
                    key={c._id}
                    className="flex items-center justify-between px-5 py-4"
                  >
                    <div>
                      <p className="text-sm font-medium text-white capitalize">
                        {c.planId} · {c.billingCycle}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {formatDate(c.createdAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-[#ffc105]">
                        {c.currency === "NGN" ? "₦" : "₵"}
                        {Number(c.commission ?? 0).toFixed(2)}
                      </p>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-semibold
                        ${
                          c.paidOut
                            ? "bg-green-500/10 text-green-400"
                            : "bg-amber-500/10 text-amber-400"
                        }`}
                      >
                        {c.paidOut ? "Paid out" : "Pending"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Payout tab ── */}
        {activeTab === "payout" && (
          <div className="bg-[#1a1a1a] border border-white/8 rounded-2xl p-5 sm:p-6 space-y-4">
            <div>
              <h3 className="font-bold text-sm mb-1">Payout details</h3>
              <p className="text-xs text-gray-500">
                Payouts are processed weekly. Minimum: GHS 50 / NGN 5,000.
              </p>
            </div>

            {payoutMsg && (
              <div
                className={`px-4 py-2.5 rounded-xl text-xs font-medium
                ${
                  payoutMsg.includes("✓")
                    ? "bg-green-500/10 text-green-400 border border-green-500/20"
                    : "bg-red-500/10 text-red-400 border border-red-500/20"
                }`}
              >
                {payoutMsg}
              </div>
            )}

            <div>
              <label className={labelCls}>Payout method</label>
              <select
                value={payoutForm.payoutMethod}
                onChange={(e) =>
                  setPayoutForm((p) => ({ ...p, payoutMethod: e.target.value }))
                }
                className={inputCls}
              >
                <option value="">Select method</option>
                <option value="momo">Mobile Money (MoMo)</option>
                <option value="bank">Bank transfer</option>
              </select>
            </div>

            <div>
              <label className={labelCls}>Account name</label>
              <input
                placeholder="Name on account"
                value={payoutForm.accountName}
                onChange={(e) =>
                  setPayoutForm((p) => ({ ...p, accountName: e.target.value }))
                }
                className={inputCls}
              />
            </div>

            <div>
              <label className={labelCls}>Account number / MoMo number</label>
              <input
                placeholder="e.g. 0244 123 456"
                value={payoutForm.accountNumber}
                onChange={(e) =>
                  setPayoutForm((p) => ({
                    ...p,
                    accountNumber: e.target.value,
                  }))
                }
                className={inputCls}
              />
            </div>

            <div>
              <label className={labelCls}>Bank name / Mobile network</label>
              <input
                placeholder="e.g. GCB Bank or MTN"
                value={payoutForm.bankOrNetwork}
                onChange={(e) =>
                  setPayoutForm((p) => ({
                    ...p,
                    bankOrNetwork: e.target.value,
                  }))
                }
                className={inputCls}
              />
            </div>

            <button
              onClick={handleSavePayout}
              disabled={savingPayout}
              className="w-full py-3 bg-[#ffc105] text-black font-bold rounded-xl
                hover:bg-amber-300 transition disabled:opacity-50 text-sm active:scale-[0.99]"
            >
              {savingPayout ? "Saving…" : "Save payout details"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const inputCls = `w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2.5
  text-white text-sm placeholder:text-gray-700
  focus:outline-none focus:ring-2 focus:ring-[#ffc105] focus:border-transparent transition`;

const labelCls = "block text-xs font-semibold text-gray-400 mb-1.5";
