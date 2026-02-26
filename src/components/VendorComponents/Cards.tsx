import React, { JSX } from 'react'
import { FcSalesPerformance } from "react-icons/fc";
import { IoCartOutline } from "react-icons/io5";
import { MdOutlineAttachMoney, MdOutlinePendingActions } from "react-icons/md";

interface VendorCardProps {
  title?: "Total Sales" | "New Orders" | "Total Earnings" | "Pending Orders" ;
  amount?: string;
  difference?: string;
  textVariant?: "primary" | "default" | "secondary" | "danger" | "success";
  icon?: JSX.Element
}


const getTextVaraintStyles = (variant: VendorCardProps['title']) => {
  switch(variant){
    case "Total Sales":
      return "text-gray-700"
    case "New Orders":
      return "text-green-700"
    case "Total Earnings":
      return "text-blue-700"
    case "Pending Orders":
      return "text-red-500"
  }
}


const TotalSales = ({title, amount, difference, textVariant, icon}: VendorCardProps) => {
  return(
    <div className='w-[25%] flex flex-col gap-2 border bg-transparent border-gray-200 shadow-sm py-3 px-8 text-black rounded'>
      <div>
        {icon}
      </div>
      <div className='flex items-end justify-between gap-2'>
        <div>
          <h3 className={`text-[18px] text-gray-600 ${title}` }>{title}</h3>
          <h1 className={`text-2xl text-[#ffc105] font-semibold py-1 *:**:
            ${getTextVaraintStyles(title)}`}>{amount}</h1>
        </div>
        <p className='text-green-500 text-[20px]'>{difference}.0%</p>
      </div>
    </div>
  )
}

// const NewOrders = ({title, amount, difference, textVariant}: VendorCardProps) => {
//   return (
//     <div className="w-[20%] border border-gray-200 shadow-sm py-3 px-8 text-black rounded">
//       <h3 className="text-[18px] text-gray-600">{title}</h3>
//       <h1
//         className={`text-2xl text-[#ffc105] font-semibold py-1 *:**:
//         ${textVariant}`}
//       >
//         {amount}
//       </h1>
//       <p className="text-green-500 text-[20px]">{difference}.0%</p>
//     </div>
//   );
// }

// const Earnings = ({title, amount, difference, textVariant}: VendorCardProps) => {
//   return (
//     <div className="w-[20%] border border-gray-200 shadow-sm py-3 px-8 text-black rounded">
//       <h3 className="text-[18px] text-gray-600">{title}</h3>
//       <h1
//         className={`text-2xl text-[#ffc105] font-semibold py-1 *:**:
//         ${textVariant}`}
//       >
//         {amount}
//       </h1>
//       <p className="text-green-500 text-[20px]">{difference}.0%</p>
//     </div>
//   );
// }

// const PendingOrders = ({title, amount, difference, textVariant}: VendorCardProps) => {
//   return (
//     <div className="w-[20%] border border-gray-200 shadow-sm py-3 px-8 text-black rounded">
//       <h3 className="text-[18px] text-gray-600">{title}</h3>
//       <h1
//         className={`text-2xl text-[#ffc105] font-semibold py-1 *:**:
//         ${textVariant}`}
//       >
//         {amount}
//       </h1>
//       <p className="text-green-500 text-[20px]">{difference}.0%</p>
//     </div>
//   );
// }

const Cards = () => {
  return (
    <div className="flex fle-1 flex-row gap-2 items-center justify-between py-8 ">
      <TotalSales
        title="Total Sales"
        amount="0000.00"
        difference="0"
        icon={<FcSalesPerformance size={40} className="text-[#ffc105]" />}
      />

      <TotalSales
        title="New Orders"
        amount="0000.00"
        difference="0"
        icon={<IoCartOutline size={40} className="text-green-500" />}
      />

      <TotalSales
        title="Total Earnings"
        amount="0000.00"
        difference="0"
        icon={<MdOutlineAttachMoney size={40} className="text-blue-500" />}
      />

      <TotalSales
        title="Pending Orders"
        amount="0000.00"
        difference="0"
        icon={<MdOutlinePendingActions size={40} className="text-red-500" />}
      />
    </div>
  );
}

export default Cards