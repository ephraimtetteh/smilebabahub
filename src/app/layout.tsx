import "./globals.css";
import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import Head from "next/head";
import { ToastContainer } from "react-toastify";
import LayoutWrapper from "@/src/components/LayoutShell";


const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "SmileBaba | Buy & Sell Online with Ease",
  description:
    "SmileBaba is a trusted online marketplace to buy and sell products easily. Discover great deals, connect with sellers, and shop smarter every day.",
};



export default function RootLayout({

  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <link rel="icon" href="/logo1.png" />
      </Head>
      <body className={`relative min-h-screen ${outfit.className}`}>
        <ToastContainer />
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  );
}
