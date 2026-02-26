import { InputProps } from '@/src/types/types';
import React from 'react'

const InputCompontent = ({type, placeholder, value, className, name, id, onChange}: InputProps) => {
  return (
    <div className='w-full'>
      <input
        id={id}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`${className} border border-gray-400 p-2 rounded w-full`}
      />
    </div>
  );
}

export default InputCompontent