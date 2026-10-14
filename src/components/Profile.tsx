"use client";

import Image from "next/image";
import React from "react";
import { IoPerson } from "react-icons/io5";
import { FaRegMessage } from "react-icons/fa6";
import { GoVerified } from "react-icons/go";
import { ProductProps } from "../types/types";


interface ProfileProps {
  item: ProductProps;
}

const Profile = ({ item }: ProfileProps) => {
  return (
    <div className="bg-white shadow p-3 mb-4 h-auto rounded-lg">
      {/* Seller Image (using first product image temporarily) */}
      <div className="w-16 h-16 relative">
        <Image
          width={60}
          height={60}
          src={item.images?.[0]}
          alt={item.seller.name}
          className="rounded-full object-cover"
        />
      </div>

      <div className="flex flex-col mt-2">
        {/* Seller Name */}
        <h1 className="font-medium text-xl py-1">{item.seller.name}</h1>

        <p className="gap-2 grid">
          <span className="flex gap-2 items-center text-[12px] bg-amber-50 px-2 text-[#454343] rounded-full w-fit">
            <IoPerson />
            Seller ID: {item.seller.id}
          </span>

          <span className="flex gap-2 items-center text-[12px] bg-amber-50 px-2 text-[#454343] rounded-full w-fit">
            <GoVerified />
            Verified Seller
          </span>
        </p>

        <small className="flex gap-2 items-center text-[12px] bg-red-50 px-2 text-[#454343] rounded-full w-fit my-2">
          <FaRegMessage />
          Typically responds within an hour
        </small>

        {/* Seller Phone */}
        <p className="text-sm text-gray-600">Contact: {item.seller.phone}</p>
      </div>
    </div>
  );
};

export default Profile;
