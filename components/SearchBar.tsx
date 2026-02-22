import React from 'react'
import InputCompontent from './InputCompontent';
import { usePathname } from 'next/navigation';

const SearchBar = () => {
  const pathname = usePathname()
  return (
    <div className="w-[70%] items-center justify-between grid grid-cols-3 shadow-2xl  mb-20 px-6 py-2 rounded bg-white text-black border border-gray-100 gap-2">
      <div className="mr-2">
        <p className="px-4">Apartments</p>
        <InputCompontent
          type="text"
          placeholder="Search for your destination"
          value=""
          onChange={() => ""}
          className="border-none w-full rounded-full focus:ring-amber-300 focus:ring outline-none mx-2"
        />
      </div>

      <div className="border-gray-300 border-l mr-2">
        <p className="px-4">Food</p>
        <InputCompontent
          type="text"
          placeholder="Search your favorite food"
          value=""
          onChange={() => ""}
          className="border-none w-full rounded-full focus:ring-amber-300 focus:ring outline-none mx-2"
        />
      </div>
      <div className="border-gray-300 border-l">
        <p className="px-4">Market Place</p>
        <InputCompontent
          type="text"
          placeholder="Browse the marketplace"
          value=""
          onChange={() => ""}
          className="border-none w-full rounded-full focus:ring-amber-300 focus:ring outline-none mx-2"
        />
      </div>
    </div>
  );
}

export default SearchBar