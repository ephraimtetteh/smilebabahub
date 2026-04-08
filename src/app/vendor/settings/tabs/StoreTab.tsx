"use client";
// Vendor Settings → Store tab
// Loads store data from user. Saves via PATCH /auth/profile.
// Banner and logo upload to Cloudinary.

import { useState, useEffect } from "react";
import {
  SectionCard,
  Field,
  Input,
  Select,
  Textarea,
  PhoneInput,
  SaveButton,
  ImageUpload,
} from "../(components)/UI";
import { uploadToCloudinary } from "@/src/utils/uploadToCloudinary";
import { useVendorSettings } from "@/src/hooks/useVendorSettings";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

type Hours = Record<string, { open: boolean; from: string; to: string }>;

const DEFAULT_HOURS: Hours = Object.fromEntries(
  DAYS.map((d) => [d, { open: d !== "Sunday", from: "08:00", to: "18:00" }]),
);

export default function StoreTab() {
  const { user, saving, saveProfile } = useVendorSettings();

  const [banner, setBanner] = useState<string>(user?.storeBanner ?? "");
  const [logo, setLogo] = useState<string>(user?.storeLogo ?? "");
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [hours, setHours] = useState<Hours>(DEFAULT_HOURS);

  const [store, setStore] = useState({
    storeName: user?.storeName ?? "",
    storeSlug: user?.storeSlug ?? "",
    storeCategory: user?.storeCategory ?? "",
    storeDescription: user?.storeDescription ?? "",
    storeEmail: user?.storeEmail ?? "",
    storeWebsite: user?.storeWebsite ?? "",
    instagram: user?.instagram ?? "",
    facebook: user?.facebook ?? "",
    whatsapp: user?.whatsapp ?? "",
    returnPolicy: user?.returnPolicy ?? "",
    deliveryPolicy: user?.deliveryPolicy ?? "",
    exchangePolicy: user?.exchangePolicy ?? "",
    businessType: user?.businessType ?? "individual",
    storePhone: user?.storePhone ?? "",
  });

  useEffect(() => {
    if (!user) return;
    setBanner(user.storeBanner ?? "");
    setLogo(user.storeLogo ?? "");
    setStore({
      storeName: user.storeName ?? "",
      storeSlug: user.storeSlug ?? "",
      storeCategory: user.storeCategory ?? "",
      storeDescription: user.storeDescription ?? "",
      storeEmail: user.storeEmail ?? "",
      storeWebsite: user.storeWebsite ?? "",
      instagram: user.instagram ?? "",
      facebook: user.facebook ?? "",
      whatsapp: user.whatsapp ?? "",
      returnPolicy: user.returnPolicy ?? "",
      deliveryPolicy: user.deliveryPolicy ?? "",
      exchangePolicy: user.exchangePolicy ?? "",
      businessType: user.businessType ?? "individual",
      storePhone: user.storePhone ?? "",
    });
  }, [user]);

  const set = (k: keyof typeof store, v: string) =>
    setStore((p) => ({ ...p, [k]: v }));

  const handleSave = async () => {
    let storeBanner = user?.storeBanner ?? "";
    let storeLogo = user?.storeLogo ?? "";

    if (bannerFile) {
      try {
        storeBanner = (await uploadToCloudinary(bannerFile)).url;
        setBanner(storeBanner);
        setBannerFile(null);
      } catch {}
    }
    if (logoFile) {
      try {
        storeLogo = (await uploadToCloudinary(logoFile)).url;
        setLogo(storeLogo);
        setLogoFile(null);
      } catch {}
    }

    await saveProfile({
      ...store,
      storeBanner,
      storeLogo,
      operatingHours: hours,
    });
  };

  return (
    <div>
      <SectionCard
        title="Store identity"
        description="Brand your storefront on SmileBaba"
      >
        {/* Banner */}
        <Field label="Store banner" hint="1200×400px recommended · Max 5MB">
          <ImageUpload
            label=""
            icon="🖼️"
            value={banner}
            className="h-32"
            onChange={(url, f) => {
              setBanner(url);
              setBannerFile(f);
            }}
          />
        </Field>

        {/* Logo */}
        <div className="flex items-center gap-4 mb-4">
          <ImageUpload
            label=""
            icon="🏪"
            value={logo}
            className="w-20 h-20 flex-shrink-0"
            onChange={(url, f) => {
              setLogo(url);
              setLogoFile(f);
            }}
          />
          <div>
            <p className="text-sm font-bold text-gray-700">Store logo</p>
            <p className="text-xs text-gray-400">400×400px · square image</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
          <Field label="Store name" required>
            <Input
              value={store.storeName}
              onChange={(e) => set("storeName", e.target.value)}
              placeholder="e.g. Kwame's Electronics"
            />
          </Field>
          <Field label="Store slug" hint="smilebabahub.com/store/your-slug">
            <div className="flex">
              <span
                className="inline-flex items-center px-3 rounded-l-xl border border-r-0
                border-gray-200 bg-gray-50 text-xs text-gray-400"
              >
                store/
              </span>
              <input
                value={store.storeSlug}
                onChange={(e) => set("storeSlug", e.target.value)}
                placeholder="kwames-electronics"
                className="flex-1 border border-gray-200 rounded-r-xl px-3 py-2.5 text-sm
                  focus:outline-none focus:ring-2 focus:ring-[#ffc105]"
              />
            </div>
          </Field>
          <Field label="Store category" required>
            <Select
              value={store.storeCategory}
              onChange={(e) => set("storeCategory", e.target.value)}
            >
              <option value="">Select category</option>
              {[
                "food",
                "electronics",
                "fashion",
                "vehicles",
                "apartments",
                "services",
              ].map((c) => (
                <option key={c} value={c} className="capitalize">
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Business type">
            <Select
              value={store.businessType}
              onChange={(e) => set("businessType", e.target.value)}
            >
              <option value="individual">Individual / Sole trader</option>
              <option value="registered">Registered business</option>
              <option value="enterprise">Enterprise</option>
            </Select>
          </Field>
          <Field label="Store email">
            <Input
              type="email"
              value={store.storeEmail}
              onChange={(e) => set("storeEmail", e.target.value)}
              placeholder="store@email.com"
            />
          </Field>
          <Field label="Store phone">
            <Input
              type="tel"
              value={store.storePhone}
              onChange={(e) => set("storePhone", e.target.value)}
              placeholder="Business line"
            />
          </Field>
          <Field label="WhatsApp number">
            <Input
              type="tel"
              value={store.whatsapp}
              onChange={(e) => set("whatsapp", e.target.value)}
              placeholder="+233 / +234 …"
            />
          </Field>
          <Field label="Website (optional)">
            <Input
              type="url"
              value={store.storeWebsite}
              onChange={(e) => set("storeWebsite", e.target.value)}
              placeholder="https://yoursite.com"
            />
          </Field>
          <Field label="Instagram">
            <div className="flex">
              <span
                className="inline-flex items-center px-3 rounded-l-xl border border-r-0
                border-gray-200 bg-gray-50 text-xs text-gray-400"
              >
                @
              </span>
              <input
                value={store.instagram}
                onChange={(e) => set("instagram", e.target.value)}
                placeholder="yourstore"
                className="flex-1 border border-gray-200 rounded-r-xl px-3 py-2.5 text-sm
                  focus:outline-none focus:ring-2 focus:ring-[#ffc105]"
              />
            </div>
          </Field>
          <Field label="Facebook page">
            <Input
              value={store.facebook}
              onChange={(e) => set("facebook", e.target.value)}
              placeholder="https://facebook.com/yourpage"
            />
          </Field>
        </div>

        <Field label="Store description" hint="Shown on your public store page">
          <Textarea
            rows={4}
            value={store.storeDescription}
            onChange={(e) => set("storeDescription", e.target.value)}
            placeholder="Tell customers what makes your store special…"
          />
        </Field>
        <SaveButton saving={saving === "profile"} onClick={handleSave} />
      </SectionCard>

      {/* Store policies */}
      <SectionCard
        title="Store policies"
        description="Shown to customers before purchase"
      >
        <Field label="Return policy">
          <Textarea
            rows={3}
            value={store.returnPolicy}
            onChange={(e) => set("returnPolicy", e.target.value)}
            placeholder="e.g. Items can be returned within 7 days…"
          />
        </Field>
        <Field label="Delivery information">
          <Textarea
            rows={3}
            value={store.deliveryPolicy}
            onChange={(e) => set("deliveryPolicy", e.target.value)}
            placeholder="e.g. Same day delivery within Accra…"
          />
        </Field>
        <Field label="Exchange policy">
          <Textarea
            rows={3}
            value={store.exchangePolicy}
            onChange={(e) => set("exchangePolicy", e.target.value)}
            placeholder="e.g. Exchanges allowed within 14 days…"
          />
        </Field>
        <SaveButton saving={saving === "profile"} onClick={handleSave} />
      </SectionCard>

      {/* Operating hours */}
      <SectionCard
        title="Operating hours"
        description="Let customers know when you're available"
      >
        <div className="space-y-1">
          {DAYS.map((day) => (
            <div
              key={day}
              className="flex items-center gap-2 py-2 border-b border-gray-50 last:border-0"
            >
              <div className="w-24 text-sm text-gray-700 font-medium flex-shrink-0">
                {day}
              </div>
              <select
                value={hours[day].open ? "open" : "closed"}
                onChange={(e) =>
                  setHours((p) => ({
                    ...p,
                    [day]: { ...p[day], open: e.target.value === "open" },
                  }))
                }
                className="w-24 border border-gray-200 rounded-lg px-2 py-1.5 text-xs
                  focus:outline-none focus:ring-1 focus:ring-[#ffc105]"
              >
                <option value="open">Open</option>
                <option value="closed">Closed</option>
              </select>
              {hours[day].open && (
                <>
                  <input
                    type="time"
                    value={hours[day].from}
                    onChange={(e) =>
                      setHours((p) => ({
                        ...p,
                        [day]: { ...p[day], from: e.target.value },
                      }))
                    }
                    className="w-24 border border-gray-200 rounded-lg px-2 py-1.5 text-xs
                      focus:outline-none focus:ring-1 focus:ring-[#ffc105]"
                  />
                  <span className="text-xs text-gray-400">to</span>
                  <input
                    type="time"
                    value={hours[day].to}
                    onChange={(e) =>
                      setHours((p) => ({
                        ...p,
                        [day]: { ...p[day], to: e.target.value },
                      }))
                    }
                    className="w-24 border border-gray-200 rounded-lg px-2 py-1.5 text-xs
                      focus:outline-none focus:ring-1 focus:ring-[#ffc105]"
                  />
                </>
              )}
            </div>
          ))}
        </div>
        <SaveButton saving={saving === "profile"} onClick={handleSave} />
      </SectionCard>
    </div>
  );
}