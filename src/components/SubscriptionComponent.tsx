"use client";

import { SubscriptionComponentProps } from "@/src/types/types";

const SubscriptionComponent = ({
  packageName,
  prices,
  includes,
  text,
  plan,
  isActive,
  isPopular,
  localPrice,
  onClick,
}: SubscriptionComponentProps) => {
  // Fallback to original prices array if localPrice not passed
  const fallbackPrice = prices?.find((item) => item.duration === plan);

  const displayPrice =
    localPrice ?? (fallbackPrice ? `$${fallbackPrice.price}` : "—");

  const displayDuration = plan === "monthly" ? "mo" : "yr";
  const isFree = displayPrice === "Free" || fallbackPrice?.price === 0;

  return (
    <div
      onClick={onClick}
      className={`
        relative flex flex-col bg-white rounded-2xl cursor-pointer
        transition-all duration-300 ease-in-out overflow-hidden
        ${
          isActive
            ? "ring-2 ring-amber-400 shadow-xl shadow-amber-100 scale-[1.02]"
            : "shadow-md hover:shadow-lg hover:scale-[1.01]"
        }
        ${isPopular ? "ring-2 ring-amber-400" : ""}
      `}
    >
      {/* Popular badge */}
      {isPopular && (
        <div
          className="absolute top-0 left-0 right-0 bg-amber-400 text-black
          text-[11px] font-bold text-center py-1 tracking-wide uppercase"
        >
          ⭐ Most Popular
        </div>
      )}

      {/* Active checkmark */}
      {isActive && !isPopular && (
        <div
          className="absolute top-3 right-3 w-5 h-5 bg-amber-400 rounded-full
          flex items-center justify-center text-[10px] text-black font-bold"
        >
          ✓
        </div>
      )}

      <div
        className={`p-5 flex flex-col flex-1 ${isPopular ? "pt-8" : "pt-5"}`}
      >
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-900 capitalize">
            {packageName}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{text}</p>
        </div>

        {/* Price */}
        <div className="mb-5 pb-4 border-b border-gray-100">
          {isFree ? (
            <div>
              <span className="text-3xl font-black text-gray-900">Free</span>
              <p className="text-xs text-gray-400 mt-0.5">
                No credit card needed
              </p>
            </div>
          ) : (
            <div>
              <div className="flex items-end gap-1">
                <span className="text-3xl font-black text-gray-900 leading-none">
                  {displayPrice}
                </span>
                <span className="text-sm text-gray-400 mb-1">
                  / {displayDuration}
                </span>
              </div>
              {plan === "yearly" && (
                <p className="text-[11px] text-green-600 font-medium mt-1">
                  Billed annually · save up to 20%
                </p>
              )}
            </div>
          )}
        </div>

        {/* Features */}
        <ul className="flex-1 space-y-2.5 mb-5">
          {includes.map((item, index) => (
            <li key={index} className="flex items-start gap-2.5">
              <span
                className={`flex-shrink-0 mt-0.5 text-base leading-none
                  ${item.status === "yes" ? "text-amber-400" : "text-gray-300"}`}
              >
                {item.icon}
              </span>
              <span
                className={`text-sm leading-snug
                  ${item.status === "yes" ? "text-gray-700" : "text-gray-400 line-through"}`}
              >
                {item.package}
              </span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div
          className={`w-full py-2.5 rounded-xl text-sm font-bold text-center transition
            ${
              isActive
                ? "bg-amber-400 text-black"
                : isPopular
                  ? "bg-amber-400 text-black hover:bg-amber-500"
                  : "bg-gray-900 text-white hover:bg-gray-700"
            }`}
        >
          {isActive ? "✓ Selected" : isFree ? "Get started" : "Choose plan"}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionComponent;
