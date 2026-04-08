// src/types/types.d.ts
// Full merged type definitions for SmileBaba Hub.

import type React from "react";
import type { StaticImageData } from "next/image";
import type { JSX, ChangeEvent } from "react";

// ── Product / order UI types ───────────────────────────────────────────────
export type ProductSectionProps = {
  title: string;
  variant: "flash-sale" | "new-arrival" | "best-selling";
  products: Product[];
};

export type ProductSectionVariant = "promotion" | "recency" | "popularity";

export interface AddProductOrderProps {
  image: StaticImageData | string;
  name?: string;
  brand?: string;
  inventory?: number;
  price?: number;
  sales?: number;
  status?:
    | "Active"
    | "Finish"
    | "Completed"
    | "Pending"
    | "Delivered"
    | "Cancelled";
  action?: JSX.Element;
  orderId?: string;
  customer?: string;
  created_At?: string;
  total?: string;
  title?: string;
}

export interface CustomerProps {
  image: StaticImageData;
  name: string;
  email: string;
  orders: number;
  spend: string;
  joined: string;
  location: string;
  action: JSX.Element;
}

export type Product = {
  id: number;
  title?: string;
  description?: string;
  image: StaticImageData | string;
  date?: number;
  category?: string;
  author?: string;
  price?: number;
};

// ── Subscription component ─────────────────────────────────────────────────
export type SubscriptionInclude = {
  package: string;
  icon: React.ReactNode;
  status: "yes" | "no";
};

export type SubscriptionPrice = {
  plan: string;
  duration: "monthly" | "yearly";
  price: number;
};

export type SubscriptionComponentProps = {
  id: string;
  packageName: string;
  text: string;
  popular: boolean;
  prices: SubscriptionPrice[];
  tile: string;
  includes: SubscriptionInclude[];
  plan: "monthly" | "yearly";
  isActive: boolean;
  isPopular: boolean;
  localPrice?: string;
  onClick: () => void;
};

export type SubscriptionPlanProps = {
  selectedPlanId?: string;
  onPlanSelect?: (planId: string) => void;
};

// ── Generic UI types ───────────────────────────────────────────────────────
export interface InputProps {
  type?: string;
  placeholder?: string;
  value?: string;
  className?: string;
  name?: string;
  id?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export type StoreProviderProps = {
  children: React.ReactNode;
  user: UserProp | null;
};

export type CTAProps = {
  text?: string;
  title?: string;
  desc?: string;
  image: StaticImageData;
  className?: string;
};

export type ShowProductProps = {
  showAddProduct: boolean;
  setShowAddProduct: React.Dispatch<React.SetStateAction<boolean>>;
};

export interface NavbarLinkProps {
  href: string;
  label: string;
}

// ── Sell form ──────────────────────────────────────────────────────────────
export interface SellFormData {
  title: string;
  category: string;
  subcategory: string;
  type: string;
  images: (File | string | null)[];
  region: string;
  city: string;
  description: string;
  price: string;
  name: string;
  phone: string;
}

export interface StepProps {
  data: SellFormData;
  updateField: <K extends keyof SellFormData>(
    field: K,
    value: SellFormData[K],
  ) => void;
  onNext: () => void;
  onBack?: () => void;
  errors?: Record<string, string>;
}

// ── Product detail types ───────────────────────────────────────────────────
export interface CardComponentProps {
  item: ProductProps;
  index: number;
  quantity?: number;
}

export interface ProductProps {
  id: string;
  title: string;
  description: string;
  price: number;
  category: "marketplace" | "apartment" | "food";
  subCategory: string;
  images: StaticImageData[] | string[];
  location: {
    country: string;
    state: string;
    city?: string;
  };
  seller: {
    id: string;
    name: string;
    phone: string;
  };
  rating?: number;
  reviews?: number;
  createdAt?: string;
  updatedAt?: string;
  details: MarketplaceDetails | ApartmentDetails | FoodDetails;
}

export interface MarketplaceDetails {
  brand?: string;
  condition: "new" | "used";
  stock?: number;
  warranty?: string;
}

export interface ApartmentDetails {
  bedrooms: number;
  bathrooms: number;
  furnished: boolean;
  parking: boolean;
  propertyType: "apartment" | "house" | "studio" | "hostel";
  size?: number;
}

export interface FoodDetails {
  restaurantName: string;
  preparationTime?: number;
  isVegetarian?: boolean;
  ingredients?: string[];
}

// ── User role ──────────────────────────────────────────────────────────────
export type UserRole = "guest" | "vendor" | "admin";

// ── UserProp nested types ──────────────────────────────────────────────────
export type UserSubscription = {
  plan: string;
  billingCycle: string;
  price: number;
  currency: string;
  startedAt: string;
  expiresAt: string;
  referredBy?: string | null;
} | null;

export type MomoDetails = {
  network: string;
  number: string;
  accountName: string;
};

export type BankDetails = {
  bankName: string;
  accountNo: string;
  accountName: string;
  branch: string;
};

export type TaxInfo = {
  tin: string;
  vat: string;
  regNo: string;
};

export type PayoutSchedule = {
  frequency: "daily" | "weekly" | "biweekly" | "monthly";
  minAmount: string;
  currency: string;
};

export type DeliveryZone = {
  zone: string;
  eta: string;
  enabled: boolean;
};

export type DeliveryPricing = {
  model: string;
  baseFee: string;
  freeThreshold: string;
};

export type OperatingHourEntry = {
  open: boolean;
  from: string;
  to: string;
};

export type OperatingHours = {
  Monday: OperatingHourEntry;
  Tuesday: OperatingHourEntry;
  Wednesday: OperatingHourEntry;
  Thursday: OperatingHourEntry;
  Friday: OperatingHourEntry;
  Saturday: OperatingHourEntry;
  Sunday: OperatingHourEntry;
};

export type KycStatus = {
  identity: "not_submitted" | "pending" | "verified";
  business: "not_submitted" | "pending" | "verified";
  payment: "not_submitted" | "pending" | "verified";
};

export type NotificationPreferences = {
  newOrder: boolean;
  orderStatus: boolean;
  newReview: boolean;
  newMessage: boolean;
  payoutSent: boolean;
  promotionApproved: boolean;
  weeklyReport: boolean;
  marketingTips: boolean;
  smsNewOrder: boolean;
  smsPayment: boolean;
  whatsappOrder: boolean;
};

// ── Main UserProp ───────────────────────────────────────────────────────────
export type UserProp = {
  _id?: string;
  username: string;
  email: string;
  role: UserRole;
  isAdmin?: boolean;

  phone?: string;
  profilePicture?: string;
  gender?: string;
  dateOfBirth?: string;
  bio?: string;
  city?: string;
  state?: string;
  country?: string;
  currency?: "GHS" | "NGN";
  symbol?: string;
  locale?: string;
  detectedCountry?: string;

  storeName?: string;
  storeSlug?: string;
  storeCategory?: string;
  storeDescription?: string;
  storeEmail?: string;
  storeWebsite?: string;
  storePhone?: string;
  storeBanner?: string;
  storeLogo?: string;
  businessType?: "individual" | "registered" | "enterprise" | "";

  instagram?: string;
  facebook?: string;
  whatsapp?: string;

  returnPolicy?: string;
  deliveryPolicy?: string;
  exchangePolicy?: string;

  operatingHours?: Partial<OperatingHours>;

  subscription?: UserSubscription;

  payoutMethod?: "momo" | "bank" | "both" | "";
  momoDetails?: Partial<MomoDetails>;
  bankDetails?: Partial<BankDetails>;
  taxInfo?: Partial<TaxInfo>;
  payoutSchedule?: Partial<PayoutSchedule>;

  deliveryZones?: DeliveryZone[];
  deliveryPricing?: Partial<DeliveryPricing>;
  dispatchTime?: string;
  packagingNotes?: string;

  kycStatus?: Partial<KycStatus>;
  kycDocType?: string;
  kycDocNumber?: string;
  kycDocExpiry?: string;
  kycFrontUrl?: string;
  kycBackUrl?: string;
  kycBizUrl?: string;
  kycBizRegNo?: string;

  notifications?: Partial<NotificationPreferences>;

  cartItems?: unknown[];
};

// ── Auth response types ────────────────────────────────────────────────────
export type RegisterResponseProp = {
  message: string;
  user: UserProp;
};

export type LoginResponseProp = {
  message: string;
  accessToken: string;
  user: UserProp;
};
