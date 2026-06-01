// src/components/ads/ad.constants.ts
// Single source of truth for all categories, subcategories, conditions, and ad helpers.
// Every category page, form, and filter reads from here.

// Inline condition type — avoids importing AdCondition and then extending with "all"
// which TypeScript flags as a non-overlapping comparison (ts2367).
// The backend model uses "brand_new" | "foreign_used" | "local_used" | "refurbished" | "not_applicable"
// We add "all" only in the filter UI; the form only sets real condition values.
type AdConditionValue =
  | "brand_new"
  | "foreign_used"
  | "local_used"
  | "refurbished"
  | "not_applicable";
export type ConditionFilter = AdConditionValue | "all";

// ── Main categories (shown in nav + feed tabs) ─────────────────────────────
export const CATEGORIES = [
  { id: "all", label: "All", icon: "🏠" },
  { id: "marketplace", label: "Shop", icon: "🛍️" },
  { id: "food", label: "Food", icon: "🍔" },
  { id: "apartments", label: "Property", icon: "🏢" },
  { id: "automobile", label: "Automobile", icon: "🚗" },
  { id: "fashion", label: "Fashion", icon: "👗" },
  { id: "pharmacy", label: "Pharmacy", icon: "💊" },
  { id: "delivery", label: "Delivery", icon: "🚚" },
  { id: "services", label: "Services", icon: "🔧" },
] as const;

export type MainCategory = (typeof CATEGORIES)[number]["id"];

// ── Subcategories per main category ──────────────────────────────────────────
export const SUBCATEGORIES: Record<
  string,
  { id: string; label: string; icon: string }[]
> = {
  marketplace: [
    { id: "vehicles", label: "Vehicles", icon: "🚗" },
    { id: "electronics", label: "Electronics", icon: "📱" },
    { id: "phones", label: "Phones", icon: "📞" },
    { id: "furniture", label: "Furniture", icon: "🛋️" },
    { id: "appliances", label: "Appliances", icon: "🏠" },
    { id: "tools", label: "Tools", icon: "🔨" },
    { id: "sports", label: "Sports", icon: "⚽" },
    { id: "books", label: "Books", icon: "📚" },
    { id: "other", label: "Other", icon: "📦" },
  ],
  food: [
    { id: "fast-food", label: "Fast Food", icon: "🍟" },
    { id: "local-dishes", label: "Local Dishes", icon: "🍲" },
    { id: "drinks", label: "Drinks", icon: "🥤" },
    { id: "groceries", label: "Groceries", icon: "🛒" },
    { id: "pastries", label: "Pastries", icon: "🥐" },
    { id: "catering", label: "Catering", icon: "👨‍🍳" },
    { id: "beverages", label: "Beverages", icon: "☕" },
    { id: "other", label: "Other", icon: "🍽️" },
  ],
  apartments: [
    { id: "self-contained", label: "Self-contained", icon: "🏠" },
    { id: "chamber-hall", label: "Chamber & Hall", icon: "🛏️" },
    { id: "studio", label: "Studio", icon: "🏢" },
    { id: "2-bedroom", label: "2-Bedroom", icon: "🛏️" },
    { id: "3-bedroom-plus", label: "3-Bedroom+", icon: "🏡" },
    { id: "duplex", label: "Duplex", icon: "🏘️" },
    { id: "condo", label: "Condo", icon: "🏙️" },
    { id: "villa", label: "Villa", icon: "🏰" },
    { id: "townhouse", label: "Townhouse", icon: "🏚️" },
    { id: "mansion", label: "Mansion", icon: "🏯" },
    { id: "commercial", label: "Commercial", icon: "🏬" },
    { id: "land", label: "Land / Plot", icon: "🌿" },
    { id: "short-stay", label: "Short Stay", icon: "🗓️" },
    { id: "buy", label: "For Sale", icon: "🔑" },
  ],
  automobile: [
    { id: "cars", label: "Cars", icon: "🚗" },
    { id: "suvs", label: "SUVs", icon: "🚙" },
    { id: "trucks", label: "Trucks & Pickups", icon: "🛻" },
    { id: "motorcycles", label: "Motorcycles", icon: "🏍️" },
    { id: "tricycles", label: "Tricycles", icon: "🛺" },
    { id: "buses", label: "Buses & Vans", icon: "🚐" },
    { id: "commercial", label: "Commercial", icon: "🚛" },
    { id: "parts", label: "Parts & Accessories", icon: "🔧" },
    { id: "rentals", label: "Car Rentals", icon: "🔑" },
    { id: "other", label: "Other Vehicles", icon: "🚜" },
  ],
  fashion: [
    { id: "mens", label: "Men's Wear", icon: "👔" },
    { id: "womens", label: "Women's Wear", icon: "👗" },
    { id: "kids", label: "Kids' Wear", icon: "👶" },
    { id: "shoes", label: "Shoes", icon: "👟" },
    { id: "bags", label: "Bags", icon: "👜" },
    { id: "jewellery", label: "Jewellery", icon: "💍" },
    { id: "watches", label: "Watches", icon: "⌚" },
    { id: "sunglasses", label: "Sunglasses", icon: "🕶️" },
    { id: "traditional", label: "Traditional", icon: "🪭" },
    { id: "other", label: "Other", icon: "🧴" },
  ],
  pharmacy: [
    { id: "otc-drugs", label: "OTC Drugs", icon: "💊" },
    { id: "vitamins", label: "Vitamins & Supps", icon: "🌿" },
    { id: "first-aid", label: "First Aid", icon: "🩹" },
    { id: "baby-care", label: "Baby Care", icon: "👶" },
    { id: "personal-care", label: "Personal Care", icon: "🧴" },
    { id: "medical-equip", label: "Medical Equipment", icon: "🩺" },
    { id: "other", label: "Other", icon: "💉" },
  ],
  delivery: [
    { id: "same-day", label: "Same-day", icon: "⚡" },
    { id: "courier", label: "Courier", icon: "📦" },
    { id: "food", label: "Food Delivery", icon: "🛵" },
    { id: "haulage", label: "Haulage", icon: "🚛" },
    { id: "pickup", label: "Pickup & Drop", icon: "🚐" },
    { id: "errand", label: "Errands", icon: "🏃" },
    { id: "tracking", label: "With Tracking", icon: "📍" },
    { id: "other", label: "Other", icon: "🚚" },
  ],
  services: [
    { id: "cleaning", label: "Cleaning", icon: "🧹" },
    { id: "plumbing", label: "Plumbing", icon: "🔧" },
    { id: "electrical", label: "Electrical", icon: "⚡" },
    { id: "carpentry", label: "Carpentry", icon: "🪚" },
    { id: "tutoring", label: "Tutoring", icon: "📖" },
    { id: "beauty", label: "Beauty & Salon", icon: "💇" },
    { id: "event", label: "Event Planning", icon: "🎉" },
    { id: "security", label: "Security", icon: "🛡️" },
    { id: "photography", label: "Photography", icon: "📷" },
    { id: "tech-repair", label: "Tech Repair", icon: "💻" },
    { id: "other", label: "Other", icon: "🔨" },
  ],
};

// ── Category-specific fields shown in the ad form ──────────────────────────
// Each category can require different fields beyond the base set.
export const CATEGORY_FIELDS: Record<
  string,
  {
    showCondition: boolean;
    showDelivery: boolean;
    showBedrooms: boolean;
    showMapPin: boolean;
    conditionLabel: string;
    pricePlaceholder: string;
    descHint: string;
  }
> = {
  marketplace: {
    showCondition: true,
    showDelivery: true,
    showBedrooms: false,
    showMapPin: false,
    conditionLabel: "Item condition",
    pricePlaceholder: "e.g. 500",
    descHint: "Describe the item — brand, age, any defects, what's included",
  },
  food: {
    showCondition: false,
    showDelivery: true,
    showBedrooms: false,
    showMapPin: true,
    conditionLabel: "",
    pricePlaceholder: "e.g. 25 (price per item/pack)",
    descHint: "What's on the menu? Describe portions, allergens, availability",
  },
  apartments: {
    showCondition: false,
    showDelivery: false,
    showBedrooms: true,
    showMapPin: true,
    conditionLabel: "",
    pricePlaceholder: "Monthly rent or sale price",
    descHint: "Describe the property — furnishing, amenities, nearby landmarks",
  },
  automobile: {
    showCondition: true,
    showDelivery: false,
    showBedrooms: false,
    showMapPin: true,
    conditionLabel: "Vehicle condition",
    pricePlaceholder: "e.g. 35000",
    descHint:
      "Year, mileage, transmission, fuel type, history — buyers need details",
  },
  fashion: {
    showCondition: true,
    showDelivery: true,
    showBedrooms: false,
    showMapPin: false,
    conditionLabel: "Item condition",
    pricePlaceholder: "e.g. 120",
    descHint: "Size, colour, material, brand — anything a buyer needs to know",
  },
  pharmacy: {
    showCondition: false,
    showDelivery: true,
    showBedrooms: false,
    showMapPin: true,
    conditionLabel: "",
    pricePlaceholder: "Price per unit/pack",
    descHint: "Dosage, pack size, expiry, any restrictions — be accurate",
  },
  delivery: {
    showCondition: false,
    showDelivery: false,
    showBedrooms: false,
    showMapPin: true,
    conditionLabel: "",
    pricePlaceholder: "Starting price / per km",
    descHint: "Coverage area, vehicle type, capacity, working hours",
  },
  services: {
    showCondition: false,
    showDelivery: false,
    showBedrooms: false,
    showMapPin: true,
    conditionLabel: "",
    pricePlaceholder: "Starting price / per hour",
    descHint: "What you offer, experience, availability, service area",
  },
};

// ── Real estate bedroom options ───────────────────────────────────────────
export const BEDROOM_OPTIONS = [
  "Studio / Self-contained",
  "1 bedroom",
  "2 bedrooms",
  "3 bedrooms",
  "4 bedrooms",
  "5+ bedrooms",
  "Land / Plot (no rooms)",
  "Commercial space",
];

// ── Conditions ─────────────────────────────────────────────────────────────
export const CONDITIONS: { id: ConditionFilter; label: string }[] = [
  { id: "all", label: "Any condition" },
  { id: "brand_new", label: "Brand new" },
  { id: "foreign_used", label: "Foreign used" },
  { id: "local_used", label: "Local used" },
  { id: "refurbished", label: "Refurbished" },
];

export const CONDITION_LABELS: Record<string, string> = {
  brand_new: "Brand New",
  foreign_used: "Foreign Used",
  local_used: "Local Used",
  refurbished: "Refurbished",
  not_applicable: "—",
};

// ── Sort options ───────────────────────────────────────────────────────────
export const SORT_OPTIONS = [
  { id: "newest", label: "Newest first" },
  { id: "price_asc", label: "Price: Low → High" },
  { id: "price_desc", label: "Price: High → Low" },
  { id: "popular", label: "Most viewed" },
] as const;

// ── Boost badges ──────────────────────────────────────────────────────────
export const BOOST_BADGE: Record<
  string,
  { label: string; cls: string; cardCls: string }
> = {
  premium: {
    label: "Premium Featured",
    cls: "bg-purple-100 text-purple-700 border-purple-200",
    cardCls: "bg-purple-500 text-white",
  },
  featured: {
    label: "Promoted",
    cls: "bg-blue-100 text-blue-700 border-blue-200",
    cardCls: "bg-blue-500 text-white",
  },
  standard: {
    label: "Boosted",
    cls: "bg-amber-100 text-amber-700 border-amber-200",
    cardCls: "bg-amber-400 text-black",
  },
};

export const BOOST_TIERS = [
  {
    tier: "standard" as const,
    label: "Standard Boost",
    desc: "Appear higher in search results",
    days: 7,
  },
  {
    tier: "featured" as const,
    label: "Featured",
    desc: "Promoted badge + priority placement",
    days: 14,
  },
  {
    tier: "premium" as const,
    label: "Premium",
    desc: "Top of all results + homepage feature",
    days: 30,
  },
];

export const TIER_SORT: Record<string, number> = {
  premium: 3,
  featured: 2,
  standard: 1,
};

// ── Helpers ────────────────────────────────────────────────────────────────
export function formatAdPrice(
  amount: number | undefined,
  currency: string | undefined,
  display?: string,
): string {
  if (display) return display;
  const sym = currency === "NGN" ? "₦" : "₵";
  return `${sym}${Number(amount ?? 0).toLocaleString()}`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GH", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function getCategoryMeta(id: string) {
  return CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[0];
}

export function getSubcategories(categoryId: string) {
  return SUBCATEGORIES[categoryId] ?? [];
}
