"use client";

import Link from "next/link";
import {
  User,
  ChevronDown,
  MapPin,
  LayoutDashboard,
  LogOut,
  History,
  ShoppingBag,
  Star,
  Megaphone,
  Zap,
  Globe,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/redux";
import { useRouter } from "next/navigation";
import { logout } from "../lib/features/auth/authActions";
import { safeStorage } from "@/src/utils/safeStorage";

const COUNTRY_FLAGS: Record<string, string> = {
  Ghana: "🇬🇭",
  Nigeria: "🇳🇬",
};

function getFirstName(username: string = ""): string {
  const clean = username.replace(/_/g, " ").trim();
  const first = clean.split(" ")[0];
  return first.charAt(0).toUpperCase() + first.slice(1).toLowerCase();
}

// Role-based badge config
const ROLE_BADGE: Record<
  string,
  { label: string; cls: string; icon: React.ReactNode }
> = {
  vendor: {
    label: "Vendor",
    cls: "bg-amber-50 text-amber-700 border-amber-200",
    icon: <Star size={10} className="fill-amber-500 text-amber-500" />,
  },
  admin: {
    label: "Admin",
    cls: "bg-purple-50 text-purple-700 border-purple-200",
    icon: <Zap size={10} className="text-purple-500" />,
  },
  guest: {
    label: "Guest",
    cls: "bg-gray-50 text-gray-500 border-gray-200",
    icon: <User size={10} className="text-gray-400" />,
  },
};

export default function UserMenu() {
  const user = useAppSelector((state) => state.auth.user);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const menuRef = useRef<HTMLDivElement>(null);

  // Check if also a marketer (separate token stored)
  const isMarketer = Boolean(
    typeof window !== "undefined" && safeStorage.get("marketerAccessToken"),
  );

  const firstName = getFirstName(user?.username);
  const flag = COUNTRY_FLAGS[user?.country ?? ""] ?? null;
  const countryCode =
    user?.currency === "NGN" ? "NG" : user?.currency === "GHS" ? "GH" : null;
  const role = user?.role ?? "guest";
  const badge = ROLE_BADGE[role];

  const isVendor = role === "vendor";
  const isGuest = role === "guest";

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/auth/login");
    setOpen(false);
  };

  const close = () => setOpen(false);

  return (
    <div className="relative z-50" ref={menuRef}>
      {!user ? (
        <Link href="/auth/login">
          <User className="text-white hover:text-yellow-400 cursor-pointer" />
        </Link>
      ) : (
        <>
          {/* ── Trigger ── */}
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-1.5 text-white hover:text-yellow-400 transition"
          >
            <div
              className="w-7 h-7 rounded-full bg-yellow-400 text-black
              flex items-center justify-center text-xs font-bold flex-shrink-0"
            >
              {firstName.charAt(0)}
            </div>
            <span className="hidden sm:inline text-sm font-medium">
              {firstName}
            </span>
            {countryCode && (
              <span
                className="hidden sm:inline text-[10px] bg-white/15 border border-white/20
                px-1.5 py-0.5 rounded-full font-semibold tracking-wide"
              >
                {flag ? `${flag} ${countryCode}` : countryCode}
              </span>
            )}
            <ChevronDown
              size={14}
              className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            />
          </button>

          {/* ── Dropdown ── */}
          {open && (
            <div
              className="absolute right-0 mt-2.5 w-56 bg-white rounded-2xl
              shadow-xl border border-gray-100 py-2 text-black z-[200] overflow-hidden"
            >
              {/* Header */}
              <div className="px-4 py-3 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-9 h-9 rounded-full bg-yellow-400 text-black
                    flex items-center justify-center text-sm font-bold flex-shrink-0"
                  >
                    {firstName.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {firstName}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>

                {/* Location */}
                {(user.country || user.city) && (
                  <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-500">
                    <MapPin size={11} className="flex-shrink-0" />
                    <span className="truncate">
                      {flag && <span className="mr-0.5">{flag}</span>}
                      {user.city ? `${user.city}, ` : ""}
                      {user.country}
                    </span>
                  </div>
                )}

                {/* Role badge */}
                {badge && (
                  <span
                    className={`inline-flex items-center gap-1 mt-2 text-[10px]
                    border px-2 py-0.5 rounded-full font-semibold ${badge.cls}`}
                  >
                    {badge.icon}
                    {badge.label}
                  </span>
                )}
              </div>

              {/* ── Menu items — change per role ── */}
              <div className="py-1">
                {/* VENDOR — show vendor dashboard + purchase history */}
                {isVendor && (
                  <>
                    <MenuItem
                      href="/vendor"
                      icon={<LayoutDashboard size={15} />}
                      label="Vendor dashboard"
                      onClick={close}
                    />
                    <MenuItem
                      href="/vendor/history"
                      icon={<History size={15} />}
                      label="Purchase history"
                      onClick={close}
                    />
                  </>
                )}

                {/* GUEST — show order history only */}
                {isGuest && (
                  <>
                    <MenuItem
                      href="/account/orders"
                      icon={<ShoppingBag size={15} />}
                      label="My orders"
                      onClick={close}
                    />
                    <MenuItem
                      href="/account/bookings"
                      icon={<History size={15} />}
                      label="My bookings"
                      onClick={close}
                    />
                    <Link
                      href="/subscription"
                      onClick={close}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm
                        text-amber-600 hover:bg-amber-50 transition font-medium"
                    >
                      <Star size={15} className="text-amber-500" />
                      Become a vendor
                    </Link>
                  </>
                )}

                {/* MARKETER portal link — shown if marketer token exists */}
                {isMarketer && (
                  <MenuItem
                    href="/marketer/dashboard"
                    icon={<Megaphone size={15} />}
                    label="Marketer dashboard"
                    onClick={close}
                    highlight
                  />
                )}

                {/* Not a marketer yet — subtle link to marketer page */}
                {!isMarketer && (
                  <MenuItem
                    href="/marketer"
                    icon={<Megaphone size={15} />}
                    label="Become a marketer"
                    onClick={close}
                    muted
                  />
                )}
              </div>

              <div className="border-t border-gray-100 py-1">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm
                    text-red-500 hover:bg-red-50 transition"
                >
                  <LogOut size={15} />
                  Logout
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ── Shared menu item ───────────────────────────────────────────────────────
function MenuItem({
  href,
  icon,
  label,
  onClick,
  highlight = false,
  muted = false,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  highlight?: boolean;
  muted?: boolean;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-2.5 px-4 py-2.5 text-sm transition
        ${
          highlight
            ? "text-amber-600 hover:bg-amber-50 font-medium"
            : muted
              ? "text-gray-400 hover:bg-gray-50"
              : "text-gray-700 hover:bg-gray-50"
        }`}
    >
      <span
        className={
          highlight
            ? "text-amber-500"
            : muted
              ? "text-gray-300"
              : "text-gray-400"
        }
      >
        {icon}
      </span>
      {label}
    </Link>
  );
}
