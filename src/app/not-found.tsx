// src/app/not-found.tsx
// Custom 404 page for Next.js App Router.
// Place this at: src/app/not-found.tsx

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/src/app/redux";
import {
  Home,
  ShoppingBag,
  Store,
  LayoutDashboard,
  Tag,
  MessageCircle,
  ArrowLeft,
  Frown,
} from "lucide-react";
import { MdAdsClick } from "react-icons/md";

const LINKS = [
  {
    href: "/",
    icon: <Home size={16} />,
    label: "Homepage",
    desc: "Back to the SmileBaba Hub home",
    color: "bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100",
  },
  {
    href: "/marketPlace",
    icon: <ShoppingBag size={16} />,
    label: "Marketplace",
    desc: "Browse all listings",
    color: "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100",
  },
  {
    href: "/sell",
    icon: <Tag size={16} />,
    label: "Post an ad",
    desc: "List something for sale",
    color: "bg-green-50 border-green-200 text-green-700 hover:bg-green-100",
  },
  {
    href: "/vendor/dashboard",
    icon: <LayoutDashboard size={16} />,
    label: "Vendor dashboard",
    desc: "Manage your listings & stats",
    color: "bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100",
  },
  {
    href: "/ads",
    icon: <MdAdsClick size={16} />,
    label: "Ads",
    desc: "See All posted ads by vendors",
    color: "bg-violet-50 border-violet-200 text-violet-700 hover:bg-violet-100",
  },
  {
    href: "/subscription",
    icon: <Store size={16} />,
    label: "Subscription plans",
    desc: "Become a vendor on SmileBaba",
    color: "bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100",
  },
  {
    href: "/chat",
    icon: <MessageCircle size={16} />,
    label: "Messages",
    desc: "Chat with buyers & sellers",
    color: "bg-pink-50 border-pink-200 text-pink-700 hover:bg-pink-100",
  },
];

export default function NotFound() {
  const router = useRouter();
  const user = useAppSelector((s) => s.auth.user);

  // Show vendor-relevant links first for logged-in vendors
  const links =
    user?.role === "vendor" || user?.role === "admin"
      ? LINKS
      : LINKS.filter((l) => l.href !== "/vendor/dashboard");

  return (
    <div
      className="min-h-screen bg-gray-50 flex flex-col items-center
      justify-center px-4 py-16 text-center"
    >
      {/* Illustration */}
      <div
        className="w-24 h-24 bg-[#ffc105]/10 rounded-full flex items-center
        justify-center mb-6"
      >
        <Frown size={44} className="text-[#ffc105]" />
      </div>

      {/* Headline */}
      <h1 className="text-6xl font-black text-gray-900 mb-2">404</h1>
      <h2 className="text-xl sm:text-2xl font-bold text-gray-700 mb-3">
        Page not found
      </h2>
      <p className="text-gray-400 text-sm max-w-sm mb-10 leading-relaxed">
        The page you&apos;re looking for doesn&apos;t exist or may have been
        moved. Here are some places to go instead:
      </p>

      {/* Quick-nav grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg mb-10">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={`flex items-center gap-3 px-4 py-3.5 border rounded-2xl
              transition text-left ${l.color}`}
          >
            <span className="flex-shrink-0">{l.icon}</span>
            <div className="min-w-0">
              <p className="text-sm font-bold leading-tight">{l.label}</p>
              <p className="text-xs opacity-70 mt-0.5 truncate">{l.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Go back */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-gray-400
          hover:text-gray-600 transition font-medium"
      >
        <ArrowLeft size={15} />
        Go back to where you were
      </button>
    </div>
  );
}
