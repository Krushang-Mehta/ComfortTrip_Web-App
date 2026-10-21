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
  Calendar,
  IndianRupee,
  Navigation,
} from "lucide-react";
import CustomDropdown from "@/components/common/CustomDropdown";
import { TableSkeleton } from "@/components/admin/AdminSkeleton";

const statuses = [
  "All",
  "Pending",
  "Confirmed",
  "Driver-Assigned",
  "In-Journey",
  "Completed",
  "Cancelled",
];

const bookingStatusOptions = [
  { value: "Pending", label: "Pending", subtitle: "Awaiting chauffeur assignment" },
  { value: "Confirmed", label: "Confirmed", subtitle: "Chauffeur & vehicle confirmed" },
  { value: "Driver-Assigned", label: "Driver-Assigned", subtitle: "Driver allocated to ride" },
  { value: "In-Journey", label: "In-Journey", subtitle: "Active on-road journey" },
  { value: "Completed", label: "Completed", subtitle: "Trip successfully finished" },
  { value: "Cancelled", label: "Cancelled", subtitle: "Trip cancelled" },
];

const statusColors = {
  Pending: "bg-amber-50 text-amber-700 border-amber-200",
  Confirmed: "bg-blue-50 text-blue-700 border-blue-200",
  "Driver-Assigned": "bg-purple-50 text-purple-700 border-purple-200",
  "In-Journey": "bg-indigo-50 text-indigo-700 border-indigo-200",
  Completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Cancelled: "bg-rose-50 text-rose-700 border-rose-200",
};

export default function AdminBookingsDesk() {
  return (
    <Suspense fallback={<TableSkeleton rows={6} />}>
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

  // Status & Dynamic Fare Change Modal State
  const [statusModalBooking, setStatusModalBooking] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [adjustedAmount, setAdjustedAmount] = useState("");
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

  // Open Assign Modal
  async function openAssignModal(booking) {
    setAssignModalBooking(booking);
    setSelectedDriverId(booking.assignedDriver?.driverId || "");
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

  // Open Status & Dynamic Amount Adjustment Modal
  function openStatusModal(booking) {
    setStatusModalBooking(booking);
    setNewStatus(booking.status || "Confirmed");
    setAdminNotes(booking.adminNotes || "");
    setAdjustedAmount(String(booking.totalEstimatedAmount || ""));
  }

  // Handle Status & Amount Update
  async function handleUpdateStatus(e) {
    e.preventDefault();
    if (!statusModalBooking || !newStatus) return;

    try {
      setUpdatingStatus(true);
      const payload = {
        status: newStatus,
        adminNotes,
      };

      if (adjustedAmount && Number(adjustedAmount) > 0) {
        payload.totalEstimatedAmount = Number(adjustedAmount);
      }

      const res = await fetch(`/api/bookings/${statusModalBooking._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setAlertMessage({
          type: "success",
          text: `Booking ${statusModalBooking.bookingId} updated to ${newStatus}${
            payload.totalEstimatedAmount ? ` with invoice amount ₹${payload.totalEstimatedAmount}` : ""
          }`,
        });
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
      <div className="bg-white p-5 rounded-3xl border border-purple-100/70 shadow-sm space-y-4">
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
          <span className="self-start sm:self-auto text-xs font-bold px-3 py-1 bg-purple-50 text-purple-700 rounded-full border border-purple-200 shadow-xs">
            {total} Total Bookings
          </span>
        </div>

        {/* Filter Pills & Search */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-3 border-t border-slate-100">
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
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                    active
                      ? "bg-purple-600 text-white shadow-md shadow-purple-600/25"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                  }`}
                >
                  {st}
                </button>
              );
            })}
          </div>

          <div className="relative w-full lg:w-72 shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search by customer, city, ID..."
              className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-purple-600 focus:bg-white transition"
            />
          </div>
        </div>
      </div>

      {/* Bookings Content */}
      {loading ? (
        <TableSkeleton rows={6} />
      ) : bookings.length === 0 ? (
        <div className="text-center py-20 text-slate-400 bg-white rounded-3xl border border-purple-100/70 shadow-sm">
          <CalendarCheck className="w-10 h-10 mx-auto mb-2 text-slate-300" />
          <p className="text-xs font-semibold text-slate-600">No bookings found</p>
          <p className="text-[11px] text-slate-400 mt-1">
            {searchQuery ? "Try refining your search query." : "No records match this status."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* 1. Mobile & Small Tablet Card View (Screen sizes < lg) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden">
            {bookings.map((b) => {
              const colorClass = statusColors[b.status] || "bg-slate-50 text-slate-700 border-slate-200";
              const customerName = b.user?.name || "Customer";
              const initials = customerName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();

              return (
                <div
                  key={b._id}
                  className="bg-white rounded-3xl border border-purple-100/70 p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  {/* Card Header: Booking ID, Date, Status */}
                  <div className="flex items-start justify-between gap-2 border-b border-slate-50 pb-3">
                    <div>
                      <span className="font-extrabold text-purple-700 text-sm block">
                        {b.bookingId || "CT-RIDE"}
                      </span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3" />
                        {b.createdAt ? new Date(b.createdAt).toLocaleDateString() : ""}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => openStatusModal(b)}
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full border transition cursor-pointer hover:shadow-xs ${colorClass}`}
                      title="Click to update status and invoice amount"
                    >
                      {b.status} ▾
                    </button>
                  </div>

                  {/* Customer & Vehicle Info */}
                  <div className="my-3 space-y-2.5 text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold text-[11px] flex items-center justify-center shrink-0">
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 leading-tight truncate">
                          {customerName}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate">
                          {b.user?.phone || b.user?.email}
                        </p>
                      </div>
                    </div>

                    <div className="p-2.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-slate-800">
                          {b.car?.brand} {b.car?.model}
                        </span>
                        <span className="text-[9px] font-bold px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full">
                          {b.car?.category || "Vehicle"}
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-600 flex items-start gap-1.5 pt-1 border-t border-slate-200/60">
                        <MapPin className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                        <div className="min-w-0 truncate">
                          <span className="truncate block" title={b.pickupAddress}>{b.pickupAddress}</span>
                          <span className="text-slate-400 block truncate" title={b.destinationAddress}>➔ {b.destinationAddress}</span>
                        </div>
                      </div>

                      <div className="text-[10px] text-slate-500 flex items-center gap-1.5 pt-1">
                        <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>
                          {b.pickupDateTime ? new Date(b.pickupDateTime).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : "N/A"}
                        </span>
                      </div>
                    </div>

                    {/* Chauffeur Assignment */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="text-[11px] text-slate-600">
                        <span className="text-[10px] text-slate-400 block font-semibold">Chauffeur</span>
                        {b.assignedDriver?.name ? (
                          <span className="font-bold text-slate-900 flex items-center gap-1">
                            <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                            {b.assignedDriver.name}
                          </span>
                        ) : (
                          <span className="text-amber-600 font-semibold text-[10px]">Unassigned</span>
                        )}
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block font-semibold">Invoice Amount</span>
                        <span className="text-sm font-black text-purple-700">
                          ₹{(b.totalEstimatedAmount || 0).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom Action Buttons */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-50">
                    <button
                      type="button"
                      onClick={() => openAssignModal(b)}
                      className="flex-1 py-1.5 px-2 rounded-xl text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 transition text-center cursor-pointer"
                    >
                      {b.assignedDriver?.name ? "Reassign" : "Assign Driver"}
                    </button>

                    <button
                      type="button"
                      onClick={() => openStatusModal(b)}
                      className="py-1.5 px-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
                    >
                      Status / Fare
                    </button>

                    <a
                      href={`/api/bookings/${b._id}/invoice`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-slate-50 hover:bg-purple-50 text-slate-500 hover:text-purple-700 transition cursor-pointer"
                      title="Download Invoice"
                    >
                      <FileText className="w-4 h-4" />
                    </a>
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
                    <th className="py-3.5 px-4">Booking ID</th>
                    <th className="py-3.5 px-4">Customer</th>
                    <th className="py-3.5 px-4">Vehicle</th>
                    <th className="py-3.5 px-4">Pickup & Route</th>
                    <th className="py-3.5 px-4">Timing</th>
                    <th className="py-3.5 px-4">Chauffeur</th>
                    <th className="py-3.5 px-4">Invoice Amount</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {bookings.map((b) => {
                    const colorClass = statusColors[b.status] || "bg-slate-50 text-slate-700 border-slate-200";

                    return (
                      <tr key={b._id} className="hover:bg-purple-50/20 transition">
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

                        {/* Invoice Amount */}
                        <td className="py-3.5 px-4">
                          <span className="font-black text-purple-700 text-sm">
                            ₹{(b.totalEstimatedAmount || 0).toLocaleString('en-IN')}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4">
                          <button
                            type="button"
                            onClick={() => openStatusModal(b)}
                            className={`text-[10px] font-bold px-2.5 py-1 rounded-full border transition cursor-pointer hover:shadow-xs ${colorClass}`}
                            title="Click to update status and invoice amount"
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
                              className="p-1.5 rounded-lg text-slate-400 hover:text-purple-700 hover:bg-purple-50 transition cursor-pointer"
                            >
                              <UserCheck className="w-4 h-4" />
                            </button>
                            <a
                              href={`/api/bookings/${b._id}/invoice`}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Download PDF Invoice"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-purple-700 hover:bg-purple-50 transition cursor-pointer"
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
          </div>
        </div>
      )}

      {/* Pagination Bar */}
      {pages > 1 && (
        <div className="bg-white p-4 rounded-2xl border border-purple-100/70 shadow-sm flex items-center justify-between text-xs text-slate-500">
          <span>
            Page <strong>{page}</strong> of <strong>{pages}</strong> ({total} bookings)
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

      {/* Modal 1: Assign Chauffeur */}
      {assignModalBooking && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setAssignModalBooking(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-purple-100 p-6 animate-in zoom-in-95 duration-150"
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
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
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
                  <p className="text-xs text-amber-700 bg-amber-50 p-3 rounded-2xl border border-amber-200">
                    No chauffeurs currently marked &quot;Available&quot;. You can register new drivers in the Chauffeur Registry.
                  </p>
                ) : (
                  <div className="relative z-10">
                    <CustomDropdown
                      value={selectedDriverId}
                      onChange={(val) => setSelectedDriverId(val)}
                      options={availableDrivers.map((d) => ({
                        value: d._id,
                        label: d.fullName,
                        subtitle: `Ph: ${d.phone} • ${d.experienceYears}y exp • ${d.rating}★`,
                      }))}
                      placeholder="-- Select Chauffeur --"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAssignModalBooking(null)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
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

      {/* Modal 2: Change Status & Dynamic Invoice Amount Adjustment */}
      {statusModalBooking && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setStatusModalBooking(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-purple-100 p-6 animate-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Update Booking • {statusModalBooking.bookingId}
                </h3>
                <p className="text-[11px] text-slate-500">
                  Transition ride status and adjust final bill amount
                </p>
              </div>
              <button
                type="button"
                onClick={() => setStatusModalBooking(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateStatus} className="space-y-4">
              <div className="relative z-10">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Trip Status
                </label>
                <CustomDropdown
                  value={newStatus}
                  onChange={(val) => setNewStatus(val)}
                  options={bookingStatusOptions}
                  placeholder="Select Trip Status"
                />
              </div>

              {/* Dynamic Invoice Amount Field */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Final Invoice Amount (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-xs text-slate-400 font-bold">₹</span>
                  <input
                    type="number"
                    min={100}
                    value={adjustedAmount}
                    onChange={(e) => setAdjustedAmount(e.target.value)}
                    placeholder="e.g. 4500"
                    className="w-full pl-8 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white focus:ring-2 focus:ring-purple-100 transition"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Adjust before accepting/confirming trip. The updated fare dynamically reflects on the rider portal & PDF tax invoice.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Admin Dispatch Notes (Optional)
                </label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="e.g. Rate negotiated for Saurashtra tour, luggage carrier verified..."
                  rows={2}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-purple-600 focus:bg-white transition"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setStatusModalBooking(null)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingStatus}
                  className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-md shadow-purple-600/30 transition disabled:opacity-50 cursor-pointer"
                >
                  {updatingStatus ? "Saving..." : "Update Status & Fare"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
