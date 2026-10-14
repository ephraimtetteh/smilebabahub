import { ToastContainer } from "react-toastify";
import DashboardWrapper from "./DashboardWrapper";
import StoreProvider from "../redux";
import { RadioProvider } from "@/src/components/RadioContext";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen flex bg-[#ffffff]">
      <StoreProvider>
        <DashboardWrapper>
          <RadioProvider>
            {children}
          </RadioProvider>
          </DashboardWrapper>
        <ToastContainer theme="dark" />
      </StoreProvider>
    </div>
  );
}
<div >
  
 
</div>;