export type Tab =
  | "profile"
  | "store"
  | "payments"
  | "notifications"
  | "security"
  | "promotion"
  | "shipping"
  | "kyc";

export interface VideoFile {
  file: File;
  preview: string;
  name: string;
  size: string;
  duration?: string;
}

export interface TabConfig {
  id: Tab;
  label: string;
  icon: string;
  description: string;
}

export const TABS: TabConfig[] = [
  {
    id: "profile",
    label: "Profile",
    icon: "👤",
    description: "Manage your personal information and public identity",
  },
  {
    id: "store",
    label: "Store",
    icon: "🏪",
    description: "Customise your store appearance, policies and hours",
  },
  {
    id: "payments",
    label: "Payments",
    icon: "💳",
    description: "Configure payout methods and financial details",
  },
  {
    id: "shipping",
    label: "Shipping",
    icon: "🚚",
    description: "Set delivery zones, fees and dispatch times",
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: "🔔",
    description: "Choose what updates you receive and how",
  },
  {
    id: "promotion",
    label: "Promotion",
    icon: "🎬",
    description: "Submit a promotional video to be featured by Smilebaba",
  },
  {
    id: "kyc",
    label: "Verification",
    icon: "🪪",
    description: "Verify your identity to unlock full vendor access",
  },
  {
    id: "security",
    label: "Security",
    icon: "🔐",
    description: "Password, two-factor auth and active sessions",
  },
];

export function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}
