"use client";
// src/components/PublicNavbar.tsx
// Main site navigation — premium, clean, expensive feel.
// Sticky top bar with logo, category nav, country switcher, auth actions.

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Plus,
  ChevronDown,
  Menu,
  X,
  User,
  LogOut,
  LayoutDashboard,
  ShoppingBag,
  Bell,
  MapPin,
  Home,
  UtensilsCrossed,
  Shirt,
  Pill,
  Truck,
  Wrench,
} from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/src/app/redux";
import { useViewCountry } from "@/src/hooks/useViewCountry";
import { logout } from "@/src/lib/features/auth/authActions";
import SafeImage from "@/src/components/SafeImage";
import CountrySwitcher from "@/src/components/CountrySwitcher";

// ── Category nav items ─────────────────────────────────────────────────────
const NAV_CATEGORIES = [
  {
    id: "marketplace",
    label: "Shop",
    icon: <ShoppingBag size={14} />,
    href: "/ads?category=marketplace",
  },
  {
    id: "food",
    label: "Food",
    icon: <UtensilsCrossed size={14} />,
    href: "/food",
  },
  {
    id: "apartments",
    label: "Property",
    icon: <Home size={14} />,
    href: "/restate",
  },
  {
    id: "fashion",
    label: "Fashion",
    icon: <Shirt size={14} />,
    href: "/ads?category=fashion",
  },
  {
    id: "pharmacy",
    label: "Pharmacy",
    icon: <Pill size={14} />,
    href: "/ads?category=pharmacy",
  },
  {
    id: "delivery",
    label: "Delivery",
    icon: <Truck size={14} />,
    href: "/ads?category=delivery",
  },
  {
    id: "services",
    label: "Services",
    icon: <Wrench size={14} />,
    href: "/ads?category=services",
  },
];

// ── Initials avatar ────────────────────────────────────────────────────────
function InitialsAvatar({ name, size = 8 }: { name: string; size?: number }) {
  const initials = name
    .trim()
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
  return (
    <div
      className={`w-${size} h-${size} rounded-full bg-[#ffd700] text-black
      flex items-center justify-center text-xs font-black flex-shrink-0`}
    >
      {initials || "U"}
    </div>
  );
}

// ── User dropdown ──────────────────────────────────────────────────────────
function UserMenu({ user, onClose }: { user: any; onClose: () => void }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const isVendor = user.role === "vendor" || user.role === "admin";

  const handleLogout = async () => {
    await dispatch(logout() as any);
    onClose();
    router.push("/");
  };

  return (
    <div
      className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl
      shadow-2xl border border-gray-100 overflow-hidden z-50 py-1"
    >
      {/* User info */}
      <div className="px-4 py-3 border-b border-gray-50">
        <p className="text-sm font-bold text-gray-900 truncate">
          {user.username}
        </p>
        <p className="text-xs text-gray-400 truncate">{user.email}</p>
        <span
          className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5
          rounded-full ${
            isVendor
              ? "bg-[#ffd700]/20 text-amber-700"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          {user.role}
        </span>
      </div>

      {isVendor && (
        <Link
          href="/vendor/dashboard"
          onClick={onClose}
          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700
            hover:bg-gray-50 transition"
        >
          <LayoutDashboard size={15} className="text-[#ffd700]" />
          Dashboard
        </Link>
      )}

      <Link
        href="/ads/my"
        onClick={onClose}
        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700
          hover:bg-gray-50 transition"
      >
        <ShoppingBag size={15} className="text-gray-400" />
        My listings
      </Link>

      <Link
        href="/account/orders"
        onClick={onClose}
        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700
          hover:bg-gray-50 transition"
      >
        <Bell size={15} className="text-gray-400" />
        Orders & bookings
      </Link>

      <Link
        href="/vendor/settings"
        onClick={onClose}
        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700
          hover:bg-gray-50 transition"
      >
        <User size={15} className="text-gray-400" />
        Settings
      </Link>

      <div className="border-t border-gray-50 mt-1">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm
            text-red-500 hover:bg-red-50 transition"
        >
          <LogOut size={15} />
          Sign out
        </button>
      </div>
    </div>
  );
}

// ── Main Navbar ────────────────────────────────────────────────────────────
export default function PublicNavbar() {
  const router = useRouter();
  const { user } = useAppSelector((s) => s.auth);
  const { country, currency, sym } = useViewCountry();
  const isLoggedIn = !!user;
  const isVendor = user?.role === "vendor" || user?.role === "admin";

  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const userMenuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Close user menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Focus search input when opened
  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/ads?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const avatarSrc = user?.profilePicture || user?.storeLogo || "";

  return (
    <>
      {/* ── Top strip (country + currency) ── */}
      <div
        className="bg-gray-950 text-gray-400 text-[11px] font-medium
        flex items-center justify-between px-4 sm:px-6 py-1.5"
      >
        <span className="flex items-center gap-1.5">
          <MapPin size={10} />
          Serving Ghana 🇬🇭 & Nigeria 🇳🇬
        </span>
        <div className="flex items-center gap-3">
          <span>
            {currency} ({sym})
          </span>
          <CountrySwitcher />
        </div>
      </div>

      {/* ── Main nav ── */}
      <header
        className="sticky top-0 z-40 bg-white/95 backdrop-blur-md
        border-b border-gray-100 shadow-sm"
      >
        {/* ── Brand + actions row ── */}
        <div className="flex items-center gap-3 px-4 sm:px-6 h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0 mr-2">
            <span
              className="font-black text-lg sm:text-xl text-gray-900
              tracking-tight leading-none"
            >
              Smile<span className="text-[#ffd700]">Baba</span>
            </span>
          </Link>

          {/* ── Desktop category nav ── */}
          <nav className="hidden lg:flex items-center gap-0.5 flex-1 min-w-0">
            {NAV_CATEGORIES.map((c) => (
              <Link
                key={c.id}
                href={c.href}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs
                  font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-50
                  transition whitespace-nowrap"
              >
                <span className="opacity-60">{c.icon}</span>
                {c.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2 ml-auto flex-shrink-0">
            {/* Search toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 hover:bg-gray-100 rounded-xl transition text-gray-600"
              aria-label="Search"
            >
              {searchOpen ? <X size={18} /> : <Search size={18} />}
            </button>

            {/* Post Ad CTA */}
            <Link
              href={
                isVendor
                  ? "/ads/create"
                  : isLoggedIn
                    ? "/subscribe"
                    : "/auth/login?reason=sell"
              }
              className="hidden sm:flex items-center gap-2 bg-[#ffd700] text-black
                font-bold text-xs px-4 py-2 rounded-xl hover:bg-yellow-300
                active:scale-95 transition-all duration-150 shadow-sm
                shadow-yellow-200 whitespace-nowrap"
            >
              <Plus size={14} strokeWidth={3} />
              Post Ad
            </Link>

            {/* Auth */}
            {isLoggedIn ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1 hover:bg-gray-50
                    rounded-xl transition"
                >
                  <div
                    className="w-8 h-8 rounded-full overflow-hidden ring-2
                    ring-[#ffd700]/40 flex-shrink-0"
                  >
                    {avatarSrc ? (
                      <SafeImage
                        src={avatarSrc}
                        alt={user.username}
                        width={32}
                        height={32}
                        className="w-full h-full object-cover"
                        fallbackIcon={
                          <InitialsAvatar name={user.username} size={8} />
                        }
                      />
                    ) : (
                      <InitialsAvatar name={user.username} size={8} />
                    )}
                  </div>
                  <ChevronDown
                    size={13}
                    className={`text-gray-400 transition-transform
                    ${userMenuOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {userMenuOpen && (
                  <UserMenu
                    user={user}
                    onClose={() => setUserMenuOpen(false)}
                  />
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  href="/auth/login"
                  className="text-xs font-semibold text-gray-600 hover:text-gray-900
                    px-3 py-2 rounded-xl hover:bg-gray-50 transition"
                >
                  Sign in
                </Link>
                <Link
                  href="/auth/register"
                  className="text-xs font-bold text-white bg-gray-900 px-4 py-2
                    rounded-xl hover:bg-gray-700 transition"
                >
                  Join free
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-xl transition"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* ── Expandable search bar ── */}
        {searchOpen && (
          <div className="px-4 sm:px-6 pb-3 border-t border-gray-50">
            <form
              onSubmit={handleSearch}
              className="flex items-center gap-2 mt-2"
            >
              <div className="flex-1 relative">
                <Search
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  ref={searchRef}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search listings, foods, properties…"
                  className="w-full pl-9 pr-4 py-2.5 text-sm bg-gray-50 border
                    border-gray-200 rounded-xl focus:outline-none focus:ring-2
                    focus:ring-[#ffd700] focus:border-[#ffd700] transition"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#ffd700] text-black text-sm font-bold
                  rounded-xl hover:bg-yellow-300 transition flex-shrink-0"
              >
                Search
              </button>
            </form>
          </div>
        )}

        {/* ── Mobile menu ── */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white">
            {/* Category links */}
            <div className="px-4 py-3 grid grid-cols-2 gap-1">
              {NAV_CATEGORIES.map((c) => (
                <Link
                  key={c.id}
                  href={c.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl
                    text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                >
                  <span className="text-gray-400">{c.icon}</span>
                  {c.label}
                </Link>
              ))}
            </div>

            {/* Mobile auth + post */}
            <div
              className="px-4 pb-4 pt-2 border-t border-gray-50
              flex flex-col gap-2"
            >
              <Link
                href={isVendor ? "/ads/create" : "/auth/login?reason=sell"}
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 bg-[#ffd700]
                  text-black font-bold text-sm py-3 rounded-xl"
              >
                <Plus size={16} strokeWidth={3} /> Post a Free Ad
              </Link>
              {!isLoggedIn && (
                <div className="flex gap-2">
                  <Link
                    href="/auth/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 text-center text-sm font-semibold py-2.5
                      border border-gray-200 rounded-xl text-gray-700"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/auth/register"
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 text-center text-sm font-bold py-2.5
                      bg-gray-900 text-white rounded-xl"
                  >
                    Join free
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
