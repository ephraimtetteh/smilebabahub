"use client";
// src/components/chat/ConversationList.tsx
// Sidebar showing all conversations — used in chat page or as a panel.

import React, { useEffect } from "react";
import { useAppSelector } from "@/src/app/redux";
import { useChat, Conversation, ChatMessage } from "@/src/hooks/useChat";
import { MessageCircle, Circle } from "lucide-react";

function formatPreview(msg: ChatMessage, myId: string): string {
  if (msg.deleted) return "Message deleted";
  const isMine =
    (typeof msg.sender === "string" ? msg.sender : msg.sender._id) === myId;
  return `${isMine ? "You: " : ""}${msg.text.slice(0, 50)}${msg.text.length > 50 ? "…" : ""}`;
}

function timeAgo(iso: string): string {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
}

interface ConversationListProps {
  onSelect: (otherId: string, otherName: string, otherAvatar?: string) => void;
  selectedRoom?: string | null;
}

export default function ConversationList({
  onSelect,
  selectedRoom,
}: ConversationListProps) {
  const myId = useAppSelector((s) => s.auth.user?._id ?? "");
  const chat = useChat(myId || undefined);

  useEffect(() => {
    if (myId) chat.loadConversations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myId]);

  const getOther = (msg: ChatMessage, myId: string) => {
    const sendObj = typeof msg.sender === "object" ? msg.sender : null;
    const recvObj = typeof msg.receiver === "object" ? msg.receiver : null;
    const sendId = sendObj?._id ?? (msg.sender as string);
    return sendId === myId ? recvObj : sendObj;
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="px-4 py-4 border-b border-gray-100">
        <h2 className="text-lg font-black text-gray-900">Messages</h2>
      </div>

      {chat.conversations.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 py-12 text-center px-4">
          <MessageCircle size={40} className="text-gray-200 mb-3" />
          <p className="text-sm text-gray-500 font-medium">
            No conversations yet
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Start a chat from any seller&apos;s listing page
          </p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
          {chat.conversations.map((conv: Conversation) => {
            const other = getOther(conv.lastMessage, myId);
            const isOnline = chat.onlineUsers.includes(other?._id ?? "");
            const isActive = selectedRoom === conv._id;

            return (
              <button
                key={conv._id}
                onClick={() =>
                  onSelect(
                    other?._id ?? "",
                    other?.username ?? "User",
                    other?.profilePicture,
                  )
                }
                className={`w-full flex items-center gap-3 px-4 py-3.5 text-left
                  transition hover:bg-gray-50 active:bg-gray-100
                  ${isActive ? "bg-amber-50 hover:bg-amber-50" : ""}`}
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  {other?.profilePicture ? (
                    <img
                      src={other.profilePicture}
                      alt={other.username}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div
                      className="w-12 h-12 rounded-full bg-[#ffc105] flex items-center
                        justify-center font-black text-black text-xl"
                    >
                      {other?.username?.charAt(0).toUpperCase() ?? "?"}
                    </div>
                  )}
                  {isOnline && (
                    <span
                      className="absolute bottom-0 right-0 w-3 h-3 bg-green-500
                      rounded-full border-2 border-white"
                    />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p
                      className={`text-sm truncate
                      ${conv.unread > 0 ? "font-bold text-gray-900" : "font-medium text-gray-800"}`}
                    >
                      {other?.username ?? "User"}
                    </p>
                    <span className="text-[11px] text-gray-400 flex-shrink-0 ml-2">
                      {timeAgo(conv.lastMessage.createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p
                      className={`text-xs truncate
                      ${conv.unread > 0 ? "text-gray-700 font-medium" : "text-gray-400"}`}
                    >
                      {formatPreview(conv.lastMessage, myId)}
                    </p>
                    {conv.unread > 0 && (
                      <span
                        className="ml-2 flex-shrink-0 w-5 h-5 bg-[#ffc105] text-black
                        text-[10px] font-black rounded-full flex items-center justify-center"
                      >
                        {conv.unread > 9 ? "9+" : conv.unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
