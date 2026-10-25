"use client";
// src/app/ecommerce/global/[id]/page.tsx
//
// One AliExpress product in SmileBaba's design. "Buy on AliExpress" goes to
// our backend's /aliexpress/go/:id, which redirects through the tracked
// link (that's the commission). Clearly labelled so nobody expects
// SmileBaba escrow or delivery on it.

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Globe, Star, Truck, ShieldCheck, Info, ExternalLink, Loader2, ArrowLeft } from "lucide-react";
import { useProducts } from "@/src/hooks/useProducts";
import {
  fetchGlobalProduct,
  buyHref,
  aeThumb,
  formatLocal,
  type GlobalProduct,
} from "@/src/lib/aliexpress";

export default function GlobalProductPage() {
  const { id } = useParams<{ id: string }>();
  const { userCountry } = useProducts();
  const [item, setItem] = useState<GlobalProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!id || !/^\d{6,20}$/.test(String(id))) {
      setError("This product link isn't valid.");
      setLoading(false);
      return;
    }
    setLoading(true);
    fetchGlobalProduct(String(id), userCountry || undefined)
      .then((p) => {
        setItem(p ?? null);
        if (p?.title) document.title = `${p.title} | SmileBaba Global`;
      })
      .catch((e) => setError(e?.response?.data?.message ?? "Couldn't load this product."))
      .finally(() => setLoading(false));
  }, [id, userCountry]);

  // Read on the client only (no Suspense boundary needed)
  const [unavailable, setUnavailable] = useState(false);
  useEffect(() => {
    setUnavailable(new URLSearchParams(window.location.search).get("unavailable") === "1");
  }, []);

  return (
    <main className="mt-20 bg-gray-50 pb-24">
      <div className="mx-auto max-w-[1100px] px-3 sm:px-4">
        <nav className="flex items-center gap-1.5 pt-4 text-xs text-gray-400">
          <Link href="/ecommerce" className="inline-flex items-center gap-1 hover:text-gray-600">
            <ArrowLeft size={12} /> E-Commerce
          </Link>
          <span>/</span>
          <span className="text-gray-600">SmileBaba Global</span>
        </nav>

        {unavailable && (
          <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
            We couldn&apos;t open AliExpress for this product just now. Please try again in a minute.
          </p>
        )}

        {loading ? (
          <div className="flex h-96 items-center justify-center">
            <Loader2 className="animate-spin text-[#FFC105]" />
          </div>
        ) : !item ? (
          <div className="mt-6 rounded-2xl border border-gray-100 bg-white py-20 text-center">
            <Globe className="mx-auto text-gray-300" size={30} />
            <p className="mt-3 text-sm text-gray-600">
              {error ?? "This product isn't available or doesn't ship to your country."}
            </p>
            <Link href="/ecommerce" className="mt-4 inline-block rounded-full bg-[#FFC105] px-5 py-2 text-sm font-bold text-gray-900">
              Back to the shop
            </Link>
          </div>
        ) : (
          <div className="mt-4 grid gap-6 rounded-3xl border border-gray-100 bg-white p-4 sm:p-6 md:grid-cols-2">
            {/* Gallery */}
            <div>
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={aeThumb(item.images[active] ?? item.image, 800)}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
                <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-md bg-gray-900 px-2 py-1 text-[10px] font-extrabold tracking-wide text-[#FFC105]">
                  <Globe size={10} /> SMILEBABA GLOBAL
                </span>
              </div>
              {item.images.length > 1 && (
                <div className="mt-3 flex gap-2 overflow-x-auto">
                  {item.images.map((u, i) => (
                    <button
                      key={u}
                      onClick={() => setActive(i)}
                      className={`h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border-2 ${
                        i === active ? "border-[#FFC105]" : "border-transparent"
                      }`}
                      aria-label={`Image ${i + 1}`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={aeThumb(u, 120)} alt="" referrerPolicy="no-referrer" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex flex-col">
              <h1 className="text-lg font-bold leading-snug text-gray-900 sm:text-xl">{item.title}</h1>

              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-gray-600">
                {item.rating ? (
                  <span className="inline-flex items-center gap-1">
                    <Star size={14} className="fill-[#FFC105] text-[#FFC105]" />
                    {item.rating.toFixed(1)}% positive
                  </span>
                ) : null}
                {item.orders > 0 && <span>{item.orders.toLocaleString()} sold</span>}
                {item.shop && <span className="text-gray-400">Store: {item.shop}</span>}
              </div>

              <div className="mt-4 flex flex-wrap items-end gap-3">
                <span className="text-3xl font-black text-gray-900">≈ {formatLocal(item.price)}</span>
                {(item.price.localWas || item.price.usdWas) && (
                  <span className="mb-1 text-sm text-gray-400 line-through">{formatLocal(item.price, "was")}</span>
                )}
                {item.discount && (
                  <span className="mb-1.5 rounded-md bg-[#FFC105] px-2 py-0.5 text-xs font-extrabold text-gray-900">
                    -{item.discount}
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-gray-500">
                US${item.price.usd.toFixed(2)} on AliExpress. Final price, shipping and any import duties are shown at
                AliExpress checkout.
              </p>

              <a
                href={buyHref(item.id, item.title)}
                target="_blank"
                rel="sponsored noopener noreferrer"
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#FFC105] py-4 text-base font-black text-gray-900 transition hover:bg-yellow-300"
              >
                Buy on AliExpress <ExternalLink size={17} />
              </a>

              <div className="mt-6 space-y-3 rounded-2xl bg-gray-50 p-4 text-sm">
                <Row icon={<Truck size={16} />} title={item.shipDays ? `Delivery in about ${item.shipDays} days` : "Ships internationally"} hint={`To ${userCountry || "Ghana / Nigeria"}, by AliExpress`} />
                <Row icon={<ShieldCheck size={16} />} title="AliExpress Buyer Protection" hint="Refunds and disputes are handled by AliExpress" />
                <Row icon={<Info size={16} />} title="You pay on AliExpress" hint="This item isn't covered by SmileBaba escrow. SmileBaba may earn a commission when you buy." />
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function Row({ icon, title, hint }: { icon: React.ReactNode; title: string; hint: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-gray-900">{icon}</span>
      <div>
        <p className="font-bold text-gray-900">{title}</p>
        <p className="text-xs text-gray-500">{hint}</p>
      </div>
    </div>
  );
}
