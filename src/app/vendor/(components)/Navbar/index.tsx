"use client";
// vendor/(components)/Navbar.tsx

import { Bell, BellIcon, Menu, Settings, Sun } from "lucide-react";
import Link from "next/link";
import React from "react";
import { useAppDispatch, useAppSelector } from "@/src/app/redux";
import { setIsDarkMode, setIsSidebarCollapsed } from "@/src/lib";
import NotificationBell from "../Notification";
import SafeImage from "@/src/components/SafeImage";

const COUNTRY_FLAGS: Record<string, string> = {
  Ghana: "🇬🇭",
  Nigeria: "🇳🇬",
};

function getFirstName(username = ""): string {
  const clean = username.replace(/_/g, "").trim();
  const first = clean.split(" ")[0];
  return first.charAt(0).toUpperCase() + first.slice(1).toLowerCase();
}

// Fallback avatar using the vendor's initials
function InitialsAvatar({ username }: { username: string }) {
  const initials = username
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
  return (
    <div
      className="w-9 h-9 rounded-full bg-[#ffc105] flex items-center
      justify-center text-black text-sm font-black flex-shrink-0"
    >
      {initials || "V"}
    </div>
  );
}

const Navbar = () => {
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector((s) => s.global.isSidebarCollapsed);
  const isDarkMode = useAppSelector((s) => s.global.isDarkMode);
  const { user } = useAppSelector((s) => s.auth);

  const flag = COUNTRY_FLAGS[user?.country ?? ""] ?? "";
  const firstName = getFirstName(user?.username);
  const countryCode =
    user?.currency === "NGN" ? "NG" : user?.currency === "GHS" ? "GH" : null;

  // Use storeLogo if set, then profilePicture, then initials fallback
  const avatarSrc = user?.storeLogo || user?.profilePicture || "";

  return (
    <div
      className="w-full sticky top-0 backdrop-blur bg-white/80 flex
      justify-between items-center px-4 py-3 shadow-sm mb-6 z-20"
    >
      {/* Left */}
      <div className="flex items-center gap-5">
        <button
          className="px-3 py-3 bg-gray-300 rounded-full hover:bg-blue-100"
          onClick={() => dispatch(setIsSidebarCollapsed(!isSidebarCollapsed))}
        >
          <Menu className="w-4 h-4" />
        </button>

        <div className="relative">
          <input
            type="search"
            placeholder="Start typing to search..."
            className="pl-10 pr-4 py-2 w-40 md:w-80 border border-gray-300
              bg-white rounded-lg focus:outline-none focus:border-blue-500"
          />
          <div
            className="absolute inset-y-0 left-0 pl-3 flex items-center
            pointer-events-none"
          >
            <BellIcon className="text-gray-500" size={18} />
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-5">
        <div className="hidden md:flex items-center gap-5">
          {/* Dark mode */}
          <button onClick={() => dispatch(setIsDarkMode(!isDarkMode))}>
            <Sun className="cursor-pointer text-gray-500" size={22} />
          </button>

          {/* Notifications */}
          <div className="relative">
            <NotificationBell />
          </div>

          <hr className="h-6 border-gray-300" />

          {/* Profile */}
          <div className="flex items-center gap-3 cursor-pointer">
            <div
              className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0
              border-2 border-[#ffc105]/30"
            >
              {avatarSrc ? (
                <SafeImage
                  src={avatarSrc}
                  alt={user?.username ?? "profile"}
                  width={36}
                  height={36}
                  className="w-full h-full object-cover"
                  fallbackIcon={
                    <InitialsAvatar username={user?.username ?? ""} />
                  }
                />
              ) : (
                <InitialsAvatar username={user?.username ?? ""} />
              )}
            </div>

            <div className="flex flex-col leading-tight">
              <span className="font-semibold text-sm text-gray-800">
                {firstName}
              </span>
              {user?.storeName && (
                <span className="text-[10px] text-gray-400 truncate max-w-[100px]">
                  {user.storeName}
                </span>
              )}
            </div>

            {countryCode && (
              <span
                className="hidden sm:inline text-[10px] bg-gray-100
                border border-gray-200 px-1.5 py-0.5 rounded-full font-semibold
                tracking-wide text-gray-600"
              >
                {flag} {countryCode}
              </span>
            )}
          </div>
        </div>

        {/* Settings */}
        <Link href="/vendor/settings">
          <Settings className="cursor-pointer text-gray-500" size={24} />
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
