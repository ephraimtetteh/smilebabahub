"use client";
// Vendor Settings → Promotion tab
// Uploads video to Cloudinary then submits campaign details via
// POST /auth/promotion — backend stores and notifies admin via email.

import { useRef, useState } from "react";
import {
  SectionCard,
  Field,
  Input,
  Select,
  Textarea,
  PhoneInput,
  SaveButton,
} from "../(components)/UI";
import axiosInstance from "@/src/lib/api/axios";
import { toast } from "react-toastify";
import { CheckCircle2 } from "lucide-react";
import { useVendorSettings } from "@/src/hooks/useVendorSettings";
import { formatBytes, VideoFile } from "../settings.types";

const INITIAL_FORM = {
  title: "",
  description: "",
  category: "",
  budget: "",
  currency: "GHS",
  targetRegion: "",
  startDate: "",
  endDate: "",
  contactName: "",
  contactPhone: "",
  contactEmail: "",
  promotionType: "flash_sale",
  targetAudience: "all",
  preferredContact: "phone",
  agree: false,
};

export default function PromotionTab() {
  const { user, country } = useVendorSettings();
  const videoRef = useRef<HTMLInputElement>(null);
  const [videos, setVideos] = useState<VideoFile[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    ...INITIAL_FORM,
    currency: country === "Nigeria" ? "NGN" : "GHS",
    contactName: user?.username ?? "",
    contactEmail: user?.email ?? "",
    contactPhone: user?.phone ?? "",
    targetRegion: country === "Nigeria" ? "Nigeria only" : "Ghana only",
  });

  const set = (k: keyof typeof form, v: string | boolean) =>
    setForm((p) => ({ ...p, [k]: v }));

  const addVideo = (file: File) => {
    if (!file.type.startsWith("video/")) {
      toast.error("Please upload a video file (MP4, MOV, WEBM)");
      return;
    }
    if (file.size > 500 * 1024 * 1024) {
      toast.error("Video must be under 500MB");
      return;
    }
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

  const handleSubmit = async () => {
    if (!form.agree) {
      toast.error("Please agree to the guidelines");
      return;
    }
    if (!videos.length) {
      toast.error("Please upload at least one video");
      return;
    }
    if (!form.title.trim()) {
      toast.error("Please enter a campaign title");
      return;
    }
    if (!form.contactName) {
      toast.error("Please enter contact name");
      return;
    }

    setSubmitting(true);
    try {
      // Upload video to Cloudinary (video preset)
      const videoFormData = new FormData();
      videoFormData.append("file", videos[0].file);
      videoFormData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? "smilebaba_ads",
      );
      videoFormData.append("resource_type", "video");

      const cloudRes = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload`,
        { method: "POST", body: videoFormData },
      );
      const cloudData = await cloudRes.json();
      if (!cloudData.secure_url) throw new Error("Video upload failed");

      // Submit promotion request to backend
      await axiosInstance.post("/auth/promotion", {
        ...form,
        videoUrl: cloudData.secure_url,
        videoName: videos[0].name,
      });

      setSubmitted(true);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ??
          err?.message ??
          "Submission failed. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-5">
          <CheckCircle2 size={40} className="text-green-600" />
        </div>
        <h3 className="text-xl font-black text-gray-900 mb-2">
          Promotion submitted!
        </h3>
        <p className="text-sm text-gray-500 max-w-sm leading-relaxed">
          Your video and campaign details have been sent to the SmileBaba team.
          We'll review and get back to you within 2–3 business days.
        </p>
        <button
          type="button"
          onClick={() => {
            setSubmitted(false);
            setVideos([]);
            setForm({ ...INITIAL_FORM });
          }}
          className="mt-6 px-6 py-2.5 bg-[#ffc105] text-black text-sm font-black
            rounded-xl hover:bg-yellow-300 transition active:scale-95"
        >
          Submit another
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Hero */}
      <div
        className="relative rounded-2xl overflow-hidden mb-5 bg-gradient-to-r
        from-[#ffc105] to-amber-400 p-5 text-black"
      >
        <div className="relative z-10">
          <p className="text-xs font-bold uppercase tracking-wider opacity-70 mb-1">
            🎬 SmileBaba Promotion Hub
          </p>
          <h2 className="text-lg font-black mb-2">
            Reach thousands of buyers across Ghana & Nigeria
          </h2>
          <p className="text-sm opacity-80 max-w-lg leading-relaxed">
            Submit your promotional video and SmileBaba will feature it on the
            platform, social media, and partner channels.
          </p>
          <div className="flex gap-6 mt-4">
            {[
              ["500K+", "Monthly users"],
              ["2 countries", "Ghana & Nigeria"],
              ["48h", "Review turnaround"],
            ].map(([v, l]) => (
              <div key={l}>
                <p className="text-lg font-black">{v}</p>
                <p className="text-xs opacity-70">{l}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute right-4 top-4 text-7xl opacity-10 pointer-events-none">
          📹
        </div>
      </div>

      {/* Video upload */}
      <SectionCard
        title="Upload promotional video"
        description="MP4, MOV or WEBM · Max 500MB · 15 seconds to 3 minutes"
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
            p-8 text-center
            ${
              dragOver
                ? "border-[#ffc105] bg-[#ffc105]/5 scale-[1.01]"
                : "border-gray-200 bg-gray-50 hover:border-[#ffc105] hover:bg-[#ffc105]/5"
            }`}
        >
          <div className="text-5xl mb-3">{dragOver ? "📥" : "🎬"}</div>
          <p className="text-sm font-bold text-gray-700">
            Drag & drop your video here
          </p>
          <p className="text-xs text-gray-400 mt-1">or click to browse</p>
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
                  className="w-16 h-12 rounded-lg object-cover bg-gray-200 flex-shrink-0"
                  muted
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-700 truncate">
                    {v.name}
                  </p>
                  <p className="text-xs text-gray-400">{v.size}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-green-100 text-green-600 font-bold px-2 py-0.5 rounded-full">
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

      {/* Campaign details */}
      <SectionCard
        title="Campaign details"
        description="Tell us about your promotion"
      >
        <Field label="Campaign title" required>
          <Input
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="e.g. Big Electronics Sale — 30% off this week!"
          />
        </Field>
        <Field
          label="Description"
          required
          hint="What are you promoting? What offer should viewers take away?"
        >
          <Textarea
            rows={4}
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="Describe your promotion…"
          />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
          <Field label="Category" required>
            <Select
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
            >
              <option value="">Select category</option>
              {[
                "Food & Restaurants",
                "Electronics",
                "Fashion",
                "Vehicles",
                "Apartments",
                "Services",
                "General / Entire Store",
              ].map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Promotion type">
            <Select
              value={form.promotionType}
              onChange={(e) => set("promotionType", e.target.value)}
            >
              <option value="flash_sale">Flash sale</option>
              <option value="new_arrival">New arrival</option>
              <option value="store_launch">Store launch</option>
              <option value="seasonal">Seasonal offer</option>
              <option value="awareness">Brand awareness</option>
              <option value="demo">Product demo</option>
            </Select>
          </Field>
          <Field label="Target region" required>
            <Select
              value={form.targetRegion}
              onChange={(e) => set("targetRegion", e.target.value)}
            >
              <option value="">All regions (Ghana + Nigeria)</option>
              <option value="Ghana only">Ghana only</option>
              <option value="Nigeria only">Nigeria only</option>
              <option value="Greater Accra">Greater Accra</option>
              <option value="Ashanti Region">Ashanti Region</option>
              <option value="Lagos">Lagos</option>
              <option value="FCT — Abuja">FCT — Abuja</option>
            </Select>
          </Field>
          <Field label="Target audience">
            <Select
              value={form.targetAudience}
              onChange={(e) => set("targetAudience", e.target.value)}
            >
              <option value="all">All users</option>
              <option value="18-24">18–24 (Young adults)</option>
              <option value="25-34">25–34 (Millennials)</option>
              <option value="35-44">35–44 (Adults)</option>
              <option value="b2b">Business buyers (B2B)</option>
            </Select>
          </Field>
          <Field label="Start date">
            <Input
              type="date"
              value={form.startDate}
              onChange={(e) => set("startDate", e.target.value)}
            />
          </Field>
          <Field label="End date">
            <Input
              type="date"
              value={form.endDate}
              onChange={(e) => set("endDate", e.target.value)}
            />
          </Field>
          <Field label="Budget (optional)">
            <div className="flex gap-2">
              <Select
                className="w-24 flex-shrink-0"
                value={form.currency}
                onChange={(e) => set("currency", e.target.value)}
              >
                <option value="GHS">GHS ₵</option>
                <option value="NGN">NGN ₦</option>
              </Select>
              <Input
                type="number"
                value={form.budget}
                onChange={(e) => set("budget", e.target.value)}
                placeholder={form.currency === "NGN" ? "50000" : "500"}
              />
            </div>
          </Field>
          <Field label="Promotion package">
            <Select>
              <option>Free — Platform feature (limited)</option>
              <option>
                Basic — {country === "Nigeria" ? "₦10,000" : "₵200"}/week
              </option>
              <option>
                Standard — {country === "Nigeria" ? "₦25,000" : "₵500"}/week
              </option>
              <option>
                Premium — {country === "Nigeria" ? "₦60,000" : "₵1,200"}/week
                (homepage)
              </option>
            </Select>
          </Field>
        </div>
      </SectionCard>

      {/* Contact */}
      <SectionCard title="Contact for this campaign">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
          <Field label="Contact name" required>
            <Input
              value={form.contactName}
              onChange={(e) => set("contactName", e.target.value)}
              placeholder="Full name"
            />
          </Field>
          <Field label="Contact phone" required>
            <PhoneInput
              value={form.contactPhone}
              onChange={(v) => set("contactPhone", v)}
              country={country === "Nigeria" ? "NG" : "GH"}
            />
          </Field>
          <Field label="Contact email">
            <Input
              type="email"
              value={form.contactEmail}
              onChange={(e) => set("contactEmail", e.target.value)}
              placeholder="email@yourstore.com"
            />
          </Field>
          <Field label="Preferred contact method">
            <Select
              value={form.preferredContact}
              onChange={(e) => set("preferredContact", e.target.value)}
            >
              <option value="phone">Phone call</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="email">Email</option>
            </Select>
          </Field>
        </div>
      </SectionCard>

      {/* Terms & submit */}
      <SectionCard title="Guidelines & agreement">
        <div
          className="bg-gray-50 rounded-xl p-4 text-xs text-gray-500 space-y-1.5 mb-4
          max-h-40 overflow-y-auto leading-relaxed"
        >
          <p className="font-bold text-gray-700">
            SmileBaba Promotional Video Guidelines
          </p>
          <p>• Video must be clear, well-lit and professional in quality.</p>
          <p>
            • Content must be relevant to your store and the products you sell.
          </p>
          <p>• No misleading claims, false pricing or exaggerated offers.</p>
          <p>• No offensive, discriminatory or inappropriate content.</p>
          <p>
            • Video must be original — you must own all rights to the content.
          </p>
          <p>• No competitor platform names or logos in the video.</p>
          <p>• Maximum 3 minutes. Minimum 15 seconds.</p>
          <p>• SmileBaba may share approved videos on social media.</p>
          <p>• Refunds only if SmileBaba rejects before publishing.</p>
        </div>

        <label className="flex items-start gap-3 cursor-pointer mb-5">
          <input
            type="checkbox"
            checked={form.agree}
            onChange={(e) => set("agree", e.target.checked)}
            className="mt-0.5 accent-[#ffc105] flex-shrink-0"
          />
          <span className="text-sm text-gray-600 leading-relaxed">
            I have read and agree to the SmileBaba Promotional Video Guidelines.
            I confirm all content is original and I own the rights to it.
          </span>
        </label>

        <SaveButton
          saving={submitting}
          label="Submit promotion to SmileBaba 🚀"
          onClick={handleSubmit}
        />
        {!videos.length && (
          <p className="text-xs text-gray-400 mt-2">
            Upload at least one video to submit
          </p>
        )}
      </SectionCard>
    </div>
  );
}
