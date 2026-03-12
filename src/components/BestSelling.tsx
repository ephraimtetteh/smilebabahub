'use client'

import React from "react";
import Title from '@/src/components/Title'
import FeaturedCard from "./FeaturedCard";
import { useRouter } from 'next/navigation.js';
import { products } from "../utils/data/generateProducts";

interface FeaturedProps {
  className?: string
}


const BestSelling = ({className}: FeaturedProps) => {
  const router = useRouter()

  const navigate = ( path:string) => {
    router.push(path)
  };

  return (
    <div
      className={`${className} flex flex-col text-black items-center px-6 py-3 bg-no-repeat bg-cover bg-center`}
    >
      <Title title={"Best Selling Ads"} />

      <div
        className="flex flex-1 overflow-x-scroll items-center justify-center gap-5"
        style={{ maxWidth: "100%" }}
      >
        {products.slice(0, 20).map((item, index) => (
          <FeaturedCard key={item.id} item={item} index={index} />
        ))}
      </div>
    </div>
  );
};

export default BestSelling;
