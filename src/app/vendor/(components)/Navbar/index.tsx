"use client";

import { Bell, BellIcon, Menu, Settings, Sun } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useAppDispatch, useAppSelector } from "@/src/app/redux";
import { setIsDarkMode, setIsSidebarCollapsed } from "@/src/lib";
import { assets } from "@/src/assets/assets";
import NotificationBell from "../Notification";

const COUNTRY_FLAGS: Record<string, string> = {
  Ghana: "🇬🇭",
  Nigeria: "🇳🇬",
};

function getFirstName(username: string = ''): string {
  const clean = username.replace(/_/g, "").trim();
  const first = clean.split(" ")[0]
  return first.charAt(0).toUpperCase() + first.slice(1).toLowerCase()
}

const Navbar = () => {
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed,
  );
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const { user } = useAppSelector((state) => state.auth)
  const flag = COUNTRY_FLAGS[user?.country ?? ""] ?? "";
  const firstName = getFirstName(user?.username)
  const countryCode =
    user?.currency === "NGN" ? "NG" : user?.currency === "GHS" ? "GH" : null;

  const toggleSidebarCollapsed = () => {
    dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
  };

  const toggleDarkMode = () => {
    dispatch(setIsDarkMode(!isDarkMode));
  };

  return (
    <div className="w-full sticky top-0 backdrop-blur bg-white/80 flex justify-between items-center px-4 py-3 shadow-sm mb-6">
      {/* left side */}
      <div className="flex items-center gap-5">
        <button
          className="px-3 py-3 bg-gray-300 rounded-full hover:bg-blue-100"
          onClick={toggleSidebarCollapsed}
        >
          <Menu className="w-4 h-4" />
        </button>

        <div className="relative">
          <input
            type="search"
            placeholder="Start typing to search..."
            className="pl-10 pr-4 py-2 w-40 md:w-80 border border-gray-300 bg-white rounded-lg focus:outline-none focus:border-blue-500"
          />

          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <BellIcon className="text-gray-500" size={18} />
          </div>
        </div>
      </div>

      {/* right side */}
      <div className="flex items-center gap-5">
        <div className="hidden md:flex items-center gap-5">
          {/* dark mode */}
          <button onClick={toggleDarkMode}>
            <Sun className="cursor-pointer text-gray-500" size={22} />
          </button>

          {/* notifications */}
          <div className="relative">
            {/* <Bell className="cursor-pointer text-gray-500" size={22} />
            <span className="absolute -top-2 -right-2 px-[0.4rem] py-1 text-xs font-semibold text-white bg-red-500 rounded-full">
              0
            </span> */}
            <NotificationBell />
          </div>

          <hr className="h-6 border-gray-300" />

          {/* profile */}
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="w-9 h-9">
              <Image src={assets.profile_icon} alt="profile" />
            </div>
            <span className="font-semibold">{firstName}</span>
            {countryCode && (
              <span
                className="hidden sm:inline text-[10px] bg-white/15 border border-white/20
                px-1.5 py-0.5 rounded-full font-semibold tracking-wide"
              >
                {flag} {countryCode}
              </span>
            )}
          </div>
        </div>

        {/* settings */}
        <Link href={"/vendor/settings"}>
          <Settings className="cursor-pointer text-gray-500" size={24} />
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
