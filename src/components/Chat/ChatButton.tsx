"use client";
// src/components/chat/ChatButton.tsx
// Drop this on any seller's ad detail page.
// Clicking opens the /chat page with ?with=<sellerId>&name=<sellerName>

import React from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/src/app/redux";
import { MessageCircle } from "lucide-react";
import { toast } from "react-toastify";

interface ChatButtonProps {
  sellerId: string;
  sellerName: string;
  className?: string;
  label?: string;
}

export default function ChatButton({
  sellerId,
  sellerName,
  className,
  label = "Start a Chat",
}: ChatButtonProps) {
  const user = useAppSelector((s) => s.auth.user);
  const router = useRouter();

  const handleClick = () => {
    if (!user) {
      toast.error("Please log in to start a chat");
      router.push("/auth/login");
      return;
    }
    if (user._id === sellerId || (user as any).id === sellerId) {
      toast.info("You cannot chat with yourself");
      return;
    }
    router.push(
      `/chat?with=${sellerId}&name=${encodeURIComponent(sellerName)}`,
    );
  };

  return (
    <button
      onClick={handleClick}
      className={
        className ??
        `w-full flex items-center justify-center gap-2 py-3
        border-2 border-gray-200 text-gray-700 font-bold rounded-2xl text-sm
        hover:border-[#ffc105] hover:text-[#ffc105] transition`
      }
    >
      <MessageCircle size={15} />
      {label}
    </button>
  );
}
