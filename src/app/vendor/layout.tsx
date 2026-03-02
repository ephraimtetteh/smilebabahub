import { ToastContainer } from "react-toastify";
import DashboardWrapper from "./DashboardWrapper";
import StoreProvider from "../redux";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen flex bg-[#ffffff]">
      <StoreProvider>
        <DashboardWrapper>{children}</DashboardWrapper>
        <ToastContainer theme="dark" />
      </StoreProvider>
    </div>
  );
}
<div >
  
 
</div>;