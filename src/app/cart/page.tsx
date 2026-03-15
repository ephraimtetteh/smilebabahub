"use client";

import Button from "@/src/components/Button";
import TableComponent from "@/src/components/TableComponent";
import { Products } from "@/src/constants/data";
import { useAppSelector } from "../redux";
import React, { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useProtectedAction } from "@/src/utils/useProtectedHandler";

const CartPage = () => {
  const user = useAppSelector((state) => state.auth.user);
  const { total, delivery, subTotal, cartItems } = useAppSelector((state) => state.cart)

  const router = useRouter()
  const protect = useProtectedAction()



  const [openModal, setOpenModal] = useState(false);

  // get full product details
  // const cartProducts = useMemo(() => {
  //   return cartItems.map((item) => {
  //     const product = Products.find((p) => p.id === item.id);
  //     return {
  //       ...product,
  //       quantity: item.amount,
  //     };
  //   });
  // }, [cartItems]);

  const handleOrder = () => {
    return toast.success("Order Successful");
  };

  if(cartItems.length === 0){
    return (
      <div className="pt-40 items-center text-center justify-center min-h-screen text-amber-500">
        <h1 className="text-4xl font-semibold">Your Bag </h1>
        <p className="text-[20px] capitalize">is Currently Empty</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-20 px-10 bg-amber-50 w-full">
      <div className="text-center py-6">
        <h1 className="text-2xl font-bold">Your Cart</h1>
      </div>

      <div className="flex items-start gap-6">
        {/* CART TABLE */}
        <div className="flex-1 border border-gray-300 rounded-lg p-6 bg-white">
          {cartItems.map((product) => (
            <TableComponent
              key={product.id}
              id={product.id}
              image={product.image}
              amount={product.amount}
              price={product.price}
              category={product.category}
              status="pending"
            />
          ))}
        </div>

        {/* ORDER SUMMARY */}
        <div className="flex flex-col w-[30%] bg-white shadow-xl rounded p-4">
          <h3 className="text-[20px] font-medium mb-4">Order Summary</h3>

          <div className="flex flex-col">
            <div className="grid grid-cols-3 py-2 border-b">
              <p>Item</p>
              <p>Qty</p>
              <p>Total</p>
            </div>

            {cartItems.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-3 py-2 border-b text-sm"
              >
                <small>{item.title}</small>
                <small>{item.amount}</small>
                <p>GH {item.price * item.amount}</p>
              </div>
            ))}
          </div>

          {/* TOTALS */}
          <div className="flex flex-col py-4 gap-2">
            <div className="grid grid-cols-2">
              <p className="font-medium">Sub Total</p>
              <p>GH {subTotal}</p>
            </div>

            <div className="grid grid-cols-2">
              <p className="font-medium">Delivery</p>
              <p>GH {delivery}</p>
            </div>

            <div className="grid grid-cols-2 font-semibold">
              <p>Total</p>
              <p>GH {total}</p>
            </div>
          </div>

          <Button text="Order" className="w-full" 
            onClick={() => {
            protect(() => {
              handleOrder()
            })
          }} />
        </div>
      </div>
    </div>
  );
};

export default CartPage;
