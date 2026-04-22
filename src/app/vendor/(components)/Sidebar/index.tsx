"use client";

import {
  LayoutDashboard,
  Bell,
  CircleDollarSign,
  ShoppingBag,
  HistoryIcon,
  LucideIcon,
  Menu,
  Settings,
  Archive,
  LogOut,
  X,
} from "lucide-react";
import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/src/app/redux";
import { setIsSidebarCollapsed } from "@/src/lib";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { assets } from "@/src/assets/assets";
import Image from "next/image";
import Radio from "@/src/components/Radio";
import { logout } from "@/src/lib/features/auth/authActions";

// ── Sidebar link ─────────────────────────────────────────────────────────────
interface SidebarLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
  isCollapsed: boolean;
}

const SidebarLink = ({
  href,
  icon: Icon,
  label,
  isCollapsed,
}: SidebarLinkProps) => {
  const pathname = usePathname();
  const isActive =
    pathname === href ||
    (href !== "/vendor/dashboard" && pathname.startsWith(href));

  return (
    <Link href={href}>
      <div
        className={`cursor-pointer flex items-center gap-3 transition-colors
        hover:text-yellow-600 hover:bg-yellow-50
        ${isCollapsed ? "justify-center py-4 px-0" : "justify-start px-6 py-3.5"}
        ${isActive ? "bg-yellow-100 text-yellow-700 border-r-2 border-yellow-500" : "text-gray-600"}`}
      >
        <Icon className="w-5 h-5 flex-shrink-0" />
        {!isCollapsed && <span className="font-medium text-sm">{label}</span>}
      </div>
    </Link>
  );
};

// ── Logout confirm dialog ─────────────────────────────────────────────────────
function LogoutDialog({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-black text-gray-900 text-base">Sign out?</h3>
          <button
            onClick={onCancel}
            className="w-7 h-7 bg-gray-100 rounded-full flex items-center
              justify-center hover:bg-gray-200 transition"
          >
            <X size={13} />
          </button>
        </div>
        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
          You`ll need to sign in again to access your vendor dashboard.
        </p>
        <div className="flex gap-2.5">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 border border-gray-200 text-gray-700
              text-sm font-semibold rounded-xl hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 bg-red-500 text-white text-sm font-black
              rounded-xl hover:bg-red-600 transition"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main sidebar ──────────────────────────────────────────────────────────────
const Sidebar = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const isSidebarCollapsed = useAppSelector((s) => s.global.isSidebarCollapsed);
  const user = useAppSelector((s) => s.auth.user);
  const [showLogout, setShowLogout] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const toggle = () => dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));

  const handleLogout = async () => {
    setLoggingOut(true);
    await dispatch(logout());
    setShowLogout(false);
    router.replace("/");
  };

  const sidebarClass = `fixed flex flex-col
    ${isSidebarCollapsed ? "w-0 md:w-16" : "w-72 md:w-60"}
    bg-white transition-all duration-300 overflow-hidden shadow-md z-40 h-full`;

  // ── Nav links — all canonical paths ──────────────────────────────────────
  const NAV = [
    { href: "/vendor/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/vendor/orders", icon: Archive, label: "Orders" },
    { href: "/vendor/products", icon: Archive, label: "Products" },
    { href: "/ads/my", icon: ShoppingBag, label: "My Ads" },
    { href: "/vendor/message", icon: Bell, label: "Messages" },
    { href: "/subscription", icon: CircleDollarSign, label: "Subscription" },
    { href: "/account/orders", icon: HistoryIcon, label: "History" },
    { href: "/vendor/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <>
      <div className={sidebarClass}>
        {/* ── Logo ── */}
        <div
          className={`flex gap-2 justify-between md:justify-normal
          items-center pt-7
          ${isSidebarCollapsed ? "px-4" : "px-5"}`}
        >
          <Link href="/vendor/dashboard">
            <Image
              src={assets.logo}
              alt="SmileBaba"
              width={36}
              height={36}
              className="rounded-xl flex-shrink-0"
            />
          </Link>
          {!isSidebarCollapsed && (
            <h1 className="font-extrabold text-sm text-yellow-500 leading-tight">
              SmileBaba Hub
            </h1>
          )}
          <button
            onClick={toggle}
            className="md:hidden px-2 py-2 bg-gray-100 rounded-full
              hover:bg-yellow-100 ml-auto"
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>

        {/* ── Vendor badge ── */}
        {!isSidebarCollapsed && user?.username && (
          <div
            className="mx-4 mt-5 mb-1 px-3 py-2.5 bg-yellow-50 rounded-xl
            border border-yellow-100"
          >
            <p
              className="text-[10px] font-bold text-yellow-600 uppercase
              tracking-wider"
            >
              Vendor
            </p>
            <p className="text-xs font-semibold text-gray-800 truncate mt-0.5">
              {user.username}
            </p>
            {user.subscription?.plan && (
              <p className="text-[10px] text-gray-400 mt-0.5">
                {user.subscription.plan}
              </p>
            )}
          </div>
        )}

        {/* ── Nav links ── */}
        <nav className="flex-1 mt-4 overflow-y-auto">
          {NAV.map((item) => (
            <SidebarLink
              key={item.href}
              {...item}
              isCollapsed={isSidebarCollapsed}
            />
          ))}

          {/* Radio player */}
          {!isSidebarCollapsed && (
            <div className="mt-4 px-4">
              <Radio />
            </div>
          )}
        </nav>

        {/* ── Logout ── */}
        <div className="border-t border-gray-100 py-3">
          <button
            onClick={() => setShowLogout(true)}
            disabled={loggingOut}
            className={`w-full flex items-center gap-3 transition-colors
              hover:bg-red-50 hover:text-red-600 text-gray-500
              ${isSidebarCollapsed ? "justify-center py-3" : "px-6 py-3"}
              disabled:opacity-40`}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!isSidebarCollapsed && (
              <span className="font-semibold text-sm">
                {loggingOut ? "Signing out…" : "Sign out"}
              </span>
            )}
          </button>
          {!isSidebarCollapsed && (
            <p className="text-center text-[10px] text-gray-400 mt-2">
              © {new Date().getFullYear()} SmileBaba Hub
            </p>
          )}
        </div>
      </div>

      {/* ── Logout confirm dialog ── */}
      {showLogout && (
        <LogoutDialog
          onConfirm={handleLogout}
          onCancel={() => setShowLogout(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
