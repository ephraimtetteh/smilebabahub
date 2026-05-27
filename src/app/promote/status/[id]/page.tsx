"use client";

// src/app/promote/status/[id]/page.tsx
// Status page for an individual promotion campaign.
// Shows current status, paid receipt, payment link if approved, etc.

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Loader2,
  ChevronLeft,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Clock,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { toast } from "react-toastify";
import axiosInstance from "@/src/lib/api/axios";
import { STATUS_META, type Promotion } from "../../components/types";

export default function StatusPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const search = useSearchParams();
  const id = params?.id;
  const queryStatus = search.get("status"); // ?status=paid|failed|amount_mismatch

  const [promo, setPromo] = useState<Promotion | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  // Load campaign details
  useEffect(() => {
    if (!id) return;
    axiosInstance
      .get("/promote/my")
      .then(({ data }) => {
        const found = data.promotions?.find((p: Promotion) => p._id === id);
        if (!found) {
          toast.error("Campaign not found");
          router.replace("/promote");
        } else {
          setPromo(found);
        }
      })
      .catch(() => toast.error("Failed to load campaign"))
      .finally(() => setLoading(false));
  }, [id, router]);

  // Show toasts for ?status= query param after Flutterwave redirect
  useEffect(() => {
    if (queryStatus === "paid") toast.success("Payment received!");
    else if (queryStatus === "failed")
      toast.error("Payment failed. Please try again.");
    else if (queryStatus === "amount_mismatch")
      toast.error("Amount mismatch — contact support.");
  }, [queryStatus]);

  const initiatePayment = async () => {
    if (!promo) return;
    setPaying(true);
    try {
      const { data } = await axiosInstance.post(`/promote/${promo._id}/pay`);
      // Redirect to Flutterwave hosted checkout
      window.location.href = data.paymentLink;
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to start payment");
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-yellow-500" />
      </main>
    );
  }

  if (!promo) return null;

  const meta = STATUS_META[promo.status];
  const sym = promo.currency === "NGN" ? "₦" : "₵";
  const canPay =
    promo.status === "approved" || promo.status === "pending_payment";

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-3 sm:px-4 py-4 sm:py-5">
          <Link
            href="/promote"
            className="inline-flex items-center gap-1 text-xs text-gray-500
              hover:text-gray-900"
          >
            <ChevronLeft size={13} /> Back to promote
          </Link>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-3 sm:px-4 py-6 sm:py-10 space-y-5">
        {/* Big status card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm text-center">
          <div className="text-6xl mb-3">{meta.emoji}</div>
          <span
            className={`inline-block ${meta.color} text-sm font-black px-4 py-1.5 rounded-full mb-3`}
          >
            {meta.label}
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 mb-1">
            {promo.title}
          </h1>
          <p className="text-sm text-gray-500">
            Submitted{" "}
            {new Date(promo.createdAt).toLocaleDateString("en-GH", {
              dateStyle: "long",
            })}
          </p>
        </div>

        {/* Status-specific guidance */}
        {promo.status === "pending_review" && (
          <Banner
            color="yellow"
            icon={<Clock size={18} />}
            title="Under review"
            desc="Our team is reviewing your video. We'll email you within 2–3 business days."
          />
        )}

        {(promo.status === "approved" ||
          promo.status === "pending_payment") && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
            <div className="flex items-start gap-3 mb-4">
              <CheckCircle2
                size={20}
                className="text-blue-600 flex-shrink-0 mt-0.5"
              />
              <div className="flex-1">
                <p className="font-black text-blue-900 text-sm mb-1">
                  Approved! Complete payment to go live.
                </p>
                <p className="text-xs text-blue-700">
                  Your campaign will start airing within 48 hours of payment.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 mb-4 border border-blue-100">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-gray-500 font-bold">Amount due</p>
                <p className="text-xs text-gray-500">
                  {promo.days} days campaign
                </p>
              </div>
              <p className="text-2xl font-black text-gray-900">
                {sym}
                {promo.amount.toLocaleString()}
              </p>
            </div>

            <button
              onClick={initiatePayment}
              disabled={paying}
              className="w-full bg-yellow-400 hover:bg-yellow-300 text-black
                font-black py-3.5 rounded-2xl text-sm transition
                flex items-center justify-center gap-2 disabled:opacity-50
                active:scale-[0.99]"
            >
              {paying ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> Starting
                  payment…
                </>
              ) : (
                <>
                  <CreditCard size={15} /> Pay with Flutterwave
                </>
              )}
            </button>
            <p className="text-[10px] text-blue-600 text-center mt-2">
              Secure payment via Flutterwave • Mobile Money, Card, Bank
            </p>
          </div>
        )}

        {promo.status === "paid" && (
          <Banner
            color="green"
            icon={<CheckCircle2 size={18} />}
            title="Payment received — scheduling your campaign"
            desc="Our team is scheduling your video. You'll be notified when it goes live."
          />
        )}

        {promo.status === "scheduled" && (
          <Banner
            color="indigo"
            icon={<Clock size={18} />}
            title="Scheduled to go live"
            desc="Your campaign is in the queue. Check back soon!"
          />
        )}

        {promo.status === "active" && (
          <Banner
            color="pink"
            icon={<Sparkles size={18} />}
            title="🎉 Your campaign is LIVE!"
            desc="Your video is airing across SmileBaba Radio, TV, and Social."
          />
        )}

        {promo.status === "completed" && (
          <Banner
            color="gray"
            icon={<CheckCircle2 size={18} />}
            title="Campaign completed"
            desc="Thanks for promoting with SmileBaba! Want to run another?"
          />
        )}

        {promo.status === "rejected" && (
          <Banner
            color="red"
            icon={<XCircle size={18} />}
            title="Campaign not approved"
            desc="Check your email for details. You can submit a revised version anytime."
          />
        )}

        {/* Campaign details */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <h3 className="text-sm font-black text-gray-900 mb-3">
            Campaign details
          </h3>
          <dl className="space-y-2 text-sm">
            <Detail
              label="Plan"
              value={promo.tier.charAt(0).toUpperCase() + promo.tier.slice(1)}
            />
            <Detail label="Duration" value={`${promo.days} days`} />
            <Detail
              label="Amount"
              value={`${sym}${promo.amount.toLocaleString()}`}
            />
            <Detail label="Country" value={promo.country} />
            {promo.paidAt && (
              <Detail
                label="Paid on"
                value={new Date(promo.paidAt).toLocaleDateString("en-GH", {
                  dateStyle: "long",
                })}
              />
            )}
            {promo.txRef && (
              <Detail label="Reference" value={promo.txRef} mono />
            )}
          </dl>

          {/* Video preview */}
          {promo.videoUrl && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs font-bold text-gray-500 mb-2">Your video</p>
              <video
                src={promo.videoUrl}
                controls
                className="w-full rounded-xl bg-black aspect-video"
              />
            </div>
          )}
        </div>

        <Link
          href="/promote"
          className="block text-center text-xs text-gray-500 hover:text-gray-900"
        >
          ← Run another campaign
        </Link>
      </div>
    </main>
  );
}

// ─── presentational helpers ─────────────────────────────────────────────────
function Banner({
  color,
  icon,
  title,
  desc,
}: {
  color: "yellow" | "blue" | "green" | "red" | "pink" | "indigo" | "gray";
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  const styles = {
    yellow: "bg-yellow-50 border-yellow-200 text-yellow-800",
    blue: "bg-blue-50 border-blue-200 text-blue-800",
    green: "bg-green-50 border-green-200 text-green-800",
    red: "bg-red-50 border-red-200 text-red-800",
    pink: "bg-pink-50 border-pink-200 text-pink-800",
    indigo: "bg-indigo-50 border-indigo-200 text-indigo-800",
    gray: "bg-gray-50 border-gray-200 text-gray-800",
  }[color];
  return (
    <div className={`${styles} border rounded-2xl p-5 flex items-start gap-3`}>
      <div className="flex-shrink-0 mt-0.5">{icon}</div>
      <div>
        <p className="font-black text-sm mb-1">{title}</p>
        <p className="text-xs opacity-80">{desc}</p>
      </div>
    </div>
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
    <div className="flex items-center justify-between">
      <dt className="text-xs text-gray-500 font-medium">{label}</dt>
      <dd
        className={`text-xs font-bold text-gray-900 ${mono ? "font-mono" : ""}`}
      >
        {value}
      </dd>
    </div>
  );
}
