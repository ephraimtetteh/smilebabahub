"use client";

import { usePathname } from "next/navigation";
import React, { useEffect } from "react";
import StoreProvider, { useAppDispatch, useAppSelector } from "../app/redux";
import Footer from "./Footer";
import Navbar from "./Navbar";
import Script from "next/script";
import AOS from "aos";
import { calculateTotals } from "../lib/features/cart/cartSlice";
import { restoreSession } from "../lib/features/auth/authActions";
import AuthGate from "../utils/AuthGate";
import { useAppUpdates } from "@/src/hooks/useAppUpdates";
import GuestLocationDetector from "./guestLocationDetector";



export const AppInitializer = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();

  //useAutoRefresh(); 

  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  return <>{children}</>;
};

const LayoutShell = ({ children }: { children: React.ReactNode }) => {
  const pathName = usePathname();
  const cartItems = useAppSelector((state) => state.cart.cartItems);
  const authPath = pathName.startsWith("/auth");
  const vendor = pathName.startsWith('/vendor')
  const marketer = pathName.startsWith('/marketer')
  const admin = pathName.startsWith('/admin')


  useEffect(() => {
    const timeout = setTimeout(() => {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    }, 300);

    return () => clearTimeout(timeout);
  }, [cartItems]);




  const navBarDispaly = () => {
    switch (true) {
      case pathName.startsWith("/vendor"):
        return !authPath;
      case pathName.startsWith("/marketer"):
        return !marketer;
      case pathName.startsWith("/admin"):
        return !admin;

      default:
        return !authPath ? <Navbar /> : null;
    }
  }

  return (
    <>
      {navBarDispaly()}
      {children}
      {!authPath && !vendor && <Footer />}
    </>
  );
};


const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {

  useEffect(() => {
    AOS.init({
      once: true,
      duration: 800,
    });
  }, []);

  useAppUpdates();

  return (
    <>
      <StoreProvider>
        <GuestLocationDetector />
        <AppInitializer>
            <LayoutShell>
          <AuthGate>
              {children}
              <Script
                src="https://video2.getstreamhosting.com:2020/dist/widgets.js"
                strategy="afterInteractive"
              />
          </AuthGate>
            </LayoutShell>
        </AppInitializer>
      </StoreProvider>
    </>
  );
};

export default LayoutWrapper;
