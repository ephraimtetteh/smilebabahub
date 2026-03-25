"use client";

// account/BookingCard.tsx

import {
  Booking,
  BOOKING_STATUS_STYLE,
  STATUS_LABEL,
  PROPERTY_ICON,
  formatDate,
  nights,
  currencySymbol,
} from "./types";

export default function BookingCard({ booking }: { booking: Booking }) {
  const sym = currencySymbol(booking.currency);
  const n = nights(booking.checkIn, booking.checkOut);
  const icon = PROPERTY_ICON[booking.propertyType] ?? PROPERTY_ICON.default;
  const pricePerNight =
    n > 0 ? Math.round(booking.totalPrice / n) : booking.totalPrice;

  return (
    <div
      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5
      hover:shadow-md transition-shadow mt-20"
    >
      <div className="flex items-start gap-3 sm:gap-4">
        {/* Icon */}
        <div
          className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100
          flex items-center justify-center text-xl flex-shrink-0 mt-0.5"
        >
          {icon}
        </div>

        {/* Main info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-800 truncate">
            {booking.propertyName}
          </p>
          <p className="text-xs text-gray-500 mt-0.5 truncate">
            {booking.vendor}
          </p>

          {/* Date chips */}
          <div className="flex flex-wrap gap-2 mt-2.5">
            <div
              className="flex items-center gap-1 bg-gray-50 border border-gray-100
              rounded-lg px-2 py-1"
            >
              <span className="text-[10px] font-semibold text-gray-400 uppercase">
                In
              </span>
              <span className="text-xs text-gray-700 font-medium">
                {formatDate(booking.checkIn)}
              </span>
            </div>
            <div
              className="flex items-center gap-1 bg-gray-50 border border-gray-100
              rounded-lg px-2 py-1"
            >
              <span className="text-[10px] font-semibold text-gray-400 uppercase">
                Out
              </span>
              <span className="text-xs text-gray-700 font-medium">
                {formatDate(booking.checkOut)}
              </span>
            </div>
          </div>

          {/* Meta row */}
          <div className="flex flex-wrap gap-3 mt-2">
            <span className="text-xs text-gray-500">
              🌙 {n} night{n !== 1 ? "s" : ""}
            </span>
            <span className="text-xs text-gray-500">
              👥 {booking.guests} guest{booking.guests !== 1 ? "s" : ""}
            </span>
            <span className="text-xs text-gray-500">
              {sym}
              {pricePerNight.toLocaleString()}/night
            </span>
          </div>
        </div>

        {/* Right: total + status */}
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
