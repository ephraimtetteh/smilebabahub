"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/src/components/Button";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { packages } from "@/src/constants/subscription";
import SubscriptionComponent from "@/src/components/SubscriptionComponent";
import { SubscriptionPlanProps } from "@/src/types/types";
import { consumeReturnState } from "@/src/hooks/useSubscriptionGuard";
import axiosInstance from "@/src/lib/api/axios";
import { useAppSelector } from "../redux";


// ── Currency config ────────────────────────────────────────────────────────
// Mirrors PRICING in config/pricing.js — keeps frontend display in sync
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

const CURRENCY_SYMBOLS: Record<string, string> = {
  GHS: "₵",
  NGN: "₦",
};

const Subscription = ({
  selectedPlanId,
  onPlanSelect,
}: SubscriptionPlanProps) => {
  const router = useRouter();
  const params = useSearchParams();
  const isRenew = params.get("renew") === "1";

  // ── Read currency from Redux (set from user's IP on login) ────────────────
  const userCurrency =
    useAppSelector((state) => state.auth.user?.currency) ?? "GHS";
  const userSymbol = CURRENCY_SYMBOLS[userCurrency] ?? "₵";

  // Country-prefixed endpoint — GHS → /gh | NGN → /ng | else → /intl
  const paymentEndpoint =
    userCurrency === "GHS"
      ? "/payments/gh/initialize"
      : userCurrency === "NGN"
        ? "/payments/ng/initialize"
        : "/payments/intl/initialize";

  const [plan, setPlan] = useState<"monthly" | "yearly">("monthly");
  const [showSummary, setShowSummary] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [referralCode, setReferralCode] = useState("");
  const [referralInfo, setReferralInfo] = useState<{
    name: string;
    discount: number;
  } | null>(null);
  const [referralError, setReferralError] = useState<string | null>(null);
  const [checkingCode, setCheckingCode] = useState(false);

  const [selectedPackage, setSelectedPackage] = useState(
    selectedPlanId ?? packages.find((p) => p.popular)?.id ?? packages[0].id,
  );

  const activePlanId = selectedPlanId ?? selectedPackage;

  const handlePlanSelect = (planId: string) => {
    onPlanSelect ? onPlanSelect(planId) : setSelectedPackage(planId);
  };

  const activePkg = packages.find((p) => p.id === activePlanId);

  // Pull price for the active plan/cycle/currency
  const activePrice = PRICES[activePlanId]?.[plan]?.[userCurrency] ?? 0;

  const formatPrice = (planId: string, cycle: string) => {
    const amount = PRICES[planId]?.[cycle]?.[userCurrency];
    if (amount === undefined) return "—";
    if (amount === 0) return "Free";
    return `${userSymbol}${amount.toLocaleString()}`;
  };

  const validateReferral = async (code: string) => {
    if (!code.trim()) {
      setReferralInfo(null);
      setReferralError(null);
      return;
    }
    setCheckingCode(true);
    setReferralError(null);
    try {
      const res = await axiosInstance.get(
        `/marketers/referral/${code.trim()}/validate`,
      );
      setReferralInfo({
        name: res.data.marketerName,
        discount: res.data.discount,
      });
    } catch {
      setReferralInfo(null);
      setReferralError("Invalid referral code");
    } finally {
      setCheckingCode(false);
    }
  };

  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);

  // Redirect triggered by state — avoids the immutability lint rule
  useEffect(() => {
    if (redirectUrl) {
      window.location.assign(redirectUrl);
    }
  }, [redirectUrl]);

  const handlePayNow = async () => {
    setError(null);
    setLoading(true);

    try {
      const { returnUrl } = consumeReturnState();

      const res = await axiosInstance.post(paymentEndpoint, {
        planId: activePlanId,
        billingCycle: plan,
        currency: userCurrency,
        referralCode: referralCode.trim() || undefined,
        returnUrl: returnUrl ?? "/vendor/dashboard",
      });

      if (res.data.free) {
        router.push(res.data.redirectUrl + "?subscribed=1");
        return;
      }

      setRedirectUrl(res.data.paymentLink);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(
        e?.response?.data?.message ??
          "Payment initialization failed. Please try again.",
      );
      setLoading(false);
    }
  };

  return (
    <div className="mt-20 flex flex-col px-4 sm:px-6 md:px-16 lg:px-24 xl:px-32 py-10 bg-black/20">
      {/* Heading */}
      <div className="flex flex-col items-center mx-auto text-center">
        {isRenew && (
          <div className="mb-4 flex items-center gap-2 px-4 py-2 bg-amber-100 border border-amber-300 rounded-xl text-sm text-amber-800 font-medium">
            <AlertTriangle size={15} className="flex-shrink-0" />
            Your subscription has expired. Renew to reactivate your listings.
          </div>
        )}

        {/* Currency indicator */}
        <div className="mb-2 px-3 py-1 bg-white/10 rounded-full text-xs font-medium opacity-70">
          Prices shown in {userCurrency} ({userSymbol})
        </div>

        <h1 className="py-2 font-bold text-2xl sm:text-3xl capitalize">
          Subscription packages
        </h1>
        <p className="text-sm sm:text-base opacity-80">
          Please choose your preferred subscription plan
        </p>

        {/* Billing toggle */}
        <div className="flex gap-4 pt-8">
          <Button
            text="Monthly"
            onClick={() => setPlan("monthly")}
            className={plan === "monthly" ? "bg-[#ffc10565]" : ""}
          />
          <Button
            text="Yearly"
            onClick={() => setPlan("yearly")}
            className={plan === "yearly" ? "bg-[#ffc10565]" : ""}
          />
        </div>
      </div>

      {/* Plan cards */}
      <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 p-4 sm:p-8 gap-6 sm:gap-8">
        {packages.map((item) => {
          const isActive = activePlanId === item.id;
          return (
            <SubscriptionComponent
              key={item.id}
              {...item}
              plan={plan}
              isActive={isActive}
              isPopular={item.popular}
              // Pass the localised price so SubscriptionComponent can display it
              localPrice={formatPrice(item.id, plan)}
              onClick={() => handlePlanSelect(item.id)}
            />
          );
        })}
      </div>

      {/* Error */}
      {error && (
        <div className="mx-auto mb-4 px-4 py-2 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Next button */}
      {!showSummary && (
        <div className="flex items-center justify-center px-4">
          {activePlanId && (
            <Button
              text="Next"
              className="w-full sm:w-64"
              onClick={() => setShowSummary(true)}
            />
          )}
        </div>
      )}

      {/* Summary modal */}
      {showSummary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="bg-[#1a1a1a] text-white rounded-2xl shadow-2xl p-6 sm:p-10 w-full max-w-sm">
            <h2 className="text-xl sm:text-2xl text-amber-300 font-bold mb-5">
              Your Summary
            </h2>

            <div className="space-y-3 mb-6">
              <Row
                label="Plan"
                value={activePkg?.packageName ?? activePlanId}
              />
              <Row label="Billing" value={plan} />
              <Row label="Price" value={formatPrice(activePlanId, plan)} />
              <Row label="Currency" value={`${userCurrency} (${userSymbol})`} />
              {plan === "yearly" &&
                (() => {
                  const monthly =
                    PRICES[activePlanId]?.monthly?.[userCurrency] ?? 0;
                  const yearly =
                    PRICES[activePlanId]?.yearly?.[userCurrency] ?? 0;
                  const saving = monthly * 12 - yearly;
                  return saving > 0 ? (
                    <div className="flex items-center gap-1.5 text-xs text-green-400 bg-green-900/30 rounded-lg px-3 py-2">
                      <CheckCircle2 size={12} />
                      You save {userSymbol}
                      {saving.toLocaleString()} with yearly billing
                    </div>
                  ) : null;
                })()}
            </div>

            {/* Referral code input */}
            <div className="mt-3">
              <label className="block text-xs text-gray-400 mb-1.5">
                Referral code (optional)
              </label>
              <div className="flex gap-2">
                <input
                  value={referralCode}
                  onChange={(e) => {
                    setReferralCode(e.target.value.toUpperCase());
                    if (!e.target.value) {
                      setReferralInfo(null);
                      setReferralError(null);
                    }
                  }}
                  placeholder="e.g. SMB-KWAME-4X9Z"
                  className="flex-1 bg-[#1a1a1a] border border-white/10 rounded-xl px-3 py-2
                    text-white text-xs placeholder:text-gray-600
                    focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
                <button
                  type="button"
                  onClick={() => validateReferral(referralCode)}
                  disabled={checkingCode || !referralCode.trim()}
                  className="px-3 py-2 bg-white/10 text-white text-xs rounded-xl
                    hover:bg-white/20 transition disabled:opacity-40"
                >
                  {checkingCode ? "…" : "Apply"}
                </button>
              </div>
              {referralInfo && (
                <p className="text-xs text-green-400 mt-1.5">
                  ✓ Code by {referralInfo.name} · {referralInfo.discount}%
                  discount applied
                </p>
              )}
              {referralError && (
                <p className="text-xs text-red-400 mt-1.5">{referralError}</p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handlePayNow}
                disabled={loading}
                className="flex-1 py-2.5 bg-[#ffc105] text-black font-bold rounded-xl
                  hover:bg-amber-400 transition disabled:opacity-60 text-sm"
              >
                {loading
                  ? "Redirecting…"
                  : activePrice === 0
                    ? "Activate Free"
                    : "Pay Now"}
              </button>
              <button
                onClick={() => setShowSummary(false)}
                className="flex-1 py-2.5 bg-red-500 text-white font-bold rounded-xl
                  hover:bg-red-600 transition text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center border-b border-white/10 pb-2">
      <span className="text-gray-400 text-sm capitalize">{label}</span>
      <span className="text-white text-sm font-semibold capitalize">
        {value}
      </span>
    </div>
  );
}

export default Subscription;
