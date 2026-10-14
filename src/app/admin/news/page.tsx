"use client";

// src/app/admin/news/page.tsx — admin news listing
//
// Lists all articles (drafts + published) with status filters, search,
// quick actions (edit, publish/unpublish, delete) and pagination.

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  Filter,
  Eye,
  EyeOff,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { toast } from "react-toastify";
import axiosInstance from "@/src/lib/api/axios";

interface Article {
  _id: string;
  title: string;
  slug: string;
  category: string;
  country: string;
  status: "draft" | "published" | "archived";
  views: number;
  publishedAt: string | null;
  updatedAt: string;
  coverEmoji: string;
  coverBg: string;
  coverImage: string | null;
}

const STATUSES = [
  { value: "all", label: "All", color: "bg-gray-100 text-gray-700" },
  { value: "draft", label: "Drafts", color: "bg-yellow-100 text-yellow-700" },
  {
    value: "published",
    label: "Published",
    color: "bg-green-100 text-green-700",
  },
  { value: "archived", label: "Archived", color: "bg-gray-100 text-gray-500" },
];

export default function AdminNewsList() {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<any>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = { page, limit: 20 };
      if (status !== "all") params.status = status;
      if (search.trim()) params.search = search.trim();

      const { data } = await axiosInstance.get("/admin/news", { params });
      setArticles(data.articles);
      setMeta(data.meta);
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to load articles");
    } finally {
      setLoading(false);
    }
  }, [page, status, search]);

  useEffect(() => {
    load();
  }, [load]);

  const togglePublish = async (a: Article) => {
    const newStatus = a.status === "published" ? "draft" : "published";
    try {
      await axiosInstance.patch(`/admin/news/${a._id}`, { status: newStatus });
      toast.success(
        `Article ${newStatus === "published" ? "published" : "moved to drafts"}`,
      );
      load();
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to update");
    }
  };

  const deleteArticle = async (a: Article) => {
    if (!confirm(`Delete "${a.title}"? This cannot be undone.`)) return;
    try {
      await axiosInstance.delete(`/admin/news/${a._id}`);
      toast.success("Article deleted");
      load();
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to delete");
    }
  };

  return (
    <main className="bg-gray-50 min-h-screen p-3 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900">
              News articles
            </h1>
            <p className="text-xs text-gray-500">
              Publish and manage editorial content
            </p>
          </div>
          <Link
            href="/admin/news/new"
            className="flex items-center gap-1.5 bg-gray-900 hover:bg-gray-800
              text-yellow-400 font-black text-xs sm:text-sm px-3 sm:px-4 py-2 sm:py-2.5
              rounded-xl transition"
          >
            <Plus size={14} /> New article
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white border border-gray-100 rounded-2xl p-3 sm:p-4 mb-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="flex-1 relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && load()}
                placeholder="Search by title…"
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm
                  focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            {/* Status tabs */}
            <div className="flex gap-1 bg-gray-100 rounded-xl p-1 overflow-x-auto">
              {STATUSES.map((s) => (
                <button
                  key={s.value}
                  onClick={() => {
                    setStatus(s.value);
                    setPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap
                    transition
                    ${
                      status === s.value
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
          {loading && (
            <div className="flex justify-center py-12">
              <Loader2 size={24} className="animate-spin text-yellow-500" />
            </div>
          )}

          {!loading && articles.length === 0 && (
            <div className="text-center py-12">
              <p className="text-sm text-gray-400">No articles yet.</p>
              <Link
                href="/admin/news/new"
                className="inline-block mt-3 text-xs text-yellow-600 hover:underline font-bold"
              >
                Create your first article →
              </Link>
            </div>
          )}

          {!loading && articles.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[600px]">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    {[
                      "Article",
                      "Category",
                      "Status",
                      "Views",
                      "Updated",
                      "",
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left text-[10px] font-bold text-gray-400
                        uppercase tracking-wider px-3 sm:px-4 py-3"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {articles.map((a) => (
                    <tr key={a._id} className="hover:bg-gray-50/60 transition">
                      <td className="px-3 sm:px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-9 h-9 ${a.coverBg} rounded-lg
                            flex items-center justify-center flex-shrink-0`}
                          >
                            <span className="text-lg">{a.coverEmoji}</span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-gray-900 truncate max-w-[200px]">
                              {a.title}
                            </p>
                            <p className="text-[10px] text-gray-400 truncate">
                              /{a.slug}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 sm:px-4 py-3">
                        <span
                          className="text-[10px] bg-gray-100 text-gray-700
                          px-2 py-0.5 rounded font-bold"
                        >
                          {a.category}
                        </span>
                      </td>
                      <td className="px-3 sm:px-4 py-3">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded
                          ${
                            a.status === "published"
                              ? "bg-green-100 text-green-700"
                              : a.status === "draft"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {a.status}
                        </span>
                      </td>
                      <td className="px-3 sm:px-4 py-3 text-xs text-gray-600">
                        {a.views.toLocaleString()}
                      </td>
                      <td className="px-3 sm:px-4 py-3 text-[11px] text-gray-400">
                        {new Date(a.updatedAt).toLocaleDateString("en-GH", {
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="px-3 sm:px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => togglePublish(a)}
                            title={
                              a.status === "published" ? "Unpublish" : "Publish"
                            }
                            className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-yellow-100
                              text-gray-600 hover:text-yellow-700 flex items-center
                              justify-center transition"
                          >
                            {a.status === "published" ? (
                              <EyeOff size={12} />
                            ) : (
                              <Eye size={12} />
                            )}
                          </button>
                          <Link
                            href={`/admin/news/${a._id}/edit`}
                            title="Edit"
                            className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-blue-100
                              text-gray-600 hover:text-blue-700 flex items-center
                              justify-center transition"
                          >
                            <Edit2 size={12} />
                          </Link>
                          <button
                            onClick={() => deleteArticle(a)}
                            title="Delete"
                            className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-red-100
                              text-gray-600 hover:text-red-700 flex items-center
                              justify-center transition"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
              <p className="text-xs text-gray-400">
                {meta.total} total · page {meta.page} of {meta.totalPages}
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="w-7 h-7 flex items-center justify-center rounded-lg
                    border border-gray-200 text-gray-500 hover:bg-gray-50
                    disabled:opacity-30 transition"
                >
                  <ChevronLeft size={13} />
                </button>
                <span className="text-xs font-semibold text-gray-700 px-2">
                  {page}
                </span>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= meta.totalPages}
                  className="w-7 h-7 flex items-center justify-center rounded-lg
                    border border-gray-200 text-gray-500 hover:bg-gray-50
                    disabled:opacity-30 transition"
                >
                  <ChevronRight size={13} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
