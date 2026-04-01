"use client";
// src/components/Socials.tsx
// Share buttons for an ad listing page.
// Uses native <a> tags with target="_blank" — NOT Next.js <Link> —
// because these go to external social platforms, not internal routes.
// The previous version used /instagram, /facebook, /linkdin as paths
// which caused 404s (and /linkdin was a typo for /linkedin).

import React, { useState } from "react";
import {

  Link2,
  Check,
} from "lucide-react";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";

const SOCIALS = [
  {
    name: "Facebook",
    icon: <FaFacebook size={15} />,
    color: "hover:text-blue-600",
    getUrl: (page: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(page)}`,
  },
  {
    name: "Instagram",
    icon: <FaInstagram size={15} />,
    color: "hover:text-pink-500",
    // Instagram has no web share URL — open the profile instead
    getUrl: (_page: string) => `https://www.instagram.com/smilebabahub`,
  },
  {
    name: "LinkedIn", // ← was "Linkdin" (typo fixed)
    icon: <FaLinkedin size={15} />,
    color: "hover:text-blue-700",
    getUrl: (page: string) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(page)}`,
  },
  {
    name: "X / Twitter",
    icon: <FaTwitter size={15} />,
    color: "hover:text-sky-500",
    getUrl: (page: string) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(page)}&text=${encodeURIComponent("Check this out on SmileBaba Hub!")}`,
  },
];

export default function Socials() {
  const [copied, setCopied] = useState(false);

  const pageUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <span className="text-xs text-gray-400 font-medium">Share:</span>

      {SOCIALS.map((s) => (
        <a
          key={s.name}
          href={s.getUrl(pageUrl)}
          target="_blank"
          rel="noopener noreferrer"
          title={`Share on ${s.name}`}
          className={`text-gray-400 transition ${s.color}`}
        >
          {s.icon}
        </a>
      ))}

      {/* Copy link */}
      <button
        onClick={handleCopy}
        title="Copy link"
        className={`transition ${copied ? "text-green-500" : "text-gray-400 hover:text-gray-700"}`}
      >
        {copied ? <Check size={15} /> : <Link2 size={15} />}
      </button>
    </div>
  );
}
