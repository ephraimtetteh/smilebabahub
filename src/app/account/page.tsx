"use client";

// src/app/account/page.tsx — main account dashboard
//
// Lands here after login (default user route). Shows:
//   - User profile summary
//   - Quick links to vendor dashboard / orders / promotions / settings
//   - Subscription status if any
//   - Logout

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User as UserIcon,
  ShoppingBag,
  MessageSquare,
  Heart,
  Bell,
  Settings,
  LogOut,
  ChevronRight,
  Sparkles,
  Store,
  BarChart3,
  Megaphone,
  CreditCard,
  ShieldCheck,
  HelpCircle,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/src/app/redux";
import { logout } from "@/src/lib/features/auth/authActions";
import { toast } from "react-toastify";

export default function AccountPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth?.user);
  const isAuthed = useAppSelector((s) => s.auth?.isAuthenticated);
  const hasChecked = useAppSelector((s) => s.auth?.hasCheckedAuth);

  // Redirect to login if not authenticated (after auth check completes)
  useEffect(() => {
    if (hasChecked && !isAuthed) {
      router.replace("/auth/login?redirect=/account");
    }
  }, [hasChecked, isAuthed, router]);

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      toast.success("Logged out");
      router.replace("/");
    } catch {
      toast.error("Logout failed");
    }
  };

  if (!hasChecked || !user) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-sm text-gray-400">Loading…</div>
      </main>
    );
  }

  // Cast role to plain string so we work regardless of how UserRole is typed in your store.
  const role = String(user.role ?? "guest");
  const isAdmin = role === "admin";
  // Derive subscription state from the subscription object (no isSubscribed field exists).
  const isSubscribed = !!(
    user.subscription?.expiresAt &&
    new Date(user.subscription.expiresAt) > new Date()
  );
  const isVendor = role === "vendor" || role === "marketer" || isSubscribed;
  const isMarketer = role === "marketer";

  return (
    <main className="min-h-screen bg-gray-50 pb-20 lg:pb-8">
      {/* Profile header */}
      <section className="bg-gradient-to-br from-yellow-400 to-amber-500 text-black">
        <div className="max-w-3xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
          <div className="flex items-center gap-4">
            {user.profilePicture ? (
              <img
                src={user.profilePicture}
                alt={user.username}
                className="w-16 h-16 rounded-full border-4 border-white object-cover"
              />
            ) : (
              <div
                className="w-16 h-16 rounded-full bg-white border-4 border-white
                flex items-center justify-center"
              >
                <UserIcon size={24} className="text-yellow-600" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold opacity-70">Welcome back,</p>
              <h1 className="text-xl sm:text-2xl font-black truncate">
                {user.username}
              </h1>
              <p className="text-xs opacity-80 truncate">{user.email}</p>
            </div>
            <Link
              href="/account/settings"
              className="w-9 h-9 bg-black/10 hover:bg-black/20 rounded-xl
                flex items-center justify-center transition"
            >
              <Settings size={16} />
            </Link>
          </div>

          {/* Role badges */}
          <div className="flex gap-2 mt-3 flex-wrap">
            {isAdmin && (
              <span
                className="bg-black text-yellow-400 text-[10px] font-black
                px-2 py-0.5 rounded"
              >
                ADMIN
              </span>
            )}
            {isVendor && (
              <span
                className="bg-black/10 text-black text-[10px] font-black
                px-2 py-0.5 rounded"
              >
                VENDOR
              </span>
            )}
            {isMarketer && (
              <span
                className="bg-black/10 text-black text-[10px] font-black
                px-2 py-0.5 rounded"
              >
                MARKETER
              </span>
            )}
            {isSubscribed && (
              <span
                className="bg-green-700 text-white text-[10px] font-black
                px-2 py-0.5 rounded flex items-center gap-1"
              >
                <Sparkles size={9} /> SUBSCRIBED
              </span>
            )}
          </div>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-3 sm:px-4 py-5 space-y-4">
        {/* Subscription card */}
        {!isSubscribed && (
          <Link
            href="/subscription"
            className="block bg-gradient-to-br from-purple-700 to-indigo-800
              text-white rounded-2xl p-5 hover:shadow-xl transition"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-purple-200 mb-1 tracking-wider">
                  UPGRADE
                </p>
                <p className="text-sm font-black mb-1">Unlock more listings</p>
                <p className="text-xs text-purple-200">
                  Get featured placement and unlimited ads
                </p>
              </div>
              <ChevronRight size={18} />
            </div>
          </Link>
        )}

        {/* Quick actions grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <ActionTile href="/orders" emoji="📦" label="My Orders" />
          <ActionTile href="/chat" emoji="💬" label="Messages" />
          <ActionTile href="/sell" emoji="➕" label="Post Ad" />
          <ActionTile href="/wishlist" emoji="❤️" label="Wishlist" />
        </div>

        {/* Account menu */}
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
          <MenuLink
            href="/account/profile"
            icon={<UserIcon size={16} />}
            label="Profile"
            sub="Personal info, photo, bio"
          />
          <MenuLink
            href="/account/orders"
            icon={<ShoppingBag size={16} />}
            label="Orders"
            sub="Track and manage purchases"
          />
          <MenuLink
            href="/account/notifications"
            icon={<Bell size={16} />}
            label="Notifications"
            sub="Email and push preferences"
          />
          <MenuLink
            href="/account/security"
            icon={<ShieldCheck size={16} />}
            label="Security"
            sub="Password, 2FA, sessions"
          />
          <MenuLink
            href="/account/payment-methods"
            icon={<CreditCard size={16} />}
            label="Payment methods"
            sub="MoMo, bank, cards"
          />
        </div>

        {/* Business section */}
        {(isVendor || isAdmin) && (
          <>
            <h2 className="text-[11px] font-black text-gray-400 tracking-wider px-1 pt-2">
              BUSINESS
            </h2>
            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
              {isVendor && (
                <MenuLink
                  href="/vendor/dashboard"
                  icon={<Store size={16} />}
                  label="Vendor dashboard"
                  sub="Manage your store and listings"
                />
              )}
              <MenuLink
                href="/promote"
                icon={<Megaphone size={16} />}
                label="Promote your brand"
                sub="Video campaigns on TV, Radio, Social"
              />
              {isMarketer && (
                <MenuLink
                  href="/marketer/dashboard"
                  icon={<BarChart3 size={16} />}
                  label="Marketer dashboard"
                  sub="Track referrals and earnings"
                />
              )}
              {isAdmin && (
                <MenuLink
                  href="/admin"
                  icon={<ShieldCheck size={16} />}
                  label="Admin panel"
                  sub="Manage users, content, payments"
                />
              )}
            </div>
          </>
        )}

        {/* Support */}
        <h2 className="text-[11px] font-black text-gray-400 tracking-wider px-1 pt-2">
          SUPPORT
        </h2>
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
          <MenuLink
            href="/help"
            icon={<HelpCircle size={16} />}
            label="Help Center"
            sub="FAQ, contact, support"
          />
          <MenuLink
            href="/about"
            icon={<UserIcon size={16} />}
            label="About SmileBabaHub"
            sub="Our story and mission"
          />
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full bg-white border border-red-100 hover:bg-red-50
            text-red-600 font-bold py-3.5 rounded-2xl text-sm transition
            flex items-center justify-center gap-2"
        >
          <LogOut size={15} /> Log out
        </button>

        <p className="text-[10px] text-gray-400 text-center pt-2">
          SmileBabaHub · Member since{" "}
          {new Date(
            user._id
              ? parseInt(user._id.substring(0, 8), 16) * 1000
              : Date.now(),
          ).toLocaleDateString("en-GH", { year: "numeric", month: "long" })}
        </p>
      </div>
    </main>
  );
}

// ─── Quick action tile ──────────────────────────────────────────────────────
function ActionTile({
  href,
  emoji,
  label,
}: {
  href: string;
  emoji: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="bg-white border border-gray-100 rounded-2xl p-4 text-center
        hover:shadow-md hover:-translate-y-0.5 transition active:scale-95"
    >
      <div className="text-3xl mb-1">{emoji}</div>
      <p className="text-xs font-bold text-gray-900">{label}</p>
    </Link>
  );
}

// ─── Menu link row ──────────────────────────────────────────────────────────
function MenuLink({
  href,
  icon,
  label,
  sub,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  sub: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 p-4 hover:bg-gray-50 transition
        border-b border-gray-50 last:border-b-0"
    >
      <div
        className="w-9 h-9 rounded-xl bg-yellow-50 text-yellow-600
        flex items-center justify-center flex-shrink-0"
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-gray-900">{label}</p>
        <p className="text-[11px] text-gray-500 truncate">{sub}</p>
      </div>
      <ChevronRight size={14} className="text-gray-300 flex-shrink-0" />
    </Link>
  );
}
