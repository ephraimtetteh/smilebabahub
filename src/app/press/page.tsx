// app/press/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Press — SmileBabaHub",
  description:
    "Press inquiries, brand assets, and recent news from SmileBabaHub.",
};

export default function PressPage() {
  return (
    <div className="bg-white">
      <section className="bg-gradient-to-br from-yellow-50 to-white border-b border-gray-100">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <p className="text-xs font-black tracking-widest text-yellow-700">
            PRESS
          </p>
          <h1 className="mt-3 text-4xl md:text-6xl font-black text-gray-900 leading-tight">
            Newsroom &amp; <br />
            <span className="text-yellow-500">brand assets.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base md:text-lg text-gray-600">
            For press inquiries, interviews, or brand assets — we&apos;re happy
            to help.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gray-50 rounded-2xl p-6">
            <h2 className="text-xl font-black text-gray-900">
              Press inquiries
            </h2>
            <p className="mt-3 text-sm text-gray-600">
              For interview requests, story pitches, or comment from leadership.
            </p>
            <a
              href="mailto:press@smilebabahub.com"
              className="inline-block mt-5 px-5 py-2.5 rounded-2xl bg-gray-900 text-white font-black hover:bg-gray-800"
            >
              press@smilebabahub.com
            </a>
          </div>
          <div className="bg-gray-50 rounded-2xl p-6">
            <h2 className="text-xl font-black text-gray-900">Partnerships</h2>
            <p className="mt-3 text-sm text-gray-600">
              Brand collaborations, advertising, integrations, and business
              development.
            </p>
            <a
              href="mailto:partners@smilebabahub.com"
              className="inline-block mt-5 px-5 py-2.5 rounded-2xl bg-yellow-400 text-gray-900 font-black hover:bg-yellow-300"
            >
              partners@smilebabahub.com
            </a>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 border-y border-gray-100">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="text-2xl font-black text-gray-900">Brand assets</h2>
          <p className="mt-2 text-sm text-gray-600">
            Logos, color palette, and approved imagery for editorial use.
          </p>
          <div className="mt-8 grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <div className="aspect-square bg-gray-900 rounded-xl flex items-center justify-center">
                <span className="text-5xl font-black text-yellow-400">SB</span>
              </div>
              <div className="mt-4 font-black text-gray-900">Primary mark</div>
              <p className="text-xs text-gray-500 mt-1">
                PNG, SVG · Light + dark variants
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <div className="aspect-square bg-yellow-400 rounded-xl flex items-center justify-center">
                <span className="text-4xl font-black text-gray-900">
                  SmileBaba
                </span>
              </div>
              <div className="mt-4 font-black text-gray-900">Wordmark</div>
              <p className="text-xs text-gray-500 mt-1">
                PNG, SVG · Full + condensed
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <div className="aspect-square rounded-xl overflow-hidden grid grid-cols-2 grid-rows-2">
                <div className="bg-yellow-400" />
                <div className="bg-gray-900" />
                <div className="bg-white border border-gray-200" />
                <div className="bg-gray-100" />
              </div>
              <div className="mt-4 font-black text-gray-900">Color palette</div>
              <p className="text-xs text-gray-500 mt-1">
                #FFC105 · #111827 · #FFFFFF · #F3F4F6
              </p>
            </div>
          </div>
          <p className="mt-6 text-xs text-gray-500">
            Email{" "}
            <a
              href="mailto:press@smilebabahub.com"
              className="text-yellow-700 font-black"
            >
              press@smilebabahub.com
            </a>{" "}
            for the full press kit (.zip).
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="text-2xl font-black text-gray-900">Quick facts</h2>
        <dl className="mt-6 grid md:grid-cols-2 gap-x-12 gap-y-4">
          {[
            ["Founded", "2024 · Accra, Ghana"],
            ["Headquarters", "Accra, Ghana · Lagos, Nigeria"],
            ["Markets served", "Ghana, Nigeria"],
            [
              "Categories",
              "Marketplace, Food, Apartments, Vendors, Services, Events, Health",
            ],
            ["Payments", "Flutterwave (Cards, Mobile Money, Bank Transfer)"],
            ["Pronunciation", "smile-BAH-bah hub"],
          ].map(([k, v]) => (
            <div key={k} className="border-b border-gray-100 pb-3">
              <dt className="text-xs font-black tracking-wider text-gray-500">
                {k.toUpperCase()}
              </dt>
              <dd className="mt-1 text-sm text-gray-900">{v}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
