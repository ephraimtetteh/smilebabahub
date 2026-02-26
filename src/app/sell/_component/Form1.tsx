"use client";

import { assets } from "@/src/assets/assets";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Categories } from '@/src/constants/sellFormData'
import { Category, FormProps } from "@/src/types/types";




const Form1 = ({ onNext }: FormProps) => {

  const [categories, setCategories] = useState< Category[]> ([])
  const [categoryId, setCategoryId] = useState<string>("");
  const [childId, setChildId] = useState("");
  const [image, setImage] = useState<File | null >(null)
  const [data, setData] = useState({
    title: "",
    category: {},
  });

  const selectedCategory = Categories.find((category: Category) => category.id === categoryId) || null;
  const selectedChild = selectedCategory?.children?.find((child) => child.id === childId) || null;

  useEffect(() => {
    setCategories(Categories)
  }, [])


  const onChangeHandler = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setData({ ...data, [e.target.name]: e.target.value });
    console.log(data);
  };

  const handleNext = async () => {};
  

  return (
    <div className="absolute right-0 left-0 flex flex-col flex-1 items-center justify-start bg-amber-50 h-screen">
      <div className="w-[60%] flex flex-col flex-1 items-center justify-center mt-30">
        <div className="flex bg-white w-full py-3 px-4 items-center justify-center rounded mb-4">
          <p className="flex-1 text-center font-bold">Post Your Ad</p>
          <p className="text-end text-[#ffc105]">clear</p>
        </div>
        <form className="bg-white px-60 py-6 flex flex-col flex-1 w-full mb-20">
          <input
            type="text"
            placeholder="title"
            required
            className="border-gray-300 border px-4 py-3 w-full sm:w-125 rounded placeholder:text-[20px] mb-4 outline-none"
          />
          {/* <select
            name="category"
            required
            className="border-gray-300 w-full sm:w-125 border p-4 rounded mb-4 outline-none"
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">Select Category</option>

            {categories.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select> */}

          <select
            value={categoryId}
            onChange={(e) => {
              setCategoryId(e.target.value);
              setChildId(""); // reset lower level
            }}
            className="border-gray-300 w-full sm:w-125 border p-4 rounded mb-4 outline-none"
          >
            <option value="">Select Category</option>
            {Categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* <select
            name="categoryType"
            required
            disabled={!selectedCategory}
            className="border-gray-300 w-full sm:w-125 border px-4 py-3 rounded mb-4 outline-none"
          >
            <option value="">Select Category Type</option>

            {selectedCategory?.children?.map((child) => (
              <option key={child.id} value={child.id}>
                {child.name}
              </option>
            ))}
          </select> */}

          <select
            value={childId}
            onChange={(e) => setChildId(e.target.value)}
            disabled={!selectedCategory}
            className="border-gray-300 w-full sm:w-125 border p-4 rounded mb-4 outline-none"
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
            className="border-gray-300 w-full sm:w-125 border p-4 rounded mb-4 outline-none"
          >
            <option value="">Select Location</option>

            {selectedChild?.children?.map((grandChild) => (
              <option key={grandChild} value={grandChild}>
                {grandChild}
              </option>
            ))}
          </select>

          <p className="text-xl">Add Photo</p>
          <p className="text-gray-500 py-2">
            First picture - is the title picture. You can change the order of
            photos: just grab your photos and drag
          </p>
          <label htmlFor="image">
            <Image
              src={!image ? assets.upload_area : URL.createObjectURL(image)}
              width={140}
              height={70}
              alt=""
              className="mt-4"
            />
            <input
              onChange={(e) => setImage(e.target.files?.[0] || null)}
              type="file"
              id="image"
              hidden
              required
            />
          </label>

          <button
            onClick={onNext}
            type="button"
            className="mt-4 w-full h-12 bg-black text-white"
          >
            Next
          </button>
        </form>
      </div>
    </div>
  );
};

export default Form1;
