'use client'

import React, { useState } from 'react'
import Button from './Button'
import Link from 'next/link'
import { menu_list } from '@/src/constants/data'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { NavbarLinkPorps } from '../types/types'




const NavbarLinks = ({href, label}: NavbarLinkPorps) => {
  const [category, setCategory] = useState("All");
  const pathname = usePathname()
  const isActive = pathname === href || ( pathname === '/' && href === '/home')

  return (
    <div className="">
      {/* <Link href={href}>
        <Button
          text={label}
          className={`rounded-full ${isActive ? "bg-amber-900 text-white" : ""}`}
        />
      </Link> */}

      <div className="flex items-center justify-center mx-auto">
        {href === "/food" && (
          <div className="flex flex-col items-center justify-center gap-4">
            <h1 className='font-bold text-2xl'>Explore Menu</h1>
            <p className="text-[12px] text-gray-500">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Molestiae, fugiat?
            </p>
            <div className="flex flex-1 gap-4 items-center ">
              {menu_list.map((menu, index) => {
                return (
                  <div
                    onClick={() =>
                      setCategory((prev) =>
                        prev === menu.menu_name ? "All" : menu.menu_name,
                      )
                    }
                    key={index}
                    className="explore_menu_list_item"
                  >
                    <Image
                      className={` cursor-pointer overflow-x-scroll ${category === menu.menu_name ? "border-amber-950 rounded-full" : ""}`}
                      src={menu.menu_image}
                      alt=""
                    />
                    <p className="text-center text-[12px]">{menu.menu_name}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 

const NewLayout = () => {
  
  return (
    <div className="flex flex-col pb-4 items-center justify-center ">
      <div className="flex gap-2 mb-5">
       <NavbarLinks label='All' href='/' />
       <NavbarLinks label='Food' href='/food' />
       <NavbarLinks label='Reestate' href='/restate' />
       <NavbarLinks label='Market Place' href='/marketPlace' />
      </div>

      
    </div>
  );
}

export default NewLayout