'use client'

import AddProduct from '@/src/components/VendorComponents/AddProduct'
import React, { useState } from 'react'
import { FaPlus } from "react-icons/fa6";
import Button from "@/src/components/Button";
import InputSearch from "@/src/components/InputSearch";
import Limit from '@/src/components/VendorComponents/Limit';
import AddProductComponent from '@/src/components/AddProductComponent';
import { Products } from '@/src/constants/data';


const Productpage = () => {
  const [showAddProduct, setShowAddProduct] = useState(false)

  return (
    <div className="bg-gray-50 flex flex-col gap-6 py-6 px-4 sm:px-6 lg:px-8 border border-gray-200">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <Button
          text="Add Product"
          icon={<FaPlus />}
          className="flex items-center justify-center gap-2 text-white w-full sm:w-auto"
          onClick={() => setShowAddProduct(true)}
        />

        <div className="w-full sm:w-64">
          <InputSearch text="Search" />
        </div>
      </div>

      {/* PRODUCTS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Products.slice(3, 10).map((item) => (
          <AddProduct key={item.id} image={item.images[0]} status="Completed" />
        ))}
      </div>

      {/* BOTTOM */}
      <Limit />

      {/* MODAL (OUTSIDE FLOW) */}
      {showAddProduct && (
        <AddProductComponent
          showAddProduct={showAddProduct}
          setShowAddProduct={setShowAddProduct}
        />
      )}
    </div>
  );
}

export default Productpage