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
    <div className="flex flex-col items-center justify-center gap-3 w-full">
      <h1 className="font-bold text-xl sm:text-2xl">{title}</h1>

      <p className="text-sm text-gray-500">{description}</p>

      <div className="w-full flex gap-4 items-center overflow-x-auto pb-2 scrollbar-hide">
        {items.map((item, index) => {
          const value = type === "image" ? item.menu_name : item;

          return (
            <div
              key={index}
              onClick={() =>
                setCategory((prev) => (prev === value ? "All" : value))
              }
              className="cursor-pointer flex flex-col items-center shrink-0"
            >
              {type === "image" ? (
                <>
                  <Image
                    src={item.menu_image}
                    alt={item.menu_name}
                    width={70}
                    height={70}
                    className={`rounded-full transition border-2 ${
                      category === item.menu_name
                        ? "border-amber-950"
                        : "border-transparent"
                    }`}
                  />

                  <p className="text-xs sm:text-sm text-center mt-1">
                    {item.menu_name}
                  </p>
                </>
              ) : (
                <p
                  className={`text-sm border rounded-full py-2 px-5 capitalize whitespace-nowrap transition
                ${
                  category === item
                    ? "bg-black text-white"
                    : "border-gray-400 text-gray-700"
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
