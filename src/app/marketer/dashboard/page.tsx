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

    const es = new EventSource(`${sseBase}/marketers/stream`, {
      withCredentials: true,
    });
    esRef.current = es;

    es.addEventListener("stats-update", () => {
      // Re-fetch when backend signals a new commission
      fetchDashboard();
    });

    es.onerror = () => es.close();

    return () => es.close();
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

  const { marketer, recentCommissions, stats } = data;
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
              Share this code with vendors. They get 20% off, you earn 20%
              commission.
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
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
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
            {
              label: "Earnings (GHS)",
              value: `₵${stats.totalEarningsGHS.toFixed(2)}`,
              icon: "💰",
            },
            {
              label: "Pending payout",
              value: `₵${stats.pendingPayoutGHS.toFixed(2)}`,
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

        {/* NGN earnings row (shown only if non-zero) */}
        {stats.totalEarningsNGN > 0 && (
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-[#1a1a1a] border border-white/8 rounded-2xl p-4">
              <p className="text-xl mb-1">💰</p>
              <p className="text-2xl font-black text-white">
                ₦{stats.totalEarningsNGN.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                Total earnings (NGN)
              </p>
            </div>
            <div className="bg-[#1a1a1a] border border-white/8 rounded-2xl p-4">
              <p className="text-xl mb-1">⏳</p>
              <p className="text-2xl font-black text-white">
                ₦{stats.pendingPayoutNGN.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                Pending payout (NGN)
              </p>
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
                How to maximise your earnings
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
                    monthly: "GHS 49.99",
                    commission: "GHS 10.00",
                  },
                  {
                    name: "HappySmile ⭐",
                    monthly: "GHS 74.99",
                    commission: "GHS 15.00",
                  },
                  {
                    name: "SuperSmile",
                    monthly: "GHS 99.99",
                    commission: "GHS 20.00",
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
                        {c.commission.toFixed(2)}
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
