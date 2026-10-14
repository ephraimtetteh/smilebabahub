import React from "react";

interface TitleProps {
  title: string,
  subTitle?: string,
  align?: string,
  font?: string
  className?: string
}

const Title = ({ title, subTitle, className }: TitleProps) => {
  return (
    <div
      className={`flex flex-col items-start text-left`}
    >
      <h1
        className={`${className}  text-xl text-[#25100d] md:text-[24px]`}
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
