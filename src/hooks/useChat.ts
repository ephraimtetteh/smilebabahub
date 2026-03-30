// src/hooks/useChat.ts
// Custom hook — wraps socket.io-client for the chat feature.
// Usage: const chat = useChat(myUserId)

"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import axiosInstance from "@/src/lib/api/axios";

export type ChatMessage = {
  _id: string;
  room: string;
  sender: { _id: string; username: string; profilePicture?: string } | string;
  receiver: { _id: string; username: string; profilePicture?: string } | string;
  text: string;
  edited: boolean;
  deleted: boolean;
  readBy: string[];
  createdAt: string;
};

export type Conversation = {
  _id: string;
  lastMessage: ChatMessage;
  unread: number;
};

// ── Socket URL ────────────────────────────────────────────────────────────
// next.config.ts derives this from NEXT_PUBLIC_API_BASE_URL at build time
// (strips /smilebaba → just the origin). Falls back to localhost for dev.
const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL ?? "http://localhost:3001";

export function useChat(myUserId: string | undefined) {
  const socketRef = useRef<Socket | null>(null);

  const [connected, setConnected] = useState(false);
  const [room, setRoom] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  // ── Connect / disconnect ───────────────────────────────────────────────────
  useEffect(() => {
    if (!myUserId) return;

    const socket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      setConnected(true);
      socket.emit("register_user", myUserId);
    });

    socket.on("disconnect", () => setConnected(false));

    socket.on("online_users", (users: string[]) => setOnlineUsers(users));

    socket.on("receive_message", (msg: ChatMessage) => {
      setMessages((prev) => {
        // Avoid duplicates
        if (prev.some((m) => m._id === msg._id)) return prev;
        return [...prev, msg];
      });
      // Mark as read immediately if the chat is open
      if (room === msg.room) {
        socket.emit("mark_read", { room: msg.room, userId: myUserId });
      }
    });

    socket.on(
      "message_edited",
      ({ _id, text }: { _id: string; text: string }) => {
        setMessages((prev) =>
          prev.map((m) => (m._id === _id ? { ...m, text, edited: true } : m)),
        );
      },
    );

    socket.on("message_deleted", ({ _id }: { _id: string }) => {
      setMessages((prev) =>
        prev.map((m) =>
          m._id === _id
            ? { ...m, deleted: true, text: "This message was deleted" }
            : m,
        ),
      );
    });

    socket.on(
      "message_deleted_for_me",
      ({ messageId }: { messageId: string }) => {
        setMessages((prev) => prev.filter((m) => m._id !== messageId));
      },
    );

    socket.on(
      "messages_read",
      ({ room: r, userId }: { room: string; userId: string }) => {
        if (r !== room) return;
        setMessages((prev) =>
          prev.map((m) => ({
            ...m,
            readBy: m.readBy.includes(userId)
              ? m.readBy
              : [...m.readBy, userId],
          })),
        );
      },
    );

    socket.on("user_typing", ({ userId }: { userId: string }) =>
      setTypingUsers((prev) => [...new Set([...prev, userId])]),
    );
    socket.on("user_stop_typing", ({ userId }: { userId: string }) =>
      setTypingUsers((prev) => prev.filter((id) => id !== userId)),
    );

    socket.on("room_joined", ({ room: r }: { room: string }) => setRoom(r));

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myUserId]);

  // ── Open a chat with another user ──────────────────────────────────────────
  const openChat = useCallback(
    async (otherId: string) => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(`/chat/room/${otherId}`);
        const { room: r, messages: msgs } = res.data;
        setRoom(r);
        setMessages(msgs);
        setHasMore(msgs.length >= 50);
        socketRef.current?.emit("join_room", { myId: myUserId, otherId });
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    },
    [myUserId],
  );

  // ── Load older messages ────────────────────────────────────────────────────
  const loadMore = useCallback(async () => {
    if (!room || !messages.length || !hasMore) return;
    const oldest = messages[0].createdAt;
    try {
      const res = await axiosInstance.get(
        `/chat/messages/${room}?before=${oldest}&limit=30`,
      );
      const { messages: older, hasMore: more } = res.data;
      setMessages((prev) => [...older, ...prev]);
      setHasMore(more);
    } catch {}
  }, [room, messages, hasMore]);

  // ── Load conversations list ────────────────────────────────────────────────
  const loadConversations = useCallback(async () => {
    try {
      const res = await axiosInstance.get("/chat/conversations");
      setConversations(res.data.conversations ?? []);
    } catch {}
  }, []);

  // ── Send message ──────────────────────────────────────────────────────────
  const sendMessage = useCallback(
    (text: string, receiver: string) => {
      if (!room || !text.trim() || !socketRef.current) return;
      socketRef.current.emit("send_message", {
        room,
        sender: myUserId,
        receiver,
        text: text.trim(),
      });
      stopTyping(receiver);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [room, myUserId],
  );

  // ── Edit / delete ─────────────────────────────────────────────────────────
  const editMessage = useCallback(
    (messageId: string, newText: string) => {
      socketRef.current?.emit("edit_message", {
        messageId,
        newText,
        sender: myUserId,
      });
    },
    [myUserId],
  );

  const deleteForEveryone = useCallback(
    (messageId: string) => {
      socketRef.current?.emit("delete_message", {
        messageId,
        sender: myUserId,
      });
    },
    [myUserId],
  );

  const deleteForMe = useCallback(
    (messageId: string) => {
      socketRef.current?.emit("delete_for_me", { messageId, userId: myUserId });
    },
    [myUserId],
  );

  const deleteChat = useCallback(() => {
    if (!room) return;
    socketRef.current?.emit("delete_chat", { room, userId: myUserId });
    setMessages([]);
  }, [room, myUserId]);

  // ── Typing indicators ─────────────────────────────────────────────────────
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startTyping = useCallback(
    (receiver: string) => {
      if (!room) return;
      socketRef.current?.emit("typing", { room, userId: myUserId });
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      typingTimerRef.current = setTimeout(() => stopTyping(receiver), 3000);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [room, myUserId],
  );

  const stopTyping = useCallback(
    (_receiver?: string) => {
      if (!room) return;
      socketRef.current?.emit("stop_typing", { room, userId: myUserId });
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    },
    [room, myUserId],
  );

  // ── Mark messages as read ─────────────────────────────────────────────────
  const markRead = useCallback(() => {
    if (!room || !myUserId) return;
    socketRef.current?.emit("mark_read", { room, userId: myUserId });
  }, [room, myUserId]);

  return {
    connected,
    room,
    messages,
    conversations,
    onlineUsers,
    typingUsers,
    loading,
    hasMore,
    openChat,
    loadMore,
    loadConversations,
    sendMessage,
    editMessage,
    deleteForEveryone,
    deleteForMe,
    deleteChat,
    startTyping,
    stopTyping,
    markRead,
  };
}
