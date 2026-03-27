// src/config/navCategories.ts
// ─────────────────────────────────────────────────────────────────────────────
// SINGLE SOURCE OF TRUTH for navbar categories.
// To add a new category:  just add one entry to NAV_CATEGORIES.
// The Navbar reads this at render time — no other file needs changing.
// ─────────────────────────────────────────────────────────────────────────────

export type NavCategory = {
  label: string;
  href: string;
  icon: string;
  // Optional: show only for a specific country ("GH" | "NG" | null = always show)
  country?: "GH" | "NG" | null;
  // Optional: badge text (e.g. "New", "Beta")
  badge?: string;
  // Optional: subcategory dropdown items
  children?: { label: string; href: string; icon: string }[];
};

export const NAV_CATEGORIES: NavCategory[] = [
  {
    label: "Marketplace",
    href: "/marketPlace",
    icon: "🛍️",
    children: [
      {
        label: "Phones & Tablets",
        href: "/marketPlace?sub=phones",
        icon: "📱",
      },
      { label: "Vehicles", href: "/marketPlace?sub=vehicles", icon: "🚗" },
      {
        label: "Electronics",
        href: "/marketPlace?sub=electronics",
        icon: "💻",
      },
      { label: "Fashion", href: "/marketPlace?sub=fashion", icon: "👗" },
      { label: "Furniture", href: "/marketPlace?sub=furniture", icon: "🛋️" },
      { label: "Services", href: "/marketPlace?sub=services", icon: "🔧" },
    ],
  },
  {
    label: "Food",
    href: "/food",
    icon: "🍔",
    children: [
      { label: "Fast food", href: "/food?sub=fast-food", icon: "🍟" },
      { label: "Local dishes", href: "/food?sub=local", icon: "🍲" },
      { label: "Groceries", href: "/food?sub=groceries", icon: "🛒" },
      { label: "Drinks", href: "/food?sub=drinks", icon: "🥤" },
    ],
  },
  {
    label: "Apartments",
    href: "/restate",
    icon: "🏠",
    children: [
      { label: "Short stay", href: "/restate?sub=short-stay", icon: "🏖️" },
      { label: "Self-contained", href: "/restate?sub=self-cont", icon: "🏠" },
      { label: "2-3 Bedroom", href: "/restate?sub=bedroom", icon: "🏡" },
      { label: "Commercial", href: "/restate?sub=commercial", icon: "🏢" },
    ],
  },
  // ─── Add new categories below — the Navbar picks them up automatically ───
  // {
  //   label:   "Cars",
  //   href:    "/cars",
  //   icon:    "🚗",
  //   badge:   "New",
  // },
  // {
  //   label:   "Jobs",
  //   href:    "/jobs",
  //   icon:    "💼",
  //   country: "GH",   // Ghana only
  // },
];

// The "Earn with us" marketer link is separate (always last, styled differently)
export const MARKETER_LINK = {
  label: "Earn with us",
  href: "/marketer",
  icon: "💰",
};
