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

export default function ProfileTab() {
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
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-6 pb-6 border-b border-gray-100">
          <div className="relative flex-shrink-0">
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
              className="absolute -bottom-1 -right-1 w-6 h-6 bg-orange-500 rounded-full
                flex items-center justify-center text-white text-xs shadow"
            >
              ✏️
            </button>
          </div>
          <div className="text-center sm:text-left">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-5">
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
            <PhoneInput placeholder="244 123 456" />
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
              <optgroup label="Ghana">
                <option value="gh-greater-accra">Greater Accra</option>
                <option value="gh-ashanti">Ashanti</option>
                <option value="gh-central">Central</option>
                <option value="gh-eastern">Eastern</option>
                <option value="gh-western">Western</option>
                <option value="gh-northern">Northern</option>
              </optgroup>
              <optgroup label="Nigeria">
                <option value="ng-lagos">Lagos</option>
                <option value="ng-fct-abuja">FCT — Abuja</option>
                <option value="ng-rivers">Rivers</option>
                <option value="ng-kano">Kano</option>
                <option value="ng-oyo">Oyo</option>
              </optgroup>
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
