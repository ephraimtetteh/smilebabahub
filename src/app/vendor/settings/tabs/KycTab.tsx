"use client";
// Vendor Settings → KYC / Verification tab
// Document types are country-dynamic. Uploads to Cloudinary.
// Saves via PATCH /auth/profile (KYC fields).

import { useState, useEffect } from "react";
import {
  SectionCard,
  Field,
  Input,
  Select,
  SaveButton,
  StatusBadge,
  ImageUpload,
} from "../(components)/UI";
import { useVendorSettings } from "@/src/hooks/useVendorSettings";
import { uploadToCloudinary } from "@/src/utils/uploadToCloudinary";


export default function KycTab() {
  const { user, saving, saveProfile, country } = useVendorSettings();
  const isNG = country === "Nigeria";

  const docTypes = isNG
    ? [
        { v: "nin", l: "NIN Slip (Nigeria)" },
        { v: "bvn", l: "BVN Document" },
        { v: "passport", l: "International Passport" },
        { v: "drivers", l: "Driver's License" },
      ]
    : [
        { v: "ghana-card", l: "Ghana Card (NIA)" },
        { v: "passport", l: "International Passport" },
        { v: "voters-id", l: "Voter's ID" },
        { v: "drivers", l: "Driver's License" },
      ];

  const kycStatus = user?.kycStatus ?? {};

  const [docType, setDocType] = useState(docTypes[0].v);
  const [docNumber, setDocNumber] = useState(user?.kycDocNumber ?? "");
  const [expiry, setExpiry] = useState(user?.kycDocExpiry ?? "");
  const [frontUrl, setFrontUrl] = useState(user?.kycFrontUrl ?? "");
  const [backUrl, setBackUrl] = useState(user?.kycBackUrl ?? "");
  const [bizUrl, setBizUrl] = useState(user?.kycBizUrl ?? "");
  const [bizRegNo, setBizRegNo] = useState(user?.kycBizRegNo ?? "");
  const [uploading, setUploading] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    setDocNumber(user.kycDocNumber ?? "");
    setExpiry(user.kycDocExpiry ?? "");
    setFrontUrl(user.kycFrontUrl ?? "");
    setBackUrl(user.kycBackUrl ?? "");
    setBizUrl(user.kycBizUrl ?? "");
    setBizRegNo(user.kycBizRegNo ?? "");
  }, [user]);

  const upload = async (file: File, which: "front" | "back" | "biz") => {
    setUploading(which);
    try {
      const { url } = await uploadToCloudinary(file);
      if (which === "front") setFrontUrl(url);
      else if (which === "back") setBackUrl(url);
      else setBizUrl(url);
    } catch {
      /* silently fail */
    } finally {
      setUploading(null);
    }
  };

  const handleSave = () =>
    saveProfile({
      kycDocType: docType,
      kycDocNumber: docNumber,
      kycDocExpiry: expiry,
      kycFrontUrl: frontUrl,
      kycBackUrl: backUrl,
    });

  const handleBizSave = () =>
    saveProfile({ kycBizUrl: bizUrl, kycBizRegNo: bizRegNo });

  const verificationItems = [
    {
      label: "Email address",
      status: (user?.email ? "verified" : "not_submitted") as any,
    },
    {
      label: "Phone number",
      status: (user?.phone ? "verified" : "not_submitted") as any,
    },
    {
      label: "Identity document",
      status: (kycStatus.identity ?? "not_submitted") as any,
    },
    {
      label: "Business registration",
      status: (kycStatus.business ?? "not_submitted") as any,
    },
    {
      label: `${isNG ? "Bank / Wallet" : "Bank / MoMo"} account`,
      status: (kycStatus.payment ?? "not_submitted") as any,
    },
  ];

  return (
    <div>
      <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100 mb-5">
        <span className="text-xl flex-shrink-0 mt-0.5">ℹ️</span>
        <div>
          <p className="text-sm font-bold text-blue-700">
            Identity verification required
          </p>
          <p className="text-xs text-blue-600 mt-0.5 leading-relaxed">
            To protect buyers and sellers, SmileBaba verifies all vendor
            identities before enabling full payout access. This usually takes
            1–2 business days.
          </p>
        </div>
      </div>

      <SectionCard title="Verification status">
        <div className="space-y-0">
          {verificationItems.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between gap-3 py-3 border-b border-gray-50 last:border-0"
            >
              <p className="text-sm text-gray-700">{item.label}</p>
              <StatusBadge status={item.status} />
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="Identity document"
        description="Upload a valid government-issued ID"
      >
        <Field label="Document type" required>
          <Select value={docType} onChange={(e) => setDocType(e.target.value)}>
            {docTypes.map((d) => (
              <option key={d.v} value={d.v}>
                {d.l}
              </option>
            ))}
          </Select>
        </Field>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <ImageUpload
            label="Front of document"
            icon="🪪"
            value={frontUrl}
            className="h-28"
            onChange={(url, file) => {
              setFrontUrl(url);
              upload(file, "front");
            }}
          />
          <ImageUpload
            label="Back of document"
            icon="🪪"
            value={backUrl}
            className="h-28"
            onChange={(url, file) => {
              setBackUrl(url);
              upload(file, "back");
            }}
          />
        </div>
        {uploading && (
          <p className="text-xs text-[#ffc105] font-medium mb-3">
            Uploading {uploading} image…
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
          <Field label="Document number" required>
            <Input
              value={docNumber}
              onChange={(e) => setDocNumber(e.target.value)}
              placeholder={isNG ? "e.g. 12345678901" : "e.g. GHA-123456789-0"}
            />
          </Field>
          <Field label="Expiry date">
            <Input
              type="date"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
            />
          </Field>
        </div>
        <SaveButton saving={saving === "profile"} onClick={handleSave} />
      </SectionCard>

      <SectionCard
        title="Business registration (optional)"
        description="Upload your certificate for additional trust badges"
      >
        <Field label="Business registration certificate">
          <ImageUpload
            label=""
            icon="📄"
            value={bizUrl}
            className="h-28"
            onChange={(url, file) => {
              setBizUrl(url);
              upload(file, "biz");
            }}
          />
        </Field>
        <Field label="Business registration number">
          <Input
            value={bizRegNo}
            onChange={(e) => setBizRegNo(e.target.value)}
            placeholder={isNG ? "RC12345" : "BN-1234567"}
          />
        </Field>
        <SaveButton saving={saving === "profile"} onClick={handleBizSave} />
      </SectionCard>
    </div>
  );
}
