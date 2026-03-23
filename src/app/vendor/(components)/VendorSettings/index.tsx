"use client";

import { useState, useRef } from "react";
import Image from "next/image";

// ── Types ──────────────────────────────────────────────────────────────────
type Tab =
  | "profile"
  | "store"
  | "payments"
  | "notifications"
  | "security"
  | "promotion"
  | "shipping"
  | "kyc";

interface VideoFile {
  file: File;
  preview: string;
  name: string;
  size: string;
  duration?: string;
}

// ── Helpers ────────────────────────────────────────────────────────────────
function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

// ── Sub-components ─────────────────────────────────────────────────────────

function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/60">
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
        {description && (
          <p className="text-xs text-gray-500 mt-0.5">{description}</p>
        )}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-5">
      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
        {label} {required && <span className="text-orange-500">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

function Input({
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800
        focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent
        placeholder:text-gray-300 bg-white transition ${className}`}
    />
  );
}

function Select({
  className = "",
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800
        focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-white transition ${className}`}
    >
      {children}
    </select>
  );
}

function Textarea({
  className = "",
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800
        focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent
        placeholder:text-gray-300 bg-white transition resize-none ${className}`}
    />
  );
}

function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <div>
        <p className="text-sm font-medium text-gray-700">{label}</p>
        {description && (
          <p className="text-xs text-gray-400 mt-0.5">{description}</p>
        )}
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent
          transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-1
          ${checked ? "bg-orange-500" : "bg-gray-200"}`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200
            ${checked ? "translate-x-5" : "translate-x-0"}`}
        />
      </button>
    </div>
  );
}

function SaveButton({ loading = false }: { loading?: boolean }) {
  return (
    <button
      type="button"
      disabled={loading}
      className="mt-2 px-6 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300
        text-white text-sm font-semibold rounded-xl transition shadow-sm shadow-orange-200"
    >
      {loading ? "Saving…" : "Save changes"}
    </button>
  );
}

// ── TAB PANELS ─────────────────────────────────────────────────────────────

function ProfileTab() {
  const avatarRef = useRef<HTMLInputElement>(null);
  const [avatar, setAvatar] = useState<string | null>(null);

  const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setAvatar(URL.createObjectURL(file));
  };

  return (
    <div>
      <SectionCard
        title="Personal Information"
        description="Your public identity on Smilebaba"
      >
        {/* Avatar */}
        <div className="flex items-center gap-5 mb-6 pb-6 border-b border-gray-100">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-orange-50 border-2 border-orange-100 overflow-hidden flex items-center justify-center">
              {avatar ? (
                <Image
                  src={avatar}
                  alt="avatar"
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-3xl">🧑‍💼</span>
              )}
            </div>
            <button
              type="button"
              onClick={() => avatarRef.current?.click()}
              className="absolute -bottom-1 -right-1 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs shadow"
            >
              ✏️
            </button>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700">Profile photo</p>
            <p className="text-xs text-gray-400 mt-0.5">
              JPG, PNG or WEBP. Max 2MB
            </p>
            <button
              type="button"
              onClick={() => avatarRef.current?.click()}
              className="mt-2 text-xs text-orange-500 font-medium hover:underline"
            >
              Upload new photo
            </button>
            <input
              ref={avatarRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatar}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5">
          <Field label="First name" required>
            <Input placeholder="e.g. Kwame" defaultValue="Kwame" />
          </Field>
          <Field label="Last name" required>
            <Input placeholder="e.g. Asante" defaultValue="Asante" />
          </Field>
          <Field
            label="Display name"
            hint="This is shown on your store and listings"
          >
            <Input
              placeholder="e.g. Kwame's Store"
              defaultValue="Kwame's Electronics"
            />
          </Field>
          <Field label="Phone number" required>
            <div className="flex gap-2">
              <Select className="w-28 flex-shrink-0">
                <option value="+233">🇬🇭 +233</option>
                <option value="+234">🇳🇬 +234</option>
              </Select>
              <Input placeholder="244 123 456" defaultValue="244 123 456" />
            </div>
          </Field>
          <Field label="Email address" required>
            <Input
              type="email"
              placeholder="kwame@email.com"
              defaultValue="kwame@smilebaba.com"
            />
          </Field>
          <Field label="Date of birth">
            <Input type="date" defaultValue="1990-05-15" />
          </Field>
          <Field label="Gender">
            <Select defaultValue="male">
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Prefer not to say</option>
            </Select>
          </Field>
          <Field label="Country" required>
            <Select defaultValue="GH">
              <option value="GH">🇬🇭 Ghana</option>
              <option value="NG">🇳🇬 Nigeria</option>
            </Select>
          </Field>
          <Field label="Region / State" required>
            <Select defaultValue="gh-ashanti">
              <option value="gh-greater-accra">Greater Accra</option>
              <option value="gh-ashanti">Ashanti</option>
              <option value="ng-lagos">Lagos</option>
              <option value="ng-abuja">FCT — Abuja</option>
            </Select>
          </Field>
          <Field label="City">
            <Input placeholder="e.g. Kumasi" defaultValue="Kumasi" />
          </Field>
        </div>
        <Field
          label="Short bio"
          hint="Tell customers a little about yourself. Max 200 characters."
        >
          <Textarea
            rows={3}
            placeholder="e.g. I sell quality electronics at the best prices in Kumasi…"
            defaultValue="Quality electronics dealer based in Kumasi. 5+ years experience."
          />
        </Field>
        <SaveButton />
      </SectionCard>
    </div>
  );
}

function StoreTab() {
  const bannerRef = useRef<HTMLInputElement>(null);
  const logoRef = useRef<HTMLInputElement>(null);
  const [banner, setBanner] = useState<string | null>(null);
  const [logo, setLogo] = useState<string | null>(null);

  return (
    <div>
      <SectionCard
        title="Store Identity"
        description="Brand your storefront on Smilebaba"
      >
        {/* Banner */}
        <Field
          label="Store banner"
          hint="Recommended: 1200×400px. JPG or PNG. Max 5MB."
        >
          <div
            onClick={() => bannerRef.current?.click()}
            className="relative w-full h-36 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50
              hover:border-orange-400 hover:bg-orange-50 transition cursor-pointer overflow-hidden flex items-center justify-center"
          >
            {banner ? (
              <Image
                src={banner}
                alt="banner"
                width={1200}
                height={400}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center">
                <p className="text-2xl">🖼️</p>
                <p className="text-xs text-gray-400 mt-1">
                  Click to upload banner
                </p>
              </div>
            )}
          </div>
          <input
            ref={bannerRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) setBanner(URL.createObjectURL(f));
            }}
          />
        </Field>

        {/* Logo */}
        <div className="flex items-center gap-5 mb-5">
          <div
            onClick={() => logoRef.current?.click()}
            className="w-20 h-20 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50
              hover:border-orange-400 cursor-pointer flex items-center justify-center overflow-hidden"
          >
            {logo ? (
              <Image
                src={logo}
                alt="logo"
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-2xl">🏪</span>
            )}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700">Store logo</p>
            <p className="text-xs text-gray-400 mt-0.5">
              Square image, 400×400px recommended
            </p>
            <button
              type="button"
              onClick={() => logoRef.current?.click()}
              className="text-xs text-orange-500 font-medium mt-1 hover:underline"
            >
              Upload logo
            </button>
            <input
              ref={logoRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) setLogo(URL.createObjectURL(f));
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5">
          <Field label="Store name" required>
            <Input
              placeholder="e.g. Kwame's Electronics"
              defaultValue="Kwame's Electronics"
            />
          </Field>
          <Field label="Store slug" hint="smilebaba.com/store/your-slug">
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-gray-200 bg-gray-50 text-xs text-gray-400">
                store/
              </span>
              <input
                defaultValue="kwames-electronics"
                className="flex-1 border border-gray-200 rounded-r-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              />
            </div>
          </Field>
          <Field label="Store category" required>
            <Select defaultValue="electronics">
              <option value="">Select category</option>
              <option value="food">Food & Restaurants</option>
              <option value="electronics">Electronics</option>
              <option value="fashion">Fashion</option>
              <option value="vehicles">Vehicles</option>
              <option value="apartments">Apartments & Short Stays</option>
              <option value="services">Services</option>
            </Select>
          </Field>
          <Field label="Business type">
            <Select defaultValue="individual">
              <option value="individual">Individual / Sole trader</option>
              <option value="registered">Registered business</option>
              <option value="enterprise">Enterprise</option>
            </Select>
          </Field>
          <Field
            label="WhatsApp number"
            hint="Customers can reach you directly"
          >
            <div className="flex gap-2">
              <Select className="w-28 flex-shrink-0">
                <option>🇬🇭 +233</option>
                <option>🇳🇬 +234</option>
              </Select>
              <Input placeholder="244 123 456" />
            </div>
          </Field>
          <Field label="Store phone">
            <Input type="tel" placeholder="Business line" />
          </Field>
        </div>
        <Field
          label="Store description"
          hint="Describe what you sell. This appears on your public store page."
        >
          <Textarea
            rows={4}
            placeholder="Tell customers what makes your store special…"
            defaultValue="We offer quality electronics including phones, laptops and accessories at the best prices in Kumasi. Fast delivery across Greater Accra and Ashanti."
          />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5">
          <Field label="Store email">
            <Input type="email" placeholder="store@email.com" />
          </Field>
          <Field label="Website (optional)">
            <Input type="url" placeholder="https://yoursite.com" />
          </Field>
          <Field label="Instagram handle">
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-gray-200 bg-gray-50 text-xs text-gray-400">
                @
              </span>
              <input
                placeholder="yourstore"
                className="flex-1 border border-gray-200 rounded-r-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              />
            </div>
          </Field>
          <Field label="Facebook page">
            <Input placeholder="https://facebook.com/yourpage" />
          </Field>
        </div>
        <SaveButton />
      </SectionCard>

      <SectionCard
        title="Store Policies"
        description="Shown to customers before they purchase"
      >
        <Field label="Return policy">
          <Textarea
            rows={3}
            placeholder="e.g. Items can be returned within 7 days if unused and in original packaging…"
          />
        </Field>
        <Field label="Delivery information">
          <Textarea
            rows={3}
            placeholder="e.g. We deliver within Kumasi same day. Nationwide delivery takes 1–3 business days…"
          />
        </Field>
        <Field label="Exchange policy">
          <Textarea
            rows={3}
            placeholder="e.g. Exchanges allowed within 14 days for defective items…"
          />
        </Field>
        <SaveButton />
      </SectionCard>

      <SectionCard
        title="Operating Hours"
        description="Let customers know when you're available"
      >
        {[
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ].map((day) => (
          <div
            key={day}
            className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0"
          >
            <div className="w-24 text-sm text-gray-600 font-medium">{day}</div>
            <Select className="w-28 py-1.5 text-xs">
              <option>Open</option>
              <option>Closed</option>
            </Select>
            <Input
              className="w-24 py-1.5 text-xs"
              type="time"
              defaultValue="08:00"
            />
            <span className="text-gray-300 text-xs">to</span>
            <Input
              className="w-24 py-1.5 text-xs"
              type="time"
              defaultValue="18:00"
            />
          </div>
        ))}
        <SaveButton />
      </SectionCard>
    </div>
  );
}

function PaymentsTab() {
  const [payMethod, setPayMethod] = useState<"momo" | "bank" | "both">("momo");

  return (
    <div>
      <SectionCard
        title="Payout Method"
        description="How you receive payments from Smilebaba"
      >
        <div className="flex gap-3 mb-6">
          {(["momo", "bank", "both"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setPayMethod(m)}
              className={`flex-1 py-3 rounded-xl border text-sm font-medium transition
                ${payMethod === m ? "border-orange-400 bg-orange-50 text-orange-600" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}
            >
              {m === "momo"
                ? "📱 Mobile Money"
                : m === "bank"
                  ? "🏦 Bank Transfer"
                  : "💳 Both"}
            </button>
          ))}
        </div>

        {(payMethod === "momo" || payMethod === "both") && (
          <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 mb-4">
            <p className="text-xs font-semibold text-orange-700 mb-3">
              Mobile Money Details
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5">
              <Field label="Network" required>
                <Select defaultValue="mtn">
                  <option value="mtn">MTN Mobile Money</option>
                  <option value="vodafone">Vodafone Cash</option>
                  <option value="airteltigo">AirtelTigo Money</option>
                  <option value="opay">OPay (Nigeria)</option>
                  <option value="palmpay">PalmPay (Nigeria)</option>
                </Select>
              </Field>
              <Field label="MoMo number" required>
                <Input placeholder="0244 123 456" />
              </Field>
              <Field label="Account name" required>
                <Input placeholder="Name on MoMo account" />
              </Field>
            </div>
          </div>
        )}

        {(payMethod === "bank" || payMethod === "both") && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4">
            <p className="text-xs font-semibold text-blue-700 mb-3">
              Bank Account Details
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5">
              <Field label="Bank name" required>
                <Select>
                  <option value="">Select bank</option>
                  <optgroup label="Ghana">
                    <option>GCB Bank</option>
                    <option>Ecobank Ghana</option>
                    <option>Absa Ghana</option>
                    <option>Fidelity Bank Ghana</option>
                    <option>Stanbic Bank Ghana</option>
                  </optgroup>
                  <optgroup label="Nigeria">
                    <option>Access Bank</option>
                    <option>GTBank</option>
                    <option>First Bank Nigeria</option>
                    <option>Zenith Bank</option>
                    <option>UBA</option>
                  </optgroup>
                </Select>
              </Field>
              <Field label="Account number" required>
                <Input placeholder="0123456789" maxLength={13} />
              </Field>
              <Field label="Account name" required>
                <Input placeholder="Name on bank account" />
              </Field>
              <Field label="Branch (optional)">
                <Input placeholder="e.g. Kumasi Central" />
              </Field>
            </div>
          </div>
        )}
        <SaveButton />
      </SectionCard>

      <SectionCard
        title="Tax Information"
        description="Required for payouts above regulatory thresholds"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5">
          <Field label="TIN / Tax ID">
            <Input placeholder="e.g. P0012345678" />
          </Field>
          <Field label="VAT registration number">
            <Input placeholder="Optional" />
          </Field>
          <Field label="Business registration number">
            <Input placeholder="e.g. BN-1234567" />
          </Field>
        </div>
        <SaveButton />
      </SectionCard>

      <SectionCard
        title="Payout Schedule"
        description="When Smilebaba pays you your earnings"
      >
        <Field label="Payout frequency">
          <Select defaultValue="weekly">
            <option value="daily">Daily (Premium vendors only)</option>
            <option value="weekly">Weekly — every Monday</option>
            <option value="biweekly">Bi-weekly</option>
            <option value="monthly">Monthly — 1st of every month</option>
          </Select>
        </Field>
        <Field
          label="Minimum payout threshold"
          hint="Payouts only process when your balance reaches this amount"
        >
          <div className="flex gap-2">
            <Select className="w-24 flex-shrink-0">
              <option>GHS</option>
              <option>NGN</option>
            </Select>
            <Input type="number" placeholder="100" defaultValue="100" />
          </div>
        </Field>
        <SaveButton />
      </SectionCard>
    </div>
  );
}

function NotificationsTab() {
  const [notifs, setNotifs] = useState({
    newOrder: true,
    orderStatus: true,
    newReview: true,
    lowStock: true,
    promotionApproved: true,
    payoutSent: true,
    newMessage: true,
    weeklyReport: false,
    marketingTips: false,
    smsNewOrder: true,
    smsPayment: true,
    whatsappOrder: false,
    emailDigest: true,
  });

  const toggle = (k: keyof typeof notifs) =>
    setNotifs((p) => ({ ...p, [k]: !p[k] }));

  return (
    <div>
      <SectionCard title="Order Notifications">
        <Toggle
          checked={notifs.newOrder}
          onChange={() => toggle("newOrder")}
          label="New order placed"
          description="Get notified every time a customer places an order"
        />
        <Toggle
          checked={notifs.orderStatus}
          onChange={() => toggle("orderStatus")}
          label="Order status updates"
          description="Cancellations, returns, and disputes"
        />
      </SectionCard>

      <SectionCard title="Store Notifications">
        <Toggle
          checked={notifs.newReview}
          onChange={() => toggle("newReview")}
          label="New review received"
          description="When a customer reviews your product or store"
        />
        <Toggle
          checked={notifs.lowStock}
          onChange={() => toggle("lowStock")}
          label="Low stock alert"
          description="When a product stock falls below 5 units"
        />
        <Toggle
          checked={notifs.newMessage}
          onChange={() => toggle("newMessage")}
          label="New customer message"
        />
      </SectionCard>

      <SectionCard title="Financial Notifications">
        <Toggle
          checked={notifs.payoutSent}
          onChange={() => toggle("payoutSent")}
          label="Payout processed"
          description="When Smilebaba sends your earnings"
        />
        <Toggle
          checked={notifs.promotionApproved}
          onChange={() => toggle("promotionApproved")}
          label="Promotion approved / rejected"
          description="Status updates on your submitted promo videos"
        />
      </SectionCard>

      <SectionCard
        title="SMS Notifications"
        description="Standard network rates apply"
      >
        <Toggle
          checked={notifs.smsNewOrder}
          onChange={() => toggle("smsNewOrder")}
          label="SMS: New orders"
        />
        <Toggle
          checked={notifs.smsPayment}
          onChange={() => toggle("smsPayment")}
          label="SMS: Payout confirmation"
        />
      </SectionCard>

      <SectionCard title="WhatsApp Notifications">
        <Toggle
          checked={notifs.whatsappOrder}
          onChange={() => toggle("whatsappOrder")}
          label="WhatsApp: Order alerts"
          description="Receive order summaries on WhatsApp"
        />
      </SectionCard>

      <SectionCard title="Marketing & Reports">
        <Toggle
          checked={notifs.weeklyReport}
          onChange={() => toggle("weeklyReport")}
          label="Weekly performance report"
          description="Sales, views, and conversion summary every Monday"
        />
        <Toggle
          checked={notifs.marketingTips}
          onChange={() => toggle("marketingTips")}
          label="Marketing tips & platform updates"
        />
        <Toggle
          checked={notifs.emailDigest}
          onChange={() => toggle("emailDigest")}
          label="Daily email digest"
        />
      </SectionCard>

      <SaveButton />
    </div>
  );
}

function SecurityTab() {
  const [show, setShow] = useState({ old: false, new: false, confirm: false });

  return (
    <div>
      <SectionCard title="Change Password">
        <Field label="Current password" required>
          <div className="relative">
            <Input
              type={show.old ? "text" : "password"}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShow((p) => ({ ...p, old: !p.old }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs hover:text-gray-600"
            >
              {show.old ? "Hide" : "Show"}
            </button>
          </div>
        </Field>
        <Field
          label="New password"
          hint="At least 8 characters with a number and special character"
          required
        >
          <div className="relative">
            <Input
              type={show.new ? "text" : "password"}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShow((p) => ({ ...p, new: !p.new }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs hover:text-gray-600"
            >
              {show.new ? "Hide" : "Show"}
            </button>
          </div>
        </Field>
        <Field label="Confirm new password" required>
          <div className="relative">
            <Input
              type={show.confirm ? "text" : "password"}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShow((p) => ({ ...p, confirm: !p.confirm }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs hover:text-gray-600"
            >
              {show.confirm ? "Hide" : "Show"}
            </button>
          </div>
        </Field>
        <SaveButton />
      </SectionCard>

      <SectionCard
        title="Two-Factor Authentication"
        description="Add an extra layer of security to your account"
      >
        <div className="flex items-center justify-between p-4 rounded-xl bg-green-50 border border-green-100 mb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📱</span>
            <div>
              <p className="text-sm font-semibold text-gray-700">
                Authenticator app
              </p>
              <p className="text-xs text-gray-500">
                Google Authenticator or Authy
              </p>
            </div>
          </div>
          <span className="text-xs bg-green-100 text-green-700 font-semibold px-3 py-1 rounded-full">
            Enabled
          </span>
        </div>
        <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
          <div className="flex items-center gap-3">
            <span className="text-2xl">💬</span>
            <div>
              <p className="text-sm font-semibold text-gray-700">
                SMS verification
              </p>
              <p className="text-xs text-gray-500">+233 •••• 456</p>
            </div>
          </div>
          <button
            type="button"
            className="text-xs bg-orange-500 text-white font-semibold px-3 py-1.5 rounded-full hover:bg-orange-600 transition"
          >
            Enable
          </button>
        </div>
      </SectionCard>

      <SectionCard
        title="Active Sessions"
        description="Devices currently logged into your account"
      >
        {[
          {
            device: "Chrome on Windows",
            location: "Kumasi, Ghana",
            time: "Now",
            current: true,
          },
          {
            device: "Safari on iPhone",
            location: "Accra, Ghana",
            time: "2 hours ago",
            current: false,
          },
          {
            device: "Firefox on MacOS",
            location: "Lagos, Nigeria",
            time: "3 days ago",
            current: false,
          },
        ].map((s, i) => (
          <div
            key={i}
            className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">
                {s.device.includes("iPhone") ? "📱" : "💻"}
              </span>
              <div>
                <p className="text-sm font-medium text-gray-700">{s.device}</p>
                <p className="text-xs text-gray-400">
                  {s.location} · {s.time}
                </p>
              </div>
            </div>
            {s.current ? (
              <span className="text-xs bg-green-100 text-green-600 font-semibold px-2 py-1 rounded-full">
                Current
              </span>
            ) : (
              <button
                type="button"
                className="text-xs text-red-500 font-medium hover:underline"
              >
                Revoke
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          className="mt-3 w-full py-2.5 rounded-xl border border-red-200 text-red-500 text-sm font-medium hover:bg-red-50 transition"
        >
          Sign out all other devices
        </button>
      </SectionCard>

      <SectionCard title="Danger Zone">
        <div className="p-4 rounded-xl border border-red-100 bg-red-50">
          <p className="text-sm font-semibold text-red-700 mb-1">
            Delete vendor account
          </p>
          <p className="text-xs text-red-500 mb-3">
            This will permanently delete your store, listings, and all data.
            This cannot be undone.
          </p>
          <button
            type="button"
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold rounded-xl transition"
          >
            Request account deletion
          </button>
        </div>
      </SectionCard>
    </div>
  );
}

function PromotionTab() {
  const videoRef = useRef<HTMLInputElement>(null);
  const [videos, setVideos] = useState<VideoFile[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    duration: "",
    budget: "",
    targetRegion: "",
    targetAudience: "",
    startDate: "",
    endDate: "",
    contactName: "",
    contactPhone: "",
    contactEmail: "",
    agree: false,
  });

  const addVideo = (file: File) => {
    if (!file.type.startsWith("video/")) return;
    const url = URL.createObjectURL(file);
    setVideos((prev) => [
      ...prev,
      { file, preview: url, name: file.name, size: formatBytes(file.size) },
    ]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    Array.from(e.dataTransfer.files).forEach(addVideo);
  };

  const handleSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 2000);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center text-4xl mb-4">
          ✅
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">
          Promotion submitted!
        </h3>
        <p className="text-sm text-gray-500 max-w-sm">
          Your video and promotion request has been sent to the Smilebaba team.
          We'll review and get back to you within 2–3 business days.
        </p>
        <button
          type="button"
          onClick={() => {
            setSubmitted(false);
            setVideos([]);
          }}
          className="mt-6 px-6 py-2.5 bg-orange-500 text-white text-sm font-semibold rounded-xl hover:bg-orange-600 transition"
        >
          Submit another
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Hero banner */}
      <div className="relative rounded-2xl overflow-hidden mb-6 bg-gradient-to-r from-orange-500 to-orange-400 p-6 text-white">
        <div className="relative z-10">
          <p className="text-xs font-semibold uppercase tracking-wider opacity-80 mb-1">
            🎬 Smilebaba Promotion Hub
          </p>
          <h2 className="text-xl font-bold mb-2">
            Reach thousands of buyers across Ghana & Nigeria
          </h2>
          <p className="text-sm opacity-90 max-w-lg">
            Submit your promotional video and Smilebaba will feature it on the
            platform, social media, and our partner channels. Boost your store
            visibility today.
          </p>
          <div className="flex gap-6 mt-4">
            {[
              ["500K+", "Monthly users"],
              ["2 countries", "Ghana & Nigeria"],
              ["48h", "Review turnaround"],
            ].map(([v, l]) => (
              <div key={l}>
                <p className="text-lg font-bold">{v}</p>
                <p className="text-xs opacity-75">{l}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute right-4 top-4 text-7xl opacity-20">📹</div>
      </div>

      {/* How it works */}
      <SectionCard
        title="How promotion works"
        description="3 simple steps to get your store featured"
      >
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              step: "1",
              icon: "📤",
              title: "Upload your video",
              desc: "Record a 15–90 second promotional video showcasing your store or products",
            },
            {
              step: "2",
              icon: "🔍",
              title: "Smilebaba reviews",
              desc: "Our team reviews your submission within 48 hours for quality and guidelines",
            },
            {
              step: "3",
              icon: "🚀",
              title: "Go live",
              desc: "Approved videos are featured on Smilebaba platform and social media channels",
            },
          ].map((s) => (
            <div
              key={s.step}
              className="text-center p-4 rounded-xl bg-orange-50 border border-orange-100"
            >
              <div className="text-3xl mb-2">{s.icon}</div>
              <p className="text-xs font-bold text-orange-600 mb-1">
                Step {s.step}
              </p>
              <p className="text-sm font-semibold text-gray-700 mb-1">
                {s.title}
              </p>
              <p className="text-xs text-gray-500">{s.desc}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Video upload */}
      <SectionCard
        title="Upload promotional video"
        description="MP4, MOV or WEBM. Max 500MB. Duration: 15 seconds to 3 minutes."
      >
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => videoRef.current?.click()}
          className={`relative w-full rounded-2xl border-2 border-dashed transition cursor-pointer p-8 text-center
            ${dragOver ? "border-orange-400 bg-orange-50 scale-[1.01]" : "border-gray-200 bg-gray-50 hover:border-orange-300 hover:bg-orange-50/50"}`}
        >
          <div className="text-5xl mb-3">{dragOver ? "📥" : "🎬"}</div>
          <p className="text-sm font-semibold text-gray-700">
            Drag & drop your video here
          </p>
          <p className="text-xs text-gray-400 mt-1">
            or click to browse your files
          </p>
          <p className="text-xs text-gray-300 mt-2">
            MP4 · MOV · WEBM · Max 500MB
          </p>
          <input
            ref={videoRef}
            type="file"
            accept="video/*"
            multiple
            className="hidden"
            onChange={(e) => Array.from(e.target.files || []).forEach(addVideo)}
          />
        </div>

        {/* Uploaded video list */}
        {videos.length > 0 && (
          <div className="mt-4 space-y-3">
            {videos.map((v, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100"
              >
                <video
                  src={v.preview}
                  className="w-16 h-12 rounded-lg object-cover bg-gray-200"
                  muted
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-700 truncate">
                    {v.name}
                  </p>
                  <p className="text-xs text-gray-400">{v.size}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-green-100 text-green-600 font-medium px-2 py-0.5 rounded-full">
                    Ready
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setVideos((p) => p.filter((_, j) => j !== i))
                    }
                    className="text-xs text-red-400 hover:text-red-600"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      {/* Promotion details */}
      <SectionCard
        title="Promotion details"
        description="Tell us about your campaign"
      >
        <Field
          label="Campaign title"
          required
          hint="A short catchy title for your promotion"
        >
          <Input
            placeholder="e.g. Big Electronics Sale — 30% off this week!"
            value={form.title}
            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
          />
        </Field>
        <Field
          label="Promotion description"
          required
          hint="What are you promoting? What offer or message should viewers take away?"
        >
          <Textarea
            rows={4}
            placeholder="Describe what this promotional video is about…"
            value={form.description}
            onChange={(e) =>
              setForm((p) => ({ ...p, description: e.target.value }))
            }
          />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5">
          <Field label="Product / category to promote" required>
            <Select
              value={form.category}
              onChange={(e) =>
                setForm((p) => ({ ...p, category: e.target.value }))
              }
            >
              <option value="">Select category</option>
              <option>Food & Restaurants</option>
              <option>Electronics</option>
              <option>Fashion</option>
              <option>Vehicles</option>
              <option>Apartments & Short Stays</option>
              <option>Services</option>
              <option>General / Entire Store</option>
            </Select>
          </Field>
          <Field label="Promotion type">
            <Select>
              <option>Flash sale</option>
              <option>New arrival</option>
              <option>Store launch</option>
              <option>Seasonal offer</option>
              <option>Brand awareness</option>
              <option>Product demo</option>
            </Select>
          </Field>
          <Field label="Target region" required>
            <Select
              value={form.targetRegion}
              onChange={(e) =>
                setForm((p) => ({ ...p, targetRegion: e.target.value }))
              }
            >
              <option value="">All regions (Ghana + Nigeria)</option>
              <option>Ghana only</option>
              <option>Nigeria only</option>
              <option>Greater Accra</option>
              <option>Ashanti Region</option>
              <option>Lagos</option>
              <option>FCT — Abuja</option>
            </Select>
          </Field>
          <Field label="Target audience">
            <Select>
              <option>All users</option>
              <option>18–24 (Young adults)</option>
              <option>25–34 (Millennials)</option>
              <option>35–44 (Adults)</option>
              <option>Business buyers (B2B)</option>
            </Select>
          </Field>
          <Field label="Promotion start date">
            <Input
              type="date"
              value={form.startDate}
              onChange={(e) =>
                setForm((p) => ({ ...p, startDate: e.target.value }))
              }
            />
          </Field>
          <Field label="Promotion end date">
            <Input
              type="date"
              value={form.endDate}
              onChange={(e) =>
                setForm((p) => ({ ...p, endDate: e.target.value }))
              }
            />
          </Field>
          <Field
            label="Promotion budget (optional)"
            hint="How much are you willing to spend?"
          >
            <div className="flex gap-2">
              <Select className="w-24 flex-shrink-0">
                <option>GHS</option>
                <option>NGN</option>
              </Select>
              <Input
                type="number"
                placeholder="500"
                value={form.budget}
                onChange={(e) =>
                  setForm((p) => ({ ...p, budget: e.target.value }))
                }
              />
            </div>
          </Field>
          <Field label="Promotion package">
            <Select>
              <option>Free — Platform feature (limited)</option>
              <option>Basic — GHS 200/week</option>
              <option>Standard — GHS 500/week</option>
              <option>Premium — GHS 1,200/week (homepage banner)</option>
            </Select>
          </Field>
        </div>
      </SectionCard>

      {/* Contact */}
      <SectionCard
        title="Contact for this campaign"
        description="Who should Smilebaba reach for approval and feedback?"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5">
          <Field label="Contact name" required>
            <Input
              placeholder="Full name"
              value={form.contactName}
              onChange={(e) =>
                setForm((p) => ({ ...p, contactName: e.target.value }))
              }
            />
          </Field>
          <Field label="Contact phone" required>
            <div className="flex gap-2">
              <Select className="w-28 flex-shrink-0">
                <option>🇬🇭 +233</option>
                <option>🇳🇬 +234</option>
              </Select>
              <Input
                placeholder="244 123 456"
                value={form.contactPhone}
                onChange={(e) =>
                  setForm((p) => ({ ...p, contactPhone: e.target.value }))
                }
              />
            </div>
          </Field>
          <Field label="Contact email">
            <Input
              type="email"
              placeholder="email@yourstore.com"
              value={form.contactEmail}
              onChange={(e) =>
                setForm((p) => ({ ...p, contactEmail: e.target.value }))
              }
            />
          </Field>
          <Field label="Preferred contact method">
            <Select>
              <option>Phone call</option>
              <option>WhatsApp</option>
              <option>Email</option>
            </Select>
          </Field>
        </div>
      </SectionCard>

      {/* Terms */}
      <SectionCard title="Promotion guidelines & agreement">
        <div className="bg-gray-50 rounded-xl p-4 text-xs text-gray-500 space-y-1.5 mb-4 max-h-40 overflow-y-auto">
          <p className="font-semibold text-gray-700">
            Smilebaba Promotional Video Guidelines
          </p>
          <p>• Video must be clear, well-lit, and professional in quality.</p>
          <p>
            • Content must be relevant to your store and the products you sell
            on Smilebaba.
          </p>
          <p>• No misleading claims, false pricing, or exaggerated offers.</p>
          <p>• No offensive, discriminatory, or inappropriate content.</p>
          <p>
            • Video must be original and you must own all rights to the content.
          </p>
          <p>
            • No competitor platform names or logos should appear in the video.
          </p>
          <p>• Maximum video length: 3 minutes. Minimum: 15 seconds.</p>
          <p>
            • Smilebaba reserves the right to reject any submission that
            violates these guidelines.
          </p>
          <p>
            • Approved videos may be shared on Smilebaba's social media
            platforms.
          </p>
          <p>
            • Refunds for paid packages are only available if Smilebaba rejects
            the video before publishing.
          </p>
        </div>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.agree}
            onChange={(e) =>
              setForm((p) => ({ ...p, agree: e.target.checked }))
            }
            className="mt-0.5 accent-orange-500"
          />
          <span className="text-sm text-gray-600">
            I have read and agree to the Smilebaba Promotional Video Guidelines.
            I confirm all content in my video is original and I own the rights
            to it.
          </span>
        </label>
        <button
          type="button"
          disabled={!form.agree || videos.length === 0 || submitting}
          onClick={handleSubmit}
          className="mt-5 w-full py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-200 disabled:text-gray-400
            text-white text-sm font-bold rounded-xl transition shadow-sm shadow-orange-200 flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <span className="animate-spin">⏳</span> Submitting promotion…
            </>
          ) : (
            <>
              <span>🚀</span> Submit promotion to Smilebaba
            </>
          )}
        </button>
        {videos.length === 0 && (
          <p className="text-xs text-center text-gray-400 mt-2">
            Upload at least one video to submit
          </p>
        )}
      </SectionCard>
    </div>
  );
}

function ShippingTab() {
  return (
    <div>
      <SectionCard
        title="Delivery Zones"
        description="Where you can deliver to"
      >
        <div className="space-y-3">
          {[
            {
              zone: "Same city delivery",
              eta: "Same day – 24 hrs",
              enabled: true,
            },
            {
              zone: "Within region / state",
              eta: "1–2 business days",
              enabled: true,
            },
            {
              zone: "Nationwide (Ghana)",
              eta: "2–4 business days",
              enabled: true,
            },
            {
              zone: "Nationwide (Nigeria)",
              eta: "3–5 business days",
              enabled: false,
            },
            {
              zone: "International",
              eta: "7–14 business days",
              enabled: false,
            },
          ].map((z) => (
            <div
              key={z.zone}
              className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50"
            >
              <div>
                <p className="text-sm font-medium text-gray-700">{z.zone}</p>
                <p className="text-xs text-gray-400">{z.eta}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked={z.enabled}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-gray-200 peer-checked:bg-orange-500 rounded-full transition peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition" />
              </label>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Delivery Pricing">
        <Field label="Delivery pricing model">
          <Select>
            <option>Fixed rate per order</option>
            <option>Free delivery (absorbed by seller)</option>
            <option>Buyer pays actual cost</option>
            <option>Free above a minimum order</option>
          </Select>
        </Field>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5">
          <Field label="Base delivery fee" hint="Charged per order">
            <div className="flex gap-2">
              <Select className="w-20 flex-shrink-0">
                <option>GHS</option>
                <option>NGN</option>
              </Select>
              <Input type="number" placeholder="20" defaultValue="20" />
            </div>
          </Field>
          <Field
            label="Free delivery threshold"
            hint="Order amount above which delivery is free"
          >
            <div className="flex gap-2">
              <Select className="w-20 flex-shrink-0">
                <option>GHS</option>
                <option>NGN</option>
              </Select>
              <Input type="number" placeholder="200" />
            </div>
          </Field>
        </div>
        <SaveButton />
      </SectionCard>

      <SectionCard title="Dispatch & Handling">
        <Field
          label="Average dispatch time"
          hint="How long after an order is placed before you ship it"
        >
          <Select defaultValue="24">
            <option value="same">Same day</option>
            <option value="24">Within 24 hours</option>
            <option value="48">Within 48 hours</option>
            <option value="72">Within 72 hours</option>
          </Select>
        </Field>
        <Field
          label="Packaging notes"
          hint="Special packaging or handling instructions"
        >
          <Textarea
            rows={2}
            placeholder="e.g. All electronics shipped in bubble wrap and double-boxed"
          />
        </Field>
        <SaveButton />
      </SectionCard>
    </div>
  );
}

function KycTab() {
  const [docType, setDocType] = useState("ghana-card");
  const frontRef = useRef<HTMLInputElement>(null);
  const backRef = useRef<HTMLInputElement>(null);
  const bizRef = useRef<HTMLInputElement>(null);
  const [front, setFront] = useState<string | null>(null);
  const [back, setBack] = useState<string | null>(null);
  const [biz, setBiz] = useState<string | null>(null);

  return (
    <div>
      <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100 mb-6">
        <span className="text-xl mt-0.5">ℹ️</span>
        <div>
          <p className="text-sm font-semibold text-blue-700">
            Identity verification required
          </p>
          <p className="text-xs text-blue-600 mt-0.5">
            To protect buyers and sellers on Smilebaba, we verify all vendor
            identities before enabling full payout access. This usually takes
            1–2 business days.
          </p>
        </div>
      </div>

      <SectionCard title="Verification status">
        <div className="space-y-3">
          {[
            { label: "Email address", status: "verified" },
            { label: "Phone number", status: "verified" },
            { label: "Identity document", status: "pending" },
            { label: "Business registration", status: "not_submitted" },
            { label: "Bank / MoMo account", status: "not_submitted" },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
            >
              <p className="text-sm text-gray-700">{item.label}</p>
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full
                ${
                  item.status === "verified"
                    ? "bg-green-100 text-green-600"
                    : item.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-100 text-gray-500"
                }`}
              >
                {item.status === "verified"
                  ? "✓ Verified"
                  : item.status === "pending"
                    ? "⏳ Pending review"
                    : "Not submitted"}
              </span>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="Identity document"
        description="Upload a valid government-issued ID"
      >
        <Field label="Document type" required>
          <Select value={docType} onChange={(e) => setDocType(e.target.value)}>
            <option value="ghana-card">Ghana Card (NIA)</option>
            <option value="passport">International Passport</option>
            <option value="voters-id">Voter's ID (Ghana)</option>
            <option value="nin">NIN Slip (Nigeria)</option>
            <option value="drivers">Driver's License</option>
          </Select>
        </Field>
        <div className="grid grid-cols-2 gap-4">
          {[
            {
              label: "Front of document",
              ref: frontRef,
              state: front,
              set: setFront,
            },
            {
              label: "Back of document",
              ref: backRef,
              state: back,
              set: setBack,
            },
          ].map(({ label, ref, state, set }) => (
            <div key={label}>
              <p className="text-xs font-semibold text-gray-600 mb-1.5">
                {label}
              </p>
              <div
                onClick={() => ref.current?.click()}
                className="w-full h-32 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50
                  hover:border-orange-300 cursor-pointer flex items-center justify-center overflow-hidden"
              >
                {state ? (
                  <Image
                    src={state}
                    alt={label}
                    width={200}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center">
                    <p className="text-2xl">🪪</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Click to upload
                    </p>
                  </div>
                )}
              </div>
              <input
                ref={ref}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) set(URL.createObjectURL(f));
                }}
              />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 mt-4">
          <Field label="Document number" required>
            <Input placeholder="e.g. GHA-123456789-0" />
          </Field>
          <Field label="Expiry date">
            <Input type="date" />
          </Field>
        </div>
        <SaveButton />
      </SectionCard>

      <SectionCard
        title="Business registration (optional)"
        description="Upload your business certificate for additional trust badges"
      >
        <Field label="Business registration certificate">
          <div
            onClick={() => bizRef.current?.click()}
            className="w-full h-32 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50
              hover:border-orange-300 cursor-pointer flex items-center justify-center overflow-hidden"
          >
            {biz ? (
              <Image
                src={biz}
                alt="cert"
                width={400}
                height={128}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center">
                <p className="text-2xl">📄</p>
                <p className="text-xs text-gray-400 mt-1">
                  Upload certificate (PDF or image)
                </p>
              </div>
            )}
          </div>
          <input
            ref={bizRef}
            type="file"
            accept="image/*,application/pdf"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) setBiz(URL.createObjectURL(f));
            }}
          />
        </Field>
        <Field label="Business registration number">
          <Input placeholder="e.g. BN-1234567" />
        </Field>
        <SaveButton />
      </SectionCard>
    </div>
  );
}

// ── Tab config ─────────────────────────────────────────────────────────────
const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "profile", label: "Profile", icon: "👤" },
  { id: "store", label: "Store", icon: "🏪" },
  { id: "payments", label: "Payments", icon: "💳" },
  { id: "shipping", label: "Shipping", icon: "🚚" },
  { id: "notifications", label: "Notifications", icon: "🔔" },
  { id: "promotion", label: "Promotion", icon: "🎬" },
  { id: "kyc", label: "Verification", icon: "🪪" },
  { id: "security", label: "Security", icon: "🔐" },
];

// ── Main component ─────────────────────────────────────────────────────────
export default function VendorSettings() {
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  const renderTab = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileTab />;
      case "store":
        return <StoreTab />;
      case "payments":
        return <PaymentsTab />;
      case "shipping":
        return <ShippingTab />;
      case "notifications":
        return <NotificationsTab />;
      case "promotion":
        return <PromotionTab />;
      case "kyc":
        return <KycTab />;
      case "security":
        return <SecurityTab />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Top header */}
      <div className="bg-white border-b border-gray-100 px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-white text-sm font-bold">
            S
          </div>
          <div>
            <p className="text-sm font-bold text-gray-800">Vendor Settings</p>
            <p className="text-xs text-gray-400">Smilebaba Hub</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:flex items-center gap-1.5 text-xs bg-green-50 text-green-600 font-medium px-3 py-1.5 rounded-full border border-green-100">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
            Store active
          </span>
          <button
            type="button"
            className="text-xs text-gray-500 hover:text-gray-700 font-medium"
          >
            ← Back to dashboard
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex gap-6">
          {/* Sidebar nav */}
          <aside className="hidden md:block w-52 flex-shrink-0">
            <nav className="bg-white rounded-2xl border border-gray-100 shadow-sm p-2 sticky top-24">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition mb-0.5
                    ${
                      activeTab === tab.id
                        ? "bg-orange-500 text-white shadow-sm shadow-orange-200"
                        : "text-gray-600 hover:bg-gray-50"
                    }
                    ${tab.id === "promotion" && activeTab !== "promotion" ? "border border-orange-100 bg-orange-50/50 text-orange-600" : ""}
                  `}
                >
                  <span className="text-base">{tab.icon}</span>
                  {tab.label}
                  {tab.id === "promotion" && activeTab !== "promotion" && (
                    <span className="ml-auto text-[10px] bg-orange-500 text-white font-bold px-1.5 py-0.5 rounded-full">
                      NEW
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </aside>

          {/* Mobile tab bar */}
          <div className="md:hidden -mx-4 px-4 overflow-x-auto flex gap-2 pb-3 mb-2 sticky top-16 z-10 bg-gray-50">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition
                  ${activeTab === tab.id ? "bg-orange-500 text-white" : "bg-white text-gray-600 border border-gray-200"}`}
              >
                <span>{tab.icon}</span> {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <main className="flex-1 min-w-0">
            <div className="mb-5">
              <h2 className="text-lg font-bold text-gray-800">
                {TABS.find((t) => t.id === activeTab)?.icon}{" "}
                {TABS.find((t) => t.id === activeTab)?.label}
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                {activeTab === "profile" &&
                  "Manage your personal information and public identity"}
                {activeTab === "store" &&
                  "Customise your store appearance, policies and hours"}
                {activeTab === "payments" &&
                  "Configure payout methods and financial details"}
                {activeTab === "shipping" &&
                  "Set delivery zones, fees and dispatch times"}
                {activeTab === "notifications" &&
                  "Choose what updates you receive and how"}
                {activeTab === "promotion" &&
                  "Submit a promotional video to be featured by Smilebaba"}
                {activeTab === "kyc" &&
                  "Verify your identity to unlock full vendor access"}
                {activeTab === "security" &&
                  "Password, two-factor auth and active sessions"}
              </p>
            </div>
            {renderTab()}
          </main>
        </div>
      </div>
    </div>
  );
}
