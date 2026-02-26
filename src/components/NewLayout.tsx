'use client'

import React, { useState } from 'react'
import Button from './Button'
import Link from 'next/link'
import { menu_list } from '@/src/constants/data'
import Image from 'next/image'

const NewLayout = () => {
  const [active, setActive] = useState('All')
  const [category, setCategory] = useState('All')

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
        <Link href={"/food"}>
          <Button
            text="Food"
            className={`rounded-full ${active === "Food" ? "bg-amber-900 text-white" : ""}`}
            onClick={() => setActive("Food")}
          />
        </Link>
        <Link href={"/restate"}>
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

      <div className="explore_menu" id="explore_menu">
        <h1>Explore Our Menu</h1>
        <p className="explore_menu_text">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae,
          fugiat?
        </p>
        <div className="explore_menu_list">
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
                  className={category === menu.menu_name ? "active" : ""}
                  src={menu.menu_image}
                  alt=""
                />
                <p>{menu.menu_name}</p>
              </div>
            );
          })}
        </div>
        <hr />
      </div>
    </div>
  );
}

export default NewLayout