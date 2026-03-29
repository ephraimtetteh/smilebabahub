"use client";

// app/account/bookings/page.tsx
// Route: /account/bookings

import { useEffect, useState } from "react";
import axiosInstance from "@/src/lib/api/axios";
import {
  Booking,
  BOOKING_STATUSES,
  formatDate,
  nights,
  currencySymbol,
} from "@/src/app/account/types";
import BookingCard from "@/src/app/account/BookingCard";
import {
  Skeleton,
  Empty,
  StatusPills,
  ErrorBanner,
  UpgradeCTA,
  PageShell,
} from "@/src/app/account/components";

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    axiosInstance
      .get("/bookings/my")
      .then((res) => setBookings(res.data.bookings ?? []))
      .catch(() => setError("Failed to load bookings. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  // Upcoming = check-in is in the future
  const upcoming = bookings.filter(
    (b) => new Date(b.checkIn) > new Date() && b.status !== "cancelled",
  );

  // Total nights stayed across all completed bookings
  const totalNights = bookings
    .filter((b) => b.status === "checked_out")
    .reduce((acc, b) => acc + nights(b.checkIn, b.checkOut), 0);

  // Next upcoming booking
  const nextBooking = upcoming.sort(
    (a, b) => new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime(),
  )[0];

  return (
    <PageShell
      title="My bookings"
      subtitle="Apartments and short stays you've booked"
      backHref="/"
      backLabel="← Back to SmileBaba"
    >
      {/* Next stay highlight */}
      {!loading && nextBooking && (
        <div
          className="bg-gradient-to-r from-blue-500/10 to-blue-400/5
          border border-blue-200/40 rounded-2xl p-4 sm:p-5 mb-5 flex items-center gap-4"
        >
          <div className="text-3xl flex-shrink-0">🏡</div>
          <div className="min-w-0">
            <p className="text-[11px] font-bold text-blue-500 uppercase tracking-wider mb-0.5">
              Next stay
            </p>
            <p className="text-sm font-semibold text-gray-800 truncate">
              {nextBooking.propertyName}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              Check-in {formatDate(nextBooking.checkIn)} ·{" "}
              {nights(nextBooking.checkIn, nextBooking.checkOut)} nights
            </p>
          </div>
          <div className="ml-auto flex-shrink-0 text-right">
            <p className="text-xs font-bold text-gray-700">
              {currencySymbol(nextBooking.currency)}
              {nextBooking.totalPrice.toLocaleString()}
            </p>
            <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">
              Confirmed
            </span>
          </div>
        </div>
      )}

      {/* Summary strip */}
      {!loading && bookings.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label: "Total bookings", value: bookings.length },
            { label: "Upcoming", value: upcoming.length },
            { label: "Nights stayed", value: totalNights },
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
      {!loading && bookings.length > 0 && (
        <StatusPills
          statuses={BOOKING_STATUSES}
          active={filter}
          onChange={setFilter}
        />
      )}

      {/* Content */}
      {loading && <Skeleton />}
      {!loading && error && <ErrorBanner message={error} />}
      {!loading && !error && bookings.length === 0 && <Empty type="bookings" />}
      {!loading && !error && filtered.length === 0 && bookings.length > 0 && (
        <div className="bg-white rounded-2xl p-8 text-center border border-gray-100 shadow-sm">
          <p className="text-gray-400 text-sm">
            No bookings match the selected filter.
          </p>
        </div>
      )}
      {!loading && !error && filtered.length > 0 && (
        <div className="space-y-3">
          {filtered.map((b) => (
            <BookingCard key={b._id} booking={b} />
          ))}
        </div>
      )}

      <UpgradeCTA />
    </PageShell>
  );
}
