// account/types.ts — shared types, constants and helpers

export type OrderStatus = "pending" | "confirmed" | "delivered" | "cancelled";
export type BookingStatus =
  | "pending"
  | "confirmed"
  | "checked_in"
  | "checked_out"
  | "cancelled";

export type OrderItem = {
  name: string;
  qty: number;
  price: number;
};

export type Order = {
  _id: string;
  items: OrderItem[];
  total: number;
  currency: string;
  status: OrderStatus;
  vendor: string;
  createdAt: string;
  deliveryAddress?: string;
};

export type Booking = {
  _id: string;
  propertyName: string;
  propertyType: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  currency: string;
  status: BookingStatus;
  vendor: string;
  createdAt: string;
};

export const ORDER_STATUS_STYLE: Record<OrderStatus, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  delivered: "bg-green-100 text-green-600",
  cancelled: "bg-red-100 text-red-500",
};

export const BOOKING_STATUS_STYLE: Record<BookingStatus, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  checked_in: "bg-green-100 text-green-600",
  checked_out: "bg-gray-100 text-gray-500",
  cancelled: "bg-red-100 text-red-500",
};

export const STATUS_LABEL: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  delivered: "Delivered",
  cancelled: "Cancelled",
  checked_in: "Checked in",
  checked_out: "Checked out",
};

export const PROPERTY_ICON: Record<string, string> = {
  apartment: "🏢",
  "beach-house": "🏖️",
  villa: "🏡",
  studio: "🛏️",
  duplex: "🏘️",
  townhouse: "🏠",
  "luxury-apartment": "✨",
  default: "🏠",
};

export const ORDER_STATUSES = [
  "all",
  "pending",
  "confirmed",
  "delivered",
  "cancelled",
] as const;
export const BOOKING_STATUSES = [
  "all",
  "pending",
  "confirmed",
  "checked_in",
  "checked_out",
  "cancelled",
] as const;

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GH", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function nights(checkIn: string, checkOut: string) {
  const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime();
  return Math.max(1, Math.round(diff / (1000 * 60 * 60 * 24)));
}

export function currencySymbol(currency: string) {
  return currency === "NGN" ? "₦" : "₵";
}
