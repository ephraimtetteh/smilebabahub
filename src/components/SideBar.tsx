import { cardCategories } from '@/src/constants/cardCategories';
import React from 'react'
import { FaChevronRight } from "react-icons/fa6";
import Card from './Card';
import Promo from './Promo';
import Video from './Video';


const SideBar = () => {
  return (
    <div className="flex flex-col justify-between px-3">
        <aside className=" hidden lg:block rounded pb-4">
          <h3 className="text-[16px] pb-4">Our Categories</h3>
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
        </aside>
      {/* <div className="w-full flex items-start  text-black py-10 gap-4">
        <main className=" w-full max-sm:h-[30%] items-center justify-center ">
          <div className=" mb-4 rounded">
            <h3 className="lg:text-2xl p8-4 capitalize font-bold text-center">Advertise Live on smilebabahub TV</h3>
            <Video />
          </div>
        </main>
      </div>
      <Promo /> */}
    </div>
  );
}

export default SideBar