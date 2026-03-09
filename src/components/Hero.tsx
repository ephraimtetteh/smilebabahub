'use client'

import { assets } from '@/src/assets/assets';
import Image from 'next/image';
import React, { useEffect } from 'react'
import AOS from "aos";
import "aos/dist/aos.css";

const Hero = () => {

  useEffect(() => {
    AOS.init({
      once: true,
      duration: 800,
    });
  }, []);

  return (
    <div className="relative lg:h-[50vh] h-[30vh] w-full lg:py-10 overflow-hidden">
      <Image
        src={assets.heroImage}
        alt="Background"
        fill
        priority
        className="object-cover w-full"
      />
      <div className="absolute inset-0"></div>
      <div className="absolute top-0 left-0 p-12 w-full " data-aos="slide-up">
        <div className="max-w-3xl py-12 items-center justify-center mx-auto">
          <h3 className="lg:text-5xl text-lg font-semibold text-black/80 max-w-full capitalize  text-center">
            find food, homes <br /> & Everything you need - <br /> All in one
            Place
          </h3>
        </div>
        {/* <div className="lg:block lg:w-full">
          <div className=" max-w-5xl w-full flex-1 shadow-lg bg-white/30 backdrop-blur-3xl items-center z-50 justify-center mx-auto rounded-full">
            <SearchBar />
          </div>
        </div> */}
      </div>
    </div>
  );
}

export default Hero