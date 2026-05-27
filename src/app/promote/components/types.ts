// src/app/promote/components/types.ts
// Shared types for the promote flow.

export type PromoTier = "starter" | "growth" | "enterprise";

export interface PromoTierDef {
  id: PromoTier;
  label: string;
  days: number;
  badge: string | null;
  price: number;
  currency: "GHS" | "NGN";
  perks: string[];
}

export type PromoStatus =
  | "pending_review"
  | "approved"
  | "rejected"
  | "pending_payment"
  | "paid"
  | "scheduled"
  | "active"
  | "completed"
  | "refunded";

export interface Promotion {
  _id: string;
  title: string;
  description?: string;
  tier: PromoTier;
  amount: number;
  currency: "GHS" | "NGN";
  days: number;
  status: PromoStatus;
  videoUrl: string;
  videoName?: string;
  country: "Ghana" | "Nigeria";
  txRef?: string | null;
  paymentLink?: string | null;
  paidAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PromoStats {
  monthlyViews: number;
  activeListeners: number;
  engagementRate: number;
  avgGoLiveHours: number;
  businessesPromoting: number;
  generatedAt: string;
}

export const STATUS_META: Record<
  PromoStatus,
  { label: string; color: string; emoji: string }
> = {
  pending_review: {
    label: "Under Review",
    color: "bg-yellow-100 text-yellow-700",
    emoji: "👀",
  },
  approved: {
    label: "Approved — Pay Now",
    color: "bg-blue-100 text-blue-700",
    emoji: "✅",
  },
  rejected: {
    label: "Rejected",
    color: "bg-red-100 text-red-700",
    emoji: "❌",
  },
  pending_payment: {
    label: "Awaiting Payment",
    color: "bg-orange-100 text-orange-700",
    emoji: "💳",
  },
  paid: { label: "Paid", color: "bg-green-100 text-green-700", emoji: "💰" },
  scheduled: {
    label: "Scheduled",
    color: "bg-indigo-100 text-indigo-700",
    emoji: "📅",
  },
  active: {
    label: "Live Now",
    color: "bg-pink-100 text-pink-700",
    emoji: "🎬",
  },
  completed: {
    label: "Completed",
    color: "bg-gray-100 text-gray-700",
    emoji: "🏁",
  },
  refunded: {
    label: "Refunded",
    color: "bg-gray-100 text-gray-500",
    emoji: "↩️",
  },
};
