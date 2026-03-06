"use client";

import React, { useEffect } from "react";
import NewLayout from "@/src/components/NewLayout";
import InputCompontent from "@/src/components/InputCompontent";
import { food_list } from "@/src/constants/data";
import FeaturedCard from "@/src/components/FeaturedCard";
import Title from "@/src/components/Title";
import { useRouter } from "next/navigation";
import Radio from "@/src/components/Radio";
import AOS from "aos";

const FoodPage = () => {

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
    <div className="w-full flex flex-col flex-1 items-center px-2 justify-center pt-30">
      <NewLayout />
      <div className=" max-w-5xl w-full flex-1 shadow-lg shadow-neutral-100 bg-white/30 backdrop-blur-3xl items-center justify-center mx-auto rounded-full">
        <InputCompontent
          type="text"
          placeholder="Food, restaurants ......"
          value=""
          onChange={() => ""}
          className="border-none w-full rounded-full focus:ring-amber-300 focus:ring outline-none px-4 py-4"
        />
      </div>
      <div
        className={`flex flex-col text-black items-center px-6 bg-no-repeat bg-cover bg-center`}
      >
        <div className=" flex items-center justify-between relative gap-12">
          <div className="">
            <Title title={"Trending Food Spots"} />
          </div>
          <div>
            <button
              onClick={() => {
                navigate("/food");
                scrollTo(0, 0);
              }}
              className="my-16 px-4 py-2 text-sm font-medium border border-gray-300 rounded bg-white hover:bg-gray-50 transition-all cursor-pointer"
            >
              View all Foods{" "}
            </button>
          </div>
        </div>

        <div
          className="flex flex-1 flex-wrap items-center justify-center gap-4"
          style={{ maxWidth: "100%" }}
        >
          {food_list.map((item, index) => (
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
};

export default FoodPage;
