import React, { JSX } from 'react'

interface ButtonProps {
  text: string;
  className?: string;
  onClick?: () => void;
  icon?: JSX.Element,
  type? : string
}

const Button = ({text, className, onClick, icon, type}: ButtonProps) => {
  return (
    <div>
      <button
        className={` w-fit py-2 px-6 rounded text-center items-center justify-center  bg-[#fcce23] ${className}`}
        onClick={onClick}
      >
        {icon} {text}
      </button>
    </div>
  );
}

export default Button