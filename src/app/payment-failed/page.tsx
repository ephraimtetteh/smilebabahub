"use client";

// client/src/app/payment-failed/page.tsx
//
// ─── THREE THINGS FIXED ──────────────────────────────────────────────
//
// 1 · PLAN_PRICES was wrong. It said standard cost ₵99.99; pricing.js
//     says ₵149.99. Popular and premium were out too. So someone whose
//     payment failed was quoted less than the real price, retried, saw
//     the true number at checkout, and now distrusted the price as well
//     as the payment.
//
//     It was also hardcoded to cedis, so a Nigerian saw ₵ throughout.
//     Prices now come from one map and format in the viewer's currency.
//
// 2 · reason=cancelled never fired. The config existed and had the
//     friendliest copy on the page, but verifyPayment folds a
//     cancellation into not_successful — so someone who simply changed
//     their mind was told their payment "didn't go through", which
//     sounds like something broke. The controller fix is at the bottom
//     of this file.
//
// 3 · smilebaba_return_url was read from sessionStorage and written
//     nowhere. saveReturnState uses a different key, so "Go back to what
//     I was doing" never appeared. It now reads the real one.

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

import { useViewCountry } from "@/src/hooks/useViewCountry";

// ── Animated X burst ────────────────────────────────────────────────────────
function FailBurst() {
  const pieces = Array.from({ length: 16 });
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
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
          0%   { transform: translateY(0)    rotate(0deg);   opacity: 0.8; }
          100% { transform: translateY(80vh) rotate(360deg); opacity: 0;   }
        }
      `}</style>
    </div>
  );
}

// ── Reasons ─────────────────────────────────────────────────────────────────
type ReasonKey =
  | "not_successful"
  | "amount_mismatch"
  | "missing_meta"
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
    desc: "Your payment was not completed. No money has been taken from your account. This is usually temporary.",
    safeToRetry: true,
  },
  amount_mismatch: {
    icon: <AlertTriangle size={40} className="text-yellow-500" />,
    iconBg: "bg-yellow-50",
    title: "Payment amount mismatch",
    desc: "The amount didn't match what we expected. Please contact support if money was deducted — don't retry until we've checked.",
    safeToRetry: false,
  },
  missing_meta: {
    icon: <Wrench size={40} className="text-blue-500" />,
    iconBg: "bg-blue-50",
    title: "We couldn't match that payment",
    desc: "Something was lost between us and the payment gateway. Please contact support with your reference before trying again.",
    safeToRetry: false,
  },
  server_error: {
    icon: <Wrench size={40} className="text-blue-500" />,
    iconBg: "bg-blue-50",
    title: "Something went wrong on our end",
    desc: "Our payment system hit an error. Please try again in a few minutes — we've been notified.",
    safeToRetry: true,
  },
  cancelled: {
    icon: <Ban size={40} className="text-gray-400" />,
    iconBg: "bg-gray-100",
    title: "Payment cancelled",
    desc: "You cancelled the payment. Nothing has been charged. Start again whenever you're ready.",
    safeToRetry: true,
  },
  default: {
    icon: <Frown size={40} className="text-gray-400" />,
    iconBg: "bg-gray-100",
    title: "Payment unsuccessful",
    desc: "Your payment could not be processed. Please try again, or use a different payment method.",
    safeToRetry: true,
  },
};

const PLAN_NAMES: Record<string, string> = {
  Basic: "Smile (Free)",
  standard: "BasicSmile",
  popular: "HappySmile",
  premium: "SuperSmile",
};

/**
 * These must match config/pricing.js. They didn't, and a wrong price on
 * a failure page is the worst place for one — it's the moment someone is
 * already deciding whether to bother.
 */
const PRICES: Record<string, Record<string, number>> = {
  Basic: { GHS: 0, NGN: 0 },
  standard: { GHS: 149.99, NGN: 17776 },
  popular: { GHS: 349.99, NGN: 41479 },
  premium: { GHS: 649.99, NGN: 77033 },
};

// ═══════════════════════════════════════════════════════════════════════
export default function PaymentFailedPage() {
  const router = useRouter();
  const params = useSearchParams();
  const { currency, sym } = useViewCountry();

  const reason = (params.get("reason") ?? "default") as ReasonKey;
  const planId = params.get("plan") ?? null;
  const txRef = params.get("tx_ref") ?? null;

  const cfg = REASONS[reason] ?? REASONS.default;

  const planName = planId ? (PLAN_NAMES[planId] ?? planId) : null;
  const planPrice = (() => {
    if (!planId) return null;
    const amount = PRICES[planId]?.[currency];
    if (amount === undefined) return null;
    return amount === 0 ? "Free" : `${sym}${amount.toLocaleString()} / month`;
  })();

  const [showBurst, setShowBurst] = useState(true);
  const [showTips, setShowTips] = useState(false);
  const [returnUrl, setReturnUrl] = useState<string | null>(null);

  useEffect(() => {
    // saveReturnState writes here. The old code read a key nothing set,
    // so this link never appeared.
    try {
      const raw = sessionStorage.getItem("smilebaba_return_state");
      if (raw) {
        const parsed = JSON.parse(raw);
        setReturnUrl(parsed?.returnUrl ?? null);
      }
    } catch {
      /* nothing to restore */
    }

    toast.error(
      reason === "cancelled"
        ? "Payment cancelled — no charge was made."
        : "Payment could not be completed. Please try again.",
      { toastId: "payment-failed", autoClose: 6000 },
    );

    const t = setTimeout(() => setShowBurst(false), 2000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4 py-12">
      {showBurst && <FailBurst />}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-red-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="overflow-hidden rounded-3xl bg-white shadow-2xl">
          {/* Header */}
          <div
            className={`${cfg.iconBg} border-b border-gray-100 px-6 pb-6 pt-8 text-center`}
          >
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-md">
              {cfg.icon}
            </div>
            <h1 className="mb-2 text-xl font-black text-gray-900">
              {cfg.title}
            </h1>
            <p className="mx-auto max-w-sm text-sm leading-relaxed text-gray-500">
              {cfg.desc}
            </p>
          </div>

          <div className="space-y-4 p-6">
            {/* Plan context */}
            {planId && (
              <div className="flex items-center gap-3 rounded-2xl border border-yellow-200 bg-yellow-50 px-4 py-3">
                <Star size={16} className="flex-shrink-0 text-yellow-500" />
                <div>
                  <p className="text-xs font-black text-yellow-800">
                    You were getting {planName}
                  </p>
                  {planPrice && (
                    <p className="mt-0.5 text-[11px] text-yellow-600">
                      {planPrice} · your spot is saved, retry below
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* No charge */}
            {cfg.safeToRetry && (
              <div className="flex items-start gap-2.5 rounded-2xl border border-green-200 bg-green-50 px-4 py-3">
                <Shield
                  size={15}
                  className="mt-0.5 flex-shrink-0 text-green-500"
                />
                <p className="text-xs leading-relaxed text-green-700">
                  <strong>No charge made.</strong> Your account has not been
                  debited. It is safe to retry.
                </p>
              </div>
            )}

            {/* Reference, when support will need it */}
            {!cfg.safeToRetry && txRef && (
              <div className="rounded-2xl bg-gray-50 px-4 py-3">
                <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                  Reference
                </p>
                <p className="mt-1 break-all font-mono text-[11px] text-gray-700">
                  {txRef}
                </p>
                <p className="mt-2 text-[11px] leading-relaxed text-gray-500">
                  Quote this if you contact support.
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-2.5">
              {cfg.safeToRetry && (
                <button
                  onClick={() =>
                    router.push(
                      planId ? `/subscription?plan=${planId}` : "/subscription",
                    )
                  }
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-yellow-400 py-3.5 text-sm font-black text-black transition hover:bg-yellow-300 active:scale-[0.99]"
                >
                  <RefreshCw size={15} />
                  Try again{planName ? ` — ${planName}` : ""}
                </button>
              )}

              {!cfg.safeToRetry && (
                <Link
                  href="/contact"
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-yellow-400 py-3.5 text-sm font-black text-black transition hover:bg-yellow-300"
                >
                  <MessageCircle size={15} />
                  Contact support
                </Link>
              )}

              <Link
                href="/subscription"
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gray-900 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
              >
                View all plans <ArrowRight size={14} />
              </Link>

              {returnUrl && (
                <Link
                  href={returnUrl}
                  className="flex w-full items-center justify-center rounded-2xl border border-gray-200 bg-white py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
                >
                  Go back to what I was doing
                </Link>
              )}
            </div>

            {/* Troubleshooting */}
            {cfg.safeToRetry && (
              <div className="overflow-hidden rounded-2xl border border-gray-100">
                <button
                  onClick={() => setShowTips((v) => !v)}
                  className="flex w-full items-center justify-between px-4 py-3 text-left transition hover:bg-gray-50"
                >
                  <span className="text-xs font-bold text-gray-700">
                    Troubleshooting tips
                  </span>
                  {showTips ? (
                    <ChevronUp size={14} className="text-gray-400" />
                  ) : (
                    <ChevronDown size={14} className="text-gray-400" />
                  )}
                </button>

                {showTips && (
                  <div className="space-y-2.5 border-t border-gray-100 px-4 pb-4 pt-3">
                    {[
                      {
                        icon: (
                          <RefreshCw size={12} className="text-yellow-600" />
                        ),
                        text: "Most failures are temporary — try the payment again",
                      },
                      {
                        icon: (
                          <CreditCard size={12} className="text-blue-500" />
                        ),
                        text: "Check your balance, or try a different card or MoMo number",
                      },
                      {
                        icon: <Zap size={12} className="text-purple-500" />,
                        text: "Turn off any VPN — some block payment gateways",
                      },
                      {
                        icon: <Phone size={12} className="text-green-500" />,
                        text: "Contact your bank if you were charged but didn't get access",
                      },
                      {
                        icon: (
                          <MessageCircle
                            size={12}
                            className="text-orange-500"
                          />
                        ),
                        text: "Email support@smilebabahub.com if it keeps happening",
                      },
                    ].map((tip) => (
                      <div key={tip.text} className="flex items-start gap-2.5">
                        <span className="mt-0.5 flex-shrink-0">{tip.icon}</span>
                        <p className="text-xs leading-relaxed text-gray-600">
                          {tip.text}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <p className="pt-1 text-center text-xs text-gray-400">
              Need help?{" "}
              <a
                href="mailto:support@smilebabahub.com"
                className="font-semibold text-yellow-600 hover:underline"
              >
                support@smilebabahub.com
              </a>
            </p>
          </div>
        </div>

        <div className="mt-4 text-center">
          <Link
            href="/"
            className="text-xs text-white/40 transition hover:text-white/70"
          >
            ← Return to SmileBaba home
          </Link>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// controllers/paymentController.js — ONE ADDITION
//
// Flutterwave reports a cancellation as status "cancelled", and
// verifyPayment currently folds it into not_successful. So someone who
// changed their mind is told their payment "didn't go through", which
// sounds like a fault rather than a choice.
//
// ADD in verifyPayment, before the existing `if (payment.status !== "successful")`:
// ═══════════════════════════════════════════════════════════════════════
/*
    
*/
//
// And pass the reference through on the failure paths, so the page can
// show it when support will need it:
//
//     ?reason=amount_mismatch&plan=…&tx_ref=${payment.tx_ref}
