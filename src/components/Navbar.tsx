"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Menu, X, ShoppingCart, ChevronDown } from "lucide-react";
import Image from "next/image";
import { assets } from "../assets/assets";
import UserMenu from "./UserMenu";
import { useAppSelector } from "../app/redux";
import { useRouter } from "next/navigation";
import { useSubscriptionGuard } from "@/src/hooks/useSubscriptionGuard";
import {
  NAV_CATEGORIES,
  MARKETER_LINK,
  NavCategory,
} from "@/src/config/navCategories";
import AdminCountryDropdown from "./admin/AdminCountryDropdown";
import ChatNavBadge from "./Chat/ChatNavBadge";
import NotificationBell from "../app/vendor/(components)/Notification";

const COUNTRY_FLAGS: Record<string, string> = {
  Ghana: "🇬🇭",
  Nigeria: "🇳🇬",
};

// ── Desktop dropdown for one nav category ─────────────────────────────────
function NavDropdown({ cat }: { cat: NavCategory }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!cat.children?.length) {
    return (
      <Link
        href={cat.href}
        className="flex items-center gap-1 hover:text-yellow-400 transition text-sm"
      >
        {cat.label}
        {cat.badge && (
          <span
            className="text-[10px] bg-yellow-400 text-black font-bold
            px-1.5 py-0.5 rounded-full leading-none"
          >
            {cat.badge}
          </span>
        )}
      </Link>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-1 text-sm transition
          ${open ? "text-yellow-400" : "hover:text-yellow-400"}`}
      >
        {cat.label}
        {cat.badge && (
          <span
            className="text-[10px] bg-yellow-400 text-black font-bold
            px-1.5 py-0.5 rounded-full leading-none"
          >
            {cat.badge}
          </span>
        )}
        <ChevronDown
          size={13}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          className="absolute top-full left-0 mt-2 w-52 bg-white rounded-2xl
          shadow-xl border border-gray-100 py-2 z-[200]
          animate-in fade-in slide-in-from-top-1 duration-150"
        >
          <Link
            href={cat.href}
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold
              text-gray-800 hover:bg-yellow-50 hover:text-yellow-700 transition"
          >
            <span className="text-gray-500">{cat.icon}</span>
            All {cat.label}
          </Link>
          <div className="border-t border-gray-100 my-1" />
          {cat.children.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600
                hover:bg-gray-50 hover:text-gray-900 transition"
            >
              <span className="text-gray-400">{child.icon}</span>
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Mobile nav item (accordion) ────────────────────────────────────────────
function MobileNavItem({
  cat,
  onNavigate,
}: {
  cat: NavCategory;
  onNavigate: () => void;
}) {
  const [open, setOpen] = useState(false);

  if (!cat.children?.length) {
    return (
      <Link
        href={cat.href}
        onClick={onNavigate}
        className="flex items-center gap-2 text-lg text-white hover:text-yellow-400 transition"
      >
        <span className="text-white/70">{cat.icon}</span>
        {cat.label}
        {cat.badge && (
          <span
            className="text-[10px] bg-yellow-400 text-black font-bold
            px-1.5 py-0.5 rounded-full"
          >
            {cat.badge}
          </span>
        )}
      </Link>
    );
  }

  return (
    <div className="w-full max-w-xs">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-between w-full text-lg text-white
          hover:text-yellow-400 transition"
      >
        <span className="flex items-center gap-2">
          <span className="text-white/70">{cat.icon}</span>
          {cat.label}
        </span>
        <ChevronDown
          size={16}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="mt-2 pl-4 border-l border-white/10 space-y-2">
          <Link
            href={cat.href}
            onClick={onNavigate}
            className="block text-sm text-white/80 hover:text-yellow-400 transition py-1"
          >
            All {cat.label}
          </Link>
          {cat.children.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              onClick={onNavigate}
              className="flex items-center gap-2 text-sm text-white/70
                hover:text-yellow-400 transition py-1"
            >
              <span className="text-white/50">{child.icon}</span>
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main Navbar ────────────────────────────────────────────────────────────
export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { amount } = useAppSelector((state) => state.cart);
  const { user } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const { guard } = useSubscriptionGuard();

  const flag = COUNTRY_FLAGS[user?.country ?? ""] ?? null;
  const countryCode =
    user?.currency === "NGN" ? "NG" : user?.currency === "GHS" ? "GH" : null;

  // Filter categories by country (null = show everywhere)
  const visibleCategories = NAV_CATEGORIES.filter(
    (c) => !c.country || c.country === countryCode,
  );

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const handlePostAd = () => {
    guard({ type: "post_product" }, () => router.push("/sell"));
  };

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      router.push(`/search?search=${encodeURIComponent(searchQuery.trim())}`);
      setMenuOpen(false);
    }
  };

  const closeMobile = () => setMenuOpen(false);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-[100] transition-all duration-300
        ${isScrolled ? "bg-black/75 backdrop-blur-md shadow-lg py-3" : "bg-[#1a1a1a] py-3"}`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6">
          {/* ── Logo ── */}
          <Link
            href="/"
            className="text-xl sm:text-2xl font-bold text-white flex-shrink-0"
          >
            Smile<span className="text-yellow-400">Baba</span>Hub
            {flag && countryCode && (
              <span
                className="ml-2 text-[11px] bg-white/10 border border-white/20
                px-2 py-0.5 rounded-full font-normal align-middle hidden sm:inline-flex
                items-center gap-1"
              >
                {flag} {countryCode}
              </span>
            )}
          </Link>

          {/* ── Desktop nav — built from NAV_CATEGORIES config ── */}
          <div className="hidden lg:flex items-center gap-5 xl:gap-7 text-white">
            {visibleCategories.map((cat) => (
              <NavDropdown key={cat.href} cat={cat} />
            ))}

            {/* Marketer link — always last, styled distinctly */}
            <Link
              href={MARKETER_LINK.href}
              className="flex items-center gap-1.5 text-yellow-400 hover:text-yellow-300
                transition font-medium border border-yellow-400/30 px-3 py-1 rounded-full
                hover:bg-yellow-400/10 text-sm"
            >
              {MARKETER_LINK.icon}
              {MARKETER_LINK.label}
            </Link>
          </div>

          {/* ── Search ── */}
          {/* <div
            className="hidden md:flex items-center bg-white/10 border border-white/20
            rounded-full px-3 py-1.5 gap-2 min-w-0"
          >
            <Image
              src={assets.searchIcon}
              alt="search"
              width={16}
              height={16}
            />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              className="bg-transparent outline-none text-white text-sm w-32 lg:w-48
                placeholder:text-white/40"
            />
          </div> */}

          {/* ── Right actions ── */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handlePostAd}
              className="hidden md:block bg-yellow-400 text-black px-4 py-2 rounded-full
                text-sm font-semibold hover:bg-yellow-300 transition active:scale-95"
            >
              Post Ad
            </button>

            {/* Cart */}
            <div className="relative">
              <Link href="/cart">
                <ShoppingCart
                  size={22}
                  className="text-white hover:text-yellow-400 cursor-pointer transition"
                />
              </Link>
              {amount > 0 && (
                <span
                  className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4
                  bg-yellow-400 text-black text-[10px] font-bold rounded-full
                  flex items-center justify-center px-0.5 leading-none"
                >
                  {amount > 9 ? "9+" : amount}
                </span>
              )}
            </div>

            {/* Admin country switcher — only renders for admin users */}
            <AdminCountryDropdown />

            {user && <ChatNavBadge />}
            {user && <NotificationBell />}

            <div className="z-50">
              <UserMenu />
            </div>

            {/* Hamburger */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="lg:hidden text-white p-1"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile menu ── */}
      <div
        className={`lg:hidden fixed inset-0 bg-[#1a1a1a]/97 backdrop-blur-xl
        text-white z-[90] transition-transform duration-300 overflow-y-auto
        ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div
          className="flex flex-col items-center justify-start min-h-full
          gap-6 pt-20 pb-10 px-6"
        >
          {/* Close */}
          <button
            onClick={closeMobile}
            className="absolute top-4 right-4 text-white p-2"
          >
            <X size={26} />
          </button>

          {/* Mobile search */}
          <div
            className="flex items-center bg-white/10 border border-white/20
            rounded-full px-4 py-2.5 gap-2 w-full max-w-xs"
          >
            <Image
              src={assets.searchIcon}
              alt="search"
              width={16}
              height={16}
            />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              className="bg-transparent outline-none text-white text-sm flex-1
                placeholder:text-white/40"
            />
          </div>

          {/* Dynamic nav categories */}
          {visibleCategories.map((cat) => (
            <MobileNavItem key={cat.href} cat={cat} onNavigate={closeMobile} />
          ))}

          {/* Marketer link */}
          <Link
            onClick={closeMobile}
            href={MARKETER_LINK.href}
            className="flex items-center gap-2 text-yellow-400 font-semibold
              border border-yellow-400/30 px-6 py-2.5 rounded-full
              hover:bg-yellow-400/10 transition text-base"
          >
            {MARKETER_LINK.icon} {MARKETER_LINK.label}
          </Link>

          {/* Post Ad */}
          <button
            onClick={() => {
              closeMobile();
              handlePostAd();
            }}
            className="bg-yellow-400 text-black px-8 py-3 rounded-full font-bold
              hover:bg-yellow-300 transition active:scale-95 text-base"
          >
            Post Ad
          </button>

          {/* Country badge */}
          {flag && countryCode && (
            <p className="text-sm text-white/50 flex items-center gap-1.5">
              {flag} {countryCode} · Prices in {user?.currency}
            </p>
          )}
        </div>
      </div>
    </>
  );
}
