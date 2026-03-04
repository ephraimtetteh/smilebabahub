'use client'

import { assets } from '@/src/assets/assets';
import Image from 'next/image';
import React from 'react'
import SearchBar from './SearchBar';

const Hero = () => {
  return (
    <div className="relative lg:h-[50vh] h-[30vh] w-full lg:py-10 overflow-hidden">
      <Image
        src={assets.heroImage}
        alt="Background"
        fill
        priority
        className="object-cover w-full"
      />
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="absolute top-0 left-0 p-12 w-full ">
        <div className="max-w-xl py-12">
          <h3 className="text-3xl font-semibold text-black max-w-full uppercase">
            find food, homes <br /> & Everything you need - <br /> All in one Place
          </h3>
        </div>
        <div className="hidden lg:block lg:w-full">
          <SearchBar />
        </div>
      </div>
    </div>
  );
}

export default Hero