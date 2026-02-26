'use client'

import Hub from '@/src/components/Hub';
import PostedAds from '@/src/components/PostedAds';
import SearchBar from '@/src/components/SearchBar';
import React from 'react'

const RestatePage = () => {
  return (
    <div className="w-full flex flex-col flex-1 items-center px-4 md:px-16 lg:px-14 xl:px-12 justify-center pt-30">
      <Hub />
      <SearchBar />
      <div className='w-full'>
        <PostedAds />
      </div>
    </div>
  );
}

export default RestatePage