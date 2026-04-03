// src/types/adForm.types.ts
// Bridges the simple sell form fields with the richer Ad model.
// Used by both the create (sell) page and the edit page.

import {
  AdCondition,
  Negotiable,
  DeliveryOption,
  AdCurrency,
  AdAttribute,
} from "./ad.types";

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

  // ── Step 2: Media (images stay as File | null for uploads) ─────────────
  images: (File | null)[];
  videoUrl: string;

  // ── Step 3: Pricing & delivery ─────────────────────────────────────────
  price: string; // string for form input, parsed before submit
  currency: AdCurrency;
  delivery: boolean;
  deliveryOption: DeliveryOption | "";
  deliveryFee: string;
  deliveryNote: string;

  // ── Step 4: Location ───────────────────────────────────────────────────
  country: string; // "Ghana" | "Nigeria" — set from useViewCountry
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
};
