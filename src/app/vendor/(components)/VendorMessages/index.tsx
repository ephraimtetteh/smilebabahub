"use client";
// src/app/vendor/dashboard/(components)/VendorMessages.tsx
// Inline conversation list for the vendor dashboard.
// Shows recent buyer messages with unread badges.
// Clicking a conversation opens the full /chat page.

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/src/app/redux";
import { useChat, Conversation, ChatMessage } from "@/src/hooks/useChat";
import { MessageCircle, ChevronRight, CheckCheck, Check } from "lucide-react";

// ── Helpers ──────────────────────────────────────────────────────────────────
function timeAgo(iso: string): string {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return new Date(iso).toLocaleDateString([], {
    month: "short",
    day: "numeric",
  });
}

function preview(msg: ChatMessage, myId: string): string {
  if (msg.deleted) return "Message deleted";
  const sid = typeof msg.sender === "string" ? msg.sender : msg.sender._id;
  const isMine = sid === myId;
  const text = msg.text.slice(0, 45) + (msg.text.length > 45 ? "…" : "");
  return isMine ? `You: ${text}` : text;
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function VendorMessages() {
  const myId = useAppSelector(
    (s) => s.auth.user?._id ?? (s.auth.user as any)?.id ?? "",
  );
  const chat = useChat(myId || undefined);
  const router = useRouter();

  useEffect(() => {
    if (myId) chat.loadConversations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myId]);

  const getOther = (conv: Conversation) => {
    const msg = conv.lastMessage;
    const send = typeof msg.sender === "object" ? msg.sender : null;
    const recv = typeof msg.receiver === "object" ? msg.receiver : null;
    const sid = send?._id ?? (msg.sender as string);
    return sid === myId ? recv : send;
  };

  const handleOpen = (conv: Conversation) => {
    const other = getOther(conv);
    if (!other) return;
    router.push(
      `/chat?with=${other._id}&name=${encodeURIComponent(other.username ?? "User")}`,
    );
  };

  const totalUnread = chat.conversations.reduce((sum, c) => sum + c.unread, 0);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4
        border-b border-gray-100"
      >
        <div className="flex items-center gap-2">
          <MessageCircle size={18} className="text-[#ffc105]" />
          <h3 className="font-bold text-gray-900 text-sm">Messages</h3>
          {totalUnread > 0 && (
            <span
              className="bg-[#ffc105] text-black text-[10px] font-black
              px-1.5 py-0.5 rounded-full min-w-[18px] text-center"
            >
              {totalUnread > 99 ? "99+" : totalUnread}
            </span>
          )}
        </div>
        <Link
          href="/chat"
          className="text-xs text-[#ffc105] font-semibold hover:underline
            flex items-center gap-0.5"
        >
          View all <ChevronRight size={13} />
        </Link>
      </div>

      {/* Conversation rows */}
      {chat.conversations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center px-4">
          <MessageCircle size={32} className="text-gray-200 mb-2" />
          <p className="text-sm text-gray-500 font-medium">No messages yet</p>
          <p className="text-xs text-gray-400 mt-1">
            When buyers contact you about your ads, messages appear here
          </p>
        </div>
      ) : (
        <div className="divide-y divide-gray-50">
          {chat.conversations.slice(0, 6).map((conv) => {
            const other = getOther(conv);
            const isOnline = chat.onlineUsers.includes(other?._id ?? "");
            const isMine = (() => {
              const sid =
                typeof conv.lastMessage.sender === "string"
                  ? conv.lastMessage.sender
                  : conv.lastMessage.sender._id;
              return sid === myId;
            })();
            const isRead = conv.lastMessage.readBy.length > 1;

            return (
              <button
                key={conv._id}
                onClick={() => handleOpen(conv)}
                className="w-full flex items-center gap-3 px-5 py-3.5
                  hover:bg-gray-50 transition text-left"
              >
                {/* Avatar + online dot */}
                <div className="relative flex-shrink-0">
                  {other?.profilePicture ? (
                    <img
                      src={other.profilePicture}
                      alt={other.username}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div
                      className="w-10 h-10 rounded-full bg-gray-100 flex items-center
                      justify-center font-bold text-gray-600"
                    >
                      {other?.username?.charAt(0).toUpperCase() ?? "?"}
                    </div>
                  )}
                  {isOnline && (
                    <span
                      className="absolute bottom-0 right-0 w-2.5 h-2.5
                      bg-green-500 rounded-full border-2 border-white"
                    />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p
                      className={`text-sm truncate
                      ${conv.unread > 0 ? "font-bold text-gray-900" : "font-medium text-gray-700"}`}
                    >
                      {other?.username ?? "User"}
                    </p>
                    <span className="text-[11px] text-gray-400 flex-shrink-0 ml-2">
                      {timeAgo(conv.lastMessage.createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <p
                      className={`text-xs truncate
                      ${conv.unread > 0 ? "text-gray-700 font-medium" : "text-gray-400"}`}
                    >
                      {preview(conv.lastMessage, myId)}
                    </p>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {/* Read receipt for own messages */}
                      {isMine &&
                        (isRead ? (
                          <CheckCheck size={12} className="text-blue-400" />
                        ) : (
                          <Check size={12} className="text-gray-300" />
                        ))}
                      {/* Unread badge for incoming */}
                      {conv.unread > 0 && (
                        <span
                          className="w-5 h-5 bg-[#ffc105] text-black text-[10px]
                          font-black rounded-full flex items-center justify-center"
                        >
                          {conv.unread > 9 ? "9+" : conv.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <ChevronRight
                  size={14}
                  className="text-gray-300 flex-shrink-0"
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Footer CTA */}
      {chat.conversations.length > 6 && (
        <div className="px-5 py-3 border-t border-gray-50">
          <Link
            href="/chat"
            className="text-xs text-gray-400 hover:text-[#ffc105] transition font-medium"
          >
            +{chat.conversations.length - 6} more conversations →
          </Link>
        </div>
      )}
    </div>
  );
}
