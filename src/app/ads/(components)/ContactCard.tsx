"use client";

// src/components/ads/ContactCard.tsx
import { memo, useState } from "react";
import { Ad } from "@/src/types/ad.types";

interface ContactCardProps {
  ad: Ad;
  onReveal: () => void;
  onWhatsApp: () => void;
}

const ContactCard = memo(function ContactCard({
  ad,
  onReveal,
  onWhatsApp,
}: ContactCardProps) {
  const [revealed, setRevealed] = useState(false);

  const handleReveal = () => {
    setRevealed(true);
    onReveal();
  };

  const waNumber = ad.contact?.whatsapp?.replace(/\D/g, "");
  const waMsg = encodeURIComponent(
    `Hi, I saw your ad for "${ad.title}" on SmileBaba`,
  );

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
      <h2 className="text-base font-bold text-gray-900 mb-4">Contact seller</h2>

      {/* Poster info */}
      <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100">
        <div
          className="w-12 h-12 rounded-full bg-yellow-400 text-black font-black
          flex items-center justify-center text-lg flex-shrink-0"
        >
          {ad.contact?.name?.charAt(0)?.toUpperCase() ?? "?"}
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-gray-900 text-sm truncate">
            {ad.contact?.name}
          </p>
          <p className="text-xs text-gray-400">
            {ad.postedBy?.username ? `@${ad.postedBy.username} · ` : ""}
            Member on SmileBaba
          </p>
        </div>
      </div>

      {/* Phone reveal */}
      {ad.contact?.showPhone && (
        <div className="mb-3">
          {!revealed ? (
            <button
              onClick={handleReveal}
              className="w-full py-3 bg-yellow-400 text-black font-bold rounded-2xl
                hover:bg-yellow-300 transition text-sm active:scale-[0.99]"
            >
              📞 Show phone number
            </button>
          ) : (
            <a
              href={`tel:${ad.contact.phone}`}
              className="w-full flex items-center justify-center gap-2 py-3
                bg-green-500 text-white font-bold rounded-2xl hover:bg-green-400
                transition text-sm"
            >
              📞 {ad.contact.phone}
            </a>
          )}
        </div>
      )}

      {/* WhatsApp */}
      {waNumber && (
        <a
          href={`https://wa.me/${waNumber}?text=${waMsg}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onWhatsApp}
          className="w-full flex items-center justify-center gap-2 py-3
            bg-[#25D366] text-white font-bold rounded-2xl hover:opacity-90
            transition text-sm mb-3"
        >
          💬 Chat on WhatsApp
        </a>
      )}

      <p className="text-[11px] text-gray-400 text-center leading-relaxed">
        🔒 For your safety, meet in a public place and inspect before payment.
        Never transfer money in advance.
      </p>
    </div>
  );
});

export default ContactCard;
