import React, { JSX } from 'react'
import Button from './Button';


type ChatRoomProps = {
  icon: JSX.Element
  setChatRoom?: () => void;
  onClose: () => void;
}

const ChatRoom = ({setChatRoom, icon, onClose}: ChatRoomProps) => {
  return (
    <div className="bg-[#ffc1051a] shadow-2xl w-90 min-h-130 absolute top-90 right-35 rounded-xl py-6">
      <div className="flex flex-1 items-center justify-between px-4">
        <h2> Chat Room</h2>
        <button
          onClick={onClose}
          className="bg-gray-600 text-xl rounded-full text-white"
        >
          {icon}
        </button>
      </div>
      <div className="flex flex-col gap-2  relative top-70 bottom-0 px-4">
          <p className='text-[8px] items-center justify-center text-center pb-2'>Today</p>
        <div className=''>
          <div className="mb-2 flex-1 flex-col-reverse items-end justify-end bg-amber-700 text-white font-bold w-fit p-2 rounded-full">
            <p className='text-[12px]'>First Chat Message</p>
          </div>
       
          <div className="flex flex-1 flex-col-reverse items-end justify-end  mb-2 bg-amber-300 w-fit p-2 rounded-full text-white">
            <p className='text-[12px]'>Second Chat Message</p>
          </div>
        </div>
      <div className='flex flex-1 gap-2'>
        <input type="text" placeholder='Message' className='border border-gray-300 p-2 rounded-full flex-1 outline-none text-black'/>
        <Button text='send' />
      </div>
      </div>
    </div>
  );
}

export default ChatRoom