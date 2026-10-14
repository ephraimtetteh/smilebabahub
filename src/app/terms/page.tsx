// app/terms/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — SmileBabaHub",
  description: "The terms and conditions for using SmileBabaHub.",
};

const LAST_UPDATED = "June 22, 2026";

export default function TermsPage() {
  return (
    <div className="bg-white">
      <section className="bg-gray-50 border-b border-gray-100">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <p className="text-xs font-black tracking-widest text-yellow-700">
            LEGAL
          </p>
          <h1 className="mt-3 text-4xl md:text-5xl font-black text-gray-900">
            Terms of Service
          </h1>
          <p className="mt-3 text-sm text-gray-500">
            Last updated: {LAST_UPDATED}
          </p>
        </div>
      </section>

      <article className="mx-auto max-w-3xl px-6 py-12 prose prose-gray prose-headings:font-black prose-headings:text-gray-900 prose-p:text-gray-600 prose-li:text-gray-600 prose-strong:text-gray-900 prose-h2:mt-10 prose-h2:mb-3 prose-h2:text-xl">
        <p className="text-gray-700">
          Welcome to <strong>SmileBabaHub</strong>. By using our website, mobile
          applications, or any of our services (collectively, the
          &quot;Services&quot;), you agree to these Terms of Service. Please
          read them carefully.
        </p>

        <h2>1. Who we are</h2>
        <p>
          SmileBabaHub is operated by SmileBabaHub Ltd., a company registered in
          Ghana with operations across Ghana and Nigeria. References to
          &quot;we&quot;, &quot;us&quot;, or &quot;our&quot; refer to
          SmileBabaHub Ltd.
        </p>

        <h2>2. Your account</h2>
        <p>
          You must be at least 18 years old to create an account. You are
          responsible for maintaining the confidentiality of your login
          credentials and for all activity that occurs under your account.
          Notify us immediately at{" "}
          <a
            href="mailto:security@smilebabahub.com"
            className="text-yellow-700 font-bold"
          >
            security@smilebabahub.com
          </a>{" "}
          if you suspect unauthorized use.
        </p>
        <p>
          You agree to provide accurate, current, and complete information when
          registering and to keep it updated.
        </p>

        <h2>3. Using the Services</h2>
        <p>
          You agree <strong>not</strong> to:
        </p>
        <ul>
          <li>Post listings for prohibited items (see Section 5)</li>
          <li>
            Use the Services to commit fraud, deceive other users, or launder
            money
          </li>
          <li>
            Scrape, harvest, or extract data from the platform without written
            permission
          </li>
          <li>
            Reverse-engineer, decompile, or attempt to extract source code
          </li>
          <li>Impersonate another person, business, or our staff</li>
          <li>
            Interfere with the platform&apos;s security, integrity, or operation
          </li>
          <li>
            Send spam, phishing messages, or unsolicited commercial
            communications
          </li>
        </ul>

        <h2>4. Listings and transactions</h2>
        <p>
          As a seller, you are responsible for the accuracy of your listings,
          the quality and legality of the items or services you sell, and for
          fulfilling orders. As a buyer, you are responsible for reading
          listings carefully and paying for items you commit to purchase.
        </p>
        <p>
          SmileBabaHub provides the platform but is not party to transactions
          between buyers and sellers. We do, however, offer buyer protection on
          transactions paid through SmileBabaHub Pay. See our{" "}
          <a href="/shipping" className="text-yellow-700 font-bold">
            Shipping &amp; Delivery
          </a>{" "}
          page for details.
        </p>

        <h2>5. Prohibited items</h2>
        <p>The following may not be listed or sold on SmileBabaHub:</p>
        <ul>
          <li>Firearms, ammunition, explosives, or weapons of any kind</li>
          <li>Illegal drugs, controlled substances, or drug paraphernalia</li>
          <li>Counterfeit or stolen goods</li>
          <li>
            Human remains, body parts, or live animals (other than properly
            licensed pets)
          </li>
          <li>Sexually explicit material or services</li>
          <li>
            Tobacco, alcohol, or pharmaceuticals (without proper licensing)
          </li>
          <li>
            Items that infringe on third-party intellectual property rights
          </li>
          <li>Hazardous materials or recalled products</li>
          <li>Anything illegal under Ghanaian or Nigerian law</li>
        </ul>
        <p>
          We reserve the right to remove listings and suspend accounts at our
          sole discretion. Repeat violations may result in permanent ban and
          reporting to law enforcement.
        </p>

        <h2>6. Payments and fees</h2>
        <p>
          Buyers pay no platform fee. Sellers pay a{" "}
          <strong>15% commission</strong> on successful transactions processed
          through SmileBabaHub Pay. Subscription plans (Smile, BasicSmile,
          HappySmile, SuperSmile) have monthly fees as listed on our pricing
          page.
        </p>
        <p>
          Payments are processed by Flutterwave Inc. By using our payment
          features you also agree to{" "}
          <a
            href="https://flutterwave.com/legal/terms"
            target="_blank"
            rel="noopener"
            className="text-yellow-700 font-bold"
          >
            Flutterwave&apos;s terms
          </a>
          .
        </p>

        <h2>7. Refunds and disputes</h2>
        <p>
          Buyers may open a dispute within <strong>48 hours</strong> of
          receiving an item if it isn&apos;t as described, doesn&apos;t arrive,
          or is materially defective. We will mediate in good faith. Refunds are
          processed within 7 business days of resolution.
        </p>

        <h2>8. Intellectual property</h2>
        <p>
          All content on the platform other than user listings — including the
          SmileBabaHub name, logo, software, and design — is owned by
          SmileBabaHub Ltd. and protected by copyright and trademark law. You
          may not use it without our written permission.
        </p>
        <p>
          By posting content (listings, photos, reviews), you grant us a
          worldwide, non-exclusive, royalty-free license to use, display, and
          distribute that content as needed to operate the Services.
        </p>

        <h2>9. Termination</h2>
        <p>
          You may close your account anytime through Account → Settings → Delete
          account. We may suspend or terminate your account if you violate these
          terms, with or without notice depending on the severity.
        </p>

        <h2>10. Disclaimer of warranties</h2>
        <p>
          The Services are provided &quot;as is&quot; without warranty of any
          kind. We do not guarantee that listings are accurate, that sellers
          will fulfill orders, or that the platform will be uninterrupted. Use
          of the Services is at your own risk.
        </p>

        <h2>11. Limitation of liability</h2>
        <p>
          To the maximum extent permitted by law, SmileBabaHub Ltd. and its
          officers, directors, employees, and agents will not be liable for any
          indirect, incidental, special, consequential, or punitive damages
          arising out of your use of the Services.
        </p>

        <h2>12. Governing law</h2>
        <p>
          These terms are governed by the laws of the Republic of Ghana. Any
          disputes shall be resolved in the courts of Accra unless mandatory
          consumer protection law in your country provides otherwise.
        </p>

        <h2>13. Changes to these terms</h2>
        <p>
          We may update these terms from time to time. Material changes will be
          notified via email or in-app notice at least 14 days before they take
          effect. Continued use after the effective date constitutes acceptance.
        </p>

        <h2>14. Contact</h2>
        <p>
          Questions about these terms? Email us at{" "}
          <a
            href="mailto:legal@smilebabahub.com"
            className="text-yellow-700 font-bold"
          >
            legal@smilebabahub.com
          </a>
          .
        </p>
      </article>
    </div>
  );
}
