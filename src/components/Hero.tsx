import React from "react";
import MarketplaceSearch from "./NewSearch";
import Radio from "./Radio";

const Hero = () => {
  return (
    <>
      <>
        {/* HERO */}
        <div className="fixed sm:relative top-0 left-0 w-full z-20 bg-[#ffd700]">
          <div className="flex flex-col items-center justify-center px-4 sm:px-8 py-16 sm:py-20 lg:py-28 text-center">
            {/* TEXT */}
            <div className="max-w-3xl">
              <h3 className="text-2xl sm:text-4xl lg:text-6xl font-semibold text-black/80 leading-tight capitalize">
                Find food, homes <br className="hidden sm:block" />
                & everything you need —
                <br className="hidden sm:block" />
                all in one place
              </h3>
            </div>

            {/* SEARCH + RADIO */}
            <div className="w-full max-w-5xl mt-6 space-y-4">
              <MarketplaceSearch />
              <Radio />
            </div>
          </div>
        </div>

        {/* SPACER (only for mobile) */}
        <div className="block sm:hidden h-[350px]" />
      </>
    </>
  );
};

export default Hero;
