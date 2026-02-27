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


const page = () => {
  return (
    <div className="w-full flex flex-col flex-1 items-center justify-center pt-20 relative">
      <Hero />
      <div className="w-full flex flex-col px-4 md:px-16 lg:px-14 xl:px-12">
        <Promo />
        <FoodAds />
        <PostedAds />
      </div>
      <div className="lg:flex lg:flex-row items-center justify-center w-full gap-8 px-3 lg:px-12 mt-10 ">
        <div className="lg:w-[60%]">
          <h1 className="text-2xl font-bold pb-4">
            Promote your products Live TV
          </h1>
          <Video />
        </div>
        <div className=" lg:max-w-[50%] bg-amber-950 text-white shadow-2xl shadow-neutral-200 rounded-2xl py-20 px-15 mt-10 items-center justify-center text-center">
          <h1 className="text-6xl font-bold py-2">
            Advertise your business on smilebabahub
          </h1>
          <p className="font-semibold text-[20px]">
            Reach thousands of buyers daily
          </p>
          <div className="py-2">
            <Button text="Advertise Now" onClick={() => "/sell"} />
          </div>
        </div>
      </div>
      <AppDownload />
      <div className=" fixed right-5 bottom-5 z-40 shadow-2xl rounded-2xl">
        <Radio />
      </div>
    </div>
  );
};

export default page;
