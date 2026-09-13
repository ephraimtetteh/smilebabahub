"use client";

// client/src/app/payment-success/page.tsx
//
// Subscriptions and boosts. verifyPayment checks the transaction
// server-side before redirecting here, so by the time someone lands the
// outcome is already settled — this page celebrates, it doesn't verify.
//
// Orders work the other way round and live at /checkout/complete.
//
// ─── TWO FIXES ───────────────────────────────────────────────────────
//
// 1 · An order payment that lands here used to be redirected to "/" with
//     no confirmation at all — the buyer pays and sees the homepage.
//     It's now forwarded to /checkout/complete, which can confirm it.
//
// 2 · The resume poll had no ceiling. If restoreSession never resolved,
//     tryRedirect called itself every 200ms forever. It now gives up
//     after ten seconds and goes to the dashboard, which is a worse
//     destination than the form but far better than a page that never
//     moves.

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  Package,
  Zap,
  ArrowRight,
  Plus,
  X,
  LayoutDashboard,
  ShoppingBag,
  Star,
  Sparkles,
} from "lucide-react";

import { useResumeAction } from "@/src/hooks/useResumeAction";
import { useAppDispatch, useAppSelector } from "@/src/app/redux";
import { restoreSession } from "@/src/lib/features/auth/authActions";
import axiosInstance from "@/src/lib/api/axios";

// ── Confetti ────────────────────────────────────────────────────────────────
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
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
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
            animation: `confettiFall ${1.2 + (i % 5) * 0.25}s ease-in ${i * 0.06}s forwards`,
            transform: `rotate(${i * 23}deg)`,
          }}
        />
      ))}
      <style>{`
        @keyframes confettiFall {
          0%   { transform: translateY(0)     rotate(0deg);   opacity: 1; }
          100% { transform: translateY(105vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

const PLAN_FEATURES: Record<string, string[]> = {
  Basic: ["1 listing", "3-day duration", "Basic dashboard"],
  standard: [
    "5 listings",
    "30-day duration",
    "Radio & TV ads",
    "Social media ads",
  ],
  popular: [
    "10 listings",
    "30-day duration",
    "Full analytics",
    "Radio & TV ads",
    "Priority support",
  ],
  premium: [
    "Unlimited listings",
    "60-day duration",
    "Full analytics",
    "Featured placement",
    "Priority support",
  ],
};

const PLAN_NAMES: Record<string, string> = {
  Basic: "Smile",
  standard: "BasicSmile",
  popular: "HappySmile",
  premium: "SuperSmile",
};

// ── Congratulations modal ───────────────────────────────────────────────────
function CongratsModal({
  firstName,
  plan,
  onClose,
}: {
  firstName: string;
  plan: string | null;
  onClose: () => void;
}) {
  const router = useRouter();
  const [ads, setAds] = useState<any[]>([]);
  const [tab, setTab] = useState<"actions" | "boost">("actions");

  useEffect(() => {
    axiosInstance
      .get("/ads/my?limit=8")
      .then((r) => setAds(r.data.ads ?? []))
      .catch(() => {});
  }, []);

  const planKey = (plan ?? "standard") as keyof typeof PLAN_FEATURES;
  const planName = PLAN_NAMES[planKey] ?? plan ?? "Vendor";
  const features = PLAN_FEATURES[planKey] ?? PLAN_FEATURES.standard;
  const nonBoosted = ads.filter((a) => !a.boost?.isBoosted && a.isActive);

  return (
    <div
      className="fixed inset-0 z-40 flex items-end justify-center p-3 sm:items-center sm:p-6"
      style={{ background: "rgba(0,0,0,0.65)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="flex max-h-[92vh] w-full max-w-md flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* Header */}
        <div className="relative flex-shrink-0 bg-gradient-to-br from-gray-900 to-gray-800 px-6 pb-6 pt-8 text-center text-white">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
            aria-label="Close"
          >
            <X size={14} />
          </button>

          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-yellow-400 shadow-lg shadow-yellow-400/30">
            <CheckCircle2 size={36} className="text-black" />
          </div>

          <h2 className="mb-1 text-2xl font-black">
            Congratulations, {firstName}!
          </h2>
          <p className="text-sm leading-relaxed text-white/70">
            Your <span className="font-bold text-yellow-400">{planName}</span>{" "}
            plan is active. Welcome to the SmileBaba vendor family.
          </p>

          <div className="mt-4 flex flex-wrap justify-center gap-1.5">
            {features.slice(0, 3).map((f) => (
              <span
                key={f}
                className="rounded-full border border-white/10 bg-white/10 px-2.5 py-1 text-[10px] font-semibold text-white/90"
              >
                ✓ {f}
              </span>
            ))}
            {features.length > 3 && (
              <span className="rounded-full border border-yellow-400/20 bg-yellow-400/20 px-2.5 py-1 text-[10px] font-semibold text-yellow-300">
                +{features.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="mx-5 mt-4 flex flex-shrink-0 gap-1 rounded-xl bg-gray-100 p-1">
          <button
            onClick={() => setTab("actions")}
            className={`flex-1 rounded-lg py-2 text-xs font-bold transition ${
              tab === "actions"
                ? "bg-white text-gray-900 shadow"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Quick actions
          </button>
          <button
            onClick={() => setTab("boost")}
            className={`flex-1 rounded-lg py-2 text-xs font-bold transition ${
              tab === "boost"
                ? "bg-white text-gray-900 shadow"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Boost an ad
            {nonBoosted.length > 0 && (
              <span className="ml-1.5 rounded-full bg-yellow-400 px-1.5 py-0.5 text-[9px] font-black text-black">
                {nonBoosted.length}
              </span>
            )}
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 pb-5 pt-3">
          {tab === "actions" && (
            <div className="space-y-2.5">
              {[
                {
                  href: "/sell",
                  icon: <Plus size={18} className="text-black" />,
                  iconBg: "bg-yellow-400",
                  title: "Post a new ad",
                  sub: "List a product, food, property or service",
                  dark: true,
                },
                {
                  href: "/vendor/dashboard",
                  icon: (
                    <LayoutDashboard size={16} className="text-purple-600" />
                  ),
                  iconBg: "bg-purple-100",
                  title: "Go to dashboard",
                  sub: "Analytics, orders and messages",
                  dark: false,
                },
                {
                  href: "/ads/my",
                  icon: <ShoppingBag size={16} className="text-blue-600" />,
                  iconBg: "bg-blue-100",
                  title: "Manage my ads",
                  sub:
                    ads.length > 0
                      ? `You have ${ads.length} listing${ads.length !== 1 ? "s" : ""}`
                      : "View and edit listings",
                  dark: false,
                },
                {
                  href: "/account/store",
                  icon: <Star size={16} className="text-orange-500" />,
                  iconBg: "bg-orange-100",
                  title: "Complete your store",
                  sub: "Add a logo, banner and social links",
                  dark: false,
                },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`group flex items-center gap-3 rounded-2xl p-3.5 transition-all active:scale-[0.99] ${
                    item.dark
                      ? "bg-gray-900 text-white hover:bg-gray-800"
                      : "border border-gray-100 bg-white hover:border-yellow-200 hover:bg-yellow-50"
                  }`}
                >
                  <div
                    className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl ${item.iconBg}`}
                  >
                    {item.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-sm font-black ${item.dark ? "text-white" : "text-gray-900"}`}
                    >
                      {item.title}
                    </p>
                    <p
                      className={`mt-0.5 text-xs ${item.dark ? "text-white/60" : "text-gray-400"}`}
                    >
                      {item.sub}
                    </p>
                  </div>
                  <ArrowRight
                    size={14}
                    className={`flex-shrink-0 transition ${
                      item.dark
                        ? "text-white/40 group-hover:text-white/80"
                        : "text-gray-300 group-hover:text-gray-600"
                    }`}
                  />
                </Link>
              ))}
            </div>
          )}

          {tab === "boost" && (
            <div>
              {ads.length === 0 ? (
                <div className="py-8 text-center">
                  <Package size={28} className="mx-auto mb-3 text-gray-200" />
                  <p className="mb-1 text-sm font-semibold text-gray-600">
                    No ads yet
                  </p>
                  <p className="mb-4 text-xs text-gray-400">
                    Post your first listing, then come back to boost it.
                  </p>
                  <Link
                    href="/sell"
                    onClick={onClose}
                    className="inline-block rounded-xl bg-yellow-400 px-5 py-2.5 text-xs font-black text-black transition hover:bg-yellow-300"
                  >
                    Post an ad →
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {ads.map((ad) => (
                    <div
                      key={ad._id}
                      className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-3 transition hover:border-yellow-300"
                    >
                      <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100">
                        {ad.images?.[0]?.url ? (
                          <img
                            src={ad.images[0].url}
                            alt={ad.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <Package size={14} className="text-gray-300" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-bold text-gray-900">
                          {ad.title}
                        </p>
                        <p className="mt-0.5 text-[10px] text-gray-400">
                          {ad.views ?? 0} views
                        </p>
                      </div>
                      {ad.boost?.isBoosted ? (
                        <span className="flex flex-shrink-0 items-center gap-1 rounded-full bg-yellow-100 px-2 py-1 text-[10px] font-bold text-yellow-700">
                          <Zap size={9} /> Boosted
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            router.push(`/ads/${ad._id}?boost=1`);
                            onClose();
                          }}
                          className="flex flex-shrink-0 items-center gap-1 rounded-xl bg-gray-900 px-3 py-1.5 text-[11px] font-black text-yellow-400 transition-all hover:bg-gray-700 active:scale-95"
                        >
                          <Zap size={10} /> Boost
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 border-t border-gray-100 px-5 pb-5 pt-2">
          <p className="text-center text-[11px] text-gray-400">
            A confirmation email is on its way ·{" "}
            <Link
              href="/vendor/purchase-history"
              onClick={onClose}
              className="font-semibold text-yellow-600 hover:underline"
            >
              View receipt
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
export default function PaymentSuccessPage() {
  const router = useRouter();
  const params = useSearchParams();
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);

  const isSubscribedCallback = params.get("subscribed") === "1";
  const isBoostedCallback = params.get("boosted") === "1";
  const isFlwDirect =
    params.get("status") === "successful" && !!params.get("transaction_id");
  const isLegitimate = isSubscribedCallback || isBoostedCallback || isFlwDirect;
  const isEffectiveSub = isSubscribedCallback || isFlwDirect;

  const plan = params.get("plan") ?? user?.subscription?.plan ?? null;

  const [showConfetti, setShowConfetti] = useState(isLegitimate);
  const [showModal, setShowModal] = useState(false);
  const [resuming, setResuming] = useState(false);
  const [resumeLabel, setResumeLabel] = useState<string | null>(null);
  const [redirectTo, setRedirectTo] = useState<string | null>(null);
  const [sessionRefreshed, setSessionRefreshed] = useState(false);
  const modalShownRef = useRef(false);

  /**
   * An order group in the URL means someone pointed an order's
   * redirect_url at this page. Forward it rather than dropping them on
   * the homepage having just paid — this page can't confirm an order,
   * /checkout/complete can.
   */
  useEffect(() => {
    if (isLegitimate) return;

    const group = params.get("group");
    if (group) {
      const qs = typeof window !== "undefined" ? window.location.search : "";
      router.replace(`/checkout/complete${qs}`);
      return;
    }

    router.replace("/");
  }, [isLegitimate, params, router]);

  // Await the refresh so the new role is in Redux before any redirect —
  // otherwise /sell sees role "guest" and bounces them to onboarding
  useEffect(() => {
    if (!isLegitimate) return;
    let cancelled = false;

    (async () => {
      try {
        await dispatch(restoreSession()).unwrap();
      } catch {
        // The backend role is set regardless; worst case they refresh
      }
      if (!cancelled) setSessionRefreshed(true);
    })();

    return () => {
      cancelled = true;
    };
  }, [isLegitimate, dispatch]);

  useEffect(() => {
    if (!isLegitimate || modalShownRef.current) return;
    const t = setTimeout(() => {
      setShowConfetti(false);
      if (isEffectiveSub) {
        setTimeout(() => {
          setShowModal(true);
          modalShownRef.current = true;
        }, 400);
      }
    }, 3000);
    return () => clearTimeout(t);
  }, [isLegitimate, isEffectiveSub]);

  useEffect(() => {
    if (redirectTo) router.push(redirectTo);
  }, [redirectTo, router]);

  useResumeAction({
    onResume: (action) => {
      setResuming(true);
      const labels: Record<string, string> = {
        post_product: "Taking you back to post your listing…",
        boost_product: "Applying your boost…",
        create_listing: "Resuming your listing…",
      };
      setResumeLabel(labels[action.type] ?? "Resuming…");

      const target =
        action.type === "boost_product" ? "/vendor/dashboard" : "/sell";

      // The old version polled forever if restoreSession never resolved.
      // Fifty attempts is ten seconds, then give up and go somewhere —
      // a worse destination beats a page that never moves.
      let tries = 0;
      const tryRedirect = () => {
        if (sessionRefreshed) {
          setTimeout(() => setRedirectTo(target), 1200);
          return;
        }
        if (++tries > 50) {
          setRedirectTo("/vendor/dashboard");
          return;
        }
        setTimeout(tryRedirect, 200);
      };
      tryRedirect();
    },
  });

  if (!isLegitimate) return null;

  const firstName = user?.username?.split(" ")[0] ?? "there";

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4 py-12">
      {showConfetti && <Confetti />}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/4 h-96 w-96 -translate-x-1/2 rounded-full bg-yellow-400/10 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md text-center">
        {/* Boost */}
        {isBoostedCallback && !isFlwDirect && (
          <div className="rounded-3xl bg-white p-8 shadow-2xl">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-yellow-400 shadow-lg shadow-yellow-400/30">
              <Zap size={36} className="text-black" />
            </div>
            <h1 className="mb-2 text-2xl font-black text-gray-900">
              Your ad is boosted
            </h1>
            <p className="mb-8 text-sm text-gray-500">
              It now appears at the top of search results and will reach more
              buyers across Ghana and Nigeria.
            </p>
            <div className="flex flex-col gap-3">
              <Link
                href="/vendor/dashboard"
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gray-900 py-3 text-sm font-black text-white transition hover:bg-gray-800"
              >
                <LayoutDashboard size={15} /> Go to dashboard
              </Link>
              <Link
                href="/ads"
                className="w-full rounded-2xl bg-yellow-400 py-3 text-sm font-black text-black transition hover:bg-yellow-300"
              >
                Browse marketplace
              </Link>
            </div>
          </div>
        )}

        {/* Subscription, before the modal */}
        {isEffectiveSub && !showModal && (
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-yellow-400 shadow-2xl shadow-yellow-400/30">
              <CheckCircle2 size={44} className="text-black" />
            </div>

            <div className="mb-3 flex items-center justify-center gap-2">
              <Sparkles size={16} className="text-yellow-400" />
              <span className="text-sm font-bold uppercase tracking-widest text-yellow-400">
                Payment successful
              </span>
              <Sparkles size={16} className="text-yellow-400" />
            </div>

            <h1 className="mb-3 text-3xl font-black text-white sm:text-4xl">
              Welcome to SmileBaba,
              <br />
              {firstName}!
            </h1>
            <p className="mb-8 text-sm text-white/60">
              Your subscription is active — setting up your dashboard…
            </p>

            {resuming && resumeLabel && (
              <div className="mb-5 flex items-center justify-center gap-3 rounded-2xl border border-white/20 bg-white/10 p-4 text-white">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-yellow-400/50 border-t-yellow-400" />
                <p className="text-sm font-medium">{resumeLabel}</p>
              </div>
            )}

            <div className="flex items-center justify-center gap-1.5">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="h-2 w-2 rounded-full bg-yellow-400"
                  style={{
                    animation: `successBounce 0.9s ease-in-out ${i * 0.15}s infinite alternate`,
                  }}
                />
              ))}
            </div>
            <style>{`
              @keyframes successBounce {
                from { transform: translateY(0);    opacity: 0.4; }
                to   { transform: translateY(-6px); opacity: 1;   }
              }
            `}</style>
          </div>
        )}
      </div>

      {showModal && (
        <CongratsModal
          firstName={firstName}
          plan={plan}
          onClose={() => {
            setShowModal(false);
            router.replace("/vendor/dashboard");
          }}
        />
      )}
    </div>
  );
}
