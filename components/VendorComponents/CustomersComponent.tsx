import {CustomerProps } from '@/types/types';
import Image from 'next/image';
import { HiOutlineDotsHorizontal, HiOutlineDotsVertical } from "react-icons/hi";



const CustomersComponent = ({image, name, email, joined, spend, orders, location, action}: CustomerProps) => {
  return (
    <div className="flex flex-col ">
      <div className="grid grid-cols-7 items-center justify-between text-gray-500 border-b border-gray-200 py-2">
        <p>Customers</p>
        <p>Email</p>
        <p>Orders</p>
        <p>Spend</p>
        <p>Joined</p>
        <p>Location</p>
        <p>actions</p>
      </div>

      <div className="grid grid-cols-7 items-center justify-between text-gray-700 border-b border-gray-200 py-2">
        <div className="flex flex-row items-start gap-2">
          <Image
            src={image}
            alt="product-image"
            width={30}
            height={30}
            className="rounded-full"
          />
          <div className="flex flex-col py-1 gap-x-2 text-[12px]">
            <h3>{name}</h3>
            <p>{email}</p>
          </div>
        </div>
        <div>
          <h3>{email}</h3>
        </div>
        <div className="text-[12px]">
          <p>{orders}</p>
        </div>
        <div className="text-[12px] text-gray-900">
          <p>${spend}</p>
        </div>
        <div className="text-[12px]">
          <p>{joined}</p>
        </div>
        <div
          className={`bg-black/10 p-2 rounded border-white/20 text-[12px] shadow-sm w-fit`}
        >
          <p className="">{location}</p>
        </div>
        <div className='flex gap-1 items-center'>
          {action}
          <p>{<HiOutlineDotsVertical />}</p>
        </div>
      </div>
    </div>
  );
}

export default CustomersComponent