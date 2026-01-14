"use client";

import { usePathname } from "next/navigation";
import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

const LayoutShell = ({ children }: { children: React.ReactNode }) => {
  const pathName = usePathname();

  const hideNavFooter = pathName.startsWith("/auth");
  const isSellingPage = pathName.startsWith("/sell");

  const renderNavbar = () => {
    if (hideNavFooter) return null;

    return (
      showNavBar() && <Navbar className={isSellingPage ? "bg-[#523e038b] text-black" : ""} />
    );
  };


  const showNavBar = () => {
    if (pathName.startsWith("/vendor")) {
      return !hideNavFooter;
    }
    return true;
  }



  const navBarDispaly = () => {
    switch (true) {
      case pathName.startsWith("/vendor"):
        return !hideNavFooter;

      case isSellingPage:
        return (
          <Navbar
            className={isSellingPage ? "bg-[#523e038b] text-black" : ""}
          />
        );

      default:
        return !hideNavFooter ? <Navbar /> : null;
    }
  }

  return (
    <>
      {navBarDispaly()}
      {children}
      {!hideNavFooter && <Footer />}
    </>
  );
};

export default LayoutShell;
