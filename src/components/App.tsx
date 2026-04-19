import { assets } from "@/src/assets/assets";
import Image from "next/image";
import React from "react";

const AppDownload = () => {
  return (
    <section className="relative py-24 bg-[#111111] overflow-hidden rounded-t-2xl mt-10">
      {/* subtle texture */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, white 0, white 1px, transparent 1px, transparent 40px)",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto text-center px-4">
        {/* Heading */}
        <h3 className="font-serif text-3xl md:text-5xl text-white leading-tight">
          Get the SmileBabaHub App
        </h3>

        {/* Divider */}
        <div className="w-12 h-px bg-white/20 mx-auto my-6" />

        {/* Description */}
        <p className="text-white/60 text-sm md:text-base max-w-2xl mx-auto leading-relaxed mb-10">
          Buy food, find apartments, explore the marketplace, and stream live
          radio and TV — all in one place.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <Image
            src={assets.appStore}
            alt="Download on App Store"
            className="h-12 w-auto object-contain hover:scale-105 transition"
          />

          <Image
            src={assets.playStore}
            alt="Get it on Google Play"
            className="h-12 w-auto object-contain hover:scale-105 transition"
          />
        </div>
      </div>
    </section>
  );
};

export default AppDownload;
