"use client";
// Vendor Settings → Payments tab
// Dynamic: GH shows MoMo networks, NG shows OPay/PalmPay.
// Saves via PATCH /auth/payment-details.

import { useState, useEffect, useRef } from "react";
import {
  SectionCard,
  Field,
  Input,
  Select,
  SaveButton,
} from "../(components)/UI";
import { useVendorSettings } from "@/src/hooks/useVendorSettings";



type PayMethod = "momo" | "bank" | "both";

type MomoState = { network: string; number: string; accountName: string };
type BankState = {
  bankName: string;
  accountNo: string;
  accountName: string;
  branch: string;
};
type TaxState = { tin: string; vat: string; regNo: string };
type ScheduleState = {
  frequency: "daily" | "weekly" | "biweekly" | "monthly";
  minAmount: string;
  currency: string;
};

const MOMO_DEFAULT: MomoState = { network: "", number: "", accountName: "" };
const BANK_DEFAULT: BankState = {
  bankName: "",
  accountNo: "",
  accountName: "",
  branch: "",
};
const TAX_DEFAULT: TaxState = { tin: "", vat: "", regNo: "" };

const GH_BANKS = [
  "GCB Bank",
  "Ecobank Ghana",
  "Absa Ghana",
  "Fidelity Bank Ghana",
  "Stanbic Bank Ghana",
  "CalBank",
  "Access Bank Ghana",
];
const NG_BANKS = [
  "Access Bank",
  "GTBank",
  "First Bank Nigeria",
  "Zenith Bank",
  "UBA",
  "Wema Bank",
  "Kuda Bank",
  "Opay",
  "Moniepoint",
];
const GH_MOMO = [
  "MTN Mobile Money",
  "Vodafone Cash",
  "AirtelTigo Money",
  "Telecel Cash",
];
const NG_MOMO = ["OPay", "PalmPay", "Moniepoint", "Kuda", "Carbon"];

export default function PaymentsTab() {
  const { user, saving, savePayments, currency, country } = useVendorSettings();
  const isNG = country === "Nigeria";

  const [payMethod, setPayMethod] = useState<PayMethod>(
    (user?.payoutMethod as PayMethod) ?? "momo",
  );

  // All local state uses concrete (non-Partial) types with "" fallback
  const [momo, setMomo] = useState<MomoState>({
    network: user?.momoDetails?.network ?? "",
    number: user?.momoDetails?.number ?? "",
    accountName: user?.momoDetails?.accountName ?? "",
  });
  const [bank, setBank] = useState<BankState>({
    bankName: user?.bankDetails?.bankName ?? "",
    accountNo: user?.bankDetails?.accountNo ?? "",
    accountName: user?.bankDetails?.accountName ?? "",
    branch: user?.bankDetails?.branch ?? "",
  });
  const [tax, setTax] = useState<TaxState>({
    tin: user?.taxInfo?.tin ?? "",
    vat: user?.taxInfo?.vat ?? "",
    regNo: user?.taxInfo?.regNo ?? "",
  });
  const [schedule, setSchedule] = useState<ScheduleState>({
    frequency: (user?.payoutSchedule?.frequency ??
      "weekly") as ScheduleState["frequency"],
    minAmount: user?.payoutSchedule?.minAmount ?? "100",
    currency,
  });

  // Sync from Redux once user loads (e.g. after page refresh)
  // Seed form once on initial load — don't reset after user saves
  const seededRef = useRef(false);

  useEffect(() => {
    if (!user) return;
    if (seededRef.current) return; // already seeded — don't overwrite user edits
    seededRef.current = true;
    setPayMethod((user.payoutMethod as PayMethod) ?? "momo");
    setMomo({
      network: user.momoDetails?.network ?? "",
      number: user.momoDetails?.number ?? "",
      accountName: user.momoDetails?.accountName ?? "",
    });
    setBank({
      bankName: user.bankDetails?.bankName ?? "",
      accountNo: user.bankDetails?.accountNo ?? "",
      accountName: user.bankDetails?.accountName ?? "",
      branch: user.bankDetails?.branch ?? "",
    });
    setTax({
      tin: user.taxInfo?.tin ?? "",
      vat: user.taxInfo?.vat ?? "",
      regNo: user.taxInfo?.regNo ?? "",
    });
    setSchedule({
      frequency: (user.payoutSchedule?.frequency ??
        "weekly") as ScheduleState["frequency"],
      minAmount: user.payoutSchedule?.minAmount ?? "100",
      currency,
    });
    // Use stable primitive deps to avoid re-resetting form on every Redux state change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?._id, user?.updatedAt, currency]);

  const handleSave = () =>
    savePayments({
      payoutMethod: payMethod,
      momoDetails: momo,
      bankDetails: bank,
      taxInfo: tax,
      payoutSchedule: schedule,
    });

  const momoNetworks = isNG ? NG_MOMO : GH_MOMO;
  const banks = isNG ? NG_BANKS : GH_BANKS;
  const minLabel = isNG ? "₦5,000" : "₵50";

  return (
    <div>
      <SectionCard
        title="Payout method"
        description={`How you receive earnings — ${country}`}
      >
        <div className="flex gap-2 mb-5">
          {(["momo", "bank", "both"] as PayMethod[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setPayMethod(m)}
              className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition active:scale-95
                ${
                  payMethod === m
                    ? "border-[#ffc105] bg-[#ffc105]/10 text-gray-900"
                    : "border-gray-200 text-gray-500 hover:border-gray-300"
                }`}
            >
              {m === "momo"
                ? `📱 ${isNG ? "Wallet" : "Mobile Money"}`
                : m === "bank"
                  ? "🏦 Bank Transfer"
                  : "💳 Both"}
            </button>
          ))}
        </div>

        {(payMethod === "momo" || payMethod === "both") && (
          <div className="bg-[#ffc105]/5 border border-[#ffc105]/20 rounded-xl p-4 mb-4">
            <p className="text-xs font-bold text-gray-700 mb-3">
              {isNG ? "Wallet details" : "Mobile money details"}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
              <Field label="Network / Provider" required>
                <Select
                  value={momo.network}
                  onChange={(e) =>
                    setMomo((p) => ({ ...p, network: e.target.value }))
                  }
                >
                  <option value="">Select provider</option>
                  {momoNetworks.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field
                label={isNG ? "Account number / phone" : "MoMo number"}
                required
              >
                <Input
                  value={momo.number}
                  onChange={(e) =>
                    setMomo((p) => ({ ...p, number: e.target.value }))
                  }
                  placeholder={isNG ? "0901 234 5678" : "0244 123 456"}
                />
              </Field>
              <Field label="Account name" required>
                <Input
                  value={momo.accountName}
                  onChange={(e) =>
                    setMomo((p) => ({ ...p, accountName: e.target.value }))
                  }
                  placeholder="Name on account"
                />
              </Field>
            </div>
          </div>
        )}

        {(payMethod === "bank" || payMethod === "both") && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4">
            <p className="text-xs font-bold text-blue-700 mb-3">
              Bank account details
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
              <Field label="Bank name" required>
                <Select
                  value={bank.bankName}
                  onChange={(e) =>
                    setBank((p) => ({ ...p, bankName: e.target.value }))
                  }
                >
                  <option value="">Select bank</option>
                  {banks.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Account number" required>
                <Input
                  value={bank.accountNo}
                  onChange={(e) =>
                    setBank((p) => ({ ...p, accountNo: e.target.value }))
                  }
                  placeholder="0123456789"
                  maxLength={13}
                />
              </Field>
              <Field label="Account name" required>
                <Input
                  value={bank.accountName}
                  onChange={(e) =>
                    setBank((p) => ({ ...p, accountName: e.target.value }))
                  }
                  placeholder="Name on account"
                />
              </Field>
              <Field label="Branch (optional)">
                <Input
                  value={bank.branch}
                  onChange={(e) =>
                    setBank((p) => ({ ...p, branch: e.target.value }))
                  }
                  placeholder="e.g. Kumasi Central"
                />
              </Field>
            </div>
          </div>
        )}
        <SaveButton saving={saving === "payments"} onClick={handleSave} />
      </SectionCard>

      <SectionCard
        title="Tax information"
        description="Required for payouts above regulatory thresholds"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
          <Field
            label={isNG ? "TIN / Tax ID" : "Ghana Tax Identification Number"}
          >
            <Input
              value={tax.tin}
              onChange={(e) => setTax((p) => ({ ...p, tin: e.target.value }))}
              placeholder={isNG ? "e.g. 12345678-0001" : "e.g. P0012345678"}
            />
          </Field>
          <Field label="VAT registration number">
            <Input
              value={tax.vat}
              onChange={(e) => setTax((p) => ({ ...p, vat: e.target.value }))}
              placeholder="Optional"
            />
          </Field>
          <Field label="Business registration number">
            <Input
              value={tax.regNo}
              onChange={(e) => setTax((p) => ({ ...p, regNo: e.target.value }))}
              placeholder={isNG ? "RC12345" : "BN-1234567"}
            />
          </Field>
        </div>
        <SaveButton saving={saving === "payments"} onClick={handleSave} />
      </SectionCard>

      <SectionCard
        title="Payout schedule"
        description="When SmileBaba transfers your earnings"
      >
        <Field label="Payout frequency">
          <Select
            value={schedule.frequency}
            onChange={(e) =>
              setSchedule((p) => ({
                ...p,
                frequency: e.target.value as ScheduleState["frequency"],
              }))
            }
          >
            <option value="daily">Daily (Premium vendors only)</option>
            <option value="weekly">Weekly — every Monday</option>
            <option value="biweekly">Bi-weekly</option>
            <option value="monthly">Monthly — 1st of month</option>
          </Select>
        </Field>
        <Field
          label="Minimum payout threshold"
          hint={`Payouts only process above this amount (minimum: ${minLabel})`}
        >
          <div className="flex gap-2">
            <Select className="w-24 flex-shrink-0" value={currency} disabled>
              <option>{currency}</option>
            </Select>
            <Input
              type="number"
              value={schedule.minAmount}
              onChange={(e) =>
                setSchedule((p) => ({ ...p, minAmount: e.target.value }))
              }
              placeholder={isNG ? "5000" : "50"}
            />
          </div>
        </Field>
        <SaveButton saving={saving === "payments"} onClick={handleSave} />
      </SectionCard>
    </div>
  );
}