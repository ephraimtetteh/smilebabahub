import React from 'react'
import { MdPhonelink, MdOtherHouses } from "react-icons/md";
import { IoCarSportOutline } from "react-icons/io5";
import Verified from './Verified';
import { FaAngleRight } from "react-icons/fa6";
import Button from './Button';
import { cardCategories } from '@/constants/cardCategories'
import { Products } from '@/assets/assets';
import Image from 'next/image';
import Title from './Title';




const Card = () => {
  return (
    <div className='z-10 items-start justify-center  text-white pb-10  bg-no-repeat bg-cover bg-center'>
      <div className="flex  justify-between">
        <Title title='Recently Aired' className='text-text-black text-[14px] p4-8' />
      </div>

      <div className="flex flex-row overflow-x-scroll">
        {Products.slice(0, 7).map((item) => (
          <article key={item.id} className="border border-[#ccc] rounded shadow-2xs items-center justify-center mr-2">
            <Image src={item.image} alt={item.title} className='text-[16px] text-[#ffc105] text-center justify-center w-50 h-25' />
            
            <div className='text-[14px] p-2 text-black'>
              {item.author}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default Card