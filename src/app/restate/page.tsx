'use client'

import BestSelling from '@/src/components/BestSelling';
import Hub from '@/src/components/Hub';
import NewLayout from '@/src/components/NewLayout';
import PostedAds from '@/src/components/PostedAds';
import Promo from '@/src/components/Promo';
import SearchBar from '@/src/components/SearchBar';
import React from 'react'

const RestatePage = () => {
  return (
    <div className="w-full flex flex-col flex-1 items-center px-4 md:px-16 lg:px-14 xl:px-12 justify-center pt-30">
      <NewLayout />
      <SearchBar />
      <div className='w-full'>
        <Promo />
        <PostedAds />
        <BestSelling />
      </div>
    </div>
  );
}

export default RestatePage