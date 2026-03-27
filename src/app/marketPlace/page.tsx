
import BestSelling from '@/src/components/BestSelling';
import FeaturedProducts from '@/src/components/FeaturedProducts';
import MarketplaceSearch from '@/src/components/NewSearch';
import PostedAds from '@/src/components/PostedAds';
import Radio from '@/src/components/Radio';
import Video from '@/src/components/Video';
import React from 'react'

const MarketPlace = () => {
  return (
    <div className="w-full lg:flex justify-center px-4 md:px-8 lg:px-12 mt-15 max-sm:rounded-t-2xl">
      <Radio />
      <div className="w-full max-w-7xl flex flex-col gap-10 py-10">
        {/* HERO / RADIO SECTION */}

        {/* SEARCH */}
        <div className="w-full">
          <MarketplaceSearch />
        </div>

        {/* FEATURED PRODUCTS */}
        <section className="flex flex-col gap-6">
          <h2 className="text-xl font-semibold">Featured Products</h2>
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <FeaturedProducts category="marketplace" />
          </div>
        </section>

        <section className="flex flex-col gap-6">
          <Video />
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