// src/types/adForm.types.ts
// Bridges the simple sell form fields with the richer Ad model.
// Used by both the create (sell) page and the edit page.

import {
  AdCondition,
  Negotiable,
  DeliveryOption,
  AdCurrency,
  AdAttribute,
} from "@/src/types/ad.types";

export type AdFormData = {
  // ── Step 1: Basic info ─────────────────────────────────────────────────
  title: string;
  description: string;
  category: string; // main category e.g. "marketplace"
  subcategory: string; // sub e.g. "vehicles"
  type: string; // leaf e.g. "cars"
  condition: AdCondition | "";
  negotiable: Negotiable | "";
  tags: string; // comma-separated, split before submit

  // ── Step 2: Media ──────────────────────────────────────────────────────
  images: (File | null)[];
  videoUrl: string;

  // ── Step 3: Pricing & delivery ─────────────────────────────────────────
  price: string;
  currency: AdCurrency;
  delivery: boolean;
  deliveryOption: DeliveryOption | "";
  deliveryFee: string;
  deliveryNote: string;

  // ── Step 4: Location ───────────────────────────────────────────────────
  country: string;
  region: string;
  city: string;
  address: string;

  // ── Step 5: Contact ────────────────────────────────────────────────────
  name: string;
  phone: string;
  whatsapp: string;
  showPhone: boolean;

  // ── Dynamic attributes (EAV) ───────────────────────────────────────────
  attributes: AdAttribute[];

  // ── Delivery category specific ─────────────────────────────────────────
  // Only used when category === "delivery"
  deliveryServiceType: string; // "bike" | "car" | "truck" | "van" | "foot"
  deliveryCoverageArea: string; // free text, e.g. "Accra Central, Tema"
  deliveryMinOrder: string; // minimum order amount
  deliveryWorkingHours: string; // e.g. "7am – 10pm daily"
  deliveryRating: string; // optional: "verified" | ""
  deliveryHasTracking: boolean;
  deliveryContactNote: string; // what buyers should say when they call

  // ── Pharmacy category specific ─────────────────────────────────────────
  // Only used when category === "pharmacy"
  pharmacyProductType: string; // "otc" | "supplement" | "equipment" | "personal-care"
  pharmacyBrand: string;
  pharmacyDosage: string; // e.g. "500mg", "2 tablets daily"
  pharmacyPackSize: string; // e.g. "30 tablets", "100ml"
  pharmacyExpiryDate: string; // YYYY-MM format
  pharmacyPrescription: boolean; // requires prescription?
  pharmacyNafdacNo: string; // NAFDAC registration (Nigeria) / FDA (Ghana)
  pharmacyStorageInfo: string; // "Store below 25°C" etc.
};

export const EMPTY_AD_FORM: AdFormData = {
  title: "",
  description: "",
  category: "",
  subcategory: "",
  type: "",
  condition: "",
  negotiable: "",
  tags: "",
  images: [null, null, null, null, null],
  videoUrl: "",
  price: "",
  currency: "GHS",
  delivery: false,
  deliveryOption: "",
  deliveryFee: "",
  deliveryNote: "",
  region: "",
  country: "Ghana",
  city: "",
  address: "",
  name: "",
  phone: "",
  whatsapp: "",
  showPhone: true,
  attributes: [],

  // Delivery
  deliveryServiceType: "",
  deliveryCoverageArea: "",
  deliveryMinOrder: "",
  deliveryWorkingHours: "",
  deliveryRating: "",
  deliveryHasTracking: false,
  deliveryContactNote: "",

  // Pharmacy
  pharmacyProductType: "",
  pharmacyBrand: "",
  pharmacyDosage: "",
  pharmacyPackSize: "",
  pharmacyExpiryDate: "",
  pharmacyPrescription: false,
  pharmacyNafdacNo: "",
  pharmacyStorageInfo: "",
};
