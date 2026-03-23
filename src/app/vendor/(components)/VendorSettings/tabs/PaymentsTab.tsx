"use client";

import { useState } from "react";
import { SectionCard, Field, Input, Select, SaveButton } from "../(component)/Ui";

type PayMethod = "momo" | "bank" | "both";

export default function PaymentsTab() {
  const [payMethod, setPayMethod] = useState<PayMethod>("momo");

  return (
    <div>
      {/* ── Payout Method ── */}
      <SectionCard title="Payout Method" description="How you receive payments from Smilebaba">
        <div className="flex flex-col xs:flex-row gap-2 sm:gap-3 mb-6">
          {(["momo", "bank", "both"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setPayMethod(m)}
              className={`flex-1 py-2.5 sm:py-3 rounded-xl border text-xs sm:text-sm font-medium transition active:scale-95
                ${payMethod === m
                  ? "border-orange-400 bg-orange-50 text-orange-600"
                  : "border-gray-200 text-gray-500 hover:border-gray-300"
                }`}
            >
              {m === "momo" ? "📱 Mobile Money" : m === "bank" ? "🏦 Bank Transfer" : "💳 Both"}
            </button>
          ))}
        </div>

        {(payMethod === "momo" || payMethod === "both") && (
          <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 mb-4">
            <p className="text-xs font-semibold text-orange-700 mb-3">Mobile Money Details</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-5">
              <Field label="Network" required>
                <Select defaultValue="mtn">
                  <option value="mtn">MTN Mobile Money</option>
                  <option value="vodafone">Vodafone Cash</option>
                  <option value="airteltigo">AirtelTigo Money</option>
                  <option value="opay">OPay (Nigeria)</option>
                  <option value="palmpay">PalmPay (Nigeria)</option>
                </Select>
              </Field>
              <Field label="MoMo number" required>
                <Input placeholder="0244 123 456" />
              </Field>
              <Field label="Account name" required>
                <Input placeholder="Name on MoMo account" />
              </Field>
            </div>
          </div>
        )}

        {(payMethod === "bank" || payMethod === "both") && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4">
            <p className="text-xs font-semibold text-blue-700 mb-3">Bank Account Details</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-5">
              <Field label="Bank name" required>
                <Select>
                  <option value="">Select bank</option>
                  <optgroup label="Ghana">
                    <option>GCB Bank</option>
                    <option>Ecobank Ghana</option>
                    <option>Absa Ghana</option>
                    <option>Fidelity Bank Ghana</option>
                    <option>Stanbic Bank Ghana</option>
                    <option>CalBank</option>
                  </optgroup>
                  <optgroup label="Nigeria">
                    <option>Access Bank</option>
                    <option>GTBank</option>
                    <option>First Bank Nigeria</option>
                    <option>Zenith Bank</option>
                    <option>UBA</option>
                    <option>Wema Bank</option>
                  </optgroup>
                </Select>
              </Field>
              <Field label="Account number" required>
                <Input placeholder="0123456789" maxLength={13} />
              </Field>
              <Field label="Account name" required>
                <Input placeholder="Name on bank account" />
              </Field>
              <Field label="Branch (optional)">
                <Input placeholder="e.g. Kumasi Central" />
              </Field>
            </div>
          </div>
        )}
        <SaveButton />
      </SectionCard>

      {/* ── Tax Information ── */}
      <SectionCard title="Tax Information" description="Required for payouts above regulatory thresholds">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-5">
          <Field label="TIN / Tax ID">
            <Input placeholder="e.g. P0012345678" />
          </Field>
          <Field label="VAT registration number">
            <Input placeholder="Optional" />
          </Field>
          <Field label="Business registration number">
            <Input placeholder="e.g. BN-1234567" />
          </Field>
        </div>
        <SaveButton />
      </SectionCard>

      {/* ── Payout Schedule ── */}
      <SectionCard title="Payout Schedule" description="When Smilebaba pays you your earnings">
        <Field label="Payout frequency">
          <Select defaultValue="weekly">
            <option value="daily">Daily (Premium vendors only)</option>
            <option value="weekly">Weekly — every Monday</option>
            <option value="biweekly">Bi-weekly</option>
            <option value="monthly">Monthly — 1st of every month</option>
          </Select>
        </Field>
        <Field
          label="Minimum payout threshold"
          hint="Payouts only process when your balance reaches this amount"
        >
          <div className="flex gap-2">
            <Select className="w-20 sm:w-24 flex-shrink-0">
              <option>GHS</option>
              <option>NGN</option>
            </Select>
            <Input type="number" placeholder="100" defaultValue="100" />
          </div>
        </Field>
        <SaveButton />
      </SectionCard>
    </div>
  );
}