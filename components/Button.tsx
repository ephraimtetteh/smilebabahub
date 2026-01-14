import React, { JSX } from 'react'

interface ButtonProps {
  text: string;
  className?: string;
  onClick?: () => void;
  icon?: JSX.Element
}

const Button = ({text, className, onClick, icon}: ButtonProps) => {
  return (
    <div>
      <button
        className={` w-fit py-2 px-6 shadow shadow-neutral-100 rounded text-center items-center justify-center bg-[#fcce23] ${className}`}
        onClick={onClick}
      >
        {icon} {text}
      </button>
    </div>
  );
}

export default Button