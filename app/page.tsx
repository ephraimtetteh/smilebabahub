import BestSelling from "@/components/BestSelling";
import Hero from "@/components/Hero";
import Hub from "@/components/Hub";
import PostedAds from "@/components/PostedAds";
import Promo from "@/components/Promo";
import FoodAds from "@/components/FoodComponent";
import Video from "@/components/Video";
import React from "react";

const page = () => {
  return (
    <div className="w-full flex flex-col flex-1 items-center justify-center pt-20">
      <Hero />
      <div className="w-full flex flex-col px-4 md:px-16 lg:px-14 xl:px-12">
        <FoodAds />
        <Promo />
        <PostedAds />
        {/* <BestSelling /> */}
      </div>
    </div>
  );
};

export default page;
