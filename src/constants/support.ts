// src/constants/support.ts — one place for SmileBaba's support contacts
export const SUPPORT_PHONE = "+233269783374";
export const SUPPORT_PHONE_DISPLAY = "+233 26 978 3374";
export const SUPPORT_EMAIL = "support@smilebabahub.com";
export const supportWhatsAppUrl = (message = "Hi SmileBaba Hub, I need help with ") =>
  `https://wa.me/233269783374?text=${encodeURIComponent(message)}`;
