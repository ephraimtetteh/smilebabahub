"use client";

// client/src/app/account/page.tsx
//
// The account hub. Everyone lands here — buyers, sellers, admins — so it
// has to make sense before anyone has done anything.
//
// ─── WHAT WAS BROKEN ─────────────────────────────────────────────────
//
// The file opened with `use client";` — no leading quote. That's a
// syntax error, which means this page has not been compiling.
//
// Beyond that:
//
//   · Two menu rows both said "Orders"; the second was Bookings
//   · A quick tile pointed at /orders, the menu at /account/orders
//   · isVendor included role "marketer", which isn't in the User enum
//     and so can never be true
//   · UpgradeCTA linked to /subscribe; the page is /subscription
//   · isVendor was derived from an active subscription, which is now
//     wrong — onboarding makes someone a vendor for free
//
// ─── THE SHAPE ───────────────────────────────────────────────────────
//
// Buying comes first because everyone does it. Selling appears only once
// someone sells. An invitation to start selling sits where the selling
// section would be, so the page grows with the person rather than
// showing them eight things they don't use.

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User as UserIcon,
  ShoppingBag,
  Settings,
  LogOut,
  ChevronRight,
  Sparkles,
  Store,
  BarChart3,
  Megaphone,
  ShieldCheck,
  HelpCircle,
  CalendarCheck,
  MessageSquare,
  Heart,
  Plus,
  Send,
  Loader2,
} from "lucide-react";
import { toast } from "react-toastify";

import { useAppDispatch, useAppSelector } from "@/src/app/redux";
import { logout } from "@/src/lib/features/auth/authActions";

export default function AccountPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const user = useAppSelector((s) => s.auth?.user);
  const isAuthed = useAppSelector((s) => s.auth?.isAuthenticated);
  const hasChecked = useAppSelector((s) => s.auth?.hasCheckedAuth);

  useEffect(() => {
    if (hasChecked && !isAuthed) {
      router.replace("/auth/login?returnUrl=/account");
    }
  }, [hasChecked, isAuthed, router]);

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      toast.success("Signed out");
      router.replace("/");
    } catch {
      toast.error("Couldn't sign out. Please try again.");
    }
  };

  if (!hasChecked || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <Loader2 size={26} className="animate-spin text-amber-400" />
      </main>
    );
  }

  const role = String(user.role ?? "guest");
  const isAdmin = role === "admin" || (user as any).isAdmin === true;

  /**
   * A vendor is someone with a store. It used to mean someone with an
   * active subscription, which is no longer true — onboarding makes
   * someone a vendor for free and SmileBaba earns the 5% instead.
   */
  const isVendor = !!user.storeName || role === "vendor";

  const isSubscribed = !!(
    user.subscription?.expiresAt &&
    new Date(user.subscription.expiresAt) > new Date() &&
    user.subscription?.plan !== "Basic"
  );

  return (
    <main className="min-h-screen bg-gray-50 pb-20 pt-16 lg:pb-8">
      {/* ─── Profile ─── */}
      <section className="bg-gradient-to-br from-amber-400 to-amber-500 text-gray-900">
        <div className="mx-auto max-w-3xl px-4 py-7">
          <div className="flex items-center gap-4">
            {user.profilePicture ? (
              <img
                src={user.profilePicture}
                alt={user.username}
                className="h-16 w-16 rounded-full border-4 border-white object-cover"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-white">
                <UserIcon size={24} className="text-amber-600" />
              </div>
            )}

            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold opacity-70">Welcome back,</p>
              <h1 className="truncate text-2xl font-bold tracking-tight">
                {user.username}
              </h1>
              <p className="truncate text-xs opacity-80">{user.email}</p>
            </div>

            <Link
              href="/account/settings"
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-black/10 transition hover:bg-black/20"
              aria-label="Settings"
            >
              <Settings size={16} />
            </Link>
          </div>

          {(isAdmin || isVendor || isSubscribed) && (
            <div className="mt-3 flex flex-wrap gap-2">
              {isAdmin && <Badge dark>ADMIN</Badge>}
              {isVendor && <Badge>VENDOR</Badge>}
              {isSubscribed && (
                <span className="flex items-center gap-1 rounded bg-emerald-700 px-2 py-0.5 text-[10px] font-bold text-white">
                  <Sparkles size={9} />
                  {String(user.subscription?.plan ?? "").toUpperCase()}
                </span>
              )}
            </div>
          )}

          {/* The store, where there is one. A vendor's most-used link
              shouldn't be buried three rows down. */}
          {isVendor && user.storeName && (
            <Link
              href={
                (user as any).storeSlug
                  ? `/vendors/${(user as any).storeSlug}`
                  : "/vendor/dashboard"
              }
              className="mt-3 flex items-center gap-2.5 rounded-xl bg-black/10 px-3.5 py-2.5 transition hover:bg-black/15"
            >
              <Store size={14} />
              <span className="flex-1 truncate text-[13px] font-bold">
                {user.storeName}
              </span>
              <span className="text-[11px] opacity-70">
                {(user as any).storeSlug ? "View store" : "Finish setup"}
              </span>
              <ChevronRight size={14} className="opacity-50" />
            </Link>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-3xl space-y-4 px-4 py-5">
        {/* ─── Quick actions ─── */}
        <div className="grid grid-cols-4 gap-2.5">
          <Tile href="/account/orders" icon={ShoppingBag} label="Orders" />
          <Tile href="/chat" icon={MessageSquare} label="Messages" />
          <Tile href="/money/send" icon={Send} label="Send money" />
          <Tile href="/account/saved" icon={Heart} label="Saved" />
        </div>

        {/* ─── Buying ─── */}
        <Section title="Your activity">
          <Row
            href="/account/orders"
            icon={ShoppingBag}
            label="Orders"
            sub="Track what you've bought"
          />
          <Row
            href="/account/bookings"
            icon={CalendarCheck}
            label="Bookings"
            sub="Your stays and reservations"
          />
          <Row
            href="/account/saved"
            icon={Heart}
            label="Saved items"
            sub="Listings you liked"
          />
          <Row
            href="/money"
            icon={Send}
            label="Money transfers"
            sub="Everything you've sent"
            last
          />
        </Section>

        {/* ─── Selling, or an invitation to ─── */}
        {isVendor ? (
          <Section title="Selling">
            <Row
              href="/vendor/dashboard"
              icon={BarChart3}
              label="Vendor dashboard"
              sub="Sales, earnings and payouts"
            />
            <Row
              href="/ads/my"
              icon={Store}
              label="My listings"
              sub="Edit, pause or boost what's live"
            />
            <Row
              href="/promote"
              icon={Megaphone}
              label="Promote your business"
              sub="TV, radio and social campaigns"
            />
            {!isSubscribed && (
              <Row
                href="/subscription"
                icon={Sparkles}
                label="Upgrade your plan"
                sub="More listings and featured placement"
                last
              />
            )}
          </Section>
        ) : (
          <Link
            href="/onboarding"
            className="flex items-center gap-4 rounded-2xl bg-gray-900 p-5 transition hover:bg-black"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10">
              <Store size={20} className="text-amber-400" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[15px] font-bold text-white">
                Start selling on SmileBaba
              </span>
              <span className="mt-1 block text-[12.5px] leading-relaxed text-white/60">
                Two minutes to set up. No fee to join — we take 5% only when you
                make a sale.
              </span>
            </span>
            <ChevronRight size={18} className="shrink-0 text-white/40" />
          </Link>
        )}

        {/* ─── Admin ─── */}
        {isAdmin && (
          <Section title="Admin">
            <Row
              href="/admin"
              icon={ShieldCheck}
              label="Admin panel"
              sub="Users, listings, payments"
              last
            />
          </Section>
        )}

        {/* ─── Account ─── */}
        <Section title="Account">
          <Row
            href="/account/settings"
            icon={Settings}
            label="Settings"
            sub="Profile, password, notifications"
          />
          <Row
            href="/help"
            icon={HelpCircle}
            label="Help and support"
            sub="FAQs and contact"
          />
          <Row
            href="/legal/privacy"
            icon={ShieldCheck}
            label="Privacy and terms"
            sub="How we handle your data"
            last
          />
        </Section>

        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-100 bg-white py-3.5 text-sm font-bold text-red-600 transition hover:bg-red-50"
        >
          <LogOut size={15} /> Sign out
        </button>

        <p className="pt-1 text-center text-[10.5px] text-gray-400">
          SmileBabaHub · Member since{" "}
          {new Date(
            user._id
              ? parseInt(String(user._id).substring(0, 8), 16) * 1000
              : Date.now(),
          ).toLocaleDateString("en-GH", { year: "numeric", month: "long" })}
        </p>
      </div>
    </main>
  );
}

// ─── Bits ────────────────────────────────────────────────────────────
function Badge({
  children,
  dark,
}: {
  children: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <span
      className={`rounded px-2 py-0.5 text-[10px] font-bold ${
        dark ? "bg-gray-900 text-amber-400" : "bg-black/10 text-gray-900"
      }`}
    >
      {children}
    </span>
  );
}

function Tile({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: any;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center gap-1.5 rounded-2xl border border-gray-100 bg-white px-2 py-3.5 text-center transition hover:-translate-y-0.5 hover:shadow-sm active:scale-95"
    >
      <Icon size={19} className="text-gray-700" strokeWidth={1.9} />
      <span className="text-[11px] font-semibold leading-tight text-gray-900">
        {label}
      </span>
    </Link>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="px-1 pb-2 pt-2 text-[11px] font-bold uppercase tracking-wider text-gray-400">
        {title}
      </h2>
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
        {children}
      </div>
    </div>
  );
}

function Row({
  href,
  icon: Icon,
  label,
  sub,
  last,
}: {
  href: string;
  icon: any;
  label: string;
  sub: string;
  last?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 p-4 transition hover:bg-gray-50 ${
        last ? "" : "border-b border-gray-50"
      }`}
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-50">
        <Icon size={16} className="text-amber-600" strokeWidth={2} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-bold text-gray-900">{label}</span>
        <span className="mt-0.5 block truncate text-[11.5px] text-gray-500">
          {sub}
        </span>
      </span>
      <ChevronRight size={14} className="shrink-0 text-gray-300" />
    </Link>
  );
}
