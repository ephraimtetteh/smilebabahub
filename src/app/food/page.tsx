"use client";

import React, { useEffect } from "react";
import NewLayout from "@/src/components/NewLayout";
import InputCompontent from "@/src/components/InputCompontent";
import FeaturedCard from "@/src/components/FeaturedCard";
import Title from "@/src/components/Title";
import { useRouter } from "next/navigation";
import Radio from "@/src/components/Radio";
import AOS from "aos";
import SearchBar from "@/src/components/SearchBar";
import MarketplaceSearch from "@/src/components/NewSearch";
import { Products } from "@/src/constants/data";
import Video from "@/src/components/Video";


const FoodPage = () => {

   const router = useRouter()
    const navigate = (path: string) => {
      router.push(path);
    };

    const foods = Products.filter((item) => item.category === "food");



  return (
    <div className="w-full flex flex-col items-center mt-20 px-4">
      <div className="py-15 w-full max-w-7xl">
        <MarketplaceSearch />
        <NewLayout />
        <div className="pt-10">
          <Radio />
        </div>
      </div>

      <div className="w-full max-w-7xl grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {foods.length === 0 ? (
          <p className="text-gray-500 col-span-full text-center">
            No products found
          </p>
        ) : (
          foods.map((item, index) => (
            <FeaturedCard key={item.id} item={item} index={index} />
          ))
        )}
      </div>
      <Video />
    </div>
  );
};

export default FoodPage;
