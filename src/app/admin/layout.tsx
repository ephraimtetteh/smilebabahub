"use client";
// src/app/admin/layout.tsx
// Shared layout for all /admin/* pages.
// Blocks non-admin users at render time (middleware handles server-side).

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAppSelector } from "@/src/app/redux";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Megaphone,
  ShoppingBag,
  LogOut,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

const NAV = [
  { href: "/admin", icon: <LayoutDashboard size={16} />, label: "Overview" },
  { href: "/admin/users", icon: <Users size={16} />, label: "Users" },
  {
    href: "/admin/subscriptions",
    icon: <CreditCard size={16} />,
    label: "Subscriptions",
  },
  {
    href: "/admin/marketers",
    icon: <Megaphone size={16} />,
    label: "Marketers",
  },
  { href: "/admin/ads", icon: <ShoppingBag size={16} />, label: "Ads" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAppSelector((s) => s.auth.user);
  const isAdmin = user?.isAdmin || user?.role === "admin";

  // Client-side guard — redirect non-admins immediately
  useEffect(() => {
    if (user !== undefined && !isAdmin) router.replace("/");
  }, [user, isAdmin, router]);

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* ── Sidebar ── */}
      <aside
        className="w-56 flex-shrink-0 bg-[#111] flex flex-col
        min-h-screen sticky top-0 hidden md:flex"
      >
        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-[#ffc105]" />
            <span className="text-white font-black text-sm">Admin Panel</span>
          </div>
          <p className="text-white/40 text-[11px] mt-1 truncate">
            {user?.email}
          </p>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {NAV.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl
                  text-sm font-medium transition
                  ${
                    active
                      ? "bg-[#ffc105] text-black"
                      : "text-white/60 hover:text-white hover:bg-white/10"
                  }`}
              >
                {item.icon}
                {item.label}
                {active && <ChevronRight size={12} className="ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-white/10">
          <Link
            href="/"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm
              text-white/50 hover:text-white hover:bg-white/10 transition"
          >
            <LogOut size={14} />
            Back to site
          </Link>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Mobile top bar */}
        <div
          className="md:hidden flex items-center gap-3 px-4 py-3
          bg-[#111] border-b border-white/10 overflow-x-auto"
        >
          {NAV.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full
                  text-xs font-semibold whitespace-nowrap transition flex-shrink-0
                  ${
                    active
                      ? "bg-[#ffc105] text-black"
                      : "text-white/60 hover:text-white"
                  }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </div>

        <main className="flex-1 p-4 sm:p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
