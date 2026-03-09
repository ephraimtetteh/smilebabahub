'use client'

import React, { useState } from 'react'
import { usePathname, useRouter } from "next/navigation";
import { Search } from "lucide-react";

const RestateSearch = () => {
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [guest, setGuest] = useState("");
  const [active, setActive] = useState<string | null>(null);

  const router = useRouter();
  

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (location) params.append("location", location);
    if (date) params.append("d", date);
    if (guest) params.append("guest", guest);

    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="bg-white shadow-2xl rounded-full border border-gray-200 lg:my-10 my-2 flex items-center overflow-hidden transition-all duration-300 w-[95%] md:w-[80%] lg:w-[65%]">
      {/* WHERE */}
      <div
        onClick={() => setActive("where")}
        className={`flex flex-col px-6 py-3 flex-1 cursor-pointer transition ${
          active === "where" ? "bg-gray-100" : ""
        }`}
      >
        <label className="text-xs text-gray-500">Where</label>

        <input
          type="text"
          placeholder="Search destination"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="outline-none text-sm"
        />
      </div>

      {/* DIVIDER */}
      <div className="h-10 w-px bg-gray-200"></div>

      {/* WHEN */}
      <div
        onClick={() => setActive("when")}
        className={`flex flex-col px-6 py-3 flex-1 cursor-pointer transition ${
          active === "when" ? "bg-gray-100" : ""
        }`}
      >
        <label className="text-xs text-gray-500">When</label>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="outline-none text-sm"
        />
      </div>

      {/* DIVIDER */}
      <div className="h-10 w-px bg-gray-200"></div>

      {/* GUEST */}
      <div
        onClick={() => setActive("guest")}
        className={`flex flex-col px-6 py-3 flex-1 cursor-pointer transition ${
          active === "guest" ? "bg-gray-100" : ""
        }`}
      >
        <label className="text-xs text-gray-500">Guests</label>

        <input
          type="number"
          placeholder="Add guests"
          value={guest}
          onChange={(e) => setGuest(e.target.value)}
          className="outline-none text-sm"
        />
      </div>

      {/* SEARCH BUTTON */}

      <button className="bg-amber-400 hover:bg-amber-500 transition p-4 rounded-full mr-2" onClick={handleSearch}>
        <Search size={20} />
      </button>
    </div>
  );
}

export default RestateSearch