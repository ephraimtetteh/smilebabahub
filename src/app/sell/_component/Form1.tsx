"use client";

import { assets } from "@/src/assets/assets";
import Image from "next/image";
import React, { useState } from "react";
import { Categories } from '@/src/constants/sellFormData'
import { Category, StepProps } from "@/src/types/types";
import { validateForm } from "@/src/utils/sellFormutils";




const Form1 = ({ data, updateField, onNext, errors }: StepProps) => {

  const [categoryId, setCategoryId] = useState<string>("");
  const [childId, setChildId] = useState("");

  
  const handleImageChange = (index: number, file: File | null) => {
    const newImages = [...data.images || []];
    newImages[index] = file;

    updateField("images", newImages);;
  };

  const selectedCategory = Categories.find((category: Category) => category.id === categoryId) || null;
  const selectedChild = selectedCategory?.children?.find((child) => child.id === childId) || null;

 


//   const onChangeHandler = (e: React.ChangeEvent<
//  HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
//     >
//   ) => {
//     updateField(e.target.name, e.target.value);
//     console.log(data);
//   };

const handleNext = () => {
  const { isValid, errors } = validateForm(data, 1);

  if (!isValid) {
    console.log(errors);
    return;
  }

  onNext();
};
  

  return (
    <div className="min-h-screen flex justify-center px-4 sm:px-6 lg:px-8 pb-20">
      <div className="w-full max-w-3xl mt-5">
        <div className="bg-black mb-4 text-white rounded shadow p-2 sm:p-6 flex">
          <p className="flex-1 text-start font-bold">Post Your Ad</p>
          <p className="text-end text-[#ffc105]">clear</p>
        </div>
        <form className="flex flex-col gap-4">
          <input
            type="text"
            name="title"
            value={data.title}
            onChange={(e) => updateField("title", e.target.value)}
            placeholder="title"
            className={`border rounded px-4 py-3 w-full outline-none
              ${errors?.title ? "border-red-500" : "border-gray-300"}`}
          />
          {errors?.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title}</p>
          )}

          <select
            value={categoryId}
            onChange={(e) => {
              setCategoryId(e.target.value);
              setChildId("");
              updateField("category", e.target.value);
            }}
            className="border border-gray-300 rounded px-4 py-3 w-full outline-none"
          >
            <option value="">Select Category</option>
            {Categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}

            {errors?.category && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </select>

          <select
            value={childId}
            onChange={(e) => {
              setChildId(e.target.value);
              updateField("categoryChild", e.target.value);
            }}
            disabled={!selectedCategory}
            className="border border-gray-300 rounded px-4 py-3 w-full outline-none"
          >
            <option value="">Select Sub-Category</option>

            {selectedCategory?.children?.map((child) => (
              <option key={child.id} value={child.id}>
                {child.name}
              </option>
            ))}
          </select>

          <select
            disabled={!selectedChild}
            className="border border-gray-300 rounded px-4 py-3 w-full outline-none"
          >
            <option value="">Select Location</option>

            {selectedChild?.children?.map((grandChild, index) => {
              if (typeof grandChild === "string") {
                return (
                  <option key={index} value={grandChild}>
                    {grandChild}
                  </option>
                );
              }

              return (
                <option key={grandChild.id} value={grandChild.id}>
                  {grandChild.name}
                </option>
              );
            })}
          </select>

          <p className="text-xl">Add Photo</p>
          <p className="text-gray-500 py-2">
            First picture - is the title picture. You can change the order of
            photos: just grab your photos and drag
          </p>

          <div className="flex flex-wrap gap-4">
            {data.images.map((img, index) => (
              <label key={index} htmlFor={`image-${index}`}>
                {/* {index === 0 && (
                  <span className="absolute top-1 left-1 bg-black text-white text-xs px-2 py-1 rounded">
                    Main
                  </span>
                )} */}
                <Image
                  src={img ? URL.createObjectURL(img) : assets.upload_area}
                  width={140}
                  height={70}
                  alt="upload"
                  className="mt-4 cursor-pointer"
                />

                <input
                  type="file"
                  id={`image-${index}`}
                  hidden
                  accept="image/*"
                  onChange={(e) =>
                    handleImageChange(index, e.target.files?.[0] || null)
                  }
                />
              </label>
            ))}
          </div>

          <button
            onClick={handleNext}
            type="button"
            disabled={
              !data.title ||
              !data.category ||
              !data.categoryChild ||
              !data.images?.some((img) => img)
            }
            className="mt-4 w-full h-12 rounded bg-black text-white cursor-pointer disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </form>
      </div>
    </div>
  );
};

export default Form1;
