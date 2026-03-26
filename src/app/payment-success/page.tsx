"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useResumeAction } from "@/src/hooks/useResumeAction";
import { useAppSelector } from "../redux";

// Confetti burst — pure CSS, no library needed
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
  const user = useAppSelector((state) => state.auth.user);

  const [showConfetti, setShowConfetti] = useState(true);
  const [resuming, setResuming] = useState(false);
  const [resumeLabel, setResumeLabel] = useState<string | null>(null);

  // Stop confetti after 3.5s
  useEffect(() => {
    const t = setTimeout(() => setShowConfetti(false), 3500);
    return () => clearTimeout(t);
  }, []);

  // Resume pending action (e.g. boost a product, post a listing)
  useResumeAction({
    onResume: (action) => {
      setResuming(true);
      const labels: Record<string, string> = {
        post_product: "Taking you back to post your product…",
        boost_product: "Boosting your product…",
        create_listing: "Resuming your listing…",
      };
      setResumeLabel(labels[action.type] ?? "Resuming your action…");

      // Give the user a moment to see the success screen before redirect
      setTimeout(() => {
        if (
          action.type === "post_product" ||
          action.type === "create_listing"
        ) {
          router.push("/sell");
        } else if (action.type === "boost_product") {
          router.push("/vendor/boost");
        } else {
          router.push("/vendor");
        }
      }, 2000);
    },
  });

  const firstName = user?.username?.split(" ")[0] ?? "there";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      {showConfetti && <Confetti />}

      <div className="relative z-20 w-full max-w-md text-center">
        {/* Success icon */}
        <div
          className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center
          text-5xl mx-auto mb-6 shadow-lg shadow-green-100 animate-bounce-once"
        >
          🎉
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">
          You`re all set, {firstName}!
        </h1>
        <p className="text-gray-500 text-sm sm:text-base mb-8 leading-relaxed">
          Your subscription is now active. You can post listings, boost
          products, and access all vendor features.
        </p>

        {/* What's unlocked */}
        <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-5 mb-6 text-left">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
            What you`ve unlocked
          </p>
          <div className="space-y-3">
            {[
              { icon: "📦", label: "Post unlimited listings" },
              { icon: "🚀", label: "Boost products to top results" },
              { icon: "📊", label: "Full dashboard & analytics" },
              { icon: "📣", label: "Submit promotional videos" },
              { icon: "🌍", label: "Reach buyers in Ghana & Nigeria" },
            ].map((f) => (
              <div key={f.label} className="flex items-center gap-3">
                <span className="text-lg flex-shrink-0">{f.icon}</span>
                <span className="text-sm text-gray-700 font-medium">
                  {f.label}
                </span>
                <span className="ml-auto text-green-500 text-sm font-bold">
                  ✓
                </span>
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
            <p className="text-sm text-amber-700 font-medium">{resumeLabel}</p>
          </div>
        )}

        {/* CTAs */}
        {!resuming && (
          <div className="flex flex-col gap-3">
            <Link
              href="/vendor"
              className="w-full py-3 bg-[#ffc105] text-black font-black rounded-2xl
                hover:bg-amber-400 transition active:scale-[0.99] text-sm"
            >
              Go to vendor dashboard →
            </Link>
            <Link
              href="/sell"
              className="w-full py-3 bg-white border border-gray-200 text-gray-700
                font-semibold rounded-2xl hover:bg-gray-50 transition text-sm"
            >
              Post your first listing
            </Link>
            <Link
              href="/vendor/history"
              className="text-xs text-gray-400 hover:text-gray-600 transition mt-1"
            >
              View purchase receipt
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
