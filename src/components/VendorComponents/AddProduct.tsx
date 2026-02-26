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
    <div className="flex flex-col ">
      <div className="grid grid-cols-6 items-center justify-between text-gray-500 border-b border-gray-200 py-2">
        <p>Product Name</p>
        <p>Inventory</p>
        <p>Price</p>
        <p>Sales</p>
        <p>Status</p>
        <p>Action</p>
      </div>

      <div className="grid grid-cols-6 items-center justify-between text-gray-700 border-b border-gray-200 py-2" onClick={() => setShowAction(!showAction)}>
        <div className="flex flex-row items-start gap-2">
          <Image
            src={image}
            alt="product-image"
            width={100}
            height={80}
            className="rounded"
          />
          <div className="flex flex-col py-1 gap-x-2 text-[12px]">
            <h3>{name}name</h3>
            <p>{brand}brand</p>
          </div>
        </div>
        <div className="text-[12px]">
          <p>{inventory} 9876</p>
        </div>
        <div className="text-[12px] text-gray-900">
          <p>${price}70</p>
        </div>
        <div className="text-[12px]">
          <p>{sales} 7654</p>
        </div>
        <div
          className={`bg-black/10 p-2 rounded border-white/20 text-[12px] shadow-sm w-fit ${statuVariantStyle(status)}`}
        >
          <p className="">{status}</p>
        </div>
        {!showAction && (
          <div>
            <p onClick={() => setShowAction((prev) => !prev)}>
              {<HiOutlineDotsHorizontal />}
            </p>
          </div>
        )}
      </div>

      {showAction &&  (
        <div className="flex flex-col gap-3 bg-white shadow-2xl shadow-neutral-400 py-2 items-center justify-center flex-1 w-60 z-50 absolute right-20 rounded">
          <div className="flex gap-3">
            <Button text="Edit" onClick={() => setEdit(!edit)}/>
            <Button text="Delete" className="bg-red-500 text-white" />
          </div>
        </div>
      )}

      {edit && <EditProduct />}
    </div>
  );
}

export default AddProduct