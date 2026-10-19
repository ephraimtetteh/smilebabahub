"use client";

// src/app/bookings/complete/page.tsx
//
// Where Flutterwave sends a guest after paying for a stay.
// (The backend has always redirected here, but the page didn't exist, so
// every booking payment ended on a 404.)
//
// It doesn't trust ?status=successful in the URL — anyone can type that.
// It asks the server to verify with Flutterwave, then polls the booking a
// few times because the redirect usually beats the webhook.
//
// Mobile app users land here too (the app opens checkout in a browser);
// they get an "Open in the app" button.

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Clock, XCircle, Loader2, CalendarDays, Ban } from "lucide-react";
import axiosInstance from "@/src/lib/api/axios";

type State = "checking" | "paid" | "pending" | "cancelled" | "failed" | "refunded" | "signin";

const ATTEMPTS = 6;
const GAP_MS = 2000;

const COPY: Record<Exclude<State, "checking">, { title: string; desc: string; tone: string; icon: React.ReactNode }> = {
  paid: {
    title: "Your stay is booked",
    desc: "Payment received. We hold it safely until you check in, and the host has been asked to confirm.",
    tone: "bg-green-50",
    icon: <CheckCircle2 size={40} className="text-green-500" />,
  },
  pending: {
    title: "Still confirming your payment",
    desc: "Your bank hasn't confirmed yet. This usually takes a minute — we'll update your booking automatically. Please don't pay again.",
    tone: "bg-amber-50",
    icon: <Clock size={40} className="text-amber-500" />,
  },
  cancelled: {
    title: "Payment cancelled",
    desc: "No money was taken. Your dates are held for a few minutes if you want to try again.",
    tone: "bg-gray-50",
    icon: <Ban size={40} className="text-gray-500" />,
  },
  failed: {
    title: "Payment didn't go through",
    desc: "No booking was made. You can try again from the listing.",
    tone: "bg-red-50",
    icon: <XCircle size={40} className="text-red-500" />,
  },
  refunded: {
    title: "Those dates were just taken",
    desc: "Someone else completed their booking first. Your payment is being refunded in full.",
    tone: "bg-amber-50",
    icon: <XCircle size={40} className="text-amber-500" />,
  },
  signin: {
    title: "Sign in to see your booking",
    desc: "Your payment is safe. Sign in with the account you booked with to see the confirmation.",
    tone: "bg-gray-50",
    icon: <Clock size={40} className="text-gray-500" />,
  },
};

function BookingComplete() {
  const params = useSearchParams();
  const bookingId = params.get("bookingId");
  const txRef = params.get("tx_ref") ?? params.get("ref");
  const transactionId = params.get("transaction_id");
  const flwStatus = (params.get("status") ?? "").toLowerCase();

  const [state, setState] = useState<State>("checking");
  const [booking, setBooking] = useState<any>(null);
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    if (!bookingId && !txRef) {
      setState("failed");
      return;
    }
    if (flwStatus === "cancelled") {
      setState("cancelled");
      return;
    }

    let stopped = false;
    (async () => {
      for (let i = 0; i < ATTEMPTS && !stopped; i++) {
        try {
          const { data } = await axiosInstance.post("/bookings/verify", {
            bookingId: bookingId ?? undefined,
            txRef: txRef ?? undefined,
            transactionId: transactionId ?? undefined,
            // Same value under the name the pre-Phase-2 backend reads, so
            // this page works before and after the backend upgrade
            transaction_id: transactionId ?? undefined,
          });
          if (data?.booking) setBooking(data.booking);
          if (data?.status === "paid") return setState("paid");
          if (data?.status === "refunded") return setState("refunded");
          if (data?.status === "failed") return setState("failed");
          if (data?.status === "cancelled") return setState("cancelled");
        } catch (err: any) {
          if (err?.response?.status === 401) return setState("signin");
          if (err?.response?.status === 400) return setState("failed");
        }
        if (i < ATTEMPTS - 1) await new Promise((r) => setTimeout(r, GAP_MS));
      }
      if (!stopped) setState("pending");
    })();
    return () => {
      stopped = true;
    };
  }, [bookingId, txRef, transactionId, flwStatus]);

  const cfg = state === "checking" ? null : COPY[state];
  const id = booking?._id ?? bookingId;
  const sym = booking?.currency === "NGN" ? "₦" : "GH₵";
  const fmt = (d?: string) =>
    d ? new Date(d).toLocaleDateString("en-GH", { day: "numeric", month: "short", year: "numeric" }) : "";

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4 py-12">
      <div className="relative z-10 w-full max-w-md">
        {state === "checking" && (
          <div className="text-center">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-white/10">
              <Loader2 size={40} className="animate-spin text-yellow-400" />
            </div>
            <h1 className="mt-6 text-2xl font-black text-white">Confirming your booking</h1>
            <p className="mt-2 text-sm text-white/60">This takes a few seconds. Please don&apos;t close this page.</p>
          </div>
        )}

        {cfg && (
          <div className="overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className={`${cfg.tone} border-b border-gray-100 px-6 pb-6 pt-8 text-center`}>
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-md">
                {cfg.icon}
              </div>
              <h1 className="mb-2 text-xl font-black text-gray-900">{cfg.title}</h1>
              <p className="mx-auto max-w-sm text-sm leading-relaxed text-gray-500">{cfg.desc}</p>
            </div>

            <div className="space-y-4 p-6">
              {booking && (
                <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 text-sm">
                  <p className="font-bold text-gray-900">{booking.propertyName}</p>
                  <p className="mt-1 flex items-center gap-1.5 text-gray-500">
                    <CalendarDays size={14} /> {fmt(booking.checkIn)} → {fmt(booking.checkOut)} ·{" "}
                    {booking.nights} night{booking.nights === 1 ? "" : "s"}
                  </p>
                  <p className="mt-2 font-black text-gray-900">
                    {sym}
                    {Number(booking.totalPrice ?? 0).toLocaleString()}
                  </p>
                </div>
              )}

              {state === "signin" ? (
                <Link
                  href={`/auth/login?returnUrl=${encodeURIComponent(`/bookings/complete?${params.toString()}`)}`}
                  className="block w-full rounded-2xl bg-[#ffc105] py-3 text-center text-sm font-black text-black hover:bg-amber-400"
                >
                  Sign in
                </Link>
              ) : (
                <Link
                  href="/account/bookings"
                  className="block w-full rounded-2xl bg-[#ffc105] py-3 text-center text-sm font-black text-black hover:bg-amber-400"
                >
                  View my bookings
                </Link>
              )}

              {id && (
                <a
                  href={`smilebabahub://bookings/${id}`}
                  className="block w-full rounded-2xl border border-gray-200 py-3 text-center text-sm font-bold text-gray-700 hover:bg-gray-50"
                >
                  Booked in the app? Open it there
                </a>
              )}

              <p className="pt-1 text-center text-xs text-gray-400">
                Need help?{" "}
                <a href="mailto:support@smilebabahub.com" className="font-semibold text-yellow-600 hover:underline">
                  support@smilebabahub.com
                </a>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function BookingCompletePage() {
  return (
    <Suspense fallback={null}>
      <BookingComplete />
    </Suspense>
  );
}
