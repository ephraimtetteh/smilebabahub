"use client";

// src/app/promote/page.tsx — promotional video campaign submission page
//
// Vendors and brands upload a 30–90s promo video here. The video gets:
//   • Featured on SmileBaba TV between live shows
//   • Played on SmileBaba Radio with audio + voiceover
//   • Posted to social media (Facebook, Instagram, TikTok, YouTube)
//
// Submission flow:
//   1. User must be authenticated (page redirects to /auth/login if not)
//   2. User uploads video to Cloudinary (existing setup, unsigned preset)
//   3. Form POSTs to /auth/promotion which:
//      - Stores the campaign on the user's profile
//      - Emails admin team for review
//      - Returns success message
//   4. Admin reviews and contacts user within 2–3 business days

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Zap,
  Radio,
  Tv2,
  Share2,
  Users,
  TrendingUp,
  CheckCircle2,
  Upload,
  X,
  Loader2,
  ChevronLeft,
  Play,
  Sparkles,
  Calendar,
  MapPin,
  Phone,
  Mail,
  MessageSquare,
  Star,
  AlertCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import axiosInstance from "@/src/lib/api/axios";
import { useAppSelector } from "@/src/app/redux";

// ── Cloudinary config (same as ad upload elsewhere in the app) ──────────────
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;
const VIDEO_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`;

// ── Pricing tiers ──────────────────────────────────────────────────────────
const TIERS = [
  {
    id: "starter",
    name: "Starter",
    price: { GHS: 299, NGN: 25000 },
    badge: null,
    perks: [
      "1 week TV rotation",
      "Radio voiceover ad",
      "Facebook + Instagram posts",
      "Basic analytics report",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    price: { GHS: 799, NGN: 65000 },
    badge: "Most Popular",
    perks: [
      "2 weeks TV rotation",
      "Radio + voiceover ad",
      "All social platforms",
      "Featured on homepage",
      "Boosted ad listing",
      "Detailed analytics",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: { GHS: 1999, NGN: 165000 },
    badge: "Best Value",
    perks: [
      "1 month TV rotation",
      "Daily radio plays",
      "All social + paid ads",
      "Homepage banner takeover",
      "Verified vendor badge",
      "Dedicated campaign manager",
      "Custom analytics dashboard",
    ],
  },
];

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

// ── Component ──────────────────────────────────────────────────────────────
export default function PromotePage() {
  const router = useRouter();
  const user = useAppSelector((s) => s.auth?.user);
  const isAuthed = useAppSelector((s) => s.auth?.isAuthenticated);
  const country = user?.country ?? "Ghana";
  const currency = country === "Nigeria" ? "NGN" : "GHS";
  const sym = currency === "NGN" ? "₦" : "₵";

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedTier, setSelectedTier] = useState("growth");

  // Form state
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "marketplace",
    promotionType: PROMO_TYPES[0],
    targetRegion: "",
    targetAudience: AUDIENCES[0],
    startDate: "",
    endDate: "",
    budget: "",
    contactName: user?.username ?? "",
    contactPhone: user?.phone ?? "",
    contactEmail: user?.email ?? "",
    preferredContact: "email" as "email" | "phone" | "whatsapp",
  });

  // Video upload state
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [videoName, setVideoName] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [uploadProg, setUploadProg] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync user data into form
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

  // Auth check
  if (!isAuthed) {
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
            You need a SmileBaba account to submit a promotional campaign.
          </p>
          <Link
            href={`/auth/login?redirect=/promote`}
            className="block w-full py-3 bg-yellow-400 hover:bg-yellow-300
              text-black font-black rounded-xl transition"
          >
            Sign in to continue
          </Link>
          <Link
            href="/"
            className="block mt-3 text-xs text-gray-400 hover:text-gray-600"
          >
            ← Back to home
          </Link>
        </div>
      </main>
    );
  }

  // Submitted screen
  if (submitted) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div
          className="bg-white rounded-2xl p-8 max-w-md w-full text-center
          border border-gray-100 shadow-sm"
        >
          <div
            className="w-16 h-16 bg-green-100 rounded-full flex items-center
            justify-center mx-auto mb-4"
          >
            <CheckCircle2 size={32} className="text-green-600" />
          </div>
          <h2 className="text-xl font-black text-gray-900 mb-2">
            Submission received! 🎉
          </h2>
          <p className="text-sm text-gray-500 mb-5 leading-relaxed">
            Our team will review your campaign and contact you within
            <strong className="text-gray-700"> 2–3 business days </strong>
            at <strong className="text-gray-700">{form.contactEmail}</strong>.
          </p>
          <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-3 mb-5 text-left">
            <p className="text-[11px] font-bold text-yellow-700 mb-1">
              What happens next?
            </p>
            <ul className="text-[11px] text-yellow-700 space-y-1">
              <li>✓ Quality review of your video</li>
              <li>✓ Custom rate quote for your reach</li>
              <li>✓ Schedule confirmation + payment link</li>
              <li>✓ Campaign goes live within 48 hours of payment</li>
            </ul>
          </div>
          <Link
            href="/"
            className="block w-full py-3 bg-gray-900 text-white
            font-black rounded-xl hover:bg-gray-800 transition"
          >
            Back to home
          </Link>
        </div>
      </main>
    );
  }

  // ── Video upload handler ─────────────────────────────────────────────────
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
    } catch (err) {
      console.error(err);
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

  // ── Submit ───────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!videoUrl) {
      toast.error("Please upload your promo video first.");
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
      const tier = TIERS.find((t) => t.id === selectedTier);
      const budget = tier?.price[currency as "GHS" | "NGN"] ?? 0;

      await axiosInstance.post("/auth/promotion", {
        ...form,
        videoUrl,
        videoName,
        budget,
        currency,
        tier: selectedTier,
      });

      setSubmitted(true);
    } catch (err: any) {
      console.error(err);
      toast.error(
        err?.response?.data?.message ?? "Submission failed. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const updateForm = (key: keyof typeof form, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const regions = country === "Nigeria" ? REGIONS_NIGERIA : REGIONS_GHANA;
  const selectedTierObj = TIERS.find((t) => t.id === selectedTier);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-600 via-red-600 to-pink-700 text-white">
        <div className="max-w-[1340px] mx-auto px-3 sm:px-4 py-10 sm:py-14">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-xs text-white/70
            hover:text-white mb-4 font-medium"
          >
            <ChevronLeft size={14} /> Back to home
          </Link>

          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <span
                className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur
                border border-white/20 text-yellow-200 text-xs font-bold
                px-3 py-1 rounded-full mb-4"
              >
                <Sparkles size={11} /> Promote your business
              </span>

              <h1 className="text-3xl sm:text-5xl font-black leading-tight mb-3">
                Get your brand in front of{" "}
                <span className="text-yellow-300">thousands</span> across Africa
              </h1>

              <p className="text-white/80 text-sm sm:text-base leading-relaxed max-w-xl mb-5">
                Upload your promo video and get featured across SmileBaba Radio,
                Smile Time Africa TV, and our social media channels — all in one
                plan.
              </p>

              <div className="flex flex-wrap gap-2">
                {[
                  { icon: <Tv2 size={11} />, label: "Live TV" },
                  { icon: <Radio size={11} />, label: "Radio Ads" },
                  { icon: <Share2 size={11} />, label: "Social Media" },
                  { icon: <Users size={11} />, label: "2,400+ businesses" },
                ].map((t) => (
                  <span
                    key={t.label}
                    className="inline-flex items-center gap-1.5
                    bg-white/10 backdrop-blur text-white text-[11px] font-bold
                    px-2.5 py-1 rounded-full"
                  >
                    {t.icon} {t.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Hero stats card */}
            <div
              className="bg-white/10 backdrop-blur border border-white/20 rounded-3xl p-6
              hidden lg:block"
            >
              <p className="text-xs text-yellow-200 font-bold tracking-wider mb-4">
                ★ REAL RESULTS
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: "2.4M+", label: "Monthly views", icon: "👀" },
                  { value: "180K+", label: "Active listeners", icon: "🎧" },
                  { value: "65%", label: "Engagement rate", icon: "📈" },
                  { value: "48hr", label: "Avg go-live time", icon: "⚡" },
                ].map((s) => (
                  <div key={s.label} className="bg-white/10 rounded-2xl p-4">
                    <p className="text-3xl mb-1">{s.icon}</p>
                    <p className="text-2xl font-black text-yellow-300">
                      {s.value}
                    </p>
                    <p className="text-[10px] text-white/70 mt-0.5">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Step indicator */}
      <section className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-[1340px] mx-auto px-3 sm:px-4 py-4">
          <div className="flex items-center justify-center gap-2 sm:gap-4">
            {(
              [
                { step: 1, label: "Choose plan", emoji: "💎" },
                { step: 2, label: "Upload video", emoji: "🎥" },
                { step: 3, label: "Submit", emoji: "🚀" },
              ] as const
            ).map((s, i) => (
              <div key={s.step} className="flex items-center gap-2 sm:gap-4">
                <button
                  onClick={() => setStep(s.step)}
                  className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full
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
                  <span className="sm:hidden">Step {s.step}</span>
                </button>
                {i < 2 && <div className="w-4 sm:w-12 h-px bg-gray-200" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-[1340px] mx-auto px-3 sm:px-4 py-6 sm:py-10">
        {/* ── STEP 1: PLAN PICKER ── */}
        {step === 1 && (
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-1">
              Choose your reach
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              All plans include video editing review and a campaign manager.
            </p>

            <div className="grid md:grid-cols-3 gap-4">
              {TIERS.map((tier) => {
                const isSelected = tier.id === selectedTier;
                return (
                  <button
                    key={tier.id}
                    onClick={() => setSelectedTier(tier.id)}
                    className={`relative text-left bg-white rounded-2xl p-6
                      border-2 transition group
                      ${
                        isSelected
                          ? "border-yellow-400 shadow-xl scale-[1.02]"
                          : "border-gray-100 hover:border-yellow-200 hover:shadow-md"
                      }`}
                  >
                    {tier.badge && (
                      <span
                        className="absolute -top-2 right-4 bg-yellow-400 text-black
                        text-[10px] font-black px-2 py-0.5 rounded-full"
                      >
                        {tier.badge}
                      </span>
                    )}

                    <h3 className="text-lg font-black text-gray-900 mb-1">
                      {tier.name}
                    </h3>
                    <p className="text-3xl font-black text-gray-900 mb-3">
                      {sym}
                      {tier.price[currency as "GHS" | "NGN"].toLocaleString()}
                      <span className="text-xs font-medium text-gray-400">
                        /campaign
                      </span>
                    </p>

                    <ul className="space-y-2 text-xs text-gray-600 mb-4">
                      {tier.perks.map((perk) => (
                        <li key={perk} className="flex items-start gap-1.5">
                          <CheckCircle2
                            size={13}
                            className={`flex-shrink-0 mt-0.5 ${isSelected ? "text-yellow-500" : "text-green-500"}`}
                          />
                          {perk}
                        </li>
                      ))}
                    </ul>

                    <div
                      className={`w-full py-2.5 rounded-xl text-xs font-black text-center
                      transition
                      ${
                        isSelected
                          ? "bg-yellow-400 text-black"
                          : "bg-gray-100 text-gray-600 group-hover:bg-yellow-100"
                      }`}
                    >
                      {isSelected ? "✓ Selected" : "Choose this plan"}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setStep(2)}
                className="bg-gray-900 hover:bg-gray-800 text-yellow-400 font-black
                  px-6 py-3 rounded-2xl text-sm transition flex items-center gap-2"
              >
                Continue → Upload video
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2: UPLOAD VIDEO ── */}
        {step === 2 && (
          <div className="grid lg:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-1">
                Upload your promo video
              </h2>
              <p className="text-sm text-gray-500 mb-5">
                30–90 seconds works best. Max 100 MB. MP4, MOV, or WebM.
              </p>

              {/* Upload zone */}
              {!videoFile ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-200 rounded-2xl
                    p-12 text-center bg-white hover:border-yellow-400 hover:bg-yellow-50
                    cursor-pointer transition"
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
                <div className="bg-white border border-gray-100 rounded-2xl p-5">
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
            </div>

            {/* Tips */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Star size={18} className="text-yellow-500" />
                <h3 className="font-black text-gray-900">
                  Video tips for higher engagement
                </h3>
              </div>
              <ul className="space-y-3 text-xs text-gray-600">
                {[
                  {
                    emoji: "🎬",
                    title: "Hook in 3 seconds",
                    desc: "Start with the most exciting frame to stop the scroll.",
                  },
                  {
                    emoji: "🗣️",
                    title: "Clear voiceover",
                    desc: "Speak slowly. Mention your brand name + offer twice.",
                  },
                  {
                    emoji: "📱",
                    title: "Vertical or square",
                    desc: "9:16 or 1:1 ratios perform best on mobile + social.",
                  },
                  {
                    emoji: "🎯",
                    title: "One clear CTA",
                    desc: "Tell viewers exactly what to do — visit, call, order.",
                  },
                  {
                    emoji: "📞",
                    title: "Show your contact",
                    desc: "Phone or location on screen for the last 5 seconds.",
                  },
                ].map((tip) => (
                  <li key={tip.title} className="flex items-start gap-3">
                    <span className="text-2xl flex-shrink-0">{tip.emoji}</span>
                    <div>
                      <p className="font-bold text-gray-900 text-xs">
                        {tip.title}
                      </p>
                      <p className="text-gray-500">{tip.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-2 flex justify-between mt-2">
              <button
                onClick={() => setStep(1)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold
                  px-6 py-3 rounded-2xl text-sm transition"
              >
                ← Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!videoUrl}
                className="bg-gray-900 hover:bg-gray-800 text-yellow-400 font-black
                  px-6 py-3 rounded-2xl text-sm transition flex items-center gap-2
                  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue → Details
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: SUBMIT ── */}
        {step === 3 && (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-5">
              <div className="bg-white border border-gray-100 rounded-2xl p-6">
                <h3 className="font-black text-gray-900 mb-4 flex items-center gap-2">
                  <Sparkles size={16} className="text-yellow-500" />
                  Campaign details
                </h3>

                <div className="space-y-4">
                  <Field label="Campaign title" required>
                    <input
                      type="text"
                      value={form.title}
                      onChange={(e) => updateForm("title", e.target.value)}
                      placeholder="e.g. Mama's Kitchen Summer Special"
                      className={fieldCls}
                    />
                  </Field>

                  <Field label="Description">
                    <textarea
                      value={form.description}
                      onChange={(e) =>
                        updateForm("description", e.target.value)
                      }
                      placeholder="What's this promo about? Any specific dates or offers?"
                      rows={3}
                      className={fieldCls}
                    />
                  </Field>

                  <div className="grid sm:grid-cols-2 gap-4">
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
                        onChange={(e) =>
                          updateForm("startDate", e.target.value)
                        }
                        min={new Date().toISOString().split("T")[0]}
                        className={fieldCls}
                      />
                    </Field>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-100 rounded-2xl p-6">
                <h3 className="font-black text-gray-900 mb-4 flex items-center gap-2">
                  <Phone size={16} className="text-yellow-500" />
                  Contact information
                </h3>

                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Your name" required>
                    <input
                      type="text"
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
                  <Field label="Preferred contact method">
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
            </div>

            {/* Summary sidebar */}
            <div className="lg:sticky lg:top-24 lg:self-start space-y-4">
              <div className="bg-gradient-to-br from-yellow-400 to-amber-500 rounded-2xl p-6 text-black">
                <p className="text-[10px] font-black tracking-wider mb-1">
                  YOUR PLAN
                </p>
                <p className="text-xl font-black mb-1">
                  {selectedTierObj?.name}
                </p>
                <p className="text-3xl font-black mb-4">
                  {sym}
                  {selectedTierObj?.price[
                    currency as "GHS" | "NGN"
                  ].toLocaleString()}
                </p>
                <button
                  onClick={() => setStep(1)}
                  className="text-xs font-bold underline hover:no-underline"
                >
                  Change plan
                </button>
              </div>

              <div className="bg-white border border-gray-100 rounded-2xl p-5">
                <p className="text-[10px] font-black text-gray-400 tracking-wider mb-2">
                  WHAT'S INCLUDED
                </p>
                <ul className="space-y-2 text-xs text-gray-700">
                  {selectedTierObj?.perks.map((perk) => (
                    <li key={perk} className="flex items-start gap-1.5">
                      <CheckCircle2
                        size={13}
                        className="text-green-500 flex-shrink-0 mt-0.5"
                      />
                      {perk}
                    </li>
                  ))}
                </ul>
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
                  payment link within 2–3 business days.
                </p>
              </div>

              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full bg-gray-900 hover:bg-gray-800 text-yellow-400
                  font-black py-4 rounded-2xl text-sm transition
                  flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Submitting…
                  </>
                ) : (
                  <>
                    <Zap size={16} /> Submit campaign
                  </>
                )}
              </button>

              <button
                onClick={() => setStep(2)}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700
                  font-bold py-3 rounded-2xl text-xs transition"
              >
                ← Back to video
              </button>
            </div>
          </div>
        )}
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
