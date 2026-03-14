'use client'

import { assets } from '@/src/assets/assets';
import Image from 'next/image';
import React, { useEffect } from 'react'
import AOS from "aos";
import "aos/dist/aos.css";
import MarketplaceSearch from './NewSearch';
import SearchBar from './SearchBar';

const Hero = () => {

  useEffect(() => {
    AOS.init({
      once: true,
      duration: 800,
    });
  }, []);

  return (
    <div className="relative w-full h-[40vh] sm:h-[45vh] lg:h-[55vh] overflow-hidden">
      {/* Background Image */}
      <Image
        src={assets.heroImage}
        alt="Background"
        fill
        priority
        className="object-cover"
      />

      {/* Overlay */}
      {/* <div className="absolute inset-0 bg-black/10"></div> */}

      {/* Content */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-8"
        data-aos="slide-up"
      >
        {/* Heading */}
        <div className="max-w-3xl text-center">
          <h3 className="text-xl sm:text-3xl lg:text-5xl font-semibold text-black/80 leading-tight capitalize">
            Find food, homes <br className="hidden sm:block" />
            & everything you need —
            <br className="hidden sm:block" />
            all in one place
          </h3>
        </div>

        {/* Search Section */}
        <div className="w-full mt-6 sm:mt-8 flex justify-center">
          <div className="w-full max-w-5xl max-sm:mb-5">
            <MarketplaceSearch />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero