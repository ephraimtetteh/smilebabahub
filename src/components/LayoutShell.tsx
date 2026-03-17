"use client";

import { usePathname } from "next/navigation";
import React, { useEffect } from "react";
import StoreProvider, { useAppDispatch, useAppSelector } from "../app/redux";
import Footer from "./Footer";
import Navbar from "./Navbar";
import Script from "next/script";
import Video from "./Video";
import Radio from "./Radio";
import AOS from "aos";
import { calculateTotals } from "../lib/features/cart/cartSlice";
import { restoreSession } from "../lib/features/auth/authActions";


export const AppInitializer = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  return <>{children}</>;
};

const LayoutShell = ({ children }: { children: React.ReactNode }) => {
  const pathName = usePathname();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.cartItems);
  const hideNavFooter = pathName.startsWith("/auth");


  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);
  
  useEffect(() => {
    dispatch(calculateTotals());
  }, [cartItems]);

  




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
        <AppInitializer>
          <LayoutShell>
            {children}
            <Script
              src="https://video2.getstreamhosting.com:2020/dist/widgets.js"
              strategy="afterInteractive"
            />

            {pathName !== "/" &&
              pathName !== "/sell" &&
              pathName !== "/auth" && (
                <div
                  className="hidden md:block fixed bottom-5 left-25 z-40 rounded-2xl"
                  data-aos="fade-up"
                  data-aos-anchor-placement="bottom-bottom"
                  data-aos-delay="1000"
                >
                  <Video />
                </div>
              )}

            {pathName !== "/sell" && pathName !== "/auth" && (
              <div
                className=" fixed right-5 bottom-5 z-40 rounded-2xl"
                data-aos="fade-up"
                data-aos-anchor-placement="bottom-bottom"
                data-aos-delay="300"
              >
                <Radio />
              </div>
            )}
          </LayoutShell>
        </AppInitializer>
      </StoreProvider>
    </>
  );
};

export default LayoutWrapper;
