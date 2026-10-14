// app/how-to-buy/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How to Buy — SmileBabaHub",
  description: "Your step-by-step guide to buying safely on SmileBabaHub.",
};

const STEPS = [
  {
    n: 1,
    title: "Find what you want",
    body: "Use the search bar or browse categories. Filter by price, location, condition, and seller rating. Save favorites to revisit later.",
    tip: "Tip: tap Sort by price for the best deals near you.",
  },
  {
    n: 2,
    title: "Check the seller",
    body: "Open the listing and tap the seller's name to see their full profile — ratings, past sales, response time, and verification status.",
    tip: "Verified sellers have a ✓ badge. Prefer them when available.",
  },
  {
    n: 3,
    title: "Message the seller",
    body: "Tap Chat with seller. Ask about condition, delivery options, and whether the price is negotiable. Never share OTPs or move the conversation to other apps.",
    tip: "Keep all communication in SmileBabaHub for your protection.",
  },
  {
    n: 4,
    title: "Pay securely",
    body: "When you're ready, tap Buy now. Choose Card, Mobile Money, or bank transfer. Payments are processed by Flutterwave and held in escrow until you confirm receipt.",
    tip: "Look for the SmileBabaHub Pay button — that's how buyer protection works.",
  },
  {
    n: 5,
    title: "Receive your item",
    body: "Track delivery in your orders dashboard. Once it arrives, inspect it before confirming receipt. If anything's off, open a dispute within 48 hours.",
    tip: "Take a video while opening packages — useful evidence if you need to dispute.",
  },
  {
    n: 6,
    title: "Confirm and review",
    body: "Happy? Tap Confirm receipt — the seller gets paid, you get a chance to leave a rating. Your review helps other buyers.",
    tip: "Honest reviews are gold. Mention specifics: condition, packaging, communication.",
  },
];

export default function HowToBuyPage() {
  return (
    <div className="bg-white">
      <section className="bg-gradient-to-br from-yellow-50 to-white border-b border-gray-100">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <p className="text-xs font-black tracking-widest text-yellow-700">
            FOR BUYERS
          </p>
          <h1 className="mt-3 text-4xl md:text-6xl font-black text-gray-900 leading-tight">
            Buy with <span className="text-yellow-500">confidence.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base md:text-lg text-gray-600">
            Six steps, fully protected. Here&apos;s how to buy anything on
            SmileBabaHub — safely and on your terms.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <ol className="space-y-8">
          {STEPS.map((s) => (
            <li key={s.n} className="flex gap-5">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-2xl bg-yellow-400 flex items-center justify-center font-black text-xl text-gray-900">
                  {s.n}
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-black text-gray-900">{s.title}</h2>
                <p className="mt-2 text-gray-600 leading-relaxed">{s.body}</p>
                <div className="mt-3 inline-block bg-yellow-50 text-gray-800 text-sm px-3 py-1.5 rounded-xl border border-yellow-200">
                  💡 {s.tip}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Safety guarantees */}
      <section className="bg-gray-50 border-y border-gray-100">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="text-2xl font-black text-gray-900">
            You&apos;re protected at every step
          </h2>
          <div className="mt-8 grid md:grid-cols-3 gap-4">
            {[
              {
                icon: "🛡️",
                title: "Escrow protection",
                desc: "Payments held until you confirm receipt — sellers can't take your money and disappear.",
              },
              {
                icon: "🔍",
                title: "Verified sellers",
                desc: "ID-verified vendors carry a ✓ badge. Look for it on big-ticket items.",
              },
              {
                icon: "↩️",
                title: "48-hour dispute window",
                desc: "Not as described? Wrong item? Damaged in transit? Open a dispute and we mediate.",
              },
            ].map((s) => (
              <div
                key={s.title}
                className="bg-white rounded-2xl p-5 border border-gray-100"
              >
                <div className="text-3xl">{s.icon}</div>
                <div className="mt-3 font-black text-gray-900">{s.title}</div>
                <p className="mt-1 text-sm text-gray-600">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Red flags */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="text-2xl font-black text-gray-900">
          🚩 Red flags to watch for
        </h2>
        <ul className="mt-6 space-y-3">
          {[
            "A seller asks you to pay outside SmileBabaHub (WhatsApp, Mobile Money direct, bank transfer to a personal account).",
            "Prices that are dramatically below market — usually means counterfeit or scam.",
            "Seller refuses to share clear photos of the actual item (not stock photos).",
            "Pressure to pay immediately or lose the deal.",
            "Seller asks for your OTP, PIN, or full card details outside the secure checkout.",
          ].map((r, i) => (
            <li
              key={i}
              className="flex gap-3 bg-red-50 border border-red-100 rounded-2xl p-4"
            >
              <span className="text-red-500 font-black">⚠</span>
              <span className="text-sm text-gray-800">{r}</span>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-gray-600">
          See any of these? Tap{" "}
          <span className="font-black">Report seller</span> on the listing. We
          take action within 4 hours.
        </p>
      </section>

      <section className="bg-gray-900 text-white text-center">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="text-3xl font-black">Ready to shop?</h2>
          <p className="mt-2 text-gray-400">
            Thousands of listings across Ghana &amp; Nigeria.
          </p>
          <Link
            href="/ads"
            className="inline-block mt-6 px-6 py-3 rounded-2xl bg-yellow-400 text-gray-900 font-black hover:bg-yellow-300"
          >
            Start browsing
          </Link>
        </div>
      </section>
    </div>
  );
}
