import { assets } from '@/src/assets/assets';
import Image from 'next/image';
import React, { useState } from 'react'
import Button from './Button';
import { ShowProductProps } from '@/src/types/types';

const AddProductComponent = ({
  showAddProduct,
  setShowAddProduct,
}: ShowProductProps) => {
  const [image, setImage] = useState<File | null>(null);

  return (
    
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm overflow-y-auto"
      onClick={() => setShowAddProduct(false)}
    >
      <div
        className="flex min-h-full items-center justify-center p-4"
        onClick={(e) => e.stopPropagation()}
      >
      <div className="w-full max-w-lg bg-white shadow-2xl rounded-2xl p-5 sm:p-6 lg:p-8 max-h-[90vh] overflow-y-auto">
          <div>
            <h1 className="text-xl sm:text-2xl text-amber-400 font-semibold">
              Add more products to your store
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Customers will see product info, price, and store details
            </p>
          </div>

          <div className="mt-5 flex flex-col gap-4">
            {/* Row 1 */}
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Product Name"
                className="border border-gray-300 p-2 rounded w-full"
              />
              <input
                type="text"
                placeholder="Price"
                className="border border-gray-300 p-2 rounded w-full"
              />
            </div>

            {/* Row 2 */}
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Inventory/Quantity"
                className="border border-gray-300 p-2 rounded w-full"
              />
              <input
                type="text"
                placeholder="Brand"
                className="border border-gray-300 p-2 rounded w-full"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label htmlFor="image" className="cursor-pointer">
                <Image
                  src={!image ? assets.upload_area : URL.createObjectURL(image)}
                  width={120}
                  height={80}
                  alt="upload"
                  className="mt-2 rounded"
                />
              </label>

              <input
                type="file"
                id="image"
                hidden
                accept="image/*"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
              />
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button text="Add" className="w-full" />
              <Button
                text="Close"
                onClick={() => setShowAddProduct(false)}
                className="bg-red-500 text-white w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProductComponent