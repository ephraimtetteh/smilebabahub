'use client'

import React, { useState } from 'react'
import Button from './Button'
import CTA from './CardCTA'
import { assets } from '@/assets/assets'
import { Categories } from '@/constants/sellFormData'
import Link from 'next/link'

const NewLayout = () => {
  const [active, setActive] = useState('All')

  return (
    <div className="flex flex-col pb-4 items-center justify-center ">
      <div className="flex gap-2 mb-5">
        <Link href={"/"}>
          <Button
            text="All"
            className={`rounded-full ${active === "All" ? "bg-amber-900 text-white" : ""}`}
            onClick={() => setActive("All")}
          />
        </Link>
        <Link href={'/food'}>
          <Button
            text="Food"
            className={`rounded-full ${active === "Food" ? "bg-amber-900 text-white" : ""}`}
            onClick={() => setActive("Food")}
          />
        </Link>
        <Link href={'/restate'}>
          <Button
            text="Restate"
            className={`rounded-full ${active === "Restate" ? "bg-amber-900 text-white" : ""}`}
            onClick={() => setActive("Restate")}
          />
        </Link>
        <Link href={"marketPlace"}>
          <Button
            text="Market Place"
            className={`rounded-full cursor-pointer ${active === "Market Place" ? "bg-amber-900 text-white" : ""}`}
            onClick={() => setActive("Market Place")}
          />
        </Link>
      </div>

      <div className="flex flex-row flex-1 gap-x-3">
        {Categories.map((item) => (
          <CTA key={item.id} image={assets.bgImage} text={item.id} />
        ))}
      </div>
    </div>
  );
}

export default NewLayout