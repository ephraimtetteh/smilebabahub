"use client";
// src/components/VendorComponents/VendorProductCard.tsx
import { memo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";
import {
  Eye,
  Pencil,
  Trash2,
  Pause,
  Play,
  CheckCircle2,
  Zap,
  TrendingUp,
  Clock,
  XCircle,
  AlertCircle,
  ImageOff,
} from "lucide-react";
import { Ad, BoostTier } from "@/src/types/ad.types";
import { formatAdPrice } from "@/src/app/ads/(components)/ad.constants";
import { BoostModal } from "@/src/app/ads/(components)/AdModals";

function getStatus(ad: Ad): {
  label: string;
  cls: string;
  icon: React.ReactNode;
} {
  if (ad.isSold)
    return {
      label: "Sold",
      cls: "bg-green-100 text-green-700",
      icon: <CheckCircle2 size={11} />,
    };
  if (ad.isPaused)
    return {
      label: "Paused",
      cls: "bg-gray-100 text-gray-500",
      icon: <Pause size={11} />,
    };
  if ((ad as any).isExpired)
    return {
      label: "Expired",
      cls: "bg-red-100 text-red-500",
      icon: <XCircle size={11} />,
    };
  if (ad.moderation?.status === "rejected")
    return {
      label: "Rejected",
      cls: "bg-red-100 text-red-600",
      icon: <AlertCircle size={11} />,
    };
  if (ad.moderation?.status === "pending")
    return {
      label: "In Review",
      cls: "bg-yellow-100 text-yellow-700",
      icon: <Clock size={11} />,
    };
  if (ad.isActive)
    return {
      label: "Active",
      cls: "bg-blue-100 text-blue-700",
      icon: <TrendingUp size={11} />,
    };
  return {
    label: "Inactive",
    cls: "bg-gray-100 text-gray-400",
    icon: <AlertCircle size={11} />,
  };
}

interface VendorProductCardProps {
  ad: Ad;
  mutating: boolean;
  onBoost: (tier: BoostTier) => void;
  onPause: () => void;
  onMarkSold: () => void;
  onDelete: () => void;
}

const VendorProductCard = memo(function VendorProductCard({
  ad,
  mutating,
  onBoost,
  onPause,
  onMarkSold,
  onDelete,
}: VendorProductCardProps) {
  const [boostOpen, setBoostOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const status = getStatus(ad);
  const coverImg = ad.coverImage ?? ad.images?.[0]?.url ?? "";

  return (
    <>
      <div
        className="bg-white rounded-2xl border border-gray-100 shadow-sm
        overflow-hidden hover:shadow-md transition-shadow group"
      >
        {/* Image */}
        <div className="relative w-full h-44 bg-gray-100 overflow-hidden">
          {coverImg ? (
            <Image
              src={coverImg}
              alt={ad.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageOff size={32} className="text-gray-200" />
            </div>
          )}
          <span
            className={`absolute top-2 left-2 flex items-center gap-1
            text-[11px] font-bold px-2.5 py-0.5 rounded-full ${status.cls}`}
          >
            {status.icon} {status.label}
          </span>
          {ad.boost?.isBoosted && (
            <span
              className="absolute top-2 right-2 flex items-center gap-1
              text-[10px] font-bold bg-yellow-400 text-black px-2 py-0.5 rounded-full"
            >
              <Zap size={9} /> Boosted
            </span>
          )}
          {ad.isSold && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-black text-lg tracking-widest">
                SOLD
              </span>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 text-sm line-clamp-1 mb-0.5">
            {ad.title}
          </h3>
          <p className="text-base font-black text-gray-900 mb-1">
            {formatAdPrice(
              ad.price?.amount,
              ad.price?.currency,
              ad.price?.display,
            )}
          </p>
          <div className="flex items-center gap-3 text-[11px] text-gray-400 mb-4">
            <span className="flex items-center gap-1">
              <Eye size={11} /> {ad.views ?? 0}
            </span>
            <span className="flex items-center gap-1">
              <Eye size={11} className="opacity-0" />
              {ad.contactClicks ?? 0} contacts
            </span>
            {ad.location?.city && <span>{ad.location.city}</span>}
          </div>

          <div className="grid grid-cols-2 gap-2">
            {!ad.isSold && (
              <button
                onClick={() => setBoostOpen(true)}
                className="flex items-center justify-center gap-1.5 py-2 bg-[#ffc105]
                  text-black text-xs font-bold rounded-xl hover:bg-amber-400
                  transition active:scale-95"
              >
                <Zap size={12} /> Boost
              </button>
            )}
            <Link
              href={`/ads/${ad._id}/edit`}
              className="flex items-center justify-center gap-1.5 py-2 bg-gray-100
                text-gray-700 text-xs font-semibold rounded-xl hover:bg-gray-200 transition"
            >
              <Pencil size={12} /> Edit
            </Link>
            {!ad.isSold && (
              <button
                onClick={onPause}
                disabled={mutating}
                className="flex items-center justify-center gap-1.5 py-2 bg-gray-100
                  text-gray-700 text-xs font-semibold rounded-xl hover:bg-gray-200
                  transition disabled:opacity-50"
              >
                {ad.isPaused ? (
                  <>
                    <Play size={12} /> Resume
                  </>
                ) : (
                  <>
                    <Pause size={12} /> Pause
                  </>
                )}
              </button>
            )}
            {!ad.isSold && (
              <button
                onClick={onMarkSold}
                disabled={mutating}
                className="flex items-center justify-center gap-1.5 py-2 bg-green-50
                  text-green-700 text-xs font-semibold rounded-xl hover:bg-green-100
                  transition disabled:opacity-50"
              >
                <CheckCircle2 size={12} /> Sold
              </button>
            )}
            <Link
              href={`/product/${ad._id}`}
              className="flex items-center justify-center gap-1.5 py-2 bg-blue-50
                text-blue-700 text-xs font-semibold rounded-xl hover:bg-blue-100 transition"
            >
              <Eye size={12} /> View
            </Link>
            <button
              onClick={() => setConfirmDelete(true)}
              className="flex items-center justify-center gap-1.5 py-2 bg-red-50
                text-red-500 text-xs font-semibold rounded-xl hover:bg-red-100 transition"
            >
              <Trash2 size={12} /> Delete
            </button>
          </div>
        </div>
      </div>

      {boostOpen && (
        <BoostModal
          adId={ad._id}
          mutating={mutating}
          onBoost={(tier) => {
            onBoost(tier);
            setBoostOpen(false);
          }}
          onClose={() => setBoostOpen(false)}
        />
      )}

      {confirmDelete && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm text-center">
            <div
              className="w-14 h-14 bg-red-50 rounded-2xl flex items-center
              justify-center mx-auto mb-3"
            >
              <Trash2 size={26} className="text-red-500" />
            </div>
            <p className="text-lg font-black text-gray-900 mb-2">
              Delete this ad?
            </p>
            <p className="text-sm text-gray-500 mb-6 line-clamp-2">
              {ad.title}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(false)}
                className="flex-1 py-3 bg-gray-100 text-gray-700 font-semibold
                  rounded-2xl text-sm hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDelete();
                  setConfirmDelete(false);
                }}
                disabled={mutating}
                className="flex-1 py-3 bg-red-500 text-white font-bold
                  rounded-2xl text-sm disabled:opacity-50"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
});

export default VendorProductCard;
