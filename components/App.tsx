import { assets } from '@/assets/assets'
import Image from 'next/image'
import React from 'react'

const AppDownload = () => {
  return (
    <div className='flex flex-col items-center justify-center mx-auto py-20 bg-amber-100 px-40 rounded-2xl my-10'>
      <div className='text-center'>
        <h3 className='font-bold text-6xl'>Get the smileBabaHub App</h3>
        <p className='py-3 text-gray-600 text-[20px]'>Buy food, find apartments, hoth marketplace, and stream live radio and TV</p>
      </div>
      <div className='flex gap-4'>
        <Image src={assets.appStore} alt='' />
        <Image src={assets.playStore} alt='' />
      </div>
    </div>
  )
}

export default AppDownload