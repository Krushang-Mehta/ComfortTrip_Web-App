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
  Info,
  Clock,
  Sparkles,
} from "lucide-react";
import { TableSkeleton } from "@/components/admin/AdminSkeleton";

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
  const [selectedUserForModal, setSelectedUserForModal] = useState(null);

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
        if (selectedUserForModal?._id === user._id) {
          setSelectedUserForModal((prev) => (prev ? { ...prev, isActive: nextActive } : null));
        }
      } else {
        setAlertMessage({ type: "error", text: data.message || "Failed to update account status." });
      }
    } catch (err) {
      console.error("[Toggle Active Error]", err);
    }
  }

  const roleBadgeStyle = {
    "super-admin": "bg-purple-100 text-purple-800 border-purple-300",
    admin: "bg-indigo-50 text-indigo-700 border-indigo-200",
    user: "bg-slate-50 text-slate-600 border-slate-200",
  };

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
      <div className="bg-white p-5 rounded-3xl border border-purple-100/70 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2 font-serif sm:font-sans">
              <Users className="w-5 h-5 text-purple-600" />
              <span>Registered User Directory</span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Customer accounts, reward balances, roles, and security authorization
            </p>
          </div>
          <span className="self-start sm:self-auto text-xs font-bold px-3 py-1 bg-purple-50 text-purple-700 rounded-full border border-purple-200 shadow-xs">
            {total} Total Users
          </span>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
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
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                    active
                      ? "bg-purple-600 text-white shadow-md shadow-purple-600/25"
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

      {/* Loading Skeleton */}
      {loading ? (
        <TableSkeleton rows={6} />
      ) : users.length === 0 ? (
        <div className="text-center py-20 text-slate-400 bg-white rounded-3xl border border-purple-100/70 shadow-sm">
          <Users className="w-10 h-10 mx-auto mb-2 text-slate-300" />
          <p className="text-xs font-semibold text-slate-600">No users found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* 1. Mobile & Tablet Modern Card View (Screen sizes < lg) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden">
            {users.map((u) => {
              const initial = u.name ? u.name.charAt(0).toUpperCase() : "U";
              const isSuper = u.role === "super-admin";

              return (
                <div
                  key={u._id}
                  className="bg-white rounded-3xl border border-purple-100/70 p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  {/* Top Bar: Avatar, Name, Role & Info (i) Button */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-xs">
                        {initial}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-slate-900 text-sm truncate leading-tight">
                          {u.name || "Customer"}
                        </h3>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span
                            className={`text-[9px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${
                              roleBadgeStyle[u.role] || "bg-slate-50 text-slate-600 border-slate-200"
                            }`}
                          >
                            {u.role || "user"}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            #{u._id.slice(-6)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* (i) Info Button */}
                    <button
                      type="button"
                      onClick={() => setSelectedUserForModal(u)}
                      className="p-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 transition cursor-pointer shrink-0 shadow-xs"
                      title="View user details"
                      aria-label="View user info"
                    >
                      <Info className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Contact & Meta Information */}
                  <div className="my-3.5 space-y-2 py-3 border-y border-slate-50 text-xs">
                    <div className="flex items-center gap-2 text-slate-600 truncate">
                      <Mail className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                      <span className="truncate">{u.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <Phone className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                      <span>{u.phone || "No phone added"}</span>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-1.5 font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/60">
                        <Coins className="w-3.5 h-3.5 text-amber-500" />
                        <span>{u.rewardPoints || 0} pts</span>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                          u.isActive !== false
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-rose-50 text-rose-700 border-rose-200"
                        }`}
                      >
                        {u.isActive !== false ? "Active" : "Suspended"}
                      </span>
                    </div>
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "Recent"}
                    </span>

                    {!isSuper ? (
                      <button
                        type="button"
                        onClick={() => handleToggleActive(u)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shadow-xs ${
                          u.isActive !== false
                            ? "bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/60"
                            : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/60"
                        }`}
                      >
                        {u.isActive !== false ? "Suspend" : "Activate"}
                      </button>
                    ) : (
                      <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider">
                        Super User
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* 2. Desktop High-Density Table View (Screen sizes >= lg) */}
          <div className="hidden lg:block bg-white rounded-3xl border border-purple-100/70 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-400 font-bold border-b border-slate-100">
                  <tr>
                    <th className="py-3.5 px-4">User</th>
                    <th className="py-3.5 px-4">Contact</th>
                    <th className="py-3.5 px-4">Role</th>
                    <th className="py-3.5 px-4">Reward Points</th>
                    <th className="py-3.5 px-4">Joined Date</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-purple-50/20 transition">
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
                      <td className="py-3.5 px-4">
                        <p className="text-slate-800 font-medium">{u.email}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">{u.phone || "No phone added"}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${
                            roleBadgeStyle[u.role] || "bg-slate-50 text-slate-600 border-slate-200"
                          }`}
                        >
                          {u.role || "user"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1 font-bold text-amber-700">
                          <Coins className="w-3.5 h-3.5 text-amber-500" />
                          <span>{u.rewardPoints || 0} pts</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-500">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "N/A"}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                            u.isActive !== false
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-rose-50 text-rose-700 border-rose-200"
                          }`}
                        >
                          {u.isActive !== false ? "Active" : "Suspended"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedUserForModal(u)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-purple-700 hover:bg-purple-50 transition cursor-pointer"
                            title="View Info"
                          >
                            <Info className="w-4 h-4" />
                          </button>
                          {u.role !== "super-admin" && (
                            <button
                              type="button"
                              onClick={() => handleToggleActive(u)}
                              className={`px-3 py-1 rounded-xl text-[11px] font-bold transition cursor-pointer ${
                                u.isActive !== false
                                  ? "bg-rose-50 hover:bg-rose-100 text-rose-700"
                                  : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700"
                              }`}
                            >
                              {u.isActive !== false ? "Suspend" : "Activate"}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Pagination Bar */}
      {pages > 1 && (
        <div className="bg-white p-4 rounded-2xl border border-purple-100/70 shadow-sm flex items-center justify-between text-xs text-slate-500">
          <span>
            Page <strong>{page}</strong> of <strong>{pages}</strong> ({total} users)
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-40 transition cursor-pointer"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(pages, p + 1))}
              disabled={page >= pages}
              className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-40 transition cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* User Details Modal (Triggered by (i) button) */}
      {selectedUserForModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setSelectedUserForModal(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-purple-100 p-6 animate-in zoom-in-95 duration-150 relative"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white font-black text-sm flex items-center justify-center shadow-md shadow-purple-600/25">
                  {selectedUserForModal.name
                    ? selectedUserForModal.name.charAt(0).toUpperCase()
                    : "U"}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base leading-tight">
                    {selectedUserForModal.name || "Customer Account"}
                  </h3>
                  <span className="text-[10px] text-slate-400">
                    ID: {selectedUserForModal._id}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedUserForModal(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body Details */}
            <div className="py-4 space-y-3.5 text-xs text-slate-700">
              <div className="p-3 bg-purple-50/60 rounded-2xl border border-purple-100/70 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 block">
                    Security Role
                  </span>
                  <span className="text-sm font-black text-slate-900 uppercase">
                    {selectedUserForModal.role || "user"}
                  </span>
                </div>
                <span
                  className={`text-[10px] font-bold px-3 py-1 rounded-full border ${
                    selectedUserForModal.isActive !== false
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-rose-50 text-rose-700 border-rose-200"
                  }`}
                >
                  {selectedUserForModal.isActive !== false ? "Active Account" : "Suspended"}
                </span>
              </div>

              <div className="space-y-2.5">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                    Email Address
                  </label>
                  <p className="text-slate-900 font-semibold">{selectedUserForModal.email}</p>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                    Phone Number
                  </label>
                  <p className="text-slate-900 font-semibold">
                    {selectedUserForModal.phone || "No phone number linked"}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Reward Wallet
                    </span>
                    <strong className="text-base font-black text-amber-700 block mt-0.5">
                      {selectedUserForModal.rewardPoints || 0} pts
                    </strong>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Joined Date
                    </span>
                    <strong className="text-xs font-bold text-slate-800 block mt-1">
                      {selectedUserForModal.createdAt
                        ? new Date(selectedUserForModal.createdAt).toLocaleDateString()
                        : "N/A"}
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedUserForModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              >
                Close
              </button>
              {selectedUserForModal.role !== "super-admin" && (
                <button
                  type="button"
                  onClick={() => handleToggleActive(selectedUserForModal)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer shadow-xs ${
                    selectedUserForModal.isActive !== false
                      ? "bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200"
                      : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200"
                  }`}
                >
                  {selectedUserForModal.isActive !== false ? "Suspend Account" : "Activate Account"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
