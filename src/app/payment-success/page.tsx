"use client";

// src/app/payment-success/page.tsx

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  Package,
  Zap,
  BarChart2,
  Megaphone,
  Globe,
  XCircle,
} from "lucide-react";
import { useResumeAction } from "@/src/hooks/useResumeAction";
import { useAppSelector } from "@/src/app/redux";
import { restoreSession } from "@/src/lib/features/auth/authActions";
import { useAppDispatch } from "@/src/app/redux";

// ── Confetti burst — pure CSS ─────────────────────────────────────────────
function Confetti() {
  const pieces = Array.from({ length: 20 });
  const colors = [
    "#ffc105",
    "#22c55e",
    "#3b82f6",
    "#f97316",
    "#a855f7",
    "#ec4899",
  ];
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
      {pieces.map((_, i) => (
        <span
          key={i}
          className="absolute w-2 h-2 rounded-sm opacity-0"
          style={{
            left: `${5 + i * 4.8}%`,
            top: "-10px",
            background: colors[i % colors.length],
            animation: `confettiFall ${1.2 + (i % 4) * 0.3}s ease-in ${i * 0.08}s forwards`,
            transform: `rotate(${i * 17}deg)`,
          }}
        />
      ))}
      <style>{`
        @keyframes confettiFall {
          0%   { transform: translateY(0)    rotate(0deg);   opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

export default function PaymentSuccessPage() {
  const router = useRouter();
  const params = useSearchParams();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  // ── Guard: only show success if Flutterwave actually redirected here ──────
  // Flutterwave appends ?subscribed=1 (or ?boosted=1) after verify succeeds.
  // If neither is present the user navigated here manually — redirect away.
  const isSubscribedCallback = params.get("subscribed") === "1";
  const isBoostedCallback = params.get("boosted") === "1";
  const isLegitimate = isSubscribedCallback || isBoostedCallback;

  const [showConfetti, setShowConfetti] = useState(isLegitimate);
  const [resuming, setResuming] = useState(false);
  const [resumeLabel, setResumeLabel] = useState<string | null>(null);
  const [redirectTo, setRedirectTo] = useState<string | null>(null);

  // Redirect to home if not a legitimate callback
  useEffect(() => {
    if (!isLegitimate) {
      router.replace("/");
    }
  }, [isLegitimate, router]);

  // Re-fetch the user session so role/subscription are fresh in Redux
  useEffect(() => {
    if (isLegitimate) {
      dispatch(restoreSession());
    }
  }, [isLegitimate, dispatch]);

  // Stop confetti after 3.5s
  useEffect(() => {
    if (!isLegitimate) return;
    const t = setTimeout(() => setShowConfetti(false), 3500);
    return () => clearTimeout(t);
  }, [isLegitimate]);

  // Redirect state → useEffect to satisfy React immutability rules
  useEffect(() => {
    if (redirectTo) router.push(redirectTo);
  }, [redirectTo, router]);

  // Resume pending action after subscription (e.g. they were posting an ad)
  useResumeAction({
    onResume: (action) => {
      setResuming(true);
      const labels: Record<string, string> = {
        post_product: "Taking you back to post your listing…",
        boost_product: "Applying your boost…",
        create_listing: "Resuming your listing…",
      };
      setResumeLabel(labels[action.type] ?? "Resuming your action…");
      setTimeout(() => {
        if (
          action.type === "post_product" ||
          action.type === "create_listing"
        ) {
          setRedirectTo("/sell");
        } else if (action.type === "boost_product") {
          setRedirectTo("/vendor/dashboard");
        } else {
          setRedirectTo("/vendor/dashboard");
        }
      }, 2000);
    },
  });

  // Don't render anything if the visit is not legitimate
  if (!isLegitimate) return null;

  const firstName = user?.username?.split(" ")[0] ?? "there";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      {showConfetti && <Confetti />}

      <div className="relative z-20 w-full max-w-md text-center">
        {/* Success icon */}
        <div
          className="w-24 h-24 bg-green-100 rounded-full flex items-center
          justify-center mx-auto mb-6 shadow-lg shadow-green-100"
        >
          <CheckCircle2 size={44} className="text-green-600" />
        </div>

        {isBoostedCallback ? (
          <>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">
              Your ad is now boosted!
            </h1>
            <p className="text-gray-500 text-sm sm:text-base mb-8 leading-relaxed">
              Your listing is now getting priority placement and will reach more
              buyers.
            </p>
            <div className="flex flex-col gap-3">
              <Link
                href="/vendor/dashboard"
                className="w-full py-3 bg-[#ffc105] text-black font-black rounded-2xl
                  hover:bg-amber-400 transition text-sm"
              >
                Go to your dashboard →
              </Link>
              <Link
                href="/ads"
                className="w-full py-3 bg-white border border-gray-200 text-gray-700
                  font-semibold rounded-2xl hover:bg-gray-50 transition text-sm"
              >
                Browse marketplace
              </Link>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">
              You&apos;re all set, {firstName}!
            </h1>
            <p className="text-gray-500 text-sm sm:text-base mb-8 leading-relaxed">
              Your subscription is now active. You can post listings, boost
              products, and access all vendor features.
            </p>

            {/* What's unlocked */}
            <div
              className="bg-white border border-gray-100 shadow-sm rounded-2xl p-5
              mb-6 text-left"
            >
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                What you&apos;ve unlocked
              </p>
              <div className="space-y-3">
                {[
                  {
                    icon: <Package size={14} className="text-blue-600" />,
                    label: "Post unlimited listings",
                  },
                  {
                    icon: <Zap size={14} className="text-yellow-600" />,
                    label: "Boost products to top results",
                  },
                  {
                    icon: <BarChart2 size={14} className="text-purple-600" />,
                    label: "Full dashboard & analytics",
                  },
                  {
                    icon: <Megaphone size={14} className="text-pink-600" />,
                    label: "Submit promotional videos",
                  },
                  {
                    icon: <Globe size={14} className="text-green-600" />,
                    label: "Reach buyers in Ghana & Nigeria",
                  },
                ].map((f) => (
                  <div key={f.label} className="flex items-center gap-3">
                    <span
                      className="w-6 h-6 bg-gray-50 rounded-lg flex items-center
                      justify-center flex-shrink-0"
                    >
                      {f.icon}
                    </span>
                    <span className="text-sm text-gray-700 font-medium">
                      {f.label}
                    </span>
                    <CheckCircle2
                      size={14}
                      className="ml-auto text-green-500 flex-shrink-0"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Resume action banner */}
            {resuming && resumeLabel && (
              <div
                className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-5
                flex items-center gap-3"
              >
                <div
                  className="w-5 h-5 border-2 border-amber-400 border-t-transparent
                  rounded-full animate-spin flex-shrink-0"
                />
                <p className="text-sm text-amber-700 font-medium">
                  {resumeLabel}
                </p>
              </div>
            )}

            {/* CTAs */}
            {!resuming && (
              <div className="flex flex-col gap-3">
                <Link
                  href="/sell"
                  className="w-full py-3 bg-[#ffc105] text-black font-black rounded-2xl
                    hover:bg-amber-400 transition text-sm"
                >
                  Post your first listing →
                </Link>
                <Link
                  href="/vendor/dashboard"
                  className="w-full py-3 bg-white border border-gray-200 text-gray-700
                    font-semibold rounded-2xl hover:bg-gray-50 transition text-sm"
                >
                  Go to vendor dashboard
                </Link>
                <Link
                  href="/vendor/history"
                  className="text-xs text-gray-400 hover:text-gray-600 transition mt-1"
                >
                  View purchase receipt
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
