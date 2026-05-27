"use client";

// src/app/admin/news/new/page.tsx                — create
// src/app/admin/news/[id]/edit/page.tsx          — edit (pass `articleId` prop)
//
// Admin news article editor. Form fields:
//   - Title (auto-generates slug)
//   - Category, country, status
//   - Excerpt (under 500 chars)
//   - Content (markdown / HTML)
//   - Cover: emoji + colour OR Cloudinary image upload
//   - SEO: meta title, description, keywords
//
// Saves to POST /admin/news or PATCH /admin/news/:id

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Save,
  ArrowLeft,
  Eye,
  Loader2,
  Upload,
  X,
  Image as ImgIcon,
} from "lucide-react";
import { toast } from "react-toastify";
import axiosInstance from "@/src/lib/api/axios";

const CATEGORIES = [
  "Economy",
  "Jobs",
  "Trade",
  "Sports",
  "Tech",
  "Politics",
  "Health",
  "Entertainment",
];
const COUNTRIES = ["All", "Ghana", "Nigeria"];
const STATUSES = ["draft", "published", "archived"];

const EMOJI_PRESETS = [
  { emoji: "📰", bg: "bg-gray-100" },
  { emoji: "💵", bg: "bg-green-100" },
  { emoji: "💼", bg: "bg-blue-100" },
  { emoji: "🌍", bg: "bg-purple-100" },
  { emoji: "⚽", bg: "bg-red-100" },
  { emoji: "💸", bg: "bg-emerald-100" },
  { emoji: "🏥", bg: "bg-cyan-100" },
  { emoji: "📱", bg: "bg-indigo-100" },
  { emoji: "🎬", bg: "bg-pink-100" },
  { emoji: "🏛️", bg: "bg-amber-100" },
];

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

interface Props {
  articleId?: string; // if provided, this is an edit page
}

export default function AdminNewsForm({ articleId }: Props) {
  const router = useRouter();
  const isEditing = !!articleId;

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "Economy",
    country: "All",
    status: "draft" as "draft" | "published" | "archived",
    coverEmoji: "📰",
    coverBg: "bg-gray-100",
    coverImage: "",
    tags: "",
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
  });

  // Load existing article when editing
  useEffect(() => {
    if (!articleId) return;
    (async () => {
      try {
        const { data } = await axiosInstance.get(
          `/admin/news?status=all&limit=1&_id=${articleId}`,
        );
        const article = data.articles?.find((a: any) => a._id === articleId);
        if (article) {
          setForm({
            title: article.title,
            slug: article.slug,
            excerpt: article.excerpt ?? "",
            content: article.content ?? "",
            category: article.category,
            country: article.country,
            status: article.status,
            coverEmoji: article.coverEmoji ?? "📰",
            coverBg: article.coverBg ?? "bg-gray-100",
            coverImage: article.coverImage ?? "",
            tags: (article.tags ?? []).join(", "),
            metaTitle: article.metaTitle ?? "",
            metaDescription: article.metaDescription ?? "",
            metaKeywords: (article.metaKeywords ?? []).join(", "),
          });
        }
      } catch (err: any) {
        toast.error("Failed to load article");
      } finally {
        setLoading(false);
      }
    })();
  }, [articleId]);

  // Auto-generate slug from title
  useEffect(() => {
    if (isEditing || !form.title) return;
    const slug = form.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 80);
    setForm((f) => ({ ...f, slug }));
  }, [form.title, isEditing]);

  const update = (k: keyof typeof form, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const uploadImage = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("upload_preset", UPLOAD_PRESET);
      fd.append("folder", "smilebaba/news");

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: fd,
        },
      );
      const data = await res.json();
      update("coverImage", data.secure_url);
      toast.success("Image uploaded");
    } catch {
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const save = async (publishNow = false) => {
    if (!form.title.trim() || !form.content.trim()) {
      toast.error("Title and content are required");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        status: publishNow ? "published" : form.status,
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        metaKeywords: form.metaKeywords
          .split(",")
          .map((k) => k.trim())
          .filter(Boolean),
      };

      if (isEditing) {
        await axiosInstance.patch(`/admin/news/${articleId}`, payload);
        toast.success(publishNow ? "Article published!" : "Article saved");
      } else {
        const { data } = await axiosInstance.post("/admin/news", payload);
        toast.success(publishNow ? "Article published!" : "Draft saved");
        router.push(`/admin/news/${data.article._id}/edit`);
        return;
      }
      router.push("/admin/news");
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="bg-gray-50 min-h-screen flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-yellow-500" />
      </main>
    );
  }

  return (
    <main className="bg-gray-50 min-h-screen p-3 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/news"
              className="w-9 h-9 rounded-xl bg-white border border-gray-200
                flex items-center justify-center hover:bg-gray-50"
            >
              <ArrowLeft size={16} />
            </Link>
            <div>
              <h1 className="text-lg sm:text-xl font-black text-gray-900">
                {isEditing ? "Edit article" : "New article"}
              </h1>
              <p className="text-xs text-gray-500">
                {form.status === "published" ? "Published" : "Draft"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => save(false)}
              disabled={saving}
              className="flex items-center gap-1.5 bg-white border border-gray-200
                hover:bg-gray-50 text-gray-700 text-xs sm:text-sm font-bold
                px-3 sm:px-4 py-2 rounded-xl transition disabled:opacity-50"
            >
              <Save size={14} /> Save draft
            </button>
            <button
              onClick={() => save(true)}
              disabled={saving}
              className="flex items-center gap-1.5 bg-yellow-400 hover:bg-yellow-300
                text-black text-xs sm:text-sm font-black px-3 sm:px-4 py-2 rounded-xl
                transition disabled:opacity-50"
            >
              {saving ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Eye size={14} />
              )}
              Publish
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-5">
          {/* Main column */}
          <div className="lg:col-span-2 space-y-4">
            {/* Title + slug */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 space-y-3">
              <Field label="Title" required>
                <input
                  value={form.title}
                  onChange={(e) => update("title", e.target.value)}
                  placeholder="Article headline"
                  className={fieldCls + " text-lg font-bold"}
                />
              </Field>
              <Field label="Slug (URL)">
                <div
                  className="flex items-center bg-gray-50 border border-gray-200 rounded-xl
                  pl-3 focus-within:border-yellow-400 focus-within:ring-2 focus-within:ring-yellow-100"
                >
                  <span className="text-xs text-gray-400">/news/</span>
                  <input
                    value={form.slug}
                    onChange={(e) => update("slug", e.target.value)}
                    placeholder="auto-generated"
                    className="flex-1 px-2 py-2.5 text-sm bg-transparent outline-none"
                  />
                </div>
              </Field>
              <Field label="Excerpt (short summary)">
                <textarea
                  value={form.excerpt}
                  onChange={(e) => update("excerpt", e.target.value)}
                  placeholder="One or two sentences — shown in article cards"
                  rows={2}
                  maxLength={500}
                  className={fieldCls}
                />
                <p className="text-[10px] text-gray-400 mt-1">
                  {form.excerpt.length}/500
                </p>
              </Field>
            </div>

            {/* Content */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5">
              <Field label="Content" required>
                <textarea
                  value={form.content}
                  onChange={(e) => update("content", e.target.value)}
                  placeholder="Write the full article here. Markdown is supported."
                  rows={16}
                  className={
                    fieldCls + " font-mono text-[13px] leading-relaxed"
                  }
                />
                <p className="text-[10px] text-gray-400 mt-1">
                  Supports Markdown. {form.content.length} characters.
                </p>
              </Field>
            </div>

            {/* SEO */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5">
              <h3 className="text-sm font-black text-gray-900 mb-3">
                🔍 SEO settings
              </h3>
              <div className="space-y-3">
                <Field label="Meta title">
                  <input
                    value={form.metaTitle}
                    onChange={(e) => update("metaTitle", e.target.value)}
                    placeholder="Defaults to article title if empty"
                    maxLength={70}
                    className={fieldCls}
                  />
                </Field>
                <Field label="Meta description">
                  <textarea
                    value={form.metaDescription}
                    onChange={(e) => update("metaDescription", e.target.value)}
                    placeholder="Brief description for Google search results"
                    rows={2}
                    maxLength={160}
                    className={fieldCls}
                  />
                  <p className="text-[10px] text-gray-400 mt-1">
                    {form.metaDescription.length}/160 characters
                  </p>
                </Field>
                <Field label="Keywords (comma-separated)">
                  <input
                    value={form.metaKeywords}
                    onChange={(e) => update("metaKeywords", e.target.value)}
                    placeholder="ghana economy, cedi, currency"
                    className={fieldCls}
                  />
                </Field>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Publishing */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 space-y-3">
              <h3 className="text-sm font-black text-gray-900">Publishing</h3>
              <Field label="Status">
                <select
                  value={form.status}
                  onChange={(e) => update("status", e.target.value as any)}
                  className={fieldCls}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Category">
                <select
                  value={form.category}
                  onChange={(e) => update("category", e.target.value)}
                  className={fieldCls}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </Field>
              <Field label="Country">
                <select
                  value={form.country}
                  onChange={(e) => update("country", e.target.value)}
                  className={fieldCls}
                >
                  {COUNTRIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </Field>
              <Field label="Tags (comma-separated)">
                <input
                  value={form.tags}
                  onChange={(e) => update("tags", e.target.value)}
                  placeholder="cedi, currency, banking"
                  className={fieldCls}
                />
              </Field>
            </div>

            {/* Cover image */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 space-y-3">
              <h3 className="text-sm font-black text-gray-900">Cover</h3>

              {form.coverImage ? (
                <div className="relative">
                  <img
                    src={form.coverImage}
                    alt=""
                    className="w-full aspect-[16/9] object-cover rounded-xl"
                  />
                  <button
                    onClick={() => update("coverImage", "")}
                    className="absolute top-2 right-2 w-7 h-7 bg-black/60 hover:bg-black
                      rounded-full flex items-center justify-center"
                  >
                    <X size={13} className="text-white" />
                  </button>
                </div>
              ) : (
                <>
                  {/* Emoji + colour preview */}
                  <div
                    className={`${form.coverBg} rounded-xl aspect-[16/9]
                    flex items-center justify-center`}
                  >
                    <span className="text-6xl">{form.coverEmoji}</span>
                  </div>

                  {/* Emoji presets */}
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                      Quick presets
                    </p>
                    <div className="grid grid-cols-5 gap-1.5">
                      {EMOJI_PRESETS.map((p) => (
                        <button
                          key={p.emoji}
                          type="button"
                          onClick={() => {
                            update("coverEmoji", p.emoji);
                            update("coverBg", p.bg);
                          }}
                          className={`aspect-square ${p.bg} rounded-lg flex items-center
                            justify-center text-xl hover:scale-105 transition
                            ${form.coverEmoji === p.emoji ? "ring-2 ring-yellow-400" : ""}`}
                        >
                          {p.emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Upload */}
              <label className="block">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) uploadImage(f);
                  }}
                />
                <div
                  className="border-2 border-dashed border-gray-200 rounded-xl
                  py-3 text-center hover:border-yellow-400 cursor-pointer transition"
                >
                  {uploading ? (
                    <Loader2
                      size={16}
                      className="animate-spin mx-auto text-yellow-500"
                    />
                  ) : (
                    <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                      <Upload size={13} />{" "}
                      {form.coverImage ? "Replace" : "Upload"} image
                    </div>
                  )}
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

// ─── helpers ────────────────────────────────────────────────────────────────
const fieldCls = `w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm
  bg-white outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100
  transition`;

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <p className="text-xs font-bold text-gray-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </p>
      {children}
    </label>
  );
}
