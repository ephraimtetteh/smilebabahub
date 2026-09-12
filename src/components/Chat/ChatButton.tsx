"use client";

// client/src/components/Chat/ChatButton.tsx
//
// ─── WHY THIS IS GATED NOW ───────────────────────────────────────────
//
// The button rendered on every listing. On a phone or an apartment
// that's a route off-platform: the conversation starts in chat, someone
// types a number, and the sale completes over WhatsApp. The buyer loses
// escrow and SmileBaba loses the 5%.
//
// Marketplace is different. It's classifieds — people negotiate, ask
// questions, arrange to meet — and hiding contact there makes the
// category unusable.
//
// So the rules come from listingPolicy, the same file the app uses. Pass
// the ad and the button decides. If it can't show, it renders nothing
// rather than a disabled button, because a disabled button invites
// someone to work out how to enable it.
//
// ─── AFTER PURCHASE IS DIFFERENT ─────────────────────────────────────
//
// Someone who has paid needs to reach their vendor. The order and
// booking pages pass `force` to bypass the category rule — a paying
// customer is not a browser.

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { toast } from "react-toastify";

import { useAppSelector } from "@/src/app/redux";
import { getListingPolicy, type Ad } from "@/src/lib/util/listingPolicy";

interface ChatButtonProps {
  sellerId: string;
  sellerName: string;
  /** The listing this is on. Omit only with `force`. */
  ad?: Ad | null;
  /**
   * Show regardless of category. For order and booking pages, where the
   * buyer has already paid and needs to reach the vendor.
   */
  force?: boolean;
  className?: string;
  label?: string;
}

export default function ChatButton({
  sellerId,
  sellerName,
  ad,
  force = false,
  className,
  label = "Message seller",
}: ChatButtonProps) {
  const user = useAppSelector((s) => s.auth.user);
  const router = useRouter();

  const allowed = force || (ad ? getListingPolicy(ad).showChat : true);

  const handleClick = useCallback(() => {
    if (!user) {
      const target = `/chat?with=${sellerId}&name=${encodeURIComponent(sellerName)}`;
      localStorage.setItem("redirectAfterLogin", target);
      router.push(`/auth/login?returnUrl=${encodeURIComponent(target)}`);
      return;
    }

    const myId = (user as any)._id ?? (user as any).id;
    if (myId === sellerId) {
      toast.info("That's your own listing");
      return;
    }

    router.push(
      `/chat?with=${sellerId}&name=${encodeURIComponent(sellerName)}`,
    );
  }, [user, sellerId, sellerName, router]);

  // Nothing rather than a disabled button. A disabled control is an
  // invitation to find out how to enable it.
  if (!allowed) return null;

  return (
    <button
      onClick={handleClick}
      className={
        className ??
        "flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-gray-200 py-3 text-sm font-bold text-gray-700 transition hover:border-amber-400 hover:text-amber-600"
      }
    >
      <MessageCircle size={15} />
      {label}
    </button>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// HOW TO CALL IT
//
// On an ad detail page — pass the ad, and it decides:
//
//     <ChatButton
//       sellerId={ad.postedBy._id}
//       sellerName={ad.postedBy.storeName ?? ad.postedBy.username}
//       ad={ad}
//     />
//
// On an order or booking page — the buyer has paid, so force it:
//
//     <ChatButton
//       sellerId={order.vendor._id}
//       sellerName={order.vendor.storeName}
//       force
//       label="Message vendor about this order"
//     />
//
//
// ─── THE LEAK THIS DOESN'T CLOSE ─────────────────────────────────────
//
// Chat stays open on marketplace, which is right. But someone can still
// type their number into it, and on a marketplace listing that's fine —
// that category is built on contact.
//
// Where it isn't fine is if you ever set ALLOW_PRE_PURCHASE_CHAT to true
// in listingPolicy. At that point a phone number in a chat on a phone
// listing is the exact leak the policy exists to prevent, and the answer
// is masking rather than closing chat:
//
//     // In the chat message handler, when the ad is transactional
//     const masked = text.replace(
//       /(\+?\d[\d\s\-().]{7,}\d)/g,
//       "[number hidden — keep it on SmileBaba]",
//     );
//
// Worth having ready, because pre-purchase questions probably do convert
// better on a ₵2,000 stay than silence does.
// ═══════════════════════════════════════════════════════════════════════
