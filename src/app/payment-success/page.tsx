"use client";
// src/app/payment-success/page.tsx

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  Package,
  Zap,
  BarChart2,
  Megaphone,
  Globe,
  ArrowRight,
  Plus,
  X,
  LayoutDashboard,
  ShoppingBag,
  Star,
  Sparkles,
} from "lucide-react";
import { useResumeAction } from "@/src/hooks/useResumeAction";
import { useAppSelector } from "@/src/app/redux";
import { restoreSession } from "@/src/lib/features/auth/authActions";
import { useAppDispatch } from "@/src/app/redux";
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
            animation: `confettiFall ${1.2 + (i % 5) * 0.25}s ease-in ${i * 0.06}s forwards`,
            transform: `rotate(${i * 23}deg)`,
          }}
        />
      ))}
      <style>{`
        @keyframes confettiFall {
          0%   { transform: translateY(0)     rotate(0deg)   scaleX(1);   opacity: 1; }
          50%  { opacity: 1; scaleX(-1); }
          100% { transform: translateY(105vh) rotate(720deg) scaleX(-1);  opacity: 0; }
        }
      `}</style>
    </div>
  );
}

// ── Plan feature map ─────────────────────────────────────────────────────────
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

// ── Congratulations modal ────────────────────────────────────────────────────
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
      className="fixed inset-0 z-40 flex items-end sm:items-center
      justify-center p-3 sm:p-6"
      style={{ background: "rgba(0,0,0,0.65)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="bg-white rounded-3xl w-full max-w-md shadow-2xl
        overflow-hidden max-h-[92vh] flex flex-col"
      >
        {/* ── Header ── */}
        <div
          className="relative bg-gradient-to-br from-gray-900 to-gray-800
          text-white px-6 pt-8 pb-6 text-center flex-shrink-0"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-7 h-7 bg-white/10 rounded-full
              flex items-center justify-center hover:bg-white/20 transition"
          >
            <X size={14} />
          </button>

          {/* Animated check */}
          <div
            className="w-20 h-20 bg-yellow-400 rounded-full flex items-center
            justify-center mx-auto mb-4 shadow-lg shadow-yellow-400/30
            animate-[scale-in_0.4s_ease-out]"
          >
            <CheckCircle2 size={36} className="text-black" />
          </div>

          <h2 className="text-2xl font-black mb-1">
            Congratulations, {firstName}! 🎉
          </h2>
          <p className="text-white/70 text-sm leading-relaxed">
            Your <span className="text-yellow-400 font-bold">{planName}</span>{" "}
            plan is now active. Welcome to the SmileBaba vendor family!
          </p>

          {/* Plan features pills */}
          <div className="flex flex-wrap justify-center gap-1.5 mt-4">
            {features.slice(0, 3).map((f) => (
              <span
                key={f}
                className="bg-white/10 text-white/90 text-[10px]
                font-semibold px-2.5 py-1 rounded-full border border-white/10"
              >
                ✓ {f}
              </span>
            ))}
            {features.length > 3 && (
              <span
                className="bg-yellow-400/20 text-yellow-300 text-[10px]
                font-semibold px-2.5 py-1 rounded-full border border-yellow-400/20"
              >
                +{features.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* ── Tab switcher ── */}
        <div className="flex gap-1 mx-5 mt-4 bg-gray-100 rounded-xl p-1 flex-shrink-0">
          <button
            onClick={() => setTab("actions")}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition
              ${tab === "actions" ? "bg-white shadow text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
          >
            Quick actions
          </button>
          <button
            onClick={() => setTab("boost")}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition
              ${tab === "boost" ? "bg-white shadow text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
          >
            Boost an ad
            {nonBoosted.length > 0 && (
              <span
                className="ml-1.5 bg-yellow-400 text-black text-[9px]
                font-black px-1.5 py-0.5 rounded-full"
              >
                {nonBoosted.length}
              </span>
            )}
          </button>
        </div>

        {/* ── Content ── */}
        <div className="overflow-y-auto flex-1 px-5 pb-5 pt-3">
          {tab === "actions" && (
            <div className="space-y-2.5">
              {[
                {
                  href: "/sell",
                  icon: <Plus size={18} className="text-black" />,
                  iconBg: "bg-yellow-400",
                  title: "Post a new ad",
                  sub: "List a product, food, property, or service",
                  dark: true,
                },
                {
                  href: "/vendor/dashboard",
                  icon: (
                    <LayoutDashboard size={16} className="text-purple-600" />
                  ),
                  iconBg: "bg-purple-100",
                  title: "Go to dashboard",
                  sub: "Analytics, orders, and messages",
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
                  href: "/vendor/settings",
                  icon: <Star size={16} className="text-orange-500" />,
                  iconBg: "bg-orange-100",
                  title: "Complete your store",
                  sub: "Add logo, banner, and social links",
                  dark: false,
                },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 p-3.5 rounded-2xl
                    active:scale-[0.99] transition-all group
                    ${
                      item.dark
                        ? "bg-gray-900 text-white hover:bg-gray-800"
                        : "bg-white border border-gray-100 hover:border-yellow-200 hover:bg-yellow-50"
                    }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center
                    justify-center flex-shrink-0 ${item.iconBg}`}
                  >
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-black
                      ${item.dark ? "text-white" : "text-gray-900"}`}
                    >
                      {item.title}
                    </p>
                    <p
                      className={`text-xs mt-0.5
                      ${item.dark ? "text-white/60" : "text-gray-400"}`}
                    >
                      {item.sub}
                    </p>
                  </div>
                  <ArrowRight
                    size={14}
                    className={`flex-shrink-0 transition
                      ${item.dark ? "text-white/40 group-hover:text-white/80" : "text-gray-300 group-hover:text-gray-600"}`}
                  />
                </Link>
              ))}
            </div>
          )}

          {tab === "boost" && (
            <div>
              {ads.length === 0 ? (
                <div className="text-center py-8">
                  <Package size={28} className="text-gray-200 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-gray-600 mb-1">
                    No ads yet
                  </p>
                  <p className="text-xs text-gray-400 mb-4">
                    Post your first listing, then come back to boost it.
                  </p>
                  <Link
                    href="/sell"
                    onClick={onClose}
                    className="inline-block px-5 py-2.5 bg-yellow-400 text-black
                      text-xs font-black rounded-xl hover:bg-yellow-300 transition"
                  >
                    Post an ad →
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {ads.map((ad) => (
                    <div
                      key={ad._id}
                      className="flex items-center gap-3 bg-white border
                        border-gray-100 rounded-2xl p-3 hover:border-yellow-300 transition"
                    >
                      <div
                        className="w-10 h-10 rounded-xl bg-gray-100
                        flex-shrink-0 overflow-hidden"
                      >
                        {ad.images?.[0]?.url ? (
                          <img
                            src={ad.images[0].url}
                            alt={ad.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package size={14} className="text-gray-300" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-gray-900 truncate">
                          {ad.title}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          {ad.views ?? 0} views
                        </p>
                      </div>
                      {ad.boost?.isBoosted ? (
                        <span
                          className="flex items-center gap-1 px-2 py-1
                          bg-yellow-100 text-yellow-700 text-[10px] font-bold
                          rounded-full flex-shrink-0"
                        >
                          <Zap size={9} /> Boosted
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            router.push(`/ads/${ad._id}?boost=1`);
                            onClose();
                          }}
                          className="flex items-center gap-1 px-3 py-1.5
                            bg-gray-900 text-yellow-400 text-[11px] font-black
                            rounded-xl hover:bg-gray-700 active:scale-95
                            transition-all flex-shrink-0"
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

        {/* ── Footer ── */}
        <div className="px-5 pb-5 pt-2 border-t border-gray-100 flex-shrink-0">
          <p className="text-[11px] text-center text-gray-400">
            A confirmation email is on its way to your inbox ·{" "}
            <Link
              href="/vendor/purchase-history"
              onClick={onClose}
              className="text-yellow-600 font-semibold hover:underline"
            >
              View receipt
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────
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

  // Pull plan from URL (set by verifyPayment) or user session
  const planFromUrl = params.get("plan") ?? null;
  const planFromUser = user?.subscription?.plan ?? null;
  const plan = planFromUrl ?? planFromUser;

  const [showConfetti, setShowConfetti] = useState(isLegitimate);
  const [showModal, setShowModal] = useState(false);
  const [resuming, setResuming] = useState(false);
  const [resumeLabel, setResumeLabel] = useState<string | null>(null);
  const [redirectTo, setRedirectTo] = useState<string | null>(null);
  const modalShownRef = useRef(false);

  useEffect(() => {
    if (!isLegitimate) router.replace("/");
  }, [isLegitimate, router]);

  // Track whether the user-session refresh has finished. Critical: any redirect
  // or resume-action must wait for this, otherwise the user lands on a vendor-only
  // route (like /sell) with stale Redux state showing role: "guest" and the guard
  // immediately bounces them back to /subscription.
  const [sessionRefreshed, setSessionRefreshed] = useState(false);

  useEffect(() => {
    if (!isLegitimate) return;
    let cancelled = false;
    (async () => {
      try {
        // Await the refresh so the new role lands in Redux BEFORE we redirect.
        await dispatch(restoreSession()).unwrap();
      } catch {
        /* even on failure we proceed — backend role is set, worst case user
           refreshes manually */
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
      setResumeLabel(labels[action.type] ?? "Resuming your action…");
      // Wait until /auth/me returns with the new vendor role BEFORE redirecting.
      // Otherwise SellPage sees role: "guest" and bounces back to /subscription.
      const target =
        action.type === "boost_product" ? "/vendor/dashboard" : "/sell";
      const tryRedirect = () => {
        if (sessionRefreshed) {
          setTimeout(() => setRedirectTo(target), 1200);
        } else {
          setTimeout(tryRedirect, 200); // poll every 200ms until session refreshed
        }
      };
      tryRedirect();
    },
  });

  if (!isLegitimate) return null;

  const firstName = user?.username?.split(" ")[0] ?? "there";

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800
      to-gray-900 flex items-center justify-center px-4 py-12 relative"
    >
      {showConfetti && <Confetti />}

      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96
          bg-yellow-400/10 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 w-full max-w-md text-center">
        {/* ── Boost success ── */}
        {isBoostedCallback && !isFlwDirect && (
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <div
              className="w-20 h-20 bg-yellow-400 rounded-full flex items-center
              justify-center mx-auto mb-5 shadow-lg shadow-yellow-400/30"
            >
              <Zap size={36} className="text-black" />
            </div>
            <h1 className="text-2xl font-black text-gray-900 mb-2">
              Your ad is boosted! ⚡
            </h1>
            <p className="text-gray-500 text-sm mb-8">
              Your listing now appears at the top of search results and will
              reach more buyers across Ghana and Nigeria.
            </p>
            <div className="flex flex-col gap-3">
              <Link
                href="/vendor/dashboard"
                className="w-full py-3 bg-gray-900 text-white font-black
                  rounded-2xl hover:bg-gray-800 transition text-sm
                  flex items-center justify-center gap-2"
              >
                <LayoutDashboard size={15} /> Go to dashboard
              </Link>
              <Link
                href="/ads"
                className="w-full py-3 bg-yellow-400 text-black font-black
                  rounded-2xl hover:bg-yellow-300 transition text-sm"
              >
                Browse marketplace
              </Link>
            </div>
          </div>
        )}

        {/* ── Subscription success (before modal opens) ── */}
        {isEffectiveSub && !showModal && (
          <div className="text-center">
            <div
              className="w-24 h-24 bg-yellow-400 rounded-full flex items-center
              justify-center mx-auto mb-6 shadow-2xl shadow-yellow-400/30"
            >
              <CheckCircle2 size={44} className="text-black" />
            </div>

            <div className="flex items-center justify-center gap-2 mb-3">
              <Sparkles size={16} className="text-yellow-400" />
              <span
                className="text-yellow-400 text-sm font-bold uppercase
                tracking-widest"
              >
                Payment successful
              </span>
              <Sparkles size={16} className="text-yellow-400" />
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">
              Welcome to SmileBaba,
              <br />
              {firstName}!
            </h1>
            <p className="text-white/60 text-sm mb-8">
              Your subscription is active — setting up your dashboard…
            </p>

            {resuming && resumeLabel && (
              <div
                className="bg-white/10 border border-white/20 rounded-2xl
                p-4 mb-5 flex items-center justify-center gap-3 text-white"
              >
                <div
                  className="w-4 h-4 border-2 border-yellow-400/50
                  border-t-yellow-400 rounded-full animate-spin"
                />
                <p className="text-sm font-medium">{resumeLabel}</p>
              </div>
            )}

            {/* Skeleton loading state while restoring session */}
            <div className="flex items-center justify-center gap-1.5">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-yellow-400 rounded-full"
                  style={{
                    animation: `bounce 0.9s ease-in-out ${i * 0.15}s infinite alternate`,
                  }}
                />
              ))}
            </div>
            <style>{`
              @keyframes bounce {
                from { transform: translateY(0);    opacity: 0.4; }
                to   { transform: translateY(-6px); opacity: 1;   }
              }
            `}</style>
          </div>
        )}
      </div>

      {/* ── Congratulations modal ── */}
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
