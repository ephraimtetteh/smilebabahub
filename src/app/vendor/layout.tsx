import { assets } from "@/src/assets/assets";
import Sidebar from "@/src/components/VendorComponents/Sidebar";
import Image from "next/image";
import { ToastContainer } from "react-toastify";
import { IoIosArrowDown } from "react-icons/io";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen flex bg-[#ffffff]">
      <Sidebar />
      <div className="flex flex-col w-full ">
        <div className="flex items-center justify-between overflow-hidden w-full text-black shadow-xl shadow-neutral-400/20 py-10 px-6 max-h-15">
          <h3 className="font-bold text-3xl">Dashboard</h3>
          <div className="flex items-center justify-between bg-transparent border border-black/10 p-2 gap-4 rounded">
            <div className="flex gap-2 items-center">
              <Image src={assets.profile_icon} width={40} alt="" />
              <h1>Ephraim</h1>
            </div>
            <IoIosArrowDown />
          </div>
        </div>
        {children}
      </div>
      <ToastContainer theme="dark" />
    </div>
  );
}

{
  /* style={{ backgroundImage: `url(${assets.bgImage})` }} */
}
<div >
  
 
</div>;