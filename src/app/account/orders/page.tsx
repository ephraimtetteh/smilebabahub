"use client";

// app/account/orders/page.tsx
// Route: /account/orders

import { useEffect, useState } from "react";
import axiosInstance from "@/src/lib/api/axios";
import { Order, ORDER_STATUSES } from "@/src/app/account/types";
import OrderCard from "@/src/app/account/OrderCard";
import {
  Skeleton,
  Empty,
  StatusPills,
  ErrorBanner,
  UpgradeCTA,
  PageShell,
} from "@/src/app/account/components";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    axiosInstance
      .get("/orders/my")
      .then((res) => setOrders(res.data.orders ?? []))
      .catch(() => setError("Failed to load orders. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    filter === "all" ? orders : orders.filter((o) => o.status === filter);

  return (
    <PageShell
      title="My orders"
      subtitle="All your marketplace and food orders"
      backHref="/"
      backLabel="← Back to SmileBaba"
    >
      {/* Summary strip */}
      {!loading && orders.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label: "Total orders", value: orders.length },
            {
              label: "Delivered",
              value: orders.filter((o) => o.status === "delivered").length,
            },
            {
              label: "In progress",
              value: orders.filter((o) =>
                ["pending", "confirmed"].includes(o.status),
              ).length,
            },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-white border border-gray-100 shadow-sm rounded-2xl p-3 text-center"
            >
              <p className="text-lg font-bold text-gray-900">{s.value}</p>
              <p className="text-[11px] text-gray-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Status filters */}
      {!loading && orders.length > 0 && (
        <StatusPills
          statuses={ORDER_STATUSES}
          active={filter}
          onChange={setFilter}
        />
      )}

      {/* Content */}
      {loading && <Skeleton />}
      {!loading && error && <ErrorBanner message={error} />}
      {!loading && !error && filtered.length === 0 && orders.length === 0 && (
        <Empty type="orders" />
      )}
      {!loading && !error && filtered.length === 0 && orders.length > 0 && (
        <div className="bg-white rounded-2xl p-8 text-center border border-gray-100 shadow-sm">
          <p className="text-gray-400 text-sm">
            No orders match the selected filter.
          </p>
        </div>
      )}
      {!loading && !error && filtered.length > 0 && (
        <div className="space-y-3">
          {filtered.map((o) => (
            <OrderCard key={o._id} order={o} />
          ))}
        </div>
      )}

      <UpgradeCTA />
    </PageShell>
  );
}
