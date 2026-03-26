"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { consumeReturnState } from "@/src/hooks/useSubscriptionGuard";

// Reason map — matches the ?reason= query param set by verifyPayment
const REASONS: Record<string, { title: string; desc: string; icon: string }> = {
  not_successful: {
    icon: "❌",
    title: "Payment was not completed",
    desc: "Your payment did not go through. No money has been taken from your account. Please try again.",
  },
  amount_mismatch: {
    icon: "⚠️",
    title: "Payment amount mismatch",
    desc: "We detected an issue with the payment amount. Please contact support if money was deducted.",
  },
  server_error: {
    icon: "🔧",
    title: "Something went wrong on our end",
    desc: "Our payment system encountered an error. Please try again in a few minutes.",
  },
  cancelled: {
    icon: "🚫",
    title: "Payment cancelled",
    desc: "You cancelled the payment. No money has been charged. You can try again whenever you're ready.",
  },
  default: {
    icon: "😕",
    title: "Payment unsuccessful",
    desc: "Your payment could not be processed. Please try again or contact support.",
  },
};

export default function PaymentFailedPage() {
  const router = useRouter();
  const params = useSearchParams();
  const reason = params.get("reason") ?? "default";
  const content = REASONS[reason] ?? REASONS.default;

  const [returnUrl, setReturnUrl] = useState<string | null>(null);

  // Recover the return URL so the retry button goes back to the right place
  useEffect(() => {
    // Don't consume — keep it in storage so retry can re-use it
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("smilebaba_return_url");
      setReturnUrl(saved);
    }
  }, []);

  const handleRetry = () => {
    // Go back to subscribe with the plan selection intact
    router.push("/subscription");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md text-center">
        {/* Icon */}
        <div
          className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center
          text-5xl mx-auto mb-6 shadow-lg shadow-red-50"
        >
          {content.icon}
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-3">
          {content.title}
        </h1>
        <p className="text-gray-500 text-sm sm:text-base mb-8 leading-relaxed max-w-sm mx-auto">
          {content.desc}
        </p>

        {/* Info card */}
        <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-5 mb-6 text-left">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
            What to do next
          </p>
          <div className="space-y-3">
            {[
              {
                icon: "🔄",
                text: "Try the payment again — most failures are temporary",
              },
              {
                icon: "💳",
                text: "Check your card or MoMo balance and try a different method",
              },
              {
                icon: "📞",
                text: "Contact your bank if money was deducted unexpectedly",
              },
              {
                icon: "💬",
                text: "Reach out to SmileBaba support if the issue persists",
              },
            ].map((s) => (
              <div key={s.text} className="flex items-start gap-3">
                <span className="text-base flex-shrink-0 mt-0.5">{s.icon}</span>
                <span className="text-sm text-gray-600 leading-relaxed">
                  {s.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Assurance */}
        {(reason === "not_successful" || reason === "cancelled") && (
          <div
            className="bg-green-50 border border-green-200 rounded-2xl px-4 py-3 mb-6
            flex items-center gap-2.5 text-left"
          >
            <span className="text-green-500 text-lg flex-shrink-0">🔒</span>
            <p className="text-xs text-green-700 leading-relaxed">
              <strong>No charge made.</strong> Your account has not been
              debited. You can retry safely.
            </p>
          </div>
        )}

        {/* CTAs */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleRetry}
            className="w-full py-3 bg-[#ffc105] text-black font-black rounded-2xl
              hover:bg-amber-400 transition active:scale-[0.99] text-sm"
          >
            Try again →
          </button>

          {returnUrl && (
            <Link
              href={returnUrl}
              className="w-full py-3 bg-white border border-gray-200 text-gray-700
                font-semibold rounded-2xl hover:bg-gray-50 transition text-sm"
            >
              ← Go back to what I was doing
            </Link>
          )}

          <Link
            href="/"
            className="text-xs text-gray-400 hover:text-gray-600 transition mt-1"
          >
            Return to SmileBaba home
          </Link>
        </div>

        {/* Support */}
        <p className="text-xs text-gray-400 mt-8">
          Need help?{" "}
          <a
            href="mailto:support@smilebabahub.com"
            className="text-[#ffc105] hover:underline font-medium"
          >
            Contact support
          </a>
        </p>
      </div>
    </div>
  );
}
