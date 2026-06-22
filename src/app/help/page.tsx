// app/help/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Help Center — SmileBabaHub",
  description:
    "Find answers to common questions about buying, selling, payments, and account on SmileBabaHub.",
};

const TOPICS = [
  {
    title: "Buying",
    icon: "🛍️",
    items: [
      {
        q: "How do I contact a seller?",
        a: "Open any listing and tap Chat with seller. Messages are in-app, free, and end-to-end visible only to you and the seller.",
      },
      {
        q: "Is buyer protection automatic?",
        a: "Yes. Any payment made through the SmileBabaHub Pay button is protected. If the item isn't as described or doesn't arrive, open a dispute within 48 hours.",
      },
      {
        q: "What if the seller is unresponsive?",
        a: "Wait 24 hours. If still no reply, use Report seller from the listing and we'll follow up.",
      },
      {
        q: "Can I cancel an order?",
        a: "Before the seller ships — yes, automatically. After shipment, open a dispute and we'll mediate.",
      },
    ],
  },
  {
    title: "Selling",
    icon: "💼",
    items: [
      {
        q: "How do I post my first ad?",
        a: "Tap Sell / Post on the home screen. Pick a category, add photos and details, and publish. Your first ad on the Smile plan is free.",
      },
      {
        q: "Why is my ad pending review?",
        a: "All new ads are auto-screened for prohibited items. Approval usually takes under 15 minutes.",
      },
      {
        q: "How does promotion work?",
        a: "Promote your ad from your dashboard. Promoted listings appear higher in search and on the home page. See pricing on the Promotions page.",
      },
      {
        q: "What's the commission?",
        a: "15% on successful sales through SmileBabaHub Pay. No commission on free chat-only listings.",
      },
    ],
  },
  {
    title: "Payments",
    icon: "💳",
    items: [
      {
        q: "What payment methods are supported?",
        a: "Cards (Visa, Mastercard), MTN Mobile Money, Vodafone Cash, AirtelTigo Money, and bank transfer — through Flutterwave.",
      },
      {
        q: "When do I receive payouts?",
        a: "T+1 for verified sellers (next business day). New sellers have a 3-day holding period for the first three orders.",
      },
      {
        q: "Are there transaction fees?",
        a: "Buyers pay 0%. Sellers pay 15% commission, which includes payment processing.",
      },
      {
        q: "Can I refund a buyer?",
        a: "Yes. From your order dashboard, tap Refund — partial or full. Refunds go back to the original payment method within 7 business days.",
      },
    ],
  },
  {
    title: "Account",
    icon: "👤",
    items: [
      {
        q: "How do I verify my account?",
        a: "Account → Verification. Upload your Ghana Card or NIN. Verification takes up to 48 hours.",
      },
      {
        q: "I forgot my password.",
        a: "On the login screen, tap Forgot password? and we'll email you a reset link.",
      },
      {
        q: "Can I switch country?",
        a: "Yes. Account → Country. You'll see listings for the country you choose, but your profile and history stay with you.",
      },
      {
        q: "How do I delete my account?",
        a: "Account → Settings → Delete account. We keep transaction records for legal reasons but personal data is removed within 30 days.",
      },
    ],
  },
];

export default function HelpPage() {
  return (
    <div className="bg-white">
      <section className="bg-gradient-to-br from-yellow-50 to-white border-b border-gray-100">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <p className="text-xs font-black tracking-widest text-yellow-700">
            HELP CENTER
          </p>
          <h1 className="mt-3 text-4xl md:text-5xl font-black text-gray-900">
            How can we <span className="text-yellow-500">help?</span>
          </h1>
          <div className="mt-8 relative max-w-2xl">
            <input
              type="text"
              placeholder="Search for answers..."
              className="w-full px-5 py-4 pr-32 rounded-2xl border-2 border-gray-200 focus:border-yellow-400 outline-none text-gray-900"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2.5 bg-yellow-400 hover:bg-yellow-300 rounded-xl font-black text-gray-900">
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Quick actions */}
      <section className="mx-auto max-w-5xl px-6 py-12">
        <div className="grid sm:grid-cols-3 gap-4">
          <Link
            href="/how-to-buy"
            className="bg-gray-50 rounded-2xl p-5 hover:bg-yellow-50 transition group border border-transparent hover:border-yellow-200"
          >
            <div className="text-3xl">🛒</div>
            <div className="mt-3 font-black text-gray-900">How to buy</div>
            <p className="text-xs text-gray-600 mt-1">
              Step-by-step buyer guide
            </p>
          </Link>
          <Link
            href="/how-to-sell"
            className="bg-gray-50 rounded-2xl p-5 hover:bg-yellow-50 transition group border border-transparent hover:border-yellow-200"
          >
            <div className="text-3xl">💼</div>
            <div className="mt-3 font-black text-gray-900">How to sell</div>
            <p className="text-xs text-gray-600 mt-1">
              Post your first listing
            </p>
          </Link>
          <a
            href="mailto:support@smilebabahub.com"
            className="bg-gray-50 rounded-2xl p-5 hover:bg-yellow-50 transition group border border-transparent hover:border-yellow-200"
          >
            <div className="text-3xl">💬</div>
            <div className="mt-3 font-black text-gray-900">Contact support</div>
            <p className="text-xs text-gray-600 mt-1">
              support@smilebabahub.com
            </p>
          </a>
        </div>
      </section>

      {/* Topics + FAQs */}
      <section className="mx-auto max-w-5xl px-6 pb-16">
        {TOPICS.map((topic) => (
          <div key={topic.title} className="mt-10">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">{topic.icon}</span>
              <h2 className="text-2xl font-black text-gray-900">
                {topic.title}
              </h2>
            </div>
            <div className="space-y-3">
              {topic.items.map((item) => (
                <details key={item.q} className="group bg-gray-50 rounded-2xl">
                  <summary className="cursor-pointer p-5 font-black text-gray-900 list-none flex items-center justify-between">
                    <span>{item.q}</span>
                    <span className="text-yellow-500 group-open:rotate-45 transition-transform text-2xl font-black">
                      +
                    </span>
                  </summary>
                  <div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed">
                    {item.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section className="bg-gray-900 text-white">
        <div className="mx-auto max-w-5xl px-6 py-12 text-center">
          <h2 className="text-2xl font-black">Still need help?</h2>
          <p className="mt-2 text-gray-300">
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
