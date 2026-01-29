import { Products } from '@/assets/assets';
import Button from '@/components/Button';
import React, { useState } from 'react'
import { text } from 'stream/consumers';

type Form2Props = {
  onNext: () => void;
  onBack: () => void;
};

const Subscription = ({ onNext, onBack }: Form2Props) => {

  const [plan, setPlan] = useState('monthly')

  return (
    <div className="mt-20 flex-col flex  items-start justify-center w-80% px-6 md:px-16 lg:px-24 xl:px-32 text-black py-10 bg-black/20">
      <div className="flex flex-col items-center justify-center mx-auto">
        <h1 className="text-center py-2 font-bold text-3xl items-center justify-center capitalize">
          Subscription packages
        </h1>
        <p className="text-center">
          Please choose your prefer subscription page to continue
        </p>
        <div className="flex gap-4 pt-8">
          <Button
            onClick={() => setPlan("monthly")}
            text="Monthly"
            className={plan === "monthly" ? "bg-[#ffc10565]" : ""}
          />
          <Button
            text="Yearly"
            onClick={() => setPlan("yearly")}
            className={plan === "yearly" ? "bg-[#ffc10565]" : ""}
          />
        </div>
      </div>

      {plan === "monthly" && (
        <div className="grid lg:grid-cols-3 md:grid-cols-2 p-8 gap-8">
          <div className="bg-white/50 shadow-2xl p-4 rounded-2xl ">
            <div className="py-2 flex-col items-center justify-center">
              <h3 className="text-[20px] font-bold">Basic Package</h3>
              <p className="text-20px font-bold">
                GH 30/{" "}
                <span className="text-[12px] text-green-500">monthly</span>
              </p>
            </div>
            <div>
              {Products.slice(0, 12).map((item) => (
                <div key={item.id} className="flex gap-2 py-2">
                  <span className=" bg-black/50 rounded px-1"></span>
                  <p>{item.title}</p>
                </div>
              ))}
            </div>
            <Button text="Select" className="w-full mt-4" />
          </div>

          <div className="bg-white/50 shadow-2xl p-4 rounded-2xl ">
            <div className="py-2 flex-col items-center justify-center">
              <h3 className="text-[20px] font-bold">Basic Package</h3>
              <p className="text-20px font-bold">
                GH 30/{" "}
                <span className="text-[12px] text-green-500">monthly</span>
              </p>
            </div>
            <div>
              {Products.slice(0, 12).map((item) => (
                <div key={item.id} className="flex gap-2 py-2">
                  <span className=" bg-black/50 rounded px-1"></span>
                  <p>{item.title}</p>
                </div>
              ))}
            </div>
            <Button text="Select" className="w-full mt-4" />
          </div>

          <div className="bg-white/50 shadow-2xl p-4 rounded-2xl ">
            <div className="py-2 flex-col items-center justify-center">
              <h3 className="text-[20px] font-bold">Basic Package</h3>
              <p className="text-20px font-bold">
                GH 30/{" "}
                <span className="text-[12px] text-green-500">monthly</span>
              </p>
            </div>
            <div>
              {Products.slice(0, 12).map((item) => (
                <div key={item.id} className="flex gap-2 py-2">
                  <span className=" bg-black/50 rounded px-1"></span>
                  <p>{item.title}</p>
                </div>
              ))}
            </div>
            <Button text="Select" className="w-full mt-4" />
          </div>
        </div>
      )}

      {plan === "yearly" && (
        <div className="grid lg:grid-cols-3 md:grid-cols-2 p-8 gap-8">
          <div className="bg-white/50 shadow-2xl p-4 rounded-2xl ">
            <div className="py-2 flex-col items-center justify-center">
              <h3 className="text-[20px] font-bold">Basic Package</h3>
              <p className="text-20px font-bold">
                GH 360/{" "}
                <span className="text-[12px] text-green-500">yearly</span>
              </p>
            </div>
            <div>
              {Products.slice(0, 12).map((item) => (
                <div key={item.id} className="flex gap-2 py-2">
                  <span className=" bg-black/50 rounded px-1"></span>
                  <p>{item.title}</p>
                </div>
              ))}
            </div>
            <Button text="Select" className="w-full mt-4" />
          </div>

          <div className="bg-white/50 shadow-2xl p-4 rounded-2xl ">
            <div className="py-2 flex-col items-center justify-center">
              <h3 className="text-[20px] font-bold">Basic Package</h3>
              <p className="text-20px font-bold">
                GH 30/{" "}
                <span className="text-[12px] text-green-500">monthly</span>
              </p>
            </div>
            <div>
              {Products.slice(0, 12).map((item) => (
                <div key={item.id} className="flex gap-2 py-2">
                  <span className=" bg-black/50 rounded px-1"></span>
                  <p>{item.title}</p>
                </div>
              ))}
            </div>
            <Button text="Select"  className="w-full mt-4" />
          </div>

          <div className="bg-white/50 shadow-2xl p-4 rounded-2xl ">
            <div className="py-2 flex-col items-center justify-center">
              <h3 className="text-[20px] font-bold">Basic Package</h3>
              <p className="text-20px font-bold">
                GH 360/{" "}
                <span className="text-[12px] text-green-500">monthly</span>
              </p>
            </div>
            <div>
              {Products.slice(0, 12).map((item) => (
                <div key={item.id} className="flex gap-2 py-2">
                  <span className=" bg-black/50 rounded px-1"></span>
                  <p>{item.title}</p>
                </div>
              ))}
            </div>
            <Button text="Select" className="w-full mt-4" />
          </div>
        </div>
      )}
    </div>
  );
}

export default Subscription