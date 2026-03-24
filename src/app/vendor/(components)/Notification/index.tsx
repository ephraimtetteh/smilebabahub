"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

type NotificationType =
  | "subscription_expiring_7"
  | "subscription_expiring_3"
  | "subscription_expiring_1"
  | "subscription_expired"
  | "subscription_activated"
  | "payment_failed"
  | "boost_approved";

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

const TYPE_ICON: Record<NotificationType, string> = {
  subscription_expiring_7: "📅",
  subscription_expiring_3: "⚠️",
  subscription_expiring_1: "🚨",
  subscription_expired: "⛔",
  subscription_activated: "🎉",
  payment_failed: "❌",
  boost_approved: "🚀",
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export default function NotificationBell() {
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/payments/notifications", {
        withCredentials: true,
      });
      setNotifications(res.data.notifications);
      setUnreadCount(res.data.unreadCount);
    } catch {
      // silently fail — bell is non-critical UI
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll every 2 minutes for new notifications
    const interval = setInterval(fetchNotifications, 120_000);
    return () => clearInterval(interval);
  }, []);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleOpen = async () => {
    setOpen((v) => !v);
    if (!open && unreadCount > 0) {
      // Optimistic clear
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      await axios.patch(
        "/api/payments/notifications/read",
        {},
        { withCredentials: true },
      );
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
        className="relative p-2 rounded-xl hover:bg-gray-100 transition"
        aria-label="Notifications"
      >
        <span className="text-xl">🔔</span>
        {unreadCount > 0 && (
          <span
            className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500
            text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl
          border border-gray-100 z-50 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
            <p className="text-sm font-semibold text-gray-800">Notifications</p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-gray-400 hover:text-gray-600 text-sm"
            >
              ✕
            </button>
          </div>

          {/* List */}
          <div className="max-h-[400px] overflow-y-auto divide-y divide-gray-50">
            {loading && notifications.length === 0 && (
              <div className="p-6 text-center text-sm text-gray-400">
                Loading…
              </div>
            )}

            {!loading && notifications.length === 0 && (
              <div className="p-8 text-center">
                <p className="text-2xl mb-2">🔕</p>
                <p className="text-sm text-gray-400">No notifications yet</p>
              </div>
            )}

            {notifications.map((n) => (
              <div
                key={n._id}
                className={`flex gap-3 px-4 py-3 transition cursor-pointer
                  ${!n.isRead ? "bg-amber-50/60 hover:bg-amber-50" : "hover:bg-gray-50"}`}
                onClick={() => handleAction(n)}
              >
                <span className="text-xl flex-shrink-0 mt-0.5">
                  {TYPE_ICON[n.type] ?? "📢"}
                </span>
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
                      <span className="text-[11px] text-amber-600 font-semibold hover:underline">
                        {n.actionLabel} →
                      </span>
                    )}
                  </div>
                </div>
                {!n.isRead && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0 mt-1.5" />
                )}
              </div>
            ))}
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
                className="text-xs text-amber-600 font-semibold hover:underline"
              >
                View purchase history
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
