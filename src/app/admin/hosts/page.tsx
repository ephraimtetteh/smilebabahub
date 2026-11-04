"use client";
// src/app/admin/hosts/page.tsx
//
// SmileStays hosts onboarded by the SmileBaba team.
//   · "Add host": create their account (they get a link to set their own
//     password — admins never know it) with phone and payout details.
//   · Open a host to see their places, list a new one (photos, price per
//     night, location), pause/unpause, or resend the set-password link.
// Server: controllers/adminHostController.js

import { useCallback, useEffect, useState } from "react";
import axiosInstance from "@/src/lib/api/axios";
import { toast } from "react-toastify";
import { uploadManyToCloudinary } from "@/src/utils/uploadToCloudinary";
import { normalizePhone, PHONE_HINT } from "@/src/lib/phone";
import { BedDouble, Plus, Search, Loader2, X, Mail, ImagePlus, Pause, Play, Send } from "lucide-react";

type Host = {
  _id: string;
  name: string;
  email: string;
  phone: string | null;
  storeName: string | null;
  country: string | null;
  city: string | null;
  onboardedAt: string | null;
  invitedAt: string | null;
  hasLoggedIn?: boolean;
  payout: any;
  stays: number;
  activeStays: number;
  isSuspended: boolean;
};

const GH_REGIONS = ["Greater Accra", "Ashanti", "Western", "Eastern", "Central", "Northern", "Volta", "Upper East", "Upper West", "Bono", "Bono East", "Ahafo", "Western North", "Oti", "North East", "Savannah"];
const NG_STATES = ["Lagos", "Abuja FCT", "Rivers", "Oyo", "Kano", "Kaduna", "Enugu", "Delta", "Ogun", "Anambra", "Edo", "Akwa Ibom", "Cross River", "Plateau", "Kwara", "Osun", "Ondo", "Imo", "Abia", "Other"];
const STAY_TYPES = [
  { id: "hotel", label: "Hotel room" },
  { id: "short-stay", label: "Short-stay apartment" },
  { id: "studio", label: "Studio" },
  { id: "serviced", label: "Serviced apartment" },
  { id: "guest-house", label: "Guest house" },
  { id: "villa", label: "Villa / holiday home" },
  { id: "lodge", label: "Lodge / resort" },
  { id: "hostel", label: "Hostel" },
];

const input = "w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white outline-none focus:ring-2 focus:ring-yellow-400";
const label = "block text-xs font-semibold text-gray-500 mb-1";

export default function AdminHostsPage() {
  const [hosts, setHosts] = useState<Host[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [adding, setAdding] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);

  const load = useCallback(async (q = "") => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get("/admin/hosts", { params: { search: q || undefined } });
      setHosts(data.hosts ?? []);
    } catch {
      toast.error("Couldn't load hosts");
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-black text-gray-900">
            <BedDouble size={20} /> SmileStays hosts
          </h1>
          <p className="mt-0.5 text-sm text-gray-400">Sign up hotels and short-stay owners and list their places for them</p>
        </div>
        <button onClick={() => setAdding(true)} className="flex items-center gap-1.5 rounded-xl bg-[#ffc105] px-4 py-2.5 text-sm font-black text-black hover:bg-yellow-300">
          <Plus size={16} /> Add host
        </button>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          load(search);
        }}
        className="flex max-w-md items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2"
      >
        <Search size={15} className="text-gray-400" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, email, phone…" className="flex-1 bg-transparent text-sm outline-none" />
      </form>

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="animate-spin text-[#ffc105]" /></div>
        ) : hosts.length === 0 ? (
          <p className="py-12 text-center text-sm text-gray-400">No hosts yet. Click “Add host” to onboard the first one.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs text-gray-500">
              <tr><th className="px-4 py-3">Host</th><th className="px-4 py-3">Phone</th><th className="px-4 py-3">Places</th><th className="px-4 py-3">Account</th></tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {hosts.map((h) => (
                <tr key={h._id} onClick={() => setOpenId(h._id)} className="cursor-pointer hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-bold text-gray-900">{h.storeName || h.name}</p>
                    <p className="text-xs text-gray-400">{h.email}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{h.phone ?? "—"}</td>
                  <td className="px-4 py-3">{h.activeStays} live <span className="text-gray-400">/ {h.stays}</span></td>
                  <td className="px-4 py-3 text-xs">
                    {h.isSuspended ? <span className="text-red-600">Suspended</span> : h.onboardedAt ? <span className="text-gray-600">Onboarded by team{h.invitedAt ? " · invited" : ""}</span> : <span className="text-gray-400">Self-signed up</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {adding && (
        <AddHostModal
          onClose={() => setAdding(false)}
          onCreated={(id) => {
            setAdding(false);
            load(search);
            setOpenId(id);
          }}
        />
      )}
      {openId && <HostPanel id={openId} onClose={() => setOpenId(null)} onChanged={() => load(search)} />}
    </div>
  );
}

// ── Add host ────────────────────────────────────────────────────────────
function AddHostModal({ onClose, onCreated }: { onClose: () => void; onCreated: (id: string) => void }) {
  const [f, setF] = useState({ name: "", storeName: "", email: "", phone: "", whatsapp: "", country: "Ghana", city: "", payoutMethod: "momo", network: "MTN", payoutNumber: "", accountName: "", bankName: "", note: "", useExisting: false, sendInvite: true });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const set = (k: string, v: any) => setF((p) => ({ ...p, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!normalizePhone(f.phone, f.country as any)) return setError(`Check the phone number (${PHONE_HINT}).`);
    setBusy(true);
    try {
      const payout =
        f.payoutNumber.trim()
          ? f.payoutMethod === "momo"
            ? { method: "momo", network: f.network, number: f.payoutNumber, accountName: f.accountName }
            : { method: "bank", bankName: f.bankName, accountNo: f.payoutNumber, accountName: f.accountName }
          : undefined;
      const { data } = await axiosInstance.post("/admin/hosts", {
        name: f.name, storeName: f.storeName, email: f.email, phone: f.phone, whatsapp: f.whatsapp || undefined,
        country: f.country, city: f.city, note: f.note, payout, useExisting: f.useExisting, sendInvite: f.sendInvite,
      });
      toast.success(`${data.message}${data.invited ? " Set-password email sent." : ""}`);
      onCreated(data.host._id);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Couldn't add this host.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <form onSubmit={submit} className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-lg font-black text-gray-900">Add a SmileStays host</p>
          <button type="button" onClick={onClose} aria-label="Close"><X size={18} /></button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div><span className={label}>Contact name *</span><input className={input} value={f.name} onChange={(e) => set("name", e.target.value)} required /></div>
          <div><span className={label}>Business name</span><input className={input} value={f.storeName} onChange={(e) => set("storeName", e.target.value)} placeholder="Labadi Guest House" /></div>
          <div className="sm:col-span-2"><span className={label}>Email * (their set-password link goes here)</span><input type="email" className={input} value={f.email} onChange={(e) => set("email", e.target.value)} required /></div>
          <div><span className={label}>Phone *</span><input className={input} value={f.phone} onChange={(e) => set("phone", e.target.value)} placeholder="024 123 4567" required /></div>
          <div><span className={label}>WhatsApp</span><input className={input} value={f.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} placeholder="Same as phone if empty" /></div>
          <div><span className={label}>Country *</span><select className={input} value={f.country} onChange={(e) => set("country", e.target.value)}><option>Ghana</option><option>Nigeria</option></select></div>
          <div><span className={label}>City</span><input className={input} value={f.city} onChange={(e) => set("city", e.target.value)} /></div>
        </div>

        <p className="mt-5 text-xs font-bold uppercase tracking-wider text-gray-500">Payout (where their booking money goes)</p>
        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          <div><span className={label}>Method</span><select className={input} value={f.payoutMethod} onChange={(e) => set("payoutMethod", e.target.value)}><option value="momo">Mobile Money</option><option value="bank">Bank</option></select></div>
          {f.payoutMethod === "momo" ? (
            <div><span className={label}>Network</span><select className={input} value={f.network} onChange={(e) => set("network", e.target.value)}>{["MTN", "Telecel", "AirtelTigo", "OPay", "PalmPay", "Moniepoint"].map((n) => <option key={n}>{n}</option>)}</select></div>
          ) : (
            <div><span className={label}>Bank</span><input className={input} value={f.bankName} onChange={(e) => set("bankName", e.target.value)} /></div>
          )}
          <div><span className={label}>{f.payoutMethod === "momo" ? "MoMo number" : "Account number"}</span><input className={input} value={f.payoutNumber} onChange={(e) => set("payoutNumber", e.target.value)} placeholder="Can be added later" /></div>
          <div><span className={label}>Account name</span><input className={input} value={f.accountName} onChange={(e) => set("accountName", e.target.value)} /></div>
        </div>

        <div className="mt-4"><span className={label}>Internal note</span><input className={input} value={f.note} onChange={(e) => set("note", e.target.value)} placeholder="e.g. Signed at Labadi office, 4 rooms" /></div>
        <label className="mt-3 flex items-center gap-2 text-sm text-gray-700"><input type="checkbox" checked={f.sendInvite} onChange={(e) => set("sendInvite", e.target.checked)} /> Email them a link to set their password</label>
        <label className="mt-2 flex items-center gap-2 text-sm text-gray-700"><input type="checkbox" checked={f.useExisting} onChange={(e) => set("useExisting", e.target.checked)} /> If this email already has an account, make it a host</label>

        {error && <p className="mt-3 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <button disabled={busy} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#ffc105] py-3 text-sm font-black text-black disabled:opacity-50">
          {busy && <Loader2 size={14} className="animate-spin" />} Create host
        </button>
      </form>
    </div>
  );
}

// ── Host panel (stays + add stay) ───────────────────────────────────────
function HostPanel({ id, onClose, onChanged }: { id: string; onClose: () => void; onChanged: () => void }) {
  const [data, setData] = useState<{ host: Host; stays: any[] } | null>(null);
  const [adding, setAdding] = useState(false);

  const load = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get(`/admin/hosts/${id}`);
      setData(data);
    } catch {
      toast.error("Couldn't load host");
    }
  }, [id]);
  useEffect(() => {
    load();
  }, [load]);

  const invite = async () => {
    try {
      const { data } = await axiosInstance.post(`/admin/hosts/${id}/invite`);
      toast.success(data.message);
      load();
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Couldn't send the invite");
    }
  };
  const togglePause = async (stay: any) => {
    try {
      await axiosInstance.patch(`/admin/hosts/${id}/stays/${stay._id}`, { isPaused: !stay.isPaused });
      load();
      onChanged();
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Couldn't update");
    }
  };

  const h = data?.host;
  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-black/30">
      <div className="h-full w-full max-w-xl overflow-y-auto bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-5 py-4">
          <span className="font-black text-gray-900">{h ? h.storeName || h.name : "Host"}</span>
          <button onClick={onClose} aria-label="Close"><X size={16} /></button>
        </div>
        {!h ? (
          <div className="flex justify-center py-16"><Loader2 className="animate-spin text-[#ffc105]" /></div>
        ) : (
          <div className="space-y-5 p-5">
            <div className="rounded-2xl bg-gray-50 p-4 text-sm">
              <p className="font-bold text-gray-900">{h.name}</p>
              <p className="text-gray-500">{h.email} · {h.phone ?? "no phone"}</p>
              <p className="mt-1 text-xs text-gray-500">
                {h.payout ? `Payout: ${h.payout.method === "momo" ? `${h.payout.network} MoMo ${h.payout.number}` : `${h.payout.bankName} ${h.payout.accountNo}`}` : "No payout details yet — add them before their first payout."}
              </p>
              <p className="mt-1 text-xs text-gray-500">{h.hasLoggedIn ? "Has signed in" : "Hasn't signed in yet"}{h.invitedAt ? ` · last invited ${new Date(h.invitedAt).toLocaleDateString()}` : ""}</p>
              <button onClick={invite} className="mt-3 inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-bold hover:bg-gray-50">
                <Mail size={12} /> {h.invitedAt ? "Resend" : "Send"} set-password link
              </button>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm font-black text-gray-900">Places ({data!.stays.length})</p>
              <button onClick={() => setAdding(true)} className="inline-flex items-center gap-1.5 rounded-xl bg-[#ffc105] px-3 py-2 text-xs font-black text-black"><Plus size={13} /> List a place</button>
            </div>
            {data!.stays.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-gray-200 py-8 text-center text-sm text-gray-400">No places listed yet.</p>
            ) : (
              <ul className="space-y-2">
                {data!.stays.map((s) => (
                  <li key={s._id} className="flex items-center gap-3 rounded-2xl border border-gray-100 p-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={s.coverImage ?? s.images?.[0]?.url} alt="" className="h-14 w-14 rounded-xl bg-gray-100 object-cover" />
                    <div className="min-w-0 flex-1">
                      <a href={`/ads/${s._id}`} target="_blank" rel="noopener noreferrer" className="block truncate text-sm font-bold text-gray-900 hover:underline">{s.title}</a>
                      <p className="text-xs text-gray-500">{s.price?.currency === "NGN" ? "₦" : "GH₵"}{Number(s.price?.amount ?? 0).toLocaleString()} / night · {s.location?.city || s.location?.region}</p>
                    </div>
                    <button onClick={() => togglePause(s)} className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-1 text-xs font-semibold">
                      {s.isPaused ? <><Play size={11} /> Resume</> : <><Pause size={11} /> Pause</>}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        {adding && h && (
          <AddStayModal
            host={h}
            onClose={() => setAdding(false)}
            onCreated={() => {
              setAdding(false);
              load();
              onChanged();
            }}
          />
        )}
      </div>
    </div>
  );
}

function AddStayModal({ host, onClose, onCreated }: { host: Host; onClose: () => void; onCreated: () => void }) {
  const ng = host.country === "Nigeria";
  const [f, setF] = useState({ title: "", type: "short-stay", pricePerNight: "", region: ng ? "Lagos" : "Greater Accra", city: host.city ?? "", address: "", bedrooms: "", bathrooms: "", maxGuests: "", amenities: "", description: "" });
  const [images, setImages] = useState<{ url: string; publicId: string }[]>([]);
  const [uploading, setUploading] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const set = (k: string, v: string) => setF((p) => ({ ...p, [k]: v }));

  const onFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    const list = Array.from(files).filter((x) => x.type.startsWith("image/")).slice(0, 10 - images.length);
    if (list.some((x) => x.size > 8 * 1024 * 1024)) return setError("Each photo must be under 8 MB.");
    setUploading(0);
    try {
      const res = await uploadManyToCloudinary(list, setUploading);
      setImages((p) => [...p, ...res.map((r) => ({ url: r.url, publicId: r.publicId }))].slice(0, 10));
    } catch (e: any) {
      setError(e?.message ?? "Upload failed");
    } finally {
      setUploading(null);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!images.length) return setError("Add at least one photo.");
    setBusy(true);
    try {
      await axiosInstance.post(`/admin/hosts/${host._id}/stays`, {
        title: f.title, type: f.type, pricePerNight: f.pricePerNight, description: f.description,
        images: images.map((i, n) => ({ ...i, isCover: n === 0 })),
        location: { region: f.region, city: f.city, address: f.address },
        bedrooms: f.bedrooms, bathrooms: f.bathrooms, maxGuests: f.maxGuests, amenities: f.amenities,
      });
      toast.success("Listed — it's live on SmileStays.");
      onCreated();
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Couldn't create the listing.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <form onSubmit={submit} className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-lg font-black text-gray-900">List a place for {host.storeName || host.name}</p>
          <button type="button" onClick={onClose} aria-label="Close"><X size={18} /></button>
        </div>

        <span className={label}>Photos * (first one is the cover)</span>
        <div className="mb-3 grid grid-cols-4 gap-2">
          {images.map((img, i) => (
            <div key={img.url} className="relative aspect-square overflow-hidden rounded-xl bg-gray-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt="" className="h-full w-full object-cover" />
              <button type="button" onClick={() => setImages((p) => p.filter((_, n) => n !== i))} className="absolute right-1 top-1 rounded-full bg-black/60 p-0.5 text-white" aria-label="Remove photo"><X size={12} /></button>
              {i === 0 && <span className="absolute bottom-1 left-1 rounded bg-[#ffc105] px-1 text-[9px] font-bold">COVER</span>}
            </div>
          ))}
          {images.length < 10 && (
            <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 text-gray-400 hover:border-yellow-400">
              {uploading !== null ? <span className="text-xs">{uploading}%</span> : <><ImagePlus size={18} /><span className="text-[10px]">Add</span></>}
              <input type="file" accept="image/*" multiple hidden onChange={(e) => onFiles(e.target.files)} disabled={uploading !== null} />
            </label>
          )}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2"><span className={label}>Title *</span><input className={input} value={f.title} onChange={(e) => set("title", e.target.value)} placeholder="Sea-view room with breakfast, Labadi" required /></div>
          <div><span className={label}>Type *</span><select className={input} value={f.type} onChange={(e) => set("type", e.target.value)}>{STAY_TYPES.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}</select></div>
          <div><span className={label}>Price per night ({ng ? "₦" : "GH₵"}) *</span><input type="number" min="1" className={input} value={f.pricePerNight} onChange={(e) => set("pricePerNight", e.target.value)} required /></div>
          <div><span className={label}>{ng ? "State" : "Region"} *</span><select className={input} value={f.region} onChange={(e) => set("region", e.target.value)}>{(ng ? NG_STATES : GH_REGIONS).map((r) => <option key={r}>{r}</option>)}</select></div>
          <div><span className={label}>City / area</span><input className={input} value={f.city} onChange={(e) => set("city", e.target.value)} /></div>
          <div className="sm:col-span-2"><span className={label}>Address / landmark (shown after booking)</span><input className={input} value={f.address} onChange={(e) => set("address", e.target.value)} /></div>
          <div><span className={label}>Bedrooms</span><input type="number" min="0" className={input} value={f.bedrooms} onChange={(e) => set("bedrooms", e.target.value)} /></div>
          <div><span className={label}>Max guests</span><input type="number" min="1" className={input} value={f.maxGuests} onChange={(e) => set("maxGuests", e.target.value)} /></div>
          <div className="sm:col-span-2"><span className={label}>Amenities (comma separated)</span><input className={input} value={f.amenities} onChange={(e) => set("amenities", e.target.value)} placeholder="Wi-Fi, AC, Parking, Breakfast" /></div>
          <div className="sm:col-span-2"><span className={label}>Description</span><textarea rows={4} className={input} value={f.description} onChange={(e) => set("description", e.target.value)} placeholder="Check-in/out times, house rules, what's nearby" /></div>
        </div>

        {error && <p className="mt-3 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <button disabled={busy || uploading !== null} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#ffc105] py-3 text-sm font-black text-black disabled:opacity-50">
          {busy ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />} Publish on SmileStays
        </button>
      </form>
    </div>
  );
}
