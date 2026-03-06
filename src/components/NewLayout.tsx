'use client'

import React, { useState } from 'react'
import Button from './Button'
import Link from 'next/link'
import { appartmentCategories, menu_list } from '@/src/constants/data'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { NavbarLinkPorps } from '../types/types'
import CategorySelector from './CategorySelector'


const NewLayout = () => {

    
    const [category, setCategory] = useState("All");
    const pathname = usePathname()

  
    return (
      <div className="flex flex-col items-center justify-center text-center flex-1">
        <div className="flex flex-col items-center justify-center mx-auto">
          {pathname === "/food" && (
            <CategorySelector
              title="Explore Menu"
              description="Browse food categories available"
              items={menu_list}
              category={category}
              setCategory={setCategory}
              type="image"
            />
          )}
  
          {pathname === "/restate" && (
            <CategorySelector
              title="Our Recommendation"
              description="Explore apartment categories"
              items={appartmentCategories}
              category={category}
              setCategory={setCategory}
              type="text"
            />
          )}
        </div>
        </div>
  
  );
}

export default NewLayout