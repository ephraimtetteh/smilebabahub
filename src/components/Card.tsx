import React from 'react'
import { Products } from '@/src/assets/assets';
import Image from 'next/image';
import Title from './Title';

type VideoProps = {
  className?: string
}


const Card = ({className}: VideoProps) => {
  return (
    <div className={`${className} z-10 items-start justify-center  text-white pb-10  bg-no-repeat bg-cover bg-center`}>
      <div className="flex  justify-between">
        <Title title='Recently Aired' className='text-text-black text-[14px] p4-8' />
      </div>

      <div className={`${className} flex flex-row overflow-x-scroll`}>
        {Products.slice(0, 4).map((item) => (
          <article key={item.id} className="border border-[#ccc] mb-3 rounded shadow-2xs items-center justify-center mr-2">
            <Image src={item.image} alt={item.title} className='text-[16px] text-[#ffc105] text-center justify-center lg:w-50 lg:h-25' />
            
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