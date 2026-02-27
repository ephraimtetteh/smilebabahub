import { assets } from '@/src/assets/assets'
import Image from 'next/image'
import React from 'react'

const AppDownload = () => {
  return (
    <div className=' w-full overflow-hidden flex flex-col items-center justify-center mx-auto lg:py-20 py-5 lg:px-40 px-3 rounded-2xl lg:my-10'>
      <div className='text-center'>
        <h3 className='font-bold lg:text-6xl text-2xl'>Get the smileBabaHub App</h3>
        <p className='py-3 text-gray-600 lg:text-[20px]'>Buy food, find apartments, hoth marketplace, and stream live radio and TV</p>
      </div>
      <div className='lg:flex gap-4 items-center justify-center'>
        <Image src={assets.appStore} alt='' />
        <Image src={assets.playStore} alt='' />
      </div>
    </div>
  )
}

export default AppDownload