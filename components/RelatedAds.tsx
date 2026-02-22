'use client'

import React from "react";
import Title from '@/components/Title'
import FeaturedCard from "./FeaturedCard";
import { useRouter } from 'next/navigation.js';
import { food_list } from "@/constants/data";

interface FeaturedProps {
  className?: string
}


const RelatedAds = ({className}: FeaturedProps) => {

  return (
    <div
      className={`${className} flex flex-col text-black items-center justify-center bg-amber-50 px-6 py-6 bg-no-repeat bg-cover bg-center`}
    >
      <Title title={"Food for you"} />

      <div
        className="flex flex-1 overflow-x-scroll items-center justify-center py-4 gap-x-2 mt-5"
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

export default RelatedAds;
