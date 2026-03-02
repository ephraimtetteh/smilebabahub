'use client'

import Hero from "@/src/components/Hero";
import PostedAds from "@/src/components/PostedAds";
import Promo from "@/src/components/Promo";
import FoodAds from "@/src/components/FoodComponent";
import Video from "@/src/components/Video";
import React from "react";
import AppDownload from "@/src/components/App";
import Radio from "@/src/components/Radio";
import Button from "../components/Button";
import FeaturedProducts from "../components/FeaturedProducts";


const page = () => {
  return (
    <div className="w-full flex flex-col flex-1 items-center justify-center pt-20 relative">
      <Hero />
      <div className="w-full flex flex-col px-4 md:px-16 lg:px-14 xl:px-12">
        <Promo />
        <FoodAds />
        <FeaturedProducts />
      </div>
      <div className="items-center justify-center w-full gap-8 px-3 lg:px-12 mt-10 mb-5">
        <div className="w-full">
          <h1 className="lg:text-4xl font-bold py-12 capitalize text-center">
            Promote your Business & products <br /> Live On smileBaba TV
          </h1>
          <Video />
        </div>
      </div>
      <AppDownload />
      <div className=" fixed right-5 bottom-5 z-40 rounded-2xl">
        <Radio />
      </div>
    </div>
  );
};

export default page;
