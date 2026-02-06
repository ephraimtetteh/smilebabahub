'use client'

import { assets, Products } from '@/assets/assets';
import Button from '@/components/Button';
import TableComponent from '@/components/TableComponent'
import { Product } from '@/types/types';
import React, { useEffect, useState } from 'react'
import { IoAdd } from "react-icons/io5";
import { toast } from 'react-toastify';

const CartPage = ({params}: {params: Promise<{id: string}>}) => {
  const { id } = React.use(params)

  const [product, setProduct] = useState<Product>();
  const [openModal, setOpenModal] = useState(false)

    useEffect(() => {
      const foundProduct = Products.find((product) => product.id === Number(id))
      console.log(foundProduct);
      setProduct(foundProduct)
  
    }, [id])
  return (
    <div className="h-screen py-20 px-30 m-auto flex flex-1 flex-col bg-amber-50 w-full">
      <div className="text-center py-6">
        <h1 className="text-2xl font-bold">Your Cart</h1>
      </div>

      <div className="flex items-start gap-4">
        <div className="flex-1 border border-gray-300 rounded-2l p-8">
          <TableComponent
            image={product?.image || Products[0].image}
            orderId={product?.id || 233}
            total="20"
            action={<IoAdd className="bg-amber-300 size-5" />}
            status="Active"
          />
          <TableComponent
            image={product?.image || Products[0].image}
            orderId={product?.id || 233}
            total="20"
            action={<IoAdd className="bg-amber-300 size-5" />}
            status="Active"
          />
          <TableComponent
            image={product?.image || Products[0].image}
            orderId={product?.id || 233}
            total="20"
            action={<IoAdd className="bg-amber-300 size-5" />}
            status="Active"
          />
        </div>

        <div className=" flex flex-col w-[30%] bg-white shadow-2xl shadow-neutral-200 rounded p-4">
          <h3 className="text-[20px] font-medium">Order Summary</h3>
          <div className="flex flex-col flex-1">
            <div className="grid grid-cols-3 items-center justify-between py-2 border-b border-gray-200">
              <p>items</p>
              <p>Qty</p>
              <p>Total</p>
            </div>
            <div className='grid grid-cols-3 items-center justify-between py-2 border-b border-gray-200'>
              <small>iphone</small>
              <small>2</small>
              <p>GH 20000.00</p>
            </div>
            <div className='grid grid-cols-3 items-center justify-between py-2 border-b border-gray-200'>
              <small>iphone</small>
              <small>2</small>
              <p>GH 20000.00</p>
            </div>
            <div className='grid grid-cols-3 items-center justify-between py-2 border-b border-gray-200'>
              <small>iphone</small>
              <small>2</small>
              <p>GH 20000.00</p>
            </div>
          </div>

          <div className='flex flex-col py-4'>
            <div className='grid grid-cols-2 items-center justify-between'>
              <p className='font-medium '>Sub Total: </p>
              <p>GH 20000.00</p>
            </div>
            <div className='grid grid-cols-2 items-center justify-between'>
              <p className='font-medium'>Deliver: </p>
              <p>GH 20.00</p>
            </div>
            <div className='grid grid-cols-2 items-center justify-between'>
              <p className='font-medium'>Total: </p>
              <p>GH 20020.00</p>
            </div>
          </div>

          <Button text='Order' className='w-full' onClick={() => setOpenModal((prev) => !prev)} />

          {openModal && toast.success('Order Successful') }
        </div>
      </div>
    </div>
  );
}

export default CartPage