import React from 'react'
import { assets, Products } from "@/assets/assets";
import BackgroundRemoval from "@/components/BackgroundRemoval";
import Image from "next/image";

const Video = () => {
  return (
    <div className="flex flex-row flex-1 gap-4 w-full items-center justify-center">
      <aside className=" p-4 flex fle-1 flex-col border-gray-400 border rounded w-[30%]">
        <h3 className="text-[16px] text-[#eb5e03] font-bold">
          Recently Aired Products
        </h3>
        <div className="flex flex-col flex-1 gap-4 pt-4">
          <Image
            src={Products[0].image}
            alt="product"
            width={80}
            height={50}
            className="rounded h-20"
          />
          <div className="py-2 gap-3">
            <h3 className="text-[10px] font-semibold pb-3">
              {Products[0].author}
            </h3>
            {/* <p className="text-[14px]">{Products[0].description}</p> */}
            <div className="flex flex-row flex-1 gap-2">
              <p className="border border-[#eb5e03] rounded p-1 text-[10px] w-fit mt-1">
                Price: ${Products[0].price}
              </p>
              <p className="border border-[#eb5e03] rounded p-1 w-fit mt-1 text-[10px]">
                Buy
              </p>
            </div>
          </div>
        </div>
      
      </aside>
      
      <main className="min-h-[30vh] w-[70%] flex-1 bg-black flex items-center justify-center">
        <iframe src="https://media2.streambrothers.com:2000/public/8056" className='w-full'/>
      </main>
    </div>
  );
}

export default Video




