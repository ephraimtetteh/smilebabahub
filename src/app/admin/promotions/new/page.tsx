"use client";

// frontend/src/app/admin/promotions/new/page.tsx
//
// Admin manual promotion creation. Changes from previous version:
//   - Cover image is now uploaded (drag-drop / file picker) directly to
//     Cloudinary, not a URL paste. Shows preview + upload progress.
//   - Video is also now uploadable (same pattern) — keeping URL paste
//     as an alternative for backfill from existing Cloudinary URLs.
//   - Flutterwave payment ID + reference are truly optional. Manual
//     admin creation IMPLIES payment has been received.
//   - Default status is "live" so the promotion appears on the homepage
//     immediately after admin submits.

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Upload,
  X,
  ImagePlus,
  Film,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { toast } from "react-toastify";
import axiosInstance from "@/src/lib/api/axios";

const TIERS = ["starter", "growth", "enterprise"] as const;
const STATUSES = [
  "submitted",
  "under_review",
  "payment_pending",
  "paid",
  "live",
  "expired",
  "rejected",
] as const;

// Cloudinary config
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export default function AdminCreatePromotionPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [showPaymentFields, setShowPaymentFields] = useState(false);

  const [form, setForm] = useState({
    // Business
    businessName: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",

    // Campaign
    title: "",
    description: "",
    category: "",
    targetRegion: "",

    // Creative (URLs — populated by uploads OR pasted manually)
    videoUrl: "",
    coverImage: "",

    // Package
    tier: "starter" as (typeof TIERS)[number],
    country: "Ghana",

    // Status
    status: "live" as (typeof STATUSES)[number],
    paymentRef: "",
    flwTxId: "",
  });

  const update = (k: keyof typeof form, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  // ═════════════════════════════════════════════════════════════════════
  // COVER IMAGE UPLOAD
  // ═════════════════════════════════════════════════════════════════════
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [coverUploading, setCoverUploading] = useState(false);
  const [coverProgress, setCoverProgress] = useState(0);

  const handleCoverPick = () => coverInputRef.current?.click();

  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      toast.error("Image is over 8 MB — try a smaller one");
      return;
    }
    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      toast.error("Cloudinary not configured — check env vars");
      return;
    }

    setCoverUploading(true);
    setCoverProgress(0);
    try {
      const url = await uploadFileToCloudinary(
        file,
        "image",
        "smilebaba/promotions/covers",
        (pct) => setCoverProgress(pct),
      );
      update("coverImage", url);
      toast.success("Cover uploaded");
    } catch (err: any) {
      console.error("[cover upload]", err);
      toast.error(err.message ?? "Upload failed");
    } finally {
      setCoverUploading(false);
      // Reset file input so picking the same file again re-triggers change
      if (coverInputRef.current) coverInputRef.current.value = "";
    }
  };

  // ═════════════════════════════════════════════════════════════════════
  // VIDEO UPLOAD
  // ═════════════════════════════════════════════════════════════════════
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [videoUploading, setVideoUploading] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);

  const handleVideoPick = () => videoInputRef.current?.click();

  const handleVideoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      toast.error("Please choose a video file");
      return;
    }
    if (file.size > 200 * 1024 * 1024) {
      toast.error("Video is over 200 MB — try compressing it first");
      return;
    }
    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      toast.error("Cloudinary not configured");
      return;
    }

    setVideoUploading(true);
    setVideoProgress(0);
    try {
      const url = await uploadFileToCloudinary(
        file,
        "video",
        "smilebaba/promotions",
        (pct) => setVideoProgress(pct),
      );
      update("videoUrl", url);
      toast.success("Video uploaded");
    } catch (err: any) {
      console.error("[video upload]", err);
      toast.error(err.message ?? "Upload failed");
    } finally {
      setVideoUploading(false);
      if (videoInputRef.current) videoInputRef.current.value = "";
    }
  };

  // ═════════════════════════════════════════════════════════════════════
  // SUBMIT
  // ═════════════════════════════════════════════════════════════════════
  const handleSubmit = async () => {
    if (
      !form.businessName ||
      !form.contactEmail ||
      !form.title ||
      !form.videoUrl
    ) {
      toast.error("Business name, email, title, and video are required");
      return;
    }

    setSaving(true);
    try {
      // Only send payment fields if they were filled in
      const payload = { ...form };
      if (!payload.paymentRef) delete (payload as any).paymentRef;
      if (!payload.flwTxId) delete (payload as any).flwTxId;

      const { data } = await axiosInstance.post("/admin/promotions", payload);
      toast.success("Promotion created!");
      router.push(`/admin/promotions/${data.promotion._id}`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Create failed");
    } finally {
      setSaving(false);
    }
  };

  // ═════════════════════════════════════════════════════════════════════
  // RENDER
  // ═════════════════════════════════════════════════════════════════════
  return (
    <main className="min-h-screen bg-gray-50">
      <section className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link
            href="/admin/promotions"
            className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900"
          >
            <ChevronLeft size={13} /> Back to promotions
          </Link>
          <h1 className="mt-2 text-xl sm:text-2xl font-black text-gray-900">
            Create promotion manually
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Upload creative directly. Payment is assumed received when you
            create manually.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-5">
        {/* Info banner */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 flex items-start gap-2">
          <AlertCircle
            size={16}
            className="text-yellow-700 flex-shrink-0 mt-0.5"
          />
          <div className="text-xs text-yellow-800 leading-relaxed">
            <strong>Manual creation bypasses the review flow.</strong> By
            creating a promotion here, you&apos;re confirming that payment has
            been received (bank transfer, cash, direct MoMo, etc.). The
            Flutterwave IDs are optional — fill them in only if you have them.
          </div>
        </div>

        {/* ─── Business ─── */}
        <Section title="Business & contact">
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Business name" required>
              <input
                value={form.businessName}
                onChange={(e) => update("businessName", e.target.value)}
                placeholder="e.g. Mama's Kitchen"
                className={inputCls}
              />
            </Field>
            <Field label="Contact name">
              <input
                value={form.contactName}
                onChange={(e) => update("contactName", e.target.value)}
                placeholder="e.g. Ama Mensah"
                className={inputCls}
              />
            </Field>
            <Field label="Contact email" required>
              <input
                type="email"
                value={form.contactEmail}
                onChange={(e) => update("contactEmail", e.target.value)}
                placeholder="you@business.com"
                className={inputCls}
              />
            </Field>
            <Field label="Contact phone">
              <input
                type="tel"
                value={form.contactPhone}
                onChange={(e) => update("contactPhone", e.target.value)}
                placeholder="+233 20 000 0000"
                className={inputCls}
              />
            </Field>
          </div>
        </Section>

        {/* ─── Campaign ─── */}
        <Section title="Campaign details">
          <Field label="Campaign title" required>
            <input
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              placeholder="e.g. Weekend Jollof Special"
              className={inputCls}
            />
          </Field>
          <Field label="Description">
            <textarea
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              rows={3}
              className={inputCls}
            />
          </Field>
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Category">
              <input
                value={form.category}
                onChange={(e) => update("category", e.target.value)}
                placeholder="e.g. Food & Restaurants"
                className={inputCls}
              />
            </Field>
            <Field label="Target region">
              <input
                value={form.targetRegion}
                onChange={(e) => update("targetRegion", e.target.value)}
                placeholder="e.g. Greater Accra"
                className={inputCls}
              />
            </Field>
          </div>
        </Section>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* ── VIDEO UPLOAD ─────────────────────────────────────────────── */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <Section title="Video">
          <input
            ref={videoInputRef}
            type="file"
            accept="video/*"
            onChange={handleVideoChange}
            className="hidden"
          />

          {form.videoUrl ? (
            <div className="space-y-2">
              <div className="bg-black rounded-xl overflow-hidden">
                <video
                  src={form.videoUrl}
                  controls
                  poster={form.coverImage || undefined}
                  className="w-full aspect-video"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="text-[11px] text-gray-500 truncate flex items-center gap-1 min-w-0">
                  <Film size={11} className="text-green-500 flex-shrink-0" />
                  <span className="truncate">{form.videoUrl}</span>
                </div>
                <button
                  onClick={() => update("videoUrl", "")}
                  className="text-[11px] font-black text-red-600 hover:underline flex-shrink-0 ml-3"
                >
                  Remove
                </button>
              </div>
            </div>
          ) : videoUploading ? (
            <div className="border-2 border-dashed border-yellow-400 rounded-2xl p-8 text-center bg-yellow-50">
              <Loader2
                size={28}
                className="mx-auto text-yellow-600 animate-spin"
              />
              <p className="mt-3 text-sm font-black text-gray-900">
                Uploading video… {videoProgress}%
              </p>
              <div className="mt-3 h-1.5 bg-yellow-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 transition-all"
                  style={{ width: `${videoProgress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <button
                onClick={handleVideoPick}
                className="w-full border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-yellow-400 hover:bg-yellow-50 transition"
              >
                <Film size={22} className="mx-auto text-gray-400" />
                <p className="mt-2 text-sm font-black text-gray-700">
                  Click to upload video
                </p>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  MP4, MOV, WebM • up to 200 MB
                </p>
              </button>
              <div className="flex items-center gap-2 text-[11px] text-gray-500">
                <div className="flex-1 h-px bg-gray-200" />
                <span>or paste a Cloudinary URL</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>
              <input
                value={form.videoUrl}
                onChange={(e) => update("videoUrl", e.target.value)}
                placeholder="https://res.cloudinary.com/.../xxx.mp4"
                className={`${inputCls} font-mono text-[11px]`}
              />
            </div>
          )}
        </Section>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* ── COVER IMAGE UPLOAD ───────────────────────────────────────── */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <Section
          title="Cover image"
          hint="Shown on the homepage promotions row and campaign detail page."
        >
          <input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            onChange={handleCoverChange}
            className="hidden"
          />

          {form.coverImage ? (
            <div className="space-y-2">
              <div className="relative rounded-2xl overflow-hidden bg-gray-100 max-w-md">
                <img
                  src={form.coverImage}
                  alt="cover preview"
                  className="w-full aspect-video object-cover"
                />
                <button
                  onClick={() => update("coverImage", "")}
                  className="absolute top-2 right-2 w-8 h-8 bg-black/70 hover:bg-black rounded-full flex items-center justify-center transition"
                >
                  <X size={14} className="text-white" />
                </button>
              </div>
              <button
                onClick={handleCoverPick}
                className="text-[11px] font-black text-yellow-700 hover:underline"
              >
                Replace image
              </button>
            </div>
          ) : coverUploading ? (
            <div className="border-2 border-dashed border-yellow-400 rounded-2xl p-8 text-center bg-yellow-50 max-w-md">
              <Loader2
                size={28}
                className="mx-auto text-yellow-600 animate-spin"
              />
              <p className="mt-3 text-sm font-black text-gray-900">
                Uploading image… {coverProgress}%
              </p>
              <div className="mt-3 h-1.5 bg-yellow-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 transition-all"
                  style={{ width: `${coverProgress}%` }}
                />
              </div>
            </div>
          ) : (
            <button
              onClick={handleCoverPick}
              className="w-full max-w-md border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-yellow-400 hover:bg-yellow-50 transition"
            >
              <ImagePlus size={22} className="mx-auto text-gray-400" />
              <p className="mt-2 text-sm font-black text-gray-700">
                Click to upload cover image
              </p>
              <p className="text-[11px] text-gray-500 mt-0.5">
                JPG, PNG, WebP • up to 8 MB • 16:9 recommended
              </p>
            </button>
          )}
        </Section>

        {/* ─── Package ─── */}
        <Section title="Package">
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Tier" required>
              <select
                value={form.tier}
                onChange={(e) => update("tier", e.target.value)}
                className={inputCls}
              >
                {TIERS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Country">
              <select
                value={form.country}
                onChange={(e) => update("country", e.target.value)}
                className={inputCls}
              >
                <option>Ghana</option>
                <option>Nigeria</option>
              </select>
            </Field>
          </div>
          <p className="text-[11px] text-gray-500 mt-2">
            Amount, duration, and channels are auto-resolved from the tier +
            country.
          </p>
        </Section>

        {/* ─── Status ─── */}
        <Section title="Status">
          <Field label="Initial status" required>
            <select
              value={form.status}
              onChange={(e) => update("status", e.target.value)}
              className={inputCls}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </Field>
          <p className="text-[11px] text-gray-500 mt-2">
            Default is <strong className="text-gray-900">live</strong> — the
            promotion appears on the homepage immediately.
          </p>

          {/* Collapsible optional payment info */}
          <button
            onClick={() => setShowPaymentFields((v) => !v)}
            className="mt-4 flex items-center gap-1 text-[11px] font-black text-gray-600 hover:text-gray-900"
          >
            {showPaymentFields ? (
              <ChevronUp size={12} />
            ) : (
              <ChevronDown size={12} />
            )}
            Optional: link Flutterwave transaction
          </button>

          {showPaymentFields && (
            <div className="mt-3 grid sm:grid-cols-2 gap-3 bg-gray-50 rounded-2xl p-4">
              <Field
                label="Payment reference"
                hint="Only fill if you have a Flutterwave tx_ref"
              >
                <input
                  value={form.paymentRef}
                  onChange={(e) => update("paymentRef", e.target.value)}
                  placeholder="promo_xxx_1234567890"
                  className={`${inputCls} font-mono`}
                />
              </Field>
              <Field label="Flutterwave tx ID" hint="From the FLW dashboard">
                <input
                  value={form.flwTxId}
                  onChange={(e) => update("flwTxId", e.target.value)}
                  placeholder="e.g. 4567890"
                  className={`${inputCls} font-mono`}
                />
              </Field>
            </div>
          )}
        </Section>

        {/* ─── Submit ─── */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <CheckCircle2 size={14} className="text-green-500 flex-shrink-0" />
            <p className="text-xs text-gray-600 truncate">
              Creating with status{" "}
              <strong className="text-gray-900">{form.status}</strong>
              {form.status === "live" && " · appears on homepage immediately"}
            </p>
          </div>
          <button
            onClick={handleSubmit}
            disabled={saving || coverUploading || videoUploading}
            className="bg-yellow-400 hover:bg-yellow-300 text-black font-black px-5 py-2.5 rounded-xl text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 flex-shrink-0"
          >
            {saving ? (
              <>
                <Loader2 size={14} className="animate-spin" /> Saving…
              </>
            ) : (
              <>
                <Save size={14} /> Create promotion
              </>
            )}
          </button>
        </div>
      </div>
    </main>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// Cloudinary uploader — inline so we can pass a custom folder without
// modifying your shared uploadToCloudinary.ts helper.
// ═══════════════════════════════════════════════════════════════════════
function uploadFileToCloudinary(
  file: File,
  resourceType: "image" | "video",
  folder: string,
  onProgress?: (pct: number) => void,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", UPLOAD_PRESET!);
    fd.append("folder", folder);

    const xhr = new XMLHttpRequest();
    xhr.open(
      "POST",
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`,
    );

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          resolve(data.secure_url);
        } catch {
          reject(new Error("Cloudinary returned invalid JSON"));
        }
      } else {
        let msg = `${xhr.status} ${xhr.statusText}`;
        try {
          msg = JSON.parse(xhr.responseText)?.error?.message ?? msg;
        } catch {}
        reject(new Error(msg));
      }
    });

    xhr.addEventListener("error", () => reject(new Error("Network error")));
    xhr.addEventListener("abort", () => reject(new Error("Upload cancelled")));

    xhr.send(fd);
  });
}

// ─── Layout helpers ──────────────────────────────────────────────────
function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
      <div>
        <h3 className="font-black text-gray-900 text-sm">{title}</h3>
        {hint && <p className="text-[11px] text-gray-500 mt-0.5">{hint}</p>}
      </div>
      {children}
    </div>
  );
}

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <p className="text-xs font-bold text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </p>
      {children}
      {hint && <p className="text-[11px] text-gray-500 mt-1">{hint}</p>}
    </label>
  );
}

const inputCls =
  "w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 transition";
