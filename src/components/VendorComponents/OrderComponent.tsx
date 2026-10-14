import { AddProductOrderProps } from '@/src/types/types';
import Image from 'next/image';
import { HiOutlineDotsHorizontal } from "react-icons/hi";


const statuVariantStyle = (status: AddProductOrderProps['status']) => {
  switch(status){
    case 'Active':
      return 'bg-black/20'
    case 'Finish': 
      return 'bg-gray-100'
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
    <div className="w-full overflow-x-auto">
      <div className="min-w-[700px] flex flex-col">
        {/* HEADER */}
        <div className="grid grid-cols-6 items-center text-gray-500 border-b border-gray-200 py-3 text-sm font-medium">
          <p>Order ID</p>
          <p>Image</p>
          <p>Date</p>
          <p>Total</p>
          <p>Status</p>
          <p className="text-right">Action</p>
        </div>

        {/* ROW */}
        <div className="grid grid-cols-6 items-center text-gray-700 border-b border-gray-200 py-3 text-sm">
          {/* Order ID */}
          <div>
            <h3 className="font-medium">{orderId}</h3>
          </div>

          {/* Image */}
          <div className="flex items-center gap-2">
            <Image
              src={image}
              alt="product-image"
              width={50}
              height={50}
              className="rounded"
            />
          </div>

          {/* Date */}
          <div className="text-gray-900">
            <p>{created_At}</p>
          </div>

          {/* Total */}
          <div>
            <p>${total}</p>
          </div>

          {/* Status */}
          <div>
            <span
              className={`px-3 py-1 rounded text-xs font-medium ${statuVariantStyle(
                status,
              )}`}
            >
              {status}
            </span>
          </div>

          {/* Action */}
          <div className="text-right cursor-pointer">
            <HiOutlineDotsHorizontal />
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderSumary