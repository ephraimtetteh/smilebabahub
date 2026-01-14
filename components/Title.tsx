import React from "react";

interface TitleProps {
  title: string,
  subTitle?: string,
  align?: string,
  font?: string
  className?: string
}

const Title = ({ title, subTitle, align, font, className }: TitleProps) => {
  return (
    <div
      className={`flex flex-col items-center  ${
        align === "left" && "md:items-start md:text-left"
      }`}
    >
      <h1
        className={`${className}  text-xl text-[#25100d] md:text-[24px] ${
          font || "font-playfair"
        }`}
      >
        {title}
      </h1>
      <p className="text-sm md:text-base text-white/50 mt-2 max-w-174">
        {subTitle}
      </p>
    </div>
  );
};

export default Title;
