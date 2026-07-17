// frontend/components/promote/PricingTier.tsx
//
// Single pricing tier card. Used in a grid on the promote page.

"use client";

import { Check, Sparkles } from "lucide-react";

export interface Plan {
  tier: string;
  name: string;
  price: number;
  currency: string;
  currencySymbol: string;
  duration: number; // days
  adsAllowed: number; // -1 = unlimited
  features: string[];
  popular?: boolean;
}

interface Props {
  plan: Plan;
  selected: boolean;
  onSelect: () => void;
}

export function PricingTier({ plan, selected, onSelect }: Props) {
  const isFree = plan.price === 0;

  return (
    <button
      onClick={onSelect}
      className={`relative text-left rounded-2xl p-6 border-2 transition-all ${
        selected
          ? plan.popular
            ? "bg-gray-900 text-white border-yellow-400 shadow-lg scale-[1.02]"
            : "bg-white border-yellow-400 shadow-lg scale-[1.02]"
          : plan.popular
            ? "bg-gray-900 text-white border-gray-700 hover:border-yellow-400/50"
            : "bg-white border-gray-200 hover:border-gray-300"
      }`}
    >
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-[10px] font-black tracking-wider flex items-center gap-1">
          <Sparkles size={11} />
          MOST POPULAR
        </div>
      )}

      <div
        className={`text-xs font-black ${plan.popular ? "text-yellow-400" : "text-yellow-700"}`}
      >
        {plan.name.toUpperCase()}
      </div>

      <div className="mt-3 flex items-baseline gap-1">
        {isFree ? (
          <span
            className={`text-3xl font-black ${plan.popular ? "text-white" : "text-gray-900"}`}
          >
            Free
          </span>
        ) : (
          <>
            <span
              className={`text-lg font-bold ${plan.popular ? "text-gray-400" : "text-gray-500"}`}
            >
              {plan.currencySymbol}
            </span>
            <span
              className={`text-3xl font-black ${plan.popular ? "text-white" : "text-gray-900"}`}
            >
              {plan.price.toLocaleString()}
            </span>
            <span
              className={`text-xs ${plan.popular ? "text-gray-400" : "text-gray-500"}`}
            >
              /mo
            </span>
          </>
        )}
      </div>

      <div
        className={`text-xs mt-1 ${plan.popular ? "text-gray-400" : "text-gray-500"}`}
      >
        {plan.adsAllowed === -1
          ? "Unlimited ads"
          : `${plan.adsAllowed} ad${plan.adsAllowed === 1 ? "" : "s"}`}
        {" · "}
        {plan.duration} day{plan.duration === 1 ? "" : "s"}
      </div>

      <ul
        className={`mt-5 space-y-2 text-sm ${plan.popular ? "text-gray-300" : "text-gray-600"}`}
      >
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <Check
              size={14}
              className={`flex-shrink-0 mt-0.5 ${plan.popular ? "text-yellow-400" : "text-yellow-600"}`}
            />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      {selected && (
        <div className="absolute top-3 right-3">
          <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
            <Check size={14} className="text-gray-900" strokeWidth={3} />
          </div>
        </div>
      )}
    </button>
  );
}
