"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axiosInstance from "@/src/lib/api/axios";
import Link from "next/link";
import {
  ShoppingBag,
  Home,
  BedDouble,
  Building2,
  CalendarDays,
  Sparkles,
  MapPin,
  Package,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────
type OrderStatus = "pending" | "confirmed" | "delivered" | "cancelled";
type BookingStatus =
  | "pending"
  | "confirmed"
  | "checked_in"
  | "checked_out"
  | "cancelled";

type OrderItem = {
  name: string;
  qty: number;
  price: number;
};

type Order = {
  _id: string;
  items: OrderItem[];
  total: number;
  currency: string;
  status: OrderStatus;
  vendor: string;
  createdAt: string;
  deliveryAddress?: string;
};

type Booking = {
  _id: string;
  propertyName: string;
  propertyType: string; // "apartment" | "beach-house" | "villa" etc
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  currency: string;
  status: BookingStatus;
  vendor: string;
  createdAt: string;
};

// ── Helpers ────────────────────────────────────────────────────────────────
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GH", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function nights(checkIn: string, checkOut: string) {
  const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime();
  return Math.round(diff / (1000 * 60 * 60 * 24));
}

const ORDER_STATUS_STYLE: Record<OrderStatus, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  delivered: "bg-green-100 text-green-600",
  cancelled: "bg-red-100 text-red-500",
};

const BOOKING_STATUS_STYLE: Record<BookingStatus, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  checked_in: "bg-green-100 text-green-600",
  checked_out: "bg-gray-100 text-gray-500",
  cancelled: "bg-red-100 text-red-500",
};

const STATUS_LABEL: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  delivered: "Delivered",
  cancelled: "Cancelled",
  checked_in: "Checked in",
  checked_out: "Checked out",
};

const PROPERTY_ICON: Record<string, React.ReactNode> = {
  apartment: <Building2 size={18} className="text-blue-500" />,
  "beach-house": <Home size={18} className="text-teal-500" />,
  villa: <Home size={18} className="text-green-600" />,
  studio: <BedDouble size={18} className="text-indigo-500" />,
  duplex: <Building2 size={18} className="text-gray-500" />,
  townhouse: <Home size={18} className="text-amber-500" />,
  "luxury-apartment": <Sparkles size={18} className="text-yellow-500" />,
  default: <Home size={18} className="text-gray-400" />,
};

// ── Skeleton ──────────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-2xl p-4 sm:p-5 animate-pulse">
          <div className="flex gap-3">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-100 rounded w-1/2" />
              <div className="h-3 bg-gray-100 rounded w-1/3" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Empty state ────────────────────────────────────────────────────────────
function Empty({ tab }: { tab: string }) {
  return (
    <div className="bg-white rounded-2xl p-10 sm:p-16 text-center border border-gray-100 shadow-sm">
      {tab === "orders" ? (
        <ShoppingBag size={44} className="text-gray-200 mx-auto mb-3" />
      ) : (
        <Home size={44} className="text-gray-200 mx-auto mb-3" />
      )}
      <p className="text-gray-600 font-medium text-sm">
        No {tab === "orders" ? "orders" : "bookings"} yet
      </p>
      <p className="text-xs text-gray-400 mt-1 mb-6">
        {tab === "orders"
          ? "Browse food and marketplace listings to place your first order."
          : "Browse apartments and short stays to make a booking."}
      </p>
      <Link
        href={tab === "orders" ? "/marketPlace" : "/restate"}
        className="inline-block px-5 py-2.5 bg-yellow-400 text-black text-sm
          font-semibold rounded-xl hover:bg-yellow-300 transition"
      >
        {tab === "orders" ? "Browse marketplace →" : "Browse apartments →"}
      </Link>
    </div>
  );
}

// ── Order card ─────────────────────────────────────────────────────────────
function OrderCard({ order }: { order: Order }) {
  const [expanded, setExpanded] = useState(false);
  const sym = order.currency === "NGN" ? "₦" : "₵";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div
        className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5 cursor-pointer
          hover:bg-gray-50 transition"
        onClick={() => setExpanded(!expanded)}
      >
        {/* Icon */}
        <div
          className="w-11 h-11 rounded-xl bg-orange-50 border border-orange-100
          flex items-center justify-center flex-shrink-0"
        >
          <ShoppingBag size={18} className="text-orange-500" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-800 truncate">
            {order.items.length} item{order.items.length !== 1 ? "s" : ""}
            {" · "}
            <span className="text-gray-500 font-normal">{order.vendor}</span>
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            {formatDate(order.createdAt)}
          </p>
        </div>

        {/* Right */}
        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
          <p className="text-sm font-bold text-gray-800">
            {sym}
            {order.total.toLocaleString()}
          </p>
          <span
            className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full
            ${ORDER_STATUS_STYLE[order.status]}`}
          >
            {STATUS_LABEL[order.status]}
          </span>
        </div>
      </div>

      {/* Expanded items */}
      {expanded && (
        <div className="border-t border-gray-100 px-4 sm:px-5 py-3 bg-gray-50">
          <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
            Items
          </p>
          <div className="space-y-1.5">
            {order.items.map((item, i) => (
              <div
                key={i}
                className="flex justify-between text-xs text-gray-600"
              >
                <span>
                  {item.qty}× {item.name}
                </span>
                <span className="font-medium">
                  {sym}
                  {(item.price * item.qty).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
          {order.deliveryAddress && (
            <p className="text-xs text-gray-400 mt-3 pt-3 border-t border-gray-200"></p>
          )}
        </div>
      )}
    </div>
  );
}

// ── Booking card ───────────────────────────────────────────────────────────
function BookingCard({ booking }: { booking: Booking }) {
  const sym = booking.currency === "NGN" ? "₦" : "₵";
  const n = nights(booking.checkIn, booking.checkOut);
  const icon = PROPERTY_ICON[booking.propertyType] ?? PROPERTY_ICON.default;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5">
      <div className="flex items-start gap-3 sm:gap-4">
        {/* Icon */}
        <div
          className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100
          flex items-center justify-center flex-shrink-0 mt-0.5"
        >
          {icon}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-800 truncate">
            {booking.propertyName}
          </p>
          <p className="text-xs text-gray-500 mt-0.5 truncate">
            {booking.vendor}
          </p>
          <div className="flex flex-wrap gap-3 mt-2">
            <div className="text-xs text-gray-500">
              <span className="font-medium text-gray-700">Check-in</span>{" "}
              {formatDate(booking.checkIn)}
            </div>
            <div className="text-xs text-gray-500">
              <span className="font-medium text-gray-700">Check-out</span>{" "}
              {formatDate(booking.checkOut)}
            </div>
            <div className="text-xs text-gray-500">
              {n} night{n !== 1 ? "s" : ""} · {booking.guests} guest
              {booking.guests !== 1 ? "s" : ""}
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
          <p className="text-sm font-bold text-gray-800">
            {sym}
            {booking.totalPrice.toLocaleString()}
          </p>
          <span
            className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full
            ${BOOKING_STATUS_STYLE[booking.status]}`}
          >
            {STATUS_LABEL[booking.status]}
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────
export default function GuestHistoryPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const defaultTab =
    (searchParams.get("tab") as "orders" | "bookings") ?? "orders";
  const [tab, setTab] = useState<"orders" | "bookings">(defaultTab);
  const [orders, setOrders] = useState<Order[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      setError(null);
      try {
        const [ordersRes, bookingsRes] = await Promise.all([
          axiosInstance.get("/orders/my"),
          axiosInstance.get("/bookings/my"),
        ]);
        setOrders(ordersRes.data.orders ?? []);
        setBookings(bookingsRes.data.bookings ?? []);
      } catch {
        setError("Failed to load history. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const handleTabChange = (t: "orders" | "bookings") => {
    setTab(t);
    setStatusFilter("all");
    router.replace(`?tab=${t}`, { scroll: false });
  };

  const filteredOrders =
    statusFilter === "all"
      ? orders
      : orders.filter((o) => o.status === statusFilter);

  const filteredBookings =
    statusFilter === "all"
      ? bookings
      : bookings.filter((b) => b.status === statusFilter);

  const orderStatuses = [
    "all",
    "pending",
    "confirmed",
    "delivered",
    "cancelled",
  ];
  const bookingStatuses = [
    "all",
    "pending",
    "confirmed",
    "checked_in",
    "checked_out",
    "cancelled",
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            My activity
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Your orders and apartment bookings
          </p>
        </div>

        {/* Tab bar */}
        <div className="flex bg-white border border-gray-100 shadow-sm rounded-2xl p-1 mb-5">
          {(["orders", "bookings"] as const).map((t) => (
            <button
              key={t}
              onClick={() => handleTabChange(t)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl
                text-sm font-semibold transition
                ${
                  tab === t
                    ? "bg-yellow-400 text-black shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
            >
              {t === "orders" ? (
                <ShoppingBag size={14} className="flex-shrink-0" />
              ) : (
                <Home size={14} className="flex-shrink-0" />
              )}
              <span className="capitalize">{t}</span>
              {/* Count badge */}
              {!loading && (
                <span
                  className={`text-[11px] px-1.5 py-0.5 rounded-full font-bold
                  ${tab === t ? "bg-black/10 text-black" : "bg-gray-100 text-gray-500"}`}
                >
                  {t === "orders" ? orders.length : bookings.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Status filter pills */}
        {!loading && (tab === "orders" ? orders : bookings).length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-none">
            {(tab === "orders" ? orderStatuses : bookingStatuses).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold
                  transition capitalize
                  ${
                    statusFilter === s
                      ? "bg-gray-900 text-white"
                      : "bg-white border border-gray-200 text-gray-500 hover:border-gray-400"
                  }`}
              >
                {s === "all" ? "All" : (STATUS_LABEL[s] ?? s)}
              </button>
            ))}
          </div>
        )}

        {/* Content */}
        {loading && <Skeleton />}

        {error && !loading && (
          <div
            className="bg-red-50 border border-red-200 rounded-2xl p-5
            text-red-600 text-sm text-center"
          >
            {error}
          </div>
        )}

        {!loading &&
          !error &&
          tab === "orders" &&
          (filteredOrders.length === 0 ? (
            <Empty tab="orders" />
          ) : (
            <div className="space-y-3">
              {filteredOrders.map((o) => (
                <OrderCard key={o._id} order={o} />
              ))}
            </div>
          ))}

        {!loading &&
          !error &&
          tab === "bookings" &&
          (filteredBookings.length === 0 ? (
            <Empty tab="bookings" />
          ) : (
            <div className="space-y-3">
              {filteredBookings.map((b) => (
                <BookingCard key={b._id} booking={b} />
              ))}
            </div>
          ))}

        {/* Upgrade CTA for guests */}
        {!loading && (
          <div
            className="mt-8 bg-gradient-to-r from-yellow-400/10 to-yellow-400/5
            border border-yellow-400/20 rounded-2xl p-5 text-center"
          >
            <p className="text-sm font-semibold text-gray-700 mb-1">
              Want to sell on SmileBaba?
            </p>
            <p className="text-xs text-gray-500 mb-4">
              Subscribe to a vendor plan and start listing your products, food,
              or properties.
            </p>
            <Link
              href="/subscribe"
              className="inline-block px-5 py-2.5 bg-yellow-400 text-black text-xs
                font-bold rounded-xl hover:bg-yellow-300 transition"
            >
              Become a vendor →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
