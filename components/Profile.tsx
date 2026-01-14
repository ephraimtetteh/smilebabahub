import { Products } from '@/assets/assets';
import Image from 'next/image';
import React from 'react'
import { IoPerson } from "react-icons/io5";
import { FaRegMessage } from "react-icons/fa6";
import { GoVerified } from "react-icons/go";

const Profile = () => {
  return (
    <div className="bg-white shadow p-3 mb-4 h-auto">
      <div className="w-15">
        <Image
          width={30}
          height={30}
          src={Products[0].author_img}
          alt=""
          className="w-15"
        />
      </div>
      <div className="flex flex-col">
        <h1 className="font-medium text-xl py-2">Smile View Apartments</h1>
        <p className="gap-3 grid">
          <span className="flex gap-2 items-center text-[12px] bg-amber-50 px-2 text-[#454343] rounded-full">
            <IoPerson />
            2+ on SmileBaba market place
          </span>
          <span className="flex gap-2 items-center text-[12px] bg-amber-50 px-2 text-[#454343] rounded-full w-fit">
            <GoVerified />
            Verified ID
          </span>
        </p>
        <small className="flex gap-2 items-center text-[12px] bg-red-50 px-2 text-[#454343] rounded-full w-fit my-2">
          <FaRegMessage />
          typically response within an hour
        </small>
      </div>
    </div>
  );
}

export default Profile