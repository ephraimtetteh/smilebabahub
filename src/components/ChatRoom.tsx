import React, { JSX } from 'react'
import Button from './Button';


type ChatRoomProps = {
  icon: JSX.Element
  setChatRoom?: () => void;
  onClose: () => void;
}

const ChatRoom = ({setChatRoom, icon, onClose}: ChatRoomProps) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      {/* CHAT CONTAINER */}
      <div className="w-full max-w-md h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* HEADER */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h2 className="font-semibold text-black">SmileBaba Chat Room</h2>
          <button onClick={onClose} className="text-xl text-gray-600">
            {icon}
          </button>
        </div>

        {/* MESSAGES (SCROLLABLE) */}
        <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-2 bg-gray-50">
          <p className="text-center text-xs text-gray-500">Today</p>

          {/* SENT */}
          <div className="flex justify-end">
            <div className="bg-amber-500 text-white text-sm px-3 py-2 rounded-2xl max-w-[70%]">
              First Chat Message
            </div>
          </div>

          {/* RECEIVED */}
          <div className="flex justify-start">
            <div className="bg-gray-300 text-black text-sm px-3 py-2 rounded-2xl max-w-[70%]">
              Second Chat Message
            </div>
          </div>
        </div>

        {/* INPUT */}
        <div className="p-3 border-t flex gap-2">
          <input
            type="text"
            placeholder="Message..."
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 outline-none text-black"
          />
          <Button text="Send" />
        </div>
      </div>
    </div>
  );
}

export default ChatRoom