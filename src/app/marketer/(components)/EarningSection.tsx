// src/components/marketer/EarningsSection.tsx
// Drop-in replacement for the "What can you earn?" section
// on the marketer registration / landing page.
//
// COMMISSION MECHANIC (from paymentController.js):
//   - Vendor pays 80% of the plan's full price (20% discount as incentive)
//   - Marketer earns 20% of the plan's ORIGINAL (undiscounted) full price
//   - Example (HappySmile monthly, Ghana):
//       Full price:       ₵249.99
//       Vendor pays:      ₵199.99  (×0.80)
//       Marketer earns:   ₵50.00   (×0.20 of full price)

"use client";

import React from "react";
import { useAppSelector } from "@/src/app/redux";
import { Info, TrendingUp, Repeat } from "lucide-react";

// ── Plan data (mirrors config/pricing.js exactly) ──────────────────────────
const PLANS = {
  popular: {
    name: "HappySmile",
    monthly: { GHS: 249.99, NGN: 1_800_000 },
    yearly: { GHS: 2999.88, NGN: 21_600_000 },
  },
} as const;

const COMMISSION_RATE = 0.15; // 15% of the full undiscounted price
const REFERRAL_COUNTS = [5, 10, 20] as const;

// ── Formatters ──────────────────────────────────────────────────────────────
function fmt(n: number, sym: string) {
  if (n >= 1_000_000) return `${sym}${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)
    return `${sym}${(n / 1_000).toFixed(n % 1_000 === 0 ? 0 : 1)}K`;
  return `${sym}${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// ── Component ───────────────────────────────────────────────────────────────
export default function EarningsSection() {
  const user = useAppSelector((s) => s.auth.user);
  const currency = user?.currency ?? "GHS";
  const sym = currency === "NGN" ? "₦" : "₵";
  const flag = currency === "NGN" ? "🇳🇬" : "🇬🇭";
  const code = currency === "NGN" ? "NGN" : "GHS";

  const plan = PLANS.popular;
  const fullMonthly = plan.monthly[currency as "GHS" | "NGN"];
  const fullYearly = plan.yearly[currency as "GHS" | "NGN"];

  // Per-referral commission = 20% of the full undiscounted plan price
  const commissionPerReferralMonthly = +(fullMonthly * COMMISSION_RATE).toFixed(
    2,
  );
  const commissionPerReferralYearly = +(fullYearly * COMMISSION_RATE).toFixed(
    2,
  );

  // What the vendor actually pays (80% of full price)
  const vendorPays = +(fullMonthly * (1 - COMMISSION_RATE)).toFixed(2);

  const rows = REFERRAL_COUNTS.map((n) => ({
    referrals: n,
    monthly: fmt(commissionPerReferralMonthly * n, sym),
    yearly: fmt(commissionPerReferralYearly * n, sym),
  }));

  return (
    <section className="px-6 sm:px-12 py-20 bg-[#161616] border-b border-white/5">
      <div className="max-w-2xl mx-auto text-center">
        {/* Label */}
        <p className="text-[#ffc105] text-xs font-semibold uppercase tracking-widest mb-3">
          Earnings potential
        </p>

        {/* Heading */}
        <h2
          className="text-3xl sm:text-4xl font-black text-white mb-4"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          What can you earn?
        </h2>

        {/* ── Commission mechanic explanation ─────────────────────────── */}
        <div
          className="bg-[#1a1a1a] border border-white/8 rounded-2xl p-5
          mb-6 text-left space-y-3"
        >
          {/* How it works header */}
          <div
            className="flex items-center gap-2 text-[#ffc105] text-xs
            font-bold uppercase tracking-wider"
          >
            <Info size={13} />
            How your commission works
          </div>

          {/* Step-by-step breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
            {/* Step 1 */}
            <div className="bg-[#232323] rounded-xl p-4">
              <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-1">
                Full plan price
              </p>
              <p className="text-xl font-black text-white">
                {sym}
                {fullMonthly.toLocaleString()}
              </p>
              <p className="text-[11px] text-gray-500 mt-0.5">
                {plan.name} / month ({code})
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-[#232323] rounded-xl p-4">
              <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-1">
                Vendor pays
              </p>
              <p className="text-xl font-black text-green-400">
                {sym}
                {vendorPays.toLocaleString()}
              </p>
              <p className="text-[11px] text-gray-500 mt-0.5">
                20% discount applied
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-[#1e1a0e] border border-[#ffc105]/20 rounded-xl p-4">
              <p className="text-[10px] text-[#ffc105]/70 uppercase tracking-wide mb-1">
                You earn
              </p>
              <p className="text-xl font-black text-[#ffc105]">
                {fmt(commissionPerReferralMonthly, sym)}
              </p>
              <p className="text-[11px] text-[#ffc105]/60 mt-0.5">
                per referral / month
              </p>
            </div>
          </div>

          {/* Plain-language note */}
          <p className="text-xs text-gray-500 leading-relaxed pt-1">
            <span className="text-gray-300 font-semibold">
              Your 15% commission
            </span>{" "}
            is calculated on the plan`s{" "}
            <span className="text-white">full price</span> — not the discounted
            amount your referred vendor pays. So everyone wins: the vendor saves
            15%, and you earn 15%.
          </p>
        </div>

        {/* ── Scale heading ─────────────────────────────────────────────── */}
        <div
          className="flex items-center justify-center gap-2 text-sm
          text-gray-400 mb-5"
        >
          <TrendingUp size={15} className="text-[#ffc105]" />
          The more you refer, the more you earn every month
        </div>

        {/* ── Earnings table ────────────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-5">
          {rows.map((row) => (
            <div
              key={row.referrals}
              className="bg-[#1a1a1a] border border-white/8 rounded-2xl p-5 text-center
                hover:border-[#ffc105]/30 transition-colors"
            >
              <p
                className="text-3xl font-black text-[#ffc105] leading-none"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                {row.referrals}
              </p>
              <p className="text-xs text-gray-500 mb-4 mt-0.5">
                active vendors
              </p>

              <div className="space-y-2">
                <div>
                  <p className="text-base font-black text-white">
                    {row.monthly}
                  </p>
                  <p className="text-[10px] text-gray-500">
                    commission / month
                  </p>
                </div>
                <div className="border-t border-white/5 pt-2">
                  <p className="text-base font-black text-[#ffc105]">
                    {row.yearly}
                  </p>
                  <p className="text-[10px] text-gray-500">commission / year</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Recurring note ────────────────────────────────────────────── */}
        <div
          className="flex items-start gap-2.5 bg-[#1a1a1a] border
          border-[#ffc105]/20 rounded-xl px-4 py-3 text-left mb-5"
        >
          <Repeat size={14} className="text-[#ffc105] flex-shrink-0 mt-0.5" />
          <p className="text-xs text-gray-400 leading-relaxed">
            <span className="text-white font-semibold">
              Commissions are recurring.
            </span>{" "}
            As long as a vendor you referred keeps their subscription active,
            you earn your 15% commission every billing period — month after
            month, or year after year.
          </p>
        </div>

        {/* ── Footer note ───────────────────────────────────────────────── */}
        <p className="text-xs text-gray-600">
          {flag} Amounts shown in {code} · Based on the {plan.name} plan · Your
          location
        </p>
      </div>
    </section>
  );
}
