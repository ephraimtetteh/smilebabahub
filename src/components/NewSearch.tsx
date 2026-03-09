"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

export default function MarketplaceSearch() {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (query) params.append("q", query);
    if (category) params.append("category", category);
    if (location) params.append("location", location);
    if (price) params.append("price", price);

    router.push(`/search?${params.toString()}`);
   
  };

  return (
    <div className="w-full flex justify-center mt-20">
      <div className="w-[95%] lg:w-[80%] xl:w-[70%] bg-white shadow-lg rounded-full border border-gray-200 grid grid-cols-1 md:grid-cols-5 overflow-hidden">
        {/* SEARCH PRODUCT */}
        <div className="flex flex-col p-4 hover:bg-gray-50 transition">
          <label className="text-xs text-gray-500">Search</label>

          <input
            type="text"
            placeholder="Search products, food, apartments..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="outline-none text-sm"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />
        </div>

        {/* CATEGORY */}
        <div className="flex flex-col p-4 border-l border-gray-200 hover:bg-gray-50 transition">
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

        {/* LOCATION */}
        <div className="flex flex-col p-4 border-l border-gray-200 hover:bg-gray-50 transition">
          <label className="text-xs text-gray-500">Location</label>

          <input
            type="text"
            placeholder="City"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="outline-none text-sm"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />
        </div>

        {/* PRICE */}
        <div className="flex flex-col p-4 border-l border-gray-200 hover:bg-gray-50 transition">
          <label className="text-xs text-gray-500">Max Price</label>

          <input
            type="number"
            placeholder="Budget"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="outline-none text-sm"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />
        </div>

        {/* SEARCH BUTTON */}
        <div className="flex items-center justify-end p-3 border-l border-gray-200">
          <button
            onClick={handleSearch}
            className="bg-amber-400 hover:bg-amber-500 transition text-black p-3 rounded-full flex items-center gap-2"
          >
            <Search size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
