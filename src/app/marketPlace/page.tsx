"use client";

import { CategoryLandingLayout, MARKETPLACE_LINKS, CategoryPageConfig, } from "@/src/components/Category/CategoryShared";

const config: CategoryPageConfig = {
  category: "marketplace",
  countryLabel: "Marketplace",
  featuredTitle: "Featured Products",
  featuredHref: "/ads?category=marketplace",
  bestSellingTitle: "Best Selling",
  recentTitle: "Recently Posted",
  quickLinks: MARKETPLACE_LINKS,
};

export default function MarketPlace() {
  return <CategoryLandingLayout config={config} />;
}
