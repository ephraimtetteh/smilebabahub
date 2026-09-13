"use client";

// client/src/app/checkout/complete/page.tsx
//
// Where Flutterwave sends a buyer after paying for an order.
//
// ─── HOW THIS RELATES TO /payment-success AND /payment-failed ────────
//
// Those two handle subscriptions and boosts, and they can be confident:
// verifyPayment checks the transaction server-side *before* redirecting,
// so by the time someone lands there the outcome is already settled.
//
// Orders work the other way round. initOrderPayment sends the buyer
// straight back here and the webhook marks the order paid a moment
// later — so this page has to confirm for itself, and often has to wait
// a second or two for the webhook to land.
//
// That's why it's a separate page rather than another branch of
// /payment-success. Same visual language, different job.
//
// ─── IT DOESN'T TRUST THE URL ────────────────────────────────────────
//
// `?status=successful` is a query parameter. Anyone can type it. This
// reads the order group back from our own API and only says "paid" when
// the server agrees.
//
// And it polls, because the redirect usually beats the webhook. Checking
// once would show "not paid" on a payment that went through perfectly,
// and the buyer would pay twice.

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Ban,
  Loader2,
  Shield,
  ShoppingBag,
  ArrowRight,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Phone,
  MessageCircle,
  Zap,
  Package,
} from "lucide-react";
import { toast } from "react-toastify";

import { useAppDispatch } from "@/src/app/redux";
import { clearCart } from "@/src/lib/features/cart/cartSlice";
import axiosInstance from "@/src/lib/api/axios";

type State = "checking" | "paid" | "cancelled" | "failed" | "unconfirmed";

/** The webhook usually lands within a couple of seconds. */
const ATTEMPTS = 6;
const GAP_MS = 1800;

// ── Confetti — same pattern as payment-success ──────────────────────────────
function Confetti() {
  const COLORS = [
    "#ffc105",
    "#22c55e",
    "#3b82f6",
    "#f97316",
    "#a855f7",
    "#ec4899",
    "#ffffff",
  ];
  const pieces = Array.from({ length: 40 });

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {pieces.map((_, i) => (
        <span
          key={i}
          className="absolute opacity-0"
          style={{
            left: `${Math.random() * 100}%`,
            top: "-12px",
            width: `${6 + (i % 3) * 4}px`,
            height: `${6 + (i % 3) * 4}px`,
            borderRadius: i % 3 === 0 ? "50%" : i % 3 === 1 ? "2px" : "0",
            background: COLORS[i % COLORS.length],
            animation: `orderConfetti ${1.2 + (i % 5) * 0.25}s ease-in ${i * 0.06}s forwards`,
            transform: `rotate(${i * 23}deg)`,
          }}
        />
      ))}
      <style>{`
        @keyframes orderConfetti {
          0%   { transform: translateY(0)     rotate(0deg);   opacity: 1; }
          100% { transform: translateY(105vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

// ── Outcome configs, mirroring the REASONS map in payment-failed ────────────
const OUTCOMES: Record<
  Exclude<State, "checking">,
  {
    icon: React.ReactNode;
    iconBg: string;
    title: string;
    desc: string;
    safeToRetry: boolean;
  }
> = {
  paid: {
    icon: <CheckCircle2 size={40} className="text-green-500" />,
    iconBg: "bg-green-50",
    title: "Payment confirmed",
    desc: "Your order is paid and the seller has been notified. We're holding your money until you confirm the item arrived.",
    safeToRetry: false,
  },
  cancelled: {
    icon: <Ban size={40} className="text-gray-400" />,
    iconBg: "bg-gray-100",
    title: "Payment cancelled",
    desc: "You cancelled the payment. Nothing has been charged, and your order is saved — pay for it whenever you're ready.",
    safeToRetry: true,
  },
  failed: {
    icon: <XCircle size={40} className="text-red-500" />,
    iconBg: "bg-red-50",
    title: "Payment didn't go through",
    desc: "Your bank declined it or it timed out. No money has been taken, and your order is still waiting.",
    safeToRetry: true,
  },
  unconfirmed: {
    icon: <Clock size={40} className="text-yellow-500" />,
    iconBg: "bg-yellow-50",
    title: "Still confirming",
    // The likeliest truth is that it worked and the webhook is late.
    // Saying "failed" here would send someone to pay twice.
    desc: "Your payment is probably fine — banks sometimes take a minute. Check your orders shortly and it should show as paid.",
    safeToRetry: false,
  },
};

// ═══════════════════════════════════════════════════════════════════════
export default function CheckoutCompletePage() {
  const params = useSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const group = params.get("group");
  const status = (params.get("status") ?? "").toLowerCase();
  const txRef = params.get("tx_ref");
  const transactionId =
    params.get("transaction_id") ?? params.get("transactionId");

  const [state, setState] = useState<State>("checking");
  const [orders, setOrders] = useState<any[]>([]);
  const [attempt, setAttempt] = useState(0);
  const [retrying, setRetrying] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showTips, setShowTips] = useState(false);

  const ran = useRef(false);

  /** Reads the group back and reports whether the server thinks it's paid. */
  const checkOnce = useCallback(async (): Promise<boolean> => {
    try {
      const { data } = await axiosInstance.get(`/orders/group/${group}`);
      const list = data?.orders ?? (data?.order ? [data.order] : []);
      if (list.length > 0) setOrders(list);
      return list.length > 0 && list.every((o: any) => o.status !== "pending");
    } catch {
      // The group endpoint may not exist. /orders/my definitely does.
      try {
        const { data } = await axiosInstance.get("/orders/my");
        const mine = (data?.orders ?? []).filter(
          (o: any) => o.orderGroup === group,
        );
        if (mine.length > 0) setOrders(mine);
        return (
          mine.length > 0 && mine.every((o: any) => o.status !== "pending")
        );
      } catch {
        return false;
      }
    }
  }, [group]);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    if (!group) {
      setState("failed");
      return;
    }

    // Flutterwave is explicit about a cancellation and there's nothing to
    // confirm — the order stays pending and can be paid later.
    if (status === "cancelled") {
      setState("cancelled");
      toast.info("Payment cancelled — no charge was made.", {
        toastId: "order-cancelled",
        autoClose: 5000,
      });
      checkOnce();
      return;
    }

    let stopped = false;

    const run = async () => {
      // Nudge server-side verification if that endpoint exists. Harmless
      // when it doesn't — the webhook does the same job.
      if (transactionId || txRef) {
        await axiosInstance
          .post("/orders/verify", { transactionId, txRef, orderGroup: group })
          .catch(() => {});
      }

      for (let i = 0; i < ATTEMPTS; i++) {
        if (stopped) return;
        setAttempt(i + 1);

        const paid = await checkOnce();
        if (stopped) return;

        if (paid) {
          dispatch(clearCart());
          setState("paid");
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 3200);
          return;
        }

        if (i < ATTEMPTS - 1) {
          await new Promise((r) => setTimeout(r, GAP_MS));
        }
      }

      setState(status === "failed" ? "failed" : "unconfirmed");
    };

    run();
    return () => {
      stopped = true;
    };
  }, [group, status, txRef, transactionId, checkOnce, dispatch]);

  // ─── Pay again ────────────────────────────────────────────────────
  const retryPayment = async () => {
    if (!group) return;
    setRetrying(true);
    try {
      const { data } = await axiosInstance.post(
        `/orders/group/${group}/pay`,
        {},
      );
      const link = data?.paymentLink ?? data?.link ?? data?.checkoutUrl;
      if (link) {
        window.location.assign(link);
        return;
      }
      throw new Error("No payment link");
    } catch (err: any) {
      setRetrying(false);
      toast.error(
        err?.response?.data?.message ??
          "Couldn't reopen payment. Try again from your orders.",
      );
      router.push("/account/orders");
    }
  };

  const total = orders.reduce((s, o) => s + (Number(o.total) || 0), 0);
  const sym = orders[0]?.currency === "NGN" ? "₦" : "GH₵";
  const cfg = state === "checking" ? null : OUTCOMES[state];

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4 py-12">
      {showConfetti && <Confetti />}

      {/* Background glow, tinted by outcome */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className={`absolute left-1/2 top-1/4 h-96 w-96 -translate-x-1/2 rounded-full blur-3xl ${
            state === "paid"
              ? "bg-yellow-400/10"
              : state === "failed"
                ? "bg-red-500/10"
                : "bg-white/5"
          }`}
        />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* ─── Checking ─── */}
        {state === "checking" && (
          <div className="text-center">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-white/10">
              <Loader2 size={40} className="animate-spin text-yellow-400" />
            </div>

            <h1 className="mt-6 text-2xl font-black text-white">
              Confirming your payment
            </h1>
            <p className="mt-2 text-sm text-white/60">
              This takes a few seconds. Please don&apos;t close this page.
            </p>

            {attempt > 2 && (
              <p className="mt-3 text-xs text-white/40">
                Still checking — your bank can be slow to confirm.
              </p>
            )}

            <div className="mt-6 flex items-center justify-center gap-1.5">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="h-2 w-2 rounded-full bg-yellow-400"
                  style={{
                    animation: `orderBounce 0.9s ease-in-out ${i * 0.15}s infinite alternate`,
                  }}
                />
              ))}
            </div>
            <style>{`
              @keyframes orderBounce {
                from { transform: translateY(0);    opacity: 0.4; }
                to   { transform: translateY(-6px); opacity: 1;   }
              }
            `}</style>
          </div>
        )}

        {/* ─── Result ─── */}
        {cfg && (
          <>
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
                {/* What was ordered */}
                {orders.length > 0 && (
                  <div className="flex items-center gap-3 rounded-2xl border border-gray-100 px-4 py-3">
                    <Package size={16} className="shrink-0 text-gray-400" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-black text-gray-900">
                        {orders.length > 1
                          ? `${orders.length} orders`
                          : "1 order"}
                        {orders.length > 1 && " from different sellers"}
                      </p>
                      {total > 0 && (
                        <p className="mt-0.5 text-[11px] text-gray-500">
                          {sym} {total.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Escrow, on success */}
                {state === "paid" && (
                  <div className="flex items-start gap-2.5 rounded-2xl border border-green-200 bg-green-50 px-4 py-3">
                    <Shield
                      size={15}
                      className="mt-0.5 shrink-0 text-green-500"
                    />
                    <p className="text-xs leading-relaxed text-green-700">
                      <strong>Your money is protected.</strong> We release it to
                      the seller only once you confirm the item arrived.
                    </p>
                  </div>
                )}

                {/* No charge, when that's true */}
                {(state === "cancelled" || state === "failed") && (
                  <div className="flex items-start gap-2.5 rounded-2xl border border-green-200 bg-green-50 px-4 py-3">
                    <Shield
                      size={15}
                      className="mt-0.5 shrink-0 text-green-500"
                    />
                    <p className="text-xs leading-relaxed text-green-700">
                      <strong>No charge made.</strong> Your account has not been
                      debited. It is safe to retry.
                    </p>
                  </div>
                )}

                {/* Reference, when we can't confirm */}
                {state === "unconfirmed" && txRef && (
                  <div className="rounded-2xl bg-gray-50 px-4 py-3">
                    <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                      Reference
                    </p>
                    <p className="mt-1 break-all font-mono text-[11px] text-gray-700">
                      {txRef}
                    </p>
                    <p className="mt-2 text-[11px] leading-relaxed text-gray-500">
                      Please don&apos;t pay again. If it hasn&apos;t updated in
                      ten minutes, contact support with this reference.
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="space-y-2.5">
                  {cfg.safeToRetry && (
                    <button
                      onClick={retryPayment}
                      disabled={retrying}
                      className="flex w-full items-center justify-center gap-2 rounded-2xl bg-yellow-400 py-3.5 text-sm font-black text-black transition hover:bg-yellow-300 active:scale-[0.99] disabled:opacity-60"
                    >
                      {retrying ? (
                        <>
                          <Loader2 size={15} className="animate-spin" />
                          Opening payment…
                        </>
                      ) : (
                        <>
                          <RefreshCw size={15} />
                          Try paying again
                        </>
                      )}
                    </button>
                  )}

                  <Link
                    href="/account/orders"
                    className={`flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-black transition ${
                      cfg.safeToRetry
                        ? "bg-gray-900 text-white hover:bg-gray-800"
                        : "bg-yellow-400 text-black hover:bg-yellow-300"
                    }`}
                  >
                    <ShoppingBag size={15} />
                    {state === "paid" ? "Track your order" : "View my orders"}
                    <ArrowRight size={14} />
                  </Link>

                  {state === "paid" && (
                    <Link
                      href="/ads"
                      className="flex w-full items-center justify-center rounded-2xl border border-gray-200 bg-white py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
                    >
                      Keep shopping
                    </Link>
                  )}
                </div>

                {/* Troubleshooting, mirroring payment-failed */}
                {(state === "failed" || state === "unconfirmed") && (
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
                              <RefreshCw
                                size={12}
                                className="text-yellow-600"
                              />
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
                            icon: (
                              <Phone size={12} className="text-green-500" />
                            ),
                            text: "Contact your bank if you were charged but the order still says pending",
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
                          <div
                            key={tip.text}
                            className="flex items-start gap-2.5"
                          >
                            <span className="mt-0.5 shrink-0">{tip.icon}</span>
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
          </>
        )}
      </div>
    </div>
  );
}
