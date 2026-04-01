"use client";
// src/components/chat/ChatNavBadge.tsx
// Shows the unread message count badge on the chat icon in the Navbar.
//
// Strategy:
//  1. Fetch initial count from REST on mount (one-time)
//  2. Subscribe to "unread_count" Socket.IO event for live updates
//  3. No polling — the server pushes the count whenever a message arrives
//     or is marked read, so the badge is always accurate in real time.

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { useAppSelector } from "@/src/app/redux";
import axiosInstance from "@/src/lib/api/axios";
import { io, Socket } from "socket.io-client";

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL ?? "http://localhost:3001";

export default function ChatNavBadge() {
  const user = useAppSelector((s) => s.auth.user);
  const userId = (user as any)?._id ?? (user as any)?.id;
  const [count, setCount] = useState(0);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!user || !userId) {
      setCount(0);
      return;
    }

    // ── 1. Fetch initial count ──────────────────────────────────────────────
    axiosInstance
      .get("/chat/unread")
      .then((r) => setCount(r.data.unread ?? 0))
      .catch(() => {});

    // ── 2. Connect socket and listen for live pushes ────────────────────────
    const socket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("register_user", userId);
    });

    // Server pushes this whenever a message arrives or is marked read
    socket.on("unread_count", ({ count: c }: { count: number }) => {
      setCount(c);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [userId]); // re-run when user changes (login / logout)

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
