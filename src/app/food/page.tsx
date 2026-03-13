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


const FoodPage = () => {

   const router = useRouter()
    const navigate = (path: string) => {
      router.push(path);
    };

    const foods = Products.filter((item) => item.category === "food");



  return (
    <div className="w-full flex flex-col flex-1 items-center px-2 justify-center pt-30">
      <NewLayout />
      <MarketplaceSearch />
      <div
        className={`flex flex-col text-black items-center bg-no-repeat bg-cover bg-center mt-20`}
      >
        <div className=" flex items-center justify-between relative gap-12 lg:pb-12">
          <Title title={"Food & Restaurants"} />
        </div>

        <div
          className="flex flex-1 flex-wrap items-center justify-center gap-4"
          style={{ maxWidth: "100%" }}
        >
          {foods.length > 0 &&
            foods.map((item, index) => (
              <FeaturedCard key={item.id} item={item} index={index} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default FoodPage;
