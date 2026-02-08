import { Products } from '@/assets/assets';
import Product from '@/components/PostedAds';
import Profile from '@/components/Profile'
import React from 'react'

const page = () => {
  return (
    <div className="w-full lg:flex px-4 md:px-6 lg:px-14 xl:px-22 pb-10 bg-amber-50 py-30">
      <div className='w-[30%]'>
        <Profile />
      </div>
      <div className='w-full'>
        <Product /> 
      </div>
    </div>
  );
}

export default page