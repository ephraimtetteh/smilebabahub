"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { assets } from "../assets/assets";
import UserMenu from "./UserMenu";
import { useAppSelector } from "../app/redux";
import { useRouter } from "next/navigation";
import { useSubscriptionGuard } from "@/src/hooks/useSubscriptionGuard";
import NotificationBell from "../app/vendor/(components)/Notification";

const COUNTRY_FLAGS: Record<string, string> = {
  Ghana: "🇬🇭",
  Nigeria: "🇳🇬",
};

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

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handlePostAd = () => {
    guard({ type: "post_product" }, () => {
      router.push("/sell");
    });
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-[100] transition-all duration-300
        ${
          isScrolled
            ? "bg-black/70 backdrop-blur-md shadow-lg py-3"
            : "bg-[#1a1a1a] py-3"
        }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6">
        {/* LOGO */}
        <Link
          href="/"
          className="text-xl sm:text-2xl font-bold text-white flex-shrink-0"
        >
          Smile<span className="text-yellow-400">Baba</span>Hub
          {/* Country code next to logo when logged in */}
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

        {/* DESKTOP NAV */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-8 text-white text-sm">
          <Link href="/food" className="hover:text-yellow-400 transition">
            Food
          </Link>
          <Link href="/restate" className="hover:text-yellow-400 transition">
            Apartments
          </Link>
          <Link
            href="/marketPlace"
            className="hover:text-yellow-400 transition"
          >
            Marketplace
          </Link>
          {/* Marketer entry point — visible to everyone by default */}
          <Link
            href="/marketer"
            className="flex items-center gap-1.5 text-yellow-400 hover:text-yellow-300
              transition font-medium border border-yellow-400/30 px-3 py-1 rounded-full
              hover:bg-yellow-400/10"
          >
            Earn with us
          </Link>
        </div>

        {/* SEARCH */}
        <div
          className="hidden md:flex items-center bg-white/10 border border-white/20
          rounded-full px-3 py-1.5 gap-2"
        >
          <Image src={assets.searchIcon} alt="search" width={16} height={16} />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && searchQuery.trim()) {
                router.push(
                  `/search?search=${encodeURIComponent(searchQuery)}`,
                );
              }
            }}
            className="bg-transparent outline-none text-white text-sm w-36 lg:w-52
              placeholder:text-white/40"
          />
        </div>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Post Ad — guarded */}
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

          {/* Notification bell — only when logged in */}
          {user && <NotificationBell />}

          {/* User menu */}
          <div className="z-50">
            <UserMenu />
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden text-white p-1"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`lg:hidden fixed top-0 left-0 w-full h-screen bg-[#1a1a1a]/95
          backdrop-blur-xl text-white flex flex-col items-center justify-center gap-7
          text-lg transition-transform duration-300 z-[90]
          ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <button
          onClick={() => setMenuOpen(false)}
          className="absolute top-4 right-4 text-white"
        >
          <X size={26} />
        </button>

        {/* Mobile search */}
        <div
          className="flex items-center bg-white/10 border border-white/20
          rounded-full px-4 py-2 gap-2 w-72"
        >
          <Image src={assets.searchIcon} alt="search" width={16} height={16} />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && searchQuery.trim()) {
                setMenuOpen(false);
                router.push(
                  `/search?search=${encodeURIComponent(searchQuery)}`,
                );
              }
            }}
            className="bg-transparent outline-none text-white text-sm flex-1
              placeholder:text-white/40"
          />
        </div>

        <Link
          onClick={() => setMenuOpen(false)}
          href="/food"
          className="hover:text-yellow-400 transition"
        >
          Food
        </Link>
        <Link
          onClick={() => setMenuOpen(false)}
          href="/restate"
          className="hover:text-yellow-400 transition"
        >
          Apartments
        </Link>
        <Link
          onClick={() => setMenuOpen(false)}
          href="/marketPlace"
          className="hover:text-yellow-400 transition"
        >
          Marketplace
        </Link>

        {/* Marketer entry point */}
        <Link
          onClick={() => setMenuOpen(false)}
          href="/marketer"
          className="flex items-center gap-2 text-yellow-400 font-semibold
            border border-yellow-400/30 px-3 py-2 rounded-full hover:bg-yellow-400/10 transition"
        >
          Earn with us
        </Link>

        <button
          onClick={() => {
            setMenuOpen(false);
            handlePostAd();
          }}
          className="bg-yellow-400 text-black px-8 py-2.5 rounded-full font-semibold
            hover:bg-yellow-300 transition active:scale-95"
        >
          Post Ad
        </button>

        {/* Mobile country indicator */}
        {flag && countryCode && (
          <div className="text-sm text-white/60 flex items-center gap-1.5">
            {flag} {countryCode} · Prices in {user?.currency}
          </div>
        )}
      </div>
    </nav>
  );
}
