import { Products } from '@/assets/assets';
import Product from '@/components/PostedAds';
import Profile from '@/components/Profile'
import React from 'react'

const page = () => {
  return (
    <div className="mt-30 flex px-4 md:px-16 lg:px-24 xl:px-32 pb-10 bg-amber-50 py-10">
      <div className='w-[20%]'>
        <Profile />
      </div>
      <div className='w-full'>
        <Product /> 
      </div>
    </div>
  );
}

export default page