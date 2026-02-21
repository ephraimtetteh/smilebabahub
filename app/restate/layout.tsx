import React from "react";
import { ToastContainer } from "react-toastify";
import StoreProvider from "../StoreProvider";

const RestateLayout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  return (
    <html lang="en">
      <body className={`relative min-h-screen`}>
        <ToastContainer />

        <StoreProvider user={null}>{children}</StoreProvider>
      </body>
    </html>
  );
};

export default RestateLayout;
