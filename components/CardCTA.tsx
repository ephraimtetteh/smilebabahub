import React from "react";
import { CTAProps } from "@/types/types";
import Image from "next/image";

const CTA = ({ text, desc, image }: CTAProps) => {
  return (
    <div className=" rounded-xl flex flex-row items-center justify-center flex-1 relative mb-5 backdrop-blur-4xl">
      <div className="text-black/90">
        <div className="relative p-2 flex flex-col items-center justify-between text-center">
          <Image src={image} alt="" className="flex mx-auto w-20 h-20 border border-black p-2 items-center justify-center bg-contain rounded-full text-center" />
          <p className="p-3 uppercase text-[8px]  text-center">
            {text}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CTA;
