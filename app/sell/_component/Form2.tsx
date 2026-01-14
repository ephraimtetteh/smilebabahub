import { Products } from '@/assets/assets';
import Button from '@/components/Button';
import React from 'react'

type Form2Props = {
  onNext: () => void;
  onBack: () => void;
};

const Form2 = ({ onBack, onNext}: Form2Props) => {
  return (
    <div className="mt-20 flex flex-col items-center justify-center">
      <form className="bg-[#efede9] w-[60%] flex flex-col flex-1 items-center justify-center py-8 px-16 mx-auto shadow rounded">
        {/* inputs */}
        <div className="grid grid-cols-2 gap-x-4 mx-auto w-full">
          <div className="flex flex-1 ">
            <select
              name=""
              id=""
              className="border-gray-300 sm:w-125 border p-4 rounded placeholder:text-[20px] mb-4 outline-none w-full"
            >
              {Products.map((item) => (
                <div key={item.id}>
                  <option value="" className="px-4">
                    {item.category}
                  </option>
                </div>
              ))}
            </select>
          </div>

          <div className="flex flex-1 ">
            <select
              name=""
              id=""
              className="border-gray-300 sm:w-125 border p-4 rounded placeholder:text-[20px] mb-4 outline-none w-full"
            >
              {Products.map((item) => (
                <div key={item.id}>
                  <option value="" className="px-4">
                    {item.category}
                  </option>
                </div>
              ))}
            </select>
          </div>

          <div className="flex flex-1 ">
            <select
              name=""
              id=""
              className="border-gray-300 sm:w-125 border p-4 rounded placeholder:text-[20px] mb-4 outline-none w-full"
            >
              {Products.map((item) => (
                <div key={item.id}>
                  <option value="" className="px-4">
                    {item.category}
                  </option>
                </div>
              ))}
            </select>
          </div>
        </div>

        <textarea
          name=""
          id=""
          rows={5}
          className="border-gray-300 max-sm:w-125 border p-4 rounded placeholder:text-[20px] mb-4 outline-none w-full"
          placeholder="Description"
        ></textarea>

        <p className="py-2">Are you open for negotiations</p>
        <div className="flex items-center gap-4 capitalize pb-6">
          <div className="flex items-center gap-4">
            <input type="radio" />
            yes
          </div>
          <div className="flex items-center gap-4 ">
            <input type="radio" />
            no
          </div>
          <div className="flex items-center gap-4">
            <input type="radio" />
            Not Sure
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-4 mx-auto w-full">
          <div className="flex flex-1 ">
            <input
              type="text"
              placeholder="Contact"
              className="border-gray-300 sm:w-125 border p-4 rounded placeholder:text-[20px] mb-4 outline-none w-full"
            />
          </div>
          <div className="flex flex-1 ">
            <input
              type="text"
              placeholder="Name"
              className="border-gray-300 sm:w-125 border p-4 rounded placeholder:text-[20px] mb-4 outline-none w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-4 mx-auto w-full">
          <div className="flex flex-1 ">
            <input
              type="text"
              placeholder="GH price"
              className="border-gray-300 sm:w-125 border p-4 rounded placeholder:text-[20px] mb-4 outline-none w-full"
            />
          </div>
          <div className="flex flex-1 ">
            <input
              type="text"
              placeholder="Name"
              className="border-gray-300 sm:w-125 border p-4 rounded placeholder:text-[20px] mb-4 outline-none w-full"
            />
          </div>
        </div>

        {/* buttons */}
        <div className="flex flex-row flex-1 items-center justify-between gap-12">
          <button type="button" onClick={onBack}>
            Back
          </button>

          <button type="button" onClick={onNext}>
            Next
          </button>
        </div>
      </form>

      {/* Delivery options */}
      <div className="flex flex-col gap-x-4 mx-auto w-full items-center">
        <p className="py-3">Delivery Options</p>
        <div className="flex flex-1 ">
          <select
            name=""
            id=""
            className="border-gray-300 sm:w-125 border p-4 rounded placeholder:text-[20px] mb-4 outline-none w-full"
          >
            {Products.map((item) => (
              <div key={item.id}>
                <option value="" className="px-4">
                  {item.category}
                </option>
              </div>
            ))}
          </select>
        </div>

        <Button text="Select an Option" className="w-full" />
      </div>
    </div>
  );
}

export default Form2