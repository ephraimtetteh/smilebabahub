"use client";
// src/app/admin/users/page.tsx

import { useEffect, useState } from "react";
import { useAdmin } from "@/src/hooks/useAdmin";
import {
  Search,
  Loader2,
  UserCog,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "react-toastify";

function RoleBadge({ role }: { role: string }) {
  const cls =
    role === "vendor"
      ? "bg-green-100 text-green-700"
      : role === "admin"
        ? "bg-purple-100 text-purple-700"
        : "bg-gray-100 text-gray-500";
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cls}`}>
      {role}
    </span>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GH", { dateStyle: "medium" });
}

export default function AdminUsersPage() {
  const { data, loading, error, fetch, patch } = useAdmin<any>("users");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [page, setPage] = useState(1);
  const [changing, setChanging] = useState<string | null>(null);

  const load = (overrides?: object) =>
    fetch({ search, role: roleFilter, page, limit: 20, ...overrides });

  useEffect(() => {
    load();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    load({ page: 1 });
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    setChanging(userId);
    try {
      await patch(userId, "role", { role: newRole });
      toast.success("Role updated");
      load();
    } catch {
      toast.error("Failed to update role");
    } finally {
      setChanging(null);
    }
  };

  const meta = data?.meta;
  const users = data?.users ?? [];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-gray-900">Users</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {meta?.total
              ? `${meta.total.toLocaleString()} total`
              : "All registered users"}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <form
          onSubmit={handleSearch}
          className="flex gap-2 flex-1 min-w-[220px]"
        >
          <div className="relative flex-1">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email, phone…"
              className="w-full pl-8 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm
                focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 bg-[#ffc105] text-black font-bold text-sm
              rounded-xl hover:bg-amber-400 transition"
          >
            Search
          </button>
        </form>

        <select
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value);
            setPage(1);
            load({ role: e.target.value, page: 1 });
          }}
          className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm
            focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white"
        >
          <option value="">All roles</option>
          <option value="guest">Guest</option>
          <option value="vendor">Vendor</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 size={28} className="animate-spin text-[#ffc105]" />
          </div>
        ) : error ? (
          <p className="text-red-500 text-sm p-6">{error}</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    {[
                      "User",
                      "Email",
                      "Role",
                      "Country",
                      "Joined",
                      "Actions",
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left px-5 py-3 text-xs font-bold
                        text-gray-400 uppercase tracking-wider whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {users.map((u: any) => (
                    <tr key={u._id} className="hover:bg-gray-50/50 transition">
                      <td className="px-5 py-3 font-semibold text-gray-900 whitespace-nowrap">
                        {u.username}
                      </td>
                      <td className="px-5 py-3 text-gray-500 max-w-[180px] truncate">
                        {u.email}
                      </td>
                      <td className="px-5 py-3">
                        <RoleBadge role={u.role} />
                      </td>
                      <td className="px-5 py-3 text-gray-500">
                        {u.country || "—"}
                      </td>
                      <td className="px-5 py-3 text-gray-400 whitespace-nowrap">
                        {formatDate(u.createdAt)}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-1.5">
                          <UserCog size={13} className="text-gray-400" />
                          <select
                            value={u.role}
                            disabled={changing === u._id}
                            onChange={(e) =>
                              handleRoleChange(u._id, e.target.value)
                            }
                            className="text-xs border border-gray-200 rounded-lg px-2 py-1
                              focus:outline-none focus:ring-1 focus:ring-yellow-400
                              disabled:opacity-50 bg-white"
                          >
                            <option value="guest">Guest</option>
                            <option value="vendor">Vendor</option>
                            <option value="admin">Admin</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {meta && meta.pages > 1 && (
              <div
                className="flex items-center justify-between px-5 py-4
                border-t border-gray-100"
              >
                <p className="text-xs text-gray-400">
                  Page {meta.page} of {meta.pages}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const p = page - 1;
                      setPage(p);
                      load({ page: p });
                    }}
                    disabled={page === 1}
                    className="w-8 h-8 flex items-center justify-center rounded-lg
                      border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <button
                    onClick={() => {
                      const p = page + 1;
                      setPage(p);
                      load({ page: p });
                    }}
                    disabled={page >= meta.pages}
                    className="w-8 h-8 flex items-center justify-center rounded-lg
                      border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
