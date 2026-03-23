"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  SectionCard,
  Field,
  Input,
  Select,
  Textarea,
  PhoneInput,
  SaveButton,
} from "../(component)/Ui";

export default function StoreTab() {
  const bannerRef = useRef<HTMLInputElement>(null);
  const logoRef = useRef<HTMLInputElement>(null);
  const [banner, setBanner] = useState<string | null>(null);
  const [logo, setLogo] = useState<string | null>(null);

  return (
    <div>
      {/* ── Store Identity ── */}
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
            className="relative w-full h-28 sm:h-36 rounded-xl border-2 border-dashed border-gray-200
              bg-gray-50 hover:border-orange-400 hover:bg-orange-50 transition cursor-pointer
              overflow-hidden flex items-center justify-center"
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
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-5">
          <div
            onClick={() => logoRef.current?.click()}
            className="w-20 h-20 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50
              hover:border-orange-400 cursor-pointer flex items-center justify-center
              overflow-hidden flex-shrink-0"
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
          <div className="text-center sm:text-left">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-5">
          <Field label="Store name" required>
            <Input
              placeholder="e.g. Kwame's Electronics"
              defaultValue="Kwame's Electronics"
            />
          </Field>
          <Field label="Store slug" hint="smilebaba.com/store/your-slug">
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-gray-200 bg-gray-50 text-xs text-gray-400 whitespace-nowrap">
                store/
              </span>
              <input
                defaultValue="kwames-electronics"
                className="flex-1 min-w-0 border border-gray-200 rounded-r-xl px-3 py-2.5 text-sm
                  focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
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
            <PhoneInput />
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-5">
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
                className="flex-1 min-w-0 border border-gray-200 rounded-r-xl px-3 py-2.5 text-sm
                  focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              />
            </div>
          </Field>
          <Field label="Facebook page">
            <Input placeholder="https://facebook.com/yourpage" />
          </Field>
        </div>
        <SaveButton />
      </SectionCard>

      {/* ── Store Policies ── */}
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

      {/* ── Operating Hours ── */}
      <SectionCard
        title="Operating Hours"
        description="Let customers know when you're available"
      >
        <div className="space-y-1">
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
              className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3 py-2
                border-b border-gray-50 last:border-0"
            >
              <div className="w-24 text-sm text-gray-600 font-medium flex-shrink-0">
                {day}
              </div>
              <Select className="w-24 sm:w-28 py-1.5 text-xs flex-shrink-0">
                <option>Open</option>
                <option>Closed</option>
              </Select>
              <Input
                className="w-24 py-1.5 text-xs flex-shrink-0"
                type="time"
                defaultValue="08:00"
              />
              <span className="text-gray-300 text-xs hidden sm:inline">to</span>
              <Input
                className="w-24 py-1.5 text-xs flex-shrink-0"
                type="time"
                defaultValue="18:00"
              />
            </div>
          ))}
        </div>
        <SaveButton />
      </SectionCard>
    </div>
  );
}
