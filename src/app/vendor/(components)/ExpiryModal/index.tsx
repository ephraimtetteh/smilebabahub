"use client";
// src/components/vendor/ExpiryModal.tsx
// Shows a modal to the vendor on every dashboard/vendor-page entry when they
// have expired or soon-to-expire ads.
//
// Logic:
//  - Fetches the vendor's own ads on mount
//  - Groups into: expired, expiring within 3 days
//  - Shows once per session (sessionStorage key) — doesn't re-show if dismissed
//    within the same browser session, but does show again on next login/visit
//
// Usage: mount in src/app/vendor/layout.tsx so it fires on every vendor page.

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { X, Clock, AlertTriangle, RefreshCw, ChevronRight } from "lucide-react";
import axiosInstance from "@/src/lib/api/axios";
import SafeImage from "@/src/components/SafeImage";

const SESSION_KEY = "smb_expiry_modal_dismissed";

interface AdSummary {
  _id: string;
  title: string;
  coverImage: string | null;
  expiresAt: string;
  daysLeft: number;
  isExpired: boolean;
}

// ── Single ad row inside the modal ─────────────────────────────────────────
function AdRow({ ad }: { ad: AdSummary }) {
  const expired = ad.isExpired;
  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
      <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
        <SafeImage
          src={ad.coverImage ?? ""}
          alt={ad.title}
          width={48}
          height={48}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-gray-800 truncate">{ad.title}</p>
        <p
          className={`text-xs mt-0.5 flex items-center gap-1
          ${expired ? "text-red-500" : "text-orange-500"}`}
        >
          <Clock size={10} />
          {expired
            ? `Expired ${Math.abs(ad.daysLeft)}d ago`
            : `Expires in ${ad.daysLeft} day${ad.daysLeft !== 1 ? "s" : ""}`}
        </p>
      </div>
      <Link
        href="/subscribe"
        onClick={(e) => e.stopPropagation()}
        className="flex items-center gap-1 text-[11px] font-bold text-white
          bg-[#ffc105] hover:bg-yellow-300 px-2.5 py-1.5 rounded-lg
          transition flex-shrink-0"
      >
        <RefreshCw size={10} /> Renew
      </Link>
    </div>
  );
}

// ── Main modal ─────────────────────────────────────────────────────────────
export default function ExpiryModal() {
  const [expired, setExpired] = useState<AdSummary[]>([]);
  const [expiring, setExpiring] = useState<AdSummary[]>([]);
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const dismiss = useCallback(() => {
    setOpen(false);
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {}
  }, []);

  useEffect(() => {
    // Don't show again in the same session
    try {
      if (sessionStorage.getItem(SESSION_KEY)) return;
    } catch {}

    axiosInstance
      .get("/ads/my", { params: { limit: 100 } })
      .then((res) => {
        const ads: AdSummary[] = (res.data.ads ?? []).map((a: any) => ({
          _id: a._id,
          title: a.title,
          coverImage: a.coverImage ?? null,
          expiresAt: a.expiresAt,
          daysLeft: a.daysLeft ?? 0,
          isExpired: a.isExpired ?? false,
        }));

        const exp = ads.filter((a) => a.isExpired);
        const soon = ads.filter(
          (a) => !a.isExpired && a.daysLeft !== null && a.daysLeft <= 3,
        );

        setExpired(exp);
        setExpiring(soon);
        setLoaded(true);

        if (exp.length > 0 || soon.length > 0) {
          // Small delay so it doesn't pop immediately on page load
          setTimeout(() => setOpen(true), 800);
        }
      })
      .catch(() => {});
  }, []);

  if (!open || !loaded) return null;

  const totalCount = expired.length + expiring.length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center
      justify-center p-4 bg-black/40 backdrop-blur-[2px]"
      onClick={dismiss}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-md shadow-2xl
          animate-in slide-in-from-bottom-4 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-start justify-between px-5 py-4
          border-b border-gray-100"
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-xl bg-orange-100 flex items-center
              justify-center flex-shrink-0"
            >
              <AlertTriangle size={18} className="text-orange-500" />
            </div>
            <div>
              <p className="font-black text-gray-900 text-sm">
                {expired.length > 0 && expiring.length > 0
                  ? "Expired & expiring listings"
                  : expired.length > 0
                    ? `${expired.length} expired listing${expired.length !== 1 ? "s" : ""}`
                    : `${expiring.length} listing${expiring.length !== 1 ? "s" : ""} expiring soon`}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {expired.length > 0
                  ? "Expired listings have low visibility — renew to restore full reach"
                  : "Act now to keep your listings visible to buyers"}
              </p>
            </div>
          </div>
          <button
            onClick={dismiss}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition flex-shrink-0 ml-2"
          >
            <X size={15} className="text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 max-h-[55vh] overflow-y-auto">
          {/* Expired section */}
          {expired.length > 0 && (
            <div className="pt-3">
              {expiring.length > 0 && (
                <p
                  className="text-[10px] font-bold text-red-500 uppercase
                  tracking-wider mb-1"
                >
                  Expired
                </p>
              )}
              {expired.slice(0, 5).map((ad) => (
                <AdRow key={ad._id} ad={ad} />
              ))}
              {expired.length > 5 && (
                <p className="text-xs text-gray-400 py-2 text-center">
                  +{expired.length - 5} more expired listings
                </p>
              )}
            </div>
          )}

          {/* Expiring soon section */}
          {expiring.length > 0 && (
            <div className={expired.length > 0 ? "pt-3" : "pt-3"}>
              {expired.length > 0 && (
                <p
                  className="text-[10px] font-bold text-orange-500 uppercase
                  tracking-wider mb-1"
                >
                  Expiring soon
                </p>
              )}
              {expiring.slice(0, 5).map((ad) => (
                <AdRow key={ad._id} ad={ad} />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="px-5 py-4 border-t border-gray-100 flex items-center
          justify-between gap-3"
        >
          <button
            onClick={dismiss}
            className="text-sm text-gray-400 hover:text-gray-600 font-medium transition"
          >
            Dismiss
          </button>
          <div className="flex items-center gap-2">
            <Link
              href="/ads/my?status=expired"
              onClick={dismiss}
              className="flex items-center gap-1.5 text-xs font-bold text-gray-600
                bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-xl transition"
            >
              View all <ChevronRight size={13} />
            </Link>
            <Link
              href="/subscribe"
              onClick={dismiss}
              className="flex items-center gap-1.5 text-xs font-bold text-black
                bg-[#ffc105] hover:bg-yellow-300 px-4 py-2 rounded-xl transition"
            >
              Upgrade plan
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
