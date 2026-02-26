import React from "react";
import { assets } from "../assets/assets";
import Link from "next/link";
import Image from "next/image";
import { CardComponentProps } from "@/src/types/types";



const FeaturedCard = ({ item, index }: CardComponentProps) => {
  return (
    <Link
      href={`/product/${item.id}`}
      onClick={() => scrollTo(0, 0)}
      key={item.id}
      className="relative max-w-70 w-full rounded-xl shrink-0 bg-transparent border-white/20 border text-white shadow-xl"
    >
      <Image src={item.image} alt="" className="" width={280} height={280} />

      {index % 2 === 0 && (
        <p className="px-3 py-1 absolute top-3 left-3 text-xs bg-white text-gray-800 font-medium rounded-full">
          Best Seller
        </p>
      )}

      <div className="p-4 pt-5">
        <div className="flex items-center justify-between">
          <p className="font-playfair text-xl font-medium text-black">
            {item.author}
          </p>
          <div className="flex items-center gap-1">
            <Image src={assets.starIconFilled} alt="" />
            4.5
          </div>
        </div>
        <div className="flex items-center gap-1 text-sm">
          <Image src={assets.locationIcon} alt="" />
          <span>{item.category}</span>
        </div>
        <div className="flex text-black items-center justify-between mt-4">
          <p>
            $<span className="text-xl text-black">{item.price}</span>{" "}
            /night
          </p>
          <button className="px-4 py-2 text-sm bg-[#ffc105] text-black font-semibold rounded hover:border-[#ffc105] hover:bg-transparent transition-all cursor-pointer hover:text-white">
            View Details
          </button>
        </div>
      </div>
    </Link>
  );
};

export default FeaturedCard;
