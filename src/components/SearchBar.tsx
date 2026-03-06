'use client'

import React, { useEffect, useState } from 'react'
import InputCompontent from './InputCompontent';
import { Products } from '../assets/assets';


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

      <div className="max-w-5xl w-full flex-1 shadow-lg bg-white/30 backdrop-blur-3xl items-center justify-center mx-auto rounded-full">
        <InputCompontent
          type="text"
          placeholder="Search Apartments, Food, Marketplace..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border-none w-full rounded-full focus:ring-amber-300 focus:ring outline-none p-6"
        />
      </div>

      {/* Search Results */}

      {results.length > 0 && (
        <div className="max-w-5xl mx-auto mt-4 bg-white shadow-lg rounded-xl p-4">
          {results.map((product) => (
            <div
              key={product.id}
              className="border-b py-2 cursor-pointer hover:bg-gray-100 px-2"
            >
              {product.title}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};



export default SearchBar