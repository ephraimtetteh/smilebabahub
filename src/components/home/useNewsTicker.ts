// src/components/home/useNewsTicker.ts
//
// Fetches news ticker items from the backend, with safe fallbacks if
// the endpoint isn't reachable yet. Used by NewsTicker + NewsCards.
//
// Backend endpoint: GET /smilebaba/news/ticker?country=<X>
// Returns: { items: [{ slug, title, category, coverEmoji, coverBg, coverImage, publishedAt }] }

import { useEffect, useState } from "react";
import axiosInstance from "@/src/lib/api/axios";

export interface NewsTickerItem {
  slug: string;
  title: string;
  category: string;
  coverEmoji?: string;
  coverBg?: string;
  coverImage?: string | null;
  publishedAt: string;
}

export function useNewsTicker(country?: string) {
  const [items, setItems] = useState<NewsTickerItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    axiosInstance
      .get("/news/ticker", { params: country ? { country } : {} })
      .then(({ data }) => {
        if (!active) return;
        const fetched: NewsTickerItem[] = data.items ?? [];
        setItems(fetched);
      })
      .catch(() => {
        // Quietly degrade — empty list, page still renders
        if (active) setItems([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [country]);

  return { items, loading };
}
