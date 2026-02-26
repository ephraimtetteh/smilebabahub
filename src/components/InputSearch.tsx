import React, { JSX } from 'react'

interface SearchInputProps {
  text?: string,
  icon?: JSX.Element
  className?: string
}

const InputSearch = ({ text, icon, className}: SearchInputProps) => {
  return (
    <div>
      <input
        type="search"
        placeholder={`${text}`}
        className={`${className} w-fit py-2 px-6 rounded items-center outline-[#ffc105] bg-transparent border-gray-200 border shadow shadow-neutral-100`}
      />
    </div>
  );
}

export default InputSearch



