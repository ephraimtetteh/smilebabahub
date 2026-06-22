// app/careers/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Careers — SmileBabaHub",
  description:
    "Build the future of African commerce. Join the SmileBabaHub team in Accra, Lagos, or remote.",
};

const OPEN_ROLES = [
  {
    title: "Senior Backend Engineer",
    loc: "Accra · Remote",
    type: "Full-time",
  },
  { title: "Product Designer", loc: "Lagos · Remote", type: "Full-time" },
  { title: "Mobile Engineer (React Native)", loc: "Remote", type: "Full-time" },
  { title: "Growth Marketing Lead", loc: "Accra", type: "Full-time" },
  { title: "Customer Success Officer", loc: "Lagos", type: "Full-time" },
  { title: "Community Manager — Ghana", loc: "Accra", type: "Contract" },
];

export default function CareersPage() {
  return (
    <div className="bg-white">
      <section className="bg-gradient-to-br from-yellow-50 to-white border-b border-gray-100">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <p className="text-xs font-black tracking-widest text-yellow-700">
            CAREERS
          </p>
          <h1 className="mt-3 text-4xl md:text-6xl font-black text-gray-900 leading-tight">
            Build the future of <br />
            <span className="text-yellow-500">African commerce.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base md:text-lg text-gray-600">
            We&apos;re a small team with a big mission — making it easier for
            anyone in Ghana, Nigeria, and beyond to buy, sell, eat, rent, and
            earn online.
          </p>
        </div>
      </section>

      {/* Why work here */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="text-2xl font-black text-gray-900">Why SmileBabaHub</h2>
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          {[
            {
              icon: "🌍",
              title: "Impact at scale",
              desc: "Your work touches thousands of vendors and customers across West Africa every day.",
            },
            {
              icon: "🏠",
              title: "Remote-first",
              desc: "Work from Accra, Lagos, Cape Coast, Abuja — or wherever you do your best work.",
            },
            {
              icon: "💰",
              title: "Competitive pay",
              desc: "Salary in USD or local currency, equity, and quarterly performance bonuses.",
            },
            {
              icon: "🚀",
              title: "Move fast, ship real things",
              desc: "Small team, short decision chains. Your ideas hit production this week, not next quarter.",
            },
            {
              icon: "🧠",
              title: "Learn from the best",
              desc: "We hire engineers and designers from across the continent and diaspora.",
            },
            {
              icon: "❤️",
              title: "Real ownership",
              desc: "Stock options on day one. Build something you actually own a piece of.",
            },
          ].map((p) => (
            <div key={p.title} className="bg-gray-50 rounded-2xl p-5">
              <div className="text-3xl">{p.icon}</div>
              <div className="mt-3 font-black text-gray-900">{p.title}</div>
              <p className="mt-1 text-sm text-gray-600">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Open roles */}
      <section className="bg-gray-50 border-y border-gray-100">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="text-2xl font-black text-gray-900">Open roles</h2>
          <p className="mt-2 text-sm text-gray-600">
            See something you like? Email us at{" "}
            <a
              href="mailto:careers@smilebabahub.com"
              className="text-yellow-700 font-black"
            >
              careers@smilebabahub.com
            </a>{" "}
            with your CV and a note about why you&apos;re excited.
          </p>
          <div className="mt-6 divide-y divide-gray-200 bg-white rounded-2xl border border-gray-100">
            {OPEN_ROLES.map((role) => (
              <a
                key={role.title}
                href={`mailto:careers@smilebabahub.com?subject=Application — ${encodeURIComponent(role.title)}`}
                className="flex items-center justify-between p-5 hover:bg-yellow-50 transition group"
              >
                <div>
                  <div className="font-black text-gray-900 group-hover:text-yellow-700">
                    {role.title}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {role.loc} · {role.type}
                  </div>
                </div>
                <span className="text-yellow-500 font-black">Apply →</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Open application */}
      <section className="mx-auto max-w-5xl px-6 py-16 text-center">
        <h2 className="text-2xl font-black text-gray-900">Nothing matches?</h2>
        <p className="mt-2 text-gray-600">
          We&apos;re always interested in talented people. Send an open
          application.
        </p>
        <a
          href="mailto:careers@smilebabahub.com"
          className="inline-block mt-6 px-6 py-3 rounded-2xl bg-yellow-400 text-gray-900 font-black hover:bg-yellow-300"
        >
          Get in touch
        </a>
      </section>
    </div>
  );
}
