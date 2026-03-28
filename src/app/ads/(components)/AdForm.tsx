"use client";

// src/components/ads/AdForm.tsx
import React, { useState, useCallback, useEffect, useRef, memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";
import { Camera, Globe, Home, Wrench, Sparkles, ImageOff } from "lucide-react";
import { AdFormData, EMPTY_AD_FORM } from "@/src/types/adForm.types";
import {
  AdCondition,
  Negotiable,
  DeliveryOption,
  AdCurrency,
  AdImage,
} from "@/src/types/ad.types";
import { useAppSelector } from "@/src/app/redux";
import { uploadManyToCloudinary } from "@/src/utils/uploadToCloudinary";


// ── Constants ──────────────────────────────────────────────────────────────
const STEPS = [
  "Basic info",
  "Photos",
  "Pricing & Delivery",
  "Location & Contact",
];

const MAIN_CATEGORIES = [
  {
    id: "marketplace",
    label: "Marketplace",
    icon: <Sparkles size={18} className="text-yellow-600" />,
  },
  {
    id: "food",
    label: "Food",
    icon: <Home size={18} className="text-orange-500" />,
  },
  {
    id: "apartments",
    label: "Apartments",
    icon: <Home size={18} className="text-teal-600" />,
  },
];

const SUBCATEGORIES: Record<string, string[]> = {
  marketplace: [
    "Vehicles",
    "Electronics",
    "Fashion",
    "Phones",
    "Furniture",
    "Services",
    "Other",
  ],
  food: [
    "Fast food",
    "Local dishes",
    "Drinks",
    "Groceries",
    "Pastries",
    "Other",
  ],
  apartments: [
    "Self-contained",
    "Chamber & Hall",
    "Studio",
    "2-Bedroom",
    "3-Bedroom+",
    "Short stay",
  ],
};

const CONDITIONS: { id: AdCondition; label: string; icon: React.ReactNode }[] =
  [
    {
      id: "brand_new",
      label: "Brand new",
      icon: <Sparkles size={15} className="text-yellow-500" />,
    },
    {
      id: "foreign_used",
      label: "Foreign used",
      icon: <Globe size={15} className="text-blue-500" />,
    },
    {
      id: "local_used",
      label: "Local used",
      icon: <Home size={15} className="text-gray-500" />,
    },
    {
      id: "refurbished",
      label: "Refurbished",
      icon: <Wrench size={15} className="text-green-500" />,
    },
  ];

const GH_REGIONS = [
  "Greater Accra",
  "Ashanti",
  "Western",
  "Eastern",
  "Central",
  "Northern",
  "Upper East",
  "Upper West",
  "Volta",
  "Brong-Ahafo",
  "Western North",
  "Ahafo",
  "Bono East",
  "Oti",
  "North East",
  "Savannah",
];
const NG_STATES = [
  "Lagos",
  "Abuja FCT",
  "Kano",
  "Oyo",
  "Rivers",
  "Kaduna",
  "Delta",
  "Ogun",
  "Anambra",
  "Imo",
  "Plateau",
  "Edo",
  "Borno",
  "Enugu",
  "Katsina",
  "Adamawa",
  "Cross River",
  "Akwa Ibom",
  "Sokoto",
  "Kwara",
  "Osun",
  "Ondo",
  "Bauchi",
  "Niger",
  "Gombe",
  "Kebbi",
  "Zamfara",
  "Yobe",
  "Taraba",
  "Ebonyi",
  "Ekiti",
  "Nassarawa",
  "Bayelsa",
  "Jigawa",
  "Benue",
  "Abia",
  "Kogi",
];

// ── Styles ─────────────────────────────────────────────────────────────────
const inputBase =
  "w-full border rounded-xl px-4 py-2.5 text-sm text-gray-800 bg-white outline-none transition";
const inputNormal = `${inputBase} border-gray-200 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400`;
const inputError = `${inputBase} border-red-400 focus:ring-2 focus:ring-red-300 bg-red-50`;
const labelCls = "block text-xs font-semibold text-gray-500 mb-1.5";
const errMsg = "flex items-center gap-1 text-xs text-red-500 mt-1";

// ── Field wrapper ──────────────────────────────────────────────────────────
const Field = memo(function Field({
  label,
  error,
  hint,
  required = false,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className={labelCls}>
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <p className={errMsg}>
          <span>⚠️</span>
          {error}
        </p>
      )}
      {hint && !error && (
        <p className="text-[11px] text-gray-400 mt-1">{hint}</p>
      )}
    </div>
  );
});

// ── Step bar ───────────────────────────────────────────────────────────────
function StepBar({ current }: { current: number }) {
  return (
    <div className="mb-6">
      <div className="flex items-center mb-3">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center flex-1 last:flex-none">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center
              text-xs font-bold transition-all duration-300 flex-shrink-0
              ${
                i + 1 < current
                  ? "bg-yellow-400 text-black scale-95"
                  : i + 1 === current
                    ? "bg-yellow-400 text-black ring-4 ring-yellow-100"
                    : "bg-gray-100 text-gray-400"
              }`}
            >
              {i + 1 < current ? "✓" : i + 1}
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-1 rounded transition-all duration-300
                ${i + 1 < current ? "bg-yellow-400" : "bg-gray-100"}`}
              />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between">
        {STEPS.map((s, i) => (
          <p
            key={s}
            className={`text-[10px] font-medium flex-1 text-center
            ${i + 1 === current ? "text-gray-700" : "text-gray-400"}`}
          >
            {s}
          </p>
        ))}
      </div>
    </div>
  );
}

// ── Image slot ─────────────────────────────────────────────────────────────
function ImageSlot({
  file,
  previewUrl,
  index,
  onChange,
  onRemove,
}: {
  file: File | null;
  previewUrl: string | null;
  index: number;
  onChange: (i: number, f: File) => void;
  onRemove: (i: number) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [objUrl, setObjUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setObjUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setObjUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const src = objUrl ?? previewUrl;

  return (
    <div
      onClick={() => ref.current?.click()}
      className={`relative aspect-square rounded-xl overflow-hidden border-2 border-dashed
        bg-gray-50 cursor-pointer transition-all duration-200
        ${src ? "border-yellow-400" : "border-gray-200 hover:border-yellow-300 hover:bg-yellow-50"}`}
    >
      {src ? (
        <>
          <Image
            src={src}
            alt={`photo ${index + 1}`}
            fill
            className="object-cover"
          />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove(index);
            }}
            className="absolute top-1 right-1 w-5 h-5 bg-black/60 text-white rounded-full
              text-[10px] flex items-center justify-center hover:bg-red-500 transition"
          >
            ✕
          </button>
          {index === 0 && (
            <span
              className="absolute bottom-1 left-1 text-[10px] bg-yellow-400
              text-black font-bold px-1.5 py-0.5 rounded-full"
            >
              Cover
            </span>
          )}
        </>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center gap-1">
          <Camera size={22} className="text-gray-300" />
          <span className="text-[10px] text-gray-400 text-center leading-tight px-1">
            {index === 0 ? "Cover photo" : `Photo ${index + 1}`}
          </span>
        </div>
      )}
      <input
        ref={ref}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.[0]) onChange(index, e.target.files[0]);
        }}
      />
    </div>
  );
}

// ── Progress bar ───────────────────────────────────────────────────────────
function UploadProgress({
  progress,
  label,
}: {
  progress: number;
  label: string;
}) {
  if (progress === 0) return null;
  return (
    <div className="mt-4">
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>{label}</span>
        <span>{progress}%</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-yellow-400 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

// ── Success screen ─────────────────────────────────────────────────────────
function SuccessScreen({
  adId,
  onPostAnother,
}: {
  adId: string;
  onPostAnother: () => void;
}) {
  return (
    <div className="max-w-xl mx-auto px-4 py-10 text-center">
      <div
        className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center
        text-4xl mx-auto mb-5 shadow-md shadow-green-100"
      >
        🎉
      </div>
      <h2 className="text-2xl font-black text-gray-900 mb-2">Ad posted!</h2>
      <p className="text-sm text-gray-500 mb-8 leading-relaxed">
        Your ad is now under review and will go live once approved.
      </p>
      <div className="flex flex-col gap-3 max-w-xs mx-auto">
        {adId !== "pending" && (
          <Link
            href={`/ads/${adId}`}
            className="w-full py-3 bg-yellow-400 text-black font-black rounded-2xl
              text-sm hover:bg-yellow-300 transition active:scale-[0.99]"
          >
            View my ad →
          </Link>
        )}
        <Link
          href="/ads/my"
          className="w-full py-3 bg-white border border-gray-200 text-gray-700
            font-semibold rounded-2xl text-sm hover:bg-gray-50 transition"
        >
          My ads dashboard
        </Link>
        <Link
          href="/ads"
          className="w-full py-3 bg-white border border-gray-200 text-gray-700
            font-semibold rounded-2xl text-sm hover:bg-gray-50 transition"
        >
          Browse all ads
        </Link>
        <button
          onClick={onPostAnother}
          className="text-sm text-gray-400 hover:text-gray-600 transition mt-1"
        >
          + Post another ad
        </button>
      </div>
    </div>
  );
}

// ── Card wrapper — defined OUTSIDE AdForm so it never remounts on re-render ──
function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 space-y-5">
      {children}
    </div>
  );
}

// ── AdForm props ───────────────────────────────────────────────────────────
interface AdFormProps {
  initialValues?: Partial<AdFormData>;
  // For edit mode: existing uploaded image URLs [{url, publicId, isCover}]
  existingImages?: AdImage[];
  // Called after Cloudinary upload with the final image array + form data
  onSubmit: (
    images: AdImage[],
    data: AdFormData,
  ) => Promise<{ adId?: string } | void>;
  submitLabel?: string;
  loading?: boolean;
  mode?: "create" | "edit";
}

// ── Main component ─────────────────────────────────────────────────────────
export default function AdForm({
  initialValues,
  existingImages = [],
  onSubmit,
  submitLabel = "Post ad",
  loading = false,
  mode = "create",
}: AdFormProps) {
  const user = useAppSelector((s) => s.auth.user);
  const userCurrency = (user?.currency ?? "GHS") as AdCurrency;
  const sym = userCurrency === "NGN" ? "₦" : "₵";
  const regions = userCurrency === "NGN" ? NG_STATES : GH_REGIONS;

  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState("");
  const [successAdId, setSuccessAdId] = useState<string | null>(null);
  const submitRef = useRef(false);
  const errorsRef = useRef<Record<string, string>>({});

  const emptyForm: AdFormData = {
    ...EMPTY_AD_FORM,
    currency: userCurrency,
    name: user?.username ?? "",
    phone: user?.phone ?? "",
  };

  const [form, setForm] = useState<AdFormData>({
    ...emptyForm,
    ...initialValues,
  });

  // ── Single updater — clears error in ref, one setState per keystroke ───
  const set = <K extends keyof AdFormData>(k: K, v: AdFormData[K]) => {
    if (errorsRef.current[k as string]) {
      delete errorsRef.current[k as string];
      setErrors({ ...errorsRef.current });
    }
    setForm((p) => ({ ...p, [k]: v }));
  };

  const setImage = (i: number, file: File) =>
    setForm((p) => {
      const imgs = [...p.images];
      imgs[i] = file;
      return { ...p, images: imgs };
    });

  const removeImage = (i: number) =>
    setForm((p) => {
      const imgs = [...p.images];
      imgs[i] = null;
      return { ...p, images: imgs };
    });

  // Draft persistence (create mode only)
  useEffect(() => {
    if (mode !== "create") return;
    const t = setTimeout(() => {
      const { images: _, ...rest } = form;
      localStorage.setItem("adFormDraft", JSON.stringify(rest));
    }, 800);
    return () => clearTimeout(t);
  }, [form, mode]);

  useEffect(() => {
    if (
      mode !== "create" ||
      (initialValues && Object.keys(initialValues).length)
    )
      return;
    const saved = localStorage.getItem("adFormDraft");
    if (saved) {
      try {
        setForm((p) => ({ ...p, ...JSON.parse(saved), images: p.images }));
      } catch {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Validation ─────────────────────────────────────────────────────────
  const validate = (s: number): boolean => {
    const e: Record<string, string> = {};
    if (s === 1) {
      if (!form.title.trim() || form.title.trim().length < 5)
        e.title = "Title must be at least 5 characters";
      if (!form.category) e.category = "Select a category";
      if (!form.description.trim() || form.description.trim().length < 20)
        e.description = "Description must be at least 20 characters";
    }
    if (s === 2) {
      const hasNew = form.images.some(Boolean);
      const hasExisting = existingImages.length > 0;
      if (!hasNew && !hasExisting) e.images = "Add at least one photo";
    }
    if (s === 3) {
      const p = Number(form.price);
      if (!form.price || isNaN(p) || p <= 0)
        e.price = "Enter a valid price greater than 0";
    }
    if (s === 4) {
      if (!form.region) e.region = "Select your region";
      if (!form.name.trim()) e.name = "Your name is required";
      if (!form.phone.trim()) e.phone = "Phone number is required";
      else if (form.phone.replace(/\D/g, "").length < 9)
        e.phone = "Enter a valid phone number";
    }
    errorsRef.current = e;
    setErrors(e);
    if (Object.keys(e).length > 0) {
      toast.error(Object.values(e)[0], {
        toastId: "validation-error",
        autoClose: 3000,
      });
    }
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (validate(step)) setStep((s) => Math.min(s + 1, STEPS.length));
  };
  const back = () => {
    setStep((s) => Math.max(s - 1, 1));
    setErrors({});
    errorsRef.current = {};
  };

  // ── Submit — Cloudinary upload first, then onSubmit ────────────────────
  const handleSubmit = useCallback(async () => {
    if (!validate(4)) return;
    if (submitRef.current) return;
    if (submitting) return;

    submitRef.current = true;
    setSubmitting(true);

    try {
      // ── Step 1: Upload new images to Cloudinary ────────────────────────
      const newFiles = form.images.filter((f): f is File => f !== null);
      let uploadedImages: AdImage[] = [];

      if (newFiles.length > 0) {
        setProgressLabel("Uploading photos…");
        setProgress(5);

        const results = await uploadManyToCloudinary(newFiles, (pct) => {
          // Scale cloudinary progress to 5-70%
          setProgress(5 + Math.round(pct * 0.65));
        });

        uploadedImages = results.map((r, i) => ({
          url: r.url,
          publicId: r.publicId,
          isCover: i === 0 && existingImages.length === 0, // first new image is cover only if no existing
        }));
      }

      // ── Step 2: Merge with existing images (edit mode) ─────────────────
      // existingImages are already on Cloudinary — keep them as-is
      // New uploads are appended after existing, unless no existing (create mode)
      const finalImages: AdImage[] =
        mode === "edit"
          ? [
              // Keep existing images, re-mark cover
              ...existingImages.map((img, i) => ({
                ...img,
                isCover: i === 0 && uploadedImages.length === 0,
              })),
              // Append new uploads (not cover since existing image is cover)
              ...uploadedImages.map((img) => ({ ...img, isCover: false })),
            ]
          : uploadedImages.map((img, i) => ({ ...img, isCover: i === 0 }));

      // ── Step 3: Call parent with final image array + form data ─────────
      setProgressLabel("Saving your ad…");
      setProgress(75);

      const result = await onSubmit(finalImages, form);

      setProgress(100);
      setProgressLabel("");

      toast.success(
        mode === "edit"
          ? "Ad updated successfully! ✓"
          : "Ad posted successfully! 🎉",
        { toastId: "ad-success", autoClose: 4000 },
      );

      localStorage.removeItem("adFormDraft");

      if (mode === "create") {
        // Use the _id from the returned ad object
        const adId = (result as any)?._id ?? (result as any)?.adId ?? "pending";
        setSuccessAdId(adId);
      }
    } catch (err: any) {
      setProgress(0);
      setProgressLabel("");
      const msg =
        err?.response?.data?.message ??
        err?.message ??
        "Something went wrong. Please try again.";
      toast.error(msg, { toastId: "ad-error", autoClose: 5000 });
    } finally {
      setSubmitting(false);
      submitRef.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, mode, onSubmit, submitting, existingImages]);

  const handlePostAnother = useCallback(() => {
    setSuccessAdId(null);
    setForm({ ...emptyForm });
    setStep(1);
    setErrors({});
    errorsRef.current = {};
    setProgress(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isSubmitting = submitting || loading;

  if (successAdId) {
    return (
      <SuccessScreen adId={successAdId} onPostAnother={handlePostAnother} />
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      <StepBar current={step} />

      {/* ── Step 1: Basic info ── */}
      {step === 1 && (
        <Card>
          <Field
            label="Ad title"
            required
            error={errors.title}
            hint={`${form.title.length}/120 characters`}
          >
            <input
              value={form.title}
              maxLength={120}
              placeholder="e.g. iPhone 15 Pro Max 256GB — Barely used"
              className={errors.title ? inputError : inputNormal}
              onChange={(e) => set("title", e.target.value)}
            />
          </Field>

          <Field label="Category" required error={errors.category}>
            <div className="grid grid-cols-3 gap-2">
              {MAIN_CATEGORIES.map((c) => (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => {
                    set("category", c.id);
                    set("subcategory", "");
                  }}
                  className={`py-2.5 rounded-xl text-xs font-semibold border flex flex-col
                    items-center gap-1 transition
                    ${
                      form.category === c.id
                        ? "bg-yellow-400 border-yellow-400 text-black"
                        : "bg-white border-gray-200 text-gray-600 hover:border-yellow-300"
                    }`}
                >
                  <span className="text-base">{c.icon}</span>
                  {c.label}
                </button>
              ))}
            </div>
          </Field>

          {form.category && SUBCATEGORIES[form.category] && (
            <Field label="Sub-category">
              <select
                value={form.subcategory}
                className={inputNormal}
                onChange={(e) => set("subcategory", e.target.value)}
              >
                <option value="">Select sub-category (optional)</option>
                {SUBCATEGORIES[form.category].map((s) => (
                  <option key={s} value={s.toLowerCase()}>
                    {s}
                  </option>
                ))}
              </select>
            </Field>
          )}

          <Field label="Condition">
            <div className="grid grid-cols-2 gap-2">
              {CONDITIONS.map((c) => (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => set("condition", c.id)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-semibold border
                    flex items-center gap-1.5 transition
                    ${
                      form.condition === c.id
                        ? "bg-yellow-400 border-yellow-400 text-black"
                        : "bg-white border-gray-200 text-gray-600 hover:border-yellow-300"
                    }`}
                >
                  <span>{c.icon}</span>
                  {c.label}
                </button>
              ))}
            </div>
          </Field>

          <Field
            label="Description"
            required
            error={errors.description}
            hint={`${form.description.length}/5000`}
          >
            <textarea
              rows={4}
              maxLength={5000}
              value={form.description}
              placeholder="Describe your item — condition, features, what's included, reason for selling…"
              className={`${errors.description ? inputError : inputNormal} resize-none`}
              onChange={(e) => set("description", e.target.value)}
            />
          </Field>

          <Field
            label="Tags"
            hint="Comma-separated — helps buyers find your ad"
          >
            <input
              value={form.tags}
              placeholder="e.g. iphone, apple, phone, accra, 256gb"
              className={inputNormal}
              onChange={(e) => set("tags", e.target.value)}
            />
          </Field>
        </Card>
      )}

      {/* ── Step 2: Photos ── */}
      {step === 2 && (
        <Card>
          <Field
            label="Photos"
            required
            error={errors.images}
            hint="First photo is the cover shown in search results. Up to 5 photos."
          >
            {/* Show existing images in edit mode */}
            {mode === "edit" && existingImages.length > 0 && (
              <div className="mb-3">
                <p className="text-xs text-gray-500 mb-2">
                  Current photos ({existingImages.length}) — add new ones below
                </p>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {existingImages.map((img, i) => (
                    <div
                      key={img.publicId ?? i}
                      className="relative flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden
                        border-2 border-yellow-400"
                    >
                      <Image
                        src={img.url}
                        alt={`existing ${i + 1}`}
                        fill
                        className="object-cover"
                      />
                      {img.isCover && (
                        <span
                          className="absolute bottom-0 left-0 right-0 text-[9px] font-bold
                          bg-yellow-400 text-black text-center py-0.5"
                        >
                          Cover
                        </span>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-gray-400 mt-1">
                  To replace photos, add new ones below. New photos will be
                  appended.
                </p>
              </div>
            )}

            <div className="grid grid-cols-3 gap-2 mt-1">
              {form.images.map((file, i) => (
                <ImageSlot
                  key={i}
                  file={file}
                  previewUrl={null}
                  index={i}
                  onChange={setImage}
                  onRemove={removeImage}
                />
              ))}
            </div>

            {form.images.filter(Boolean).length > 0 && (
              <p className="text-xs text-green-600 font-medium mt-2">
                ✓ {form.images.filter(Boolean).length} new photo
                {form.images.filter(Boolean).length !== 1 ? "s" : ""} ready to
                upload
              </p>
            )}
          </Field>

          <Field
            label="Video URL"
            hint="Optional — YouTube, TikTok, or any public video link"
          >
            <input
              value={form.videoUrl}
              placeholder="https://youtube.com/..."
              className={inputNormal}
              onChange={(e) => set("videoUrl", e.target.value)}
            />
          </Field>
        </Card>
      )}

      {/* ── Step 3: Pricing & Delivery ── */}
      {step === 3 && (
        <Card>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Price" required error={errors.price}>
              <div className="relative">
                <span
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400
                  text-sm font-semibold pointer-events-none"
                >
                  {sym}
                </span>
                <input
                  type="number"
                  min="0"
                  inputMode="decimal"
                  value={form.price}
                  placeholder="0.00"
                  className={`${errors.price ? inputError : inputNormal} pl-7`}
                  onChange={(e) => set("price", e.target.value)}
                />
              </div>
            </Field>

            <Field label="Negotiable?">
              <select
                value={form.negotiable}
                className={inputNormal}
                onChange={(e) =>
                  set("negotiable", e.target.value as Negotiable)
                }
              >
                <option value="">Not specified</option>
                <option value="yes">Yes — open to offers</option>
                <option value="no">No — fixed price</option>
              </select>
            </Field>
          </div>

          <div>
            <label
              className="flex items-center gap-3 cursor-pointer p-3 rounded-xl
              border border-gray-100 hover:border-yellow-300 hover:bg-yellow-50 transition"
            >
              <input
                type="checkbox"
                checked={form.delivery}
                onChange={(e) => set("delivery", e.target.checked)}
                className="w-4 h-4 rounded accent-yellow-400"
              />
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  Offer delivery 🚚
                </p>
                <p className="text-xs text-gray-400">
                  Let buyers know you can deliver
                </p>
              </div>
            </label>
          </div>

          {form.delivery && (
            <>
              <Field label="Delivery option">
                <select
                  value={form.deliveryOption}
                  className={inputNormal}
                  onChange={(e) =>
                    set("deliveryOption", e.target.value as DeliveryOption)
                  }
                >
                  <option value="both">Both delivery &amp; pickup</option>
                  <option value="delivery_only">Delivery only</option>
                  <option value="pickup_only">Pickup only</option>
                </select>
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label={`Delivery fee (${sym})`} hint="Enter 0 for free">
                  <div className="relative">
                    <span
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400
                      text-sm font-semibold pointer-events-none"
                    >
                      {sym}
                    </span>
                    <input
                      type="number"
                      min="0"
                      inputMode="decimal"
                      value={form.deliveryFee}
                      placeholder="0"
                      className={`${inputNormal} pl-7`}
                      onChange={(e) => set("deliveryFee", e.target.value)}
                    />
                  </div>
                </Field>
                <Field label="Delivery note">
                  <input
                    value={form.deliveryNote}
                    placeholder="e.g. Free in Accra"
                    className={inputNormal}
                    onChange={(e) => set("deliveryNote", e.target.value)}
                  />
                </Field>
              </div>
            </>
          )}
        </Card>
      )}

      {/* ── Step 4: Location & Contact ── */}
      {step === 4 && (
        <Card>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Region" required error={errors.region}>
              <select
                value={form.region}
                className={errors.region ? inputError : inputNormal}
                onChange={(e) => set("region", e.target.value)}
              >
                <option value="">Select region</option>
                {regions.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="City / Area">
              <input
                value={form.city}
                placeholder="e.g. Tema, Labone"
                className={inputNormal}
                onChange={(e) => set("city", e.target.value)}
              />
            </Field>
          </div>

          <Field
            label="Street address"
            hint="Optional — helps buyers find pickup point"
          >
            <input
              value={form.address}
              placeholder="e.g. Near Accra Mall, Spintex Road"
              className={inputNormal}
              onChange={(e) => set("address", e.target.value)}
            />
          </Field>

          <div className="border-t border-gray-100 pt-4">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">
              Contact details
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Your name" required error={errors.name}>
                <input
                  value={form.name}
                  placeholder="Full name"
                  className={errors.name ? inputError : inputNormal}
                  onChange={(e) => set("name", e.target.value)}
                  autoComplete="name"
                />
              </Field>
              <Field label="Phone number" required error={errors.phone}>
                <input
                  value={form.phone}
                  type="tel"
                  inputMode="tel"
                  placeholder="+233 244 000 000"
                  className={errors.phone ? inputError : inputNormal}
                  onChange={(e) => set("phone", e.target.value)}
                  autoComplete="tel"
                />
              </Field>
            </div>
            <Field label="WhatsApp number" hint="Leave blank if same as phone">
              <input
                value={form.whatsapp}
                type="tel"
                inputMode="tel"
                placeholder="Optional — +233 ..."
                className={inputNormal}
                onChange={(e) => set("whatsapp", e.target.value)}
              />
            </Field>
            <label
              className="flex items-center gap-3 cursor-pointer mt-3 p-3 rounded-xl
              border border-gray-100 hover:border-yellow-300 hover:bg-yellow-50 transition"
            >
              <input
                type="checkbox"
                checked={form.showPhone}
                onChange={(e) => set("showPhone", e.target.checked)}
                className="w-4 h-4 rounded accent-yellow-400"
              />
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  Show phone number on listing
                </p>
                <p className="text-xs text-gray-400">
                  Buyers will be able to see and call you
                </p>
              </div>
            </label>
          </div>
        </Card>
      )}

      <UploadProgress progress={progress} label={progressLabel} />

      {/* ── Navigation ── */}
      <div className="flex gap-3 mt-5">
        {step > 1 && !isSubmitting && (
          <button
            type="button"
            onClick={back}
            className="flex-1 py-3 bg-white border border-gray-200 text-gray-700
              font-semibold rounded-2xl text-sm hover:bg-gray-50 transition"
          >
            ← Back
          </button>
        )}

        {step < STEPS.length ? (
          <button
            type="button"
            onClick={next}
            className="flex-1 py-3 bg-yellow-400 text-black font-black rounded-2xl
              text-sm hover:bg-yellow-300 transition active:scale-[0.99]"
          >
            Next →
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 py-3 bg-yellow-400 text-black font-black rounded-2xl
              text-sm hover:bg-yellow-300 transition disabled:opacity-60
              disabled:cursor-not-allowed active:scale-[0.99]"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <span
                  className="w-4 h-4 border-2 border-black/30 border-t-black
                    rounded-full animate-spin inline-block"
                />
                {progressLabel || (mode === "edit" ? "Saving…" : "Posting…")}
              </span>
            ) : (
              submitLabel
            )}
          </button>
        )}
      </div>
    </div>
  );
}
