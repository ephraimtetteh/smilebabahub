import React from 'react'
import { ToastContainer } from "react-toastify";
import StoreProvider from '../redux';
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Market Place | SmileBaba Hub",
  description:
    "SmileBabahub marketplace . buy and sell everything you need across Ghana and Nigeria.",
  openGraph: {
    title: "SmileBabahub Marketplace",
    description:
      "buyy and sell any thing you need on smilebaba hub",
    url: "https://smilebabahub.com/marketer",
    siteName: "SmileBaba Hub",
    type: "website",
  },
  robots: { index: true, follow: true },
};

const MarketLayout = ({children,}: Readonly<{children: React.ReactNode;}>) => {
  return (

        <html lang="en">
          <body className={`relative min-h-screen`}>
            <ToastContainer />
           
              <StoreProvider>{children}</StoreProvider>
            
          </body>
        </html>
      );
    }


export default MarketLayout