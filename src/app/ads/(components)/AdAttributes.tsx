"use client";

// src/components/ads/AdAttributes.tsx
import { memo } from "react";
import { Ad } from "@/src/types/ad.types";
import { CONDITION_LABELS, formatDate } from "./ad.constants";

function AttrRow({ label, value }: { label: string; value: React.ReactNode }) {
  if (!value) return null;
  return (
    <div
      className="flex items-start justify-between py-2.5
      border-b border-gray-100 last:border-0"
    >
      <span className="text-xs text-gray-500 font-medium capitalize">
        {label}
      </span>
      <span className="text-xs text-gray-800 font-semibold text-right ml-4 max-w-[60%]">
        {value}
      </span>
    </div>
  );
}

interface AdAttributesProps {
  ad: Ad;
}

const AdAttributes = memo(function AdAttributes({ ad }: AdAttributesProps) {
  const hasAttributes = ad.attributes && ad.attributes.length > 0;

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
      <h2 className="text-base font-bold text-gray-900 mb-3">Details</h2>
      <div>
        {/* Dynamic EAV attributes from the model */}
        {hasAttributes &&
          ad.attributes.map((attr) => (
            <AttrRow
              key={attr.key}
              label={attr.key.replace(/_/g, " ")}
              value={String(attr.value)}
            />
          ))}

        {/* Fixed attributes always shown */}
        <AttrRow
          label="Condition"
          value={CONDITION_LABELS[ad.condition] ?? "—"}
        />
        <AttrRow
          label="Location"
          value={[ad.location?.city, ad.location?.region]
            .filter(Boolean)
            .join(", ")}
        />
        <AttrRow
          label="Delivery"
          value={
            ad.delivery?.available
              ? ad.delivery.option?.replace(/_/g, " ")
              : "Pickup only"
          }
        />
        {ad.delivery?.available && ad.delivery.fee > 0 && (
          <AttrRow
            label="Delivery fee"
            value={`${ad.price?.currency === "NGN" ? "₦" : "₵"}${ad.delivery.fee}`}
          />
        )}
        {ad.delivery?.note && (
          <AttrRow label="Delivery note" value={ad.delivery.note} />
        )}
        <AttrRow label="Posted" value={formatDate(ad.createdAt)} />
        <AttrRow
          label="Listing expires"
          value={ad.expiresAt ? formatDate(ad.expiresAt) : "—"}
        />
        <AttrRow label="Ad ID" value={ad._id?.slice(-8).toUpperCase()} />
      </div>
    </div>
  );
});

export default AdAttributes;
