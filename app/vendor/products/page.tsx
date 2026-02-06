'use client'
import { Products } from '@/assets/assets'
import AddProduct from '@/components/VendorComponents/AddProduct'
import React, { useState } from 'react'
import {
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdSearch,
} from "react-icons/md";
import { FaPlus } from "react-icons/fa6";
import Button from "@/components/Button";
import InputSearch from "@/components/InputSearch";
import Limit from '@/components/VendorComponents/Limit';
import AddProductComponent from '@/components/AddProductComponent';


const page = () => {
  const [showAddProduct, setShowAddProduct] = useState(false)

  return (
    <div className="bg-gray-50 flex flex-col gap-4 py-8 px-8 border-gray-200 border">
      <div className="flex flex-1 items-center justify-between pb-2">
        <Button
          text="Add Product"
          icon={<FaPlus />}
          className="flex items-center gap-2 text-white"
          onClick={() => setShowAddProduct(true)}
        />
        {showAddProduct && <AddProductComponent showAddProduct={showAddProduct} setShowAddProduct={setShowAddProduct} />}
        <div>
          <InputSearch text="Search" />
        </div>
      </div>

      {/* ====== add product component */}
      {Products.slice(3, 10).map((item) => (
        <AddProduct key={item.id} image={item.image} status="Completed" />
      ))}

      {/* ===== bottom */}

      <Limit />
    </div>
  );
}

export default page