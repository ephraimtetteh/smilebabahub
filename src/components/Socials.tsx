import React from 'react'
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa6";

const Socials = () => {
  return (
    <div className='flex items-center gap-2 border-t border-gray-200 py-4'>
      <FaFacebookF />
      <FaInstagram />
      <FaTwitter />
    </div>
  )
}

export default Socials