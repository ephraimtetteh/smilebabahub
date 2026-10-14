// app/about/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About — SmileBabaHub",
  description:
    "SmileBabaHub is West Africa's marketplace for buying, selling, renting, and growing. Built for Ghana, Nigeria, and beyond.",
};

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-yellow-50 to-white border-b border-gray-100">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <p className="text-xs font-black tracking-widest text-yellow-700">
            ABOUT SMILEBABAHUB
          </p>
          <h1 className="mt-3 text-4xl md:text-6xl font-black text-gray-900 leading-tight">
            One marketplace for{" "}
            <span className="text-yellow-500">all of Africa.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base md:text-lg text-gray-600 leading-relaxed">
            We started SmileBabaHub because buying, selling, eating, renting,
            and earning shouldn&apos;t require ten different apps. One platform,
            all the hustles — built by Africans, for Africans.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-black text-gray-900">Our story</h2>
            <p className="mt-4 text-gray-600 leading-relaxed">
              SmileBabaHub was born in Accra in 2024 from a simple frustration:
              vendors and customers across Ghana and Nigeria had no single place
              to meet. Listings were scattered across WhatsApp groups,
              classified sites, and Instagram pages. Buyers wasted hours.
              Sellers lost reach.
            </p>
            <p className="mt-3 text-gray-600 leading-relaxed">
              We built one app that does it all — marketplace, food, apartments,
              jobs, services, events. Whatever the hustle, it has a home here.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-900">
              What we believe
            </h2>
            <ul className="mt-4 space-y-3 text-gray-600">
              <li className="flex">
                <span className="text-yellow-500 font-black mr-3">→</span>
                <span>
                  <span className="font-black text-gray-900">
                    African commerce deserves African tools.
                  </span>{" "}
                  Mobile money, local currencies, dialects, payment habits — all
                  baked in.
                </span>
              </li>
              <li className="flex">
                <span className="text-yellow-500 font-black mr-3">→</span>
                <span>
                  <span className="font-black text-gray-900">
                    Small sellers should reach big.
                  </span>{" "}
                  A teenager selling thrift in Lagos should be as visible as a
                  mall in Accra.
                </span>
              </li>
              <li className="flex">
                <span className="text-yellow-500 font-black mr-3">→</span>
                <span>
                  <span className="font-black text-gray-900">
                    Trust must be earned, not assumed.
                  </span>{" "}
                  Verified sellers, buyer protection, dispute resolution —
                  non-negotiable.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Numbers */}
      <section className="bg-gray-900 text-white">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="text-2xl md:text-3xl font-black">
            Growing fast, <span className="text-yellow-400">together.</span>
          </h2>
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { k: "2 +", v: "Countries served" },
              { k: "10k +", v: "Active listings" },
              { k: "24 / 7", v: "Live support" },
              { k: "100%", v: "Buyer protected" },
            ].map((s) => (
              <div key={s.v}>
                <div className="text-3xl md:text-4xl font-black text-yellow-400">
                  {s.k}
                </div>
                <div className="mt-1 text-sm text-gray-400">{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-6 py-20 text-center">
        <h2 className="text-3xl font-black text-gray-900">
          Ready to get started?
        </h2>
        <p className="mt-3 text-gray-600">
          Whether you&apos;re buying, selling, or just browsing — join us.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/auth/register"
            className="px-6 py-3 rounded-2xl bg-yellow-400 text-gray-900 font-black hover:bg-yellow-300 transition"
          >
            Create your account
          </Link>
          <Link
            href="/ads"
            className="px-6 py-3 rounded-2xl border-2 border-gray-200 text-gray-900 font-black hover:border-gray-300 transition"
          >
            Browse listings
          </Link>
        </div>
      </section>
    </div>
  );
}
