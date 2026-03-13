'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { toast } from 'react-toastify';

const RestateSearch = () => {
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [guest, setGuest] = useState("");
  const [active, setActive] = useState<string | null>(null);

  const router = useRouter();
  const searchRef = useRef<HTMLDivElement | null>(null);
  const [openSearch, setOpenSearch] = useState(false);

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (location) params.append("location", location);
    if (date) params.append("date", date);
    if (guest) params.append("guest", guest);

    if (!params.toString()) {
      return toast.error("Please enter at least a one Field");
    }

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
      className="bg-white shadow-xl rounded-full border border-gray-200 
      flex flex-col md:flex-row items-stretch md:items-center 
      w-[95%] md:w-[90%] lg:w-[65%] mx-auto overflow-hidden transition-all"
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

        {openSearch && (
          <div
            className="bg-white/30 backdrop-blur-3xl shadow-lg 
          rounded-2xl md:rounded-full 
          flex flex-col md:flex-row overflow-hidden
          transition-all duration-300 ease-in-out"
          >
            {/* WHERE */}

            <div
              onClick={() => setActive("where")}
              className={`flex flex-col px-4 py-3 flex-1 items-start cursor-pointer transition ${
                active === "where" ? "bg-gray-100" : ""
              }`}
            >
              <label className="text-xs text-gray-500">Where</label>

              <input
                type="text"
                placeholder="Search destination"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="outline-none text-sm bg-transparent"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
              />
            </div>

            {/* Divider (hidden on mobile) */}
            <div className="hidden md:block h-10 w-px bg-gray-200"></div>

            {/* WHEN */}
            <div
              onClick={() => setActive("when")}
              className={`flex flex-col px-4 py-3 flex-1 items-start cursor-pointer transition ${
                active === "when" ? "bg-gray-100" : ""
              }`}
            >
              <label className="text-xs text-gray-500">When</label>

              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
                className="outline-none text-sm bg-transparent"
              />
            </div>

            {/* Divider */}
            <div className="hidden md:block h-10 w-px bg-gray-200"></div>

            {/* GUEST */}
            <div
              onClick={() => setActive("guest")}
              className={`flex flex-col px-4 py-3 flex-1 items-start cursor-pointer transition ${
                active === "guest" ? "bg-gray-100" : ""
              }`}
            >
              <label className="text-xs text-gray-500">Guests</label>

              <input
                type="number"
                placeholder="Add guests"
                value={guest}
                onChange={(e) => setGuest(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
                className="outline-none text-sm bg-transparent"
              />
            </div>

            {/* SEARCH BUTTON */}
            <div className="flex items-center justify-center md:justify-end gap-2 p-3">
              <button
                onClick={() => setOpenSearch(false)}
                className="text-gray-500 text-sm lg:hidden"
              >
                Cancel
              </button>
              <button
                className="bg-amber-400 hover:bg-amber-500 transition p-3 md:p-4 rounded-full"
                onClick={handleSearch}
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

export default RestateSearch