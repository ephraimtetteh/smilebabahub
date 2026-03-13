
import Product from '@/src/components/PostedAds';
import Profile from '@/src/components/Profile'
import { Products } from '@/src/constants/data';
import React from 'react'

const page = () => {
  return (
    <div className="w-full lg:flex px-4 md:px-6 lg:px-14 xl:px-22 pb-10 bg-amber-50 py-30">
      <div className="w-[30%]">
        {Products.map((product) => (
          <Profile key={product.id} item={product} />
        ))}
      </div>
      <div className="w-full">
        <Product />
      </div>
    </div>
  );
}

export default page