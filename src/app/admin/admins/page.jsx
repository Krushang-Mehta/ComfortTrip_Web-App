"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import {
  ShieldCheck,
  ShieldAlert,
  UserPlus,
  Lock,
  Mail,
  User,
  Phone,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  KeyRound,
  Calendar,
  X,
  Search,
} from "lucide-react";
import CustomDropdown from "@/components/common/CustomDropdown";
import { TableSkeleton } from "@/components/admin/AdminSkeleton";

const roleOptions = [
  {
    value: "admin",
    label: "Admin (Operations)",
    subtitle: "Fleet, Bookings & Dispatch management",
  },
  {
    value: "super-admin",
    label: "Super Admin (Executive)",
    subtitle: "Unrestricted system & staff governance",
  },
];

export default function AdminStaffManagementPage() {
  const { data: session, status } = useSession();
  const [staffList, setStaffList] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);

  // Form Fields
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "admin",
    password: "",
    superAdminPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showSuperPassword, setShowSuperPassword] = useState(false);

  const fetchStaff = useCallback(async () => {
    try {
      setFetching(true);
      const res = await fetch("/api/admin/staff");
      const data = await res.json();
      if (data.success) {
        setStaffList(data.staff || []);
      } else {
        setAlertMessage({ type: "error", text: data.message || "Failed to load staff list" });
      }
    } catch (err) {
      console.error("[Fetch Staff Error]", err);
      setAlertMessage({ type: "error", text: "Network error loading administrative profiles." });
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        setFetching(true);
        const res = await fetch("/api/admin/staff");
        const data = await res.json();
        if (!ignore && data.success) {
          setStaffList(data.staff || []);
        } else if (!ignore && !data.success) {
          setAlertMessage({ type: "error", text: data.message || "Failed to load staff list" });
        }
      } catch (err) {
        if (!ignore) {
          setAlertMessage({ type: "error", text: "Network error loading administrative profiles." });
        }
      } finally {
        if (!ignore) {
          setFetching(false);
        }
      }
    }

    if (session?.user?.role === "super-admin") {
      load();
    }

    return () => {
      ignore = true;
    };
  }, [session]);

  const loading = status === "loading" || fetching;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setAlertMessage(null);

      const res = await fetch("/api/admin/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setAlertMessage({
          type: "success",
          text: data.message || "New administrative profile provisioned successfully.",
        });
        setModalOpen(false);
        setFormData({
          name: "",
          email: "",
          phone: "",
          role: "admin",
          password: "",
          superAdminPassword: "",
        });
        fetchStaff();
      } else {
        setAlertMessage({
          type: "error",
          text: data.message || "Failed to create administrative account.",
        });
      }
    } catch (err) {
      console.error("[Create Admin Error]", err);
      setAlertMessage({ type: "error", text: "Network error while provisioning admin account." });
    } finally {
      setSubmitting(false);
    }
  };

  // RBAC Access Control Guard
  if (status !== "loading" && session?.user?.role !== "super-admin") {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 bg-white rounded-3xl border border-slate-200/80 shadow-md">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4 border border-rose-200 shadow-sm">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Restricted Executive Desk</h2>
        <p className="text-xs text-slate-500 max-w-md mt-2 leading-relaxed">
          This portal is reserved exclusively for the <strong>Super Administrator</strong>.
          Standard administrators do not possess authorization to provision or modify staff credentials.
        </p>
      </div>
    );
  }

  const filteredStaff = staffList.filter(
    (s) =>
      s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.role?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {alertMessage && (
        <div
          className={`p-4 rounded-2xl flex items-center justify-between text-xs font-semibold shadow-md animate-in slide-in-from-top-2 duration-200 ${
            alertMessage.type === "success"
              ? "bg-emerald-600 text-white shadow-emerald-600/20"
              : "bg-rose-600 text-white shadow-rose-600/20"
          }`}
        >
          <div className="flex items-center gap-2">
            {alertMessage.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{alertMessage.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setAlertMessage(null)}
            className="p-1 rounded-full hover:bg-white/20 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Banner with 3D Depth Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-[0_10px_30px_-5px_rgba(147,51,234,0.06),0_4px_12px_-2px_rgba(0,0,0,0.03)] hover:border-purple-300 transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 bg-purple-50 px-3 py-0.5 rounded-full border border-purple-200/70 inline-flex items-center gap-1 shadow-xs">
              <Sparkles className="w-3 h-3 text-purple-600" />
              Super Admin Privilege
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <ShieldCheck className="w-7 h-7 text-purple-700" />
            Staff & Administrative Governance
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Provision verified admin credentials with mandatory cryptographic password challenge verification.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-lg shadow-purple-600/30 hover:shadow-purple-600/40 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          Provision New Admin
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative w-full sm:max-w-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search staff by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white transition"
          />
        </div>
        <span className="text-xs font-semibold text-slate-500">
          Showing <strong className="text-purple-700 font-bold">{filteredStaff.length}</strong> administrative accounts
        </span>
      </div>

      {/* Staff Directory Container: Modern Cards on Mobile/Tablet & Table on Desktop */}
      {loading ? (
        <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-sm">
          <TableSkeleton rows={5} />
        </div>
      ) : filteredStaff.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/80 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <p className="text-xs font-bold text-slate-700">No administrative profiles found</p>
          <p className="text-[11px] text-slate-400 mt-1">Click &ldquo;Provision New Admin&rdquo; to add your first colleague.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* 1. Mobile & Tablet Modern Card View (Screen sizes < lg) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden">
            {filteredStaff.map((staff) => {
              const initial = staff.name?.charAt(0)?.toUpperCase() || "A";
              const isSuper = staff.role === "super-admin";

              return (
                <div
                  key={staff.id}
                  className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-[0_10px_25px_-5px_rgba(147,51,234,0.06),0_4px_10px_-2px_rgba(0,0,0,0.03)] hover:border-purple-300 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 flex flex-col justify-between space-y-4"
                >
                  {/* Top Bar: Avatar, Name, Email & Role Pill */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-xs">
                        {initial}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-slate-900 text-sm truncate leading-tight">
                          {staff.name}
                        </h3>
                        <p className="text-[11px] text-slate-400 truncate flex items-center gap-1 mt-0.5">
                          <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{staff.email}</span>
                        </p>
                      </div>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border shadow-xs shrink-0 ${
                        isSuper
                          ? "bg-purple-50 text-purple-700 border-purple-200"
                          : "bg-indigo-50 text-indigo-700 border-indigo-200"
                      }`}
                    >
                      <ShieldCheck className="w-3 h-3" />
                      {isSuper ? "Super Admin" : "Operations"}
                    </span>
                  </div>

                  {/* Contact Phone & Provisioned Meta Block */}
                  <div className="grid grid-cols-2 gap-3 py-3 border-y border-slate-100 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold block uppercase tracking-wider">
                        Phone Number
                      </span>
                      <span className="font-medium text-slate-700 truncate block mt-0.5">
                        {staff.phone ? (
                          <span className="flex items-center gap-1 text-[11px]">
                            <Phone className="w-3 h-3 text-purple-600 shrink-0" />
                            {staff.phone}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">Not specified</span>
                        )}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold block uppercase tracking-wider">
                        Provisioned
                      </span>
                      <span className="font-medium text-slate-700 flex items-center gap-1 text-[11px] mt-0.5">
                        <Calendar className="w-3 h-3 text-purple-600 shrink-0" />
                        {new Date(staff.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Bottom Row: Status Badge */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Account Status
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Active Staff
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 2. Desktop Full Data Table (Screen sizes >= lg) */}
          <div className="hidden lg:block bg-white rounded-3xl border border-slate-200/80 shadow-[0_10px_30px_-5px_rgba(147,51,234,0.06),0_4px_12px_-2px_rgba(0,0,0,0.03)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="py-4 px-6">Administrator</th>
                    <th className="py-4 px-6">Assigned Role</th>
                    <th className="py-4 px-6">Contact Phone</th>
                    <th className="py-4 px-6">Provisioned Date</th>
                    <th className="py-4 px-6">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {filteredStaff.map((staff) => (
                    <tr key={staff.id} className="hover:bg-purple-50/20 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs uppercase shadow-xs">
                            {staff.name?.charAt(0) || "A"}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{staff.name}</p>
                            <p className="text-[11px] text-slate-400 flex items-center gap-1">
                              <Mail className="w-3 h-3 text-slate-400" />
                              {staff.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold border shadow-xs ${
                            staff.role === "super-admin"
                              ? "bg-purple-50 text-purple-700 border-purple-200"
                              : "bg-indigo-50 text-indigo-700 border-indigo-200"
                          }`}
                        >
                          <ShieldCheck className="w-3 h-3" />
                          {staff.role === "super-admin" ? "Super Admin" : "Operations Admin"}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-slate-600">
                        {staff.phone ? (
                          <span className="flex items-center gap-1.5">
                            <Phone className="w-3 h-3 text-slate-400" />
                            {staff.phone}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">Not specified</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-slate-500">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {new Date(staff.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Active Staff
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Provision New Admin */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => !submitting && setModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-purple-100 p-6 sm:p-8 animate-in zoom-in-95 duration-200 relative max-h-[90vh] overflow-y-auto custom-scrollbar"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center shadow-xs border border-purple-200">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Provision Admin Profile</h3>
                  <p className="text-[11px] text-slate-400">Assign role credentials with security checkpoint</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => !submitting && setModalOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAdmin} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white transition"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="e.g. rahul.admin@thecomforttrip.com"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Contact Phone</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+91 98765 43210"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Administrative Role</label>
                  <CustomDropdown
                    value={formData.role}
                    onChange={(val) => setFormData((p) => ({ ...p, role: val }))}
                    options={roleOptions}
                    placeholder="Select administrative role"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">New User Temporary Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    minLength={6}
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Minimum 6 characters"
                    className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* SECURITY CHECKPOINT: Super Admin Password Verification */}
              <div className="p-4 rounded-2xl bg-purple-50/80 border border-purple-200 space-y-2 mt-2">
                <div className="flex items-center gap-2 text-purple-900">
                  <KeyRound className="w-4 h-4 text-purple-700 shrink-0" />
                  <span className="font-bold text-[11px] uppercase tracking-wider">
                    Super Admin Identity Verification
                  </span>
                </div>
                <p className="text-[11px] text-purple-800 leading-relaxed">
                  Enter your <strong>current Super Admin account password</strong> to authorize provisioning of this privileged account.
                </p>
                <div className="relative mt-2">
                  <Lock className="w-4 h-4 text-purple-600 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showSuperPassword ? "text" : "password"}
                    name="superAdminPassword"
                    required
                    value={formData.superAdminPassword}
                    onChange={handleInputChange}
                    placeholder="Enter your current password"
                    className="w-full pl-9 pr-10 py-2 bg-white border border-purple-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600/30 transition text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSuperPassword(!showSuperPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showSuperPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-md shadow-purple-600/25 transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {submitting ? "Verifying & Provisioning..." : "Confirm & Provision Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
