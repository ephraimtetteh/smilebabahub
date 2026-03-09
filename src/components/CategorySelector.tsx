"use client";

import Image from "next/image";

interface CategorySelectorProps {
  title: string;
  description: string;
  items: any[];
  category: string;
  setCategory: (value: string | ((prev: string) => string)) => void;
  type?: "image" | "text";
}

const CategorySelector = ({
  title,
  description,
  items,
  category,
  setCategory,
  type = "text",
}: CategorySelectorProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <h1 className="font-bold text-2xl">{title}</h1>

      <p className="text-[12px] text-gray-500">{description}</p>

      <div className="flex gap-4 items-center overflow-x-scroll">
        {items.map((item, index) => {
          const value = type === "image" ? item.menu_name : item;

          return (
            <div
              key={index}
              onClick={() =>
                setCategory((prev) => (prev === value ? "All" : value))
              }
              className="cursor-pointer flex flex-col items-center"
            >
              {type === "image" ? (
                <>
                  <Image
                    src={item.menu_image}
                    alt={item.menu_name}
                    width={70}
                    height={70}
                    className={`rounded-full ${
                      category === item.menu_name
                        ? "border-2 border-amber-950"
                        : ""
                    }`}
                  />

                  <p className="text-[12px] text-center">{item.menu_name}</p>
                </>
              ) : (
                <p
                  className={`text-[14px] border rounded-full py-2 px-6 capitalize
                  ${
                    category === item
                      ? "bg-black text-white"
                      : "border-gray-400"
                  }`}
                >
                  {item}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategorySelector;
