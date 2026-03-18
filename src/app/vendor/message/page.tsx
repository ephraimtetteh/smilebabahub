'use client'

import { assets } from '@/src/assets/assets';
import Button from '@/src/components/Button';
import ChatRoom from '@/src/components/ChatRoom'
import Image from 'next/image';
import { useState } from 'react';
import { IoChatboxEllipsesOutline, IoCloseOutline } from "react-icons/io5";

const MessagePage = () => {

  const [openChat, setOpenChat] = useState(true)
  const [messageRead, setMessageRead] = useState(false)
  return (
    <article className="flex flex-col gap-6 py-4 sm:py-6 px-4 sm:px-6 lg:px-8 border border-gray-200 rounded-xl">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl sm:text-3xl font-bold">Notifications</h1>

        <Button
          text="Mark All as Read"
          icon={<IoChatboxEllipsesOutline />}
          className="bg-transparent border border-[#ffc105] flex items-center gap-2 w-full sm:w-auto"
          onClick={() => setMessageRead((prev) => !prev)}
        />
      </div>

      {/* MAIN */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* NOTIFICATIONS */}
        <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto pr-2">
          <div
            className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded p-3 ${
              messageRead ? "bg-[#ffc10561]" : "bg-[#ffc105]"
            }`}
          >
            <div
              className="flex items-start gap-3 cursor-pointer"
              onClick={() => setMessageRead(!messageRead)}
            >
              <span
                className={`p-1.5 rounded-full ${
                  messageRead ? "bg-black/20" : "bg-black/50"
                }`}
              ></span>

              <Image
                src={assets.profile_icon}
                alt="profile"
                width={35}
                height={35}
                className="rounded-full"
              />

              <div className="text-sm">
                <h3 className="font-medium">
                  Example notification from customer
                </h3>
                <p className="text-xs text-gray-700">example@gmail.com</p>
              </div>
            </div>

            <div className="text-xs text-right">
              <p>12:20pm</p>
              <p>11-11-25</p>
            </div>
          </div>
        </div>

        {/* CHAT */}
        <div className="w-full">
          {!openChat ? (
            <Button
              text="Start a Chat"
              icon={<IoChatboxEllipsesOutline />}
              className="bg-transparent border border-[#ffc105] w-full flex items-center justify-center gap-2 py-3"
              onClick={() => setOpenChat(true)}
            />
          ) : (
            <ChatRoom
              icon={<IoCloseOutline />}
              onClose={() => setOpenChat(false)}
            />
          )}
        </div>
      </div>
    </article>
  );
}

export default MessagePage