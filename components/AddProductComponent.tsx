import { assets } from '@/assets/assets';
import Image from 'next/image';
import React, { useState } from 'react'
import Button from './Button';
import InputCompontent from './InputCompontent';

const AddProductComponent = ({ showAddProduct, setShowAddProduct}) => {
  const [image, setImage] = useState<File | null >(null)

  return (
    <div className="flex flex-col items-center justify-center absolute w-150 z-50 bg-white shadow-2xl shadow-neutral-400 left-100 top-50 p-10 rounded-2xl">
      <div>
        <h1 className="text-2xl text-amber-300">
          Add more products to your store
        </h1>
        <p className="text-gray-600">
          Customers will only see product, status, price, the name of your store
          and store details
        </p>
      </div>

      <div className="mt-5 flex flex-1 flex-col gap-3 w-full">
        <div className="flex flex-1 items-center gap-3 ">
          <input
            type="text"
            placeholder="Product Name"
            value={""}
            className="border border-gray-400 p-2 rounded w-full"
          />
          <input
            type="text"
            placeholder="Price"
            value={""}
            className="border border-gray-400 p-2 rounded w-full"
          />
        </div>

        <div className="flex flex-1 items-center gap-3 ">
          <input
            type="text"
            placeholder="Inventory/Quantity"
            value={""}
            className="border border-gray-400 p-2 rounded w-full"
          />
          <input
            type="text"
            placeholder="Brand"
            value={""}
            className="border border-gray-400 p-2 rounded w-full"
          />
        </div>

        <div className="flex flex-1 items-center gap-3 ">
          <label htmlFor="">
            <Image
              src={!image ? assets.upload_area : URL.createObjectURL(image)}
              width={140}
              height={70}
              alt=""
              className="mt-4"
            />
            <input
              type="file"
              placeholder="Brand"
              value={""}
              id="image"
              hidden
              required
              onChange={(e) => setImage(e.target.files?.[0] || null)}
            />
          </label>
        </div>

        <div className="flex gap-3">
          <Button text="Add" />
          <Button
            text="close"
            onClick={() => setShowAddProduct(!showAddProduct)}
            className="bg-red-500 text-white"
          />
        </div>
      </div>
    </div>
  ); 
}

export default AddProductComponent