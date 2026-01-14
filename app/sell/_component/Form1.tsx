"use client";

import { assets, Products } from "@/assets/assets";
import Image from "next/image";
import React, { useState } from "react";
import { useRouter } from "next/router";


type FormProps = {
  onNext: () => void;
};

const Form1 = ({ onNext }: FormProps) => {
  const [image, setImage] = useState<File | null >(null);
  const [data, setData] = useState({
    title: "",
    category: {},
  });


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
            className="border-gray-300 border px-4 py-3 w-full sm:w-[500px] rounded placeholder:text-[20px] mb-4 outline-none"
          />
          <select
            name="Category"
            required
            className="border-gray-300 w-full sm:w-[500px] border p-4 rounded placeholder:text-[20px] mb-4 outline-none"
          >
            {Products.map((item) => (
              <div key={item.id}>
                <option value="">{item.category}</option>
              </div>
            ))}
          </select>

          <select
            name="Select Location"
            required
            className="border-gray-300 w-full sm:w-[500px] border px-4 py-3 rounded placeholder:text-[20px] mb-4 outline-none"
          >
            {Products.map((item) => (
              <div key={item.id}>
                <option value="" className="px-4">
                  {item.category}
                </option>
              </div>
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
