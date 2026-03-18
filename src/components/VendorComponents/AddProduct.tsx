import { AddProductOrderProps } from '@/src/types/types';
import Image from 'next/image'
import React, { JSX, useState } from 'react'
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import Button from '../Button';
import EditProduct from './EditProduct';


const statuVariantStyle = (status: AddProductOrderProps['status']) => {
  switch(status){
    case 'Active':
      return 'bg-black/20'
    case 'Completed':
      return 'bg-green-500'
    case 'Pending':
      return 'bg-yellow-500'
    case 'Delivered':
      return 'bg-green-700'
    case 'Cancelled':
      return 'bg-red-500'
  }
}

const AddProduct = ({image, name, brand, inventory, price, sales, status, title, action}: AddProductOrderProps) => {
  const [showAction, setShowAction] = useState(false)
  const [edit,setEdit ] = useState(false)

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[800px] flex flex-col">
        {/* HEADER */}
        <div className="grid grid-cols-6 items-center text-gray-500 border-b border-gray-200 py-3 text-sm font-medium">
          <p>Product Name</p>
          <p>Inventory</p>
          <p>Price</p>
          <p>Sales</p>
          <p>Status</p>
          <p className="text-right">Action</p>
        </div>

        {/* ROW */}
        <div className="grid grid-cols-6 items-center text-gray-700 border-b border-gray-200 py-3 text-sm relative">
          {/* PRODUCT */}
          <div className="flex items-center gap-2">
            <Image
              src={image}
              alt="product-image"
              width={60}
              height={60}
              className="rounded"
            />
            <div className="flex flex-col text-xs">
              <h3>{name}</h3>
              <p className="text-gray-500">{brand}</p>
            </div>
          </div>

          {/* INVENTORY */}
          <div>{inventory}</div>

          {/* PRICE */}
          <div>${price}</div>

          {/* SALES */}
          <div>{sales}</div>

          {/* STATUS */}
          <div>
            <span
              className={`px-3 py-1 rounded text-xs ${statuVariantStyle(status)}`}
            >
              {status}
            </span>
          </div>

          {/* ACTION */}
          <div className="text-right">
            <button onClick={() => setShowAction((prev) => !prev)}>
              <HiOutlineDotsHorizontal />
            </button>
          </div>

          {/* DROPDOWN */}
          {showAction && (
            <div className="absolute right-0 top-full mt-2 w-40 bg-white shadow-xl border border-gray-200 rounded-lg py-2 z-50">
              <button
                onClick={() => setEdit(true)}
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Edit
              </button>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500">
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {edit && <EditProduct />}
    </div>
  );
}

export default AddProduct