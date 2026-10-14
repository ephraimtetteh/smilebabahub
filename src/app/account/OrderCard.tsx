"use client";

// account/OrderCard.tsx

import { useState } from "react";
import {
  Order,
  ORDER_STATUS_STYLE,
  STATUS_LABEL,
  formatDate,
  currencySymbol,
} from "./types";

export default function OrderCard({ order }: { order: Order }) {
  const [expanded, setExpanded] = useState(false);
  const sym = currencySymbol(order.currency);

  return (
    <div
      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden
      hover:shadow-md transition-shadow"
    >
      {/* ── Header row — click to expand ── */}
      <div
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5 cursor-pointer
          hover:bg-gray-50/70 transition select-none"
      >
        {/* Icon */}
        <div
          className="w-11 h-11 rounded-xl bg-orange-50 border border-orange-100
          flex items-center justify-center text-xl flex-shrink-0"
        >
          🛍️
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-800 truncate">
            {order.items.length} item{order.items.length !== 1 ? "s" : ""}
            <span className="text-gray-400 font-normal mx-1">·</span>
            <span className="text-gray-500 font-normal">{order.vendor}</span>
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            {formatDate(order.createdAt)}
          </p>
        </div>

        {/* Right: price + status + chevron */}
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

        <span
          className={`text-gray-400 text-xs ml-1 transition-transform duration-200
          flex-shrink-0 ${expanded ? "rotate-180" : ""}`}
        >
          ▾
        </span>
      </div>

      {/* ── Expanded items list ── */}
      {expanded && (
        <div className="border-t border-gray-100 px-4 sm:px-5 py-4 bg-gray-50/50">
          <p className="text-[11px] font-bold text-gray-400 mb-3 uppercase tracking-wider">
            Order items
          </p>
          <div className="space-y-2">
            {order.items.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-3 text-xs text-gray-600"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-5 h-5 rounded-md bg-gray-200 text-gray-500 text-[10px]
                    font-bold flex items-center justify-center flex-shrink-0"
                  >
                    {item.qty}
                  </span>
                  <span className="truncate">{item.name}</span>
                </div>
                <span className="font-semibold text-gray-700 flex-shrink-0">
                  {sym}
                  {(item.price * item.qty).toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          {/* Totals row */}
          <div
            className="flex justify-between items-center mt-3 pt-3
            border-t border-gray-200 text-xs"
          >
            <span className="text-gray-500">Total</span>
            <span className="font-bold text-gray-800 text-sm">
              {sym}
              {order.total.toLocaleString()}
            </span>
          </div>

          {/* Delivery address */}
          {order.deliveryAddress && (
            <div className="flex items-start gap-1.5 mt-3 pt-3 border-t border-gray-200">
              <span className="text-sm flex-shrink-0">📍</span>
              <p className="text-xs text-gray-400 leading-relaxed">
                {order.deliveryAddress}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
