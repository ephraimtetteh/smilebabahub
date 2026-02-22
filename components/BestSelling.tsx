'use client'

import React from "react";
import { Products } from "../assets/assets";
import Title from '@/components/Title'
import FeaturedCard from "./FeaturedCard";
import { usePathname, useRouter } from 'next/navigation.js';

interface FeaturedProps {
  className?: string
}


const BestSelling = ({className}: FeaturedProps) => {
  const router = useRouter()

  const navigate = ( path:string) => {
    router.push(path)
  };

  return (
    <div className={`${className} flex flex-col text-black items-center px-6 md:px-16 lg:px-24 py-6 bg-[#d6c8c5] bg-no-repeat bg-cover bg-center`}>
   
      <Title
        title={"Best Selling Ads"}
        
      />

      <div className="flex flex-1 overflow-x-scroll items-center justify-center gap-5" style={{ maxWidth: '100%'}}>
        {Products.map((item, index) => (
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

export default BestSelling;
