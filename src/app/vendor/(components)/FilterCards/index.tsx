import { CircleDollarSign, LucideIcon } from 'lucide-react';
import React, { JSX, ReactNode } from 'react'

interface FilterCardProps {
  text: string;
  title: "Total Sales" | "Daily Sales" | "Total Earnings" | "Pending Orders";
  percentage: string;
  icon: JSX.Element;
}


const getTextVaraintStyles = (variant: FilterCardProps["title"]) => {
  switch (variant) {
    case "Total Sales":
      return "bg-green-100 text-green-700";
    case "Daily Sales":
      return "bg-blue-100 text-blue-700";
    case "Total Earnings":
      return "bg-yellow-100 text-yellow-700";
    case "Pending Orders":
      return "bg-red-100 text-red-700";
  }
};


const FilterCards = ({ text, title, percentage, icon }: FilterCardProps) => {
  return (
    <div className="flex flex-row flex-1 items-center justify-between bg-white shadow shadow-neutral-400 rounded-xl p-8">
    <div className='flex flex-col'>
      <h1 className="text-gray-500 pb-2 text-[14px]">{title}</h1>
      <h3 className="text-black pb-2 text-lg font-semibold">{text}</h3>
      <h3 className="text-red-500 pb-2 text-[14px]">{percentage}%</h3>
    </div>
    <div className={`${getTextVaraintStyles(title)} p-4 rounded-2xl`}>
      {icon}
    </div>
  </div>
  )
}

const index = () => {
  return (
    <div className='flex flex-row fl-1 gap-6 pb-12'>
      <FilterCards 
        title='Total Sales'
        text='$00.00'
        percentage='0.0'
        icon={<CircleDollarSign />}
      />

      <FilterCards 
        title='Daily Sales'
        text='$00.00'
        percentage='0.0'
        icon={<CircleDollarSign />}
      />

      <FilterCards 
        title='Total Earnings'
        text='$00.00'
        percentage='0.0'
        icon={<CircleDollarSign />}
      />

      <FilterCards 
        title='Pending Orders'
        text='$00.00'
        percentage='0.0'
        icon={<CircleDollarSign />}
      />
    </div>
  );
}

export default index