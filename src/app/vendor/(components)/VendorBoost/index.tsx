"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { packages } from "@/src/constants/subscription";
import { useAppSelector } from "@/src/app/redux";
import { useSubscriptionGuard } from "@/src/hooks/useSubscriptionGuard";
import axiosInstance from "@/src/lib/api/axios";
import { assets } from "@/src/assets/assets";
import { useProducts } from "@/src/hooks/useProducts";
import { getCoverImage } from "@/src/types/product.types";
import { toast } from "react-toastify";
import { Star, Package, Zap, Megaphone, X, TrendingUp } from "lucide-react";

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

type BoostTier = {
  id: string;
  label: string;
  desc: string;
  days: number;
  display: string;
};
const TIER_ICON: Record<string, React.ReactNode> = {
  standard: <Zap size={18} className="text-amber-500" />,
  featured: <TrendingUp size={18} className="text-blue-500" />,
  premium: <Star size={18} className="text-purple-500 fill-purple-400" />,
};

// ── Boost tier modal ───────────────────────────────────────────────────────
function BoostModal({
  adId,
  currency,
  onClose,
}: {
  adId: string;
  currency: string;
  onClose: () => void;
}) {
  const [tiers, setTiers] = useState<BoostTier[]>([]);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState<string | null>(null);
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);

  // Perform the actual redirect outside of the async handler
  // so it doesn't trigger the immutability lint rule
  useEffect(() => {
    if (redirectUrl) {
      window.location.assign(redirectUrl);
    }
  }, [redirectUrl]);

  useEffect(() => {
    axiosInstance
      .get(`/payments/boost/pricing?currency=${currency}`)
      .then((res) => setTiers(res.data.tiers ?? []))
      .catch(() => setTiers([]))
      .finally(() => setLoading(false));
  }, [currency]);

  const handlePay = async (tier: string) => {
    setPaying(tier);
    try {
      const endpoint =
        currency === "NGN"
          ? "/payments/boost/ng/initialize"
          : "/payments/boost/gh/initialize";
      const res = await axiosInstance.post(endpoint, {
        adId,
        tier,
        returnUrl: window.location.pathname,
      });
      if (res.data.paymentLink) {
        setRedirectUrl(res.data.paymentLink);
      } else {
        toast.error("Could not start payment. Try again.");
        setPaying(null);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Payment failed. Try again.");
      setPaying(null);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center
      justify-center p-4"
    >
      <div className="bg-white rounded-3xl p-6 w-full max-w-sm">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-lg font-black text-gray-900">Boost this ad</h3>
            <p className="text-sm text-gray-500">
              Choose a boost tier to reach more buyers
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-gray-100 rounded-full flex items-center
              justify-center hover:bg-gray-200 transition"
          >
            <X size={15} className="text-gray-500" />
          </button>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-20 bg-gray-100 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="space-y-3 mb-4">
            {tiers.map((b) => (
              <button
                key={b.id}
                onClick={() => handlePay(b.id)}
                disabled={paying !== null}
                className="w-full flex items-start gap-3 p-4 bg-gray-50 border-2
                  border-gray-100 rounded-2xl hover:border-yellow-400 hover:bg-yellow-50/30
                  transition text-left disabled:opacity-50 active:scale-[0.99]"
              >
                <span
                  className="flex-shrink-0 w-9 h-9 bg-white rounded-xl
                  flex items-center justify-center shadow-sm"
                >
                  {TIER_ICON[b.id] ?? (
                    <Zap size={18} className="text-gray-400" />
                  )}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="text-sm font-bold text-gray-900">{b.label}</p>
                    <p className="text-sm font-black text-yellow-600">
                      {paying === b.id ? (
                        <span
                          className="w-4 h-4 border-2 border-yellow-400
                            border-t-transparent rounded-full animate-spin inline-block"
                        />
                      ) : (
                        b.display
                      )}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500">{b.desc}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {b.days} days · one-time
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full py-2.5 text-gray-500 text-sm font-medium
            hover:text-gray-700 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

const VendorBoost = () => {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [boostingAdId, setBoostingAdId] = useState<string | null>(null);

  const userCurrency =
    useAppSelector((state) => state.auth.user?.currency) ?? "GHS";
  const sym = CURRENCY_SYMBOLS[userCurrency] ?? "₵";

  const { guard } = useSubscriptionGuard();

  const { myProducts, myLoading, loadMyProducts } = useProducts();

  useEffect(() => {
    loadMyProducts({ limit: 9 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Open boost modal — subscription guard ensures vendor is active
  const handleBoostClick = (productId: string) => {
    guard({ type: "boost_product", payload: { productId } }, () => {
      setBoostingAdId(productId);
    });
  };

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto text-black">
      {/* Boost tier modal */}
      {boostingAdId && (
        <BoostModal
          adId={boostingAdId}
          currency={userCurrency}
          onClose={() => setBoostingAdId(null)}
        />
      )}

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
                  flex items-center gap-1 bg-[#ffc105] text-black text-[11px] font-black
                  px-3 py-0.5 rounded-full whitespace-nowrap shadow-sm"
                >
                  <Star size={10} className="fill-black" /> Most Popular
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

      {myLoading && (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-100 animate-pulse"
            >
              <div className="h-44 bg-gray-100 rounded-t-2xl" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-100 rounded w-3/4" />
                <div className="h-4 bg-gray-100 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!myLoading && myProducts.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
          <Package size={40} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-600 font-medium text-sm">No products yet</p>
          <p className="text-xs text-gray-400 mt-1 mb-4">
            Post your first ad to start selling
          </p>
        </div>
      )}

      {!myLoading && myProducts.length > 0 && (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {myProducts.map((item) => (
            <div
              key={item.id}
              className="bg-white shadow-sm border border-gray-100 rounded-2xl
              overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Image */}
              <div className="relative w-full h-44">
                <Image
                  src={getCoverImage(item) || assets.upload_area}
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
                  {/* Boost — opens payment modal */}
                  <button
                    onClick={() =>
                      handleBoostClick(String(item._id ?? item.id))
                    }
                    className="flex-1 flex items-center justify-center gap-1.5 py-2
                    bg-[#ffc105] text-black text-sm font-bold rounded-xl
                    hover:bg-amber-400 transition active:scale-95"
                  >
                    <Zap size={13} /> Boost
                  </button>

                  {/* Promote */}
                  <Link
                    href={`/vendor/settings?tab=promotion&product=${item._id ?? item.id}`}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2
                    bg-transparent border border-[#ffc105] text-amber-600 text-sm
                    font-bold rounded-xl hover:bg-amber-50 transition active:scale-95"
                  >
                    <Megaphone size={13} /> Ad
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VendorBoost;
