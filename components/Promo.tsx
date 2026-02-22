'use client'

import React from "react";
import { Products } from "../assets/assets";
import Title from '@/components/Title'
import FeaturedCard from "./FeaturedCard";
import { usePathname, useRouter } from 'next/navigation.js';
import { realEstate } from "@/constants/data";

interface FeaturedProps {
  className?: string
}


const Promo = ({className}: FeaturedProps) => {
  const router = useRouter()

  const navigate = ( path:string) => {
    router.push(path)
  };

  return (
    <div
      className={`${className} w-full flex flex-col text-black items-center px-3 py-6 bg-no-repeat bg-cover bg-center`}
    >
      <div className="items-center justify-between flex flex-1">
        <div>
          <Title title={"Popular Apartments"} className="text-start" />
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

      <div
        className="flex flex-1 overflow-x-scroll items-center justify-center gap-x-2"
        style={{ maxWidth: "100%" }}
      >
        {realEstate.slice(0, 8).map((item, index) => (
          <FeaturedCard key={item.id} item={item} index={index} />
        ))}
      </div>
    </div>
  );
};

export default Promo;
