"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useAppSelector } from "@/src/app/redux";

// ── Currency config ────────────────────────────────────────────────────────
type CurrencyConfig = {
  code: string;
  symbol: string;
  flag: string;
  label: string;
  // HappySmile plan prices
  planMonthly: number;
  planYearly: number;
  // Minimum payout
  minPayout: string;
  // Payout methods available
  payoutNote: string;
};

const CURRENCY: Record<string, CurrencyConfig> = {
  GHS: {
    code: "GHS",
    symbol: "₵",
    flag: "🇬🇭",
    label: "Ghana",
    planMonthly: 74.99,
    planYearly: 899.99,
    minPayout: "₵50",
    payoutNote: "MTN MoMo, Vodafone Cash, AirtelTigo Money or bank transfer",
  },
  NGN: {
    code: "NGN",
    symbol: "₦",
    flag: "🇳🇬",
    label: "Nigeria",
    planMonthly: 44999,
    planYearly: 539994,
    minPayout: "₦5,000",
    payoutNote: "OPay, PalmPay or bank transfer",
  },
};

const DEFAULT_CURRENCY = CURRENCY.GHS;

function useCurrency(): CurrencyConfig {
  const userCurrency = useAppSelector((state) => state.auth.user?.currency);
  return CURRENCY[userCurrency ?? "GHS"] ?? DEFAULT_CURRENCY;
}

// ── Earnings rows ──────────────────────────────────────────────────────────
function earningsRows(cfg: CurrencyConfig) {
  const commission = 0.2;
  return [5, 20, 50].map((n) => ({
    referrals: n,
    monthly: `${cfg.symbol}${(cfg.planMonthly * n * commission).toLocaleString()}`,
    yearly: `${cfg.symbol}${(cfg.planYearly * n * commission).toLocaleString()}`,
  }));
}

// ── Static content ─────────────────────────────────────────────────────────
const DUTIES = [
  {
    step: "01",
    title: "Know the product",
    desc: "Understand what SmileBaba offers — food, apartments, marketplace listings — so you can explain the value confidently to vendors.",
  },
  {
    step: "02",
    title: "Find vendors",
    desc: "Talk to business owners, market traders, restaurant owners, landlords, and service providers who could benefit from listing online.",
  },
  {
    step: "03",
    title: "Share your code",
    desc: "Give vendors your unique referral code (e.g. SMB-KWAME-4X9Z) to enter during subscription checkout.",
  },
  {
    step: "04",
    title: "Support onboarding",
    desc: "Help vendors understand how to post their first listing. A vendor who is active is more likely to renew.",
  },
  {
    step: "05",
    title: "Track & grow",
    desc: "Monitor your dashboard to see which referrals converted. Focus your energy where it works best.",
  },
];

// ── Component ──────────────────────────────────────────────────────────────
export default function MarketerLandingPage() {
  const cfg = useCurrency();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Benefits built with dynamic currency values
  const BENEFITS = [
    {
      icon: "💰",
      title: "20% commission",
      desc: `Earn 20% on every subscription payment made by vendors you refer. That's ${cfg.symbol}${(cfg.planMonthly * 0.2).toFixed(2)} per HappySmile monthly referral.`,
    },
    {
      icon: "🔁",
      title: "Recurring income",
      desc: "When a vendor renews their subscription, you earn again. One referral can pay you month after month.",
    },
    {
      icon: "📊",
      title: "Live dashboard",
      desc: "Track every referral, commission, and payout in real time from your marketer dashboard.",
    },
    {
      icon: "🚀",
      title: "Instant code",
      desc: "Your personalised referral code is generated the moment you register. Start sharing immediately.",
    },
    {
      icon: cfg.flag,
      title: `Earn in ${cfg.code}`,
      desc: `All commissions are paid in ${cfg.code} (${cfg.symbol}) directly to your ${cfg.payoutNote}.`,
    },
    {
      icon: "🎯",
      title: "No cap on earnings",
      desc: "Refer as many vendors as you want. There is no limit on how much you can earn.",
    },
  ];

  const FAQS = [
    {
      q: "When do I get paid?",
      a: `Commissions are credited instantly when a vendor's payment is confirmed. Payouts are processed weekly to your ${cfg.payoutNote}.`,
    },
    {
      q: "What if a vendor doesn't use my code?",
      a: "The vendor must enter your referral code at checkout. Make sure you give them the code before they subscribe. We cannot retrospectively apply codes.",
    },
    {
      q: "Do I earn on renewals?",
      a: "Yes. Every time a vendor you referred renews their subscription, you earn 20% of that payment.",
    },
    {
      q: "Is there a minimum payout?",
      a: `Yes — ${cfg.minPayout}. Earnings below this threshold roll over to the next payout cycle.`,
    },
    {
      q: "Can I be both a vendor and a marketer?",
      a: "Yes. You can hold both roles. Use a separate email for your marketer account.",
    },
    {
      q: "What currency are commissions paid in?",
      a: `Commissions are paid in ${cfg.code} (${cfg.symbol}) based on your registered location. Ghana marketers earn in GHS, Nigeria marketers earn in NGN.`,
    },
  ];

  const rows = earningsRows(cfg);

  return (
    <div
      className="min-h-screen bg-[#111] text-white"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* ── Nav ── */}
      <nav className="flex items-center justify-between px-6 sm:px-12 py-5 border-b border-white/5">
        <Link href="/" className="text-lg font-bold">
          Smile<span className="text-[#ffc105]">Baba</span>
          <span className="text-xs ml-2 text-gray-500 font-normal">
            Marketers
          </span>
        </Link>

        {/* Currency indicator */}
        <span
          className="hidden sm:flex items-center gap-1.5 text-xs text-gray-500
          bg-white/5 border border-white/10 px-3 py-1.5 rounded-full"
        >
          {cfg.flag} {cfg.code}
        </span>

        <div className="flex items-center gap-3">
          <Link
            href="/marketer/login"
            className="text-sm text-gray-400 hover:text-white transition px-4 py-2"
          >
            Log in
          </Link>
          <Link
            href="/marketer/register"
            className="text-sm bg-[#ffc105] text-black font-bold px-5 py-2 rounded-full
              hover:bg-amber-300 transition active:scale-95"
          >
            Get started
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative px-6 sm:px-12 pt-20 pb-24 overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px]
          bg-[#ffc105]/10 rounded-full blur-[120px] pointer-events-none"
        />

        <div className="relative max-w-3xl mx-auto text-center">
          <div
            className="inline-flex items-center gap-2 bg-[#ffc105]/10 border border-[#ffc105]/20
            text-[#ffc105] text-xs font-semibold px-4 py-1.5 rounded-full mb-6 tracking-wide"
          >
            🤝 Join the SmileBaba Marketer Network · {cfg.flag} {cfg.label}
          </div>

          <h1
            className="text-4xl sm:text-6xl font-black leading-[1.05] mb-6"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Earn money referring
            <br />
            <span className="text-[#ffc105]">vendors to SmileBaba</span>
          </h1>

          <p className="text-gray-400 text-lg sm:text-xl max-w-xl mx-auto mb-10 leading-relaxed">
            Get your unique referral code, share it with business owners, and
            earn
            <strong className="text-white"> 20% commission</strong> on every
            subscription — paid in{" "}
            <strong className="text-white">{cfg.code}</strong> with no cap on
            earnings.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/marketer/register"
              className="px-8 py-4 bg-[#ffc105] text-black font-black rounded-2xl
                hover:bg-amber-300 transition active:scale-95 text-sm"
            >
              Register as a marketer →
            </Link>
            <Link
              href="#how-it-works"
              className="px-8 py-4 bg-white/5 border border-white/10 text-white font-medium
                rounded-2xl hover:bg-white/10 transition text-sm"
            >
              How it works
            </Link>
          </div>
        </div>

        {/* Stats strip */}
        <div className="relative max-w-2xl mx-auto mt-16 grid grid-cols-3 gap-4">
          {[
            { value: "20%", label: "Commission per sale" },
            { value: "Weekly", label: "Payout frequency" },
            { value: cfg.code, label: "Paid in" },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center"
            >
              <p className="text-2xl sm:text-3xl font-black text-[#ffc105]">
                {s.value}
              </p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section
        id="how-it-works"
        className="px-6 sm:px-12 py-20 border-t border-white/5"
      >
        <div className="max-w-4xl mx-auto">
          <p className="text-[#ffc105] text-xs font-semibold uppercase tracking-widest mb-3">
            Simple process
          </p>
          <h2
            className="text-3xl sm:text-4xl font-black mb-12"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            How it works
          </h2>

          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                n: "1",
                icon: "📋",
                title: "Register",
                desc: "Create your marketer account in under 2 minutes and receive your unique referral code instantly.",
              },
              {
                n: "2",
                icon: "📣",
                title: "Refer vendors",
                desc: `Share your code with business owners. They enter it at checkout and get 20% off their subscription.`,
              },
              {
                n: "3",
                icon: "💸",
                title: "Earn & withdraw",
                desc: `Commissions credit instantly to your dashboard in ${cfg.code}. Withdraw weekly via ${cfg.payoutNote}.`,
              },
            ].map((s) => (
              <div
                key={s.n}
                className="relative bg-[#1a1a1a] border border-white/8 rounded-2xl p-6 overflow-hidden"
              >
                <div
                  className="absolute top-4 right-4 text-5xl font-black text-white/5
                  select-none"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  {s.n}
                </div>
                <div className="text-3xl mb-4">{s.icon}</div>
                <h3 className="font-bold text-white mb-2">{s.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Benefits ── */}
      <section className="px-6 sm:px-12 py-20 bg-[#161616] border-y border-white/5">
        <div className="max-w-4xl mx-auto">
          <p className="text-[#ffc105] text-xs font-semibold uppercase tracking-widest mb-3">
            Why join
          </p>
          <h2
            className="text-3xl sm:text-4xl font-black mb-12"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Benefits of being a<br />
            SmileBaba marketer
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {BENEFITS.map((b) => (
              <div
                key={b.title}
                className="bg-[#1a1a1a] border border-white/8 rounded-2xl p-5
                  hover:border-[#ffc105]/30 transition group"
              >
                <div className="text-2xl mb-3">{b.icon}</div>
                <h3 className="font-bold text-white mb-1.5 group-hover:text-[#ffc105] transition">
                  {b.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {b.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Duties ── */}
      <section className="px-6 sm:px-12 py-20 border-b border-white/5">
        <div className="max-w-4xl mx-auto">
          <p className="text-[#ffc105] text-xs font-semibold uppercase tracking-widest mb-3">
            Your responsibilities
          </p>
          <h2
            className="text-3xl sm:text-4xl font-black mb-12"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Marketer duties
          </h2>

          <div className="space-y-4">
            {DUTIES.map((d) => (
              <div
                key={d.step}
                className="flex gap-5 bg-[#1a1a1a] border border-white/8 rounded-2xl p-5
                  hover:border-[#ffc105]/20 transition"
              >
                <div
                  className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#ffc105]/10
                  border border-[#ffc105]/20 flex items-center justify-center
                  text-[#ffc105] font-black text-sm"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  {d.step}
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1">{d.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {d.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Earnings calculator ── */}
      <section className="px-6 sm:px-12 py-20 bg-[#161616] border-b border-white/5">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-[#ffc105] text-xs font-semibold uppercase tracking-widest mb-3">
            Earnings potential
          </p>
          <h2
            className="text-3xl sm:text-4xl font-black mb-4"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            What can you earn?
          </h2>
          <p className="text-gray-400 text-sm mb-10">
            Based on the HappySmile plan at{" "}
            <span className="text-white font-semibold">
              {cfg.symbol}
              {cfg.planMonthly.toLocaleString()}/{cfg.code} per month
            </span>{" "}
            — our most popular plan {cfg.flag}
          </p>

          <div className="grid grid-cols-3 gap-4">
            {rows.map((row) => (
              <div
                key={row.referrals}
                className="bg-[#1a1a1a] border border-white/8 rounded-2xl p-5 text-center"
              >
                <p
                  className="text-3xl font-black text-[#ffc105]"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  {row.referrals}
                </p>
                <p className="text-xs text-gray-500 mb-3">active vendors</p>
                <p className="text-sm font-bold text-white">{row.monthly}</p>
                <p className="text-xs text-gray-500">/ month</p>
                <p className="text-sm font-bold text-[#ffc105] mt-2">
                  {row.yearly}
                </p>
                <p className="text-xs text-gray-500">/ year</p>
              </div>
            ))}
          </div>

          {/* Currency toggle hint */}
          <p className="text-xs text-gray-600 mt-6">
            {cfg.flag} Amounts shown in {cfg.code} · based on your location
          </p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="px-6 sm:px-12 py-20 border-b border-white/5">
        <div className="max-w-2xl mx-auto">
          <p className="text-[#ffc105] text-xs font-semibold uppercase tracking-widest mb-3">
            FAQs
          </p>
          <h2
            className="text-3xl font-black mb-10"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Common questions
          </h2>

          <div className="space-y-2">
            {FAQS.map((faq, i) => (
              <div
                key={i}
                className="bg-[#1a1a1a] border border-white/8 rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4
                    text-left hover:bg-white/5 transition"
                >
                  <span className="text-sm font-medium text-white pr-4">
                    {faq.q}
                  </span>
                  <span
                    className={`text-[#ffc105] text-lg flex-shrink-0 transition-transform
                    duration-200 ${openFaq === i ? "rotate-45" : ""}`}
                  >
                    +
                  </span>
                </button>
                {openFaq === i && (
                  <div
                    className="px-5 pb-4 text-sm text-gray-400 leading-relaxed
                    border-t border-white/5 pt-4"
                  >
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-6 sm:px-12 py-24">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-5xl mb-6">💰</div>
          <h2
            className="text-3xl sm:text-4xl font-black mb-4"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Ready to start earning?
          </h2>
          <p className="text-gray-400 text-sm mb-2">
            Register in under 2 minutes. Your referral code is waiting.
          </p>
          <p className="text-xs text-gray-600 mb-8">
            {cfg.flag} Earnings paid in {cfg.code} · {cfg.payoutNote}
          </p>
          <Link
            href="/marketer/register"
            className="inline-block px-10 py-4 bg-[#ffc105] text-black font-black
              rounded-2xl hover:bg-amber-300 transition active:scale-95 text-sm"
          >
            Create marketer account →
          </Link>
          <p className="text-xs text-gray-600 mt-4">
            Already registered?{" "}
            <Link
              href="/marketer/login"
              className="text-[#ffc105] hover:underline"
            >
              Log in to your dashboard
            </Link>
          </p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        className="border-t border-white/5 px-6 sm:px-12 py-6 flex flex-col sm:flex-row
        items-center justify-between gap-2"
      >
        <p className="text-xs text-gray-600">
          © {new Date().getFullYear()} SmileBaba Hub · All rights reserved
        </p>
        <p className="text-xs text-gray-600">
          {cfg.flag} Serving Ghana & Nigeria
        </p>
      </footer>
    </div>
  );
}
