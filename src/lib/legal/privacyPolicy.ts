// client/lib/legal/privacyPolicy.ts
//
// The privacy policy as data rather than markup.
//
// Web and mobile both render from this, so the two can't drift — which
// matters more than usual here, because Apple and Google check that the
// policy you link from the store listing matches the one in the app.
//
// Mobile imports the same shape; if the app can't reach this package,
// copy the file to mobile/src/lib/legal/privacyPolicy.ts rather than
// rewriting the text.

export const PRIVACY_LAST_UPDATED = "September 2, 2026";
export const PRIVACY_CONTACT_EMAIL = "privacy@smilebabahub.com";

export interface PolicyBlock {
  /** Paragraph of prose */
  p?: string;
  /** Unordered list */
  list?: string[];
  /** Ordered list */
  ordered?: string[];
  /** Sub-heading within a section */
  h3?: string;
  /** Pulled out visually — the things people most need to see */
  callout?: string;
}

export interface PolicySection {
  id: string;
  title: string;
  blocks: PolicyBlock[];
}

export const PRIVACY_INTRO: PolicyBlock[] = [
  {
    callout:
      "Your privacy matters. SmileBabaHub respects your privacy and is committed to protecting your personal information.",
  },
  {
    p: 'This Privacy Policy explains how SmileBabaHub ("SmileBabaHub", "we", "us", or "our") collects, uses, discloses, stores, protects, and deletes information when you use SmileBabaHub websites, mobile applications, and related services.',
  },
  {
    p: "It applies to our Marketplace, Food, Apartments and SmileStays, advertising and promoted listings, messaging, money-transfer and payment-related services, digital-currency services where available, customer support, SmileBabaHub TV and Radio, and other services made available through SmileBabaHub.",
  },
];

export const PRIVACY_SECTIONS: PolicySection[] = [
  {
    id: "information-we-collect",
    title: "1. Information We Collect",
    blocks: [
      {
        p: "We follow the principle of data minimisation and seek to collect only information reasonably necessary to provide the relevant service. What we collect depends on how you use SmileBabaHub.",
      },
      { h3: "Account information" },
      {
        list: [
          "Full name",
          "Email address",
          "Mobile phone number",
          "Password or authentication credentials",
          "Country",
          "Profile photo",
          "Preferred language",
          "Account type",
          "Date of birth or age information where required for eligibility",
          "Other information you voluntarily provide",
        ],
      },
      { h3: "Marketplace information" },
      {
        list: [
          "Product or service information",
          "Photos and videos",
          "Description, price and category",
          "Listing location",
          "Seller information",
          "Delivery information",
          "Messages relating to a transaction",
          "Ratings and reviews",
          "Order information",
        ],
      },
      {
        p: "Information contained in a public listing may be visible to other users.",
      },
    ],
  },
  {
    id: "food-services",
    title: "2. Food Services",
    blocks: [
      {
        p: "If you use SmileBabaHub Food, we may collect information necessary to display restaurants and food vendors, process food orders, facilitate delivery, communicate order status, process payments, provide customer support, and resolve disputes.",
      },
      {
        list: [
          "Delivery address",
          "Contact telephone number",
          "Order history",
          "Restaurant and vendor information",
          "Delivery instructions",
          "Payment transaction information",
        ],
      },
      {
        p: "Your delivery information may be shared with the restaurant, food vendor, delivery provider, or other service provider only to the extent necessary to fulfil your order.",
      },
    ],
  },
  {
    id: "apartments-and-stays",
    title: "3. Apartments and SmileStays",
    blocks: [
      {
        p: "If you search for, book, list, or manage accommodation through SmileBabaHub or SmileStays, we may collect booking information, guest and host information, check-in and check-out dates, number of guests, property information, contact information, payment and transaction information, location information necessary to provide the accommodation service, booking communications, and reviews and ratings.",
      },
      {
        p: "Where necessary to complete a booking, relevant information may be shared with the property owner, host, property manager, or service provider. We do not use accommodation information for unrelated advertising purposes without appropriate consent where required by law.",
      },
    ],
  },
  {
    id: "money-transfer",
    title: "4. Money Transfer and Financial Services",
    blocks: [
      {
        p: "SmileBabaHub may provide access to money-transfer, payment, bill-payment, or digital-currency-related services. Certain financial services may be provided through third-party payment, financial, money-transfer, identity-verification, or other regulated service providers.",
      },
      {
        list: [
          "Sender and recipient information",
          "Mobile phone numbers",
          "Bank or mobile-money information",
          "Transaction amount and currency",
          "Transaction reference and status",
          "Payment information",
          "Identification information",
          "Government-issued identification documents where required",
          "Date of birth and address where required",
          "Source-of-funds or other compliance information where required",
          "Fraud-prevention information",
        ],
      },
      {
        p: "Financial and identity information is sensitive and is handled with appropriate security measures. Where a third party processes a money transfer or payment on our behalf, that provider may collect and process information under its own privacy policy and applicable legal and regulatory requirements.",
      },
      {
        callout:
          "SmileBabaHub does not intentionally store complete payment-card information when that information is processed directly by our payment provider.",
      },
      {
        p: "We may receive transaction metadata necessary to confirm transactions, provide customer support, process refunds where applicable, prevent fraud, resolve disputes, and meet legal obligations. Because money-transfer and financial services can be regulated activities, availability may vary by country and service.",
      },
    ],
  },
  {
    id: "identity-verification",
    title: "5. Identity Verification and KYC",
    blocks: [
      {
        p: "Certain services may require identity verification. Where verification is required, we may collect government-issued identification, identification numbers, name, date of birth, address, verification photographs or documents, and other information necessary to comply with anti-fraud, anti-money-laundering, sanctions, or other legal requirements.",
      },
      {
        p: "We collect such information only when necessary for the applicable service or legal obligation. Identity information may be processed by authorised third-party verification providers. We do not use government identification information for unrelated advertising.",
      },
    ],
  },
  {
    id: "location",
    title: "6. Location Information",
    blocks: [
      {
        p: "Some SmileBabaHub features can benefit from location information, including finding nearby marketplace listings, restaurants and accommodation, food delivery, maps, location-based search, and fraud and security purposes.",
      },
      { h3: "Precise location" },
      {
        p: "SmileBabaHub will request access to your device's precise location only when a feature requires it and, where required, only after you grant the relevant device permission. You can deny or later revoke location permission through your device settings. You may continue to use features that do not require precise location. Where possible, we may use approximate location instead.",
      },
      {
        callout:
          "We do not continuously collect GPS location merely because the app is installed.",
      },
    ],
  },
  {
    id: "device-information",
    title: "7. Device and Technical Information",
    blocks: [
      {
        list: [
          "Device type",
          "Operating system and version",
          "App version",
          "IP address",
          "Browser type",
          "Network information",
          "Language and regional settings",
          "General device information",
          "Crash reports",
          "Security information",
          "Approximate location derived from IP address",
          "Usage information",
        ],
      },
      {
        p: "We use this information for operating the service, security, fraud prevention, troubleshooting, crash diagnosis, performance improvement, analytics, account protection, and abuse prevention.",
      },
    ],
  },
  {
    id: "analytics",
    title: "8. Analytics",
    blocks: [
      {
        p: "We may use analytics technologies to understand how users interact with SmileBabaHub, including feature usage, app performance, errors and crashes, general usage patterns, navigation, and service improvement. Where analytics involves personal information, we limit its use to legitimate product, security, operational, or other disclosed purposes.",
      },
    ],
  },
  {
    id: "advertising",
    title: "9. Advertising and Tracking",
    blocks: [
      {
        p: "SmileBabaHub may display marketplace advertisements, sponsored listings, promoted products, restaurant promotions, property promotions, and, where applicable, third-party advertisements.",
      },
      {
        p: "Displaying an advertisement does not necessarily mean that we track you across other companies' apps or websites. If we or an advertising partner engages in tracking that requires consent under applicable law or Apple's App Tracking Transparency framework, we will request the required permission before that tracking occurs.",
      },
      {
        callout:
          "You may decline tracking permission. We will not condition access to marketplace, food, accommodation, or money-transfer functionality on granting optional advertising-tracking permission.",
      },
    ],
  },
  {
    id: "cookies",
    title: "10. Cookies and Similar Technologies",
    blocks: [
      { h3: "Essential purposes" },
      {
        list: [
          "Login and authentication",
          "Security and fraud prevention",
          "Shopping carts and checkout",
          "Session management",
        ],
      },
      { h3: "Functional purposes" },
      {
        list: [
          "Language preferences",
          "Country selection",
          "User preferences",
          "Website settings",
        ],
      },
      { h3: "Analytics" },
      {
        p: "Understanding website performance, general usage, and opportunities to improve our services.",
      },
      {
        p: "Where required, non-essential cookies will be used only after obtaining appropriate consent. You can manage cookies through your browser settings.",
      },
    ],
  },
  {
    id: "how-we-use",
    title: "11. How We Use Your Information",
    blocks: [
      {
        ordered: [
          "Create and manage your account.",
          "Provide marketplace services.",
          "Process purchases and sales.",
          "Process food orders.",
          "Facilitate accommodation bookings.",
          "Facilitate money transfers and payment services.",
          "Perform identity verification and compliance checks.",
          "Communicate with you.",
          "Send order, booking, payment, and transaction notifications.",
          "Provide customer support.",
          "Prevent fraud, scams, money laundering, abuse, and other illegal activity.",
          "Protect users and our platform.",
          "Process refunds and resolve disputes.",
          "Improve products and services.",
          "Analyse app and website performance.",
          "Personalise relevant marketplace, food, accommodation, or service results.",
          "Send marketing communications where permitted and, where required, after obtaining consent.",
          "Comply with legal and regulatory obligations.",
          "Respond to lawful requests from authorities.",
          "Protect our legal rights and property.",
        ],
      },
    ],
  },
  {
    id: "transactional-communications",
    title: "12. Transactional Communications",
    blocks: [
      {
        p: "Even if you opt out of marketing communications, we may still send essential service communications, including account verification, password resets, security alerts, order confirmations, food-order updates, booking confirmations, money-transfer notifications, payment confirmations, important service announcements, and fraud or security notifications.",
      },
    ],
  },
  {
    id: "marketing",
    title: "13. Marketing Communications",
    blocks: [
      {
        p: "Where permitted, we may send promotional emails, SMS, push notifications, special offers, marketplace promotions, food promotions, accommodation promotions, and service announcements. You may unsubscribe from marketing communications at any time. Opting out of marketing does not stop essential transactional or security communications.",
      },
    ],
  },
  {
    id: "information-we-share",
    title: "14. Information We Share",
    blocks: [
      { callout: "We do not sell personal information." },
      { h3: "Other users" },
      {
        p: "Depending on the service, other users may see your name or display name, profile photo, listings, reviews, ratings, and public business information.",
      },
      { h3: "Marketplace buyers and sellers" },
      {
        p: "Relevant information may be shared to facilitate a transaction, communication, delivery, or dispute.",
      },
      { h3: "Food vendors and delivery providers" },
      {
        p: "Relevant order and delivery information may be shared to fulfil a food order.",
      },
      { h3: "Accommodation hosts and property managers" },
      {
        p: "Relevant booking information may be shared to complete an accommodation reservation.",
      },
      { h3: "Payment and financial service providers" },
      {
        p: "Transaction information may be shared with payment, money-transfer, banking, mobile-money, financial, or other authorised providers necessary to process a transaction.",
      },
      { h3: "Identity-verification providers" },
      {
        p: "Information may be shared with authorised verification providers when verification is required.",
      },
      { h3: "Technology providers" },
      {
        p: "We may use providers for hosting, databases, cloud storage, image and video storage, security, analytics, communications, customer support, payment processing, and fraud prevention. Such providers may process information only as necessary to provide their services to us and subject to appropriate contractual or legal protections.",
      },
      { h3: "Legal and regulatory authorities" },
      {
        p: "We may disclose information where reasonably necessary to comply with applicable law, respond to valid legal process, meet regulatory requirements, prevent fraud or financial crime, protect users, protect SmileBabaHub, investigate illegal activity, or protect life, safety, or property.",
      },
      { h3: "Business transfers" },
      {
        p: "If SmileBabaHub is involved in a merger, acquisition, restructuring, financing, sale of assets, or similar transaction, information may be transferred as part of that transaction, subject to applicable law and appropriate notice.",
      },
    ],
  },
  {
    id: "third-party-services",
    title: "15. Third-Party Services and SDKs",
    blocks: [
      {
        p: "SmileBabaHub may integrate third-party technologies and services, including payment processing, money transfers, identity verification, cloud hosting, databases, image and video storage, analytics, crash reporting, communications, and security services. Third-party providers may process information under their own privacy policies.",
      },
      {
        p: "Our Apple App Store privacy disclosures and Google Play Data Safety declaration are maintained to accurately reflect the third-party SDKs and services actually included in the production app.",
      },
    ],
  },
  {
    id: "security",
    title: "16. Data Security",
    blocks: [
      {
        list: [
          "Encryption during transmission",
          "Secure authentication",
          "Password hashing",
          "Access controls",
          "Role-based permissions",
          "Secure cloud infrastructure",
          "Monitoring for suspicious activity",
          "Fraud-prevention controls",
          "Security logging",
          "Regular security improvements",
        ],
      },
      {
        p: "No internet service can guarantee absolute security. If we become aware of a security incident affecting personal information, we will investigate and provide notifications where required by applicable law.",
      },
    ],
  },
  {
    id: "retention",
    title: "17. Data Retention",
    blocks: [
      {
        p: "We retain personal information only for as long as reasonably necessary for the purposes described in this Privacy Policy. Retention periods may depend on the type of information, service used, account status, legal requirements, financial regulations, fraud-prevention requirements, dispute resolution, and security requirements.",
      },
      { h3: "Account information" },
      { p: "Generally retained while your account remains active." },
      { h3: "Transaction and financial records" },
      {
        p: "Certain transaction records may need to be retained for a legally required period, even after account deletion.",
      },
      { h3: "Identity and KYC information" },
      {
        p: "May be retained for the period required by applicable financial, anti-money-laundering, fraud-prevention, or other regulatory requirements.",
      },
      { h3: "Messages" },
      {
        p: "Messages may be retained for a limited period where necessary for safety, fraud prevention, customer support, dispute resolution, or legal obligations.",
      },
      { h3: "Deleted information" },
      {
        p: "When information is no longer required, we will delete it, anonymise it, or securely isolate it, subject to legal retention requirements.",
      },
    ],
  },
  {
    id: "account-deletion",
    title: "18. Account Deletion",
    blocks: [
      {
        p: "You may request deletion of your SmileBabaHub account. We provide an account-deletion mechanism within the SmileBabaHub app and a web-based account deletion request at smilebabahub.com/account/delete.",
      },
      {
        p: "When an account deletion request is submitted, we will delete or anonymise information associated with the account unless we are legally required or permitted to retain specific information.",
      },
      {
        p: "Certain information may remain temporarily or for a legally required period, including:",
      },
      {
        list: [
          "Financial transaction records",
          "Fraud-prevention records",
          "Tax and accounting records",
          "Legal records",
          "Dispute records",
          "Information necessary to comply with legal obligations",
        ],
      },
    ],
  },
  {
    id: "your-rights",
    title: "19. Your Privacy Rights",
    blocks: [
      {
        list: [
          "Request access to your personal information",
          "Request correction of inaccurate information",
          "Request deletion",
          "Request restriction of certain processing",
          "Object to certain processing",
          "Withdraw consent where processing relies on consent",
          "Opt out of marketing",
          "Request a copy of certain information in a portable format",
          "Manage device permissions",
          "Manage tracking permissions",
          "Manage cookies",
          "Ask questions about how your information is used",
        ],
      },
      {
        p: `To exercise your rights, contact ${PRIVACY_CONTACT_EMAIL}. We may need to verify your identity before completing certain requests.`,
      },
    ],
  },
  {
    id: "permissions",
    title: "20. Permissions",
    blocks: [
      {
        p: "SmileBabaHub requests device permissions only when a feature requires them.",
      },
      { h3: "Location" },
      {
        p: "Used for nearby listings, food delivery, accommodation, maps, or other location-based services.",
      },
      { h3: "Camera" },
      {
        p: "Used when you choose to take photographs or videos for listings, profiles, verification, or other features.",
      },
      { h3: "Photos and media" },
      { p: "Used when you choose to upload photographs or videos." },
      { h3: "Notifications" },
      {
        p: "Used for orders, bookings, payments, security alerts, messages, promotions where permitted, and other service updates.",
      },
      {
        p: "You can manage permissions through your device settings. We do not require optional permissions merely to allow you to use unrelated core functionality.",
      },
    ],
  },
  {
    id: "children",
    title: "21. Children's Privacy",
    blocks: [
      {
        p: "SmileBabaHub is not designed to knowingly collect personal information from children in violation of applicable law. Users must meet the minimum age required to use particular services. Financial and money-transfer features may only be used by users who meet applicable legal age and eligibility requirements.",
      },
      {
        p: "If we learn that we have collected personal information from a child where collection was not permitted, we will take reasonable steps to delete the information.",
      },
    ],
  },
  {
    id: "international-transfers",
    title: "22. International Data Transfers",
    blocks: [
      {
        p: "SmileBabaHub and its service providers may process or store information in countries other than the country in which you live. Our technology infrastructure or service providers may operate in Ghana, Nigeria, the United States, European countries, or other jurisdictions. Where information is transferred internationally, we will take reasonable steps to ensure appropriate safeguards are applied as required by applicable law.",
      },
    ],
  },
  {
    id: "third-party-websites",
    title: "23. Your Information and Third-Party Websites",
    blocks: [
      {
        p: "SmileBabaHub may contain links to third-party websites, payment pages, restaurants, accommodation providers, or other services. When you leave SmileBabaHub and interact with a third-party service, that third party's privacy policy may apply.",
      },
    ],
  },
  {
    id: "changes",
    title: "24. Changes to This Privacy Policy",
    blocks: [
      {
        p: 'We may update this Privacy Policy from time to time. When we make material changes, we may notify users through the SmileBabaHub app, website notice, email, push notification, or another appropriate communication. The "Last Updated" date at the top indicates when the policy was most recently changed.',
      },
    ],
  },
  {
    id: "contact",
    title: "25. Contact Us",
    blocks: [
      {
        p: "If you have questions, privacy requests, complaints, or concerns about how SmileBabaHub handles your information, contact:",
      },
      {
        list: [
          "SmileBabaHub Ltd., Data Protection Office",
          "Accra, Ghana",
          `Email: ${PRIVACY_CONTACT_EMAIL}`,
          "Website: smilebabahub.com",
        ],
      },
    ],
  },
];
