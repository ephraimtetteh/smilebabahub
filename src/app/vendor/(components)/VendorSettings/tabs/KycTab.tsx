"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  SectionCard,
  Field,
  Input,
  Select,
  SaveButton,
} from "../(component)/Ui";

const VERIFICATION_ITEMS = [
  { label: "Email address", status: "verified" },
  { label: "Phone number", status: "verified" },
  { label: "Identity document", status: "pending" },
  { label: "Business registration", status: "not_submitted" },
  { label: "Bank / MoMo account", status: "not_submitted" },
];

type Status = "verified" | "pending" | "not_submitted";

function StatusBadge({ status }: { status: Status }) {
  const map = {
    verified: "bg-green-100 text-green-600",
    pending: "bg-yellow-100 text-yellow-700",
    not_submitted: "bg-gray-100 text-gray-500",
  };
  const label = {
    verified: "✓ Verified",
    pending: "⏳ Pending review",
    not_submitted: "Not submitted",
  };
  return (
    <span
      className={`text-xs font-semibold px-2.5 sm:px-3 py-1 rounded-full flex-shrink-0 ${map[status]}`}
    >
      {label[status]}
    </span>
  );
}

export default function KycTab() {
  const [docType, setDocType] = useState("ghana-card");
  const frontRef = useRef<HTMLInputElement>(null);
  const backRef = useRef<HTMLInputElement>(null);
  const bizRef = useRef<HTMLInputElement>(null);
  const [front, setFront] = useState<string | null>(null);
  const [back, setBack] = useState<string | null>(null);
  const [biz, setBiz] = useState<string | null>(null);

  return (
    <div>
      {/* Info banner */}
      <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100 mb-5 sm:mb-6">
        <span className="text-xl mt-0.5 flex-shrink-0">ℹ️</span>
        <div>
          <p className="text-sm font-semibold text-blue-700">
            Identity verification required
          </p>
          <p className="text-xs text-blue-600 mt-0.5 leading-relaxed">
            To protect buyers and sellers on Smilebaba, we verify all vendor
            identities before enabling full payout access. This usually takes
            1–2 business days.
          </p>
        </div>
      </div>

      {/* ── Verification Status ── */}
      <SectionCard title="Verification status">
        <div className="space-y-0">
          {VERIFICATION_ITEMS.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between gap-3 py-2.5 border-b border-gray-50 last:border-0"
            >
              <p className="text-sm text-gray-700 min-w-0 truncate">
                {item.label}
              </p>
              <StatusBadge status={item.status as Status} />
            </div>
          ))}
        </div>
      </SectionCard>

      {/* ── Identity Document ── */}
      <SectionCard
        title="Identity document"
        description="Upload a valid government-issued ID"
      >
        <Field label="Document type" required>
          <Select value={docType} onChange={(e) => setDocType(e.target.value)}>
            <option value="ghana-card">Ghana Card (NIA)</option>
            <option value="passport">International Passport</option>
            <option value="voters-id">Voter`s ID (Ghana)</option>
            <option value="nin">NIN Slip (Nigeria)</option>
            <option value="drivers">Driver`s License</option>
          </Select>
        </Field>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {[
            {
              label: "Front of document",
              ref: frontRef,
              state: front,
              setState: setFront,
            },
            {
              label: "Back of document",
              ref: backRef,
              state: back,
              setState: setBack,
            },
          ].map(({ label, ref, state, setState }) => (
            <div key={label}>
              <p className="text-xs font-semibold text-gray-600 mb-1.5">
                {label}
              </p>
              <div
                onClick={() => ref.current?.click()}
                className="w-full h-28 sm:h-32 rounded-xl border-2 border-dashed border-gray-200
                  bg-gray-50 hover:border-orange-300 cursor-pointer flex items-center justify-center
                  overflow-hidden transition"
              >
                {state ? (
                  <Image
                    src={state}
                    alt={label}
                    width={200}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-2">
                    <p className="text-2xl">🪪</p>
                    <p className="text-[11px] text-gray-400 mt-1">
                      Click to upload
                    </p>
                  </div>
                )}
              </div>
              <input
                ref={ref}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) setState(URL.createObjectURL(f));
                }}
              />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-5 mt-4">
          <Field label="Document number" required>
            <Input placeholder="e.g. GHA-123456789-0" />
          </Field>
          <Field label="Expiry date">
            <Input type="date" />
          </Field>
        </div>
        <SaveButton />
      </SectionCard>

      {/* ── Business Registration ── */}
      <SectionCard
        title="Business registration (optional)"
        description="Upload your business certificate for additional trust badges"
      >
        <Field label="Business registration certificate">
          <div
            onClick={() => bizRef.current?.click()}
            className="w-full h-28 sm:h-32 rounded-xl border-2 border-dashed border-gray-200
              bg-gray-50 hover:border-orange-300 cursor-pointer flex items-center justify-center
              overflow-hidden transition"
          >
            {biz ? (
              <Image
                src={biz}
                alt="cert"
                width={400}
                height={128}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center p-2">
                <p className="text-2xl">📄</p>
                <p className="text-xs text-gray-400 mt-1">
                  Upload certificate (PDF or image)
                </p>
              </div>
            )}
          </div>
          <input
            ref={bizRef}
            type="file"
            accept="image/*,application/pdf"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) setBiz(URL.createObjectURL(f));
            }}
          />
        </Field>
        <Field label="Business registration number">
          <Input placeholder="e.g. BN-1234567" />
        </Field>
        <SaveButton />
      </SectionCard>
    </div>
  );
}
