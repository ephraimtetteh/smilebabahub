'use client'

import React from "react";

import Title from '@/src/components/Title'
import FeaturedCard from "./FeaturedCard";
import { usePathname, useRouter } from 'next/navigation.js';
import { products } from "../utils/data/generateProducts";
import { Products } from "../constants/data";

interface FeaturedProps {
  className?: string
}


const FeaturedProducts = ({className}: FeaturedProps) => {
  const router = useRouter()

  const navigate = ( path:string) => {
    router.push(path)
  };

   const marketplace = Products.filter((item) => item.category === "marketplace");

  return (
    <div
      className={`${className} flex flex-col text-black items-center px-3 bg-no-repeat bg-cover bg-center`}
    >
      <div className=" flex items-center justify-between relative gap-12">
        <div className="">
          <Title title={"Browse our marketplace"} />
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
        className="w-full grid grid-cols-2 lg:flex flex-1 flex-wrap lg:overflow-x-scroll items-center justify-center gap-4"
        style={{ maxWidth: "100%" }}
      >
        {marketplace.slice(0, 20).map((item, index) => (
          <FeaturedCard key={index} item={item} index={index} />
        ))}
      </div>
    </div>
  );
};

export default FeaturedProducts;
