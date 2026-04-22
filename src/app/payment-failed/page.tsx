"use client";
// src/app/payment-failed/page.tsx

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  XCircle,
  AlertTriangle,
  Wrench,
  Ban,
  Frown,
  CreditCard,
  Phone,
  MessageCircle,
  Shield,
  RefreshCw,
  ArrowRight,
  Star,
  ChevronDown,
  ChevronUp,
  Zap,
} from "lucide-react";
import { toast } from "react-toastify";

// ── Animated X burst (mirror of confetti) ─────────────────────────────────
function FailBurst() {
  const pieces = Array.from({ length: 16 });
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {pieces.map((_, i) => (
        <span
          key={i}
          className="absolute opacity-0"
          style={{
            left: `${20 + i * 4}%`,
            top: "-10px",
            width: "8px",
            height: "8px",
            background: i % 2 === 0 ? "#ef4444" : "#fca5a5",
            borderRadius: "2px",
            animation: `failFall ${1 + (i % 4) * 0.2}s ease-in ${i * 0.05}s forwards`,
            transform: `rotate(${i * 22}deg)`,
          }}
        />
      ))}
      <style>{`
        @keyframes failFall {
          0%   { transform: translateY(0)    rotate(0deg);    opacity: 0.8; }
          100% { transform: translateY(80vh) rotate(360deg);  opacity: 0;   }
        }
      `}</style>
    </div>
  );
}

// ── Reason configs ─────────────────────────────────────────────────────────
type ReasonKey =
  | "not_successful"
  | "amount_mismatch"
  | "server_error"
  | "cancelled"
  | "default";

const REASONS: Record<
  ReasonKey,
  {
    icon: React.ReactNode;
    iconBg: string;
    title: string;
    desc: string;
    safeToRetry: boolean;
  }
> = {
  not_successful: {
    icon: <XCircle size={40} className="text-red-500" />,
    iconBg: "bg-red-50",
    title: "Payment didn't go through",
    desc: "Your payment was not completed. No money has been taken from your account. This is usually a temporary issue.",
    safeToRetry: true,
  },
  amount_mismatch: {
    icon: <AlertTriangle size={40} className="text-yellow-500" />,
    iconBg: "bg-yellow-50",
    title: "Payment amount mismatch",
    desc: "We detected an issue with the payment amount. Please contact support if money was deducted from your account.",
    safeToRetry: false,
  },
  server_error: {
    icon: <Wrench size={40} className="text-blue-500" />,
    iconBg: "bg-blue-50",
    title: "Something went wrong on our end",
    desc: "Our payment system encountered an error. Please try again in a few minutes — we've been notified.",
    safeToRetry: true,
  },
  cancelled: {
    icon: <Ban size={40} className="text-gray-400" />,
    iconBg: "bg-gray-100",
    title: "Payment cancelled",
    desc: "You cancelled the payment. No money has been charged. You can start the payment again whenever you're ready.",
    safeToRetry: true,
  },
  default: {
    icon: <Frown size={40} className="text-gray-400" />,
    iconBg: "bg-gray-100",
    title: "Payment unsuccessful",
    desc: "Your payment could not be processed. Please try again or use a different payment method.",
    safeToRetry: true,
  },
};

const PLAN_NAMES: Record<string, string> = {
  Basic: "Smile (Free)",
  standard: "BasicSmile",
  popular: "HappySmile",
  premium: "SuperSmile",
};

const PLAN_PRICES: Record<string, string> = {
  Basic: "Free",
  standard: "₵99.99 / month",
  popular: "₵249.99 / month",
  premium: "₵499.99 / month",
};

// ── Main page ──────────────────────────────────────────────────────────────
export default function PaymentFailedPage() {
  const router = useRouter();
  const params = useSearchParams();

  const reason = (params.get("reason") ?? "default") as ReasonKey;
  const planId = params.get("plan") ?? null;
  const cfg = REASONS[reason] ?? REASONS.default;

  const planName = planId ? (PLAN_NAMES[planId] ?? planId) : null;
  const planPrice = planId ? (PLAN_PRICES[planId] ?? "") : null;

  const [showBurst, setShowBurst] = useState(true);
  const [showTips, setShowTips] = useState(false);
  const [returnUrl, setReturnUrl] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setReturnUrl(sessionStorage.getItem("smilebaba_return_url"));
    }

    toast.error(
      reason === "cancelled"
        ? "Payment cancelled — no charge was made."
        : "Payment could not be completed. Please try again.",
      { toastId: "payment-failed", autoClose: 6000 },
    );

    // Stop burst after 2s
    const t = setTimeout(() => setShowBurst(false), 2000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800
      to-gray-900 flex items-center justify-center px-4 py-12 relative"
    >
      {showBurst && <FailBurst />}

      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-72 h-72
          bg-red-500/10 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* ── Main card ── */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div
            className={`${cfg.iconBg} px-6 pt-8 pb-6 text-center border-b border-gray-100`}
          >
            <div
              className="w-20 h-20 bg-white rounded-full flex items-center
              justify-center mx-auto mb-4 shadow-md"
            >
              {cfg.icon}
            </div>
            <h1 className="text-xl font-black text-gray-900 mb-2">
              {cfg.title}
            </h1>
            <p className="text-sm text-gray-500 leading-relaxed max-w-sm mx-auto">
              {cfg.desc}
            </p>
          </div>

          <div className="p-6 space-y-4">
            {/* Plan context */}
            {planId && (
              <div
                className="bg-yellow-50 border border-yellow-200 rounded-2xl
                px-4 py-3 flex items-center gap-3"
              >
                <Star size={16} className="text-yellow-500 flex-shrink-0" />
                <div>
                  <p className="text-xs font-black text-yellow-800">
                    You were trying to get {planName}
                  </p>
                  {planPrice && (
                    <p className="text-[11px] text-yellow-600 mt-0.5">
                      {planPrice} · your spot is saved — retry below
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* No charge assurance */}
            {cfg.safeToRetry && (
              <div
                className="flex items-start gap-2.5 bg-green-50 border
                border-green-200 rounded-2xl px-4 py-3"
              >
                <Shield
                  size={15}
                  className="text-green-500 flex-shrink-0 mt-0.5"
                />
                <p className="text-xs text-green-700 leading-relaxed">
                  <strong>No charge made.</strong> Your account has not been
                  debited. It is safe to retry.
                </p>
              </div>
            )}

            {/* Primary CTAs */}
            <div className="space-y-2.5">
              {cfg.safeToRetry && (
                <button
                  onClick={() =>
                    router.push(
                      planId ? `/subscription?plan=${planId}` : "/subscription",
                    )
                  }
                  className="w-full flex items-center justify-center gap-2 py-3.5
                    bg-yellow-400 text-black font-black rounded-2xl
                    hover:bg-yellow-300 active:scale-[0.99] transition text-sm"
                >
                  <RefreshCw size={15} />
                  Try again{planName ? ` — ${planName}` : ""}
                </button>
              )}

              <Link
                href="/subscription"
                className="w-full flex items-center justify-center gap-2 py-3
                  bg-gray-900 text-white font-semibold rounded-2xl
                  hover:bg-gray-800 transition text-sm"
              >
                View all plans <ArrowRight size={14} />
              </Link>

              {returnUrl && (
                <Link
                  href={returnUrl}
                  className="w-full flex items-center justify-center py-3
                    bg-white border border-gray-200 text-gray-600 font-semibold
                    rounded-2xl hover:bg-gray-50 transition text-sm"
                >
                  Go back to what I was doing
                </Link>
              )}
            </div>

            {/* Troubleshooting tips */}
            <div className="border border-gray-100 rounded-2xl overflow-hidden">
              <button
                onClick={() => setShowTips((v) => !v)}
                className="w-full flex items-center justify-between px-4 py-3
                  text-left hover:bg-gray-50 transition"
              >
                <span className="text-xs font-bold text-gray-700">
                  💡 Troubleshooting tips
                </span>
                {showTips ? (
                  <ChevronUp size={14} className="text-gray-400" />
                ) : (
                  <ChevronDown size={14} className="text-gray-400" />
                )}
              </button>

              {showTips && (
                <div className="px-4 pb-4 space-y-2.5 border-t border-gray-100 pt-3">
                  {[
                    {
                      icon: <RefreshCw size={12} className="text-yellow-600" />,
                      text: "Most failures are temporary — try the payment again",
                    },
                    {
                      icon: <CreditCard size={12} className="text-blue-500" />,
                      text: "Check your card balance or try a different card / MoMo",
                    },
                    {
                      icon: <Zap size={12} className="text-purple-500" />,
                      text: "Disable any VPN — some VPNs block payment gateways",
                    },
                    {
                      icon: <Phone size={12} className="text-green-500" />,
                      text: "Contact your bank if you were charged but didn't receive access",
                    },
                    {
                      icon: (
                        <MessageCircle size={12} className="text-orange-500" />
                      ),
                      text: "Email support@smilebabahub.com if the issue persists",
                    },
                  ].map((tip) => (
                    <div key={tip.text} className="flex items-start gap-2.5">
                      <span className="mt-0.5 flex-shrink-0">{tip.icon}</span>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {tip.text}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Support */}
            <p className="text-center text-xs text-gray-400 pt-1">
              Need help?{" "}
              <a
                href="mailto:support@smilebabahub.com"
                className="text-yellow-600 hover:underline font-semibold"
              >
                support@smilebabahub.com
              </a>
            </p>
          </div>
        </div>

        {/* Back to home */}
        <div className="text-center mt-4">
          <Link
            href="/"
            className="text-xs text-white/40 hover:text-white/70 transition"
          >
            ← Return to SmileBaba home
          </Link>
        </div>
      </div>
    </div>
  );
}
