"use client";

import { useRef, useState } from "react";
import {
  SectionCard,
  Field,
  Input,
  Select,
  Textarea,
  PhoneInput,
  SaveButton,
} from "../(component)/Ui";
import { formatBytes, VideoFile } from "../types";

type PromotionForm = {
  title: string;
  description: string;
  category: string;
  budget: string;
  targetRegion: string;
  startDate: string;
  endDate: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  agree: boolean;
};

const INITIAL_FORM: PromotionForm = {
  title: "",
  description: "",
  category: "",
  budget: "",
  targetRegion: "",
  startDate: "",
  endDate: "",
  contactName: "",
  contactPhone: "",
  contactEmail: "",
  agree: false,
};

export default function PromotionTab() {
  const videoRef = useRef<HTMLInputElement>(null);
  const [videos, setVideos] = useState<VideoFile[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<PromotionForm>(INITIAL_FORM);

  const set = (k: keyof PromotionForm, v: string | boolean) =>
    setForm((p) => ({ ...p, [k]: v }));

  const addVideo = (file: File) => {
    if (!file.type.startsWith("video/")) return;
    setVideos((prev) => [
      ...prev,
      {
        file,
        preview: URL.createObjectURL(file),
        name: file.name,
        size: formatBytes(file.size),
      },
    ]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    Array.from(e.dataTransfer.files).forEach(addVideo);
  };

  const handleSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 2000);
  };

  const resetForm = () => {
    setSubmitted(false);
    setVideos([]);
    setForm(INITIAL_FORM);
  };

  // ── Success state ──────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-16 sm:py-24 text-center px-4">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-green-100 flex items-center justify-center text-3xl sm:text-4xl mb-4">
          ✅
        </div>
        <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2">
          Promotion submitted!
        </h3>
        <p className="text-sm text-gray-500 max-w-sm leading-relaxed">
          Your video and promotion request has been sent to the Smilebaba team.
          We`ll review and get back to you within 2–3 business days.
        </p>
        <button
          type="button"
          onClick={resetForm}
          className="mt-6 px-6 py-2.5 bg-yellow-500 text-black text-sm font-semibold rounded-xl hover:bg-yellow-600 transition active:scale-95"
        >
          Submit another
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* ── Hero banner ── */}
      <div className="relative rounded-2xl overflow-hidden mb-5 sm:mb-6 bg-gradient-to-r from-yellow-500 to-yellow-400 p-5 sm:p-6 text-black">
        <div className="relative z-10">
          <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider opacity-80 mb-1">
            🎬 Smilebaba Promotion Hub
          </p>
          <h2 className="text-base sm:text-xl font-bold mb-2 leading-snug">
            Reach thousands of buyers across Ghana & Nigeria
          </h2>
          <p className="text-xs sm:text-sm opacity-90 max-w-lg leading-relaxed">
            Submit your promotional video and Smilebaba will feature it on the
            platform, social media, and our partner channels.
          </p>
          <div className="flex flex-wrap gap-4 sm:gap-6 mt-4">
            {[
              ["500K+", "Monthly users"],
              ["2 countries", "Ghana & Nigeria"],
              ["48h", "Review turnaround"],
            ].map(([v, l]) => (
              <div key={l}>
                <p className="text-base sm:text-lg font-bold">{v}</p>
                <p className="text-[11px] sm:text-xs opacity-75">{l}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute right-4 top-4 text-5xl sm:text-7xl opacity-20 pointer-events-none">
          📹
        </div>
      </div>

      {/* ── How it works ── */}
      <SectionCard
        title="How promotion works"
        description="3 simple steps to get your store featured"
      >
        <div className="grid grid-cols-1 xs:grid-cols-3 gap-3">
          {[
            {
              step: "1",
              icon: "📤",
              title: "Upload your video",
              desc: "Record a 15–90 second video showcasing your store or products",
            },
            {
              step: "2",
              icon: "🔍",
              title: "Smilebaba reviews",
              desc: "Our team reviews your submission within 48 hours",
            },
            {
              step: "3",
              icon: "🚀",
              title: "Go live",
              desc: "Approved videos are featured on Smilebaba and social media",
            },
          ].map((s) => (
            <div
              key={s.step}
              className="text-center p-3 sm:p-4 rounded-xl bg-orange-50 border border-orange-100"
            >
              <div className="text-2xl sm:text-3xl mb-2">{s.icon}</div>
              <p className="text-[11px] sm:text-xs font-bold text-yellow-600 mb-1">
                Step {s.step}
              </p>
              <p className="text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                {s.title}
              </p>
              <p className="text-[11px] sm:text-xs text-gray-500 leading-relaxed">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* ── Video upload ── */}
      <SectionCard
        title="Upload promotional video"
        description="MP4, MOV or WEBM. Max 500MB. Duration: 15 seconds to 3 minutes."
      >
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => videoRef.current?.click()}
          className={`relative w-full rounded-2xl border-2 border-dashed transition cursor-pointer
            p-6 sm:p-10 text-center
            ${
              dragOver
                ? "border-yellow-400 bg-yellow-50 scale-[1.01]"
                : "border-gray-200 bg-gray-50 hover:border-yellow-300 hover:bg-yellow-50/50"
            }`}
        >
          <div className="text-4xl sm:text-5xl mb-3">
            {dragOver ? "📥" : "🎬"}
          </div>
          <p className="text-sm font-semibold text-gray-700">
            Drag & drop your video here
          </p>
          <p className="text-xs text-gray-400 mt-1">
            or click to browse your files
          </p>
          <p className="text-xs text-gray-300 mt-2">
            MP4 · MOV · WEBM · Max 500MB
          </p>
          <input
            ref={videoRef}
            type="file"
            accept="video/*"
            multiple
            className="hidden"
            onChange={(e) => Array.from(e.target.files || []).forEach(addVideo)}
          />
        </div>

        {videos.length > 0 && (
          <div className="mt-4 space-y-3">
            {videos.map((v, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100"
              >
                <video
                  src={v.preview}
                  className="w-14 h-10 sm:w-16 sm:h-12 rounded-lg object-cover bg-gray-200 flex-shrink-0"
                  muted
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-700 truncate">
                    {v.name}
                  </p>
                  <p className="text-xs text-gray-400">{v.size}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs bg-green-100 text-green-600 font-medium px-2 py-0.5 rounded-full hidden sm:inline">
                    Ready
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setVideos((p) => p.filter((_, j) => j !== i));
                    }}
                    className="text-xs text-red-400 hover:text-red-600 font-bold p-1"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      {/* ── Promotion details ── */}
      <SectionCard
        title="Promotion details"
        description="Tell us about your campaign"
      >
        <Field
          label="Campaign title"
          required
          hint="A short catchy title for your promotion"
        >
          <Input
            placeholder="e.g. Big Electronics Sale — 30% off this week!"
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
          />
        </Field>
        <Field
          label="Promotion description"
          required
          hint="What are you promoting? What offer should viewers take away?"
        >
          <Textarea
            rows={4}
            placeholder="Describe what this promotional video is about…"
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
          />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-5">
          <Field label="Product / category to promote" required>
            <Select
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
            >
              <option value="">Select category</option>
              <option>Food & Restaurants</option>
              <option>Electronics</option>
              <option>Fashion</option>
              <option>Vehicles</option>
              <option>Apartments & Short Stays</option>
              <option>Services</option>
              <option>General / Entire Store</option>
            </Select>
          </Field>
          <Field label="Promotion type">
            <Select>
              <option>Flash sale</option>
              <option>New arrival</option>
              <option>Store launch</option>
              <option>Seasonal offer</option>
              <option>Brand awareness</option>
              <option>Product demo</option>
            </Select>
          </Field>
          <Field label="Target region" required>
            <Select
              value={form.targetRegion}
              onChange={(e) => set("targetRegion", e.target.value)}
            >
              <option value="">All regions (Ghana + Nigeria)</option>
              <option>Ghana only</option>
              <option>Nigeria only</option>
              <option>Greater Accra</option>
              <option>Ashanti Region</option>
              <option>Lagos</option>
              <option>FCT — Abuja</option>
            </Select>
          </Field>
          <Field label="Target audience">
            <Select>
              <option>All users</option>
              <option>18–24 (Young adults)</option>
              <option>25–34 (Millennials)</option>
              <option>35–44 (Adults)</option>
              <option>Business buyers (B2B)</option>
            </Select>
          </Field>
          <Field label="Promotion start date">
            <Input
              type="date"
              value={form.startDate}
              onChange={(e) => set("startDate", e.target.value)}
            />
          </Field>
          <Field label="Promotion end date">
            <Input
              type="date"
              value={form.endDate}
              onChange={(e) => set("endDate", e.target.value)}
            />
          </Field>
          <Field
            label="Promotion budget (optional)"
            hint="How much are you willing to spend?"
          >
            <div className="flex gap-2">
              <Select className="w-20 sm:w-24 flex-shrink-0">
                <option>GHS</option>
                <option>NGN</option>
              </Select>
              <Input
                type="number"
                placeholder="500"
                value={form.budget}
                onChange={(e) => set("budget", e.target.value)}
              />
            </div>
          </Field>
          <Field label="Promotion package">
            <Select>
              <option>Free — Platform feature (limited)</option>
              <option>Basic — GHS 200/week</option>
              <option>Standard — GHS 500/week</option>
              <option>Premium — GHS 1,200/week (homepage)</option>
            </Select>
          </Field>
        </div>
      </SectionCard>

      {/* ── Contact ── */}
      <SectionCard
        title="Contact for this campaign"
        description="Who should Smilebaba reach for approval and feedback?"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-5">
          <Field label="Contact name" required>
            <Input
              placeholder="Full name"
              value={form.contactName}
              onChange={(e) => set("contactName", e.target.value)}
            />
          </Field>
          <Field label="Contact phone" required>
            <PhoneInput
              value={form.contactPhone}
              onChange={(v) => set("contactPhone", v)}
            />
          </Field>
          <Field label="Contact email">
            <Input
              type="email"
              placeholder="email@yourstore.com"
              value={form.contactEmail}
              onChange={(e) => set("contactEmail", e.target.value)}
            />
          </Field>
          <Field label="Preferred contact method">
            <Select>
              <option>Phone call</option>
              <option>WhatsApp</option>
              <option>Email</option>
            </Select>
          </Field>
        </div>
      </SectionCard>

      {/* ── Terms & Submit ── */}
      <SectionCard title="Promotion guidelines & agreement">
        <div className="bg-gray-50 rounded-xl p-4 text-xs text-gray-500 space-y-1.5 mb-4 max-h-40 overflow-y-auto leading-relaxed">
          <p className="font-semibold text-gray-700">
            Smilebaba Promotional Video Guidelines
          </p>
          <p>• Video must be clear, well-lit, and professional in quality.</p>
          <p>
            • Content must be relevant to your store and the products you sell
            on Smilebaba.
          </p>
          <p>• No misleading claims, false pricing, or exaggerated offers.</p>
          <p>• No offensive, discriminatory, or inappropriate content.</p>
          <p>
            • Video must be original and you must own all rights to the content.
          </p>
          <p>
            • No competitor platform names or logos should appear in the video.
          </p>
          <p>• Maximum video length: 3 minutes. Minimum: 15 seconds.</p>
          <p>
            • Smilebaba reserves the right to reject any submission that
            violates these guidelines.
          </p>
          <p>
            • Approved videos may be shared on Smilebaba`s social media
            platforms.
          </p>
          <p>
            • Refunds for paid packages are only available if Smilebaba rejects
            the video before publishing.
          </p>
        </div>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.agree}
            onChange={(e) => set("agree", e.target.checked)}
            className="mt-0.5 accent-yellow-500 flex-shrink-0"
          />
          <span className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            I have read and agree to the Smilebaba Promotional Video Guidelines.
            I confirm all content in my video is original and I own the rights
            to it.
          </span>
        </label>

        <button
          type="button"
          disabled={!form.agree || videos.length === 0 || submitting}
          onClick={handleSubmit}
          className="mt-5 w-full py-3 bg-yellow-500 hover:bg-yellow-600
            disabled:bg-gray-200 disabled:text-gray-400 text-white text-sm font-bold
            rounded-xl transition shadow-sm shadow-orange-200 flex items-center justify-center gap-2
            active:scale-[0.99]"
        >
          {submitting ? (
            <>
              <span className="animate-spin inline-block">⏳</span> Submitting
              promotion…
            </>
          ) : (
            <>
              <span>🚀</span> Submit promotion to Smilebaba
            </>
          )}
        </button>
        {videos.length === 0 && (
          <p className="text-xs text-center text-gray-400 mt-2">
            Upload at least one video to submit
          </p>
        )}
      </SectionCard>
    </div>
  );
}
