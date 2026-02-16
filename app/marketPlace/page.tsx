import BestSelling from '@/components/BestSelling';
import FeaturedProducts from '@/components/FeaturedProducts';
import Hero from '@/components/Hero';
import PostedAds from '@/components/PostedAds';
import SideBar from '@/components/SideBar';
import React from 'react'

const MarketPlace = () => {
  return (
    <div>
      <Hero />
      <div>
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