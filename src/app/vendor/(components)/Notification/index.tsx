"use client";

// src/components/NotificationBell.tsx
// All icons from lucide-react — zero emojis.
// Uses socket.io for real-time notification pushes.
// Falls back to a 5-minute poll in case socket is unavailable.

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  BellOff,
  X,
  Calendar,
  AlertTriangle,
  AlertOctagon,
  XOctagon,
  CheckCircle2,
  XCircle,
  Zap,
  Megaphone,
  ChevronRight,
} from "lucide-react";
import { io, Socket } from "socket.io-client";
import axiosInstance from "@/src/lib/api/axios";
import { useAppSelector } from "@/src/app/redux";

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL ?? "http://localhost:3001";

// ── Types ──────────────────────────────────────────────────────────────────
type NotificationType =
  | "subscription_expiring_7"
  | "subscription_expiring_3"
  | "subscription_expiring_1"
  | "subscription_expired"
  | "subscription_activated"
  | "payment_failed"
  | "boost_approved"
  | "ad_approved"
  | "ad_rejected"
  | "ad_flagged";

type Notification = {
  _id: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  actionUrl?: string;
  actionLabel?: string;
  createdAt: string;
};

// ── Icon + colour per notification type ───────────────────────────────────
const TYPE_CONFIG: Record<
  NotificationType,
  { icon: React.ReactNode; bg: string }
> = {
  subscription_expiring_7: {
    icon: <Calendar size={15} className="text-blue-600" />,
    bg: "bg-blue-50",
  },
  subscription_expiring_3: {
    icon: <AlertTriangle size={15} className="text-orange-500" />,
    bg: "bg-orange-50",
  },
  subscription_expiring_1: {
    icon: <AlertOctagon size={15} className="text-red-500" />,
    bg: "bg-red-50",
  },
  subscription_expired: {
    icon: <XOctagon size={15} className="text-red-600" />,
    bg: "bg-red-50",
  },
  subscription_activated: {
    icon: <CheckCircle2 size={15} className="text-green-600" />,
    bg: "bg-green-50",
  },
  payment_failed: {
    icon: <XCircle size={15} className="text-red-500" />,
    bg: "bg-red-50",
  },
  boost_approved: {
    icon: <Zap size={15} className="text-amber-500" />,
    bg: "bg-amber-50",
  },
  ad_approved: {
    icon: <CheckCircle2 size={15} className="text-green-600" />,
    bg: "bg-green-50",
  },
  ad_rejected: {
    icon: <XCircle size={15} className="text-red-500" />,
    bg: "bg-red-50",
  },
  ad_flagged: {
    icon: <AlertTriangle size={15} className="text-orange-500" />,
    bg: "bg-orange-50",
  },
};

const FALLBACK_CONFIG = {
  icon: <Megaphone size={15} className="text-gray-500" />,
  bg: "bg-gray-50",
};

// ── Time helper ────────────────────────────────────────────────────────────
function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days = Math.floor(diff / 86_400_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

// ── Component ──────────────────────────────────────────────────────────────
export default function NotificationBell() {
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);

  // Guard: don't fire any requests until auth state is confirmed
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);

  // Stable string ID — prevents socket reconnect on user object ref changes
  const userId = useAppSelector((s) => {
    if (!s.auth.isAuthenticated) return "";
    const u = s.auth.user as any;
    return (u?._id ?? u?.id ?? "") as string;
  });

  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/payments/notifications");
      setNotifications(res.data.notifications ?? []);
      setUnreadCount(res.data.unreadCount ?? 0);
    } catch {
      // silently fail — bell is non-critical UI
    } finally {
      setLoading(false);
    }
  };

  // Socket-driven updates + 5-min fallback poll (was 2-min interval)
  // Socket handles instant pushes; poll catches cron-generated notifications
  // that fire while the socket may be briefly disconnected.
  useEffect(() => {
    if (!userId || !isAuthenticated) return;

    fetchNotifications();

    // Delay connecting so BackendWakeUp has time to warm Render before we attempt
    const connectDelay = setTimeout(() => {
      if (!userId) return; // user logged out before delay fired
      const sock = io(SOCKET_URL, {
        withCredentials: true,
        transports: ["polling", "websocket"],
        upgrade: true,
        reconnection: true,
        reconnectionAttempts: 6,
        reconnectionDelay: 3000,
        reconnectionDelayMax: 30000,
        timeout: 20000,
      });
      socketRef.current = sock;
      sock.on("connect", () => sock.emit("register_user", userId));
      sock.on("new_notification", fetchNotifications);
    }, 3000);

    // Fallback poll — catches cron notifications (expiry warnings etc.)
    const interval = setInterval(fetchNotifications, 5 * 60_000);

    return () => {
      clearTimeout(connectDelay);
      socketRef.current?.disconnect();
      socketRef.current = null;
      clearInterval(interval);
    };
  }, [userId]); // only re-run when user actually changes

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleOpen = async () => {
    setOpen((v) => !v);
    if (!open && unreadCount > 0) {
      // Optimistic clear
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      axiosInstance.patch("/payments/notifications/read").catch(() => {});
    }
  };

  const handleAction = (n: Notification) => {
    setOpen(false);
    if (n.actionUrl) router.push(n.actionUrl);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell button */}
      <button
        type="button"
        onClick={handleOpen}
        aria-label="Notifications"
        className="relative p-2 rounded-xl hover:bg-gray-100 transition"
      >
        <Bell size={20} className="text-gray-600" />
        {unreadCount > 0 && (
          <span
            className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px]
            bg-red-500 text-white text-[10px] font-bold rounded-full
            flex items-center justify-center px-1 leading-none"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl
          shadow-xl border border-gray-100 z-50 overflow-hidden"
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3
            border-b border-gray-100 bg-gray-50"
          >
            <div className="flex items-center gap-2">
              <Bell size={14} className="text-gray-500" />
              <p className="text-sm font-semibold text-gray-800">
                Notifications
              </p>
              {unreadCount > 0 && (
                <span
                  className="text-[10px] bg-amber-400 text-black font-bold
                  px-1.5 py-0.5 rounded-full"
                >
                  {unreadCount} new
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="w-6 h-6 flex items-center justify-center rounded-full
                hover:bg-gray-200 transition"
            >
              <X size={13} className="text-gray-500" />
            </button>
          </div>

          {/* List */}
          <div className="max-h-[400px] overflow-y-auto divide-y divide-gray-50">
            {loading && notifications.length === 0 && (
              <div className="p-6 text-center text-sm text-gray-400">
                <div
                  className="w-5 h-5 border-2 border-gray-200 border-t-gray-400
                  rounded-full animate-spin mx-auto mb-2"
                />
                Loading…
              </div>
            )}

            {!loading && notifications.length === 0 && (
              <div className="p-8 text-center">
                <BellOff size={32} className="text-gray-200 mx-auto mb-2" />
                <p className="text-sm text-gray-400">No notifications yet</p>
              </div>
            )}

            {notifications.map((n) => {
              const cfg = TYPE_CONFIG[n.type] ?? FALLBACK_CONFIG;
              return (
                <div
                  key={n._id}
                  onClick={() => handleAction(n)}
                  className={`flex gap-3 px-4 py-3 cursor-pointer transition
                    ${!n.isRead ? "bg-amber-50/60 hover:bg-amber-50" : "hover:bg-gray-50"}`}
                >
                  {/* Icon bubble */}
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center
                    flex-shrink-0 mt-0.5 ${cfg.bg}`}
                  >
                    {cfg.icon}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-gray-800 leading-snug">
                      {n.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed line-clamp-2">
                      {n.message}
                    </p>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="text-[11px] text-gray-400">
                        {timeAgo(n.createdAt)}
                      </span>
                      {n.actionLabel && (
                        <span
                          className="flex items-center gap-0.5 text-[11px]
                          text-amber-600 font-semibold hover:underline"
                        >
                          {n.actionLabel}
                          <ChevronRight size={10} />
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Unread dot */}
                  {!n.isRead && (
                    <span
                      className="w-2 h-2 rounded-full bg-amber-400
                      flex-shrink-0 mt-2"
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 text-center">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  router.push("/vendor/history");
                }}
                className="flex items-center gap-1 text-xs text-amber-600
                  font-semibold hover:underline mx-auto"
              >
                View purchase history <ChevronRight size={11} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
