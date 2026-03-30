"use client";
// src/components/chat/ChatNavBadge.tsx
// Shows a red badge on the chat icon in the Navbar with unread message count.
// Usage: <ChatNavBadge />

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { useAppSelector } from "@/src/app/redux";
import axiosInstance from "@/src/lib/api/axios";

export default function ChatNavBadge() {
  const user = useAppSelector((s) => s.auth.user);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    const fetch = () =>
      axiosInstance
        .get("/chat/unread")
        .then((r) => setCount(r.data.unread ?? 0))
        .catch(() => {});

    fetch();
    const interval = setInterval(fetch, 30_000); // poll every 30s
    return () => clearInterval(interval);
  }, [user]);

  if (!user) return null;

  return (
    <Link
      href="/chat"
      className="relative text-white hover:text-yellow-400 transition"
    >
      <MessageCircle size={22} />
      {count > 0 && (
        <span
          className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 bg-red-500
          text-white text-[9px] font-black rounded-full flex items-center justify-center
          px-1 leading-none"
        >
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
