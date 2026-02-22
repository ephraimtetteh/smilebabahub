"use client";

import Hub from "@/components/Hub";
import PostedAds from "@/components/PostedAds";
import RelatedAds from "@/components/RelatedAds";
import SearchBar from "@/components/SearchBar";
import React from "react";

const FoodPage = () => {
  return (
    <div className="w-full flex flex-col flex-1 items-center px-4 md:px-16 lg:px-14 xl:px-12 justify-center pt-30">
      <Hub />
      <SearchBar />
      <div className="w-full">
        <RelatedAds />
        <PostedAds />
      </div>
    </div>
  );
};

export default FoodPage;
