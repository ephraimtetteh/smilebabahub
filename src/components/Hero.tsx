'use client'

import { assets, Products } from '@/src/assets/assets';
import Image from 'next/image';
import React from 'react'
import Button from './Button';
import Link from 'next/link';
import Video from './Video';
import { IoRadioSharp } from "react-icons/io5";
import SearchBar from './SearchBar';

const Hero = () => {
  return (
    <div className="relative h-[10vh] w-full py-30">
      <Image
        src={assets.bgImage}
        alt="Background"
        fill
        priority
        className="object-cover w-full"
      />
      <div className="absolute inset-0 bg-black/40"></div>
      <div className="absolute top-0 left-0 p-12 w-full ">
        <div className="max-w-xl py-2">
          <h3 className="text-3xl  font-semibold text-white max-w-full uppercase">
            find food, homes <br /> & Everything you need - <br /> All in one Place
          </h3>
        </div>
        <div className="w-full">
          <SearchBar />
        </div>
      </div>
    </div>
  );
}

export default Hero