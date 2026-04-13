// src/components/ads/ProductDetail/ad.types.ts
// AdMode drives the CTA and modal shown on the ad detail page.

// Re-export the canonical Ad type so modals can import from one place
export type {
  Ad,
  AdImage,
  AdCondition,
  DeliveryOption,
} from "@/src/types/ad.types";
import type { Ad } from "@/src/types/ad.types";

export type AdMode =
  | "marketplace"
  | "food"
  | "apartments"
  | "fashion"
  | "delivery"
  | "pharmacy"
  | "services";

// Shared props for every modal — uses the canonical Ad type
export interface ModalProps {
  ad: Ad;
  sym: string;
  onClose: () => void;
}
