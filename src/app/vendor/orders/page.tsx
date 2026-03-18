
import React from "react";

import InputSearch from "@/src/components/InputSearch";
import OrderSumary from "@/src/components/VendorComponents/OrderComponent";
import Limit from "@/src/components/VendorComponents/Limit";
import { Products } from "@/src/constants/data";

const page = () => {
  return (
    <div className="bg-gray-50 flex flex-col gap-6 py-4 sm:py-6 px-4 sm:px-6 lg:px-8 border border-gray-200 rounded-xl">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="w-full sm:w-72">
          <InputSearch text="Search" />
        </div>
      </div>

      {/* TABLE */}
      <div className="w-full overflow-x-auto">
        <div className="min-w-[700px] flex flex-col">
          {/* HEADER ROW */}
          <div className="grid grid-cols-6 text-gray-500 text-sm border-b border-gray-200 py-3 font-medium">
            <p>Order ID</p>
            <p>Image</p>
            <p>Date</p>
            <p>Total</p>
            <p>Status</p>
            <p className="text-right">Action</p>
          </div>

          {/* ORDERS */}
          {Products.slice(3, 10).map((item) => (
            <OrderSumary
              key={item.id}
              orderId={item.id}
              image={item.images[0]}
              status="Pending"
              created_At={"11-22-25"}
            />
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <Limit />
    </div>
  );
};

export default page;
