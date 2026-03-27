"use client";

// src/components/ads/PostAdCTA.tsx
import { memo } from "react";
import Link from "next/link";

interface PostAdCTAProps {
  country?: string;
}

const PostAdCTA = memo(function PostAdCTA({ country }: PostAdCTAProps) {
  return (
    <div className="mt-12 bg-[#1a1a1a] rounded-3xl p-6 sm:p-8 text-center">
      <p className="text-2xl font-black text-white mb-2">
        Have something to sell?
      </p>
      <p className="text-gray-400 text-sm mb-5">
        Post your ad for free and reach thousands of buyers across{" "}
        {country ?? "Ghana & Nigeria"}.
      </p>
      <Link
        href="/sell"
        className="inline-block px-8 py-3 bg-yellow-400 text-black font-black
          rounded-2xl hover:bg-yellow-300 transition text-sm active:scale-95"
      >
        Post a free ad →
      </Link>
    </div>
  );
});

export default PostAdCTA;
