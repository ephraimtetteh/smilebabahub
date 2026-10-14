// client/src/lib/util/listingPolicy.ts
//
// What a buyer can do on a listing, decided by category.
//
// This mirrors mobile/src/lib/util/listingPolicy.ts exactly. The two have
// to agree — a buyer who sees a phone number on the website and not in
// the app will use the website, and the commission goes with them.
//
// ─── THE COMMERCIAL RULE ─────────────────────────────────────────────
//
// Marketplace is classifieds. People negotiate, inspect, meet. Hiding
// contact there makes the category unusable, and there's often no price
// to charge commission on anyway.
//
// E-Commerce, Food and Stays are transactional. The sale should complete
// on-platform, where escrow protects the buyer and the 5% is collected.
// Any route off-platform takes both with it, so none is offered.
//
// Contact opens up *after* payment — the order and booking pages show
// the vendor's chat and phone once money has moved. A paying customer
// needs to reach their vendor; a browser doesn't.

export interface Ad {
  _id: string;
  title?: string;
  price?: { amount?: number; currency?: string } | number;
  category?: { main?: string; sub?: string; leaf?: string } | string;
  isSold?: boolean;
  isPaused?: boolean;
  isActive?: boolean;
  postedBy?: {
    _id?: string;
    username?: string;
    storeName?: string;
    storeSlug?: string;
    phone?: string;
    whatsapp?: string;
    storePhone?: string;
    isSubscribed?: boolean;
    subscription?: { plan?: string; expiresAt?: string };
  };
  subscription?: { plan?: string; planPriority?: number };
  [key: string]: unknown;
}

export interface ListingPolicy {
  /** Cart and Buy Now */
  canAddToCart: boolean;
  /** Date-based booking instead of a cart */
  canBook: boolean;
  /** In-app chat button */
  showChat: boolean;
  /** Tap-to-call */
  showPhone: boolean;
  /** WhatsApp handoff */
  showWhatsApp: boolean;
  /** Buyer-protection note under the action */
  showEscrowNote: boolean;
  /** Why contact isn't shown, when it isn't. null when nothing to explain. */
  contactNote: string | null;
}

/**
 * Chat before buying, on transactional listings.
 *
 * In-app chat doesn't leak the commission — a phone number does. Chat
 * keeps the conversation here, where checkout is the only way to pay.
 * The real leak inside chat is someone typing their number into it,
 * which is a masking problem rather than a reason to remove chat.
 *
 * Set to true to try the other way. Keep it identical to the mobile
 * constant or the two platforms will disagree.
 */
const ALLOW_PRE_PURCHASE_CHAT = false;

const STAYS = new Set(["apartments", "properties"]);

const TRANSACTIONAL = new Set([
  "ecommerce",
  "phones",
  "fashion",
  "home-office",
  "food",
  "pharmacy",
]);

const CLASSIFIED = new Set([
  "marketplace",
  "jobs",
  "events",
  "delivery",
  "vendors",
]);

// ─── Field readers ───────────────────────────────────────────────────
// The API returns price as { amount, currency } and category as
// { main, sub, leaf }. Older documents have flat values, so both shapes
// are handled in one place rather than at every call site.

export function getCategory(ad?: Ad | null): string {
  const c = ad?.category;
  if (!c) return "";
  if (typeof c === "string") return c.toLowerCase();
  return String(c.main ?? "").toLowerCase();
}

export function getPrice(ad?: Ad | null): number {
  const p = ad?.price;
  if (p && typeof p === "object") return Number(p.amount) || 0;
  return Number(p) || 0;
}

export function getSymbol(ad?: Ad | null): string {
  const p = ad?.price;
  const c = p && typeof p === "object" ? p.currency : undefined;
  return c === "NGN" ? "₦" : "GH₵";
}

export function isVendorSubscribed(ad?: Ad | null): boolean {
  const v = ad?.postedBy;
  if (v?.isSubscribed) return true;

  const plan = v?.subscription?.plan;
  if (!plan || plan === "Basic") {
    // The snapshot on the ad itself, for listings whose vendor wasn't
    // populated
    return (ad?.subscription?.planPriority ?? 0) >= 1;
  }

  const expiry = v.subscription?.expiresAt;
  return !expiry || new Date(expiry) > new Date();
}

// ─── The rules ───────────────────────────────────────────────────────

export function isStay(ad?: Ad | null): boolean {
  return STAYS.has(getCategory(ad));
}

export function isClassified(ad?: Ad | null): boolean {
  return CLASSIFIED.has(getCategory(ad));
}

export function isTransactional(ad?: Ad | null): boolean {
  const c = getCategory(ad);
  return TRANSACTIONAL.has(c) || STAYS.has(c);
}

/**
 * Can this go in the cart?
 *
 * Stays can't — holding dates in a cart would let two people both
 * "have" the same nights, and whoever pays second hits an error at the
 * worst possible moment.
 */
export function canAddToCart(ad?: Ad | null): boolean {
  if (!ad) return false;
  if (isStay(ad)) return false;
  if (ad.isSold || ad.isPaused || ad.isActive === false) return false;
  return getPrice(ad) > 0;
}

export function getListingPolicy(ad?: Ad | null): ListingPolicy {
  const category = getCategory(ad);
  const hasPrice = getPrice(ad) > 0;
  const subscribed = isVendorSubscribed(ad);
  const sellable =
    hasPrice && !ad?.isSold && !ad?.isPaused && ad?.isActive !== false;

  // ── Stays: book by date. No contact until the booking exists. ─────
  if (STAYS.has(category)) {
    return {
      canAddToCart: false,
      canBook: sellable,
      showChat: ALLOW_PRE_PURCHASE_CHAT,
      showPhone: false,
      showWhatsApp: false,
      showEscrowNote: true,
      contactNote:
        "Book through SmileBaba and you'll be able to message the host straight away. Your payment is held until you check in.",
    };
  }

  // ── Retail and food: buy on-platform. Contact comes with the order. ─
  if (TRANSACTIONAL.has(category)) {
    return {
      canAddToCart: sellable,
      canBook: false,
      showChat: ALLOW_PRE_PURCHASE_CHAT,
      showPhone: false,
      showWhatsApp: false,
      showEscrowNote: true,
      contactNote:
        "Order through SmileBaba and you can message the vendor about your order. Your payment is held until you confirm delivery.",
    };
  }

  // ── Classifieds: contact is the point. Gated on subscription. ─────
  if (CLASSIFIED.has(category)) {
    return {
      canAddToCart: sellable,
      canBook: false,
      showChat: true,
      showPhone: subscribed,
      showWhatsApp: subscribed,
      showEscrowNote: hasPrice,
      contactNote: subscribed
        ? null
        : "This vendor hasn't verified their store yet. Message them here, and buy through checkout so your payment is protected.",
    };
  }

  // ── Unknown category: behave like classifieds, gated. ─────────────
  return {
    canAddToCart: sellable,
    canBook: false,
    showChat: true,
    showPhone: subscribed,
    showWhatsApp: subscribed,
    showEscrowNote: hasPrice,
    contactNote: subscribed
      ? null
      : "Message this vendor here, and buy through checkout so your payment is protected.",
  };
}

/**
 * True once the buyer has a relationship with this vendor — an order or
 * a booking. Order and booking pages use this to decide whether to show
 * contact; a paying customer needs to reach their vendor.
 */
export function canContactAfterPurchase(status?: string): boolean {
  return !!status && status !== "pending";
}
