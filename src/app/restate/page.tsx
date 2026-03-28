"use client";
// src/app/restate/page.tsx
import {
  CategoryLandingLayout,
  REALESTATE_LINKS,
  CategoryPageConfig,
} from "@/src/components/Category/CategoryShared";

const config: CategoryPageConfig = {
  category: "apartments",
  countryLabel: "Real Estate",
  featuredTitle: "Featured Properties",
  featuredHref: "/ads?category=apartments",
  bestSellingTitle: "Most Viewed Properties",
  recentTitle: "Recently Listed",
  quickLinks: REALESTATE_LINKS,
};

export default function RealEstate() {
  return <CategoryLandingLayout config={config} />;
}
