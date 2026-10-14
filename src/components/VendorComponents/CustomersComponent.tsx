import {CustomerProps } from '@/src/types/types';
import Image from 'next/image';
import { HiOutlineDotsHorizontal, HiOutlineDotsVertical } from "react-icons/hi";



const CustomersComponent = ({image, name, email, joined, spend, orders, location, action}: CustomerProps) => {
  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[700px] flex flex-col">
        <div className="flex flex-col ">
          <div className="grid grid-cols-7 items-center text-gray-500 border-b border-gray-200 py-3 text-sm font-medium">
            <p>Customers</p>
            <p>Orders</p>
            <p>Phone</p>
            <p>Spend</p>
            <p>Joined</p>
            <p>Location</p>
            <p>Action</p>
          </div>

          <div className="grid grid-cols-7 items-center text-gray-700 border-b border-gray-200 py-3 text-sm">
            <div className="items-start gap-2">
              <Image
                src={image}
                alt="product-image"
                width={30}
                height={30}
                className="rounded-full"
              />
              <div className="flex flex-col py-1 gap-x-2 text-[12px]">
                <h3>{name}</h3>
              </div>
            </div>
            <div className="text-[12px]">
              <p>{orders}</p>
            </div>
            <div>
              <h3>{email}</h3>
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
            <div className="flex gap-1 items-center">
              {action}
              <p>{<HiOutlineDotsVertical />}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomersComponent