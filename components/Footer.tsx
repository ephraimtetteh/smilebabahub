import React from 'react'
import { sales, information, help } from '@/constants/footer'
import Image from 'next/image'
import {assets} from '@/assets/assets'
import { IoLogoFacebook } from "react-icons/io5";
import { IoLogoInstagram } from "react-icons/io5";
import { IoLogoLinkedin} from "react-icons/io5";
import Link from 'next/link';

const Footer = () => {
  return (
    <section className=' bg-black  flex flex-col'>
      <div className='grid lg:grid-cols-4 items-center justify-between gap-12 lg:px-20 px-10 lg:py-20 py-10'>
        <article className='flex gap-4 flex-col'>
          <Image 
            src={assets.logo}
            alt='smilebaba logo'
            width={100}
          />
        <p className='text-white/60'>SmileBaba is a trusted online marketplace to buy and sell products easily. Discover great deals, connect with sellers, and shop smarter every day.</p>
        <div className='text-white/60 flex gap-4'>
          <Link href={'/facebook'}>{<IoLogoFacebook size={32}/>}</Link>
          <Link href={'/instagram'}>{<IoLogoInstagram size={32}/>}</Link>
          <Link href={'/linkdin'}>{<IoLogoLinkedin size={32}/>}</Link>
        </div>
        </article>

        <article className='flex gap-4 flex-col text-white/60'>
          <h2 className='text-2xl font-bold border-white'>How To Sell Fast</h2>
          {sales.map((item, index) => (
            <div key={index}>
              {item.name}
            </div>
          ))}
        </article>

        <article className='flex gap-4 flex-col text-white/60'>
        <h2 className='text-2xl font-bold border-white'>Information</h2>
          {information.map((item, index) => (
            <div key={index}>
              {item.name}
            </div>
          ))}
        </article>
        <article className='flex gap-4 flex-col text-white/60'>
        <h2 className='text-2xl font-bold border-white'>Newsletter</h2>
        <p>“Subscribe to our newsletter for new products and special offers.” </p>
          <form className='flex gap-2'>
            <input type="text" placeholder='example@gmail.com' className='bg-gray-900 border border-gray-700 p-3 rounded outline-none'/>
            <button type='submit' className='bg-transparent border-[#cccccc6d] border p-3 rounded font-bold outline-none'>Subscribe</button>
          </form>
        </article>
      </div>
      <div className="bg-gray-900 text-white py-4 text-center">
        &copy; {new Date().getFullYear()} SmileBaba. All rights reserved.
      </div>
    </section>
  )
}

export default Footer