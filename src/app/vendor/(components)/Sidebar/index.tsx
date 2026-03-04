"use client";

import {
  Archive,
  Bell,
  CircleDollarSign,
  Clipboard,
  Layout,
  LucideIcon,
  Menu,
  Settings,
  User,
} from "lucide-react";
import React from "react";
import { useAppDispatch, useAppSelector } from "@/src/app/redux";
import { setIsSidebarCollapsed } from "@/src/lib";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { assets } from "@/src/assets/assets";
import Image from "next/image";

interface SidebarLinkPorps {
  href: string;
  icon: LucideIcon;
  label: string;
  isCollapsed: boolean;
}

const SidebarLink = ({
  href,
  icon: Icon,
  label,
  isCollapsed,
}: SidebarLinkPorps) => {
  const pathname = usePathname();
  const isActive =
    pathname === href || (pathname === "/" && href === "/vendor");

  return (
    <Link href={href}>
      <div
        className={`cursor-pointer flex items-center ${isCollapsed ? "justify-center py-4" : "justify-start px-8 py-4"} hover:text-yellow-500 hover:bg-yellow-100 gap-3 transition-colors ${isActive ? "bg-yellow-200 text-black" : ""}`}
      >
        <Icon className="w-6 h-6 text-gray-700" />
        <span
          className={`${isCollapsed ? "hidden" : "block"} font-medium text-gray-700`}
        >
          {label}
        </span>
      </div>
    </Link>
  );
};

const Sidebar = () => {
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed,
  );

  const toggleSidebarCollapsed = () => {
    dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
  };

  const sidebarClassNames = `fixed flex flex-col ${isSidebarCollapsed ? "w-0 md:w-16" : "w-72 md:w-64"} bg-white transition-all duration-300 overflow-hidden shadow-md z-40 h-full`;

  return (
    <div className={sidebarClassNames}>
      {/* top logo */}
      <div
        className={`flex gap-3 justify-between md:justify-normal items-center pt-8 ${isSidebarCollapsed ? "px-5 " : "px-8"}`}
      >
        <Image src={assets.logo} alt="" />
        <h1
          className={`font-extrabold text-2xl text-yellow-500 ${isSidebarCollapsed ? "hidden" : "block"}`}
        >
          SBH
        </h1>
        <button
          className="md:hidden px-3 py-3 bg-gray-100 rounded-full hover:bg-blue-100 "
          onClick={toggleSidebarCollapsed}
        >
          <Menu className="w-4 h-4" />
        </button>
      </div>

      {/* links */}
      <div className="grow mt-8">
        <SidebarLink
          href="/vendor"
          icon={Layout}
          label="Dashboard"
          isCollapsed={isSidebarCollapsed}
        />
        <SidebarLink
          href="/vendor/orders"
          icon={Archive}
          label="Orders"
          isCollapsed={isSidebarCollapsed}
        />
        <SidebarLink
          href="/vendor/products"
          icon={Clipboard}
          label="Products"
          isCollapsed={isSidebarCollapsed}
        />
        <SidebarLink
          href="/vendor/customers"
          icon={User}
          label="Customers"
          isCollapsed={isSidebarCollapsed}
        />
        <SidebarLink
          href="/vendor/message"
          icon={Bell}
          label="Message"
          isCollapsed={isSidebarCollapsed}
        />
        <SidebarLink
          href="/vendor/earnings"
          icon={CircleDollarSign}
          label="Expenses"
          isCollapsed={isSidebarCollapsed}
        />
        <SidebarLink
          href="/vendor/settings"
          icon={Settings}
          label="Settings"
          isCollapsed={isSidebarCollapsed}
        />
      </div>

      {/* footer */}
      <div className={`${isSidebarCollapsed ? "hidden" : "block"} mb-10`}>
        <p className="text-center text-xs text-gray-500">&copy; 2026</p>
      </div>
    </div>
  );
};

export default Sidebar;
