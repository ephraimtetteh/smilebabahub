"use client";

import Button from "@/components/Button";
import React, { useState } from "react";
import {packages} from '@/constants/subscription'
import SubscriptionComponent from "@/components/SubscriptionComponent";
import { SubscriptionPlanProps } from "@/types/types";
import { useRouter } from "next/navigation";


type Form2Props = {
  onNext: () => void;
  onBack: () => void;
};


const Subscription = ({
  selectedPlanId,
  onPlanSelect,
}: SubscriptionPlanProps) => {
  const router = useRouter()

  const [plan, setPlan] = useState<"monthly" | "yearly">("monthly");
  const [showSubscriptionSummary, setShowSubscriptionSummary] = useState(false)

  const [selectedPackage, setSelectedPackage] = useState(
    selectedPlanId ?? packages.find((pkg) => pkg.popular)?.id ?? packages[0].id,
  );

  const activePlanId = selectedPlanId ?? selectedPackage;

  const handlePlanSelect = (planId: string) => {
    onPlanSelect ? onPlanSelect(planId) : setSelectedPackage(planId);
  };

  

  return (
    <div className="mt-20 flex flex-col px-6 md:px-16 lg:px-24 xl:px-32 py-10 bg-black/20">
      <div className="flex flex-col items-center mx-auto">
        <h1 className="py-2 font-bold text-3xl capitalize">
          Subscription packages
        </h1>
        <p>Please choose your preferred subscription plan</p>

        <div className="flex gap-4 pt-8">
          <Button
            text="Monthly"
            onClick={() => setPlan("monthly")}
            className={plan === "monthly" ? "bg-[#ffc10565]" : ""}
          />
          <Button
            text="Yearly"
            onClick={() => setPlan("yearly")}
            className={plan === "yearly" ? "bg-[#ffc10565]" : ""}
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-4 md:grid-cols-2 p-8 gap-8">
        {packages.map((item) => {
          const isActive = activePlanId === item.id;
          const isPopular = item.popular;

          return (
            <SubscriptionComponent
              key={item.id}
              {...item}
              plan={plan}
              isActive={isActive}
              isPopular={isPopular}
              onClick={() => handlePlanSelect(item.id)}
            />
          );
        })}
      </div>

      {!showSubscriptionSummary && <div className="flex items-center justify-center">
        {activePlanId && (
          <Button
            text="Next"
            className="w-full"
            onClick={() => setShowSubscriptionSummary((prev) => !prev)}
          />
        )}
      </div>}

      {showSubscriptionSummary && (
        <div className="flex flex-col items-center justify-center absolute w-100 z-50 bg-black shadow-2xl shadow-neutral-400 mx-auto bottom-120 right-35 p-10 rounded-2xl">
          <div>
            <h1 className="text-2xl text-amber-300">Your Summary</h1>
          </div>

          <div className="mt-5 flex flex-1 flex-col gap-3 w-full">
            <div className="flex flex-1 flex-col items-center justify-between gap-3 ">
              <p className="text-white">Selected Package: {activePlanId}</p>
              {packages
                .filter((pkg) => pkg.id === activePlanId)
                .map((pkg) =>
                  pkg.prices.map((price) => (
                    <div key={`${pkg.id}-${price.plan}`} className="flex gap-3 ">
                      <p></p>

                      {plan && activePlanId && <p className="capitalize text-gray-500">{price.duration}</p>}
                      {plan && activePlanId && <p className="capitalize text-gray-500">{price.price}</p>}
                    </div>
                  )),
                )}
            </div>

            <div className="flex gap-3 items-center justify-center">
              <Button text="Pay Now" />
              <Button
                text="close"
                onClick={() =>
                  setShowSubscriptionSummary(!showSubscriptionSummary)
                }
                className="bg-red-500 text-white"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Subscription;


// const Subscription = ({ selectedPlanId, onPlanSelect }: SubscriptionPlanProps) => {
//   const [plan, setPlan] = useState("monthly");
//   const [selectedPackage, setSelectedPackage] = useState(selectedPlanId || packages.find((id) => id?.popular)?.id || packages[0].id)

//   const activePlanId = selectedPackage !== undefined ? selectedPlanId : selectedPackage

//   const handlePlanSelect = (planId: string) => {
//     if(onPlanSelect){
//       onPlanSelect(planId)
//     }else {
//       setSelectedPackage(planId)
//     }
//   }

//   return (
//     <div className="mt-20 flex-col flex  items-start justify-center w-80% px-6 md:px-16 lg:px-24 xl:px-32 text-black py-10 bg-black/20">
//       <div className="flex flex-col items-center justify-center mx-auto">
//         <h1 className="text-center py-2 font-bold text-3xl items-center justify-center capitalize">
//           Subscription packages
//         </h1>
//         <p className="text-center">
//           Please choose your prefer subscription page to continue
//         </p>
//         <div className="flex gap-4 pt-8">
//           <Button
//             onClick={() => setPlan("monthly")}
//             text="Monthly"
//             className={plan === "monthly" ? "bg-[#ffc10565]" : ""}
//           />
//           <Button
//             text="Yearly"
//             onClick={() => setPlan("yearly")}
//             className={plan === "yearly" ? "bg-[#ffc10565]" : ""}
//           />
//         </div>
//       </div>

//       <div className="grid lg:grid-cols-4 md:grid-cols-2 p-8 gap-8">
//   {packages.map((item) => (
//     item.popular 
//       ? "transition duration-300 ease-in-out -translate-1 scale-105 border-amber-400 border " 
//       : activePlanId === item.id
//     <SubscriptionComponent
//       key={}
//       {...item}
//       plan={plan}
//       onClick = {handlePlanSelect(item.id}
//     />
//   ))}
// </div>

//     </div>
//   );
// };




