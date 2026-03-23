"use client";

import Button from "@/src/components/Button";
import { Products } from "@/src/constants/data";
import Image from "next/image";

const plans = [
  {
    name: "Basic",
    price: "Free",
    features: ["5 Listings", "Basic Visibility"],
  },
  {
    name: "Pro",
    price: "GHS 50/month",
    features: ["20 Listings", "Priority Listing", "Analytics"],
  },
  {
    name: "Premium",
    price: "GHS 120/month",
    features: ["Unlimited Listings", "Top Placement", "Verified Badge"],
  },
];

const VendorSubscription = () => {
  return (
    <div className="p-6 max-w-6xl mx-auto text-black">
      <h1 className="text-2xl font-semibold mb-6">Subscription & Boost</h1>

      {/* Plans */}
      <div className="grid md:grid-cols-3 gap-4 mb-10">
        {plans.map((plan, i) => (
          <div key={i} className="bg-white shadow rounded-xl p-4">
            <h2 className="text-lg font-bold">{plan.name}</h2>
            <p className="text-xl my-2">{plan.price}</p>

            <ul className="text-sm mb-4">
              {plan.features.map((f, idx) => (
                <li key={idx}>• {f}</li>
              ))}
            </ul>

            <Button text="Subscribe" />
          </div>
        ))}
      </div>

      {/* Products with Boost */}
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
