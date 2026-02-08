import { assets, Products } from '@/assets/assets';
import Image from 'next/image';
import React from 'react'
import Button from './Button';
import Link from 'next/link';
import Video from './Video';
import { IoRadioSharp } from "react-icons/io5";

const Hero = () => {
  return (
    <div className="relative py-10">
      <Image
        src={assets.bgImage}
        alt="Background"
        fill
        priority
        className="object-cover"
      />
    </div>
  );
}

export default Hero