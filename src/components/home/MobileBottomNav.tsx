"use client";

// src/components/home/MobileBottomNav.tsx
// MOBILE-ONLY: persistent bottom tab bar matching the mockup.
// 5 tabs with the center "Sell / Post" elevated as a big yellow circle.

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid3x3, Plus, MessageSquare, User } from "lucide-react";
import { useAppSelector } from "@/src/app/redux";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const unreadMessages = useAppSelector((s: any) => s.chat?.unreadCount ?? 0);
  const isAuthed = useAppSelector((s) => s.auth?.isAuthenticated ?? false);

  const isActive = (path: string) =>
    pathname === path || (path !== "/" && pathname?.startsWith(path));

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white
      border-t border-gray-200 px-2 pt-2 pb-[max(8px,env(safe-area-inset-bottom))]"
    >
      <div className="grid grid-cols-5 gap-1 max-w-md mx-auto">
        <NavTab
          href="/"
          icon={<Home size={20} />}
          label="Home"
          active={isActive("/")}
        />

        <NavTab
          href="/ads"
          icon={<Grid3x3 size={20} />}
          label="Categories"
          active={isActive("/ads")}
        />

        {/* Center elevated SELL button */}
        <Link
          href={isAuthed ? "/sell" : "/auth/login?redirect=/sell"}
          className="flex flex-col items-center justify-end -mt-6"
        >
          <div
            className="w-14 h-14 bg-yellow-400 rounded-full shadow-xl
            flex items-center justify-center mb-1
            active:scale-95 transition border-4 border-white"
          >
            <Plus size={26} className="text-black" strokeWidth={3} />
          </div>
          <span className="text-[10px] font-bold text-gray-700">
            Sell / Post
          </span>
        </Link>

        <NavTab
          href="/chat"
          icon={<MessageSquare size={20} />}
          label="Messages"
          active={isActive("/chat")}
          badge={unreadMessages}
        />

        <NavTab
          href={isAuthed ? "/account" : "/auth/login"}
          icon={<User size={20} />}
          label="Account"
          active={isActive("/account") || isActive("/auth")}
        />
      </div>
    </nav>
  );
}

function NavTab({
  href,
  icon,
  label,
  active,
  badge = 0,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
  badge?: number;
}) {
  return (
    <Link
      href={href}
      className={`flex flex-col items-center justify-center py-1.5 rounded-xl
        active:scale-95 transition relative
        ${active ? "text-yellow-600" : "text-gray-500"}`}
    >
      <div className="relative">
        {icon}
        {badge > 0 && (
          <span
            className="absolute -top-1.5 -right-2 bg-red-500 text-white
            text-[9px] font-black rounded-full min-w-[16px] h-[16px]
            flex items-center justify-center px-1"
          >
            {badge > 9 ? "9+" : badge}
          </span>
        )}
      </div>
      <span className="text-[10px] font-bold mt-1">{label}</span>
    </Link>
  );
}
