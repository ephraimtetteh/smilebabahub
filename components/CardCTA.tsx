import React from "react";
import Button from "./Button";
import { assets } from "../assets/assets";
import { CTAProps } from "@/types/types";
import Image from "next/image";

const CTA = ({ text, desc, image }: CTAProps) => {
  return (
    <div
      className=" rounded-xl flex flex-row items-start flex-1 relative mb-5 backdrop-blur-4xl"
    >
      <div className="text-black/90">
        <div className="relative ">
          <Image src={image} alt="" className="w-20 rounded-2xl" />
          <div className="absolute bg-black/20 w-20 top-0 right-0 left-0 bottom-0 rounded-2xl"></div>
          <p className="p-3 uppercase text-[8px] absolute text-white bottom-0.5 left-0 right-0 text-center">{text}</p>
        </div>
      </div>
    </div>
  );
};

export default CTA;
