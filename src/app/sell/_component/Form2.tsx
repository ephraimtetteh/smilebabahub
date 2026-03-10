'use client'

import { Regions } from '@/src/constants/sellFormData';
import { StepProps } from '@/src/types/types';
import { validateForm } from '@/src/utils/sellFormutils';
import React from 'react'

const Form2 = ({ data, updateField, onNext, onBack, errors }: StepProps) => {
  const selectedRegion = Regions.find(
    (region) => region.capital === data.region,
  );

  const handleNext = () => {
    const { isValid, errors } = validateForm(data, 2);
  
    if (!isValid) {
      console.log(errors);
      return;
    }
  
    onNext();
  };

  return (
    <div className="min-h-screen flex justify-center px-4 pb-12">
      <form className="w-full max-w-3xl bg-white p-6 sm:p-8 rounded shadow flex flex-col gap-4">
        {/* inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mx-auto w-full">
          <div className="flex flex-1 ">
            <select
              name="region"
              value={data.region}
              onChange={(e) => updateField("region", e.target.value)}
              className={`border rounded px-4 py-3 w-full outline-none
                ${errors?.region ? "border-red-500" : "border-gray-300"}`}
            >
              <option value="">Select Region</option>

              {Regions.map((region) => (
                <option key={region.name} value={region.capital}>
                  {region.capital}
                </option>
              ))}
            </select>
            {errors?.region && (
              <p className="text-red-500 text-sm mt-1">{errors.region}</p>
            )}
          </div>

          <select
            name="city"
            value={data.city}
            onChange={(e) => updateField("city", e.target.value)}
            disabled={!selectedRegion}
            className={`border rounded px-4 py-3 w-full outline-none
              ${errors?.city ? "border-red-500" : "border-gray-300"}`}
          >
            <option value="">Select City</option>

            {selectedRegion?.majorCitiesOrSuburbs?.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
          {errors?.city && (
            <p className="text-red-500 text-sm mt-1">{errors.city}</p>
          )}
        </div>

        <textarea
          name="description"
          rows={5}
          value={data.description}
          onChange={(e) => updateField("description", e.target.value)}
          placeholder="Describe your item..."
          className={`border rounded px-4 py-3 w-full outline-none
            ${errors?.description ? "border-red-500" : "border-gray-300"}`}
        />

        {/* <p className="py-2">Are you open for negotiations</p>
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
        </div> */}

        <div className="grid grid-cols-2 gap-x-4 mx-auto w-full">
          <div className="flex flex-1 ">
            <input
              name="name"
              value={data.name}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder="Name"
              className={`border rounded px-4 py-3 w-full outline-none
                ${errors?.name ? "border-red-500" : "border-gray-300"}`}
            />
            {errors?.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-4 mx-auto w-full">
          <div className="flex flex-1 ">
            <input
              type="number"
              name="price"
              value={data.price}
              onChange={(e) => updateField("price", e.target.value)}
              placeholder="GH₵ Price"
              className={`border rounded px-4 py-3 w-full outline-none
                ${errors?.price ? "border-red-500" : "border-gray-300"}`}
            />
            {errors?.price && (
              <p className="text-red-500 text-sm mt-1">{errors.price}</p>
            )}
          </div>
          <div className="flex flex-1 ">
            <input
              type="tel"
              name="phone"
              value={data.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              placeholder="Phone Number"
              className={`border rounded px-4 py-3 w-full outline-none
                ${errors?.phone ? "border-red-500" : "border-gray-300"}`}
            />
            {errors?.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}
          </div>
        </div>

        {/* buttons */}
        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-3 rounded border"
          >
            Back
          </button>

          <button
            type="button"
            disabled={
              !data.region ||
              !data.city ||
              !data.price ||
              !data.phone ||
              !data.name ||
              !data.description
            }
            onClick={handleNext}
            className="px-6 py-3 rounded bg-black text-white disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </form>

      {/* Delivery options */}
      {/* <div className="flex flex-col gap-x-4 mx-auto w-full items-center">
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
      </div> */}
    </div>
  );
};

export default Form2