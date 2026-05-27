"use client";

// src/app/promote/submit/page.tsx — Promo submission flow
//
// 3-step wizard: Plan → Upload video → Details
// Pre-selects tier from ?tier= query string.
// Submits to POST /promote/submit then redirects to /promote/status/[id].

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Zap,
  Upload,
  X,
  Loader2,
  ChevronLeft,
  Play,
  Sparkles,
  Phone,
  CheckCircle2,
  AlertCircle,
  Star,
} from "lucide-react";
import { toast } from "react-toastify";
import axiosInstance from "@/src/lib/api/axios";
import { useAppSelector } from "@/src/app/redux";
import type { PromoTier, PromoTierDef } from "../components/types";

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;
const VIDEO_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`;

const PROMO_TYPES = [
  "Product launch",
  "Sale / Discount campaign",
  "Brand awareness",
  "Event promotion",
  "Service showcase",
  "Other",
];
const REGIONS_GHANA = [
  "Greater Accra",
  "Ashanti",
  "Western",
  "Eastern",
  "Volta",
  "Central",
  "Northern",
  "Upper East",
  "Upper West",
  "Bono",
  "All Ghana",
];
const REGIONS_NIGERIA = [
  "Lagos",
  "Abuja FCT",
  "Rivers",
  "Kano",
  "Oyo",
  "Ogun",
  "Edo",
  "Delta",
  "Enugu",
  "Kaduna",
  "All Nigeria",
];
const AUDIENCES = [
  "Young adults (18–25)",
  "Adults (26–40)",
  "Families",
  "Professionals",
  "Students",
  "Everyone",
];

export default function SubmitPagePort() {
  // Suspense wrapper so useSearchParams doesn't break static generation
  return (
    <Suspense fallback={<LoadingScreen />}>
      <SubmitForm />
    </Suspense>
  );
}

function LoadingScreen() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <Loader2 size={32} className="animate-spin text-yellow-500" />
    </main>
  );
}

function SubmitForm() {
  const router = useRouter();
  const params = useSearchParams();
  const user = useAppSelector((s) => s.auth?.user);
  const isAuthed = useAppSelector((s) => s.auth?.isAuthenticated);
  const country = user?.country ?? "Ghana";
  const currency = country === "Nigeria" ? "NGN" : "GHS";
  const sym = currency === "NGN" ? "₦" : "₵";

  const [tiers, setTiers] = useState<PromoTierDef[]>([]);
  const [selectedTier, setSelectedTier] = useState<PromoTier>(
    (params.get("tier") as PromoTier) ?? "growth",
  );
  const [step, setStep] = useState<1 | 2 | 3>(params.get("tier") ? 2 : 1);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "marketplace",
    promotionType: PROMO_TYPES[0],
    targetRegion: "",
    targetAudience: AUDIENCES[0],
    startDate: "",
    contactName: "",
    contactPhone: "",
    contactEmail: "",
    preferredContact: "email" as "email" | "phone" | "whatsapp",
  });

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [videoName, setVideoName] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [uploadProg, setUploadProg] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load tiers from backend
  useEffect(() => {
    axiosInstance
      .get(`/promote/pricing?currency=${currency}`)
      .then(({ data }) => setTiers(data.tiers ?? []))
      .catch(() => toast.error("Failed to load pricing"));
  }, [currency]);

  // Sync user data
  useEffect(() => {
    if (user) {
      setForm((f) => ({
        ...f,
        contactName: f.contactName || user.username || "",
        contactPhone: f.contactPhone || user.phone || "",
        contactEmail: f.contactEmail || user.email || "",
      }));
    }
  }, [user]);

  if (!isAuthed) {
    return <AuthGate />;
  }

  const selectedTierObj = tiers.find((t) => t.id === selectedTier);
  const regions = country === "Nigeria" ? REGIONS_NIGERIA : REGIONS_GHANA;
  const updateForm = (key: keyof typeof form, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  // ── Video upload ───────────────────────────────────────────────────────
  const handleVideoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("video/")) {
      toast.error("Please upload a video file.");
      return;
    }
    if (file.size > 100 * 1024 * 1024) {
      toast.error("Video must be under 100 MB.");
      return;
    }

    setVideoFile(file);
    setVideoName(file.name);
    setUploading(true);
    setUploadProg(0);

    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("upload_preset", UPLOAD_PRESET);
      fd.append("folder", "smilebaba/promotions");

      const xhr = new XMLHttpRequest();
      xhr.open("POST", VIDEO_UPLOAD_URL);
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable)
          setUploadProg(Math.round((e.loaded / e.total) * 100));
      };
      const result = await new Promise<any>((resolve, reject) => {
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300)
            resolve(JSON.parse(xhr.responseText));
          else reject(new Error("Upload failed"));
        };
        xhr.onerror = () => reject(new Error("Network error"));
        xhr.send(fd);
      });

      setVideoUrl(result.secure_url);
      toast.success("Video uploaded successfully!");
    } catch {
      toast.error("Video upload failed. Please try again.");
      setVideoFile(null);
    } finally {
      setUploading(false);
    }
  };

  const removeVideo = () => {
    setVideoFile(null);
    setVideoName("");
    setVideoUrl("");
    setUploadProg(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ── Submit ─────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!videoUrl) {
      toast.error("Please upload your promo video first.");
      setStep(2);
      return;
    }
    if (
      !form.title ||
      !form.contactName ||
      !form.contactEmail ||
      !form.contactPhone
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await axiosInstance.post("/promote/submit", {
        ...form,
        videoUrl,
        videoName,
        tier: selectedTier,
      });
      toast.success("Campaign submitted!");
      router.replace(`/promote/status/${data.promotion._id}`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Step indicator */}
      <section className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <Link
            href="/promote"
            className="inline-flex items-center gap-1 text-xs text-gray-500
              hover:text-gray-900 mb-2 sm:mb-3"
          >
            <ChevronLeft size={13} /> Back
          </Link>

          <div className="flex items-center justify-center gap-2 sm:gap-4">
            {(
              [
                { step: 1, label: "Plan", emoji: "💎" },
                { step: 2, label: "Video", emoji: "🎥" },
                { step: 3, label: "Submit", emoji: "🚀" },
              ] as const
            ).map((s, i) => (
              <div key={s.step} className="flex items-center gap-2 sm:gap-4">
                <button
                  onClick={() => setStep(s.step)}
                  className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full
                    text-xs font-bold transition
                    ${
                      step === s.step
                        ? "bg-gray-900 text-yellow-400"
                        : step > s.step
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                    }`}
                >
                  <span className="text-base">
                    {step > s.step ? "✓" : s.emoji}
                  </span>
                  <span className="hidden sm:inline">{s.label}</span>
                </button>
                {i < 2 && <div className="w-3 sm:w-12 h-px bg-gray-200" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-3 sm:px-4 py-6 sm:py-10">
        {/* ── STEP 1: PLAN PICKER ── */}
        {step === 1 && (
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-1">
              Choose your reach
            </h2>
            <p className="text-sm text-gray-500 mb-5">
              All plans include video review and campaign management.
            </p>

            <div className="space-y-3">
              {tiers.map((tier) => {
                const isSelected = tier.id === selectedTier;
                return (
                  <button
                    key={tier.id}
                    onClick={() => setSelectedTier(tier.id)}
                    className={`block w-full text-left bg-white rounded-2xl p-5
                      border-2 transition
                      ${
                        isSelected
                          ? "border-yellow-400 shadow-lg"
                          : "border-gray-100 hover:border-yellow-200"
                      }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-base font-black text-gray-900">
                            {tier.label}
                          </h3>
                          {tier.badge && (
                            <span
                              className="bg-yellow-400 text-black text-[9px]
                              font-black px-2 py-0.5 rounded"
                            >
                              {tier.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-2xl font-black text-gray-900">
                          {sym}
                          {tier.price.toLocaleString()}
                          <span className="text-[10px] font-medium text-gray-400 ml-1">
                            / {tier.days} days
                          </span>
                        </p>
                      </div>
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex-shrink-0
                        flex items-center justify-center
                        ${isSelected ? "border-yellow-400 bg-yellow-400" : "border-gray-300"}`}
                      >
                        {isSelected && (
                          <CheckCircle2 size={12} className="text-white" />
                        )}
                      </div>
                    </div>

                    <ul className="grid sm:grid-cols-2 gap-1 text-xs text-gray-600">
                      {tier.perks.map((perk) => (
                        <li key={perk} className="flex items-start gap-1.5">
                          <CheckCircle2
                            size={12}
                            className="text-green-500 flex-shrink-0 mt-0.5"
                          />
                          {perk}
                        </li>
                      ))}
                    </ul>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setStep(2)}
              className="mt-6 w-full bg-gray-900 hover:bg-gray-800 text-yellow-400
                font-black py-3 rounded-2xl text-sm transition
                flex items-center justify-center gap-2"
            >
              Continue → Upload video
            </button>
          </div>
        )}

        {/* ── STEP 2: UPLOAD ── */}
        {step === 2 && (
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-1">
              Upload your promo video
            </h2>
            <p className="text-sm text-gray-500 mb-5">
              30-90 seconds works best. Max 100 MB. MP4, MOV, or WebM.
            </p>

            {!videoFile ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-200 rounded-2xl
                  p-10 sm:p-14 text-center bg-white hover:border-yellow-400
                  hover:bg-yellow-50 cursor-pointer transition"
              >
                <div
                  className="w-14 h-14 mx-auto bg-yellow-100 rounded-full
                  flex items-center justify-center mb-3"
                >
                  <Upload size={22} className="text-yellow-600" />
                </div>
                <p className="text-sm font-bold text-gray-900 mb-1">
                  Click to upload your video
                </p>
                <p className="text-xs text-gray-400">
                  MP4, MOV, WebM up to 100 MB
                </p>
              </div>
            ) : (
              <div className="bg-white border border-gray-100 rounded-2xl p-4">
                {videoUrl ? (
                  <video
                    src={videoUrl}
                    controls
                    className="w-full rounded-xl bg-black aspect-video mb-3"
                  />
                ) : (
                  <div
                    className="aspect-video bg-gray-100 rounded-xl flex items-center
                    justify-center mb-3"
                  >
                    <Loader2
                      size={28}
                      className="text-yellow-500 animate-spin"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <Play size={14} className="text-gray-400 flex-shrink-0" />
                    <p className="text-xs text-gray-700 truncate">
                      {videoName}
                    </p>
                  </div>
                  <button
                    onClick={removeVideo}
                    className="w-7 h-7 bg-gray-100 hover:bg-red-100
                      text-gray-500 hover:text-red-500 rounded-full
                      flex items-center justify-center transition flex-shrink-0"
                  >
                    <X size={13} />
                  </button>
                </div>

                {uploading && (
                  <div className="mt-3">
                    <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-400 transition-all"
                        style={{ width: `${uploadProg}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-gray-500 mt-1.5">
                      Uploading… {uploadProg}%
                    </p>
                  </div>
                )}
                {videoUrl && (
                  <div className="mt-3 flex items-center gap-1.5 text-[11px] text-green-600 font-bold">
                    <CheckCircle2 size={12} /> Upload complete
                  </div>
                )}
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleVideoSelect}
              className="hidden"
            />

            {/* Tips */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 mt-4">
              <div className="flex items-center gap-2 mb-3">
                <Star size={16} className="text-yellow-500" />
                <h3 className="font-black text-gray-900 text-sm">
                  Tips for better results
                </h3>
              </div>
              <ul className="space-y-2.5 text-xs text-gray-600">
                {[
                  {
                    emoji: "🎬",
                    text: "Start with the most exciting frame to stop scrolling.",
                  },
                  { emoji: "🗣️", text: "Mention your brand + offer twice." },
                  {
                    emoji: "📱",
                    text: "9:16 or 1:1 ratios perform best on social.",
                  },
                  { emoji: "🎯", text: "End with a clear call-to-action." },
                ].map((tip, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-base flex-shrink-0">{tip.emoji}</span>
                    <p>{tip.text}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setStep(1)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold
                  px-5 py-3 rounded-2xl text-sm transition"
              >
                ← Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!videoUrl}
                className="flex-1 bg-gray-900 hover:bg-gray-800 text-yellow-400 font-black
                  px-5 py-3 rounded-2xl text-sm transition disabled:opacity-50
                  disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                Continue → Details
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: DETAILS ── */}
        {step === 3 && (
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-1">
              Campaign details
            </h2>
            <p className="text-sm text-gray-500 mb-5">
              Tell us about your campaign — our team uses this to optimize
              placement.
            </p>

            <div className="space-y-4">
              {/* Selected plan summary */}
              {selectedTierObj && (
                <div
                  className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4
                  flex items-center justify-between"
                >
                  <div>
                    <p className="text-[10px] font-black text-yellow-700 tracking-wider">
                      YOUR PLAN
                    </p>
                    <p className="text-base font-black text-gray-900">
                      {selectedTierObj.label} — {sym}
                      {selectedTierObj.price.toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => setStep(1)}
                    className="text-xs font-bold text-yellow-700 underline"
                  >
                    Change
                  </button>
                </div>
              )}

              <div className="bg-white border border-gray-100 rounded-2xl p-5 space-y-4">
                <h3 className="font-black text-gray-900 text-sm flex items-center gap-2">
                  <Sparkles size={14} className="text-yellow-500" /> Campaign
                  details
                </h3>

                <Field label="Campaign title" required>
                  <input
                    value={form.title}
                    onChange={(e) => updateForm("title", e.target.value)}
                    placeholder="e.g. Mama's Kitchen Summer Special"
                    className={fieldCls}
                  />
                </Field>

                <Field label="Description">
                  <textarea
                    value={form.description}
                    onChange={(e) => updateForm("description", e.target.value)}
                    placeholder="What's this promo about?"
                    rows={3}
                    className={fieldCls}
                  />
                </Field>

                <div className="grid sm:grid-cols-2 gap-3">
                  <Field label="Promo type">
                    <select
                      value={form.promotionType}
                      onChange={(e) =>
                        updateForm("promotionType", e.target.value)
                      }
                      className={fieldCls}
                    >
                      {PROMO_TYPES.map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Target region">
                    <select
                      value={form.targetRegion}
                      onChange={(e) =>
                        updateForm("targetRegion", e.target.value)
                      }
                      className={fieldCls}
                    >
                      <option value="">Select region</option>
                      {regions.map((r) => (
                        <option key={r}>{r}</option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Target audience">
                    <select
                      value={form.targetAudience}
                      onChange={(e) =>
                        updateForm("targetAudience", e.target.value)
                      }
                      className={fieldCls}
                    >
                      {AUDIENCES.map((a) => (
                        <option key={a}>{a}</option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Preferred start date">
                    <input
                      type="date"
                      value={form.startDate}
                      onChange={(e) => updateForm("startDate", e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      className={fieldCls}
                    />
                  </Field>
                </div>
              </div>

              <div className="bg-white border border-gray-100 rounded-2xl p-5 space-y-4">
                <h3 className="font-black text-gray-900 text-sm flex items-center gap-2">
                  <Phone size={14} className="text-yellow-500" /> Contact info
                </h3>

                <div className="grid sm:grid-cols-2 gap-3">
                  <Field label="Your name" required>
                    <input
                      value={form.contactName}
                      onChange={(e) =>
                        updateForm("contactName", e.target.value)
                      }
                      className={fieldCls}
                    />
                  </Field>
                  <Field label="Phone" required>
                    <input
                      type="tel"
                      value={form.contactPhone}
                      onChange={(e) =>
                        updateForm("contactPhone", e.target.value)
                      }
                      placeholder="+233 20 123 4567"
                      className={fieldCls}
                    />
                  </Field>
                  <Field label="Email" required>
                    <input
                      type="email"
                      value={form.contactEmail}
                      onChange={(e) =>
                        updateForm("contactEmail", e.target.value)
                      }
                      className={fieldCls}
                    />
                  </Field>
                  <Field label="Preferred contact">
                    <select
                      value={form.preferredContact}
                      onChange={(e) =>
                        updateForm("preferredContact", e.target.value)
                      }
                      className={fieldCls}
                    >
                      <option value="email">Email</option>
                      <option value="phone">Phone call</option>
                      <option value="whatsapp">WhatsApp</option>
                    </select>
                  </Field>
                </div>
              </div>

              <div
                className="bg-blue-50 border border-blue-100 rounded-2xl p-4
                flex items-start gap-2"
              >
                <AlertCircle
                  size={14}
                  className="text-blue-600 flex-shrink-0 mt-0.5"
                />
                <p className="text-[11px] text-blue-700 leading-relaxed">
                  No payment now — our team reviews your video and sends a
                  payment link within 2-3 business days.
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setStep(2)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold
                    px-5 py-3 rounded-2xl text-sm transition"
                >
                  ← Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex-1 bg-gray-900 hover:bg-gray-800 text-yellow-400
                    font-black py-3 rounded-2xl text-sm transition
                    flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" /> Submitting…
                    </>
                  ) : (
                    <>
                      <Zap size={14} /> Submit campaign
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

// ─── auth gate ──────────────────────────────────────────────────────────────
function AuthGate() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div
        className="bg-white rounded-2xl p-8 max-w-sm w-full text-center
        border border-gray-100 shadow-sm"
      >
        <div
          className="w-14 h-14 bg-yellow-100 rounded-full flex items-center
          justify-center mx-auto mb-4"
        >
          <Sparkles size={24} className="text-yellow-600" />
        </div>
        <h2 className="text-lg font-black text-gray-900 mb-2">
          Sign in to promote
        </h2>
        <p className="text-sm text-gray-500 mb-5">
          You need a SmileBaba account to submit a campaign.
        </p>
        <Link
          href="/auth/login?redirect=/promote/submit"
          className="block w-full py-3 bg-yellow-400 hover:bg-yellow-300
            text-black font-black rounded-xl transition"
        >
          Sign in to continue
        </Link>
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
