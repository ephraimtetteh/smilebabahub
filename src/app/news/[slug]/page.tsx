"use client";

// src/app/news/[slug]/page.tsx — single article detail page

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft,
  Clock,
  User as UserIcon,
  Eye,
  Loader2,
} from "lucide-react";
import axiosInstance from "@/src/lib/api/axios";

interface Article {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  category: string;
  country: string;
  coverEmoji?: string;
  coverBg?: string;
  coverImage?: string | null;
  views: number;
  publishedAt: string;
  author?: { username: string };
  authorName?: string;
}

export default function NewsArticlePage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug;

  const [article, setArticle] = useState<Article | null>(null);
  const [related, setRelated] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    axiosInstance
      .get(`/news/${slug}`)
      .then(({ data }) => {
        setArticle(data.article);
        setRelated(data.related ?? []);
      })
      .catch((err) => {
        setError(err?.response?.status === 404 ? "not_found" : "error");
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 size={28} className="animate-spin text-yellow-500" />
      </main>
    );
  }

  if (error === "not_found" || !article) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center max-w-sm">
          <div className="text-6xl mb-3">📰</div>
          <h1 className="text-lg font-black text-gray-900 mb-2">
            Article not found
          </h1>
          <p className="text-sm text-gray-500 mb-4">
            This article may have been moved or unpublished.
          </p>
          <Link
            href="/news"
            className="inline-block px-5 py-2.5 bg-yellow-400 hover:bg-yellow-300
              text-black font-black text-sm rounded-xl transition"
          >
            Back to all news
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-gray-50 min-h-screen">
      {/* Cover */}
      <header
        className={`${article.coverBg ?? "bg-gray-100"} pt-6 pb-12 sm:pt-10 sm:pb-16`}
      >
        <div className="max-w-3xl mx-auto px-3 sm:px-4">
          <Link
            href="/news"
            className="inline-flex items-center gap-1 text-xs text-gray-700
              hover:text-gray-900 font-medium mb-4"
          >
            <ChevronLeft size={13} /> Back to news
          </Link>

          <div className="flex items-center gap-2 mb-3">
            <span
              className="inline-block bg-black text-yellow-400 text-[10px]
              font-black px-2 py-1 rounded"
            >
              {article.category}
            </span>
            <span className="text-[11px] text-gray-700">
              {article.country !== "All" && `${article.country} · `}
              {new Date(article.publishedAt).toLocaleDateString("en-GH", {
                dateStyle: "long",
              })}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-gray-900 leading-tight mb-3">
            {article.title}
          </h1>

          {article.excerpt && (
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed max-w-2xl">
              {article.excerpt}
            </p>
          )}

          <div className="flex items-center gap-4 mt-5 text-xs text-gray-600">
            <span className="flex items-center gap-1">
              <UserIcon size={12} />
              {article.author?.username ??
                article.authorName ??
                "SmileBaba Editorial"}
            </span>
            <span className="flex items-center gap-1">
              <Eye size={12} /> {article.views.toLocaleString()} views
            </span>
          </div>
        </div>
      </header>

      {/* Cover image (if present) */}
      {article.coverImage && (
        <div className="max-w-3xl mx-auto px-3 sm:px-4 -mt-8 mb-6">
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full aspect-[16/9] object-cover rounded-2xl border-4 border-white shadow-lg"
          />
        </div>
      )}

      {/* Body */}
      <article className="max-w-3xl mx-auto px-3 sm:px-4 py-6 sm:py-10">
        <div className="bg-white border border-gray-100 rounded-2xl p-5 sm:p-8 shadow-sm">
          <div
            className="prose prose-sm sm:prose-base max-w-none
            prose-headings:font-black prose-headings:text-gray-900
            prose-p:text-gray-700 prose-p:leading-relaxed
            prose-a:text-yellow-600 prose-a:no-underline hover:prose-a:underline
            prose-strong:text-gray-900 prose-strong:font-bold
            whitespace-pre-wrap"
          >
            {article.content}
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-black text-gray-900 mb-4">Read next</h2>
            <div className="grid sm:grid-cols-3 gap-3">
              {related.map((r) => (
                <Link
                  key={r._id}
                  href={`/news/${r.slug}`}
                  className="bg-white border border-gray-100 rounded-2xl p-4
                    hover:shadow-md transition group"
                >
                  <div
                    className={`w-12 h-12 ${r.coverBg ?? "bg-gray-100"} rounded-xl
                    flex items-center justify-center text-2xl mb-2 overflow-hidden`}
                  >
                    {r.coverImage ? (
                      <img
                        src={r.coverImage}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      (r.coverEmoji ?? "📰")
                    )}
                  </div>
                  <span
                    className="inline-block bg-gray-100 text-gray-700 text-[10px]
                    font-black px-2 py-0.5 rounded mb-1"
                  >
                    {r.category}
                  </span>
                  <p
                    className="text-sm font-bold text-gray-900 line-clamp-2
                    group-hover:text-yellow-600 transition"
                  >
                    {r.title}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </main>
  );
}
