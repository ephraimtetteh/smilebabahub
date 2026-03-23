"use client";

import {
  SectionCard,
  Field,
  Input,
  Select,
  Textarea,
  SaveButton,
} from "../(component)/Ui";

const DELIVERY_ZONES = [
  {
    zone: "Same city delivery",
    eta: "Same day – 24 hrs",
    defaultEnabled: true,
  },
  {
    zone: "Within region / state",
    eta: "1–2 business days",
    defaultEnabled: true,
  },
  {
    zone: "Nationwide (Ghana)",
    eta: "2–4 business days",
    defaultEnabled: true,
  },
  {
    zone: "Nationwide (Nigeria)",
    eta: "3–5 business days",
    defaultEnabled: false,
  },
  { zone: "International", eta: "7–14 business days", defaultEnabled: false },
];

export default function ShippingTab() {
  return (
    <div>
      {/* ── Delivery Zones ── */}
      <SectionCard
        title="Delivery Zones"
        description="Where you can deliver to"
      >
        <div className="space-y-2 sm:space-y-3">
          {DELIVERY_ZONES.map((z) => (
            <div
              key={z.zone}
              className="flex items-center justify-between gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-700 truncate">
                  {z.zone}
                </p>
                <p className="text-xs text-gray-400">{z.eta}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                <input
                  type="checkbox"
                  defaultChecked={z.defaultEnabled}
                  className="sr-only peer"
                />
                <div
                  className="w-10 h-5 bg-gray-200 peer-checked:bg-yellow-500 rounded-full
                    transition peer-checked:after:translate-x-5 after:content-[''] after:absolute
                    after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4
                    after:w-4 after:transition"
                />
              </label>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* ── Delivery Pricing ── */}
      <SectionCard title="Delivery Pricing">
        <Field label="Delivery pricing model">
          <Select>
            <option>Fixed rate per order</option>
            <option>Free delivery (absorbed by seller)</option>
            <option>Buyer pays actual cost</option>
            <option>Free above a minimum order</option>
          </Select>
        </Field>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-5">
          <Field label="Base delivery fee" hint="Charged per order">
            <div className="flex gap-2">
              <Select className="w-20 sm:w-24 flex-shrink-0">
                <option>GHS</option>
                <option>NGN</option>
              </Select>
              <Input type="number" placeholder="20" defaultValue="20" />
            </div>
          </Field>
          <Field
            label="Free delivery threshold"
            hint="Order amount above which delivery is free"
          >
            <div className="flex gap-2">
              <Select className="w-20 sm:w-24 flex-shrink-0">
                <option>GHS</option>
                <option>NGN</option>
              </Select>
              <Input type="number" placeholder="200" />
            </div>
          </Field>
        </div>
        <SaveButton />
      </SectionCard>

      {/* ── Dispatch & Handling ── */}
      <SectionCard title="Dispatch & Handling">
        <Field
          label="Average dispatch time"
          hint="How long after an order is placed before you ship it"
        >
          <Select defaultValue="24">
            <option value="same">Same day</option>
            <option value="24">Within 24 hours</option>
            <option value="48">Within 48 hours</option>
            <option value="72">Within 72 hours</option>
          </Select>
        </Field>
        <Field
          label="Packaging notes"
          hint="Special packaging or handling instructions"
        >
          <Textarea
            rows={2}
            placeholder="e.g. All electronics shipped in bubble wrap and double-boxed"
          />
        </Field>
        <SaveButton />
      </SectionCard>
    </div>
  );
}
