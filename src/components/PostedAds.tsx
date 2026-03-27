"use client";

import React from "react";
import Title from "@/src/components/Title";
import { usePathname, useRouter } from "next/navigation.js";
import { Products } from "../constants/data";
import OldFeaturedCard from "./OldFeatureCard";

interface FeaturedProps {
  className?: string;
}

  const PostedAds = ({ className }: FeaturedProps) => {
  const router = useRouter();

  const navigate = (path: string) => {
    router.push(path);
  };

  return (
    <div
      className={`${className} flex flex-col text-black items-center  bg-no-repeat bg-cover bg-center`}
    >
      <div className=" flex items-center justify-between relative gap-12">
        <div className="">
          <Title title={"Posted Ads"} />
        </div>
        <div>
          <button
            onClick={() => {
              navigate("/restate");
              scrollTo(0, 0);
            }}
            className="my-16 px-4 py-2 text-sm font-medium border border-gray-300 rounded bg-white hover:bg-gray-50 transition-all cursor-pointer"
          >
            View All
          </button>
        </div>
      </div>

      <div
        className="w-full grid grid-cols-2 lg:flex flex-1 flex-wrap lg:overflow-x-scroll items-center justify-center gap-2"
        style={{ maxWidth: "100%" }}
      >
        {Products.map((item, index) => (
          <OldFeaturedCard key={item.id} item={item} index={index} />
        ))}
      </div>
    </div>
  );
};

export default PostedAds;
