import { AddProductOrderProps } from '@/types/types';
import Image from 'next/image';
import { HiOutlineDotsHorizontal } from "react-icons/hi";


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

const OrderSumary = ({image, created_At, customer, total, status, orderId, action}: AddProductOrderProps) => {
  return (
    <div className="flex flex-col ">
      <div className="grid grid-cols-7 items-center justify-between text-gray-500 border-b border-gray-200 py-2">
        <p>Order ID</p>
        <p>Image</p>
        <p>Customer</p>
        <p>Date</p>
        <p>Total</p>
        <p>Status</p>
        <p>Action</p>
      </div>

      <div className="grid grid-cols-7 items-center justify-between text-gray-700 border-b border-gray-200 py-2">
        <div>
          <h3>{orderId}</h3>
        </div>
        <div className="flex flex-row items-start gap-2">
          <Image
            src={image}
            alt="product-image"
            width={50}
            height={50}
            className="rounded"
          />
        </div>
        <div className="text-[12px]">
          <p>{customer}</p>
        </div>
        <div className="text-[12px] text-gray-900">
          <p>{created_At}</p>
        </div>
        <div className="text-[12px]">
          <p>${total} 7654</p>
        </div>
        <div
          className={`bg-black/10 p-2 rounded border-white/20 text-[12px] shadow-sm w-fit ${statuVariantStyle(
            status
          )}`}
        >
          <p className="">{status}</p>
        </div>
        <div>
          <p>{<HiOutlineDotsHorizontal />}</p>
        </div>
      </div>
    </div>
  );
}

export default OrderSumary