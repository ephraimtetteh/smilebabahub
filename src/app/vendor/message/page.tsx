"use client";
// src/app/chat/page.tsx
// Full-page chat — left sidebar (conversations) + right panel (active chat).
// On mobile: shows one panel at a time.

import React, { useState } from "react";
import { useAppSelector } from "@/src/app/redux";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { MessageCircle } from "lucide-react";
import ProtectedRoute from "@/src/components/ProtectRoute";
import ConversationList from "@/src/components/Chat/ChatConversation";
import ChatWindow from "@/src/components/Chat/ChatWindow";

export default function ChatPage() {
  const user = useAppSelector((s) => s.auth.user);
  const router = useRouter();

  const [selected, setSelected] = useState<{
    otherId: string;
    otherName: string;
    otherAvatar?: string;
  } | null>(null);

  // Read ?with= query param so ProductDetails can deep-link to a chat
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const withId = params.get("with");
    const withName = params.get("name") ?? "User";
    if (withId) setSelected({ otherId: withId, otherName: withName });
  }, []);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 pt-20">
        <div
          className="max-w-6xl mx-auto h-[calc(100vh-80px)] flex overflow-hidden
          rounded-2xl border border-gray-100 shadow-sm"
        >
          {/* ── Conversation sidebar ── */}
          <aside
            className={`w-full sm:w-80 flex-shrink-0 border-r border-gray-100
            bg-white overflow-hidden flex flex-col
            ${selected ? "hidden sm:flex" : "flex"}`}
          >
            <ConversationList
              selectedRoom={selected?.otherId}
              onSelect={(id, name, avatar) =>
                setSelected({
                  otherId: id,
                  otherName: name,
                  otherAvatar: avatar,
                })
              }
            />
          </aside>

          {/* ── Chat panel ── */}
          <main
            className={`flex-1 flex flex-col overflow-hidden
            ${selected ? "flex" : "hidden sm:flex"}`}
          >
            {selected ? (
              <ChatWindow
                key={selected.otherId}
                otherId={selected.otherId}
                otherName={selected.otherName}
                otherAvatar={selected.otherAvatar}
                onClose={() => setSelected(null)}
              />
            ) : (
              <div
                className="flex-1 flex flex-col items-center justify-center
                text-center p-8 bg-gray-50"
              >
                <div
                  className="w-20 h-20 bg-white rounded-full shadow-sm
                  flex items-center justify-center mb-4"
                >
                  <MessageCircle size={36} className="text-[#ffc105]" />
                </div>
                <h3 className="text-xl font-black text-gray-800 mb-2">
                  Your messages
                </h3>
                <p className="text-sm text-gray-500 max-w-xs">
                  Select a conversation from the sidebar, or start one from any
                  seller&apos;s listing page.
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
