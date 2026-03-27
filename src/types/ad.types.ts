// src/types/ad.types.ts
// All Ad-related TypeScript types — mirrors the Mongoose ad.js model exactly

export type AdCurrency = "GHS" | "NGN";
export type AdCountry = "Ghana" | "Nigeria";
export type AdCountryCode = "GH" | "NG";

export type AdCondition =
  | "brand_new"
  | "foreign_used"
  | "local_used"
  | "refurbished"
  | "not_applicable";

export type DeliveryOption = "pickup_only" | "delivery_only" | "both";
export type Negotiable = "yes" | "no" | "not_sure";
export type BoostTier = "standard" | "featured" | "premium";
export type ModerationStatus = "pending" | "approved" | "rejected" | "flagged";
export type AdPlan = "Basic" | "standard" | "popular" | "premium";

// ── Sub-types ──────────────────────────────────────────────────────────────
export type AdImage = {
  url: string;
  isCover: boolean;
  publicId: string | null;
};

export type AdLocation = {
  country: AdCountry;
  countryCode: AdCountryCode;
  region: string;
  regionSlug?: string;
  city?: string;
  address?: string;
  coordinates?: { lat: number | null; lng: number | null };
};

export type AdContact = {
  name: string;
  phone: string;
  whatsapp?: string | null;
  showPhone: boolean;
};

export type AdCategory = {
  main: string; // "marketplace" | "food" | "apartments"
  sub?: string; // "vehicles" | "electronics"
  leaf?: string; // "cars" | "smartphones"
  path?: string; // "marketplace > vehicles > cars"
};

export type AdAttribute = {
  key: string;
  value: string | number | boolean;
};

export type AdPrice = {
  amount: number;
  currency: AdCurrency;
  display?: string; // "₵ 1,200" — cached by model
};

export type AdDelivery = {
  available: boolean;
  option: DeliveryOption;
  fee: number;
  feeCurrency: AdCurrency | "free";
  note?: string | null;
};

export type AdBoost = {
  isBoosted: boolean;
  boostedAt: string | null;
  boostedUntil: string | null;
  boostTier: BoostTier;
};

export type AdModeration = {
  status: ModerationStatus;
  reviewedBy?: string | null;
  reviewedAt?: string | null;
  rejectReason?: string | null;
};

export type AdSubscription = {
  plan: AdPlan;
  package: string;
  startedAt: string;
  expiresAt: string;
  listingDays: number;
};

// ── Main Ad type (what the API returns) ───────────────────────────────────
export type Ad = {
  _id: string;
  title: string;
  description?: string;
  slug?: string;
  category: AdCategory;
  images: AdImage[];
  videoUrl?: string | null;
  price: AdPrice;
  negotiable: Negotiable;
  attributes: AdAttribute[];
  location: AdLocation;
  contact: AdContact;
  delivery: AdDelivery;
  condition: AdCondition;
  subscription: AdSubscription;
  boost: AdBoost;
  moderation: AdModeration;
  postedBy: { _id: string; username: string; profilePicture?: string };
  referredBy?: string | null;
  isActive: boolean;
  isSold: boolean;
  isPaused: boolean;
  isFeatured: boolean;
  views: number;
  saves: number;
  shares: number;
  contactClicks: number;
  tags: string[];
  expiresAt?: string | null;
  createdAt: string;
  updatedAt: string;
  // Virtuals
  isExpired: boolean;
  coverImage: string | null;
  daysLeft: number | null;
};

// ── API response types ─────────────────────────────────────────────────────
export type AdsMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
};

export type GetAdsResponse = {
  ads: Ad[];
  meta: AdsMeta;
};

export type GetMyAdsResponse = {
  ads: Ad[];
  meta: AdsMeta;
  stats: {
    activeCount: number;
    soldCount: number;
    pausedCount: number;
    totalViews: number;
  };
};

// ── Filter params (matches backend query params) ───────────────────────────
export type AdFilters = {
  country?: AdCountry;
  category?: string;
  sub?: string;
  leaf?: string;
  minPrice?: number;
  maxPrice?: number;
  currency?: AdCurrency;
  condition?: AdCondition;
  city?: string;
  region?: string;
  search?: string;
  negotiable?: Negotiable;
  sort?: "newest" | "oldest" | "price_asc" | "price_desc" | "popular";
  page?: number;
  limit?: number;
};

// ── Create / update payload ────────────────────────────────────────────────
export type CreateAdPayload = {
  title: string;
  description?: string;
  category: AdCategory;
  attributes?: AdAttribute[];
  images?: AdImage[];
  videoUrl?: string | null;
  price: { amount: number; currency: AdCurrency };
  negotiable?: Negotiable;
  location: AdLocation;
  contact: AdContact;
  delivery?: Partial<AdDelivery>;
  condition?: AdCondition;
  tags?: string[];
};

export type UpdateAdPayload = Partial<CreateAdPayload>;
