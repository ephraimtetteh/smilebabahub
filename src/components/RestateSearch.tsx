'use client'

import React, { useState } from 'react'
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { toast } from 'react-toastify';

const RestateSearch = () => {
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [guest, setGuest] = useState("");
  const [active, setActive] = useState<string | null>(null);

  const router = useRouter();

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

  return (
    <div
      className="bg-white shadow-xl rounded-2xl border border-gray-200 
    flex flex-col md:flex-row items-stretch md:items-center 
    w-[95%] md:w-[90%] lg:w-[65%] mx-auto overflow-hidden transition-all"
    >
      {/* WHERE */}
      <div
        onClick={() => setActive("where")}
        className={`flex flex-col px-4 py-3 flex-1 cursor-pointer transition ${
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
        className={`flex flex-col px-4 py-3 flex-1 cursor-pointer transition ${
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
        className={`flex flex-col px-4 py-3 flex-1 cursor-pointer transition ${
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
      <div className="flex items-center justify-center md:pr-2 py-3 md:py-0">
        <button
          className="bg-amber-400 hover:bg-amber-500 transition p-3 md:p-4 rounded-full"
          onClick={handleSearch}
        >
          <Search size={18} />
        </button>
      </div>
    </div>
  );
}

export default RestateSearch