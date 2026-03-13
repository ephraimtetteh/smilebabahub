import Image from "next/image";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { CartItemProp } from "@/src/types/types";

const statusVariantStyle = (status: CartItemProp["status"]) => {
  switch (status) {
    case "delivered":
      return "bg-green-500 text-white";
    case "pending":
      return "bg-yellow-500";
    case "cancelled":
      return "bg-red-500 text-white";
    default:
      return "bg-gray-100";
  }
};

const TableComponent = ({
  image,
  status,
  id,
  amount,
  price
}: CartItemProp) => {
  return (
    <div className="grid grid-cols-5 items-center text-gray-700 border-b py-3">
      <p>{id}</p>

      <Image
        src={image}
        alt="product"
        width={50}
        height={50}
        className="rounded object-cover"
      />

      <p>GH {amount}</p>
      <p>{price}</p>

      <div
        className={`p-1 px-3 rounded text-xs w-fit ${statusVariantStyle(
          status,
        )}`}
      >
        {status}
      </div>

      <HiOutlineDotsHorizontal className="cursor-pointer" />
    </div>
  );
};

export default TableComponent;
