'use client'

import React, { useEffect, useState } from 'react'
import InputCompontent from './InputCompontent';
import { Products } from '../assets/assets';
import FeaturedCard from './FeaturedCard';
import Image from 'next/image';


const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<typeof Products>([]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        const filtered = Products.filter((product) =>
          product.title.toLowerCase().includes(searchQuery.toLowerCase()),
        );

        setResults(filtered);
      } else {
        setResults([]);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  return (
    <div className="w-full">
      {/* Search input */}

      <div className="max-w-5xl w-full flex-1 shadow-lg backdrop-blur-3xl items-center justify-center mx-auto rounded-full">
        <InputCompontent
          type="text"
          placeholder="Search Apartments, Food, Marketplace..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border-none w-full rounded-full focus:ring-black/10 focus:ring outline-none p-6"
        />
      </div>

      {/* Search Results */}

      {/* {results.length > 0 && (
        <div className="max-w-5xl mx-auto mt-4 bg-white shadow-lg rounded-xl p-4">
          {results.map((product, index) => (
            <div
              key={product.id}
              className="border-b py-2 cursor-pointer hover:bg-gray-100 px-2"
            >
              {product.title}
              <FeaturedCard item={product} index={index} />
            </div>
          ))}
        </div>
      )} */}

{results.length > 0 && (
        <div className="absolute w-[50%] flex-1 items-center justify-center mx-auto z-50 bg-white/30 backdrop-blur-3xl shadow-lg rounded-xl mt-2">

          {results.map((product)=>(
            <div
              key={product.id}
              className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer"
            >

              <Image
                src={product.image}
                alt={product.title}
                width={75}
                height={75}
                className="rounded-md"
              />

              <div className="flex flex-col flex-1">

                <span className="font-semibold">
                  {product.title}
                </span>

                <span className="text-sm text-gray-500">
                  {product.category}
                </span>

              </div>

              <span className="text-green-600 font-bold">
                ₵{product.price}
              </span>

            </div>
          ))}
    </div>
  )
}
</div>
  )}



export default SearchBar