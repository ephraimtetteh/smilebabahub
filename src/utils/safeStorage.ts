// client/src/utils/safeStorage.ts
//
// localStorage that can't be handed rubbish.
//
// ─── WHY THIS CHANGED ────────────────────────────────────────────────
//
// The old version passed straight through to localStorage.setItem, which
// coerces whatever it's given to a string. So:
//
//     safeStorage.set("accessToken", undefined)
//
// wrote the literal five characters "undefined". Reading it back gave a
// truthy string, the axios interceptor attached `Bearer undefined` to
// every request, the backend 401'd, the interceptor refreshed, got a 200
// with no token, stored "undefined" again — and looped until the tab was
// closed.
//
// Nothing threw. The type signature said `value: string`, and TypeScript
// was satisfied because `res.data.accessToken` is `any`.
//
// So set() now refuses junk and get() never returns it, which closes the
// hole at both ends rather than trusting every call site.

/** Values localStorage will happily store but nothing should read back. */
const JUNK = new Set(["undefined", "null", "NaN", ""]);

export const safeStorage = {
  /**
   * Returns null rather than a junk string, so `if (token)` means what
   * it looks like it means.
   */
  get: (key: string): string | null => {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return null;

      const trimmed = raw.trim();
      if (JUNK.has(trimmed)) {
        // Clean it up while we're here — a junk value that stays put
        // will be read again on the next request
        localStorage.removeItem(key);
        return null;
      }

      return raw;
    } catch {
      // Private browsing, disabled storage, SSR
      return null;
    }
  },

  /**
   * Refuses undefined, null and junk strings. Storing nothing is always
   * better than storing something unusable, because unusable values look
   * present to every check downstream.
   *
   * Returns whether the value was actually stored, so a caller can react
   * rather than assume.
   */
  set: (key: string, value: unknown): boolean => {
    try {
      if (typeof value !== "string" || JUNK.has(value.trim())) {
        localStorage.removeItem(key);
        return false;
      }
      localStorage.setItem(key, value);
      return true;
    } catch {
      return false;
    }
  },

  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch {
      /* nothing to do */
    }
  },

  /** Convenience for JSON values, with the same guarantees. */
  getJSON: <T>(key: string): T | null => {
    const raw = safeStorage.get(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      // Corrupt JSON is junk too
      safeStorage.remove(key);
      return null;
    }
  },

  setJSON: (key: string, value: unknown): boolean => {
    try {
      if (value === undefined || value === null) {
        localStorage.removeItem(key);
        return false;
      }
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },
};
