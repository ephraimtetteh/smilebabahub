"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Products } from "@/src/constants/data";
import { packages } from "@/src/constants/subscription";
import { useAppSelector } from "@/src/app/redux";
import { useSubscriptionGuard } from "@/src/hooks/useSubscriptionGuard";
import axiosInstance from "@/src/lib/api/axios";
import { assets } from "@/src/assets/assets";
import { toast } from "react-toastify";

// ── Currency config ────────────────────────────────────────────────────────
const PRICES: Record<string, Record<string, Record<string, number>>> = {
  Basic: { monthly: { GHS: 0, NGN: 0 }, yearly: { GHS: 0, NGN: 0 } },
  standard: {
    monthly: { GHS: 99.99, NGN: 650000 },
    yearly: { GHS: 1199.88, NGN: 7800000 },
  },
  popular: {
    monthly: { GHS: 249.99, NGN: 1800000 },
    yearly: { GHS: 2999.88, NGN: 21600000 },
  },
  premium: {
    monthly: { GHS: 499.99, NGN: 4999999 },
    yearly: { GHS: 5999.88, NGN: 59999988 },
  },
};

const CURRENCY_SYMBOLS: Record<string, string> = { GHS: "₵", NGN: "₦" };

const VendorBoost = () => {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [boostingId, setBoostingId] = useState<string | null>(null);

  const userCurrency =
    useAppSelector((state) => state.auth.user?.currency) ?? "GHS";
  const sym = CURRENCY_SYMBOLS[userCurrency] ?? "₵";

  const { guard, handleApiError } = useSubscriptionGuard();

  // ── Boost handler ──────────────────────────────────────────────────────
  const handleBoost = (productId: string) => {
    guard({ type: "boost_product", payload: { productId } }, async () => {
      try {
        setBoostingId(productId);
        await axiosInstance.post(`/listings/${productId}/boost`);
        toast.success(
          "Product boosted! 🚀 It will now appear higher in search results.",
        );
      } catch (err) {
        if (
          !handleApiError(err, {
            type: "boost_product",
            payload: { productId },
          })
        ) {
          toast.error("Failed to boost product. Please try again.");
        }
      } finally {
        setBoostingId(null);
      }
    });
  };

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto text-black">
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Subscription &amp; Boost
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Manage your plan and boost products to reach more buyers
          </p>
        </div>
        <span
          className="text-xs bg-gray-100 text-gray-500 px-3 py-1.5
          rounded-full font-medium hidden sm:block"
        >
          Prices in {userCurrency} ({sym})
        </span>
      </div>

      {/* ── Billing toggle ── */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-100 p-1 rounded-full flex gap-1">
          {(["monthly", "yearly"] as const).map((b) => (
            <button
              key={b}
              onClick={() => setBilling(b)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition capitalize
                ${
                  billing === b
                    ? "bg-[#ffc105] text-black shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
            >
              {b}
              {b === "yearly" && (
                <span
                  className="ml-1.5 text-[10px] bg-green-500 text-white
                  px-1.5 py-0.5 rounded-full font-bold"
                >
                  -20%
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Plans ── */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {packages.map((plan) => {
          const price = PRICES[plan.id]?.[billing]?.[userCurrency];
          const isFree = price === 0;
          const isPopular = plan.popular;

          return (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl p-5 border transition-all
                ${
                  isPopular
                    ? "border-[#ffc105] shadow-lg shadow-amber-50 scale-[1.02]"
                    : "border-gray-100 shadow-sm hover:shadow-md"
                }`}
            >
              {/* Popular badge */}
              {isPopular && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2
                  bg-[#ffc105] text-black text-[11px] font-black px-3 py-0.5
                  rounded-full whitespace-nowrap shadow-sm"
                >
                  ⭐ Most Popular
                </div>
              )}

              <h2 className="text-base font-black text-gray-900 capitalize mt-1">
                {plan.packageName}
              </h2>
              <p className="text-xs text-gray-400 mt-0.5 mb-3 leading-relaxed">
                {plan.text}
              </p>

              {/* Price */}
              <div className="mb-4 pb-4 border-b border-gray-100">
                {isFree ? (
                  <p className="text-2xl font-black text-gray-900">Free</p>
                ) : (
                  <p className="text-2xl font-black text-gray-900">
                    {sym}
                    {price?.toLocaleString()}
                    <span className="text-sm text-gray-400 font-normal ml-1">
                      /{billing === "monthly" ? "mo" : "yr"}
                    </span>
                  </p>
                )}
              </div>

              {/* Features */}
              <ul className="text-xs space-y-2 mb-5">
                {plan.includes.map((item, idx) => (
                  <li
                    key={idx}
                    className={`flex items-start gap-2
                      ${item.status === "no" ? "text-gray-300 line-through" : "text-gray-600"}`}
                  >
                    <span
                      className={`flex-shrink-0 mt-0.5
                      ${item.status === "yes" ? "text-amber-400" : "text-gray-300"}`}
                    >
                      {item.icon}
                    </span>
                    {item.package}
                  </li>
                ))}
              </ul>

              <Link
                href={`/subscription?plan=${plan.id}&billing=${billing}`}
                className={`block w-full py-2.5 rounded-xl text-sm font-bold text-center
                  transition active:scale-[0.99]
                  ${
                    isPopular
                      ? "bg-[#ffc105] text-black hover:bg-amber-400"
                      : "bg-gray-900 text-white hover:bg-gray-700"
                  }`}
              >
                {isFree ? "Get started" : "Subscribe"}
              </Link>
            </div>
          );
        })}
      </div>

      {/* ── Your products ── */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900">
          Your Products
        </h2>
        <Link
          href="/vendor/products"
          className="text-xs text-amber-600 hover:underline font-medium"
        >
          View all →
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {Products.slice(0, 9).map((item) => (
          <div
            key={item.id}
            className="bg-white shadow-sm border border-gray-100 rounded-2xl
              overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Image */}
            <div className="relative w-full h-44">
              <Image
                src={item.images?.[0] || assets.upload_area}
                fill
                alt={item.title ?? "product"}
                className="object-cover"
              />
            </div>

            {/* Info */}
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 text-sm truncate mb-0.5">
                {item.title}
              </h3>
              <p className="text-sm font-bold text-gray-900 mb-4">
                {sym}
                {Number(item.price).toLocaleString()}
              </p>

              <div className="flex gap-2">
                {/* Boost */}
                <button
                  onClick={() => handleBoost(String(item.id))}
                  disabled={boostingId === String(item.id)}
                  className="flex-1 py-2 bg-[#ffc105] text-black text-sm font-bold
                    rounded-xl hover:bg-amber-400 transition disabled:opacity-50
                    active:scale-95"
                >
                  {boostingId === String(item.id) ? (
                    <span className="flex items-center justify-center gap-1">
                      <span
                        className="w-3 h-3 border-2 border-black/30 border-t-black
                          rounded-full animate-spin inline-block"
                      />
                      Boosting…
                    </span>
                  ) : (
                    "🚀 Boost"
                  )}
                </button>

                {/* Promote */}
                <Link
                  href={`/vendor/settings?tab=promotion&product=${item.id}`}
                  className="flex-1 py-2 bg-transparent border border-[#ffc105]
                    text-amber-600 text-sm font-bold rounded-xl hover:bg-amber-50
                    transition text-center active:scale-95"
                >
                  📣 Ad
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VendorBoost;
