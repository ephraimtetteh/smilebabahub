
import BestSelling from '@/src/components/BestSelling';
import FeaturedProducts from '@/src/components/FeaturedProducts';
import MarketplaceSearch from '@/src/components/NewSearch';
import PostedAds from '@/src/components/PostedAds';
import Radio from '@/src/components/Radio';
import React from 'react'

const MarketPlace = () => {
  return (
    <div className="w-full flex justify-center px-4 md:px-8 lg:px-12">
      <div className="w-full max-w-7xl flex flex-col gap-10 py-10">
        {/* HERO / RADIO SECTION */}
        <div className="w-full bg-[#ffd700] rounded-2xl py-12 flex items-center justify-center">
          <Radio />
        </div>

        {/* SEARCH */}
        <div className="w-full">
          <MarketplaceSearch />
        </div>

        {/* FEATURED PRODUCTS */}
        <section className="flex flex-col gap-6">
          <h2 className="text-xl font-semibold">Featured Products</h2>
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <FeaturedProducts />
          </div>
        </section>

        {/* BEST SELLING */}
        <section className="flex flex-col gap-6">
          <h2 className="text-xl font-semibold">Best Selling</h2>
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <BestSelling />
          </div>
        </section>

        {/* RECENT ADS */}
        <section className="flex flex-col gap-6">
          <h2 className="text-xl font-semibold">Recently Posted</h2>
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <PostedAds />
          </div>
        </section>
      </div>
    </div>
  );
}

export default MarketPlace