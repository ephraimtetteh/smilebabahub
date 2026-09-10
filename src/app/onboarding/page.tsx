"use client";

// client/app/onboarding/page.tsx
//
// Vendor onboarding — the page that was 404ing.
//
// Mirrors mobile/src/app/onboarding/index.tsx: same six steps, same
// endpoints, same copy. Someone who starts on the app and finishes on
// the web should not be able to tell.
//
// ─── HOW THIS RELATES TO /subscription ───────────────────────────────
//
// /sell used to bounce non-vendors to /subscription, so becoming a
// vendor meant paying. This flow makes it free — role becomes "vendor"
// on completion, and the 5% commission is where SmileBaba earns.
//
// The subscription still exists and still matters: more listings, longer
// listing life, featured placement. createAd already enforces the Basic
// plan's single-active-ad limit and returns PLAN_LIMIT_REACHED, which is
// the natural moment to offer an upgrade — after someone has posted once
// and wants to post again, rather than before they have posted at all.
//
// Step 6 says this plainly, because a vendor who thinks a plan replaces
// the commission finds out at their first payout.

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Store,
  User as UserIcon,
  ShoppingBag,
  BedDouble,
  UtensilsCrossed,
  Percent,
  ShieldCheck,
  Sparkles,
  PartyPopper,
  Loader2,
  type LucideIcon,
} from "lucide-react";

import { useAppDispatch, useAppSelector } from "@/src/app/redux";
import { restoreSession } from "@/src/lib/features/auth/authActions";
import axiosInstance from "@/src/lib/api/axios";

const YELLOW = "#FFC105";
const INK = "#111827";

const FIRST = 2;
const LAST = 7;

const COUNTRIES = [
  { value: "Ghana", label: "Ghana", flag: "🇬🇭", sample: "024 123 4567" },
  { value: "Nigeria", label: "Nigeria", flag: "🇳🇬", sample: "0801 234 5678" },
];

/**
 * These map to User.businessType, which is an enum:
 * ["individual", "registered", "enterprise", ""].
 *
 * Sending a friendly label would save an invalid value — updateOne
 * doesn't validate by default, so it fails silently.
 */
const BUSINESS_TYPES = [
  { value: "individual", label: "Individual seller" },
  { value: "registered", label: "Registered company" },
  { value: "enterprise", label: "Enterprise" },
];

const CATEGORIES = [
  "Electronics",
  "Fashion",
  "Home & Furniture",
  "Food & Restaurant",
  "Property & Rentals",
  "Health & Beauty",
  "Automotive",
  "Services",
  "Groceries",
  "Other",
];

interface Service {
  id: string;
  label: string;
  hint: string;
  icon: LucideIcon;
  colour: string;
  tint: string;
}

const SERVICES: Service[] = [
  {
    id: "ecommerce",
    label: "E-Commerce",
    hint: "Sell products",
    icon: ShoppingBag,
    colour: "#059669",
    tint: "#ECFDF5",
  },
  {
    id: "stays",
    label: "SmileStays",
    hint: "List apartments",
    icon: BedDouble,
    colour: "#0D9488",
    tint: "#F0FDFA",
  },
  {
    id: "food",
    label: "Food",
    hint: "Restaurant or food service",
    icon: UtensilsCrossed,
    colour: "#DC2626",
    tint: "#FEF2F2",
  },
  {
    id: "marketplace",
    label: "Marketplace",
    hint: "Post ads and services",
    icon: Store,
    colour: "#2563EB",
    tint: "#EFF6FF",
  },
];

// ═══════════════════════════════════════════════════════════════════════
export default function OnboardingPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { hasCheckedAuth, isAuthenticated } = useAppSelector((s) => s.auth);

  const [step, setStep] = useState(FIRST);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [storeSlug, setSlug] = useState<string | null>(null);

  // Step 2
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("Ghana");

  // Step 3
  const [accountType, setAccountType] = useState<"vendor" | "guest" | null>(
    null,
  );

  // Step 4
  const [bizName, setBizName] = useState("");
  const [bizType, setBizType] = useState("individual");
  const [category, setCategory] = useState("");
  const [description, setDesc] = useState("");
  const [address, setAddress] = useState("");
  const [website, setWebsite] = useState("");

  // Step 5
  const [services, setServices] = useState<string[]>([]);

  // Step 6
  const [acknowledged, setAcknowledged] = useState(false);
  const [wantsPlan, setWantsPlan] = useState(false);

  /** Where they were heading when the gate stopped them. */
  const returnTo =
    typeof window !== "undefined"
      ? localStorage.getItem("redirectAfterOnboarding")
      : null;

  // ─── Resume ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!hasCheckedAuth) return;

    if (!isAuthenticated) {
      localStorage.setItem("redirectAfterLogin", "/onboarding");
      router.replace("/auth/login?returnUrl=/onboarding");
      return;
    }

    let cancelled = false;

    axiosInstance
      .get("/onboarding/me")
      .then(({ data }) => {
        if (cancelled) return;

        // Already a vendor. Send them on rather than making them repeat
        // something they finished months ago.
        if (!data?.needsOnboarding && data?.onboarding?.status === "complete") {
          router.replace(returnTo ?? "/vendor/dashboard");
          return;
        }

        const o = data?.onboarding ?? {};
        const v = data?.values ?? {};

        setStep(Math.min(Math.max(o.step ?? FIRST, FIRST), LAST));
        setPhone(v.phone ?? "");
        setCountry(v.country ?? "Ghana");
        setAccountType(o.chosenType === "vendor" ? "vendor" : null);
        setBizName(v.name ?? "");
        setBizType(v.businessType || "individual");
        setCategory(v.category ?? "");
        setDesc(v.description ?? "");
        setAddress(v.address ?? "");
        setWebsite(v.website ?? "");
        setServices(o.services ?? []);
        setAcknowledged(o.acknowledgedCommission === true);
        setWantsPlan(o.wantsSubscription === true);
      })
      .catch(() => {
        // A failed read shouldn't strand them at a spinner
      })
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [hasCheckedAuth, isAuthenticated, returnTo, router]);

  const scrollTop = () =>
    typeof window !== "undefined" && window.scrollTo({ top: 0 });

  // ─── Save one step ────────────────────────────────────────────────
  const save = useCallback(
    async (which: number, body: Record<string, unknown>) => {
      setSaving(true);
      setError("");
      try {
        const { data } = await axiosInstance.patch(
          `/onboarding/step/${which}`,
          body,
        );

        // Guests finish at step 3
        if (data?.done) {
          await dispatch(restoreSession())
            .unwrap()
            .catch(() => {});
          router.replace(returnTo ?? "/");
          return false;
        }
        return true;
      } catch (err: any) {
        setError(
          err?.response?.data?.message ??
            "We couldn't save that. Check your connection and try again.",
        );
        return false;
      } finally {
        setSaving(false);
      }
    },
    [dispatch, router, returnTo],
  );

  const next = async () => {
    let ok = true;

    if (step === 2) {
      if (phone.replace(/\D/g, "").length < 7) {
        return setError("We need a phone number we can reach you on.");
      }
      ok = await save(2, { phone: phone.trim(), country });
    }

    if (step === 3) {
      if (!accountType) return setError("Are you selling, or just browsing?");
      ok = await save(3, { accountType });
      if (accountType === "guest") return; // save() already routed away
    }

    if (step === 4) {
      if (bizName.trim().length < 2) {
        return setError("What should buyers see as your business name?");
      }
      if (!category) return setError("Pick the closest category.");
      ok = await save(4, {
        name: bizName.trim(),
        type: bizType,
        category,
        description: description.trim(),
        address: address.trim(),
        website: website.trim(),
      });
    }

    if (step === 5) {
      if (services.length === 0) {
        return setError("Choose at least one thing you'll be selling.");
      }
      ok = await save(5, { services });
    }

    if (step === 6) {
      if (!acknowledged) {
        return setError("Please confirm you understand the 5% commission.");
      }

      ok = await save(6, { acknowledged: true, wantsSubscription: wantsPlan });
      if (!ok) return;

      // Complete straight away. Nothing to review means no waiting.
      setSaving(true);
      try {
        const { data } = await axiosInstance.post("/onboarding/complete");
        setSlug(data?.storeSlug ?? null);
        await dispatch(restoreSession())
          .unwrap()
          .catch(() => {});
        setStep(LAST);
        scrollTop();
      } catch (err: any) {
        setError(
          err?.response?.data?.message ?? "Almost there. Please try again.",
        );
      } finally {
        setSaving(false);
      }
      return;
    }

    if (ok && step < LAST) {
      setStep((s) => s + 1);
      setError("");
      scrollTop();
    }
  };

  const back = () => {
    if (step > FIRST) {
      setStep((s) => s - 1);
      setError("");
      scrollTop();
    } else {
      router.back();
    }
  };

  if (!hasCheckedAuth || loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <Loader2 size={28} className="animate-spin text-amber-400" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-5 py-10">
      <div className="mx-auto max-w-lg">
        {/* ─── Header ─── */}
        {step < LAST && (
          <>
            <button
              onClick={back}
              className="flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-gray-900"
            >
              <ArrowLeft size={16} />
              Vendor Registration
            </button>

            <div className="mt-5 flex items-center gap-1.5">
              {[2, 3, 4, 5, 6].map((s, i) => {
                const done = step > s;
                const on = step === s;
                return (
                  <div
                    key={s}
                    className="flex flex-1 items-center gap-1.5 last:flex-none"
                  >
                    <span
                      className="rounded-full transition-all"
                      style={{
                        width: on ? 10 : 8,
                        height: on ? 10 : 8,
                        background: done || on ? "#10B981" : "#E5E7EB",
                      }}
                    />
                    {i < 4 && (
                      <span
                        className="h-0.5 flex-1 rounded-full transition-all"
                        style={{ background: done ? "#10B981" : "#E5E7EB" }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        <div className="mt-6 rounded-3xl border border-gray-100 bg-white p-7">
          {/* ═══ 2 · Basic ═══ */}
          {step === 2 && (
            <>
              <Heading
                title="Basic information"
                subtitle="A few details so buyers and our team can reach you."
              />

              <Field
                label="Phone number"
                type="tel"
                value={phone}
                onChange={setPhone}
                placeholder={COUNTRIES.find((c) => c.value === country)?.sample}
                hint="Buyers see this only after they order from you."
              />

              <div className="mt-5">
                <label className="mb-1.5 block text-[13px] font-semibold text-gray-700">
                  Country
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {COUNTRIES.map((c) => {
                    const on = country === c.value;
                    return (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() => setCountry(c.value)}
                        className={`flex items-center gap-2.5 rounded-2xl border p-3.5 transition ${
                          on
                            ? "border-amber-400 bg-amber-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <span className="text-xl">{c.flag}</span>
                        <span className="flex-1 text-left text-sm font-semibold text-gray-900">
                          {c.label}
                        </span>
                        {on && <Check size={15} className="text-amber-600" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* ═══ 3 · Account type ═══ */}
          {step === 3 && (
            <>
              <Heading
                title="How would you like to use SmileBaba?"
                subtitle="You can change this later."
              />

              <div className="space-y-3">
                <TypeCard
                  on={accountType === "vendor"}
                  onClick={() => setAccountType("vendor")}
                  icon={Store}
                  tint="#FEF3C7"
                  colour="#B45309"
                  title="I want to be a Vendor"
                  body="List and sell products or services on SmileBaba. Takes about two minutes to set up."
                />
                <TypeCard
                  on={accountType === "guest"}
                  onClick={() => setAccountType("guest")}
                  icon={UserIcon}
                  tint="#EFF6FF"
                  colour="#2563EB"
                  title="I'm just a Guest"
                  body="Explore, shop, book and enjoy all our services. You can become a vendor any time."
                />
              </div>
            </>
          )}

          {/* ═══ 4 · Business ═══ */}
          {step === 4 && (
            <>
              <Heading
                title="Business details"
                subtitle="This is what buyers see on your store."
              />

              <Field
                label="Business name"
                value={bizName}
                onChange={setBizName}
                placeholder="Doe Electronics"
                hint="This becomes your store link, so pick carefully."
              />

              <Select
                label="Business type"
                value={bizType}
                onChange={setBizType}
                options={BUSINESS_TYPES}
              />

              <Select
                label="Business category"
                value={category}
                onChange={setCategory}
                placeholder="Select a category"
                options={CATEGORIES.map((c) => ({ value: c, label: c }))}
              />

              <Field
                label="Description"
                optional
                value={description}
                onChange={setDesc}
                placeholder="Tell buyers what you sell and what makes you different."
                textarea
              />

              <Field
                label="Business address"
                optional
                value={address}
                onChange={setAddress}
                placeholder="East Legon, Accra"
              />

              <Field
                label="Website or social media"
                optional
                value={website}
                onChange={setWebsite}
                placeholder="instagram.com/yourstore"
              />
            </>
          )}

          {/* ═══ 5 · Services ═══ */}
          {step === 5 && (
            <>
              <Heading
                title="What will you be selling?"
                subtitle="Pick everything that applies. You can add more later."
              />

              <div className="grid grid-cols-2 gap-3">
                {SERVICES.map((s) => {
                  const on = services.includes(s.id);
                  const Icon = s.icon;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() =>
                        setServices((prev) =>
                          prev.includes(s.id)
                            ? prev.filter((x) => x !== s.id)
                            : [...prev, s.id],
                        )
                      }
                      className="rounded-2xl border p-4 text-left transition"
                      style={{
                        borderColor: on ? s.colour : "#E5E7EB",
                        borderWidth: on ? 2 : 1,
                        background: on ? s.tint : "white",
                        minHeight: 128,
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <Icon
                          size={24}
                          style={{ color: s.colour }}
                          strokeWidth={2}
                        />
                        {on && (
                          <span
                            className="flex h-5 w-5 items-center justify-center rounded-full"
                            style={{ background: s.colour }}
                          >
                            <Check size={12} color="white" strokeWidth={3} />
                          </span>
                        )}
                      </div>
                      <p
                        className="mt-3 text-sm font-bold"
                        style={{ color: on ? s.colour : INK }}
                      >
                        {s.label}
                      </p>
                      <p className="mt-0.5 text-[11.5px] leading-snug text-gray-500">
                        {s.hint}
                      </p>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* ═══ 6 · Commission ═══ */}
          {step === 6 && (
            <>
              <Heading
                title="How SmileBaba charges"
                subtitle="No surprises. Here's exactly how it works."
              />

              <div className="rounded-2xl bg-emerald-50 p-6 text-center">
                <div
                  className="mx-auto flex h-15 w-15 items-center justify-center rounded-full bg-emerald-500"
                  style={{ width: 60, height: 60 }}
                >
                  <Percent size={26} color="white" strokeWidth={2.4} />
                </div>
                <p className="mt-3.5 text-2xl font-bold tracking-tight text-emerald-900">
                  5% per sale
                </p>
                <p className="mx-auto mt-1.5 max-w-sm text-[13px] leading-relaxed text-emerald-700">
                  That's it. Nothing up front, nothing monthly, and nothing at
                  all if you don't sell.
                </p>
              </div>

              <div className="mt-5 space-y-3">
                <Point
                  icon={ShieldCheck}
                  title="Taken automatically, after delivery"
                  body="When a buyer confirms they've received their order, we release your share and keep the 5%. You never send us money."
                />
                <Point
                  icon={Percent}
                  title="You always see it first"
                  body="Every order shows what you keep before you accept it. A ₵1,000 sale pays you ₵950."
                />
                <Point
                  icon={Sparkles}
                  title="Only on completed sales"
                  body="Cancelled or refunded orders cost you nothing."
                />
              </div>

              <div className="mt-5 rounded-2xl bg-gray-50 p-4">
                <p className="text-[13.5px] font-bold text-gray-900">
                  Want more than the basics?
                </p>
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-gray-500">
                  A plan gets you more listings, longer listing life and
                  featured placement.{" "}
                  <span className="font-bold text-gray-700">
                    The 5% still applies either way
                  </span>{" "}
                  — a plan adds features, it doesn't replace the commission.
                </p>

                <label className="mt-3.5 flex cursor-pointer items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={wantsPlan}
                    onChange={(e) => setWantsPlan(e.target.checked)}
                    className="h-4 w-4 accent-amber-400"
                  />
                  <span className="text-[12.5px] text-gray-600">
                    Show me the plans after I finish setting up
                  </span>
                </label>
              </div>

              <label className="mt-5 flex cursor-pointer items-start gap-2.5">
                <input
                  type="checkbox"
                  checked={acknowledged}
                  onChange={(e) => setAcknowledged(e.target.checked)}
                  className="mt-0.5 h-[18px] w-[18px] accent-emerald-500"
                />
                <span className="text-[13px] leading-relaxed text-gray-600">
                  I understand SmileBaba takes 5% of each completed sale, and I
                  agree to the{" "}
                  <Link
                    href="/legal/terms"
                    className="font-bold text-gray-900 underline"
                  >
                    Vendor Terms
                  </Link>
                  .
                </span>
              </label>
            </>
          )}

          {/* ═══ 7 · Done ═══ */}
          {step === LAST && (
            <div className="text-center">
              <div className="mx-auto flex h-[76px] w-[76px] items-center justify-center rounded-full bg-emerald-100">
                <PartyPopper
                  size={34}
                  className="text-emerald-600"
                  strokeWidth={2}
                />
              </div>

              <h1 className="mt-5 text-2xl font-bold tracking-tight text-gray-900">
                You're all set
              </h1>
              <p className="mx-auto mt-2 max-w-sm text-[15px] leading-relaxed text-gray-500">
                {bizName
                  ? `${bizName} is live on SmileBaba.`
                  : "Your store is live."}{" "}
                Post your first listing and start selling across Ghana and
                Nigeria.
              </p>

              {storeSlug && (
                <Link
                  href={`/vendors/${storeSlug}`}
                  className="mt-4 inline-block rounded-full border border-gray-200 px-4 py-2 text-[12.5px] font-semibold text-gray-700 transition hover:border-gray-300"
                >
                  View your store
                </Link>
              )}

              <div className="mt-7 rounded-2xl bg-gray-50 p-4 text-left">
                <p className="mb-2.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  What happens next
                </p>
                <NextStep
                  n="1"
                  text="Post a listing with clear photos and a fair price"
                />
                <NextStep
                  n="2"
                  text="A buyer orders and pays — we hold the money safely"
                />
                <NextStep
                  n="3"
                  text="You deliver, they confirm, and you're paid"
                  last
                />
              </div>

              <div className="mt-6 space-y-2.5">
                <button
                  onClick={() => {
                    localStorage.removeItem("redirectAfterOnboarding");
                    router.replace(returnTo ?? "/sell");
                  }}
                  className="w-full rounded-2xl bg-amber-400 py-3.5 text-[15px] font-bold text-gray-900 transition hover:bg-amber-300"
                >
                  Post your first listing
                </button>

                {wantsPlan && (
                  <Link
                    href="/subscription"
                    className="block w-full rounded-2xl border border-gray-200 py-3.5 text-center text-[14px] font-semibold text-gray-700 transition hover:bg-gray-50"
                  >
                    See the plans
                  </Link>
                )}

                <Link
                  href="/"
                  className="block py-2 text-center text-[13.5px] font-semibold text-gray-500 transition hover:text-gray-900"
                >
                  Go to home
                </Link>
              </div>
            </div>
          )}

          {/* ─── Error ─── */}
          {error && step < LAST && (
            <p className="mt-5 rounded-xl border border-red-200 bg-red-50 p-3 text-[13px] leading-relaxed text-red-800">
              {error}
            </p>
          )}

          {/* ─── Continue ─── */}
          {step < LAST && (
            <button
              onClick={next}
              disabled={saving}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-gray-900 py-3.5 text-[15px] font-bold text-white transition hover:bg-black disabled:opacity-70"
            >
              {saving ? (
                <>
                  <Loader2 size={17} className="animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  {step === 6 ? "Finish and start selling" : "Continue"}
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </main>
  );
}

// ─── Bits ────────────────────────────────────────────────────────────
function Heading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-6">
      <h1 className="text-[22px] font-bold leading-tight tracking-tight text-gray-900">
        {title}
      </h1>
      <p className="mt-1.5 text-[13.5px] leading-relaxed text-gray-500">
        {subtitle}
      </p>
    </div>
  );
}

function TypeCard({
  on,
  onClick,
  icon: Icon,
  tint,
  colour,
  title,
  body,
}: {
  on: boolean;
  onClick: () => void;
  icon: LucideIcon;
  tint: string;
  colour: string;
  title: string;
  body: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-2xl border p-5 text-left transition"
      style={{
        borderColor: on ? YELLOW : "#E5E7EB",
        borderWidth: on ? 2 : 1,
        background: on ? "#FFFDF5" : "white",
      }}
    >
      <div className="flex items-start justify-between">
        <span
          className="flex h-12 w-12 items-center justify-center rounded-2xl"
          style={{ background: tint }}
        >
          <Icon size={22} style={{ color: colour }} strokeWidth={2} />
        </span>
        <span
          className="flex h-[22px] w-[22px] items-center justify-center rounded-full"
          style={{
            border: on ? "none" : "1.5px solid #D1D5DB",
            background: on ? INK : "transparent",
          }}
        >
          {on && <span className="h-2 w-2 rounded-full bg-white" />}
        </span>
      </div>
      <p className="mt-3.5 text-base font-bold text-gray-900">{title}</p>
      <p className="mt-1 text-[13px] leading-relaxed text-gray-500">{body}</p>
    </button>
  );
}

function Point({
  icon: Icon,
  title,
  body,
}: {
  icon: LucideIcon;
  title: string;
  body: string;
}) {
  return (
    <div className="flex gap-3">
      <span className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-xl bg-gray-50">
        <Icon size={16} className="text-emerald-600" strokeWidth={2} />
      </span>
      <div>
        <p className="text-[13px] font-bold text-gray-900">{title}</p>
        <p className="mt-0.5 text-[12px] leading-relaxed text-gray-500">
          {body}
        </p>
      </div>
    </div>
  );
}

function NextStep({
  n,
  text,
  last,
}: {
  n: string;
  text: string;
  last?: boolean;
}) {
  return (
    <div className={`flex items-start gap-2.5 ${last ? "" : "mb-2.5"}`}>
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-400 text-[10.5px] font-bold text-gray-900">
        {n}
      </span>
      <span className="text-[12.5px] leading-relaxed text-gray-700">
        {text}
      </span>
    </div>
  );
}

function Field({
  label,
  optional,
  hint,
  value,
  onChange,
  placeholder,
  type = "text",
  textarea,
}: {
  label: string;
  optional?: boolean;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  textarea?: boolean;
}) {
  const cls =
    "w-full rounded-2xl border border-gray-200 px-4 text-[15px] text-gray-900 outline-none transition focus:border-gray-400";

  return (
    <div className="mt-5">
      <label className="mb-1.5 block text-[13px] font-semibold text-gray-700">
        {label}
        {optional && (
          <span className="font-normal text-gray-400"> optional</span>
        )}
      </label>

      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={4}
          className={`${cls} resize-none py-3`}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`${cls} h-12`}
        />
      )}

      {hint && <p className="mt-1.5 text-[11.5px] text-gray-400">{hint}</p>}
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
}) {
  return (
    <div className="mt-5">
      <label className="mb-1.5 block text-[13px] font-semibold text-gray-700">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 w-full appearance-none rounded-2xl border border-gray-200 bg-white px-4 text-[15px] text-gray-900 outline-none transition focus:border-gray-400"
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
