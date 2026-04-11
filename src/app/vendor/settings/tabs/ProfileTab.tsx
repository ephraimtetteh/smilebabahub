"use client";
// Vendor Settings → Profile tab
// Loads real user data from Redux. Saves via PATCH /auth/profile.
// Region list is dynamic based on selected country.

import { useState, useEffect, useRef } from "react";
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



const GH_REGIONS = [
  "Greater Accra",
  "Ashanti",
  "Western",
  "Eastern",
  "Central",
  "Northern",
  "Upper East",
  "Upper West",
  "Volta",
  "Brong-Ahafo",
  "Western North",
  "Ahafo",
  "Bono East",
  "Oti",
  "North East",
  "Savannah",
];
const NG_STATES = [
  "Lagos",
  "Abuja FCT",
  "Kano",
  "Oyo",
  "Rivers",
  "Kaduna",
  "Delta",
  "Ogun",
  "Anambra",
  "Imo",
  "Plateau",
  "Edo",
  "Borno",
  "Enugu",
  "Katsina",
  "Adamawa",
  "Cross River",
  "Akwa Ibom",
  "Sokoto",
  "Kwara",
  "Osun",
  "Ondo",
  "Bauchi",
  "Niger",
  "Gombe",
  "Kebbi",
  "Zamfara",
  "Yobe",
  "Taraba",
  "Ebonyi",
  "Ekiti",
  "Nassarawa",
  "Bayelsa",
  "Jigawa",
  "Benue",
  "Abia",
  "Kogi",
];

export default function ProfileTab() {
  const { user, saving, saveProfile, country } = useVendorSettings();

  const [avatar, setAvatar] = useState<string>(user?.profilePicture ?? "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    username: user?.username ?? "",
    phone: user?.phone ?? "",
    city: user?.city ?? "",
    state: user?.state ?? "",
    bio: user?.bio ?? "",
    gender: user?.gender ?? "",
    dateOfBirth: user?.dateOfBirth ?? "",
    countryPref: user?.country ?? country,
  });

  // Sync form when user loads (after auth restores session)
  // Seed form once on initial load — don't reset after user saves
  const seededRef = useRef(false);

  useEffect(() => {
    if (!user) return;
    if (seededRef.current) return; // already seeded — don't overwrite user edits
    seededRef.current = true;
    setAvatar(user.profilePicture ?? "");
    setForm({
      username: user.username ?? "",
      phone: user.phone ?? "",
      city: user.city ?? "",
      state: user.state ?? "",
      bio: user.bio ?? "",
      gender: user.gender ?? "",
      dateOfBirth: user.dateOfBirth ?? "",
      countryPref: user.country ?? country,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?._id, user?.updatedAt, country]);

  const set = (k: keyof typeof form, v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  const regions = form.countryPref === "Nigeria" ? NG_STATES : GH_REGIONS;
  const regionLabel = form.countryPref === "Nigeria" ? "State" : "Region";

  const handleSave = async () => {
    let profilePicture = user?.profilePicture ?? "";

    if (avatarFile) {
      try {
        const result = await uploadToCloudinary(avatarFile);
        profilePicture = result.url;
        setAvatar(profilePicture); // update preview immediately
        setAvatarFile(null); // clear so re-save doesn't re-upload
      } catch {
        // Keep existing picture — upload failed silently
      }
    }

    // Rename countryPref → country before sending to backend
    const { countryPref, ...rest } = form;
    await saveProfile({ ...rest, country: countryPref, profilePicture });
  };

  return (
    <div>
      <SectionCard
        title="Personal information"
        description="Your public identity on SmileBaba"
      >
        {/* Avatar */}
        <div className="flex items-center gap-5 mb-6 pb-6 border-b border-gray-100">
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 border-2 border-[#ffc105]/30">
              {avatar ? (
                <img
                  src={avatar}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl">
                  🧑‍💼
                </div>
              )}
            </div>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-700">Profile photo</p>
            <p className="text-xs text-gray-400 mt-0.5">
              JPG, PNG or WEBP · Max 2MB
            </p>
            <ImageUpload
              label=""
              icon="📷"
              value={null}
              className="mt-2 h-8 px-3 border-solid text-xs"
              onChange={(url, file) => {
                setAvatar(url);
                setAvatarFile(file);
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
          <Field label="Display name" required>
            <Input
              value={form.username}
              onChange={(e) => set("username", e.target.value)}
              placeholder="e.g. Kwame's Store"
            />
          </Field>
          <Field label="Phone number" required>
            <PhoneInput
              value={form.phone}
              onChange={(v) => set("phone", v)}
              country={form.countryPref === "Nigeria" ? "NG" : "GH"}
              placeholder={
                form.countryPref === "Nigeria" ? "801 000 0000" : "244 123 456"
              }
            />
          </Field>
          <Field label="Gender">
            <Select
              value={form.gender}
              onChange={(e) => set("gender", e.target.value)}
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Prefer not to say</option>
            </Select>
          </Field>
          <Field label="Date of birth">
            <Input
              type="date"
              value={form.dateOfBirth}
              onChange={(e) => set("dateOfBirth", e.target.value)}
            />
          </Field>
          <Field label="Country" required>
            <Select
              value={form.countryPref}
              onChange={(e) => {
                set("countryPref", e.target.value);
                set("state", "");
              }}
            >
              <option value="Ghana">🇬🇭 Ghana</option>
              <option value="Nigeria">🇳🇬 Nigeria</option>
            </Select>
          </Field>
          <Field label={regionLabel} required>
            <Select
              value={form.state}
              onChange={(e) => set("state", e.target.value)}
            >
              <option value="">Select {regionLabel.toLowerCase()}</option>
              {regions.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="City">
            <Input
              value={form.city}
              onChange={(e) => set("city", e.target.value)}
              placeholder={
                form.countryPref === "Nigeria"
                  ? "e.g. Ikeja, Lekki"
                  : "e.g. Kumasi"
              }
            />
          </Field>
        </div>

        <Field
          label="Short bio"
          hint="Shown on your public store page. Max 200 characters."
        >
          <Textarea
            rows={3}
            maxLength={200}
            value={form.bio}
            onChange={(e) => set("bio", e.target.value)}
            placeholder="Tell customers what makes you special…"
          />
        </Field>

        <SaveButton saving={saving === "profile"} onClick={handleSave} />
      </SectionCard>
    </div>
  );
}