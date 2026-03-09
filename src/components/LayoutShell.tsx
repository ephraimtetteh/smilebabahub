"use client";

import { usePathname } from "next/navigation";
import React, { useEffect } from "react";
import StoreProvider from "../app/redux";
import Footer from "./Footer";
import Navbar from "./Navbar";
import Script from "next/script";
import Video from "./Video";
import MarketplaceSearch from "./NewSearch";
import Radio from "./Radio";
import AOS from "aos";

const LayoutShell = ({ children }: { children: React.ReactNode }) => {
  const pathName = usePathname();

  const hideNavFooter = pathName.startsWith("/auth");
  const isSellingPage = pathName.startsWith("/sell");

  const navBarDispaly = () => {
    switch (true) {
      case pathName.startsWith("/vendor"):
        return !hideNavFooter;

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
  const pathName = usePathname();

  useEffect(() => {
    AOS.init({
      once: true,
      duration: 800,
    });
  }, []);
  return (
    <>
      <StoreProvider>
        <LayoutShell>
          {pathName !== "/restate" && (
            <div className="absolute lg:top-75 top-50 left-0 right-0 z-50">
              <MarketplaceSearch />
            </div>
          )}
          {children}
          <Script
            src="https://video2.getstreamhosting.com:2020/dist/widgets.js"
            strategy="afterInteractive"
          />

          <div
            className="hidden md:block fixed bottom-5 left-5 z-40 rounded-2xl"
            data-aos="fade-up"
            data-aos-anchor-placement="bottom-bottom"
            data-aos-delay="300"
          >
            <Video />
          </div>

          <div
            className=" fixed right-5 bottom-5 z-40 rounded-2xl"
            data-aos="fade-up"
            data-aos-anchor-placement="bottom-bottom"
            data-aos-delay="300"
          >
            <Radio />
          </div>
        </LayoutShell>
      </StoreProvider>
    </>
  );
};

export default LayoutWrapper;
