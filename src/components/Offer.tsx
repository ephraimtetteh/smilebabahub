import React from 'react'
import { IoCloseOutline } from "react-icons/io5";

const offers = [
  '1000', '2000', '3000', '4000', '5500'
]

type OfferProps = {
  onClose: () => void
}

const Offer = ({ onClose }: OfferProps) => {
  return (
    <div className="w-80 bg-black/10 items-center justify-center mx-auto flex flex-col p-4">
      <div className="flex flex-1 items-center gap-12 justify-between px-4">
        <h2>Select / Type your offer</h2>
        <button
          onClick={onClose}
          className="bg-gray-600 text-xl rounded-full text-white"
        >
          <IoCloseOutline />
        </button>
      </div>
      <div className="flex flex-row flex-1 my-4">
        {offers.map((offer) => (
          <div key={offer} className="flex flex-row flex-1 gap-4">
            <span className="mx-1 px-2 text-[12px] border rounded-full hover:bg-amber-100 hover:border-none cursor-pointer">
              {offer}
            </span>
          </div>
        ))}
      </div>
      <input
        type="text"
        placeholder="Enter your offer"
        className="w-full flex-1 border border-gray-400 p-2 rounded-full"
      />
    </div>
  );
};

export default Offer