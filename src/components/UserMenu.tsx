"use client";

import Link from "next/link";
import {
  User,
  ChevronDown,
  MapPin,
  LayoutDashboard,
  LogOut,
  History,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/redux";
import { useRouter } from "next/navigation";
import { logout } from "../lib/features/auth/authActions";

const COUNTRY_FLAGS: Record<string, string> = {
  Ghana: "🇬🇭",
  Nigeria: "🇳🇬",
};

function getFirstName(username: string = ""): string {
  const clean = username.replace(/_/g, " ").trim();
  const first = clean.split(" ")[0];
  return first.charAt(0).toUpperCase() + first.slice(1).toLowerCase();
}

export default function UserMenu() {
  const user = useAppSelector((state) => state.auth.user);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const menuRef = useRef<HTMLDivElement>(null);

  const firstName = getFirstName(user?.username);
  const flag = COUNTRY_FLAGS[user?.country ?? ""] ?? "🌍";
  const countryCode =
    user?.currency === "NGN" ? "NG" : user?.currency === "GHS" ? "GH" : null;

  // Close on outside click
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

  return (
    <div className="relative z-50" ref={menuRef}>
      {!user ? (
        <Link href="/auth/login">
          <User className="text-white hover:text-yellow-400 cursor-pointer" />
        </Link>
      ) : (
        <>
          {/* Trigger */}
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-1.5 text-white hover:text-yellow-400 transition"
          >
            {/* Avatar circle */}
            <div
              className="w-7 h-7 rounded-full bg-yellow-400 text-black
              flex items-center justify-center text-xs font-bold flex-shrink-0"
            >
              {firstName.charAt(0)}
            </div>

            <span className="hidden sm:inline text-sm font-medium">
              {firstName}
            </span>

            {/* Country code badge */}
            {countryCode && (
              <span
                className="hidden sm:inline text-[10px] bg-white/15 border border-white/20
                px-1.5 py-0.5 rounded-full font-semibold tracking-wide"
              >
                {flag} {countryCode}
              </span>
            )}

            <ChevronDown
              size={14}
              className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            />
          </button>

          {/* Dropdown */}
          {open && (
            <div
              className="absolute right-0 mt-2.5 w-52 bg-white rounded-2xl
              shadow-xl border border-gray-100 py-2 text-black z-[200] overflow-hidden
              animate-in fade-in slide-in-from-top-1 duration-150"
            >
              {/* User header */}
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

                {/* Location + country */}
                {(user.country || user.city) && (
                  <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-500">
                    <MapPin size={11} className="flex-shrink-0" />
                    <span className="truncate">
                      {flag} {user.city ? `${user.city}, ` : ""}
                      {user.country}
                    </span>
                  </div>
                )}

                {/* Subscription badge */}
                {user.role === "vendor" && (
                  <span
                    className="inline-flex items-center gap-1 mt-2 text-[10px]
                    bg-amber-50 text-amber-700 border border-amber-200
                    px-2 py-0.5 rounded-full font-semibold"
                  >
                    ✓ Vendor
                  </span>
                )}
              </div>

              {/* Menu items */}
              <div className="py-1">
                <Link
                  href="/vendor"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm
                    text-gray-700 hover:bg-gray-50 transition"
                >
                  <LayoutDashboard size={15} className="text-gray-400" />
                  Dashboard
                </Link>

                <Link
                  href="/vendor/history"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm
                    text-gray-700 hover:bg-gray-50 transition"
                >
                  <History size={15} className="text-gray-400" />
                  Purchase history
                </Link>

                {user.role !== "vendor" && (
                  <Link
                    href="/subscribe"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm
                      text-amber-600 hover:bg-amber-50 transition font-medium"
                  >
                    <span className="text-base leading-none">⭐</span>
                    Upgrade to vendor
                  </Link>
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
