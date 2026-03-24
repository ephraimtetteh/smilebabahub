import React from "react";
import MarketplaceSearch from "./NewSearch";
import Radio from "./Radio";

const Hero = () => {
  return (
    <>
      <>
        {/* HERO */}
        <div className="relative sm:relative w-full bg-[#ffd700]">
          <div className="flex flex-col items-center justify-center px-4 sm:px-8 pt-16 sm:pt-10 lg:pt-18 text-center">
            {/* TEXT */}
            <div className="max-w-3xl">
              <h3 className="text-xl sm:text-2xl lg:text-4xl font-semibold text-black/80 leading-tight capitalize">
                Find food, homes <br className="hidden sm:block" />
                & everything you need —
                <br className="hidden sm:block" />
                all in one place
              </h3>
            </div>

            {/* SEARCH + RADIO */}
            <div className="w-full max-w-5xl mt-6 space-y-2">
              <MarketplaceSearch />
              <Radio />
            </div>
          </div>
        </div>

      </>
    </>
  );
};

export default Hero;
