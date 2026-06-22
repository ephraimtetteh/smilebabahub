// app/how-to-sell/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How to Sell — SmileBabaHub",
  description:
    "Start selling on SmileBabaHub in minutes. Reach buyers across Ghana and Nigeria.",
};

const STEPS = [
  {
    n: 1,
    title: "Create your account",
    body: "Sign up free with your phone number or email. Verify with a one-time code and you're in.",
  },
  {
    n: 2,
    title: "Set up your seller profile",
    body: "Add your business name, profile photo, and a short bio. Verified profiles earn the ✓ badge and convert 3× better.",
  },
  {
    n: 3,
    title: "Post your first listing",
    body: "Tap Sell / Post. Pick a category, add up to 6 photos, write a clear title and description, and set your price.",
  },
  {
    n: 4,
    title: "Promote (optional)",
    body: "Want more eyes on your listing? Promote it from your dashboard. Promoted ads appear higher in search and on the home page.",
  },
  {
    n: 5,
    title: "Chat &amp; close the deal",
    body: "When a buyer messages, reply fast — top sellers respond in under 1 hour. Negotiate, agree on delivery, and accept payment through SmileBabaHub Pay.",
  },
  {
    n: 6,
    title: "Ship and get paid",
    body: "Once the buyer confirms receipt, your payout lands within 24 hours. Verified sellers get T+1 payouts. New sellers have a short holding period.",
  },
];

const PLANS = [
  {
    name: "Smile",
    price: "Free",
    ads: "1 ad",
    duration: "3 days",
    features: ["Basic visibility", "In-app chat"],
  },
  {
    name: "BasicSmile",
    price: "GHC 99.99/mo",
    ads: "5 ads",
    duration: "30 days",
    features: ["Standard ranking", "Email + chat", "Basic analytics"],
  },
  {
    name: "HappySmile",
    price: "GHC 249.99/mo",
    ads: "10 ads",
    duration: "30 days",
    features: [
      "Boosted ranking",
      "Priority support",
      "Full analytics",
      "1 promoted spot",
    ],
    featured: true,
  },
  {
    name: "SuperSmile",
    price: "GHC 499.99/mo",
    ads: "Unlimited",
    duration: "60 days",
    features: [
      "Top ranking",
      "Verified ✓ badge",
      "Dedicated account manager",
      "3 promoted spots",
    ],
  },
];

export default function HowToSellPage() {
  return (
    <div className="bg-white">
      <section className="bg-gradient-to-br from-yellow-50 to-white border-b border-gray-100">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <p className="text-xs font-black tracking-widest text-yellow-700">
            FOR SELLERS
          </p>
          <h1 className="mt-3 text-4xl md:text-6xl font-black text-gray-900 leading-tight">
            Turn your hustle <br />
            <span className="text-yellow-500">into income.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base md:text-lg text-gray-600">
            Whether you sell jollof, jewelry, properties, or services — start
            selling on SmileBabaHub in under 5 minutes.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link
              href="/auth/register"
              className="px-6 py-3 rounded-2xl bg-yellow-400 text-gray-900 font-black hover:bg-yellow-300 text-center"
            >
              Start selling free
            </Link>
            <Link
              href="/ads/new"
              className="px-6 py-3 rounded-2xl border-2 border-gray-200 text-gray-900 font-black hover:border-gray-300 text-center"
            >
              Post your first ad
            </Link>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="text-2xl font-black text-gray-900">
          Get started in 6 steps
        </h2>
        <ol className="mt-8 space-y-8">
          {STEPS.map((s) => (
            <li key={s.n} className="flex gap-5">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-2xl bg-yellow-400 flex items-center justify-center font-black text-xl text-gray-900">
                  {s.n}
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-black text-gray-900">{s.title}</h3>
                <p
                  className="mt-2 text-gray-600 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: s.body }}
                />
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Pricing */}
      <section className="bg-gray-50 border-y border-gray-100">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="text-2xl font-black text-gray-900">
            Plans that grow with you
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Start free. Upgrade when you&apos;re ready. Cancel anytime.
          </p>
          <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {PLANS.map((p) => (
              <div
                key={p.name}
                className={`rounded-2xl p-5 border-2 ${
                  p.featured
                    ? "bg-gray-900 text-white border-yellow-400"
                    : "bg-white border-gray-100"
                }`}
              >
                {p.featured && (
                  <div className="inline-block bg-yellow-400 text-gray-900 px-2 py-0.5 rounded text-[10px] font-black tracking-wider mb-3">
                    MOST POPULAR
                  </div>
                )}
                <div
                  className={`font-black ${p.featured ? "text-yellow-400" : "text-gray-900"}`}
                >
                  {p.name}
                </div>
                <div
                  className={`mt-1 text-2xl font-black ${p.featured ? "text-white" : "text-gray-900"}`}
                >
                  {p.price}
                </div>
                <div
                  className={`text-xs mt-1 ${p.featured ? "text-gray-300" : "text-gray-500"}`}
                >
                  {p.ads} · {p.duration}
                </div>
                <ul
                  className={`mt-4 space-y-2 text-sm ${p.featured ? "text-gray-200" : "text-gray-600"}`}
                >
                  {p.features.map((f) => (
                    <li key={f} className="flex gap-2">
                      <span className="text-yellow-400 font-black">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs text-gray-500">
            All plans: 15% commission on successful sales · No setup fees ·
            Cancel anytime
          </p>
        </div>
      </section>

      {/* Tips for great listings */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="text-2xl font-black text-gray-900">
          Tips for great listings
        </h2>
        <div className="mt-8 grid md:grid-cols-2 gap-4">
          {[
            {
              icon: "📸",
              title: "Take clear photos",
              desc: "Natural light. Plain background. Multiple angles. Photos drive 80% of click-through.",
            },
            {
              icon: "✍️",
              title: "Write a clear title",
              desc: "Format: [Brand] [Model] [Key spec]. e.g. 'iPhone 14 Pro Max — 256GB, Deep Purple'.",
            },
            {
              icon: "💯",
              title: "Be honest about condition",
              desc: "Mention scratches, wear, defects. Buyers respect honesty and you avoid disputes later.",
            },
            {
              icon: "💬",
              title: "Reply fast",
              desc: "Top sellers respond in under 1 hour. The faster you reply, the more you sell.",
            },
            {
              icon: "💰",
              title: "Price it right",
              desc: "Check similar listings in your area. Underpriced = suspicious. Overpriced = ignored.",
            },
            {
              icon: "🚚",
              title: "Be clear on delivery",
              desc: "State pickup location, delivery options, and who pays. No surprises = happy buyers.",
            },
          ].map((t) => (
            <div key={t.title} className="bg-gray-50 rounded-2xl p-5">
              <div className="text-3xl">{t.icon}</div>
              <div className="mt-3 font-black text-gray-900">{t.title}</div>
              <p className="mt-1 text-sm text-gray-600">{t.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gray-900 text-white text-center">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="text-3xl font-black">
            Your first sale is one post away.
          </h2>
          <Link
            href="/ads/new"
            className="inline-block mt-6 px-6 py-3 rounded-2xl bg-yellow-400 text-gray-900 font-black hover:bg-yellow-300"
          >
            Post my ad
          </Link>
        </div>
      </section>
    </div>
  );
}
