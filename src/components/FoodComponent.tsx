"use client";

import React from "react";
import Title from "@/src/components/Title";
import { FeaturedGrid } from "./FeaturedCard";
import { useRouter } from "next/navigation";
import { Products } from "../constants/data";

interface FeaturedProps {
  className?: string;
}

const FoodComponents = ({ className }: FeaturedProps) => {
  const router = useRouter();

  const foods = Products.filter(
    (item) => item.category === "food",
  );

  return (
    <div className={`${className} flex flex-col text-black px-3 sm:px-6`}>
      {/* Header */}
      <div className="flex items-center justify-between my-6 gap-4">
        <Title title="Food & Restaurants" />
        <button
          onClick={() => {
            router.push("/food");
            window.scrollTo(0, 0);
          }}
          className="flex-shrink-0 px-4 py-2 text-sm font-medium border border-gray-300
            rounded-xl bg-white hover:bg-gray-50 transition-all cursor-pointer whitespace-nowrap"
        >
          View all →
        </button>
      </div>

      {/* 7-grid */}
      <FeaturedGrid items={foods.slice(0, 17)} />
    </div>
  );
};

export default FoodComponents;
