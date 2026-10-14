// app/shipping/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Shipping & Delivery — SmileBabaHub",
  description:
    "Delivery zones, fees, and times across Ghana and Nigeria on SmileBabaHub.",
};

const ZONES_GH = [
  { area: "Accra Metro", time: "Same day – 24h", fee: "GHC 15 – 40" },
  { area: "Tema, Kasoa, Madina", time: "24 – 48h", fee: "GHC 25 – 50" },
  { area: "Kumasi, Cape Coast", time: "2 – 3 days", fee: "GHC 40 – 80" },
  { area: "Tamale, Bolgatanga, Wa", time: "3 – 5 days", fee: "GHC 60 – 120" },
  { area: "Other regions", time: "3 – 7 days", fee: "Quoted per shipment" },
];

const ZONES_NG = [
  {
    area: "Lagos (Mainland & Island)",
    time: "Same day – 24h",
    fee: "₦1,500 – 3,500",
  },
  { area: "Abuja", time: "24 – 48h", fee: "₦2,000 – 4,500" },
  { area: "Port Harcourt, Ibadan", time: "2 – 3 days", fee: "₦3,000 – 6,000" },
  { area: "Kano, Kaduna, Benin", time: "3 – 4 days", fee: "₦3,500 – 7,000" },
  { area: "Other states", time: "4 – 7 days", fee: "Quoted per shipment" },
];

export default function ShippingPage() {
  return (
    <div className="bg-white">
      <section className="bg-gradient-to-br from-yellow-50 to-white border-b border-gray-100">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <p className="text-xs font-black tracking-widest text-yellow-700">
            SHIPPING &amp; DELIVERY
          </p>
          <h1 className="mt-3 text-4xl md:text-5xl font-black text-gray-900">
            We deliver across{" "}
            <span className="text-yellow-500">Ghana &amp; Nigeria.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-gray-600">
            Most orders ship within 24 hours. Below is what to expect by region.
            Exact cost is shown at checkout based on the seller&apos;s location,
            package size, and your delivery address.
          </p>
        </div>
      </section>

      {/* Ghana zones */}
      <section className="mx-auto max-w-5xl px-6 py-12">
        <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
          🇬🇭 Ghana
        </h2>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full bg-white rounded-2xl overflow-hidden border border-gray-100">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-black tracking-wider text-gray-700">
                  DELIVERY AREA
                </th>
                <th className="text-left px-5 py-3 text-xs font-black tracking-wider text-gray-700">
                  ESTIMATED TIME
                </th>
                <th className="text-left px-5 py-3 text-xs font-black tracking-wider text-gray-700">
                  TYPICAL FEE
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {ZONES_GH.map((z) => (
                <tr key={z.area}>
                  <td className="px-5 py-4 font-bold text-gray-900">
                    {z.area}
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600">{z.time}</td>
                  <td className="px-5 py-4 text-sm text-gray-600">{z.fee}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Nigeria zones */}
      <section className="mx-auto max-w-5xl px-6 py-12">
        <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
          🇳🇬 Nigeria
        </h2>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full bg-white rounded-2xl overflow-hidden border border-gray-100">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-black tracking-wider text-gray-700">
                  DELIVERY AREA
                </th>
                <th className="text-left px-5 py-3 text-xs font-black tracking-wider text-gray-700">
                  ESTIMATED TIME
                </th>
                <th className="text-left px-5 py-3 text-xs font-black tracking-wider text-gray-700">
                  TYPICAL FEE
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {ZONES_NG.map((z) => (
                <tr key={z.area}>
                  <td className="px-5 py-4 font-bold text-gray-900">
                    {z.area}
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600">{z.time}</td>
                  <td className="px-5 py-4 text-sm text-gray-600">{z.fee}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Options */}
      <section className="bg-gray-50 border-y border-gray-100">
        <div className="mx-auto max-w-5xl px-6 py-12">
          <h2 className="text-2xl font-black text-gray-900">
            Delivery options
          </h2>
          <div className="mt-8 grid md:grid-cols-3 gap-4">
            {[
              {
                icon: "🛵",
                title: "SmileBaba Delivery",
                desc: "Our partner riders handle pickup and drop-off. Tracking included. Available in Accra, Lagos, Kumasi, Abuja, and growing.",
              },
              {
                icon: "🚚",
                title: "Third-party courier",
                desc: "Sellers can use any courier (Speedaf, GIG Logistics, Bolt Express). Tracking number is shared in your order chat.",
              },
              {
                icon: "🤝",
                title: "Self-pickup",
                desc: "Buyers can pick up from the seller's location. Confirm pickup in-app to release payment.",
              },
            ].map((o) => (
              <div
                key={o.title}
                className="bg-white rounded-2xl p-5 border border-gray-100"
              >
                <div className="text-3xl">{o.icon}</div>
                <div className="mt-3 font-black text-gray-900">{o.title}</div>
                <p className="mt-1 text-sm text-gray-600">{o.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-5xl px-6 py-12">
        <h2 className="text-2xl font-black text-gray-900">Common questions</h2>
        <div className="mt-6 space-y-3">
          {[
            {
              q: "How do I track my order?",
              a: "Once the seller ships, you'll see a tracking number in your order chat and dashboard. Tap it for live updates.",
            },
            {
              q: "What if my package is delayed?",
              a: "Delays beyond 2 days past the estimate trigger an automatic check-in from us. If the seller hasn't shipped, you can cancel for a full refund.",
            },
            {
              q: "Item damaged on arrival?",
              a: "Take photos and a short video, then open a dispute within 48 hours. We mediate with the seller and courier.",
            },
            {
              q: "Can I change the delivery address?",
              a: "Yes — before shipment. Open the order chat and request the change. After shipment, contact the courier directly.",
            },
            {
              q: "Do you ship internationally?",
              a: "Currently we operate within Ghana and Nigeria only. International shipping is on our roadmap.",
            },
          ].map((f) => (
            <details key={f.q} className="group bg-gray-50 rounded-2xl">
              <summary className="cursor-pointer p-5 font-black text-gray-900 list-none flex items-center justify-between">
                <span>{f.q}</span>
                <span className="text-yellow-500 group-open:rotate-45 transition-transform text-2xl font-black">
                  +
                </span>
              </summary>
              <div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed">
                {f.a}
              </div>
            </details>
          ))}
        </div>
      </section>

      <section className="bg-gray-900 text-white text-center">
        <div className="mx-auto max-w-5xl px-6 py-12">
          <h2 className="text-2xl font-black">Still have questions?</h2>
          <p className="mt-2 text-gray-400">
            Our team responds within 24 hours.
          </p>
          <a
            href="mailto:support@smilebabahub.com"
            className="inline-block mt-6 px-6 py-3 rounded-2xl bg-yellow-400 text-gray-900 font-black hover:bg-yellow-300"
          >
            Contact support
          </a>
        </div>
      </section>
    </div>
  );
}
