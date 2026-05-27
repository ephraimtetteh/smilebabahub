"use client";

// src/app/promote/page.tsx — Promote landing page
//
// Sections:
//   - Hero with live stats (pulled from GET /promote/stats)
//   - Tier picker (pulled from GET /promote/pricing)
//   - "How it works" 3-step illustration
//   - Social proof / FAQ
// Calls-to-action route to /promote/submit?tier=growth

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Radio,
  Tv2,
  Share2,
  Users,
  ChevronLeft,
  CheckCircle2,
  Upload,
  FileVideo,
  Megaphone,
  Star,
  Tv,
  ArrowRight,
  Loader2,
} from "lucide-react";
import axiosInstance from "@/src/lib/api/axios";
import { useAppSelector } from "@/src/app/redux";
import type { PromoTierDef, PromoStats } from "./components/types";

export default function PromoteLanding() {
  const router = useRouter();
  const user = useAppSelector((s) => s.auth?.user);
  const country = user?.country ?? "Ghana";
  const currency = country === "Nigeria" ? "NGN" : "GHS";
  const sym = currency === "NGN" ? "₦" : "₵";

  const [tiers, setTiers] = useState<PromoTierDef[]>([]);
  const [stats, setStats] = useState<PromoStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Load tiers + live stats in parallel
  useEffect(() => {
    Promise.all([
      axiosInstance.get(`/promote/pricing?currency=${currency}`),
      axiosInstance.get("/promote/stats").catch(() => null),
    ])
      .then(([pricingRes, statsRes]) => {
        setTiers(pricingRes.data.tiers ?? []);
        if (statsRes) setStats(statsRes.data);
      })
      .finally(() => setLoading(false));
  }, [currency]);

  const formatNum = (n: number) => {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M+`;
    if (n >= 1_000) return `${Math.round(n / 1_000)}K+`;
    return n.toLocaleString();
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-orange-600 via-red-600 to-pink-700 text-white">
        <div className="max-w-[1340px] mx-auto px-3 sm:px-4 py-10 sm:py-14">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-xs text-white/70
              hover:text-white mb-4 font-medium"
          >
            <ChevronLeft size={14} /> Back to home
          </Link>

          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <span
                className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur
                border border-white/20 text-yellow-200 text-xs font-bold
                px-3 py-1 rounded-full mb-4"
              >
                <Sparkles size={11} /> Promote your business
              </span>

              <h1 className="text-3xl sm:text-5xl font-black leading-tight mb-3">
                Get your brand in front of{" "}
                <span className="text-yellow-300">thousands</span> across Africa
              </h1>

              <p className="text-white/80 text-sm sm:text-base leading-relaxed max-w-xl mb-5">
                Upload your promo video and get featured across SmileBaba Radio,
                Smile Time Africa TV, and our social media channels — all in one
                plan.
              </p>

              <div className="flex flex-wrap gap-2 mb-5">
                {[
                  { icon: <Tv2 size={11} />, label: "Live TV" },
                  { icon: <Radio size={11} />, label: "Radio Ads" },
                  { icon: <Share2 size={11} />, label: "Social Media" },
                  {
                    icon: <Users size={11} />,
                    label: stats
                      ? `${formatNum(stats.businessesPromoting)} businesses`
                      : "2,400+ businesses",
                  },
                ].map((t) => (
                  <span
                    key={t.label}
                    className="inline-flex items-center gap-1.5
                    bg-white/10 backdrop-blur text-white text-[11px] font-bold
                    px-2.5 py-1 rounded-full"
                  >
                    {t.icon} {t.label}
                  </span>
                ))}
              </div>

              <Link
                href="/promote/submit"
                className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300
                  text-black font-black px-6 py-3 rounded-2xl text-sm transition
                  active:scale-95 shadow-xl"
              >
                Start promoting <ArrowRight size={14} />
              </Link>
            </div>

            {/* Live stats card */}
            <div className="bg-white/10 backdrop-blur border border-white/20 rounded-3xl p-6">
              <p className="text-xs text-yellow-200 font-bold tracking-wider mb-4">
                ★ REAL RESULTS
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    value: stats ? formatNum(stats.monthlyViews) : "2.4M+",
                    label: "Monthly views",
                    emoji: "👀",
                  },
                  {
                    value: stats ? formatNum(stats.activeListeners) : "180K+",
                    label: "Active listeners",
                    emoji: "🎧",
                  },
                  {
                    value: stats ? `${stats.engagementRate}%` : "65%",
                    label: "Engagement rate",
                    emoji: "📈",
                  },
                  {
                    value: stats ? `${stats.avgGoLiveHours}hr` : "48hr",
                    label: "Avg go-live time",
                    emoji: "⚡",
                  },
                ].map((s) => (
                  <div key={s.label} className="bg-white/10 rounded-2xl p-4">
                    <p className="text-3xl mb-1">{s.emoji}</p>
                    <p className="text-2xl font-black text-yellow-300">
                      {s.value}
                    </p>
                    <p className="text-[10px] text-white/70 mt-0.5">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING ──────────────────────────────────────────────────── */}
      <section className="max-w-[1340px] mx-auto px-3 sm:px-4 py-8 sm:py-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">
            Choose your reach
          </h2>
          <p className="text-sm text-gray-500">
            One plan covers Radio, TV and Social. No setup fees.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 size={28} className="animate-spin text-yellow-500" />
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {tiers.map((tier) => (
              <Link
                key={tier.id}
                href={`/promote/submit?tier=${tier.id}`}
                className={`relative text-left bg-white rounded-2xl p-6
                  border-2 transition group hover:-translate-y-1 hover:shadow-xl
                  ${
                    tier.badge === "Most Popular"
                      ? "border-yellow-400 scale-105 shadow-lg"
                      : "border-gray-100 hover:border-yellow-200"
                  }`}
              >
                {tier.badge && (
                  <span
                    className="absolute -top-2 right-4 bg-yellow-400 text-black
                    text-[10px] font-black px-2 py-0.5 rounded-full"
                  >
                    {tier.badge}
                  </span>
                )}

                <h3 className="text-lg font-black text-gray-900 mb-1">
                  {tier.label}
                </h3>
                <p className="text-3xl font-black text-gray-900 mb-1">
                  {sym}
                  {tier.price.toLocaleString()}
                </p>
                <p className="text-[10px] text-gray-400 mb-4">
                  {tier.days} days · One-time payment
                </p>

                <ul className="space-y-2 text-xs text-gray-600 mb-5">
                  {tier.perks.map((perk) => (
                    <li key={perk} className="flex items-start gap-1.5">
                      <CheckCircle2
                        size={13}
                        className="text-green-500 flex-shrink-0 mt-0.5"
                      />
                      {perk}
                    </li>
                  ))}
                </ul>

                <div
                  className={`w-full py-2.5 rounded-xl text-xs font-black text-center
                  transition
                  ${
                    tier.badge === "Most Popular"
                      ? "bg-yellow-400 text-black"
                      : "bg-gray-100 text-gray-700 group-hover:bg-gray-900 group-hover:text-yellow-400"
                  }`}
                >
                  Get started →
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────── */}
      <section className="bg-white py-10 sm:py-14">
        <div className="max-w-[1340px] mx-auto px-3 sm:px-4">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 text-center mb-2">
            How it works
          </h2>
          <p className="text-sm text-gray-500 text-center mb-8">
            From upload to airing in under 48 hours
          </p>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                n: 1,
                emoji: "🎥",
                title: "Upload your video",
                desc: "30-90 seconds works best. We accept MP4, MOV, WebM.",
              },
              {
                n: 2,
                emoji: "👀",
                title: "Quick review",
                desc: "Our team checks quality and sends a payment link in 24-48hr.",
              },
              {
                n: 3,
                emoji: "🚀",
                title: "Go live",
                desc: "Pay, and within 48hr you're on TV, Radio, and Social.",
              },
            ].map((s) => (
              <div key={s.n} className="text-center">
                <div
                  className="w-16 h-16 mx-auto bg-yellow-100 rounded-3xl
                  flex items-center justify-center mb-3 text-3xl"
                >
                  {s.emoji}
                </div>
                <p className="text-xs font-black text-yellow-600 tracking-wider mb-1">
                  STEP {s.n}
                </p>
                <h3 className="font-black text-gray-900 mb-1">{s.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── REACH BREAKDOWN ─────────────────────────────────────────── */}
      <section className="max-w-[1340px] mx-auto px-3 sm:px-4 py-10 sm:py-14">
        <h2 className="text-2xl sm:text-3xl font-black text-gray-900 text-center mb-8">
          Where your video will appear
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              emoji: "📺",
              title: "Smile Time TV",
              desc: "Between live programming and shows",
            },
            {
              emoji: "📻",
              title: "Smile Radio",
              desc: "Daily rotations and voiceover ads",
            },
            {
              emoji: "📱",
              title: "Social Media",
              desc: "Facebook, Instagram, TikTok, YouTube",
            },
            {
              emoji: "🌐",
              title: "SmileBaba Hub",
              desc: "Featured on homepage and ads pages",
            },
          ].map((s) => (
            <div
              key={s.title}
              className="bg-white border border-gray-100 rounded-2xl p-5
                hover:shadow-md transition"
            >
              <div className="text-3xl mb-2">{s.emoji}</div>
              <p className="font-black text-gray-900 mb-1">{s.title}</p>
              <p className="text-xs text-gray-500">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── BOTTOM CTA ──────────────────────────────────────────────── */}
      <section className="bg-gray-900 text-white">
        <div className="max-w-[1340px] mx-auto px-3 sm:px-4 py-10 sm:py-14 text-center">
          <h2 className="text-2xl sm:text-3xl font-black mb-3">
            Ready to grow your brand?
          </h2>
          <p className="text-sm text-gray-400 max-w-md mx-auto mb-6">
            Join thousands of African businesses promoting on SmileBaba.
          </p>
          <Link
            href="/promote/submit"
            className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300
              text-black font-black px-6 py-3 rounded-2xl text-sm transition
              active:scale-95 shadow-xl"
          >
            <Sparkles size={14} /> Start your campaign
          </Link>
        </div>
      </section>
    </main>
  );
}
