import React from "react";
import { assets } from "../assets/assets";
import Link from "next/link";
import Image from "next/image";
import { CardComponentProps } from "@/src/types/types";



const FeaturedCard = ({ item, index }: CardComponentProps) => {
  return (
    <Link
      href={`/product/${item.id}`}
      key={index}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="relative lg:max-w-70 max-w-55 w-full rounded-xl shrink-0 bg-transparent border-white/20 border text-white shadow"
    >
      <Image
        src={item.images?.[0] || assets.upload_area}
        alt={""}
        width={280}
        height={200}
        className="rounded lg:w-280 w-220"
      />

      {index % 2 === 0 && (
        <p className="px-3 py-1 absolute top-3 left-3 text-xs bg-white text-gray-800 font-medium rounded-full">
          Best Seller
        </p>
      )}

      <div className="p-2 pt-3">
        <div className="flex items-center justify-between">
          <p className="font-playfair lg:text-lg text-[14px] lg:font-medium text-black">
            {item.seller?.name || "unkwon"}
          </p>
          <div className="flex items-center gap-1">
            <Image
              src={assets.starIconFilled}
              alt="rating"
              width={16}
              height={16}
            />
            4.5
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500 mt-1">
          <Image
            src={assets.locationIcon}
            alt="location"
            width={14}
            height={14}
          />
          <span>{item.location?.city}</span>
        </div>
        <div className="flex items-center justify-between mt-3">
          <p className="text-sm text-gray-600">
            $
            <span className="text-lg font-semibold text-black ml-1">
              {item.price}
            </span>
          </p>
        </div>
      </div>
    </Link>
  );
};

export default FeaturedCard;
