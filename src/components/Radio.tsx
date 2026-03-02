import React from 'react'
import { IoRadioOutline } from "react-icons/io5";
import { FaHeart } from "react-icons/fa";

const Radio = () => {
  return (
    <div className="px-4 md:px-16 lg:px-14 xl:px-12">
      <div className="bg-amber-950 border-3 border-[#d8a304] rounded-2xl flex flex-col flex-1 p-2 text-white mt-2">
        <IoRadioOutline size={28} fill="#ffc105" className="text-[#ffc105] items-center text-center mx-auto" />
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center ">
            <h3 className="lg:text-2xl font-semibold py-2">
              SmileBaba <br /><span className="text-[#ffc105]">Radio</span>
            </h3>
            <p className="hidden lg:block text-[16px] text-red-500 pb-2">Live MarketPlace Vibes</p>
          </div>
        </div>
        <div className="">
          <audio
            controls
            preload="none"
            // src="http://197.251.202.99:8000/s24radio"
            src={
              "https://video2.getstreamhosting.com:2020/AudioPlayer/8244?mount=/stream&"
            }
            className=""
          ></audio>
        </div>
      </div>
    </div>
  );
}

export default Radio