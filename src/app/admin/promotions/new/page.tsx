"use client";

// frontend/app/admin/promotions/new/page.tsx
//
// Admin manual create form. Used to backfill lost/deleted promotions or
// import promos where the client paid outside the app (bank transfer,
// direct MoMo, cash). Admin sets status directly — usually "live".

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle2,
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

export default function AdminCreatePromotionPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

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

    // Creative
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

  const handleSubmit = async () => {
    // Basic client-side validation
    if (
      !form.businessName ||
      !form.contactEmail ||
      !form.title ||
      !form.videoUrl
    ) {
      toast.error("Business name, email, title, and video URL are required");
      return;
    }

    setSaving(true);
    try {
      const { data } = await axiosInstance.post("/admin/promotions", form);
      toast.success("Promotion created!");
      router.push(`/admin/promotions/${data.promotion._id}`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Create failed");
    } finally {
      setSaving(false);
    }
  };

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
            Backfill a lost record, import a legacy campaign, or launch one
            where the client paid offline.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-5">
        {/* Warning note */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 flex items-start gap-2">
          <AlertCircle
            size={16}
            className="text-yellow-700 flex-shrink-0 mt-0.5"
          />
          <div className="text-xs text-yellow-800 leading-relaxed">
            <strong>Manual create bypasses the review flow.</strong> Whatever
            status you pick is applied immediately. Use this for
            backfill/imports only — send new advertisers through{" "}
            <code>/promote/submit</code> instead.
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

        {/* ─── Creative ─── */}
        <Section title="Video & cover">
          <Field
            label="Video URL"
            required
            hint="Paste the Cloudinary video URL from your existing upload"
          >
            <input
              value={form.videoUrl}
              onChange={(e) => update("videoUrl", e.target.value)}
              placeholder="https://res.cloudinary.com/.../promotions/xxx.mp4"
              className={inputCls}
            />
          </Field>
          {form.videoUrl && (
            <video
              src={form.videoUrl}
              controls
              poster={form.coverImage || undefined}
              className="w-full rounded-xl bg-black aspect-video"
            />
          )}

          <Field
            label="Cover image URL"
            hint="Paste image URL (or leave blank to auto-derive from video)"
          >
            <input
              value={form.coverImage}
              onChange={(e) => update("coverImage", e.target.value)}
              placeholder="https://..."
              className={inputCls}
            />
          </Field>
          {form.coverImage && (
            <img
              src={form.coverImage}
              alt="cover preview"
              className="w-full max-w-md rounded-xl bg-gray-100 aspect-video object-cover"
            />
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
          <p className="text-[11px] text-gray-500">
            Amount, duration, and channels are auto-resolved from the tier +
            country.
          </p>
        </Section>

        {/* ─── Status ─── */}
        <Section title="Status & payment">
          <Field
            label="Status"
            required
            hint="Set to 'live' for the campaign to appear on homepages immediately"
          >
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
          {["paid", "live", "expired"].includes(form.status) && (
            <div className="grid sm:grid-cols-2 gap-3">
              <Field
                label="Payment reference"
                hint="Flutterwave tx_ref (usually starts with promo_)"
              >
                <input
                  value={form.paymentRef}
                  onChange={(e) => update("paymentRef", e.target.value)}
                  placeholder="promo_xxx_1234567890"
                  className={`${inputCls} font-mono`}
                />
              </Field>
              <Field
                label="Flutterwave transaction ID"
                hint="From the FLW dashboard"
              >
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
          <div className="flex items-center gap-2">
            <CheckCircle2 size={14} className="text-green-500" />
            <p className="text-xs text-gray-600">
              This will be created with status{" "}
              <strong className="text-gray-900">{form.status}</strong>
              {form.status === "live" &&
                " and appear on the homepage immediately"}
              .
            </p>
          </div>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="bg-yellow-400 hover:bg-yellow-300 text-black font-black px-5 py-2.5 rounded-xl text-sm disabled:opacity-50 flex items-center gap-2 flex-shrink-0"
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

// ─── Layout helpers ──────────────────────────────────────────────────
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
      <h3 className="font-black text-gray-900 text-sm">{title}</h3>
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
