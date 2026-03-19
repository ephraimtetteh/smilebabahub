import React from "react";
import MarketplaceSearch from "./NewSearch";
import Radio from "./Radio";

const Hero = () => {
  return (
    <>
      {/* FIXED HERO — stays in place while page scrolls beneath it */}
      <div className=" relative max-sm:fixed max-sm:top-0 max-sm:left-0 w-full h-[40vh] sm:h-[40vh] lg:h-[60vh] bg-[#ffd700] overflow-hidden z-20">
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-8">
          <div className="max-w-3xl text-center pt-20 max-sm:pt-24">
            <h3 className="text-xl sm:text-4xl lg:text-6xl font-semibold text-black/80 leading-tight capitalize">
              Find food, homes <br className="hidden sm:block" />
              & everything you need —
              <br className="hidden sm:block" />
              all in one place
            </h3>
          </div>

          <div className="w-full mt-2 pb-4 flex justify-center">
            <div className="w-full max-w-5xl max-sm:mb-5">
              <MarketplaceSearch />
              <Radio />
            </div>
          </div>
        </div>
      </div>

      {/* SPACER — reserves the hero's height so content starts below it */}
      <div className="max-sm:h-[40vh] w-full shrink-0" />
    </>
  );
};

export default Hero;
