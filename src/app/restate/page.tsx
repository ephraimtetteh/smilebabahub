"use client";
// src/app/restate/page.tsx
import {
  CategoryLandingLayout,
  REALESTATE_LINKS,
  CategoryPageConfig,
} from "@/src/components/Category/CategoryShared";

const config: CategoryPageConfig = {
  // Real estate is a Marketplace category. Short stays & hotels are
  // SmileStays (/ads?category=apartments).
  category: "real-estate",
  countryLabel: "Real Estate",
  featuredTitle: "Featured Properties",
  featuredHref: "/ads?category=real-estate",
  bestSellingTitle: "Most Viewed Properties",
  recentTitle: "Recently Listed",
  quickLinks: REALESTATE_LINKS,
};

export default function RealEstate() {
  return <CategoryLandingLayout config={config} />;
}
