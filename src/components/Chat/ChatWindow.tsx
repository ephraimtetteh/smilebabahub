"use client";
// src/components/chat/ChatWindow.tsx
// Full chat UI — conversation list + message thread.
// Usage: <ChatWindow otherId="<userId>" otherName="John" />

import React, { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { useAppSelector } from "@/src/app/redux";
import { useChat, ChatMessage } from "@/src/hooks/useChat";
import {
  Send,
  X,
  MoreVertical,
  Pencil,
  Trash2,
  Trash,
  CheckCheck,
  Check,
  Circle,
  Loader2,
  ChevronDown,
} from "lucide-react";

// ── Helpers ──────────────────────────────────────────────────────────────────
function senderId(msg: ChatMessage): string {
  return typeof msg.sender === "string" ? msg.sender : msg.sender._id;
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDay(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diff = Math.floor((now.getTime() - d.getTime()) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  return d.toLocaleDateString([], {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

// ── Message bubble ────────────────────────────────────────────────────────────
function Bubble({
  msg,
  isMine,
  myId,
  onEdit,
  onDeleteForAll,
  onDeleteForMe,
}: {
  msg: ChatMessage;
  isMine: boolean;
  myId: string;
  onEdit: (id: string, text: string) => void;
  onDeleteForAll: (id: string) => void;
  onDeleteForMe: (id: string) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const isRead = msg.readBy.length > 1; // more than just sender

  return (
    <div
      className={`flex ${isMine ? "justify-end" : "justify-start"} mb-1 group`}
    >
      <div
        className={`relative max-w-[72%] ${isMine ? "items-end" : "items-start"} flex flex-col`}
      >
        {/* Bubble */}
        <div
          className={`px-3.5 py-2 rounded-2xl text-sm leading-relaxed
          ${
            msg.deleted
              ? "bg-gray-100 text-gray-400 italic"
              : isMine
                ? "bg-[#ffc105] text-black rounded-br-md"
                : "bg-white border border-gray-100 shadow-sm text-gray-900 rounded-bl-md"
          }`}
        >
          {msg.text}
          {msg.edited && !msg.deleted && (
            <span className="text-[10px] ml-1 opacity-60">edited</span>
          )}
        </div>

        {/* Meta row */}
        <div
          className={`flex items-center gap-1 mt-0.5 px-1
          ${isMine ? "flex-row-reverse" : "flex-row"}`}
        >
          <span className="text-[10px] text-gray-400">
            {formatTime(msg.createdAt)}
          </span>
          {isMine &&
            !msg.deleted &&
            (isRead ? (
              <CheckCheck size={12} className="text-blue-500" />
            ) : (
              <Check size={12} className="text-gray-400" />
            ))}
        </div>

        {/* Context menu */}
        {!msg.deleted && (
          <div
            className={`absolute top-0 ${isMine ? "right-full mr-1" : "left-full ml-1"}
            opacity-0 group-hover:opacity-100 transition-opacity`}
          >
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <MoreVertical size={14} className="text-gray-400" />
            </button>
            {menuOpen && (
              <div
                className={`absolute z-20 top-0 ${isMine ? "right-0" : "left-0"}
                bg-white border border-gray-100 shadow-xl rounded-2xl py-1.5 w-48
                text-sm overflow-hidden`}
                onMouseLeave={() => setMenuOpen(false)}
              >
                {isMine && (
                  <button
                    onClick={() => {
                      onEdit(msg._id, msg.text);
                      setMenuOpen(false);
                    }}
                    className="flex items-center gap-2.5 px-4 py-2 w-full
                      hover:bg-gray-50 text-gray-700"
                  >
                    <Pencil size={13} /> Edit message
                  </button>
                )}
                {isMine && (
                  <button
                    onClick={() => {
                      onDeleteForAll(msg._id);
                      setMenuOpen(false);
                    }}
                    className="flex items-center gap-2.5 px-4 py-2 w-full
                      hover:bg-red-50 text-red-500"
                  >
                    <Trash2 size={13} /> Delete for everyone
                  </button>
                )}
                <button
                  onClick={() => {
                    onDeleteForMe(msg._id);
                    setMenuOpen(false);
                  }}
                  className="flex items-center gap-2.5 px-4 py-2 w-full
                    hover:bg-gray-50 text-gray-500"
                >
                  <Trash size={13} /> Delete for me
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main ChatWindow ───────────────────────────────────────────────────────────
interface ChatWindowProps {
  otherId: string;
  otherName: string;
  otherAvatar?: string;
  onClose?: () => void;
}

export default function ChatWindow({
  otherId,
  otherName,
  otherAvatar,
  onClose,
}: ChatWindowProps) {
  const myId = useAppSelector((s) => s.auth.user?._id ?? s.auth.user?._id ?? "");
  const chat = useChat(myId || undefined);

  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [showScroll, setShowScroll] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Open the chat room on mount
  useEffect(() => {
    if (otherId && myId) {
      chat.openChat(otherId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otherId, myId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat.messages.length]);

  // Mark read when window gains focus
  useEffect(() => {
    chat.markRead();
  }, [chat.messages]);

  const isOnline = chat.onlineUsers.includes(otherId);
  const isTyping = chat.typingUsers.includes(otherId);

  // ── Send ───────────────────────────────────────────────────────────────────
  const handleSend = () => {
    if (!text.trim()) return;
    chat.sendMessage(text, otherId);
    setText("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ── Edit ───────────────────────────────────────────────────────────────────
  const startEdit = (id: string, currentText: string) => {
    setEditingId(id);
    setEditText(currentText);
    inputRef.current?.focus();
  };

  const submitEdit = () => {
    if (!editingId || !editText.trim()) return;
    chat.editMessage(editingId, editText);
    setEditingId(null);
    setEditText("");
  };

  // ── Scroll detection ───────────────────────────────────────────────────────
  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setShowScroll(distFromBottom > 200);
    // Load more when near top
    if (el.scrollTop < 80) chat.loadMore();
  };

  // ── Group messages by day ─────────────────────────────────────────────────
  const grouped: { day: string; msgs: ChatMessage[] }[] = [];
  chat.messages.forEach((msg) => {
    const day = formatDay(msg.createdAt);
    const last = grouped[grouped.length - 1];
    if (last?.day === day) {
      last.msgs.push(msg);
    } else {
      grouped.push({ day, msgs: [msg] });
    }
  });

  return (
    <div
      className="flex flex-col h-full bg-gray-50 rounded-2xl overflow-hidden
      border border-gray-100 shadow-lg"
    >
      {/* ── Header ── */}
      <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-100">
        <div className="relative flex-shrink-0">
          {otherAvatar ? (
            <div className="relative w-10 h-10 rounded-full overflow-hidden">
              <Image
                src={otherAvatar}
                alt={otherName}
                fill
                sizes="40px"
                className="object-cover"
              />
            </div>
          ) : (
            <div
              className="w-10 h-10 rounded-full bg-[#ffc105] flex items-center
                justify-center font-black text-black text-lg"
            >
              {otherName.charAt(0).toUpperCase()}
            </div>
          )}
          <span
            className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2
            border-white ${isOnline ? "bg-green-500" : "bg-gray-300"}`}
          />
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-900 text-sm truncate">
            {otherName}
          </p>
          <p className="text-[11px] text-gray-400">
            {isTyping ? (
              <span className="text-green-500 font-medium">typing…</span>
            ) : isOnline ? (
              "Online"
            ) : (
              "Offline"
            )}
          </p>
        </div>

        <div className="flex items-center gap-1">
          {chat.connected ? (
            <Circle size={8} className="text-green-500 fill-green-400" />
          ) : (
            <Circle size={8} className="text-gray-300 fill-gray-200" />
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="ml-1 w-8 h-8 rounded-full hover:bg-gray-100 flex items-center
                justify-center transition"
            >
              <X size={15} className="text-gray-500" />
            </button>
          )}
        </div>
      </div>

      {/* ── Messages ── */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-0 relative"
      >
        {chat.loading && (
          <div className="flex justify-center py-4">
            <Loader2 size={20} className="animate-spin text-gray-300" />
          </div>
        )}

        {chat.messages.length === 0 && !chat.loading && (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div
              className="w-16 h-16 bg-gray-100 rounded-full flex items-center
              justify-center mb-4"
            >
              <Send size={24} className="text-gray-300" />
            </div>
            <p className="text-gray-500 font-medium text-sm">No messages yet</p>
            <p className="text-xs text-gray-400 mt-1">
              Say hello to {otherName}!
            </p>
          </div>
        )}

        {grouped.map(({ day, msgs }) => (
          <div key={day}>
            {/* Day divider */}
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-[11px] text-gray-400 font-medium">
                {day}
              </span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            {msgs.map((msg) => (
              <Bubble
                key={msg._id}
                msg={msg}
                isMine={senderId(msg) === myId}
                myId={myId}
                onEdit={startEdit}
                onDeleteForAll={chat.deleteForEveryone}
                onDeleteForMe={chat.deleteForMe}
              />
            ))}
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start mb-2">
            <div
              className="bg-white border border-gray-100 rounded-2xl rounded-bl-md
              px-4 py-2.5 shadow-sm flex gap-1 items-center"
            >
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-1.5 h-1.5 bg-gray-400 rounded-full
                  animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />

        {/* Scroll to bottom button */}
        {showScroll && (
          <button
            onClick={() =>
              bottomRef.current?.scrollIntoView({ behavior: "smooth" })
            }
            className="absolute bottom-4 right-4 w-9 h-9 bg-white border border-gray-200
              rounded-full shadow-md flex items-center justify-center hover:bg-gray-50"
          >
            <ChevronDown size={16} className="text-gray-500" />
          </button>
        )}
      </div>

      {/* ── Edit banner ── */}
      {editingId && (
        <div
          className="flex items-center gap-2 px-4 py-2 bg-amber-50
          border-t border-amber-100 text-xs text-amber-700"
        >
          <Pencil size={12} />
          <span className="flex-1 truncate">Editing: {editText}</span>
          <button
            onClick={() => {
              setEditingId(null);
              setEditText("");
            }}
            className="text-amber-500 hover:text-amber-700"
          >
            <X size={13} />
          </button>
        </div>
      )}

      {/* ── Input ── */}
      <div className="px-4 py-3 bg-white border-t border-gray-100">
        <div
          className="flex items-center gap-2 bg-gray-50 border border-gray-200
          rounded-2xl px-3 py-2 focus-within:ring-2 focus-within:ring-yellow-400
          focus-within:border-transparent transition"
        >
          <input
            ref={inputRef}
            type="text"
            placeholder={`Message ${otherName}…`}
            value={editingId ? editText : text}
            onChange={(e) => {
              if (editingId) {
                setEditText(e.target.value);
              } else {
                setText(e.target.value);
                chat.startTyping(otherId);
              }
            }}
            onKeyDown={
              editingId
                ? (e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      submitEdit();
                    }
                    if (e.key === "Escape") {
                      setEditingId(null);
                      setEditText("");
                    }
                  }
                : handleKeyDown
            }
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
          />
          <button
            onClick={editingId ? submitEdit : handleSend}
            disabled={editingId ? !editText.trim() : !text.trim()}
            className="w-8 h-8 bg-[#ffc105] rounded-full flex items-center justify-center
              hover:bg-amber-400 transition disabled:opacity-40 flex-shrink-0"
          >
            <Send size={14} className="text-black" />
          </button>
        </div>
      </div>
    </div>
  );
}
