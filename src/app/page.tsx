import BestSelling from "@/src/components/BestSelling";
import Hero from "@/src/components/Hero";
import Hub from "@/src/components/Hub";
import PostedAds from "@/src/components/PostedAds";
import Promo from "@/src/components/Promo";
import FoodAds from "@/src/components/FoodComponent";
import Video from "@/src/components/Video";
import React from "react";
import AppDownload from "@/src/components/App";
import Radio from "@/src/components/Radio";


const page = () => {
  return (
    <div className="w-full flex flex-col flex-1 items-center justify-center pt-20">
      <Hero />
      <div className="w-full flex flex-col px-4 md:px-16 lg:px-14 xl:px-12">
        {/* ------------------------ puls vidoe ================= */}
        <div className="flex items-start w-full gap-8">
          <div className="w-[75%]">
            <Promo />
          </div>
          <div className="w-[25%] bg-white shadow-2xl shadow-neutral-200 rounded-2xl py-4 max-w-full">
            <h1 className="text-2xl font-bold pb-4">Live TV</h1>
            <Video />
          </div>
        </div>
        
        <FoodAds />

        {/* ------------------------ puls radio ================= */}
        <div className="flex items-center w-full gap-8">
          <div className="w-[75%]">
            <PostedAds />
          </div>
          <div className="w-[25%] bg-white shadow-2xl shadow-neutral-200 rounded-2xl py-4 max-w-full">
            <Radio />
          </div>
        </div>
        {/* <BestSelling /> */}
        <AppDownload />
      </div>
    </div>
  );
};

export default page;
