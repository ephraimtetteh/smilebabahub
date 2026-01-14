'use client'

import { Products } from '@/assets/assets'
import React from 'react'
import FeaturedCard from '../FeaturedCard'
import CardComponent from '../CardComponent'

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