"use client";

// src/components/ads/ContactCard.tsx
import { memo, useState } from "react";
import { Phone, MessageCircle, Shield } from "lucide-react";
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
            {typeof ad.postedBy === "object" && (ad.postedBy as any)?.username
              ? `@${(ad.postedBy as any).username} · `
              : ""}
            Member on SmileBaba
          </p>
        </div>
      </div>

      {ad.contact?.showPhone && (
        <div className="mb-3">
          {!revealed ? (
            <button
              onClick={handleReveal}
              className="w-full flex items-center justify-center gap-2 py-3
                bg-yellow-400 text-black font-bold rounded-2xl hover:bg-yellow-300
                transition text-sm active:scale-[0.99]"
            >
              <Phone size={15} /> Show phone number
            </button>
          ) : (
            <a
              href={`tel:${ad.contact.phone}`}
              className="w-full flex items-center justify-center gap-2 py-3
                bg-green-500 text-white font-bold rounded-2xl hover:bg-green-400
                transition text-sm"
            >
              <Phone size={15} /> {ad.contact.phone}
            </a>
          )}
        </div>
      )}

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
          <MessageCircle size={15} /> Chat on WhatsApp
        </a>
      )}

      <div className="flex items-start gap-2 text-[11px] text-gray-400 leading-relaxed">
        <Shield size={12} className="flex-shrink-0 mt-0.5 text-gray-300" />
        For your safety, meet in a public place and inspect before payment.
        Never transfer money in advance.
      </div>
    </div>
  );
});

export default ContactCard;
