"use client";

// src/components/WelcomeDirective.tsx
//
// One-time welcome modal that appears after a user first signs up.
// Explains the vendor-subscription requirement BEFORE they hit the friction
// point — so when they later go to subscribe they understand the flow:
//   sign up (free) → subscribe → become a vendor → post ads
//
// Triggers when:
//   - User is authenticated
//   - localStorage flag "welcomed:<userId>" hasn't been set yet
//   - User has role: "guest" (not yet a vendor)
//
// Setting the flag is per-user so a fresh signup from a different account
// on the same device still gets the welcome.
//
// Mount this in your root layout (above {children}), once globally.
// It self-hides on dismiss and never shows again for that user.

import { useEffect, useState } from "react";
import Link from "next/link";
import { X, ShoppingBag, Eye, Sparkles, ArrowRight, Star } from "lucide-react";
import { useAppSelector } from "@/src/app/redux";

export default function WelcomeDirective() {
  const user = useAppSelector((s) => s.auth?.user);
  const isAuthed = useAppSelector((s) => s.auth?.isAuthenticated);
  const hasChecked = useAppSelector((s) => s.auth?.hasCheckedAuth);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!hasChecked || !isAuthed || !user?._id) return;

    // Only show for non-vendor users (guests who just signed up).
    if (user.role && user.role !== "guest") return;

    const key = `welcomed:${user._id}`;
    if (localStorage.getItem(key) === "1") return;

    // Slight delay so it doesn't compete with the login toast
    const t = setTimeout(() => setOpen(true), 1200);
    return () => clearTimeout(t);
  }, [hasChecked, isAuthed, user]);

  const dismiss = () => {
    if (user?._id) localStorage.setItem(`welcomed:${user._id}`, "1");
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 z-[80] flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && dismiss()}
    >
      <div
        className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl
        animate-floatin"
      >
        {/* Yellow celebration banner */}
        <div className="bg-gradient-to-br from-yellow-400 to-amber-500 px-6 pt-6 pb-12 relative">
          <button
            onClick={dismiss}
            aria-label="Close"
            className="absolute top-3 right-3 w-8 h-8 bg-black/10 hover:bg-black/20
              rounded-full flex items-center justify-center transition"
          >
            <X size={14} className="text-black" />
          </button>

          <div className="text-5xl mb-2">🎉</div>
          <h2 className="text-2xl font-black text-black mb-1">
            Welcome to SmileBaba, {user?.username?.split(" ")[0] ?? "friend"}!
          </h2>
          <p className="text-sm text-black/70">
            Your account is ready. Here's what you can do next.
          </p>
        </div>

        {/* Two paths */}
        <div className="px-6 py-5 -mt-6 relative">
          <div className="bg-white border border-gray-100 rounded-2xl shadow-md p-5 mb-3">
            <p className="text-[10px] font-black text-yellow-600 tracking-wider mb-1">
              🛍️ FREE — START EXPLORING
            </p>
            <h3 className="font-black text-gray-900 mb-1">Shop and order</h3>
            <p className="text-xs text-gray-600 leading-relaxed mb-3">
              Browse products, order food, find apartments, message vendors —
              all free, no subscription required.
            </p>
            <Link
              href="/ads"
              onClick={dismiss}
              className="inline-flex items-center gap-1.5 text-xs font-bold
                text-gray-900 hover:text-yellow-600 transition"
            >
              Start exploring <ArrowRight size={12} />
            </Link>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-5 text-white">
            <p className="text-[10px] font-black text-yellow-400 tracking-wider mb-1">
              ⭐ TO POST AND SELL
            </p>
            <h3 className="font-black mb-1">Become a vendor</h3>
            <p className="text-xs text-white/80 leading-relaxed mb-3">
              To post ads or list products, you'll need a vendor subscription.
              Plans start from{" "}
              <span className="text-yellow-400 font-black">₵99.99/month</span>.
              Pick a plan when you're ready to sell.
            </p>
            <Link
              href="/subscription"
              onClick={dismiss}
              className="inline-flex items-center gap-1.5 bg-yellow-400 hover:bg-yellow-300
                text-black font-black px-4 py-2 rounded-xl text-xs transition"
            >
              <Sparkles size={11} /> View plans
            </Link>
          </div>
        </div>

        {/* Bottom note */}
        <div className="border-t border-gray-100 px-6 py-3 flex items-center justify-between">
          <p className="text-[10px] text-gray-400">
            You can always upgrade later from your account.
          </p>
          <button
            onClick={dismiss}
            className="text-xs font-bold text-gray-600 hover:text-gray-900"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
