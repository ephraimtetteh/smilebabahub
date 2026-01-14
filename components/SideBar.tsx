import { cardCategories } from '@/constants/cardCategories';
import React from 'react'
import { FaChevronRight } from "react-icons/fa6";
import Card from './Card';
import { IoRadioOutline } from "react-icons/io5";
import { FaHeart } from "react-icons/fa";
import Promo from './Promo';


const SideBar = () => {
  return (
    <div className="flex items-start justify-between px-6 md:px-16 lg:px-24 xl:px-32 text-black py-10 gap-4">
      <aside className=" rounded pb-4 w-[30%]">
        <h3 className="text-2xl pb-4">Our Categories</h3>
        <div className="bg-white shadow-2xl">
          {cardCategories.slice(0, 9).map((item) => {
            return (
              <article
                key={item.id}
                className="border-b border-gray-200 p-4 flex flex-1 justify-between items-center gap-3"
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  {item.name}
                </div>
                <div>
                  <FaChevronRight className="bg-gray-100 p-2 size-7 rounded-full" />
                </div>
              </article>
            );
          })}
        </div>

        <div className="bg-amber-950 border-3 border-[#d8a304] rounded-2xl flex flex-col flex-1 p-2 text-white mt-2">
          <div className="flex flex-1 items-center justify-between py-4 px-3">
            <IoRadioOutline
              size={28}
              fill="#ffc105"
              className="text-[#ffc105]"
            />
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
      </aside>

      <main className="w-full items-center justify-center ">
        <div className=" bg-black/20 text-white mb-4 rounded">
          <h1 className="items-center justify-center font-bold text-5xl text-center py-60">
            Video goes here
          </h1>
        </div>

        <Card />
        <Promo />

        <div className="grid lg:flex gap-4">
          <div className="w-50"></div>
        </div>
      </main>
    </div>
  );
}

export default SideBar