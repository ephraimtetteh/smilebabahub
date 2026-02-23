import React from 'react'
import { IoRadioOutline } from "react-icons/io5";
import { FaHeart } from "react-icons/fa";

const Radio = () => {
  return (
    <div className="px-4 md:px-16 lg:px-14 xl:px-12">
      <div className="bg-amber-950 border-3 border-[#d8a304] rounded-2xl flex flex-col flex-1 p-2 text-white mt-2">
          <IoRadioOutline size={28} fill="#ffc105" className="text-[#ffc105]" />
        <div className="flex flex-1 items-center justify-between">
          <div className="text-center">
            <h3 className="text-2xl font-semibold">
              smileBaba <span className="text-[#ffc105]">Radio</span>
            </h3>
            <p className="text-[16px]">Live MarketPlace Vibes</p>
          </div>
          <div className="flex flex-col gap-2 items-center text-center justify-center">
            <small className="bg-rose-800 px-1 font-bold text-[18px] rounded">
              Live
            </small>
            <FaHeart fill="red" />
          </div>
        </div>
        <div className="flex flex-1 flex-row py-2">
          <audio
            controls
            preload="none"
            src="http://197.251.202.99:8000/s24radio"
            className=""
          ></audio>
        </div>
      </div>
    </div>
  );
}

export default Radio