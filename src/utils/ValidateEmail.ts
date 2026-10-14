// src/utils/validateEmail.ts
// Client-side email validation — instant feedback before the API call.
// Mirrors the server-side checks except DNS MX (can't do that in the browser).
// The server always performs the full check including DNS.

// Same blocklist as server — keep in sync with lib/validateEmail.js
const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com",
  "guerrillamail.com",
  "guerrillamail.net",
  "guerrillamail.org",
  "guerrillamail.de",
  "guerrillamail.info",
  "throwam.com",
  "throwaway.email",
  "trashmail.com",
  "trashmail.me",
  "trashmail.net",
  "trashmail.at",
  "trashmail.io",
  "yopmail.com",
  "yopmail.fr",
  "tempr.email",
  "temp-mail.org",
  "temp-mail.io",
  "temp-mail.de",
  "tempmail.com",
  "tempmail.net",
  "tempmail.de",
  "tempmail.us",
  "10minutemail.com",
  "10minutemail.net",
  "10minutemail.org",
  "sharklasers.com",
  "grr.la",
  "spam4.me",
  "spamgourmet.com",
  "maildrop.cc",
  "dispostable.com",
  "discard.email",
  "discardmail.com",
  "fakeinbox.com",
  "fakeinbox.org",
  "mailnesia.com",
  "getnada.com",
  "nada.email",
  "filzmail.com",
  "meltmail.com",
  "deadaddress.com",
  "incognitomail.com",
  "mytrashmail.com",
  "mailscrap.com",
  "spambox.us",
  "spambox.info",
  "dispostable.me",
  "no-spam.ws",
]);

const EMAIL_REGEX = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

export interface EmailValidationResult {
  valid: boolean;
  reason?: string;
}

/**
 * Client-side email validation.
 * Checks format and disposable domain blocklist.
 * Always call the server too — it additionally verifies DNS MX records.
 */
export function validateEmailClient(email: string): EmailValidationResult {
  if (!email?.trim()) {
    return { valid: false, reason: "Email is required" };
  }

  const trimmed = email.trim().toLowerCase();

  if (!EMAIL_REGEX.test(trimmed)) {
    return { valid: false, reason: "Please enter a valid email address" };
  }

  const domain = trimmed.split("@")[1];

  if (DISPOSABLE_DOMAINS.has(domain)) {
    return {
      valid: false,
      reason:
        "Disposable email addresses are not allowed. Please use your real email.",
    };
  }

  return { valid: true };
}
