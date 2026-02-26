import { SubscriptionComponentProps } from "@/src/types/types";
import React from "react";

const SubscriptionComponent = ({
  packageName,
  prices,
  includes,
  text,
  plan,
  isActive,
  isPopular,
  onClick,
}: SubscriptionComponentProps) => {
  const selectedPrice = prices?.find(
    (item) =>
      (plan === "monthly" && item.plan === "monthly") ||
      (plan === "yearly" && item.plan === "yearly"),
  );

  return (
    <div
      onClick={onClick}
      className={`
        bg-white shadow-2xl p-4 rounded-2xl cursor-pointer
        transition duration-300 ease-in-out
        ${isActive ? "scale-105 border border-amber-400" : ""}
        // ${isPopular ? "ring-2 ring-amber-300" : ""}
      `}
    >
      <div className="pb-4">
        <h3 className="text-[24px] capitalize">{packageName}</h3>
        <p className="text-gray-600">{text}</p>
      </div>

      <p className="text-[28px] font-bold">
        {selectedPrice && (
          <>
            ${selectedPrice.price}{" "}
            <small className="text-sm font-medium">
              / {selectedPrice.duration}
            </small>
          </>
        )}
      </p>

      <div className="mt-4">
        {includes.map((item, index) => (
          <div key={index} className="flex gap-2 py-2 items-center">
            <span
              className={
                item.status === "yes" ? "text-amber-300" : "text-gray-500"
              }
            >
              {item.icon}
            </span>
            <p className="text-gray-700">{item.package}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionComponent;

