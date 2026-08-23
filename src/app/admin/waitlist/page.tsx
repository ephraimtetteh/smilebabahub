// client/src/app/admin/waitlist/page.tsx
//
// Admin view for the waitlist. Uses Redux — same pattern as other admin
// pages in this repo (e.g. /admin/promotions).

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/src/lib/api/axios";
import { useAppSelector } from "../../redux";

interface WaitlistEntry {
  _id: string;
  product: string;
  name: string;
  phone: string;
  email?: string;
  country?: string;
  status: "waiting" | "contacted" | "onboarded";
  notes?: string;
  createdAt: string;
}

const PRODUCTS = [
  { id: "", label: "All products" },
  { id: "money", label: "SmileBaba Money" },
  { id: "vendor-tools", label: "Vendor Tools" },
  { id: "loans", label: "Loans" },
];

const STATUSES = [
  { id: "", label: "All statuses" },
  { id: "waiting", label: "Waiting" },
  { id: "contacted", label: "Contacted" },
  { id: "onboarded", label: "Onboarded" },
];

export default function AdminWaitlistPage() {
  const router = useRouter();

  // Redux — match whatever selector your other admin pages use
  const { user, hasCheckedAuth } = useAppSelector((state) => state.auth);

  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [stats, setStats] = useState<{
    byProduct: Record<string, number>;
    byCountry: Record<string, number>;
  }>({ byProduct: {}, byCountry: {} });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    product: "",
    status: "",
    country: "",
    search: "",
  });

  // Admin gate — same pattern as /admin/promotions
  useEffect(() => {
    if (hasCheckedAuth && (!user || user.role !== "admin")) {
      router.replace("/");
    }
  }, [user, hasCheckedAuth, router]);

  const load = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filter.product) params.set("product", filter.product);
    if (filter.status) params.set("status", filter.status);
    if (filter.country) params.set("country", filter.country);
    if (filter.search) params.set("search", filter.search);
    params.set("limit", "100");

    try {
      const { data } = await axiosInstance.get(`/waitlist?${params}`);
      setEntries(data.entries ?? []);
      setStats(data.stats ?? { byProduct: {}, byCountry: {} });
    } catch (err) {
      console.error("[waitlist admin]", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "admin") load();
  }, [filter, user]);

  const updateStatus = async (id: string, status: string) => {
    try {
      await axiosInstance.patch(`/waitlist/${id}`, { status });
      setEntries((prev) =>
        prev.map((e) =>
          e._id === id
            ? { ...e, status: status as WaitlistEntry["status"] }
            : e,
        ),
      );
    } catch (err) {
      console.error(err);
      alert("Couldn't update status");
    }
  };

  const deleteEntry = async (id: string) => {
    if (!confirm("Remove this waitlist entry?")) return;
    try {
      await axiosInstance.delete(`/waitlist/${id}`);
      setEntries((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      console.error(err);
      alert("Couldn't delete");
    }
  };

  const exportCsv = () => {
    const rows: (string | number)[][] = [
      ["Name", "Phone", "Email", "Country", "Product", "Status", "Joined"],
      ...entries.map((e) => [
        e.name,
        e.phone,
        e.email ?? "",
        e.country ?? "",
        e.product,
        e.status,
        new Date(e.createdAt).toISOString(),
      ]),
    ];
    const csv = rows
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `waitlist-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── Auth loading gate ──
  if (!hasCheckedAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-400 text-sm">Loading…</div>
      </div>
    );
  }

  if (!user || user.role !== "admin") return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Waitlist</h1>
            <p className="text-sm text-gray-500 mt-1">
              People waiting for new SmileBaba products
            </p>
          </div>
          <button
            onClick={exportCsv}
            disabled={entries.length === 0}
            className="px-4 py-2 bg-gray-900 text-yellow-400 rounded-xl font-semibold text-sm hover:opacity-90 disabled:opacity-40"
          >
            Export CSV
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <StatCard label="Total" value={entries.length} />
          <StatCard
            label="Money"
            value={stats.byProduct.money ?? 0}
            tint="#FEF3C7"
          />
          <StatCard
            label="Ghana"
            value={stats.byCountry.Ghana ?? 0}
            tint="#DBEAFE"
          />
          <StatCard
            label="Nigeria"
            value={stats.byCountry.Nigeria ?? 0}
            tint="#D1FAE5"
          />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-4 mb-4 flex flex-wrap items-center gap-2">
          <input
            type="text"
            placeholder="Search name, phone or email"
            value={filter.search}
            onChange={(e) => setFilter({ ...filter, search: e.target.value })}
            className="flex-1 min-w-[200px] px-3 py-2 bg-gray-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <select
            value={filter.product}
            onChange={(e) => setFilter({ ...filter, product: e.target.value })}
            className="px-3 py-2 bg-gray-50 rounded-xl text-sm outline-none"
          >
            {PRODUCTS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
          <select
            value={filter.status}
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
            className="px-3 py-2 bg-gray-50 rounded-xl text-sm outline-none"
          >
            {STATUSES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
          <select
            value={filter.country}
            onChange={(e) => setFilter({ ...filter, country: e.target.value })}
            className="px-3 py-2 bg-gray-50 rounded-xl text-sm outline-none"
          >
            <option value="">All countries</option>
            <option value="Ghana">Ghana</option>
            <option value="Nigeria">Nigeria</option>
          </select>
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading…</div>
        ) : entries.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center">
            <p className="text-gray-500">No entries match your filters.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="text-left text-xs text-gray-500">
                  <th className="p-3 font-semibold">Name</th>
                  <th className="p-3 font-semibold">Contact</th>
                  <th className="p-3 font-semibold">Product</th>
                  <th className="p-3 font-semibold">Country</th>
                  <th className="p-3 font-semibold">Status</th>
                  <th className="p-3 font-semibold">Joined</th>
                  <th className="p-3 font-semibold"></th>
                </tr>
              </thead>
              <tbody>
                {entries.map((e) => (
                  <tr
                    key={e._id}
                    className="border-t border-gray-100 hover:bg-gray-50"
                  >
                    <td className="p-3 font-semibold text-gray-900">
                      {e.name}
                    </td>
                    <td className="p-3">
                      <div className="text-gray-900">{e.phone}</div>
                      {e.email && (
                        <div className="text-xs text-gray-500">{e.email}</div>
                      )}
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-1 rounded-md text-xs font-semibold bg-yellow-100 text-yellow-800">
                        {e.product}
                      </span>
                    </td>
                    <td className="p-3 text-gray-700">
                      {e.country === "Ghana" && "🇬🇭 Ghana"}
                      {e.country === "Nigeria" && "🇳🇬 Nigeria"}
                      {!e.country && <span className="text-gray-400">—</span>}
                    </td>
                    <td className="p-3">
                      <select
                        value={e.status}
                        onChange={(ev) => updateStatus(e._id, ev.target.value)}
                        className={`text-xs px-2 py-1 rounded-md font-semibold outline-none border-0 ${
                          e.status === "waiting"
                            ? "bg-yellow-100 text-yellow-800"
                            : e.status === "contacted"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                        }`}
                      >
                        <option value="waiting">Waiting</option>
                        <option value="contacted">Contacted</option>
                        <option value="onboarded">Onboarded</option>
                      </select>
                    </td>
                    <td className="p-3 text-xs text-gray-500">
                      {new Date(e.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => deleteEntry(e._id)}
                        className="text-xs text-red-600 hover:opacity-70"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  tint,
}: {
  label: string;
  value: number;
  tint?: string;
}) {
  return (
    <div
      className="rounded-2xl p-4"
      style={{ backgroundColor: tint ?? "white" }}
    >
      <div className="text-xs font-semibold text-gray-500">{label}</div>
      <div className="text-2xl font-bold text-gray-900 mt-1">{value}</div>
    </div>
  );
}
