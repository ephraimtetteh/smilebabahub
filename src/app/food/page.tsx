"use client";

import Hub from "@/src/components/Hub";
import PostedAds from "@/src/components/PostedAds";
import SearchBar from "@/src/components/SearchBar";
import React from "react";
import FoodAds from "@/src/components/FoodComponent";

const FoodPage = () => {
  return (
    <div className="w-full flex flex-col flex-1 items-center px-4 md:px-16 lg:px-14 xl:px-12 justify-center pt-30">
      <Hub />
      <SearchBar />
      <div className="w-full">
        <FoodAds />
        <PostedAds />
      </div>
    </div>
  );
};

export default FoodPage;
