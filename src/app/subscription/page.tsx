"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/src/components/Button";
import { packages } from "@/src/constants/subscription";
import SubscriptionComponent from "@/src/components/SubscriptionComponent";
import { SubscriptionPlanProps } from "@/src/types/types";
import { consumeReturnState } from "@/src/hooks/useSubscriptionGuard"; // ← only the helper, NOT the guard hook
import axiosInstance from "@/src/lib/api/axios";

const Subscription = ({
  selectedPlanId,
  onPlanSelect,
}: SubscriptionPlanProps) => {
  
  const router = useRouter();
  const params = useSearchParams();
  const isRenew = params.get("renew") === "1";

  const [plan, setPlan] = useState<"monthly" | "yearly">("monthly");
  const [showSummary, setShowSummary] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedPackage, setSelectedPackage] = useState(
    selectedPlanId ?? packages.find((p) => p.popular)?.id ?? packages[0].id,
  );

  const activePlanId = selectedPlanId ?? selectedPackage;

  const handlePlanSelect = (planId: string) => {
    onPlanSelect ? onPlanSelect(planId) : setSelectedPackage(planId);
  };

  const activePkg = packages.find((p) => p.id === activePlanId);
  const priceData = activePkg?.prices.find((p) => p.duration === plan);

  const handlePayNow = async () => {
    setError(null);
    setLoading(true);

    try {
      // Read where the user was trying to go before being sent here
      const { returnUrl } = consumeReturnState();

      const res = await axiosInstance.post("/payments/initialize", {
        planId: activePlanId,
        billingCycle: plan,
        currency: "GHS",
        returnUrl: returnUrl ?? "/vendor/dashboard",
      });

      // Free plan — backend returns { free: true, redirectUrl }
      if (res.data.free) {
        router.push(res.data.redirectUrl + "?subscribed=1");
        return;
      }

      // Paid plan — hand off to Flutterwave
      window.location.href = res.data.paymentLink;
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
          <div className="mb-4 px-4 py-2 bg-amber-100 border border-amber-300 rounded-xl text-sm text-amber-800 font-medium">
            ⚠️ Your subscription has expired. Renew to reactivate your listings.
          </div>
        )}
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
              <Row label="Price" value={`GHS ${priceData?.price ?? "—"}`} />
              {plan === "yearly" && (
                <div className="text-xs text-green-400 bg-green-900/30 rounded-lg px-3 py-2">
                  🎉 You save{" "}
                  {(() => {
                    const monthly =
                      activePkg?.prices.find((p) => p.duration === "monthly")
                        ?.price ?? 0;
                    const yearly = priceData?.price ?? 0;
                    const saving = Number(monthly) * 12 - Number(yearly);
                    return saving > 0
                      ? `GHS ${saving.toFixed(2)}`
                      : "with yearly billing";
                  })()}
                </div>
              )}
            </div>

            <div className="flex gap-3">
              {/* ✅ Call handlePayNow directly — no guard() here.
                  This IS the subscription page. Wrapping with guard() would
                  redirect non-vendors back to /subscribe (infinite loop). */}
              <button
                onClick={handlePayNow}
                disabled={loading}
                className="flex-1 py-2.5 bg-[#ffc105] text-black font-bold rounded-xl
                  hover:bg-amber-400 transition disabled:opacity-60 text-sm"
              >
                {loading
                  ? "Redirecting…"
                  : Number(priceData?.price) === 0
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
