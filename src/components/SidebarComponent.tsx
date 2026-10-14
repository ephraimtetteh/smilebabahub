import Link from 'next/link'
import React, { JSX } from 'react'
import { Url } from 'url'
import { IoRadioOutline } from "react-icons/io5";
import { FaHeart } from "react-icons/fa";

interface SidebarProps {
  name?: string,
  icon?: React.ReactNode,
  link: string
  logo?: string
  title?: string
}

const SidebarComponent = ({name, icon, link, logo, title}: SidebarProps) => {
  return( 
   
      <div>
           {logo}
            <h3 className="text-2xl pb-4">{title}</h3>
            <div className="">
            
                  <Link href={link}
                    className="flex flex-1 justify-between items-center gap-3 "
                    >
                    <div className="flex flex-1 items-center justify-start gap-3 hover:bg-[#ffc105] p-2 ease-in-out duration-300 rounded">
                      {icon}
                      {name}
                    </div>
                  </Link>
              
            </div>
      </div>
    
     
  )
}

export default SidebarComponent