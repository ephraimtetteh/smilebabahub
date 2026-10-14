import { CardComponentProps } from '@/src/types/types'
import Image from 'next/image'
import Link from 'next/link'
import React, { JSX } from 'react'





const CardComponent = ({item, index, quantity}: CardComponentProps) => {
  return (
    <Link href={''} className='p-2 text-black relative w-full bg-amber-950 bg-center bg-cover bg-no-repeat'>
      <div className='flex gap-2'>
        <Image src={item.images[0]} alt='productImage' className='w-25 rounded items-start'/>
        <div>
          <h3>{item.title}</h3>
          <h3>{quantity}</h3>
        </div>
      </div>
        {/* <h3>{quantity}</h3> */}

    </Link>
  )
}

export default CardComponent