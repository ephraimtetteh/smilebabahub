// src/components/ads/ProductDetail/ad.types.ts

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

// AdForModal — kept as alias for Ad for backward compatibility
export type AdForModal = Ad;

export interface ModalProps {
  ad: Ad;
  sym: string;
  onClose: () => void;
}
