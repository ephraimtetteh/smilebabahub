import Hero from "@/src/components/Hero";
import Video from "@/src/components/Video";
import React from "react";
import AppDownload from "@/src/components/App";
import FeaturedProducts from "../components/FeaturedProducts";

const HomePage = () => {
  return (
    <div className="w-full flex flex-col flex-1 items-center justify-center max-relative">
      {/* Hero renders the fixed background + a spacer div */}
      <Hero />

      {/* Scrollable content — sits on top of the fixed hero via z-10 + white bg */}
      <div className="max-sm:relative w-full bg-white rounded-t-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.08)]">
        <div className="w-full flex flex-col px-4 md:px-16 lg:px-14 xl:px-12">
          <FeaturedProducts category="apartments" />
          <div className="items-center justify-center w-full gap-8 px-3 lg:px-12 mt-10 mb-5">
            <div className="w-full">
              <h1 className="lg:text-4xl font-bold py-12 capitalize text-center">
                Promote your Business & products <br /> Live On smileBaba TV
              </h1>
              <Video />
            </div>
          </div>
       
          <FeaturedProducts category="food" />
          <FeaturedProducts category="marketplace" />
        </div>
        <AppDownload />
      </div>
    </div>
  );
};

export default HomePage;
