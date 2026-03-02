'use client'

import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { IoPersonOutline } from "react-icons/io5";
import { IoHeartSharp } from "react-icons/io5";
import { IoCartOutline } from "react-icons/io5";
import { IoSearch } from "react-icons/io5";
import { assets } from "../assets/assets.js";
import { usePathname, useRouter } from 'next/navigation.js';
import Button from './Button';

interface NavbarProps {
  className?: string
}


const Navbar = ({className}: NavbarProps) => {

    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname()
    

    useEffect(() => {
      const handleScroll = () => {
        setIsScrolled(window.scrollY > 10);
      };
      
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }, [pathname]);



    


    return (
      <nav
        className={`${className} fixed top-0 left-0 w-full flex flex-1 items-center lg:justify-between px-4 md:px-16 lg:px-14 xl:px-12 transition-all duration-500 z-50 bg-amber-950 overflow-hidden  ${
          isScrolled
            ? "bg-black shadow-md text-white/80 backdrop-blur-lg py-3 md:py-4"
            : "py-4 md:py-6"
        }`}
        style={{ backgroundImage: `url(${assets.bgImage})` }}
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-12">
          <Link
            href={"/"}
            onClick={() => scrollTo(0, 0)}
            className="mr-2 cursor-pointer"
          >
            <h1
              className={`${
                isScrolled && "text-black opacity-80"
              } lg:text-4xl font-bold text-white items-center text-center`}
            >
              Smile<span className="text-[#ffc105]">Baba</span>Hub
            </h1>
          </Link>
          {/* Desktop Nav */}
          <div className="hidden lg:w-full items-center text-white gap-4 lg:flex flex-1 text-[20px]">
            <Link href={"/food"} className="hover:text-amber-300">
              Food
            </Link>
            <Link href={"/restate"}>Appartments</Link>
            <Link href={"/marketPlace"}>Marketplace</Link>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div className="hidden md:flex items-center gap-4 lg:gap-8 max-w-fit">
            <label className="flex-1 border border-white/30 bg-black/10 rounded text-[#ffc107] gap-2 flex items-center justify-start pl-2">
              <Image
                src={assets.searchIcon}
                alt="search"
                className={`${
                  isScrolled && "text-white"
                } h-7 transition-all duration-500 `}
              />
              <input
                type="text"
                placeholder="search"
                className=" outline-none py-2 lg:w-full rounded p-2 "
              />
            </label>
          </div>
          {/* Desktop Right */}
          <div className="hidden md:flex items-center w-full flex-1">
            <Link
              href={"/auth/register"}
              onClick={() => scrollTo(0, 0)}
              className="cursor-pointer"
            >
              <Button
                className={`px-8 py-2 rounded ml-4 transition-all duration-500 cursor-pointer  ${
                  isScrolled
                    ? "text-white bg-black border border-white"
                    : "bg-[#ffc107] text-black "
                }`}
                text={"Register"}
              />
            </Link>
            <Link
              href={"/sell"}
              className={`cursor-pointer ml-2 w-full rounded ${
                isScrolled
                  ? "text-black bg-[#ffc107]"
                  : "bg-[#ffc107] text-black"
              }`}
              onClick={() => scrollTo(0, 0)}
            >
              <Button
                text="PostAds"
                className="bg-black/10 border-white/10 border text-[14px] font-semibold "
              />
            </Link>
            <Link href={"/cart"} className="lg:block hidden">
              <button
                className={`px-4 py-2 rounded ml-4 transition-all duration-500 cursor-pointer border ${
                  isScrolled
                    ? "text-white bg-black"
                    : "border-[#ffc107] text-white"
                }`}
              >
                <IoCartOutline size={16} />
              </button>
            </Link>
            <Link href={"/auth/user/register"} className="hidden lg:block">
              <button
                className={`px-4 py-2 rounded ml-2 transition-all duration-500 cursor-pointer border ${
                  isScrolled
                    ? "text-white bg-black"
                    : "border-[#ffc107] text-white"
                }`}
              >
                <IoPersonOutline size={16} />
              </button>
            </Link>

            {/* country */}
            <select
              name=""
              id=""
              className="border-yellow-500 border rounded p-1 text-white ml-2 outline-none"
            >
              <option value="">GH</option>
              <option value="">NGN</option>
              <option value="">GLO</option>
            </select>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`fixed top-0 left-0 w-full h-screen bg-white text-base flex flex-col md:hidden items-center justify-center gap-6 font-medium text-gray-800 transition-all duration-500 ${
            isMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <button
            className="absolute top-4 right-4"
            onClick={() => setIsMenuOpen(false)}
          >
            <Image src={assets.closeIcon} alt="close-menu" className="h-6.5" />
          </button>

          <button className="bg-black text-white px-8 py-2.5 rounded-full transition-all duration-500">
            Register
          </button>
          <Link href={"/cart"} className="">
            <button
              className={`px-4 py-2 rounded ml-4 transition-all duration-500 cursor-pointer border ${
                isScrolled
                  ? "text-white bg-black"
                  : "border-[#ffc107] text-white"
              }`}
            >
              <IoCartOutline size={16} />
            </button>
          </Link>
          <Link href={"/auth/user/register"} className="">
            <button
              className={`px-4 py-2 rounded ml-4 transition-all duration-500 cursor-pointer border ${
                isScrolled
                  ? "text-white bg-black"
                  : "border-[#ffc107] text-white"
              }`}
            >
              <IoPersonOutline size={16} />
            </button>
          </Link>
        </div>
      </nav>
    );
}

export default Navbar