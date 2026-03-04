"use client";

import { usePathname } from "next/navigation";
import React from "react";
import StoreProvider from "../app/redux";
import Footer from "./Footer";
import Navbar from "./Navbar";
import Script from "next/script";

const LayoutShell = ({ children }: { children: React.ReactNode }) => {
  const pathName = usePathname();

  const hideNavFooter = pathName.startsWith("/auth");
  const isSellingPage = pathName.startsWith("/sell");

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


const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <StoreProvider>
        <LayoutShell>
          {children}
          <Script
            src="https://video2.getstreamhosting.com:2020/dist/widgets.js"
            strategy="afterInteractive"
          />
        </LayoutShell>
      </StoreProvider>
    </>
  );
};

export default LayoutWrapper;
