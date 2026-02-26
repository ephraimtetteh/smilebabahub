import React from 'react'

interface ButtonProps {
  text: string;
  className: string;
  icon?: string
}

const Verified = ({text, className, icon}: ButtonProps) => {
  return (
    <div className=''>
      <button className={`${className} w-fit py-3 px-6 rounded text-center shadow-2xl items-center justify-center bg-[#fcce23]`}>{icon} {text}</button>
    </div>
  )
}

export default Verified