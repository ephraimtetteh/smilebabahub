// src/components/home/home.constants.tsx
// Shared constants for the marketplace homepage.

export interface CategoryDef {
  id: string;
  label: string;
  sub: string;
  emoji: string;
  color: string;
  tagBg: string;
}

// ── Sidebar categories — IDs map directly to backend category.main values ──
export const CATEGORIES_SIDEBAR: CategoryDef[] = [
  {
    id: "marketplace",
    label: "Marketplace",
    sub: "Shop everything",
    emoji: "🛍️",
    color: "bg-yellow-50",
    tagBg: "bg-yellow-400",
  },
  {
    id: "food",
    label: "Food & Restaurants",
    sub: "Order delicious meals",
    emoji: "🍔",
    color: "bg-orange-50",
    tagBg: "bg-orange-400",
  },
  {
    id: "apartments",
    label: "Apartments & Properties",
    sub: "Rent or buy properties",
    emoji: "🏢",
    color: "bg-purple-50",
    tagBg: "bg-purple-400",
  },
  {
    id: "vendors",
    label: "Vendors & Stores",
    sub: "Find trusted vendors",
    emoji: "🏪",
    color: "bg-green-50",
    tagBg: "bg-green-400",
  },
  {
    id: "services",
    label: "Jobs & Services",
    sub: "Find or offer jobs",
    emoji: "💼",
    color: "bg-blue-50",
    tagBg: "bg-blue-400",
  },
  {
    id: "events",
    label: "Cars & Automobile",
    sub: "Book events easily",
    emoji: "🎟️",
    color: "bg-red-50",
    tagBg: "bg-red-400",
  },
  {
    id: "pharmacy",
    label: "Pharmacy & Health",
    sub: "Health and wellness",
    emoji: "💊",
    color: "bg-cyan-50",
    tagBg: "bg-cyan-400",
  },
  {
    id: "delivery",
    label: "Delivery & Logistics",
    sub: "Fast delivery services",
    emoji: "🚚",
    color: "bg-indigo-50",
    tagBg: "bg-indigo-400",
  },
  {
    id: "fashion",
    label: "Fashion & Beauty",
    sub: "Style for every you",
    emoji: "👗",
    color: "bg-pink-50",
    tagBg: "bg-pink-400",
  },
  {
    id: "tools",
    label: "Services",
    sub: "All kinds of services",
    emoji: "🔧",
    color: "bg-gray-100",
    tagBg: "bg-gray-500",
  },
];

// ── News ──────────────────────────────────────────────────────────────────
// Each item has an emoji + colour tile — no image files required.
// When you have real article images later, swap `emoji` for an `image` URL.
export interface NewsItem {
  slug: string;
  title: string;
  emoji: string;
  bg: string; // tailwind background class
  category: string;
  date: string;
  excerpt?: string;
}

export const LATEST_NEWS: NewsItem[] = [
  {
    slug: "ghana-cedi-holds-steady",
    title: "Ghana Cedi holds steady against major currencies",
    emoji: "💵",
    bg: "bg-green-100",
    category: "Economy",
    date: "2026-05-12",
    excerpt:
      "Bank of Ghana governor reports cedi maintained stability through Q2 amid global headwinds.",
  },
  {
    slug: "africa-youth-jobs-2026",
    title: "New jobs program launched for youth in Africa",
    emoji: "💼",
    bg: "bg-blue-100",
    category: "Jobs",
    date: "2026-05-11",
    excerpt:
      "Pan-African initiative aims to create 1M jobs for under-30s across 12 countries.",
  },
  {
    slug: "afcfta-trade-boost-2026",
    title: "AfCFTA boosts intra-African trade by 15%",
    emoji: "🌍",
    bg: "bg-purple-100",
    category: "Trade",
    date: "2026-05-10",
    excerpt:
      "African free trade area drives record exports between member states.",
  },
  {
    slug: "black-stars-afcon-2025",
    title: "Black Stars qualify for AFCON 2025",
    emoji: "⚽",
    bg: "bg-red-100",
    category: "Sports",
    date: "2026-05-09",
    excerpt:
      "Ghana secures place in continental championship after final qualifier win.",
  },
  {
    slug: "naira-rebounds-may",
    title: "Naira rebounds against dollar after CBN intervention",
    emoji: "💸",
    bg: "bg-emerald-100",
    category: "Economy",
    date: "2026-05-08",
    excerpt:
      "Central Bank of Nigeria measures begin showing impact on currency markets.",
  },
];
