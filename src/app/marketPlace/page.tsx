
import BestSelling from '@/src/components/BestSelling';
import FeaturedProducts from '@/src/components/FeaturedProducts';
import MarketplaceSearch from '@/src/components/NewSearch';
import PostedAds from '@/src/components/PostedAds';
import React from 'react'

const MarketPlace = () => {
  return (
    <div className="w-full flex flex-col flex-1 items-center px-4 md:px-16 lg:px-12 xl:px-12 justify-center pt-10">
      <div className="w-full flex flex-col">
        <MarketplaceSearch />
        <FeaturedProducts className="bg-white" />
        <FeaturedProducts />
        <BestSelling />
        <PostedAds />
      </div>
    </div>
  );
}

export default MarketPlace