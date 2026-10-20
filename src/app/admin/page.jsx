"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  CalendarCheck,
  Car,
  Coins,
  Users,
  Star,
  UserCheck,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  Clock,
  Compass,
  Loader2,
  RefreshCw,
  CheckCircle2,
  MapPin,
  FileText,
} from "lucide-react";

export default function AdminDashboardOverview() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (err) {
      console.error("[Fetch Admin Stats Error]", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const res = await fetch("/api/admin/stats");
        const data = await res.json();
        if (!ignore && data.success) {
          setStats(data.stats);
        }
      } catch (err) {
        console.error("[Fetch Admin Stats Error]", err);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, []);

  function handleRefresh() {
    setRefreshing(true);
    fetchStats();
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600 mb-2" />
        <p className="text-xs font-semibold">Aggregating live dispatch telemetry...</p>
      </div>
    );
  }

  const pendingCount = stats?.bookings?.pending || 0;
  const activeCount = stats?.bookings?.active || 0;
  const totalBookings = stats?.bookings?.total || 0;
  const availableCars = stats?.fleet?.available || 0;
  const totalCars = stats?.fleet?.total || 0;
  const totalRevenue = stats?.revenue?.total || 0;
  const averageRating = stats?.reviews?.averageRating || 5.0;
  const totalReviews = stats?.reviews?.total || 0;
  const availableDrivers = stats?.drivers?.available || 0;
  const totalDrivers = stats?.drivers?.total || 0;
  const recentBookings = stats?.recentBookings || [];

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
              Saurashtra Hub
            </span>
            <span className="text-xs text-slate-400">• Rajkot Operations</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Dispatch Command Center
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time fleet occupancy, driver allocation, and pending bookings
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-purple-600" : ""}`} />
            <span>Sync Stats</span>
          </button>
          <Link
            href="/admin/bookings"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-md shadow-purple-600/30 transition cursor-pointer"
          >
            <span>Live Dispatch</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Urgent Pending Rides Alert (if any) */}
      {pendingCount > 0 && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-amber-900">
                {pendingCount} Pending Booking{pendingCount > 1 ? "s" : ""} Require Dispatch Action
              </p>
              <p className="text-[11px] text-amber-700">
                Customers are awaiting chauffeur assignment and confirmation.
              </p>
            </div>
          </div>
          <Link
            href="/admin/bookings?status=Pending"
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition shadow-xs"
          >
            <span>Resolve Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* Total Bookings */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Bookings</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">{totalBookings}</div>
          <div className="flex items-center gap-2 mt-2 text-[11px]">
            <span className="font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
              {pendingCount} Pending
            </span>
            <span className="text-slate-400">• {activeCount} Active</span>
          </div>
        </div>

        {/* Fleet Availability */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Fleet Status</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Car className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            {availableCars} <span className="text-xs font-normal text-slate-400">/ {totalCars}</span>
          </div>
          <div className="flex items-center gap-2 mt-2 text-[11px]">
            <span className="font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
              {availableCars} Available
            </span>
            <span className="text-slate-400">• {totalCars - availableCars} On-Road</span>
          </div>
        </div>

        {/* Chauffeurs */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Chauffeurs</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            {availableDrivers} <span className="text-xs font-normal text-slate-400">/ {totalDrivers}</span>
          </div>
          <div className="flex items-center gap-2 mt-2 text-[11px]">
            <span className="font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
              {availableDrivers} On Duty
            </span>
            <span className="text-slate-400">• {totalDrivers - availableDrivers} On Trip</span>
          </div>
        </div>

        {/* Customer Rating */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Rating & Reviews</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
              <Star className="w-4 h-4 fill-amber-400" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight flex items-baseline gap-1.5">
            <span>{averageRating}</span>
            <span className="text-xs font-normal text-slate-400">★ avg</span>
          </div>
          <div className="flex items-center gap-2 mt-2 text-[11px]">
            <span className="font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
              {totalReviews} Verified Reviews
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Bookings & Fleet Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Live Dispatch Feed */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Recent Dispatch Activity</h2>
              <p className="text-xs text-slate-500">Latest customer ride requests and live statuses</p>
            </div>
            <Link
              href="/admin/bookings"
              className="text-xs font-semibold text-purple-600 hover:text-purple-700 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentBookings.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <CalendarCheck className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p className="text-xs font-medium">No bookings placed yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentBookings.map((b) => {
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
                  <div
                    key={b._id}
                    className="p-3.5 rounded-xl border border-slate-100 hover:border-purple-200 hover:bg-purple-50/20 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <strong className="text-xs font-bold text-purple-700">
                          {b.bookingId || "CT-RIDE"}
                        </strong>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${colorClass}`}>
                          {b.status}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {b.createdAt ? new Date(b.createdAt).toLocaleDateString() : ""}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-900 truncate">
                        {b.user?.name || "Customer"} • {b.car?.brand} {b.car?.model}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{b.pickupAddress} ➔ {b.destinationAddress}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <Link
                        href={`/admin/bookings?search=${encodeURIComponent(b.bookingId)}`}
                        className="px-3 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-semibold transition"
                      >
                        Manage
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right 1 Col: Quick Control Desk & Fleet Readiness */}
        <div className="space-y-6">
          {/* Quick Actions Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-1">Fleet Operations</h3>
            <p className="text-[11px] text-slate-500 mb-4">Direct shortcuts to control desks</p>

            <div className="space-y-2">
              <Link
                href="/admin/cars"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-purple-50 hover:text-purple-700 transition group text-xs font-semibold text-slate-700"
              >
                <div className="flex items-center gap-2.5">
                  <Car className="w-4 h-4 text-purple-600" />
                  <span>Manage Fleet Inventory</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition" />
              </Link>

              <Link
                href="/admin/drivers"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-purple-50 hover:text-purple-700 transition group text-xs font-semibold text-slate-700"
              >
                <div className="flex items-center gap-2.5">
                  <UserCheck className="w-4 h-4 text-purple-600" />
                  <span>Register Chauffeur</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition" />
              </Link>

              <Link
                href="/admin/users"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-purple-50 hover:text-purple-700 transition group text-xs font-semibold text-slate-700"
              >
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 text-purple-600" />
                  <span>User Directory</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition" />
              </Link>

              <Link
                href="/admin/reviews"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-purple-50 hover:text-purple-700 transition group text-xs font-semibold text-slate-700"
              >
                <div className="flex items-center gap-2.5">
                  <Star className="w-4 h-4 text-purple-600" />
                  <span>Moderate Reviews</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition" />
              </Link>
            </div>
          </div>

          {/* Operational Policy Badge */}
          <div className="p-4 rounded-2xl bg-gradient-to-tr from-purple-900 to-indigo-950 text-white shadow-md shadow-purple-950/20">
            <div className="flex items-center gap-2 text-purple-300 text-xs font-bold uppercase tracking-wider mb-2">
              <Compass className="w-4 h-4 text-purple-400" />
              <span>Saurashtra Policy</span>
            </div>
            <p className="text-xs text-purple-100 leading-relaxed">
              Standard outstation base billing is 350 km/day. All driver assignments must be confirmed prior to passenger pickup time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
