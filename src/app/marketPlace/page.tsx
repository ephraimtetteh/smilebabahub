
import BestSelling from '@/src/components/BestSelling';
import FeaturedCard from '@/src/components/FeaturedCard';
import FeaturedProducts from '@/src/components/FeaturedProducts';
import FoodAds from '@/src/components/FoodComponent';
import Hero from '@/src/components/Hero';
import Hub from '@/src/components/Hub';
import PostedAds from '@/src/components/PostedAds';
import Radio from '@/src/components/Radio';
import SideBar from '@/src/components/SideBar';
import Video from '@/src/components/Video';
import React from 'react'

const MarketPlace = () => {
  return (
    <div className="w-full flex flex-col flex-1 items-center px-4 md:px-16 lg:px-12 xl:px-12 justify-center pt-10">
      <div className="w-full flex flex-col">
        <FeaturedProducts className="bg-white" />
        <FeaturedProducts />
        <BestSelling />
        <PostedAds />
      </div>

      <div
        className=" fixed top-25 left-5 z-40 rounded-2xl"
        data-aos="fade-up"
        data-aos-anchor-placement="bottom-bottom"
        data-aos-delay="300"
      >
        <Video />
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

export default MarketPlace