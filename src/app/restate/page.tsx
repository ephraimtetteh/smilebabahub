'use client'

import FeaturedCard from '@/src/components/FeaturedCard';
import InputCompontent from '@/src/components/InputCompontent';
import NewLayout from '@/src/components/NewLayout';
import { realEstate } from '@/src/constants/data';
import { useRouter } from 'next/navigation';
import React, { useEffect,  useState } from 'react'


import { } from "react";


const RealEstate = () => {
return (

    <div className="w-full flex flex-col justify-center items-center mt-20">
      <div className='py-10'>
        <NewLayout />
      </div>

        <div
          className="flex flex-1 flex-wrap items-center justify-center gap-4"
          style={{ maxWidth: "100%" }}
        >
          {realEstate.map((item, index) => (
            <FeaturedCard key={item.id} item={item} index={index} />
          ))}
        </div>
    </div>

    )
    }
export default RealEstate


