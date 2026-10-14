// frontend/app/admin/promotions/[id]/page.tsx
//
// Admin single-promotion view. Shows full payment + user + listing detail,
// timeline of status changes, and inline action buttons.

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  X,
  Clock,
  DollarSign,
  ExternalLink,
  Loader2,
  MapPin,
  Mail,
  Phone,
  Calendar,
  Hash,
} from "lucide-react";
import axiosInstance from "@/src/lib/api/axios";


interface PromotionDetail {
  _id: string;
  status: string;
  planTier: string;
  amount: number;
  currency: string;
  country: string;
  duration: number;
  paymentRef?: string;
  flwTxId?: string;
  paidAt?: string;
  createdAt: string;
  approvedAt?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  expiresAt?: string;
  refundedAt?: string;
  refundReason?: string;
  userId?: {
    _id: string;
    username: string;
    email: string;
    phone?: string;
    profilePicture?: string;
    country?: string;
    createdAt?: string;
  };
  adId?: {
    _id: string;
    title: string;
    coverImage?: string;
    category?: any;
    price?: number;
    currency?: string;
    location?: any;
    status?: string;
    description?: string;
  };
  approvedBy?: { username: string };
  rejectedBy?: { username: string };
}

export default function AdminPromotionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [promo, setPromo] = useState<PromotionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actioning, setActioning] = useState(false);

  const load = async () => {
    try {
      const res = await axiosInstance.get<{ promotion: PromotionDetail }>(
        `/admin/promotions/${id}`,
      );
      setPromo(res.data.promotion);
    } catch (e: any) {
      setError(e?.response?.data?.message ?? "Could not load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const handleAction = async (
    action: "approve" | "reject" | "expire" | "refund",
  ) => {
    let reason = "";
    if (action === "reject" || action === "refund") {
      reason = window.prompt(`Reason for ${action}?`) ?? "";
      if (!reason && action === "reject") return;
    }
    setActioning(true);
    try {
      await axiosInstance.patch(`/admin/promotions/${id}`, { action, reason });
      await load();
    } catch (e: any) {
      alert(e?.response?.data?.message ?? "Action failed");
    } finally {
      setActioning(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center">
        <Loader2 size={28} className="mx-auto animate-spin text-yellow-500" />
      </div>
    );
  }
  if (error || !promo) {
    return (
      <div className="p-12 text-center">
        <div className="text-3xl">⚠️</div>
        <div className="mt-3 font-black text-gray-900">
          {error ?? "Not found"}
        </div>
        <Link
          href="/admin/promotions"
          className="mt-4 inline-block text-xs font-black text-yellow-700 hover:underline"
        >
          ← Back to all promotions
        </Link>
      </div>
    );
  }

  const sym = promo.currency === "NGN" ? "₦" : "GHC";
  const canApprove = promo.status === "paid";
  const canReject = ["pending", "paid"].includes(promo.status);
  const canExpire = promo.status === "approved";
  const canRefund = ["paid", "approved"].includes(promo.status);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <Link
        href="/admin/promotions"
        className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900"
      >
        <ArrowLeft size={14} /> Back to all promotions
      </Link>

      {/* Header */}
      <div className="mt-4 bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2">
              <StatusBadge status={promo.status} />
              <span className="text-xs text-gray-500">
                {promo.planTier} · {promo.duration} days · {promo.country}
              </span>
            </div>
            <h1 className="mt-2 text-2xl font-black text-gray-900">
              {sym} {promo.amount.toLocaleString()}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Created {new Date(promo.createdAt).toLocaleString()}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2">
            {canApprove && (
              <ActionBtn
                icon={<Check size={14} />}
                label="Approve"
                tone="green"
                onClick={() => handleAction("approve")}
                loading={actioning}
              />
            )}
            {canReject && (
              <ActionBtn
                icon={<X size={14} />}
                label="Reject"
                tone="red"
                onClick={() => handleAction("reject")}
                loading={actioning}
              />
            )}
            {canExpire && (
              <ActionBtn
                icon={<Clock size={14} />}
                label="Expire"
                tone="gray"
                onClick={() => handleAction("expire")}
                loading={actioning}
              />
            )}
            {canRefund && (
              <ActionBtn
                icon={<DollarSign size={14} />}
                label="Refund"
                tone="blue"
                onClick={() => handleAction("refund")}
                loading={actioning}
              />
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Listing */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="text-xs font-black tracking-wider text-gray-500 uppercase">
            Listing
          </h2>
          {promo.adId ? (
            <Link
              href={`/ads/${promo.adId._id}`}
              className="mt-3 flex gap-3 group"
            >
              {promo.adId.coverImage ? (
                <img
                  src={promo.adId.coverImage}
                  alt=""
                  className="w-20 h-20 rounded-xl object-cover"
                />
              ) : (
                <div className="w-20 h-20 rounded-xl bg-gray-100 flex items-center justify-center text-2xl">
                  📦
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="font-black text-gray-900 group-hover:text-yellow-700 truncate">
                  {promo.adId.title}
                </div>
                {promo.adId.price && (
                  <div className="text-sm font-bold text-gray-700 mt-0.5">
                    {promo.adId.currency === "NGN" ? "₦" : "GHC"}{" "}
                    {promo.adId.price.toLocaleString()}
                  </div>
                )}
                {promo.adId.location?.city && (
                  <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                    <MapPin size={10} />
                    {promo.adId.location.city}
                  </div>
                )}
                <div className="text-xs text-yellow-700 font-black mt-1.5 flex items-center gap-1">
                  Open listing <ExternalLink size={10} />
                </div>
              </div>
            </Link>
          ) : (
            <div className="text-sm text-gray-400 mt-3">
              Listing no longer exists
            </div>
          )}
        </div>

        {/* User */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="text-xs font-black tracking-wider text-gray-500 uppercase">
            Customer
          </h2>
          {promo.userId ? (
            <div className="mt-3">
              <div className="flex items-center gap-3">
                {promo.userId.profilePicture ? (
                  <img
                    src={promo.userId.profilePicture}
                    alt=""
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center font-black text-gray-900">
                    {promo.userId.username?.[0]?.toUpperCase()}
                  </div>
                )}
                <div>
                  <div className="font-black text-gray-900">
                    {promo.userId.username}
                  </div>
                  <div className="text-xs text-gray-500">
                    {promo.userId.country}
                  </div>
                </div>
              </div>
              <div className="mt-3 space-y-1 text-xs text-gray-700">
                <div className="flex items-center gap-1.5">
                  <Mail size={11} className="text-gray-400" />
                  <span className="font-bold">{promo.userId.email}</span>
                </div>
                {promo.userId.phone && (
                  <div className="flex items-center gap-1.5">
                    <Phone size={11} className="text-gray-400" />
                    <span className="font-bold">{promo.userId.phone}</span>
                  </div>
                )}
                {promo.userId.createdAt && (
                  <div className="flex items-center gap-1.5">
                    <Calendar size={11} className="text-gray-400" />
                    Member since{" "}
                    {new Date(promo.userId.createdAt).toLocaleDateString()}
                  </div>
                )}
              </div>
              <Link
                href={`/admin/users/${promo.userId._id}`}
                className="mt-3 inline-block text-xs font-black text-yellow-700 hover:underline"
              >
                View profile →
              </Link>
            </div>
          ) : (
            <div className="text-sm text-gray-400 mt-3">
              User no longer exists
            </div>
          )}
        </div>
      </div>

      {/* Payment details */}
      <div className="mt-4 bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="text-xs font-black tracking-wider text-gray-500 uppercase mb-4">
          Payment
        </h2>
        <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Detail label="Plan" value={promo.planTier} />
          <Detail
            label="Amount"
            value={`${sym} ${promo.amount.toLocaleString()}`}
          />
          <Detail label="Currency" value={promo.currency} />
          <Detail label="Duration" value={`${promo.duration} days`} />
          {promo.paymentRef && (
            <Detail label="Tx Ref" value={promo.paymentRef} mono />
          )}
          {promo.flwTxId && (
            <Detail label="FLW Tx ID" value={promo.flwTxId} mono />
          )}
          {promo.paidAt && (
            <Detail
              label="Paid at"
              value={new Date(promo.paidAt).toLocaleString()}
            />
          )}
          {promo.expiresAt && (
            <Detail
              label="Expires"
              value={new Date(promo.expiresAt).toLocaleString()}
            />
          )}
        </dl>
      </div>

      {/* Timeline */}
      <div className="mt-4 bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="text-xs font-black tracking-wider text-gray-500 uppercase mb-4">
          Timeline
        </h2>
        <ol className="space-y-3 text-sm">
          <TimelineItem
            when={promo.createdAt}
            title="Promotion submitted"
            tone="gray"
          />
          {promo.paidAt && (
            <TimelineItem
              when={promo.paidAt}
              title="Payment received"
              tone="yellow"
            />
          )}
          {promo.approvedAt && (
            <TimelineItem
              when={promo.approvedAt}
              title={`Approved by ${promo.approvedBy?.username ?? "admin"}`}
              tone="green"
            />
          )}
          {promo.rejectedAt && (
            <TimelineItem
              when={promo.rejectedAt}
              title={`Rejected by ${promo.rejectedBy?.username ?? "admin"}${promo.rejectionReason ? ` — "${promo.rejectionReason}"` : ""}`}
              tone="red"
            />
          )}
          {promo.refundedAt && (
            <TimelineItem
              when={promo.refundedAt}
              title={`Refunded${promo.refundReason ? ` — "${promo.refundReason}"` : ""}`}
              tone="blue"
            />
          )}
        </ol>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const cfg: Record<string, { label: string; cls: string }> = {
    pending: { label: "Pending", cls: "bg-gray-100   text-gray-700" },
    paid: { label: "Paid", cls: "bg-yellow-100 text-yellow-800" },
    approved: { label: "Approved", cls: "bg-green-100  text-green-800" },
    rejected: { label: "Rejected", cls: "bg-red-100    text-red-800" },
    expired: { label: "Expired", cls: "bg-gray-100   text-gray-500" },
    refunded: { label: "Refunded", cls: "bg-blue-100   text-blue-800" },
    failed: { label: "Failed", cls: "bg-red-100    text-red-800" },
  };
  const c = cfg[status] ?? { label: status, cls: "bg-gray-100 text-gray-700" };
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-black ${c.cls}`}>
      {c.label}
    </span>
  );
}

function Detail({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div>
      <dt className="text-[10px] font-black tracking-wider text-gray-500 uppercase">
        {label}
      </dt>
      <dd
        className={`mt-1 text-sm font-bold text-gray-900 ${mono ? "font-mono break-all" : ""}`}
      >
        {value}
      </dd>
    </div>
  );
}

function TimelineItem({
  when,
  title,
  tone,
}: {
  when?: string;
  title: string;
  tone: "gray" | "yellow" | "green" | "red" | "blue";
}) {
  const dot = {
    gray: "bg-gray-300",
    yellow: "bg-yellow-400",
    green: "bg-green-500",
    red: "bg-red-500",
    blue: "bg-blue-500",
  }[tone];

  return (
    <li className="flex gap-3">
      <div className="flex-shrink-0">
        <div className={`w-2.5 h-2.5 rounded-full mt-1.5 ${dot}`} />
      </div>
      <div>
        <div className="font-bold text-gray-900">{title}</div>
        <div className="text-xs text-gray-500">
          {when ? new Date(when).toLocaleString() : ""}
        </div>
      </div>
    </li>
  );
}

function ActionBtn({
  icon,
  label,
  tone,
  onClick,
  loading,
}: {
  icon: React.ReactNode;
  label: string;
  tone: "green" | "red" | "gray" | "blue";
  onClick: () => void;
  loading: boolean;
}) {
  const cls = {
    green: "bg-green-500  hover:bg-green-600  text-white",
    red: "bg-red-500    hover:bg-red-600    text-white",
    gray: "bg-gray-200   hover:bg-gray-300   text-gray-900",
    blue: "bg-blue-500   hover:bg-blue-600   text-white",
  }[tone];

  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black ${cls} disabled:opacity-50`}
    >
      {loading ? <Loader2 size={14} className="animate-spin" /> : icon}
      {label}
    </button>
  );
}
