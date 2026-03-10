"use client";

import Image from "next/image";
import { SellFormData, StepProps } from "@/src/types/types";


export interface Form3Props {
  data: SellFormData;
  onBack: () => void;
}

const Form3 = ({ data, onBack }: Form3Props) => {
  return (
    <div className="min-h-screen flex justify-center px-4 pb-12">
      <div className="w-full max-w-3xl bg-white rounded shadow p-6 flex flex-col gap-6">
        <h2 className="text-xl font-semibold">Review Your Ad</h2>

        {/* Images */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {data.images?.map(
            (img, index) =>
              img && (
                <div key={index} className="relative h-28 w-full">
                  <Image
                    src={URL.createObjectURL(img)}
                    alt="preview"
                    fill
                    className="object-cover rounded"
                  />
                </div>
              ),
          )}
        </div>

        {/* Title */}
        <div>
          <p className="text-gray-500 text-sm">Title</p>
          <p className="font-medium">{data.title}</p>
        </div>

        {/* Category */}
        <div>
          <p className="text-gray-500 text-sm">Category</p>
          <p className="font-medium">
            {data.category} / {data.categoryChild}
          </p>
        </div>

        {/* Location */}
        <div>
          <p className="text-gray-500 text-sm">Location</p>
          <p className="font-medium">
            {data.region} - {data.city}
          </p>
        </div>

        {/* Price */}
        <div>
          <p className="text-gray-500 text-sm">Price</p>
          <p className="font-medium">GH₵ {data.price}</p>
        </div>

        {/* Description */}
        <div>
          <p className="text-gray-500 text-sm">Description</p>
          <p className="text-gray-700">{data.description}</p>
        </div>

        {/* Contact */}
        <div>
          <p className="text-gray-500 text-sm">Contact</p>
          <p>{data.name}</p>
          <p>{data.phone}</p>
        </div>

        {/* Buttons */}
        <div className="flex justify-between pt-6">
          <button onClick={onBack} className="px-6 py-3 border rounded">
            Edit
          </button>

          <button className="px-6 py-3 bg-black text-white rounded">
            Publish Ad
          </button>
        </div>
      </div>
    </div>
  );
};

export default Form3;
