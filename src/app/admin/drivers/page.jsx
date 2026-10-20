"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  UserCheck,
  Plus,
  Search,
  Star,
  Phone,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
  Car,
} from "lucide-react";
import CustomDropdown from "@/components/common/CustomDropdown";
import { CardGridSkeleton } from "@/components/admin/AdminSkeleton";

const driverStatusOptions = [
  { value: "Available", label: "Available for Dispatch", subtitle: "Ready to accept ride assignments" },
  { value: "On-Trip", label: "On-Trip", subtitle: "Currently active on road with passengers" },
  { value: "Off-Duty", label: "Off-Duty", subtitle: "Unavailable / off roster" },
];

export default function AdminDriversRegistry() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [total, setTotal] = useState(0);

  // Modal States
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);

  // Form Fields
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    licenseNumber: "",
    experienceYears: 4,
    status: "Available",
  });

  const fetchDrivers = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.set("search", searchQuery.trim());

      const res = await fetch(`/api/drivers?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setDrivers(data.drivers || []);
        setTotal(data.total || data.drivers?.length || 0);
      }
    } catch (err) {
      console.error("[Fetch Drivers Error]", err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    let ignore = false;
    async function sync() {
      try {
        const params = new URLSearchParams();
        if (searchQuery.trim()) params.set("search", searchQuery.trim());

        const res = await fetch(`/api/drivers?${params.toString()}`);
        const data = await res.json();
        if (!ignore && data.success) {
          setDrivers(data.drivers || []);
          setTotal(data.total || data.drivers?.length || 0);
        }
      } catch (err) {
        console.error("[Fetch Drivers Error]", err);
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
  }, [searchQuery]);

  async function handleCreateDriver(e) {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await fetch("/api/drivers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setAlertMessage({ type: "success", text: `Chauffeur ${formData.fullName} registered successfully.` });
        setCreateModalOpen(false);
        setFormData({
          fullName: "",
          phone: "",
          licenseNumber: "",
          experienceYears: 4,
          status: "Available",
        });
        fetchDrivers();
      } else {
        setAlertMessage({ type: "error", text: data.message || "Failed to register driver" });
      }
    } catch (err) {
      console.error("[Create Driver Error]", err);
      setAlertMessage({ type: "error", text: "Network error occurred." });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleToggleStatus(driver, nextStatus) {
    try {
      const res = await fetch(`/api/drivers/${driver._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setAlertMessage({ type: "success", text: `${driver.fullName} status updated to ${nextStatus}` });
        fetchDrivers();
      }
    } catch (err) {
      console.error("[Update Status Error]", err);
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
              <UserCheck className="w-5 h-5 text-purple-600" />
              <span>Chauffeurs & Drivers Registry</span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified Saurashtra drivers with license records, trip metrics, and live duty status
            </p>
          </div>
          <button
            type="button"
            onClick={() => setCreateModalOpen(true)}
            className="self-start sm:self-auto flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-md shadow-purple-600/30 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Register Chauffeur</span>
          </button>
        </div>

        {/* Search */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, phone, or license..."
              className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-purple-600 focus:bg-white transition"
            />
          </div>
          <span className="text-xs font-semibold text-slate-500 hidden sm:block">
            {total} Registered Chauffeurs
          </span>
        </div>
      </div>

      {/* Roster Grid */}
      {loading ? (
        <CardGridSkeleton count={6} />
      ) : drivers.length === 0 ? (
        <div className="text-center py-20 text-slate-400 bg-white rounded-2xl border border-slate-200">
          <UserCheck className="w-10 h-10 mx-auto mb-2 text-slate-300" />
          <p className="text-xs font-semibold text-slate-600">No chauffeurs found</p>
          <button
            type="button"
            onClick={() => setCreateModalOpen(true)}
            className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-purple-600 hover:underline"
          >
            + Register a new chauffeur
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {drivers.map((driver) => {
            const statusClass = {
              Available: "bg-emerald-50 text-emerald-700 border-emerald-200",
              "On-Trip": "bg-purple-50 text-purple-700 border-purple-200",
              "Off-Duty": "bg-slate-100 text-slate-600 border-slate-200",
            };

            return (
              <div
                key={driver._id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 hover:border-purple-200 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-bold text-sm flex items-center justify-center shadow-xs">
                        {driver.fullName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 leading-tight">
                          {driver.fullName}
                        </h3>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{driver.phone}</span>
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        statusClass[driver.status] || "bg-slate-50 text-slate-700 border-slate-200"
                      }`}
                    >
                      {driver.status}
                    </span>
                  </div>

                  {/* Credentials & Metrics */}
                  <div className="space-y-2 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="text-[11px] text-slate-400">License No:</span>
                      <strong className="font-mono text-slate-800">{driver.licenseNumber}</strong>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="text-[11px] text-slate-400">Experience:</span>
                      <strong className="text-slate-800">{driver.experienceYears} Years</strong>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="text-[11px] text-slate-400">Rides Completed:</span>
                      <strong className="text-slate-800">{driver.totalRides || 0} Rides</strong>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="text-[11px] text-slate-400">Performance Rating:</span>
                      <div className="flex items-center gap-1 font-bold text-amber-600">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{driver.rating || "5.0"}★</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Duty Toggle Actions */}
                <div className="flex items-center justify-between pt-4 mt-3 border-t border-slate-100 text-xs">
                  <span className="text-[11px] text-slate-400">Change Status:</span>
                  <div className="flex items-center gap-1.5">
                    {driver.status !== "Available" && (
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(driver, "Available")}
                        className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[11px] font-bold transition cursor-pointer"
                      >
                        Available
                      </button>
                    )}
                    {driver.status !== "On-Trip" && (
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(driver, "On-Trip")}
                        className="px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 text-[11px] font-bold transition cursor-pointer"
                      >
                        On-Trip
                      </button>
                    )}
                    {driver.status !== "Off-Duty" && (
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(driver, "Off-Duty")}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold transition cursor-pointer"
                      >
                        Off-Duty
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Register Chauffeur */}
      {createModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setCreateModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-5 animate-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-sm font-bold text-slate-900">Register New Chauffeur</h3>
              <button
                type="button"
                onClick={() => setCreateModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateDriver} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Ramesh Bhai Patel"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98250 12345"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">License Number</label>
                  <input
                    type="text"
                    required
                    value={formData.licenseNumber}
                    onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                    placeholder="GJ-03-2018-00123"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 uppercase focus:outline-none focus:border-purple-600 focus:bg-white transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Experience (Yrs)</label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    required
                    value={formData.experienceYears}
                    onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white transition"
                  />
                </div>
              </div>

              <div className="relative z-10">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Initial Duty Status</label>
                <CustomDropdown
                  value={formData.status}
                  onChange={(val) => setFormData({ ...formData, status: val })}
                  options={driverStatusOptions}
                  placeholder="Select duty status"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-md shadow-purple-600/30 transition disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? "Registering..." : "Register Chauffeur"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
