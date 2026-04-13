"use client";
// src/components/ads/DeliveryTracker.tsx
// Live-ish delivery tracking badge shown on delivery category ad detail pages.
// Uses OpenStreetMap (free, no API key) embedded via an iframe for the map view.
// The actual tracking co-ordinates would come from the vendor updating their location —
// for now it shows the vendor's listed address on a map.

import { useState } from "react";
import {
  MapPin,
  Navigation,
  Phone,
  MessageCircle,
  ExternalLink,
  X,
} from "lucide-react";

interface DeliveryTrackerProps {
  vendorName: string;
  vendorPhone?: string;
  whatsapp?: string;
  city?: string;
  region?: string;
  address?: string;
  coordinates?: { lat: number; lng: number } | null;
}

// Build OpenStreetMap embed URL
function buildMapUrl(
  address: string | null | undefined,
  city: string | null | undefined,
  region: string | null | undefined,
  coords: { lat: number | null; lng: number | null } | null | undefined,
): string {
  if (coords?.lat != null && coords?.lng != null) {
    // If vendor has set coordinates, use them
    const { lat, lng } = coords;
    return `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.01}%2C${lat - 0.01}%2C${lng + 0.01}%2C${lat + 0.01}&layer=mapnik&marker=${lat}%2C${lng}`;
  }
  // Fall back to place search
  const place = [address, city, region, "Ghana"].filter(Boolean).join(", ");
  const encoded = encodeURIComponent(place);
  return `https://www.openstreetmap.org/export/embed.html?layer=mapnik&q=${encoded}`;
}

function buildDirectionsUrl(
  city: string | null | undefined,
  region: string | null | undefined,
  coords: { lat: number | null; lng: number | null } | null | undefined,
): string {
  if (coords?.lat != null && coords?.lng != null) {
    return `https://www.openstreetmap.org/?mlat=${coords.lat}&mlon=${coords.lng}&zoom=15`;
  }
  const place = [city, region].filter(Boolean).join(", ");
  return `https://www.openstreetmap.org/search?query=${encodeURIComponent(place)}`;
}

export default function DeliveryTracker({
  vendorName,
  vendorPhone,
  whatsapp,
  city,
  region,
  address,
  coordinates,
}: DeliveryTrackerProps) {
  const [mapOpen, setMapOpen] = useState(false);

  const locationLabel =
    [address, city, region].filter(Boolean).join(", ") || "Location not set";
  const mapUrl = buildMapUrl(address, city, region, coordinates);
  const directionsUrl = buildDirectionsUrl(city, region, coordinates);
  const whatsappHref = whatsapp
    ? `https://wa.me/${(whatsapp ?? "").replace(/[^0-9]/g, "")}?text=Hi, I need a delivery`
    : null;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
      {/* Header */}
      <div
        className="px-4 py-3 bg-gradient-to-r from-teal-50 to-blue-50
        border-b border-teal-100 flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-teal-500 rounded-lg flex items-center justify-center">
            <Navigation size={14} className="text-white" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-900">
              Delivery by {vendorName}
            </p>
            <p className="text-[10px] text-gray-500">
              Tap to view location on map
            </p>
          </div>
        </div>
        <span
          className="flex items-center gap-1 text-[10px] font-bold
          text-teal-600 bg-teal-100 px-2 py-0.5 rounded-full"
        >
          <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-pulse" />
          Available
        </span>
      </div>

      {/* Location */}
      <div className="px-4 py-3">
        <button
          onClick={() => setMapOpen(!mapOpen)}
          className="w-full flex items-center gap-2.5 text-left group"
        >
          <MapPin size={15} className="text-teal-500 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-gray-800 truncate">
              {locationLabel}
            </p>
            <p className="text-[10px] text-teal-600 group-hover:underline">
              {mapOpen ? "Hide map" : "View on map →"}
            </p>
          </div>
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex-shrink-0 flex items-center gap-1 text-[10px] font-semibold
              text-gray-500 hover:text-gray-700 px-2 py-1 rounded-lg
              hover:bg-gray-50 transition"
          >
            <ExternalLink size={11} /> Directions
          </a>
        </button>

        {/* Map iframe */}
        {mapOpen && (
          <div
            className="mt-3 rounded-xl overflow-hidden border border-gray-100
            relative"
          >
            <iframe
              src={mapUrl}
              width="100%"
              height="220"
              style={{ border: 0 }}
              loading="lazy"
              title={`${vendorName} location`}
              className="block"
            />
            <button
              onClick={() => setMapOpen(false)}
              className="absolute top-2 right-2 p-1 bg-white/90 rounded-lg
                hover:bg-white transition shadow-sm"
            >
              <X size={12} className="text-gray-600" />
            </button>
          </div>
        )}
      </div>

      {/* Contact actions */}
      <div className="px-4 pb-4 flex gap-2">
        {vendorPhone && (
          <a
            href={`tel:${vendorPhone}`}
            className="flex-1 flex items-center justify-center gap-1.5
              bg-gray-900 text-white text-xs font-bold py-2.5 rounded-xl
              hover:bg-gray-700 transition"
          >
            <Phone size={13} /> Call
          </a>
        )}
        {whatsappHref && (
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5
              bg-green-500 text-white text-xs font-bold py-2.5 rounded-xl
              hover:bg-green-600 transition"
          >
            <MessageCircle size={13} /> WhatsApp
          </a>
        )}
      </div>
    </div>
  );
}
