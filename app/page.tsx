import NewLayout from '@/components/NewLayout';
import PostedAds from '@/components/PostedAds';
import Promo from '@/components/Promo';
import Video from '@/components/Video'
import React from 'react'

const page = () => {
  return (
    <div className="w-full flex flex-col flex-1 items-center px-4 md:px-16 lg:px-14 xl:px-12 justify-center pt-30">
      <Video />
      <NewLayout />
      <div className='w-full flex flex-col'>
        <PostedAds />
        <Promo />
      </div>
    </div>
  );
}

export default page