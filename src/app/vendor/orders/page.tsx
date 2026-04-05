"use client";
// src/app/vendor/orders/page.tsx
// Shows all orders AND bookings received by the vendor — unified view.

import { useEffect, useState, useCallback } from "react";
import axiosInstance from "@/src/lib/api/axios";
import { useViewCountry } from "@/src/hooks/useViewCountry";
import {
  ShoppingBag,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  RefreshCw,
  ChevronDown,
  Package,
  Home,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────
type OrderStatus = "pending" | "confirmed" | "delivered" | "cancelled";
type BookingStatus =
  | "pending"
  | "confirmed"
  | "checked_in"
  | "checked_out"
  | "cancelled";

type Order = {
  _id: string;
  items: { name: string; qty: number; price: number }[];
  total: number;
  currency: string;
  status: OrderStatus;
  buyer: string;
  deliveryAddress: string;
  createdAt: string;
};

type Booking = {
  _id: string;
  propertyName: string;
  propertyType: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  currency: string;
  status: BookingStatus;
  guest: string;
  createdAt: string;
};

type Tab = "orders" | "bookings";

// ── Helpers ────────────────────────────────────────────────────────────────
function fmt(amount: number, currency: string) {
  const sym = currency === "NGN" ? "₦" : "₵";
  return `${sym}${Number(amount).toLocaleString()}`;
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GH", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const ORDER_STATUS: Record<OrderStatus, { label: string; color: string }> = {
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-700" },
  confirmed: { label: "Confirmed", color: "bg-blue-100 text-blue-700" },
  delivered: { label: "Delivered", color: "bg-green-100 text-green-700" },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-600" },
};

const BOOKING_STATUS: Record<BookingStatus, { label: string; color: string }> =
  {
    pending: { label: "Pending", color: "bg-yellow-100 text-yellow-700" },
    confirmed: { label: "Confirmed", color: "bg-blue-100 text-blue-700" },
    checked_in: { label: "Checked in", color: "bg-purple-100 text-purple-700" },
    checked_out: { label: "Checked out", color: "bg-green-100 text-green-700" },
    cancelled: { label: "Cancelled", color: "bg-red-100 text-red-600" },
  };

// ── Status updater ─────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const cfg = ORDER_STATUS[status as OrderStatus] ||
    BOOKING_STATUS[status as BookingStatus] || {
      label: status,
      color: "bg-gray-100 text-gray-600",
    };
  return (
    <span
      className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${cfg.color}`}
    >
      {cfg.label}
    </span>
  );
}

// ── Order card ─────────────────────────────────────────────────────────────
function OrderCard({
  order,
  onUpdateStatus,
}: {
  order: Order;
  onUpdateStatus: (id: string, status: OrderStatus) => void;
}) {
  const [open, setOpen] = useState(false);

  const nextStatuses: OrderStatus[] =
    order.status === "pending"
      ? ["confirmed", "cancelled"]
      : order.status === "confirmed"
        ? ["delivered", "cancelled"]
        : [];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="p-4 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div
            className="w-9 h-9 rounded-xl bg-orange-50 flex items-center
            justify-center flex-shrink-0"
          >
            <Package size={16} className="text-orange-500" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">
              {order.items.map((i) => i.name).join(", ")}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              {fmtDate(order.createdAt)} ·{" "}
              {order.deliveryAddress || "No address"}
            </p>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-sm font-black text-gray-900">
            {fmt(order.total, order.currency)}
          </p>
          <StatusBadge status={order.status} />
        </div>
      </div>

      {/* Items detail */}
      <div className="px-4 pb-3 border-t border-gray-50 pt-3">
        {order.items.map((item, i) => (
          <div
            key={i}
            className="flex justify-between text-xs text-gray-500 py-0.5"
          >
            <span>
              {item.name} × {item.qty}
            </span>
            <span>{fmt(item.price, order.currency)}</span>
          </div>
        ))}
      </div>

      {/* Action buttons */}
      {nextStatuses.length > 0 && (
        <div className="px-4 pb-4 flex gap-2">
          {nextStatuses.map((s) => (
            <button
              key={s}
              onClick={() => onUpdateStatus(order._id, s)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition
                ${
                  s === "cancelled"
                    ? "bg-red-50 text-red-600 hover:bg-red-100"
                    : "bg-[#ffc105] text-black hover:bg-yellow-300"
                }`}
            >
              Mark {ORDER_STATUS[s].label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Booking card ───────────────────────────────────────────────────────────
function BookingCard({
  booking,
  onUpdateStatus,
}: {
  booking: Booking;
  onUpdateStatus: (id: string, status: BookingStatus) => void;
}) {
  const nights = Math.ceil(
    (new Date(booking.checkOut).getTime() -
      new Date(booking.checkIn).getTime()) /
      86400000,
  );

  const nextStatuses: BookingStatus[] =
    booking.status === "pending"
      ? ["confirmed", "cancelled"]
      : booking.status === "confirmed"
        ? ["checked_in", "cancelled"]
        : booking.status === "checked_in"
          ? ["checked_out"]
          : [];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="p-4 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div
            className="w-9 h-9 rounded-xl bg-teal-50 flex items-center
            justify-center flex-shrink-0"
          >
            <Home size={16} className="text-teal-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">
              {booking.propertyName}
            </p>
            <p className="text-xs text-gray-400 capitalize mt-0.5">
              {booking.propertyType} · {booking.guests} guest
              {booking.guests !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-sm font-black text-gray-900">
            {fmt(booking.totalPrice, booking.currency)}
          </p>
          <StatusBadge status={booking.status} />
        </div>
      </div>

      <div className="px-4 pb-3 border-t border-gray-50 pt-3 flex gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <Calendar size={11} />
          <span>{fmtDate(booking.checkIn)}</span>
        </div>
        <span>→</span>
        <div className="flex items-center gap-1">
          <Calendar size={11} />
          <span>{fmtDate(booking.checkOut)}</span>
        </div>
        <span className="ml-auto font-medium text-gray-700">
          {nights} night{nights !== 1 ? "s" : ""}
        </span>
      </div>

      {nextStatuses.length > 0 && (
        <div className="px-4 pb-4 flex gap-2">
          {nextStatuses.map((s) => (
            <button
              key={s}
              onClick={() => onUpdateStatus(booking._id, s)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition
                ${
                  s === "cancelled"
                    ? "bg-red-50 text-red-600 hover:bg-red-100"
                    : "bg-[#ffc105] text-black hover:bg-yellow-300"
                }`}
            >
              {BOOKING_STATUS[s].label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────
export default function VendorOrdersPage() {
  const { sym } = useViewCountry();
  const [tab, setTab] = useState<Tab>("orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [oRes, bRes] = await Promise.all([
        axiosInstance.get("/orders/vendor"),
        axiosInstance.get("/bookings/vendor"),
      ]);
      setOrders(oRes.data.orders ?? []);
      setBookings(bRes.data.bookings ?? []);
    } catch {
      // silently fail — show empty state
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const updateOrderStatus = async (id: string, status: OrderStatus) => {
    await axiosInstance.patch(`/orders/${id}/status`, { status });
    setOrders((prev) => prev.map((o) => (o._id === id ? { ...o, status } : o)));
  };

  const updateBookingStatus = async (id: string, status: BookingStatus) => {
    await axiosInstance.patch(`/bookings/${id}/status`, { status });
    setBookings((prev) =>
      prev.map((b) => (b._id === id ? { ...b, status } : b)),
    );
  };

  const filteredOrders =
    filter === "all" ? orders : orders.filter((o) => o.status === filter);
  const filteredBookings =
    filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const pendingBookings = bookings.filter((b) => b.status === "pending").length;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-gray-900">
            Orders & Bookings
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Manage what customers have requested
          </p>
        </div>
        <button
          onClick={load}
          className="p-2 hover:bg-gray-100 rounded-xl transition"
        >
          <RefreshCw size={16} className="text-gray-400" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {(["orders", "bookings"] as Tab[]).map((t) => {
          const count = t === "orders" ? pendingOrders : pendingBookings;
          return (
            <button
              key={t}
              onClick={() => {
                setTab(t);
                setFilter("all");
              }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition
                flex items-center justify-center gap-2
                ${
                  tab === t
                    ? "bg-[#ffc105] text-black"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
            >
              {t === "orders" ? <ShoppingBag size={15} /> : <Home size={15} />}
              {t === "orders" ? "Orders" : "Bookings"}
              {count > 0 && (
                <span
                  className={`text-[10px] font-black px-1.5 py-0.5 rounded-full
                  ${tab === t ? "bg-black/20 text-black" : "bg-red-100 text-red-600"}`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Filter strip */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {(tab === "orders"
          ? ["all", "pending", "confirmed", "delivered", "cancelled"]
          : [
              "all",
              "pending",
              "confirmed",
              "checked_in",
              "checked_out",
              "cancelled",
            ]
        ).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold
              transition capitalize
              ${
                filter === f
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
          >
            {f === "all" ? "All" : f.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-gray-100 rounded-2xl h-24 animate-pulse"
            />
          ))}
        </div>
      ) : tab === "orders" ? (
        filteredOrders.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <ShoppingBag size={40} className="mx-auto mb-3 opacity-20" />
            <p className="text-sm font-medium">No orders yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredOrders.map((o) => (
              <OrderCard
                key={o._id}
                order={o}
                onUpdateStatus={updateOrderStatus}
              />
            ))}
          </div>
        )
      ) : filteredBookings.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Home size={40} className="mx-auto mb-3 opacity-20" />
          <p className="text-sm font-medium">No bookings yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredBookings.map((b) => (
            <BookingCard
              key={b._id}
              booking={b}
              onUpdateStatus={updateBookingStatus}
            />
          ))}
        </div>
      )}
    </div>
  );
}
