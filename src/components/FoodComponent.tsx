'use client'

import React from "react";
import Title from '@/src/components/Title'
import FeaturedCard from "./FeaturedCard";
import { useRouter } from 'next/navigation.js';
import { food_list } from "@/src/constants/data";
import Button from "./Button";

interface FeaturedProps {
  className?: string
}


const FoodAds = ({className}: FeaturedProps) => {

  return (
    <div
      className={`${className} flex flex-col text-black items-center px-6 bg-no-repeat bg-cover bg-center`}
    >
      <div className="flex flex-1 items-center justify-between pt-10 gap-12">
        <div className="items-center justify-between flex flex-1">
          <div>
            <Title title={"Trending Food Spots"} className="text-start" />
          </div>
          {/* <div>
          <button
            onClick={() => {
              navigate("/pages/ads");
              scrollTo(0, 0);
            }}
            className="my-16 px-4 py-2 text-sm font-medium border border-gray-300 rounded bg-white hover:bg-gray-50 transition-all cursor-pointer"
          >
            View all Apartments{" "}
          </button>
        </div> */}
        </div>
        <div>
          <Button
            text="View All"
            onClick={() => "/food"}
            className="cursor-pointer"
          />
        </div>
      </div>

      <div
        className="flex flex-1 overflow-x-scroll items-center justify-center gap-x-2"
        style={{ maxWidth: "100%" }}
      >
        {food_list.map((item, index) => (
          <FeaturedCard key={item.id} item={item} index={index} />
        ))}
      </div>

      {/* <button
        onClick={() => {
          navigate("/");
          scrollTo(0, 0);
        }}
        className="my-16 px-4 text-sm font-medium border border-gray-300 rounded bg-white hover:bg-gray-50 transition-all cursor-pointer"
      >
        View all Destination{" "}
      </button> */}
    </div>
  );
};

export default FoodAds;
