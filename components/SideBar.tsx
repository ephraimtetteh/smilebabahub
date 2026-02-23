import { cardCategories } from '@/constants/cardCategories';
import React from 'react'
import { FaChevronRight } from "react-icons/fa6";
import Card from './Card';
import Promo from './Promo';


const SideBar = () => {
  return (
    <div className="flex flex-col justify-between px-3 md:px-4 lg:px-24 xl:px-32">
      <div className="w-full flex items-start  text-black py-10 gap-4">
        <aside className=" hidden lg:block rounded pb-4 lg:w-[30%]">
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
          
        </aside>
        <main className=" w-full max-sm:h-[30%] lg:w-[70%] items-center justify-center ">
          <div className=" bg-black/20 text-white mb-4 rounded">
            <h1 className="items-center justify-center font-bold text-5xl text-center py-60">
              Video goes here
            </h1>
          </div>
          <Card />
          <div className="grid lg:flex gap-4">
            <div className="w-50"></div>
          </div>
        </main>
      </div>
      <Promo />
    </div>
  );
}

export default SideBar