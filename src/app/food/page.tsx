"use client";

import { CategoryLandingLayout, FOOD_LINKS, CategoryPageConfig, } from "@/src/components/Category/CategoryShared";

const config: CategoryPageConfig = {
  category: "food",
  countryLabel: "Food",
  featuredTitle: "Featured Food & Restaurants",
  featuredHref: "/ads?category=food",
  bestSellingTitle: "Most Popular",
  recentTitle: "Freshly Listed",
  quickLinks: FOOD_LINKS,
};

export default function FoodPage() {
  return <CategoryLandingLayout config={config} />;
}
