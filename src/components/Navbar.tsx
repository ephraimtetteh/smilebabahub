"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { assets } from "../assets/assets";
import UserMenu from "./UserMenu";
import { useAppSelector } from "../app/redux";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('')

  const { amount } = useAppSelector((state) => state.cart)
  const router = useRouter()

  const { user } = useAppSelector((state) => state.auth)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  // useEffect(() => {
  //   const timeoutId = setTimeout(() => {
  //     const params = new URLSearchParams();
  //     if (searchQuery.trim()) {
  //       params.append('search',searchQuery)
  //     }
  //     router.replace(`/search?${params.toString()}`);
  //   }, 500);

  //   return () => clearTimeout(timeoutId);
  // }, [searchQuery]);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-[100] transition-all duration-300 max-sm:rounded-t-2xl
      ${
        isScrolled
          ? "bg-black/70 backdrop-blur-md shadow-lg py-3"
          : "bg-[#1a1a1a] py-5 "
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6">
        {/* LOGO */}
        <Link href="/" className="text-2xl font-bold text-white">
          Smile<span className="text-yellow-400">Baba</span>Hub
        </Link>

        {/* DESKTOP NAV */}
        <div className="hidden lg:flex items-center gap-8 text-white">
          <Link href="/food" className="hover:text-yellow-400">
            Food
          </Link>

          <Link href="/restate" className="hover:text-yellow-400">
            Apartments
          </Link>

          <Link href="/marketPlace" className="hover:text-yellow-400">
            Marketplace
          </Link>
        </div>

        {/* SEARCH */}
        <div className="hidden md:flex items-center bg-white/10 border border-white/20 rounded-full px-3 py-1">
          <Image src={assets.searchIcon} alt="search" width={18} height={18} />

          <input
            type="text"
            placeholder="Search products..."
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && searchQuery.trim()) {
                router.push(`/search?search=${searchQuery}`);
              }
            }}
            className="bg-transparent outline-none text-white ml-2 w-40 lg:w-56"
          />
        </div>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-3">
          <Link href="/sell">
            <button className="hidden md:block bg-yellow-400 text-black px-4 py-2 rounded-full font-medium hover:bg-yellow-300 transition">
              Post Ad
            </button>
          </Link>
          <div>
            <Link href="/cart">
              <ShoppingCart className="text-white hover:text-yellow-400 cursor-pointer" />
            </Link>
            <div className="absolute top-4 right-70 text-white font-bold">
              {amount === 0 ? "" : amount}
            </div>
          </div>

          <div className="z-50">
            <UserMenu />
          </div>

          {/* MOBILE MENU */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden text-white"
          >
            {menuOpen ? '' : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`lg:hidden fixed top-0 left-0 w-full h-screen bg-white/50 backdrop-blur-3xl text-black flex flex-col items-center justify-start gap-8 text-xl transition-transform duration-500 py-5
        ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden text-black"
        >
          {menuOpen ? <X size={26} /> : ''}
        </button>
        <Link onClick={() => setMenuOpen(false)} href="/food">
          Food
        </Link>

        <Link onClick={() => setMenuOpen(false)} href="/restate">
          Apartments
        </Link>

        <Link onClick={() => setMenuOpen(false)} href="/marketPlace">
          Marketplace
        </Link>

        <Link onClick={() => setMenuOpen(false)} href="/sell">
          Post Ad
        </Link>
      </div>
    </nav>
  );
}
