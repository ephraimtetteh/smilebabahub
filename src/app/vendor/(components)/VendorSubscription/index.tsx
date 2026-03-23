"use client";

import { useState } from "react";
import Button from "@/src/components/Button";
import { Products } from "@/src/constants/data";
import Image from "next/image";
import { packages } from "@/src/constants/subscription";

const VendorSubscription = () => {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  return (
    <div className="p-6 max-w-6xl mx-auto text-black">
      <h1 className="text-2xl font-semibold mb-6">Subscription & Boost</h1>

      {/* Billing Toggle */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-100 p-1 rounded-full flex">
          <button
            onClick={() => setBilling("monthly")}
            className={`px-4 py-2 rounded-full ${
              billing === "monthly" ? "bg-[#ffc105] text-black" : ""
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBilling("yearly")}
            className={`px-4 py-2 rounded-full ${
              billing === "yearly" ? "bg-[#ffc105] text-black" : ""
            }`}
          >
            Yearly
          </button>
        </div>
      </div>

      {/* Plans */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {packages.map((plan) => {
          const priceData = plan.prices.find(
            (p) => p.duration === billing
          );

          return (
            <div
              key={plan.id}
              className={`relative bg-white shadow rounded-xl p-4 border ${
                plan.popular ? "border-[#ffc105] scale-105" : ""
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <span className="absolute top-2 right-2 bg-[#ffc105] text-xs px-2 py-1 rounded-full">
                  Popular
                </span>
              )}

              <h2 className="text-lg font-bold capitalize">
                {plan.packageName}
              </h2>

              <p className="text-sm text-gray-500">{plan.text}</p>

              {/* Price */}
              <p className="text-2xl font-semibold my-3">
                GHS {priceData?.price}
                <span className="text-sm text-gray-500">
                  /{billing}
                </span>
              </p>

              {/* Features */}
              <ul className="text-sm mb-4 space-y-2">
                {plan.includes.map((item, idx) => (
                  <li
                    key={idx}
                    className={`flex items-center gap-2 ${
                      item.status === "no" ? "text-gray-400" : ""
                    }`}
                  >
                    <span
                      className={`${
                        item.status === "yes"
                          ? "text-green-600"
                          : "text-red-400"
                      }`}
                    >
                      {item.icon}
                    </span>
                    {item.package}
                  </li>
                ))}
              </ul>

              <Button
                text="Subscribe"
                className={`w-full ${
                  plan.popular
                    ? "bg-[#ffc105] text-black"
                    : "bg-black text-white"
                }`}
              />
            </div>
          );
        })}
      </div>
      <h2 className="text-xl font-semibold mb-4">Your Products</h2>

      <div className="grid md:grid-cols-3 gap-4">
        {Products.slice(0, 9).map((item) => (
          <div key={item.id} className="bg-white shadow rounded-xl p-3">
            <Image
              src={item.images[0]}
              width={300}
              height={300}
              alt=""
              className="rounded mb-2 w-full h-40 object-cover"
            />

            <h3 className="font-semibold">{item.title}</h3>
            <p className="text-sm text-gray-500">GHS {item.price}</p>

            <div className="flex gap-2 mt-3">
              <Button text="Boost" className="bg-[#ffc105] text-black w-full" />

              <Button
                text="Ad"
                className="bg-transparent border border-[#ffc105] w-full"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VendorSubscription;

      {/* Products with Boost */}