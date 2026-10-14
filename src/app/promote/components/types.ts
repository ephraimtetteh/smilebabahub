// src/app/promote/components/types.ts
//
// Complete promotion types. Adds refund + rejection fields so all UI
// paths (status page, admin page, etc.) type-check cleanly.

export type PromoTier = "starter" | "growth" | "enterprise";

export interface PromoTierDef {
  id: PromoTier;
  label: string;
  days: number;
  price: number;
  currency: string;
  currencySymbol: string;
  channels: string[];
  perks: string[];
  badge?: string;
}

export type PromoStatus =
  | "submitted"
  | "under_review"
  | "payment_pending"
  | "paid"
  | "live"
  | "expired"
  | "rejected"
  | "refunded";

export interface Promotion {
  _id: string;
  userId: string;
  tier: PromoTier;

  // ── Business / contact ─────────────────────────────
  businessName?: string;
  contactName?: string;
  contactEmail: string;
  contactPhone?: string;
  preferredContact?: "email" | "phone" | "whatsapp";

  // ── Campaign details ───────────────────────────────
  title: string;
  description?: string;
  category?: string;
  promotionType?: string;
  targetRegion?: string;
  targetAudience?: string;
  startDate?: string;

  // ── Creative ───────────────────────────────────────
  coverImage?: string;
  videoUrl: string;
  videoName?: string;
  thumbnailUrl?: string;
  videoDuration?: number;
  displayImage?: string;

  // ── Pricing snapshot ───────────────────────────────
  amount: number;
  currency: string;
  country: string;
  days: number;
  channels: string[];

  // ── Workflow ───────────────────────────────────────
  status: PromoStatus;

  // Payment
  paymentRef?: string;
  flwTxId?: string;
  paidAt?: string;

  // Review
  reviewedAt?: string;
  reviewNotes?: string;
  paymentLinkSentAt?: string;

  // Live / expiry
  liveAt?: string;
  expiresAt?: string;

  // Rejection
  rejectedAt?: string;
  rejectionReason?: string;

  // Refund  ← ADDED
  refundedAt?: string;
  refundReason?: string;

  // Analytics
  views?: number;
  listenerReach?: number;
  engagements?: number;

  createdAt: string;
  updatedAt: string;
}

export interface PromoStats {
  businessesPromoting: number;
  monthlyViews: number;
  activeListeners: number;
  engagementRate: number;
  avgGoLiveHours: number;
  activePromotions?: number;
  totalPromotions?: number;
}

export interface ActivePromo {
  _id: string;
  businessName: string;
  contactName?: string;
  title?: string;
  description?: string;
  category?: string;
  coverImage?: string;
  thumbnailUrl?: string;
  displayImage?: string;
  videoUrl: string;
  tier: PromoTier;
  country: string;
  views: number;
  liveAt?: string;
}
