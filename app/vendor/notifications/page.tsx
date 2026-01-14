'use client'

import { assets } from '@/assets/assets';
import Button from '@/components/Button';
import ChatRoom from '@/components/ChatRoom'
import Image from 'next/image';
import { useState } from 'react';
import { IoChatboxEllipsesOutline, IoCloseOutline } from "react-icons/io5";

const page = () => {

  const [openChat, setOpenChat] = useState(true)
  const [messageRead, setMessageRead] = useState(false)
  return (
    <article className="  gap-4 py-8 px-8 border-gray-200 border">
      <div className="flex items-center gap-8">
        <h1 className="text-3xl font-bold py-4">Notifications</h1>
        <Button
          text="Mark All as Aead"
          icon={<IoChatboxEllipsesOutline />}
          className="bg-transparent border border-[#ffc105] flex items-center gap-2"
          onClick={() => setMessageRead((prev) => !prev)}
        />
      </div>
      <div className="flex flex-row items-center justify-between w-[80%] gap-6">
        <div className={`flex flex-1 items-center justify-between gap-12  mb-3 rounded w-fit pr-3 ${messageRead ? 'bg-[#ffc10561]' : 'bg-[#ffc105]'}`}>
          <div className="flex items-center gap-8">
            <div
              className="flex flex-row items-center gap-2 p-2 cursor-pointer"
              onClick={() => setMessageRead(!messageRead)}
            >
              <span
                className={`p-1.5 items-center flex rounded-full ${ messageRead? 'bg-black/20' : 'bg-black/50'}`}
              ></span>
              <Image
                src={assets.profile_icon}
                alt="product-image"
                width={30}
                height={30}
                className="rounded-full"
              />
              <div className="flex flex-col py-1 gap-x-2 text-[12px]">
                <h3>
                  example smile you have a new Notifications form customer 112
                </h3>
                <p>example@gmail.com</p>
              </div>
            </div>
            <div>
              <h3>example@gmail.com</h3>
            </div>
          </div>
          <div className="text-[8px]">
            <p>12:20pm</p>
            <p>11-11-25</p>
          </div>
        </div>
        <div>
          {!openChat ? (
            <Button
              text="Start a Chat"
              icon={<IoChatboxEllipsesOutline />}
              className="bg-transparent border border-[#ffc105] w-full flex items-center gap-2 py-4"
              onClick={() => setOpenChat((prev) => !prev)}
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

export default page