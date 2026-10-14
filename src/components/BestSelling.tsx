'use client'

import React from "react";
import Title from '@/src/components/Title'
import { useRouter } from 'next/navigation.js';
import { Products } from "../constants/data";
import OldFeaturedCard from "./OldFeatureCard";

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
        className="w-full grid grid-cols-2 lg:flex flex-1 flex-wrap lg:overflow-x-scroll items-center justify-center gap-2"
        style={{ maxWidth: "100%" }}
      >
        {Products.slice(0, 20).map((item, index) => (
          <OldFeaturedCard key={item.id} item={item} index={index} />
        ))}
      </div>
    </div>
  );
};

export default BestSelling;
