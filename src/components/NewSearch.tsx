"use client";

import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

export default function MarketplaceSearch() {
  const router = useRouter();
  const [openSearch, setOpenSearch] = useState(false);

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const searchRef = useRef<HTMLDivElement | null>(null);

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (query) params.append("q", query);
    if (category) params.append("category", category);
    if (location) params.append("location", location);
    if (price) params.append("price", price);

    router.push(`/search?${params.toString()}`);
   
  };


  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!searchRef.current) return;

      if (!searchRef.current.contains(e.target as Node)) {
        setOpenSearch(false);
      }
    };

    document.addEventListener("mousedown", handleClick);

    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div
      ref={searchRef}
      className="w-full flex justify-center lg:mt-20 mt-4 px-3 mb-10"
    >
      <div className="w-full max-w-6xl">
        {/* COLLAPSED VIEW */}
        {!openSearch && (
          <div
            onClick={() => setOpenSearch(true)}
            className="bg-white shadow-md rounded-full px-6 py-3 flex items-center justify-between cursor-pointer"
          >
            <span className="text-gray-500 text-sm">
              Search products, food, apartments...
            </span>

            <button className="bg-amber-400 p-2 rounded-full">
              <Search size={18} />
            </button>
          </div>
        )}

        {/* EXPANDED VIEW */}
        {openSearch && (
         <div
         className="bg-white/30 backdrop-blur-3xl shadow-lg 
         rounded-2xl md:rounded-full 
         flex flex-col md:flex-row overflow-hidden
         transition-all duration-300 ease-in-out max-sm:mb-8"
          >
            {/* SEARCH */}
            <div className="flex flex-col p-4 flex-1 hover:bg-gray-100">
              <label className="text-xs text-gray-500">Search</label>

              <input
                type="text"
                placeholder="products, food ..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="outline-none text-sm bg-transparent"
              />
            </div>

            <div className="hidden md:block w-px bg-gray-200"></div>

            {/* CATEGORY */}
            <div className="flex flex-col p-4 flex-1 hover:bg-gray-100">
              <label className="text-xs text-gray-500">Category</label>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="outline-none text-sm bg-transparent"
              >
                <option value="">All</option>
                <option value="food">Food</option>
                <option value="apartments">Apartments</option>
                <option value="marketplace">Marketplace</option>
              </select>
            </div>

            <div className="hidden md:block w-px bg-gray-200"></div>

            {/* LOCATION */}
            <div className="flex flex-col p-4 flex-1 hover:bg-gray-100">
              <label className="text-xs text-gray-500">Location</label>

              <input
                type="text"
                placeholder="City"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="outline-none text-sm bg-transparent"
              />
            </div>

            <div className="hidden md:block w-px bg-gray-200"></div>

            {/* PRICE */}
            <div className="flex flex-col p-4 flex-1 hover:bg-gray-100">
              <label className="text-xs text-gray-500">Max Price</label>

              <input
                type="number"
                placeholder="Budget"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="outline-none text-sm bg-transparent"
              />
            </div>

            {/* BUTTONS */}
            <div className="flex items-center justify-center md:justify-end gap-2 p-3">
              <button
                onClick={() => setOpenSearch(false)}
                className="text-gray-500 text-sm"
              >
                Cancel
              </button>

              <button
                onClick={handleSearch}
                className="bg-amber-400 hover:bg-amber-500 transition text-black p-3 rounded-full"
              >
                <Search size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
