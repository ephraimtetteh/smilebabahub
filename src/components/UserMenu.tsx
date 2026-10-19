"use client";

// src/components/UserMenu.tsx
//
// Account menu in the header (desktop and mobile).
//
// What changed:
//   • Every role gets My account, Messages, Settings and Security. Admins
//     used to see almost nothing (the menu only branched for vendor/guest).
//   • Logout waits for the server, clears the session, then leaves —
//     it used to navigate while logout was still in flight.
//   • Uses the profile photo when there is one.
//
// Links here are convenience only. Every page and API behind them checks
// the role on the server; hiding a link is never the security boundary.

import Link from "next/link";
import {
  User,
  ChevronDown,
  MapPin,
  LayoutDashboard,
  LogOut,
  ShoppingBag,
  CalendarDays,
  Star,
  Megaphone,
  Zap,
  Settings,
  ShieldCheck,
  MessageCircle,
  Store,
  Package,
  UserCircle2,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/redux";
import { useRouter } from "next/navigation";
import { logout } from "../lib/features/auth/authActions";
import { safeStorage } from "@/src/utils/safeStorage";

const COUNTRY_FLAGS: Record<string, string> = { Ghana: "🇬🇭", Nigeria: "🇳🇬" };

function getFirstName(username: string = ""): string {
  const first = username.replace(/_/g, " ").trim().split(" ")[0] ?? "";
  return first ? first.charAt(0).toUpperCase() + first.slice(1).toLowerCase() : "You";
}

const ROLE_BADGE: Record<string, { label: string; cls: string; icon: React.ReactNode }> = {
  vendor: { label: "Vendor", cls: "bg-amber-50 text-amber-700 border-amber-200", icon: <Star size={10} className="fill-amber-500 text-amber-500" /> },
  admin: { label: "Admin", cls: "bg-purple-50 text-purple-700 border-purple-200", icon: <Zap size={10} className="text-purple-500" /> },
  guest: { label: "Member", cls: "bg-gray-50 text-gray-500 border-gray-200", icon: <User size={10} className="text-gray-400" /> },
};

/** Only https images from hosts we expect; anything else falls back to initials. */
function safeAvatar(src?: string | null) {
  if (!src || typeof src !== "string") return null;
  return /^https:\/\/(res\.cloudinary\.com|lh3\.googleusercontent\.com|platform-lookaside\.fbsbx\.com|graph\.facebook\.com)\//.test(src)
    ? src
    : null;
}

function Avatar({ name, src, size }: { name: string; src: string | null; size: number }) {
  const [broken, setBroken] = useState(false);
  const style = { width: size, height: size };
  if (src && !broken) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt="" style={style} referrerPolicy="no-referrer" onError={() => setBroken(true)} className="rounded-full object-cover flex-shrink-0" />;
  }
  return (
    <div style={style} className="rounded-full bg-yellow-400 text-black flex items-center justify-center text-xs font-bold flex-shrink-0">
      {name.charAt(0)}
    </div>
  );
}

export default function UserMenu() {
  const user = useAppSelector((state) => state.auth.user) as any;
  const isAdmin = useAppSelector((state) => state.auth.isAdmin);
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const menuRef = useRef<HTMLDivElement>(null);

  const [isMarketer, setIsMarketer] = useState(false);
  useEffect(() => {
    setIsMarketer(Boolean(safeStorage.get("marketerAccessToken")));
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  if (!user) {
    return (
      <Link href="/auth/login" aria-label="Sign in" className="flex items-center gap-1.5 text-white hover:text-yellow-400 transition">
        <User size={22} />
        <span className="hidden sm:inline text-sm font-medium">Sign in</span>
      </Link>
    );
  }

  const firstName = getFirstName(user.username);
  const flag = COUNTRY_FLAGS[user.country ?? ""] ?? null;
  const countryCode = user.currency === "NGN" ? "NG" : user.currency === "GHS" ? "GH" : null;
  const role: string = isAdmin || user.role === "admin" ? "admin" : (user.role ?? "guest");
  const badge = ROLE_BADGE[role] ?? ROLE_BADGE.guest;
  const avatar = safeAvatar(user.profilePicture || user.storeLogo);
  const isVendor = role === "vendor" || role === "admin";

  const close = () => setOpen(false);

  const handleLogout = async () => {
    if (signingOut) return;
    setSigningOut(true);
    try {
      await dispatch(logout()).unwrap?.();
    } catch {
      /* logout clears local state even if the server call fails */
    } finally {
      setSigningOut(false);
      setOpen(false);
      router.replace("/");
    }
  };

  return (
    <div className="relative z-50" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        className="flex items-center gap-1.5 text-white hover:text-yellow-400 transition"
      >
        <Avatar name={firstName} src={avatar} size={28} />
        <span className="hidden sm:inline text-sm font-medium">{firstName}</span>
        {countryCode && (
          <span className="hidden md:inline text-[10px] bg-white/15 border border-white/20 px-1.5 py-0.5 rounded-full font-semibold tracking-wide">
            {flag ? `${flag} ${countryCode}` : countryCode}
          </span>
        )}
        <ChevronDown size={14} className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2.5 w-64 max-h-[80vh] overflow-y-auto bg-white rounded-2xl shadow-xl border border-gray-100 py-2 text-black z-[200]"
        >
          {/* Header */}
          <Link href="/account" onClick={close} className="block px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition">
            <div className="flex items-center gap-2.5">
              <Avatar name={firstName} src={avatar} size={36} />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">{user.username}</p>
                <p className="text-xs text-gray-400 truncate">{user.email}</p>
              </div>
            </div>
            <div className="mt-2 flex items-center gap-2 flex-wrap">
              <span className={`inline-flex items-center gap-1 text-[10px] border px-2 py-0.5 rounded-full font-semibold ${badge.cls}`}>
                {badge.icon}
                {badge.label}
              </span>
              {(user.country || user.city) && (
                <span className="flex items-center gap-1 text-xs text-gray-500 min-w-0">
                  <MapPin size={11} className="flex-shrink-0" />
                  <span className="truncate">{user.city ? `${user.city}, ` : ""}{user.country}</span>
                </span>
              )}
            </div>
          </Link>

          {/* Everyone */}
          <div className="py-1">
            <MenuItem href="/account" icon={<UserCircle2 size={15} />} label="My account" onClick={close} />
            <MenuItem href="/account/orders" icon={<ShoppingBag size={15} />} label="My orders" onClick={close} />
            <MenuItem href="/account/bookings" icon={<CalendarDays size={15} />} label="My bookings" onClick={close} />
            <MenuItem href="/chat" icon={<MessageCircle size={15} />} label="Messages" onClick={close} />
          </div>

          {/* Selling */}
          <div className="border-t border-gray-100 py-1">
            {isVendor ? (
              <>
                <MenuItem href="/vendor/dashboard" icon={<LayoutDashboard size={15} />} label="Vendor dashboard" onClick={close} />
                <MenuItem href="/ads/my" icon={<Package size={15} />} label="My listings" onClick={close} />
                <MenuItem href="/vendor/orders" icon={<Store size={15} />} label="Orders & bookings received" onClick={close} />
              </>
            ) : (
              <MenuItem href="/subscription" icon={<Star size={15} />} label="Become a vendor" onClick={close} highlight />
            )}
            {role === "admin" && (
              <MenuItem href="/admin" icon={<Zap size={15} />} label="Admin panel" onClick={close} />
            )}
            <MenuItem
              href={isMarketer ? "/marketer/dashboard" : "/marketer"}
              icon={<Megaphone size={15} />}
              label={isMarketer ? "Marketer dashboard" : "Become a marketer"}
              onClick={close}
              muted={!isMarketer}
            />
          </div>

          {/* Account */}
          <div className="border-t border-gray-100 py-1">
            <MenuItem href="/account/settings" icon={<Settings size={15} />} label="Settings" onClick={close} />
            <MenuItem href="/account/security" icon={<ShieldCheck size={15} />} label="Security (2FA)" onClick={close} />
            {isVendor && (
              <MenuItem href="/vendor/settings" icon={<Store size={15} />} label="Store settings" onClick={close} />
            )}
          </div>

          <div className="border-t border-gray-100 py-1">
            <button
              role="menuitem"
              onClick={handleLogout}
              disabled={signingOut}
              className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition disabled:opacity-50"
            >
              <LogOut size={15} />
              {signingOut ? "Signing out…" : "Sign out"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function MenuItem({
  href, icon, label, onClick, highlight = false, muted = false,
}: {
  href: string; icon: React.ReactNode; label: string; onClick: () => void; highlight?: boolean; muted?: boolean;
}) {
  return (
    <Link
      role="menuitem"
      href={href}
      onClick={onClick}
      className={`flex items-center gap-2.5 px-4 py-2.5 text-sm transition ${
        highlight ? "text-amber-600 hover:bg-amber-50 font-medium" : muted ? "text-gray-400 hover:bg-gray-50" : "text-gray-700 hover:bg-gray-50"
      }`}
    >
      <span className={highlight ? "text-amber-500" : muted ? "text-gray-300" : "text-gray-400"}>{icon}</span>
      {label}
    </Link>
  );
}
