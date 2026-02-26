import React from 'react'
import {
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
} from "react-icons/md"

const Limit = () => {
  return (
    <div className="flex flex-row flex-1 items-center justify-between">
      <div>showing 1 to 6 fo 20 entries</div>
      <div className="flex gap-2 items-center">
        <div className="flex gap-2 items-center">
          <div>{<MdKeyboardArrowLeft />}</div>

          <p className="text-[16px] capitalize">prev</p>
          <p className="bg-[#ffc105] text-white px-3 rounded w-fit">1</p>
        </div>
        <div className="flex items-center gap-2">
          <div>{<MdKeyboardArrowLeft />}</div>
          <div>{<MdKeyboardArrowRight />}</div>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-[16px] capitalize">next</p>
          <div>{<MdKeyboardArrowRight />}</div>
        </div>
      </div>
    </div>
  );
}

export default Limit