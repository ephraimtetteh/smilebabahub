import BestSelling from '@/components/BestSelling';
import FeaturedProducts from '@/components/FeaturedProducts';
import Hero from '@/components/Hero';
import Hub from '@/components/Hub';
import PostedAds from '@/components/PostedAds';
import SideBar from '@/components/SideBar';
import React from 'react'

const MarketPlace = () => {
  return (
    <div className="w-full flex flex-col flex-1 items-center px-4 md:px-16 lg:px-14 xl:px-12 justify-center pt-10">
      <Hero />
      <div className="w-full flex flex-col">
      <Hub />
        <FeaturedProducts className="bg-white" />
        <SideBar />
        <FeaturedProducts />
        <BestSelling />
        <PostedAds />
      </div>
    </div>
  );
}

export default MarketPlace