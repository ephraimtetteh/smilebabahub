// frontend/app/promote/[id]/page.tsx
//
// Public detail page for a live/expired promotion. Auto-plays the video,
// shows business info, links to related content.

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ChevronLeft,
  Eye,
  Radio,
  Tv2,
  Share2,
  Sparkles,
  Loader2,
  AlertCircle,
} from "lucide-react";
import axiosInstance from "@/src/lib/api/axios";



interface PromotionDetail {
  _id: string;
  businessName: string;
  title?: string;
  description?: string;
  category?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  tier: string;
  channels: string[];
  liveAt?: string;
  expiresAt?: string;
  status: string;
  views: number;
  country: string;
}

export default function PromotionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [promo, setPromo] = useState<PromotionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axiosInstance
      .get(`/promote/${id}`)
      .then((r) => setPromo(r.data.promotion))
      .catch((e) => setError(e?.response?.data?.message ?? "Not found"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <Loader2 size={28} className="animate-spin text-yellow-500" />
      </main>
    );
  }

  if (error || !promo) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <AlertCircle size={40} className="mx-auto text-gray-400" />
          <div className="mt-3 font-black text-gray-900">
            {error ?? "Promotion not found"}
          </div>
          <Link
            href="/promote"
            className="mt-4 inline-block text-xs font-black text-yellow-700 hover:underline"
          >
            ← Browse other promotions
          </Link>
        </div>
      </main>
    );
  }

  const isLive = promo.status === "live";

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-8">
        <Link
          href="/promote"
          className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900 mb-4 font-medium"
        >
          <ChevronLeft size={14} /> All promotions
        </Link>

        {/* Video */}
        <div className="bg-black rounded-3xl overflow-hidden shadow-2xl">
          <video
            src={promo.videoUrl}
            poster={promo.thumbnailUrl}
            controls
            autoPlay
            className="w-full aspect-video"
          />
        </div>

        {/* Meta */}
        <div className="mt-6 flex items-start justify-between flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {isLive && (
                <span className="inline-flex items-center gap-1 bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />{" "}
                  LIVE NOW
                </span>
              )}
              {promo.category && (
                <span className="bg-gray-100 text-gray-700 text-[10px] font-black px-2 py-0.5 rounded">
                  {promo.category}
                </span>
              )}
              <span className="text-[10px] text-gray-500 flex items-center gap-1">
                <Eye size={11} /> {promo.views.toLocaleString()} views
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
              {promo.businessName}
            </h1>
            {promo.title && (
              <p className="mt-1 text-lg font-bold text-yellow-700">
                {promo.title}
              </p>
            )}
            {promo.description && (
              <p className="mt-3 text-sm text-gray-600 leading-relaxed max-w-2xl">
                {promo.description}
              </p>
            )}
          </div>
        </div>

        {/* Channels */}
        <div className="mt-6 bg-white rounded-2xl border border-gray-100 p-5">
          <div className="text-xs font-black tracking-wider text-gray-500 mb-3">
            AIRING ON
          </div>
          <div className="flex flex-wrap gap-2">
            {promo.channels.map((c) => {
              const cfg: Record<
                string,
                { icon: React.ReactNode; label: string }
              > = {
                tv: { icon: <Tv2 size={12} />, label: "Smile Time TV" },
                radio: { icon: <Radio size={12} />, label: "Smile Radio" },
                social: { icon: <Share2 size={12} />, label: "Social Media" },
                web: { icon: <Sparkles size={12} />, label: "SmileBaba Hub" },
              };
              const item = cfg[c] ?? { icon: null, label: c };
              return (
                <span
                  key={c}
                  className="inline-flex items-center gap-1.5 bg-yellow-50 border border-yellow-200 text-yellow-800 text-xs font-black px-3 py-1.5 rounded-full"
                >
                  {item.icon} {item.label}
                </span>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-6 text-center">
          <p className="text-xs font-black text-black/70 tracking-wider">
            WANT TO PROMOTE TOO?
          </p>
          <h2 className="mt-1 text-xl font-black text-black">
            Get your business seen.
          </h2>
          <Link
            href="/promote"
            className="mt-4 inline-flex items-center gap-2 bg-black text-yellow-400 font-black px-5 py-2.5 rounded-xl text-sm hover:bg-gray-800"
          >
            <Sparkles size={14} /> See plans
          </Link>
        </div>
      </div>
    </main>
  );
}
