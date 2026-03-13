
import React from "react";

import InputSearch from "@/src/components/InputSearch";
import OrderSumary from "@/src/components/VendorComponents/OrderComponent";
import Limit from "@/src/components/VendorComponents/Limit";
import { Products } from "@/src/constants/data";

const page = () => {
  return (
    <div className="bg-gray-50 flex flex-col gap-4 py-8 px-8 border-gray-200 border">
      <div className="flex flex-1 items-center justify-between pb-2">
        <div>
          <InputSearch text="Search" />
        </div>
      </div>

      {/* ====== add product component */}
      {Products.slice(3, 10).map((item) => (
        <OrderSumary key={item.id} orderId={item.id} image={item.images[0]} status="Pending" created_At={'11-22-25'} />
      ))}

      {/* ===== bottom */}
      <Limit />
    </div>
  );
};

export default page;
