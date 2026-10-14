"use client";
// Vendor Settings → Shipping tab
// Dynamic delivery zones (shows correct countries). Saves via PATCH /auth/shipping.

import { useState, useEffect } from "react";
import {
  SectionCard,
  Field,
  Input,
  Select,
  Textarea,
  SaveButton,
} from "../(components)/UI";
import { useVendorSettings } from "@/src/hooks/useVendorSettings";


type Zone = { zone: string; eta: string; enabled: boolean };

export default function ShippingTab() {
  const { user, saving, saveShipping, country } = useVendorSettings();
  const isNG = country === "Nigeria";

  const defaultZones: Zone[] = [
    { zone: "Same city delivery", eta: "Same day – 24 hrs", enabled: true },
    {
      zone: `Within region${isNG ? " / state" : ""}`,
      eta: "1–2 business days",
      enabled: true,
    },
    {
      zone: `Nationwide (${country})`,
      eta: "2–5 business days",
      enabled: true,
    },
    {
      zone: isNG ? "Nationwide (Ghana)" : "Nationwide (Nigeria)",
      eta: "3–5 business days",
      enabled: false,
    },
    { zone: "International", eta: "7–14 business days", enabled: false },
  ];

  const [zones, setZones] = useState<Zone[]>(
    user?.deliveryZones ?? defaultZones,
  );
  const [pricing, setPricing] = useState(
    user?.deliveryPricing ?? {
      model: "fixed",
      baseFee: "",
      freeThreshold: "",
    },
  );
  const [dispatchTime, setDispatchTime] = useState(user?.dispatchTime ?? "24");
  const [packagingNotes, setPackagingNotes] = useState(
    user?.packagingNotes ?? "",
  );

  useEffect(() => {
    if (!user) return;
    if (user.deliveryZones) setZones(user.deliveryZones);
    if (user.deliveryPricing) setPricing(user.deliveryPricing);
    if (user.dispatchTime) setDispatchTime(user.dispatchTime);
    if (user.packagingNotes) setPackagingNotes(user.packagingNotes);
  }, [user]);

  const toggleZone = (i: number) =>
    setZones((p) =>
      p.map((z, j) => (j === i ? { ...z, enabled: !z.enabled } : z)),
    );

  const handleSave = () =>
    saveShipping({
      deliveryZones: zones,
      deliveryPricing: pricing,
      dispatchTime,
      packagingNotes,
    });

  return (
    <div>
      <SectionCard
        title="Delivery zones"
        description="Where you can deliver to"
      >
        <div className="space-y-2">
          {zones.map((z, i) => (
            <div
              key={z.zone}
              className="flex items-center justify-between gap-3 p-3
              rounded-xl border border-gray-100 bg-gray-50"
            >
              <div>
                <p className="text-sm font-medium text-gray-700">{z.zone}</p>
                <p className="text-xs text-gray-400">{z.eta}</p>
              </div>
              <button
                type="button"
                onClick={() => toggleZone(i)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer
                  rounded-full border-2 border-transparent transition-colors duration-200
                  ${z.enabled ? "bg-[#ffc105]" : "bg-gray-200"}`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow
                  transition duration-200 ${z.enabled ? "translate-x-5" : "translate-x-0"}`}
                />
              </button>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Delivery pricing">
        <Field label="Pricing model">
          <Select
            value={pricing.model}
            onChange={(e) =>
              setPricing((p) => ({ ...p, model: e.target.value }))
            }
          >
            <option value="fixed">Fixed rate per order</option>
            <option value="free">Free delivery (absorbed by seller)</option>
            <option value="actual">Buyer pays actual cost</option>
            <option value="threshold">Free above minimum order</option>
          </Select>
        </Field>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
          <Field label="Base delivery fee" hint="Charged per order">
            <div className="flex gap-2">
              <span
                className="inline-flex items-center px-3 rounded-l-xl border border-r-0
                border-gray-200 bg-gray-50 text-sm font-bold text-gray-500"
              >
                {isNG ? "₦" : "₵"}
              </span>
              <Input
                value={pricing.baseFee}
                onChange={(e) =>
                  setPricing((p) => ({ ...p, baseFee: e.target.value }))
                }
                type="number"
                placeholder={isNG ? "1500" : "20"}
                className="rounded-l-none"
              />
            </div>
          </Field>
          <Field
            label="Free delivery threshold"
            hint="Order amount above which delivery is free"
          >
            <div className="flex gap-2">
              <span
                className="inline-flex items-center px-3 rounded-l-xl border border-r-0
                border-gray-200 bg-gray-50 text-sm font-bold text-gray-500"
              >
                {isNG ? "₦" : "₵"}
              </span>
              <Input
                value={pricing.freeThreshold}
                onChange={(e) =>
                  setPricing((p) => ({ ...p, freeThreshold: e.target.value }))
                }
                type="number"
                placeholder={isNG ? "15000" : "200"}
                className="rounded-l-none"
              />
            </div>
          </Field>
        </div>
        <SaveButton saving={saving === "shipping"} onClick={handleSave} />
      </SectionCard>

      <SectionCard title="Dispatch & handling">
        <Field
          label="Average dispatch time"
          hint="How long after order before you ship"
        >
          <Select
            value={dispatchTime}
            onChange={(e) => setDispatchTime(e.target.value)}
          >
            <option value="same">Same day</option>
            <option value="24">Within 24 hours</option>
            <option value="48">Within 48 hours</option>
            <option value="72">Within 72 hours</option>
          </Select>
        </Field>
        <Field label="Packaging notes">
          <Textarea
            rows={2}
            value={packagingNotes}
            onChange={(e) => setPackagingNotes(e.target.value)}
            placeholder="e.g. All electronics shipped in bubble wrap…"
          />
        </Field>
        <SaveButton saving={saving === "shipping"} onClick={handleSave} />
      </SectionCard>
    </div>
  );
}
