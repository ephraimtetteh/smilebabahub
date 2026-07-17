// frontend/app/promote/success/page.tsx
//
// Payment callback. Flutterwave redirects here after the user pays.
// We verify the payment server-side, then show a success or error UI.

"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, AlertCircle, Loader2, ArrowRight } from "lucide-react";
import axiosInstance from "@/src/lib/api/axios";


type State = "verifying" | "success" | "free" | "failed";

export default function PromoteSuccessPage() {
  const params = useSearchParams();
  const router = useRouter();
  const [state, setState] = useState<State>("verifying");
  const [error, setError] = useState<string | null>(null);
  const [promotion, setPromotion] = useState<any>(null);

  // Free plan shortcut — when the public route returned status:"free"
  const isFree = params.get("free") === "1";
  const txRef = params.get("ref") ?? params.get("tx_ref");
  const transactionId = params.get("transaction_id") ?? params.get("id");
  const flwStatus = params.get("status"); // "successful" | "cancelled" | "failed"

  useEffect(() => {
    // Free plan — no Flutterwave callback, just confirm
    if (isFree && txRef) {
      axiosInstance
        .get(`/promote/${txRef}`)
        .then((res) => {
          setPromotion(res.data.promotion);
          setState("free");
        })
        .catch((e) => {
          setError(e?.response?.data?.message ?? "Could not load");
          setState("failed");
        });
      return;
    }

    // User cancelled on Flutterwave page
    if (flwStatus === "cancelled" || flwStatus === "failed") {
      setError("Payment was cancelled or failed.");
      setState("failed");
      return;
    }

    if (!txRef || !transactionId) {
      setError("Missing payment reference in URL.");
      setState("failed");
      return;
    }

    // Verify server-side
    axiosInstance
      .post("/promote/verify", { txRef, transactionId })
      .then((res) => {
        setPromotion(res.data.promotion);
        setState(res.data.status === "paid" ? "success" : "failed");
      })
      .catch((e) => {
        setError(e?.response?.data?.message ?? "Could not verify payment");
        setState("failed");
      });
  }, [txRef, transactionId, flwStatus, isFree]);

  return (
    <div className="min-h-[70vh] bg-gradient-to-br from-yellow-50 to-white flex items-center justify-center px-6 py-16">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 max-w-md w-full text-center">
        {state === "verifying" && (
          <>
            <div className="w-16 h-16 mx-auto bg-yellow-100 rounded-full flex items-center justify-center">
              <Loader2 size={28} className="text-yellow-600 animate-spin" />
            </div>
            <h1 className="mt-5 text-2xl font-black text-gray-900">
              Verifying payment…
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              This usually takes a few seconds. Don&apos;t close the page.
            </p>
          </>
        )}

        {state === "success" && (
          <>
            <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 size={32} className="text-green-600" />
            </div>
            <h1 className="mt-5 text-2xl font-black text-gray-900">
              Payment received! 🎉
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Your promotion is paid and awaiting admin approval. Most are
              approved within 15 minutes.
            </p>
            {promotion && (
              <div className="mt-5 bg-gray-50 rounded-2xl p-4 text-left">
                <div className="text-[10px] font-black tracking-wider text-gray-500">
                  PROMOTION DETAILS
                </div>
                <div className="mt-2 flex justify-between text-sm">
                  <span className="text-gray-500">Plan</span>
                  <span className="font-black text-gray-900">
                    {promotion.planTier}
                  </span>
                </div>
                <div className="mt-1 flex justify-between text-sm">
                  <span className="text-gray-500">Amount</span>
                  <span className="font-black text-gray-900">
                    {promotion.currency === "NGN" ? "₦" : "GHC"}{" "}
                    {promotion.amount?.toLocaleString()}
                  </span>
                </div>
                <div className="mt-1 flex justify-between text-sm">
                  <span className="text-gray-500">Duration</span>
                  <span className="font-black text-gray-900">
                    {promotion.duration} days
                  </span>
                </div>
              </div>
            )}
            <div className="mt-6 flex flex-col gap-2">
              <Link
                href="/promote/my"
                className="px-5 py-3 rounded-2xl bg-yellow-400 text-gray-900 font-black hover:bg-yellow-300 inline-flex items-center justify-center gap-2"
              >
                View my promotions <ArrowRight size={14} />
              </Link>
              <Link
                href="/"
                className="text-xs font-bold text-gray-500 hover:text-gray-700"
              >
                Back to home
              </Link>
            </div>
          </>
        )}

        {state === "free" && (
          <>
            <div className="w-16 h-16 mx-auto bg-yellow-100 rounded-full flex items-center justify-center">
              <CheckCircle2 size={32} className="text-yellow-600" />
            </div>
            <h1 className="mt-5 text-2xl font-black text-gray-900">
              You&apos;re live! ✨
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Your free promotion is now active. Listing visibility starts
              immediately.
            </p>
            <Link
              href="/"
              className="inline-block mt-6 px-5 py-3 rounded-2xl bg-yellow-400 text-gray-900 font-black hover:bg-yellow-300"
            >
              Back to home
            </Link>
          </>
        )}

        {state === "failed" && (
          <>
            <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle size={32} className="text-red-600" />
            </div>
            <h1 className="mt-5 text-2xl font-black text-gray-900">
              Payment didn&apos;t go through
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              {error ?? "Something went wrong."}
            </p>
            <div className="mt-6 flex flex-col gap-2">
              <button
                onClick={() => router.push("/promote")}
                className="px-5 py-3 rounded-2xl bg-yellow-400 text-gray-900 font-black hover:bg-yellow-300"
              >
                Try again
              </button>
              <Link
                href="/help"
                className="text-xs font-bold text-gray-500 hover:text-gray-700"
              >
                Contact support
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
