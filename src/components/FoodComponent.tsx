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
  const router = useRouter()
  const navigate = (path: string) => {
    router.push(path);
  };

  return (
    <div
      className={`${className} flex flex-col text-black items-center px-6 bg-no-repeat bg-cover bg-center`}
    >
    
        <div className=" flex items-center justify-between relative gap-12">
          <div className="">
            <Title title={"Food & Restaurant"} />
          </div>
          <div>
            <button
              onClick={() => {
                navigate("/food");
                scrollTo(0, 0);
              }}
              className="my-16 px-4 py-2 text-sm font-medium border border-gray-300 rounded bg-white hover:bg-gray-50 transition-all cursor-pointer"
            >
              View all Foods{" "}
            </button>
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
