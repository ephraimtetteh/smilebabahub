'use client'


import React from 'react'
import CardComponent from '../CardComponent'
import { Products } from '@/src/constants/data'


const TopSellingProduct = () => {
  return (
    <div>
      {Products.slice(0, 3).map((item, index) => {
        return (
          <div key={item.id} className=' items-center '>
            <CardComponent item={item} index={index} quantity={409}/>
          </div>
        );
      })}
    </div>
  )
}

export default TopSellingProduct