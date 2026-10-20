"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Users,
  Search,
  Filter,
  Shield,
  Coins,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
  Mail,
  Phone,
  Calendar,
} from "lucide-react";

const roleFilters = ["All", "user", "admin", "super-admin"];

export default function AdminUsersDirectory() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("All");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [alertMessage, setAlertMessage] = useState(null);

  const fetchUsers = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "15",
      });
      if (selectedRole !== "All") params.set("role", selectedRole);
      if (searchQuery.trim()) params.set("search", searchQuery.trim());

      const res = await fetch(`/api/users?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setUsers(data.users || []);
        setTotal(data.total || 0);
        setPages(data.pages || 1);
      }
    } catch (err) {
      console.error("[Fetch Users Error]", err);
    } finally {
      setLoading(false);
    }
  }, [page, selectedRole, searchQuery]);

  useEffect(() => {
    let ignore = false;
    async function sync() {
      try {
        const params = new URLSearchParams({
          page: String(page),
          limit: "15",
        });
        if (selectedRole !== "All") params.set("role", selectedRole);
        if (searchQuery.trim()) params.set("search", searchQuery.trim());

        const res = await fetch(`/api/users?${params.toString()}`);
        const data = await res.json();
        if (!ignore && data.success) {
          setUsers(data.users || []);
          setTotal(data.total || 0);
          setPages(data.pages || 1);
        }
      } catch (err) {
        console.error("[Fetch Users Error]", err);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }
    sync();
    return () => {
      ignore = true;
    };
  }, [page, selectedRole, searchQuery]);

  async function handleToggleActive(user) {
    const nextActive = !user.isActive;
    try {
      const res = await fetch(`/api/users/${user._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: nextActive }),
      });
      const data = await res.json();
      if (data.success) {
        setAlertMessage({
          type: "success",
          text: `Account for ${user.email} is now ${nextActive ? "Active" : "Suspended"}.`,
        });
        fetchUsers();
      } else {
        setAlertMessage({ type: "error", text: data.message || "Failed to update account status." });
      }
    } catch (err) {
      console.error("[Toggle Active Error]", err);
    }
  }

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {alertMessage && (
        <div
          className={`p-3.5 rounded-2xl flex items-center justify-between text-xs font-semibold shadow-md ${
            alertMessage.type === "success"
              ? "bg-emerald-600 text-white shadow-emerald-600/20"
              : "bg-rose-600 text-white shadow-rose-600/20"
          }`}
        >
          <span>{alertMessage.text}</span>
          <button
            type="button"
            onClick={() => setAlertMessage(null)}
            className="p-1 rounded-full hover:bg-white/20 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header and Controls */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              <span>Registered User Directory</span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Customer accounts, reward balances, roles, and security authorization
            </p>
          </div>
          <span className="self-start sm:self-auto text-xs font-bold px-3 py-1 bg-purple-50 text-purple-700 rounded-full border border-purple-200">
            {total} Total Users
          </span>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {roleFilters.map((r) => {
              const active = selectedRole === r;
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => {
                    setSelectedRole(r);
                    setPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                    active
                      ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                  }`}
                >
                  {r === "All" ? "All Roles" : r.toUpperCase()}
                </button>
              );
            })}
          </div>

          <div className="relative w-full sm:w-72 shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search name, email, phone..."
              className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-purple-600 focus:bg-white transition"
            />
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600 mb-2" />
            <p className="text-xs font-semibold">Loading users directory...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <Users className="w-10 h-10 mx-auto mb-2 text-slate-300" />
            <p className="text-xs font-semibold text-slate-600">No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Reward Points</th>
                  <th className="py-3 px-4">Joined Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Account Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => {
                  const roleBadge = {
                    "super-admin": "bg-purple-100 text-purple-800 border-purple-300",
                    admin: "bg-indigo-50 text-indigo-700 border-indigo-200",
                    user: "bg-slate-50 text-slate-600 border-slate-200",
                  };

                  return (
                    <tr key={u._id} className="hover:bg-slate-50/80 transition">
                      {/* User Name & Initial */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                            {u.name ? u.name.charAt(0).toUpperCase() : "U"}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 leading-tight">
                              {u.name || "Customer"}
                            </p>
                            <p className="text-[11px] text-slate-400">ID: {u._id.slice(-6)}</p>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="py-3.5 px-4">
                        <p className="text-slate-800">{u.email}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">{u.phone || "No phone added"}</p>
                      </td>

                      {/* Role */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${
                            roleBadge[u.role] || "bg-slate-50 text-slate-600 border-slate-200"
                          }`}
                        >
                          {u.role || "user"}
                        </span>
                      </td>

                      {/* Reward Points */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1 font-bold text-amber-700">
                          <Coins className="w-3.5 h-3.5 text-amber-500" />
                          <span>{u.rewardPoints || 0} pts</span>
                        </div>
                      </td>

                      {/* Joined Date */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-500">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "N/A"}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            u.isActive !== false
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-rose-50 text-rose-700 border-rose-200"
                          }`}
                        >
                          {u.isActive !== false ? "Active" : "Suspended"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        {u.role !== "super-admin" && (
                          <button
                            type="button"
                            onClick={() => handleToggleActive(u)}
                            className={`px-3 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                              u.isActive !== false
                                ? "bg-rose-50 hover:bg-rose-100 text-rose-700"
                                : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700"
                            }`}
                          >
                            {u.isActive !== false ? "Suspend" : "Activate"}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {pages > 1 && (
          <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>
              Page <strong>{page}</strong> of <strong>{pages}</strong> ({total} users)
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 transition cursor-pointer"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(pages, p + 1))}
                disabled={page >= pages}
                className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 transition cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
