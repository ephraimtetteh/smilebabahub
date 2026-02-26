'use client'

import React from "react";
import { Products } from "../assets/assets";
import Title from '@/src/components/Title'
import FeaturedCard from "./FeaturedCard";
import { usePathname, useRouter } from 'next/navigation.js';

interface FeaturedProps {
  className?: string
}


const FeaturedProducts = ({className}: FeaturedProps) => {
  const router = useRouter()

  const navigate = ( path:string) => {
    router.push(path)
  };

  return (
    <div className={`${className} flex flex-col text-black items-center px-6 bg-no-repeat bg-cover bg-center`}>
   
      <Title
        title={"Browse our market place"}
        
      />

      <div className="w-full flex overflow-x-scroll items-center justify-center gap-5 ">
        {Products.map((item, index) => (
          <FeaturedCard key={index} item={item} index={index} />
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

export default FeaturedProducts;
