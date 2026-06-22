// app/privacy/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — SmileBabaHub",
  description:
    "How SmileBabaHub collects, uses, and protects your information.",
};

const LAST_UPDATED = "June 22, 2026";

export default function PrivacyPage() {
  return (
    <div className="bg-white">
      <section className="bg-gray-50 border-b border-gray-100">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <p className="text-xs font-black tracking-widest text-yellow-700">
            LEGAL
          </p>
          <h1 className="mt-3 text-4xl md:text-5xl font-black text-gray-900">
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm text-gray-500">
            Last updated: {LAST_UPDATED}
          </p>
        </div>
      </section>

      <article className="mx-auto max-w-3xl px-6 py-12 prose prose-gray prose-headings:font-black prose-headings:text-gray-900 prose-p:text-gray-600 prose-li:text-gray-600 prose-strong:text-gray-900 prose-h2:mt-10 prose-h2:mb-3 prose-h2:text-xl">
        <p className="text-gray-700">
          Your privacy matters. This Privacy Policy explains what information
          SmileBabaHub collects, why we collect it, how we use it, and the
          choices you have. It applies to all our Services across web and
          mobile.
        </p>

        <h2>1. Information we collect</h2>
        <p>We collect three categories of information:</p>

        <h3 className="mt-6 font-black text-gray-900 text-lg">
          a) Information you give us
        </h3>
        <ul>
          <li>
            Account details: name, email, phone number, profile photo, country
          </li>
          <li>
            Verification documents: government ID (Ghana Card, NIN) when you
            choose to verify
          </li>
          <li>
            Listings: photos, descriptions, prices, location of items you post
          </li>
          <li>
            Messages: content of chats with other users (we store these to
            enable disputes and safety)
          </li>
          <li>
            Payment details: handled by Flutterwave; we receive only transaction
            metadata, never full card numbers
          </li>
        </ul>

        <h3 className="mt-6 font-black text-gray-900 text-lg">
          b) Information collected automatically
        </h3>
        <ul>
          <li>
            Device data: model, OS, IP address, browser type, device identifiers
          </li>
          <li>
            Usage data: pages visited, searches, clicks, time spent, referring
            URLs
          </li>
          <li>
            Approximate location: derived from IP address (we don&apos;t track
            GPS unless you opt in)
          </li>
          <li>Cookies and similar technologies (see Section 5)</li>
        </ul>

        <h3 className="mt-6 font-black text-gray-900 text-lg">
          c) Information from third parties
        </h3>
        <ul>
          <li>
            OAuth providers (Google, Facebook): name, email, profile photo if
            you sign in with them
          </li>
          <li>
            Payment processor (Flutterwave): payment confirmations and dispute
            notifications
          </li>
          <li>Identity verification partners when applicable</li>
        </ul>

        <h2>2. How we use your information</h2>
        <p>We use your information to:</p>
        <ul>
          <li>Provide, maintain, and improve the Services</li>
          <li>Process transactions and remit payments to sellers</li>
          <li>
            Send transactional emails, SMS, and push notifications (order
            updates, security alerts)
          </li>
          <li>Detect, prevent, and respond to fraud, scams, and abuse</li>
          <li>Personalize recommendations and search results</li>
          <li>
            Send marketing communications (only if you&apos;ve opted in — you
            can unsubscribe anytime)
          </li>
          <li>
            Comply with legal obligations and respond to lawful requests from
            authorities
          </li>
        </ul>

        <h2>3. How we share your information</h2>
        <p>We share information only in these specific cases:</p>
        <ul>
          <li>
            <strong>With other users:</strong> your username, profile photo,
            ratings, and listings are visible publicly. Your phone is shared
            only when you choose to display it on a listing.
          </li>
          <li>
            <strong>With service providers:</strong> Flutterwave (payments),
            Cloudinary (image hosting), Mongo Atlas (database), Render
            (hosting), and other infrastructure providers who help us run the
            platform.
          </li>
          <li>
            <strong>With law enforcement:</strong> if compelled by valid legal
            process, or to protect rights, safety, or property.
          </li>
          <li>
            <strong>In a business transfer:</strong> if SmileBabaHub is acquired
            or merged, your information may transfer to the new entity, subject
            to this policy.
          </li>
        </ul>
        <p>
          <strong>We do not sell your personal information.</strong>
        </p>

        <h2>4. How long we keep your information</h2>
        <p>
          We keep account information for as long as your account is active.
          After deletion, we retain transaction records for{" "}
          <strong>7 years</strong> to comply with financial regulations, but
          personal identifiers are removed within 30 days. Chat messages are
          retained for 12 months for safety and dispute resolution.
        </p>

        <h2>5. Cookies and tracking</h2>
        <p>We use cookies and similar technologies for:</p>
        <ul>
          <li>
            <strong>Essential:</strong> authentication, security, fraud
            prevention (cannot be disabled)
          </li>
          <li>
            <strong>Functional:</strong> remembering preferences like country,
            language, dark mode
          </li>
          <li>
            <strong>Analytics:</strong> understanding how the platform is used
            (anonymized)
          </li>
        </ul>
        <p>
          You can manage cookies through your browser settings. Blocking
          essential cookies will break login and checkout.
        </p>

        <h2>6. Your rights</h2>
        <p>You have the right to:</p>
        <ul>
          <li>
            <strong>Access</strong> a copy of the information we hold about you
          </li>
          <li>
            <strong>Correct</strong> inaccurate or incomplete information
          </li>
          <li>
            <strong>Delete</strong> your account and personal information
            (subject to legal retention obligations)
          </li>
          <li>
            <strong>Object</strong> to certain processing (e.g. marketing)
          </li>
          <li>
            <strong>Export</strong> your data in a portable format
          </li>
          <li>
            <strong>Withdraw consent</strong> at any time for activities that
            rely on consent
          </li>
        </ul>
        <p>
          To exercise any of these rights, email{" "}
          <a
            href="mailto:privacy@smilebabahub.com"
            className="text-yellow-700 font-bold"
          >
            privacy@smilebabahub.com
          </a>
          . We respond within 30 days.
        </p>

        <h2>7. Security</h2>
        <p>
          We protect your information with industry-standard measures:
          encryption in transit (TLS), encryption at rest, hashed passwords,
          role-based access control, and regular security audits. No system is
          100% secure, but we work continuously to protect your data.
        </p>
        <p>
          If we detect a breach affecting you, we will notify you within 72
          hours.
        </p>

        <h2>8. Children</h2>
        <p>
          SmileBabaHub is not intended for children under 18. We do not
          knowingly collect information from anyone under 18. If you believe a
          minor has provided us information, contact us and we&apos;ll delete
          it.
        </p>

        <h2>9. International transfers</h2>
        <p>
          Your information may be stored on servers outside Ghana or Nigeria
          (e.g. EU, US) where our service providers operate. We ensure
          equivalent protection through contractual safeguards.
        </p>

        <h2>10. Changes to this policy</h2>
        <p>
          We may update this policy from time to time. Material changes will be
          notified via email or in-app notice at least 14 days before they take
          effect.
        </p>

        <h2>11. Contact</h2>
        <p>
          Questions, requests, or complaints about your privacy? Reach our Data
          Protection team at{" "}
          <a
            href="mailto:privacy@smilebabahub.com"
            className="text-yellow-700 font-bold"
          >
            privacy@smilebabahub.com
          </a>{" "}
          or write to:
        </p>
        <address className="not-italic text-gray-600 mt-3">
          SmileBabaHub Ltd.
          <br />
          Data Protection Office
          <br />
          Accra, Ghana
        </address>
      </article>
    </div>
  );
}
