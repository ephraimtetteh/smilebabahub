import React from 'react'
import Hero from '@/components/Hero'
import FeaturedProducts from '@/components/FeaturedProducts';
import SideBar from '@/components/SideBar';
import BestSelling from '@/components/BestSelling';
import PostedAds from '@/components/PostedAds';

const page = () => {
  return (

    <div className=''>
      
      <Hero />
      <div>
        <FeaturedProducts className='bg-white' />
        <SideBar />
        <FeaturedProducts />
        <BestSelling />
        <PostedAds />
      </div>
    </div>
  )
}

export default page