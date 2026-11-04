"use client";
// src/components/support/SupportWhatsAppButton.tsx
//
// Round green WhatsApp button fixed on the right of every page — opens a
// chat with SmileBaba support (+233 26 978 3374). Sits above the sticky
// radio bar, and is hidden in the admin panel and on the chat page.

import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { supportWhatsAppUrl, SUPPORT_PHONE_DISPLAY } from "@/src/constants/support";

const HIDE_ON = [/^\/admin/, /^\/chat/, /^\/checkout/, /^\/marketer\/dashboard/];

export default function SupportWhatsAppButton() {
  const pathname = usePathname() || "/";
  if (HIDE_ON.some((re) => re.test(pathname))) return null;

  return (
    <a
      href={supportWhatsAppUrl()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Chat with SmileBaba support on WhatsApp (${SUPPORT_PHONE_DISPLAY})`}
      title={`WhatsApp support · ${SUPPORT_PHONE_DISPLAY}`}
      className="group fixed right-4 z-[90] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 transition hover:scale-105 hover:bg-[#1ebe5a] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#25D366]/40 sm:right-6"
      style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 96px)" }}
    >
      <MessageCircle size={27} strokeWidth={2.2} />
      <span className="pointer-events-none absolute right-16 hidden whitespace-nowrap rounded-full bg-gray-900 px-3 py-1.5 text-xs font-semibold text-white opacity-0 shadow transition group-hover:opacity-100 sm:block">
        Chat with support
      </span>
    </a>
  );
}
