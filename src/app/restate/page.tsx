'use client'

import FeaturedCard from '@/src/components/FeaturedCard';
import InputCompontent from '@/src/components/InputCompontent';
import NewLayout from '@/src/components/NewLayout';
import Radio from '@/src/components/Radio';
import Title from '@/src/components/Title';
import { realEstate } from '@/src/constants/data';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'
import AOS from "aos";

const RestatePage = () => {
   const router = useRouter()
      const navigate = (path: string) => {
        router.push(path);
      };

    
     useEffect(() => {
          AOS.init({
            once: true,
            duration: 800,
          });
        }, []);

  return (
    <div className="w-full flex flex-col flex-1 items-center px-4 md:px-16 lg:px-14 xl:px-12 justify-center pt-30">
      <NewLayout />
      <div className="w-[70%] group items-center justify-between grid grid-cols-3 lg:mt-15 shadow-2xl  mb-20 rounded-full bg-white text-black border border-gray-100 gap-2">
        <div className="mr-2 group-hover:bg-gray-100 group-hover:rounded-full  w-full rounded-full focus:ring-amber-300 focus:ring p-2 pl-4">
          <p className="px-2">Where</p>
          <InputCompontent
            type="text"
            placeholder="Search for your destination"
            value=""
            onChange={() => ""}
            className="border-none w-full outline-none"
          />
        </div>

        <div className="mr-2 group-hover:bg-gray-100 group-hover:rounded-full  w-full rounded-full focus:ring-amber-300 focus:ring p-2 pl-4 border-gray-300 border-l">
          <p className="p2-4">when</p>
          <InputCompontent
            type="date"
            placeholder="Search your favorite food"
            onChange={() => ""}
            className="border-none w-full outline-none "
          />
        </div>
        <div className="mr-2 group-hover:bg-gray-100 group-hover:rounded-full  w-full rounded-full focus:ring-amber-300 focus:ring p-2 pl-4 border-gray-300 border-l">
          <p className="px-2">Add guuest</p>
          <InputCompontent
            type="text"
            placeholder="Browse the marketplace"
            value=""
            onChange={() => ""}
            className="border-none w-full outline-none "
          />
        </div>
      </div>
      <div
        className={`flex flex-col text-black items-center px-6 bg-no-repeat bg-cover bg-center`}
      >
        <div className=" flex items-center justify-between relative gap-12">
          <div className="">
            <Title title={"Popular Apartments"} />
          </div>
          <div>
            <button
              onClick={() => {
                navigate("/food");
                scrollTo(0, 0);
              }}
              className="my-16 px-4 py-2 text-sm font-medium border border-gray-300 rounded bg-white hover:bg-gray-50 transition-all cursor-pointer"
            >
              View all{" "}
            </button>
          </div>
        </div>

        <div
          className="flex flex-1 flex-wrap items-center justify-center gap-4"
          style={{ maxWidth: "100%" }}
        >
          {realEstate.map((item, index) => (
            <FeaturedCard key={item.id} item={item} index={index} />
          ))}
        </div>
      </div>

      <div
        className=" fixed right-5 bottom-5 z-40 rounded-2xl"
        data-aos="fade-up"
        data-aos-anchor-placement="bottom-bottom"
        data-aos-delay="300"
      >
        <Radio />
      </div>
    </div>
  );
}

export default RestatePage