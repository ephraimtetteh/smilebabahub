"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AlertTriangle,
  CheckCircle2,
  ArrowUpCircle,
  Lock,
  Sparkles,
} from "lucide-react";
import Button from "@/src/components/Button";
import { packages } from "@/src/constants/subscription";
import SubscriptionComponent from "@/src/components/SubscriptionComponent";
import { SubscriptionPlanProps } from "@/src/types/types";
import { consumeReturnState } from "@/src/hooks/useSubscriptionGuard";
import axiosInstance from "@/src/lib/api/axios";
import { useViewCountry } from "@/src/hooks/useViewCountry";
import { useAppSelector } from "@/src/app/redux";

// ── Pricing (mirrors config/pricing.js) ───────────────────────────────────────
const PRICES: Record<string, Record<string, Record<string, number>>> = {
  Basic: { monthly: { GHS: 0, NGN: 0 }, yearly: { GHS: 0, NGN: 0 } },
  standard: {
    monthly: { GHS: 99.99, NGN: 6500 },
    yearly: { GHS: 1199.88, NGN: 78000 },
  },
  popular: {
    monthly: { GHS: 249.99, NGN: 18000 },
    yearly: { GHS: 2999.88, NGN: 216000 },
  },
  premium: {
    monthly: { GHS: 499.99, NGN: 49999 },
    yearly: { GHS: 5999.88, NGN: 599999 },
  },
};

const PLAN_NAMES: Record<string, string> = {
  Basic: "Smile (Free)",
  standard: "BasicSmile",
  popular: "HappySmile",
  premium: "SuperSmile",
};

// Plan tier — higher = more premium
const PLAN_TIERS: Record<string, number> = {
  Basic: 0,
  standard: 1,
  popular: 2,
  premium: 3,
};

// ── Row helper ─────────────────────────────────────────────────────────────────
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

// ── Plan status banner ─────────────────────────────────────────────────────────
function PlanStatusBanner({
  currentPlan,
  expiresAt,
}: {
  currentPlan: string;
  expiresAt: string;
}) {
  const isExpired = new Date(expiresAt) <= new Date();
  const expiry = new Date(expiresAt).toLocaleDateString("en-GH", {
    dateStyle: "long",
  });
  const isFree = currentPlan === "Basic";

  if (isExpired)
    return (
      <div
        className="mb-4 flex items-center gap-2 px-4 py-3 bg-red-100 border
      border-red-300 rounded-xl text-sm text-red-800 font-medium"
      >
        <AlertTriangle size={15} className="flex-shrink-0" />
        Your <strong>{PLAN_NAMES[currentPlan] ?? currentPlan}</strong> plan
        expired on {expiry}. Renew below to reactivate your listings.
      </div>
    );

  if (isFree)
    return (
      <div
        className="mb-4 flex items-center gap-2 px-4 py-3 bg-blue-50 border
      border-blue-200 rounded-xl text-sm text-blue-800 font-medium"
      >
        <ArrowUpCircle size={15} className="flex-shrink-0 text-blue-500" />
        You&apos;re on the <strong>Free plan</strong>. Upgrade to post listings
        and reach more buyers.
      </div>
    );

  return (
    <div
      className="mb-4 flex items-center gap-2 px-4 py-3 bg-green-50 border
      border-green-200 rounded-xl text-sm text-green-800 font-medium"
    >
      <Sparkles size={15} className="flex-shrink-0 text-green-500" />
      Active plan: <strong>{PLAN_NAMES[currentPlan] ?? currentPlan}</strong>
      &nbsp;· Renews {expiry}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
const Subscription = ({
  selectedPlanId,
  onPlanSelect,
}: SubscriptionPlanProps) => {
  const router = useRouter();
  const params = useSearchParams();
  const isRenew = params.get("renew") === "1";

  const {
    currency: userCurrency,
    sym: userSymbol,
    paymentRegion,
  } = useViewCountry();
  const paymentEndpoint = `/payments/${paymentRegion}/initialize`;

  // Current subscription from Redux
  const user = useAppSelector((s) => s.auth.user);
  const currentPlanId = user?.subscription?.plan ?? null;
  const expiresAt = user?.subscription?.expiresAt ?? null;
  const currentBilling = user?.subscription?.billingCycle ?? null;
  const isSubscribed =
    !!currentPlanId && !!expiresAt && new Date(expiresAt) > new Date();
  const currentTier = PLAN_TIERS[currentPlanId ?? ""] ?? -1;

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
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);

  const [selectedPackage, setSelectedPackage] = useState(
    selectedPlanId ?? packages.find((p) => p.popular)?.id ?? packages[0].id,
  );
  const activePlanId = selectedPlanId ?? selectedPackage;
  const activePkg = packages.find((p) => p.id === activePlanId);
  const activeTier = PLAN_TIERS[activePlanId] ?? 0;
  const activePrice = PRICES[activePlanId]?.[plan]?.[userCurrency] ?? 0;

  // Redirect via useEffect — satisfies React immutability lint rule
  useEffect(() => {
    if (redirectUrl) window.location.assign(redirectUrl);
  }, [redirectUrl]);

  // ── Plan selection guard ──────────────────────────────────────────────────
  // Returns a message if this selection should be blocked, null if OK
  const getSelectionWarning = (planId: string): string | null => {
    if (!isSubscribed || !currentPlanId) return null;
    const selectedTier = PLAN_TIERS[planId] ?? 0;
    if (planId === currentPlanId && plan === currentBilling) {
      return `You are already on the ${PLAN_NAMES[planId] ?? planId} ${plan} plan.`;
    }
    if (planId === "Basic" && currentPlanId === "Basic") {
      return "You are already on the free plan. Choose a paid plan to unlock more features.";
    }
    if (selectedTier < currentTier && planId !== "Basic") {
      return `You currently have a higher plan (${PLAN_NAMES[currentPlanId]}). Downgrades take effect at renewal — contact support to arrange this.`;
    }
    return null;
  };

  const selectionWarning = getSelectionWarning(activePlanId);
  const isUpgrade = isSubscribed && activeTier > currentTier;
  const isSamePlan = isSubscribed && activePlanId === currentPlanId;

  const handlePlanSelect = (planId: string) => {
    setError(null);
    onPlanSelect ? onPlanSelect(planId) : setSelectedPackage(planId);
  };

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

  const handleNext = () => {
    if (selectionWarning) {
      setError(selectionWarning);
      return;
    }
    setError(null);
    setShowSummary(true);
  };

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
      const e = err as {
        response?: { data?: { message?: string; code?: string } };
      };
      const code = e?.response?.data?.code;
      const msg = e?.response?.data?.message;

      if (code === "SAME_PLAN") {
        setError(
          "You are already on this plan. Choose a different plan to upgrade.",
        );
      } else if (code === "DOWNGRADE_NOT_ALLOWED") {
        setError(msg ?? "Downgrades take effect at renewal. Contact support.");
      } else if (code === "ALREADY_FREE") {
        setError(
          "You are already on the free plan. Select a paid plan to upgrade.",
        );
      } else {
        setError(msg ?? "Payment initialization failed. Please try again.");
      }
      setShowSummary(false);
      setLoading(false);
    }
  };

  return (
    <div
      className="mt-20 flex flex-col px-4 sm:px-6 md:px-16 lg:px-24 xl:px-32
      py-10 bg-black/20"
    >
      {/* ── Heading ── */}
      <div className="flex flex-col items-center mx-auto text-center w-full max-w-3xl">
        {/* Current plan status banner */}
        {currentPlanId && expiresAt && (
          <div className="w-full">
            <PlanStatusBanner
              currentPlan={currentPlanId}
              expiresAt={expiresAt}
            />
          </div>
        )}

        {isRenew && !currentPlanId && (
          <div
            className="mb-4 flex items-center gap-2 px-4 py-2 bg-amber-100
            border border-amber-300 rounded-xl text-sm text-amber-800 font-medium w-full"
          >
            <AlertTriangle size={15} className="flex-shrink-0" />
            Your subscription has expired. Renew below to reactivate your
            listings.
          </div>
        )}

        <div className="mb-2 px-3 py-1 bg-white/10 rounded-full text-xs font-medium opacity-70">
          Prices shown in {userCurrency} ({userSymbol})
        </div>

        <h1 className="py-2 font-bold text-2xl sm:text-3xl capitalize">
          {isSubscribed && currentPlanId !== "Basic"
            ? "Upgrade your plan"
            : "Subscription packages"}
        </h1>
        <p className="text-sm sm:text-base opacity-80">
          {isSubscribed && currentPlanId !== "Basic"
            ? "Upgrade anytime to unlock more features"
            : "Choose your preferred subscription plan"}
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

      {/* ── Plan cards ── */}
      <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 p-4 sm:p-8 gap-6 sm:gap-8">
        {packages.map((item) => {
          const isActive = activePlanId === item.id;
          const isCurrent = isSubscribed && item.id === currentPlanId;
          const tier = PLAN_TIERS[item.id] ?? 0;
          const isLocked =
            isSubscribed && tier < currentTier && item.id !== "Basic";
          const isSame = isCurrent && plan === currentBilling;

          return (
            <div key={item.id} className="relative">
              {/* Current plan indicator */}
              {isCurrent && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 z-10
                  px-3 py-0.5 bg-green-500 text-white text-[10px] font-black
                  rounded-full whitespace-nowrap shadow"
                >
                  Your current plan
                </div>
              )}
              {/* Locked/downgrade overlay */}
              {isLocked && (
                <div
                  className="absolute inset-0 z-10 rounded-2xl bg-black/40
                  flex flex-col items-center justify-center gap-2 backdrop-blur-[1px]"
                >
                  <Lock size={22} className="text-white/70" />
                  <p className="text-white/70 text-xs font-semibold text-center px-4">
                    Downgrade at renewal
                  </p>
                </div>
              )}
              <SubscriptionComponent
                {...item}
                plan={plan}
                isActive={isActive}
                isPopular={item.popular}
                localPrice={formatPrice(item.id, plan)}
                onClick={() => !isLocked && handlePlanSelect(item.id)}
              />
            </div>
          );
        })}
      </div>

      {/* ── Selection warning ── */}
      {selectionWarning && (
        <div
          className="mx-auto mb-2 max-w-lg px-4 py-3 bg-amber-50 border
          border-amber-300 rounded-xl text-sm text-amber-800 flex items-center gap-2"
        >
          <AlertTriangle size={14} className="flex-shrink-0 text-amber-500" />
          {selectionWarning}
        </div>
      )}

      {/* ── Error ── */}
      {error && (
        <div
          className="mx-auto mb-4 max-w-lg px-4 py-2 bg-red-50 border
          border-red-200 text-red-600 rounded-xl text-sm"
        >
          {error}
        </div>
      )}

      {/* ── Upgrade prompt for free users ── */}
      {isSubscribed &&
        currentPlanId === "Basic" &&
        activePlanId === "Basic" && (
          <div
            className="mx-auto mb-4 max-w-lg px-4 py-3 bg-blue-50 border
          border-blue-200 rounded-xl text-sm text-blue-800 flex items-center gap-2"
          >
            <ArrowUpCircle size={14} className="flex-shrink-0 text-blue-500" />
            Select a paid plan above to unlock listings, boosts, and full vendor
            features.
          </div>
        )}

      {/* ── Next button ── */}
      {!showSummary && (
        <div className="flex items-center justify-center px-4">
          {activePlanId && !selectionWarning && (
            <Button
              text={
                isUpgrade
                  ? "Upgrade plan →"
                  : isSamePlan
                    ? "Already subscribed"
                    : "Next →"
              }
              className={`w-full sm:w-64 ${isSamePlan ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={isSamePlan ? undefined : handleNext}
            />
          )}
        </div>
      )}

      {/* ── Summary modal ── */}
      {showSummary && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center
          bg-black/60 px-4"
        >
          <div
            className="bg-[#1a1a1a] text-white rounded-2xl shadow-2xl
            p-6 sm:p-10 w-full max-w-sm"
          >
            <h2 className="text-xl sm:text-2xl text-amber-300 font-bold mb-1">
              {isUpgrade ? "Confirm upgrade" : "Your summary"}
            </h2>
            {isUpgrade && currentPlanId && (
              <p className="text-sm text-gray-400 mb-4">
                Upgrading from{" "}
                <span className="text-white font-semibold">
                  {PLAN_NAMES[currentPlanId] ?? currentPlanId}
                </span>{" "}
                to{" "}
                <span className="text-amber-300 font-semibold">
                  {PLAN_NAMES[activePlanId] ?? activePlanId}
                </span>
              </p>
            )}

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
                    <div
                      className="flex items-center gap-1.5 text-xs text-green-400
                    bg-green-900/30 rounded-lg px-3 py-2"
                    >
                      <CheckCircle2 size={12} />
                      You save {userSymbol}
                      {saving.toLocaleString()} with yearly billing
                    </div>
                  ) : null;
                })()}
            </div>

            {/* Referral code */}
            <div className="mt-3 mb-5">
              <label className="block text-xs text-gray-400 mb-2.5">
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
                  className="flex-1 bg-[#1a1a1a] border border-white/10 rounded-xl
                    px-3 py-2 text-white text-xs placeholder:text-gray-600
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
                    : isUpgrade
                      ? "Confirm upgrade"
                      : "Pay Now"}
              </button>
              <button
                onClick={() => {
                  setShowSummary(false);
                  setError(null);
                }}
                className="flex-1 py-2.5 bg-white/10 text-white font-bold rounded-xl
                  hover:bg-white/20 transition text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Subscription;
