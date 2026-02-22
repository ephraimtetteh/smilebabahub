import React from 'react'
import InputCompontent from './InputCompontent';
import { usePathname } from 'next/navigation';

const SearchBar = () => {
  const pathname = usePathname()
  return (
    <div className="w-[70%] items-center shadow-2xl shadow-neutral-200 mb-20  py-2 rounded-full gap-2">
      {pathname === "/restate" && (
        <div className="justify-between grid grid-cols-3 px-6">
          <div className="mr-2">
            <p className="px-4">where</p>
            <InputCompontent
              type="text"
              placeholder="Search for your destination"
              value=""
              onChange={() => ""}
              className="border-none w-full rounded-full focus:ring-amber-300 focus:ring outline-none mx-2"
            />
          </div>
          <div className="border-gray-300 border-l mr-2">
            <p className="px-4">when</p>
            <InputCompontent
              type="text"
              placeholder="Add date"
              value=""
              onChange={() => ""}
              className="border-none w-full rounded-full focus:ring-amber-300 focus:ring outline-none mx-2"
            />
          </div>
          <div className="border-gray-300 border-l">
            <p className="px-4">who</p>
            <InputCompontent
              type="text"
              placeholder="Guest ..."
              value=""
              onChange={() => ""}
              className="border-none w-full rounded-full focus:ring-amber-300 focus:ring outline-none mx-2"
            />
          </div>
        </div>
      )}

      {pathname === "/food" && (
        <div className="w-full">
          <InputCompontent
            type="text"
            placeholder="Search Food"
            value=""
            onChange={() => ""}
            className="border-none w-full rounded-full focus:ring-amber-300 focus:ring outline-none mx-2 py-2"
          />
        </div>
      )}
    </div>
  );
}

export default SearchBar