'use client'

import { hubs, images } from '@/src/constants/data';
import React, { useState } from 'react'
import cn from "clsx";
import Image from 'next/image';
import { assets } from '@/src/assets/assets';
import { Categories } from '@/src/constants/sellFormData';
import CTA from './CardCTA';
import Link from 'next/link';

const Hub = () => {
  const [active, setActive] = useState('')
  const [stopScroll, setStopScroll] = useState(false);


  return (
    <div className="flex flex-col pb-4 items-center justify-center max-w-full ">
      <div className="w-full lg:flex lg:flex-row flex-1 gap-3 relative">
        {hubs.map((hub, index) => (
          <Link href={hub.link}
            key={index}
            className={`cn(
              "w-full h-48 my-3 rounded-xl overflow-hidden shadow-lg flex items-center gap-5",
              index % 2 === 0 ? "flex-row-reverse" : "flex-row",  ${active === hub.title ? "border-amber-500 border-2" : ""}
            )`}
            style={{ backgroundColor: hub.color }}
            onClick={() => setActive(hub.title)}
          >
            <div className="h-full w-1/2">
              <Image src={hub.image} alt="" className="size-full bg-contain " />
            </div>
            <div
              className={cn(
                "flex-1 h-full flex flex-col justify-center items-start gap-4",
                index % 2 === 0 ? "pl-10" : "pr-10",
              )}
            >
              <h3 className=" text-white leading-tight text-2xl font-bold">
                {hub.title}
              </h3>
              {/* <Image src={assets.arrow} alt="" className="size-5 bg-contain" /> */}
            </div>
          </Link>
        ))}
      </div>

      <div
        className="flex flex-row flex-1 gap-x-3 overflow-hidden w-full relative max-w-6xl"
        onMouseEnter={() => setStopScroll(true)}
        onMouseLeave={() => setStopScroll(false)}
      >
        <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none bg-linear-to-r from-white to-transparent" />
        <div
          className="marquee-inner flex w-fit"
          style={{
            animationPlayState: stopScroll ? "paused" : "running",
            animationDuration: Categories.length * 2500 + "ms",
          }}
        >
          <div className='flex gap-3'>
            {Categories.map((item, index) => (
              <CTA
                key={item.id}
                image={
                  index % 2 === 0
                    ? images.burgerTwo
                    : images.newYork
                      ? images.pizzaOne
                      : images.buritto
                }
                text={item.id}
              />
            ))}
          </div>
        </div>
        <div className="absolute right-0 top-0 h-full w-20 md:w-40 z-10 pointer-events-none bg-linear-to-l from-white to-transparent" />
      </div>
    </div>
  );
}

export default Hub