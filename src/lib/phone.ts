// src/lib/phone.ts
//
// Same rules as the backend (lib/phone.js): people can type a number any
// way — "024 123 4567", "+233 24-123-4567", "233241234567" — and it's
// read as one number. The server normalises again; this is so the form
// can say "that doesn't look right" before sending.

const COUNTRY = {
  Ghana: { cc: "233", nsn: 9, first: /^[235]/ },
  Nigeria: { cc: "234", nsn: 10, first: /^[1-9]/ },
} as const;
type Country = keyof typeof COUNTRY;

export function stripPhone(input?: string | null) {
  if (!input) return "";
  let s = String(input).trim().replace(/[\s  -​\-–—.()/\\]/g, "");
  if (s.startsWith("00")) s = `+${s.slice(2)}`;
  const plus = s.startsWith("+");
  s = s.replace(/\D/g, "");
  return plus ? `+${s}` : s;
}

/** E.164 ("+233241234567") or null. */
export function normalizePhone(input?: string | null, country: Country = "Ghana"): string | null {
  const s = stripPhone(input);
  if (!s) return null;
  if (s.startsWith("+")) {
    const d = s.slice(1);
    for (const c of Object.values(COUNTRY)) {
      if (d.startsWith(c.cc)) {
        let rest = d.slice(c.cc.length);
        if (rest.startsWith("0")) rest = rest.slice(1);
        return rest.length === c.nsn && c.first.test(rest) ? `+${c.cc}${rest}` : null;
      }
    }
    return d.length >= 8 && d.length <= 15 ? `+${d}` : null;
  }
  for (const c of Object.values(COUNTRY)) {
    if (s.startsWith(c.cc) && s.length >= c.cc.length + c.nsn) {
      let rest = s.slice(c.cc.length);
      if (rest.startsWith("0")) rest = rest.slice(1);
      if (rest.length === c.nsn && c.first.test(rest)) return `+${c.cc}${rest}`;
    }
  }
  const order: Country[] = country === "Nigeria" ? ["Nigeria", "Ghana"] : ["Ghana", "Nigeria"];
  for (const name of order) {
    const c = COUNTRY[name];
    const rest = s.startsWith("0") ? s.slice(1) : s;
    if (rest.length === c.nsn && c.first.test(rest)) return `+${c.cc}${rest}`;
  }
  return null;
}

/** For wa.me links: digits only, with country code. */
export function whatsappDigits(input?: string | null, country?: Country) {
  const n = normalizePhone(input, country);
  return n ? n.replace(/^\+/, "") : null;
}

export const PHONE_HINT = "e.g. 024 123 4567 or +234 803 123 4567";
