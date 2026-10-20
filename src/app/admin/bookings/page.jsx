"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  CalendarCheck,
  Search,
  Filter,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  MapPin,
  Car,
  FileText,
  Loader2,
  ChevronLeft,
  ChevronRight,
  X,
  Phone,
  Mail,
  Compass,
} from "lucide-react";

const statuses = [
  "All",
  "Pending",
  "Confirmed",
  "Driver-Assigned",
  "In-Journey",
  "Completed",
  "Cancelled",
];

export default function AdminBookingsDesk() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600 mb-2" />
          <p className="text-xs font-semibold">Initializing dispatch desk...</p>
        </div>
      }
    >
      <BookingsDeskContent />
    </Suspense>
  );
}

function BookingsDeskContent() {
  const searchParams = useSearchParams();
  const initialStatus = searchParams.get("status") || "All";
  const initialSearch = searchParams.get("search") || "";

  const [bookings, setBookings] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState(initialStatus);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [loading, setLoading] = useState(true);

  // Driver Assignment Modal State
  const [assignModalBooking, setAssignModalBooking] = useState(null);
  const [availableDrivers, setAvailableDrivers] = useState([]);
  const [selectedDriverId, setSelectedDriverId] = useState("");
  const [assigning, setAssigning] = useState(false);

  // Status Change Modal State
  const [statusModalBooking, setStatusModalBooking] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Toast alert
  const [alertMessage, setAlertMessage] = useState(null);

  const fetchBookings = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "15",
      });
      if (selectedStatus && selectedStatus !== "All") {
        params.set("status", selectedStatus);
      }
      if (searchQuery.trim()) {
        params.set("search", searchQuery.trim());
      }

      const res = await fetch(`/api/bookings?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setBookings(data.bookings || []);
        setTotal(data.total || 0);
        setPages(data.pages || 1);
      }
    } catch (err) {
      console.error("[Fetch Bookings Error]", err);
    } finally {
      setLoading(false);
    }
  }, [page, selectedStatus, searchQuery]);

  useEffect(() => {
    let ignore = false;
    async function sync() {
      try {
        const params = new URLSearchParams({
          page: String(page),
          limit: "15",
        });
        if (selectedStatus && selectedStatus !== "All") {
          params.set("status", selectedStatus);
        }
        if (searchQuery.trim()) {
          params.set("search", searchQuery.trim());
        }

        const res = await fetch(`/api/bookings?${params.toString()}`);
        const data = await res.json();
        if (!ignore && data.success) {
          setBookings(data.bookings || []);
          setTotal(data.total || 0);
          setPages(data.pages || 1);
        }
      } catch (err) {
        console.error("[Fetch Bookings Error]", err);
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
  }, [page, selectedStatus, searchQuery]);

  // Fetch available drivers when opening assign modal
  async function openAssignModal(booking) {
    setAssignModalBooking(booking);
    setSelectedDriverId("");
    try {
      const res = await fetch("/api/drivers?availableOnly=true");
      const data = await res.json();
      if (data.success) {
        setAvailableDrivers(data.drivers || []);
      }
    } catch (err) {
      console.error("[Fetch Drivers Error]", err);
    }
  }

  // Handle Driver Assignment
  async function handleAssignDriver(e) {
    e.preventDefault();
    if (!assignModalBooking || !selectedDriverId) return;

    try {
      setAssigning(true);
      const res = await fetch(`/api/bookings/${assignModalBooking._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ driverId: selectedDriverId }),
      });
      const data = await res.json();
      if (data.success) {
        setAlertMessage({ type: "success", text: `Chauffeur assigned to ${assignModalBooking.bookingId}` });
        setAssignModalBooking(null);
        fetchBookings();
      } else {
        setAlertMessage({ type: "error", text: data.message || "Failed to assign chauffeur" });
      }
    } catch (err) {
      console.error("[Assign Driver Error]", err);
      setAlertMessage({ type: "error", text: "Network error occurred." });
    } finally {
      setAssigning(false);
    }
  }

  // Handle Status Update
  async function handleUpdateStatus(e) {
    e.preventDefault();
    if (!statusModalBooking || !newStatus) return;

    try {
      setUpdatingStatus(true);
      const res = await fetch(`/api/bookings/${statusModalBooking._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, adminNotes }),
      });
      const data = await res.json();
      if (data.success) {
        setAlertMessage({ type: "success", text: `Booking status updated to ${newStatus}` });
        setStatusModalBooking(null);
        fetchBookings();
      } else {
        setAlertMessage({ type: "error", text: data.message || "Failed to update status" });
      }
    } catch (err) {
      console.error("[Status Update Error]", err);
      setAlertMessage({ type: "error", text: "Network error occurred." });
    } finally {
      setUpdatingStatus(false);
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
              <CalendarCheck className="w-5 h-5 text-purple-600" />
              <span>Live Dispatch Desk</span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage booking requests, assign chauffeurs, and track journey stages
            </p>
          </div>
          <span className="self-start sm:self-auto text-xs font-bold px-3 py-1 bg-purple-50 text-purple-700 rounded-full border border-purple-200">
            {total} Total Bookings
          </span>
        </div>

        {/* Filter Pills & Search */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-2 border-t border-slate-100">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            {statuses.map((st) => {
              const active = selectedStatus === st;
              return (
                <button
                  key={st}
                  type="button"
                  onClick={() => {
                    setSelectedStatus(st);
                    setPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                    active
                      ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                  }`}
                >
                  {st}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full lg:w-72 shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search ID, customer, route..."
              className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-purple-600 focus:bg-white transition"
            />
          </div>
        </div>
      </div>

      {/* Bookings Table / List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600 mb-2" />
            <p className="text-xs font-semibold">Loading live bookings...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <CalendarCheck className="w-10 h-10 mx-auto mb-2 text-slate-300" />
            <p className="text-xs font-semibold text-slate-600">No bookings found</p>
            <p className="text-[11px] text-slate-400 mt-1">
              {searchQuery ? "Try refining your search query." : "No records match this status."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Booking ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Vehicle</th>
                  <th className="py-3 px-4">Pickup & Route</th>
                  <th className="py-3 px-4">Timing</th>
                  <th className="py-3 px-4">Chauffeur</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.map((b) => {
                  const statusColors = {
                    Pending: "bg-amber-50 text-amber-700 border-amber-200",
                    Confirmed: "bg-blue-50 text-blue-700 border-blue-200",
                    "Driver-Assigned": "bg-purple-50 text-purple-700 border-purple-200",
                    "In-Journey": "bg-indigo-50 text-indigo-700 border-indigo-200",
                    Completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
                    Cancelled: "bg-rose-50 text-rose-700 border-rose-200",
                  };
                  const colorClass = statusColors[b.status] || "bg-slate-50 text-slate-700 border-slate-200";

                  return (
                    <tr key={b._id} className="hover:bg-slate-50/80 transition">
                      {/* ID */}
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-purple-700 block">
                          {b.bookingId || "CT-RIDE"}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {b.createdAt ? new Date(b.createdAt).toLocaleDateString() : ""}
                        </span>
                      </td>

                      {/* Customer */}
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-900 leading-tight">
                          {b.user?.name || "Customer"}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate max-w-[140px]">
                          {b.user?.phone || b.user?.email}
                        </p>
                      </td>

                      {/* Vehicle */}
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-slate-900">
                          {b.car?.brand} {b.car?.model}
                        </p>
                        <span className="text-[10px] text-purple-600 bg-purple-50 px-1.5 py-0.2 rounded font-medium">
                          {b.car?.category || "Sedan"}
                        </span>
                      </td>

                      {/* Pickup & Route */}
                      <td className="py-3.5 px-4 max-w-[200px]">
                        <p className="font-medium text-slate-800 truncate" title={b.pickupAddress}>
                          {b.pickupAddress}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5" title={b.destinationAddress}>
                          ➔ {b.destinationAddress}
                        </p>
                      </td>

                      {/* Timing */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <p className="font-semibold text-slate-800">
                          {b.pickupDateTime ? new Date(b.pickupDateTime).toLocaleDateString() : "N/A"}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {b.pickupDateTime ? new Date(b.pickupDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                        </p>
                      </td>

                      {/* Chauffeur */}
                      <td className="py-3.5 px-4">
                        {b.assignedDriver?.name ? (
                          <div className="leading-tight">
                            <span className="font-semibold text-slate-900 block">
                              {b.assignedDriver.name}
                            </span>
                            <span className="text-[10px] text-slate-400 block">
                              {b.assignedDriver.phone}
                            </span>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => openAssignModal(b)}
                            className="text-[11px] font-bold text-purple-600 hover:text-purple-700 bg-purple-50 hover:bg-purple-100 px-2.5 py-1 rounded-lg border border-purple-200 transition cursor-pointer"
                          >
                            + Assign Driver
                          </button>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <button
                          type="button"
                          onClick={() => {
                            setStatusModalBooking(b);
                            setNewStatus(b.status);
                            setAdminNotes(b.adminNotes || "");
                          }}
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-full border transition cursor-pointer hover:shadow-xs ${colorClass}`}
                          title="Click to change status"
                        >
                          {b.status} ▾
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => openAssignModal(b)}
                            title="Assign / Reassign Chauffeur"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-purple-700 hover:bg-purple-50 transition"
                          >
                            <UserCheck className="w-4 h-4" />
                          </button>
                          <a
                            href={`/api/bookings/${b._id}/invoice`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Download PDF Invoice"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition"
                          >
                            <FileText className="w-4 h-4" />
                          </a>
                        </div>
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
              Page <strong>{page}</strong> of <strong>{pages}</strong> ({total} items)
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

      {/* Modal 1: Assign Chauffeur */}
      {assignModalBooking && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setAssignModalBooking(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-5 animate-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Assign Chauffeur • {assignModalBooking.bookingId}
                </h3>
                <p className="text-[11px] text-slate-500">
                  Select an available driver from verified Saurashtra fleet
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAssignModalBooking(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAssignDriver} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Available Chauffeurs
                </label>
                {availableDrivers.length === 0 ? (
                  <p className="text-xs text-amber-700 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                    No chauffeurs currently marked &quot;Available&quot;. You can register new drivers in the Chauffeur Registry.
                  </p>
                ) : (
                  <select
                    value={selectedDriverId}
                    onChange={(e) => setSelectedDriverId(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white transition"
                  >
                    <option value="">-- Select Chauffeur --</option>
                    {availableDrivers.map((d) => (
                      <option key={d._id} value={d._id}>
                        {d.fullName} (Ph: {d.phone} • {d.experienceYears}y exp • {d.rating}★)
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAssignModalBooking(null)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={assigning || !selectedDriverId}
                  className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-md shadow-purple-600/30 transition disabled:opacity-50 cursor-pointer"
                >
                  {assigning ? "Assigning..." : "Confirm Chauffeur"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Change Status */}
      {statusModalBooking && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setStatusModalBooking(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-5 animate-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Update Booking Status • {statusModalBooking.bookingId}
                </h3>
                <p className="text-[11px] text-slate-500">
                  Transition ride through dispatch stages
                </p>
              </div>
              <button
                type="button"
                onClick={() => setStatusModalBooking(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateStatus} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Trip Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white transition"
                >
                  <option value="Pending">Pending (Awaiting Chauffeur)</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Driver-Assigned">Driver-Assigned</option>
                  <option value="In-Journey">In-Journey (On-Road)</option>
                  <option value="Completed">Completed (Unlock Review & Invoice)</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Admin Dispatch Notes (Optional)
                </label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="e.g. Fuel allowance handed over, customer pickup delayed 15 mins..."
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-purple-600 focus:bg-white transition"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setStatusModalBooking(null)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingStatus}
                  className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-md shadow-purple-600/30 transition disabled:opacity-50 cursor-pointer"
                >
                  {updatingStatus ? "Saving..." : "Update Status"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
