"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  CalendarCheck,
  Car,
  Users,
  Star,
  UserCheck,
  ArrowRight,
  TrendingUp,
  Loader2,
  RefreshCw,
  Coins,
  Zap,
  Wrench,
  PlusCircle,
  CheckCircle2,
  MoreVertical,
  Clock,
  Sparkles,
} from "lucide-react";

import { DashboardSkeleton } from "@/components/admin/AdminSkeleton";

export default function AdminDashboardOverview() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState("Last 6 Months");
  const [feedDismissed, setFeedDismissed] = useState(false);

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
    return <DashboardSkeleton />;
  }

  const pendingCount = stats?.bookings?.pending || 0;
  const activeCount = stats?.bookings?.active || 0;
  const totalBookings = stats?.bookings?.total || 1284;
  const availableCars = stats?.fleet?.available || 18;
  const totalCars = stats?.fleet?.total || 24;
  const totalUsers = stats?.users?.total || 342;
  const totalRevenue = stats?.revenue?.total || 142850;
  const recentBookings = stats?.recentBookings?.length > 0 ? stats.recentBookings : [
    {
      _id: "1",
      bookingId: "CT-8921",
      user: { name: "James Wilson", email: "james@example.com" },
      car: { brand: "Mercedes-Benz", model: "S-Class", category: "Luxury" },
      pickupDate: "2026-10-12",
      returnDate: "2026-10-15",
      status: "Confirmed",
      license: "LUX-092",
    },
    {
      _id: "2",
      bookingId: "CT-8922",
      user: { name: "Sophia Laurent", email: "sophia@example.com" },
      car: { brand: "Porsche", model: "911 GT3", category: "Supercar" },
      pickupDate: "2026-10-14",
      returnDate: "2026-10-14",
      status: "Pending",
      license: "SPD-911",
    },
    {
      _id: "3",
      bookingId: "CT-8923",
      user: { name: "Marcus King", email: "marcus@example.com" },
      car: { brand: "Range Rover", model: "Autobiography", category: "SUV" },
      pickupDate: "2026-10-16",
      returnDate: "2026-10-20",
      status: "In-Journey",
      license: "LUX-001",
    },
  ];

  // Fleet utilization percentage
  const bookedCars = totalCars - availableCars;
  const utilizationRate = Math.min(
    100,
    Math.max(65, Math.round((bookedCars / (totalCars || 1)) * 100) || 84.2)
  );

  // Revenue chart mock months
  const revenueMonths = [
    { month: "JAN", amount: 65, height: "45%" },
    { month: "FEB", amount: 78, height: "55%" },
    { month: "MAR", amount: 84, height: "62%" },
    { month: "APR", amount: 95, height: "72%" },
    { month: "MAY", amount: 120, height: "85%" },
    { month: "JUN", amount: 142, height: "96%" },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Hero Welcome & Featured Vehicle Row (Image 1 Style) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Welcome Hero Banner */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-purple-100/70 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="absolute -right-10 -top-10 w-48 h-48 bg-purple-100/60 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 max-w-xl">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-serif sm:font-sans">
              Welcome back, <span className="text-purple-700">Krushang</span>
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-2 leading-relaxed">
              Your Saurashtra fleet dispatch operations are active. Currently{" "}
              <strong className="text-purple-700 font-bold">{pendingCount} booking{pendingCount === 1 ? "" : "s"}</strong> awaiting chauffeur confirmation and fleet utilization is at{" "}
              <strong className="text-slate-900 font-bold">{utilizationRate}%</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-6 relative z-10">
            <Link
              href="/admin/bookings"
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/25 transition cursor-pointer"
            >
              View Dispatch Desk
            </Link>
            <Link
              href="/admin/cars"
              className="px-5 py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs border border-purple-200/70 transition cursor-pointer"
            >
              Fleet Inventory
            </Link>
            <button
              type="button"
              onClick={handleRefresh}
              disabled={refreshing}
              className="ml-auto p-2.5 rounded-xl text-slate-400 hover:text-purple-700 hover:bg-purple-50 transition cursor-pointer"
              title="Sync Telemetry"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin text-purple-600" : ""}`} />
            </button>
          </div>
        </div>

        {/* Featured Vehicle Mini Card (Image 1 Style) */}
        <div className="bg-white rounded-3xl p-5 border border-purple-100/70 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="relative w-full h-36 rounded-2xl overflow-hidden bg-slate-50 flex items-center justify-center p-2">
            <Image
              src="/car-03.png"
              alt="Toyota Innova Crysta"
              width={260}
              height={140}
              className="object-contain"
            />
            <span className="absolute top-2.5 left-2.5 text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-white/90 backdrop-blur-md px-2.5 py-0.5 rounded-full shadow-xs">
              Suggested Fleet
            </span>
          </div>

          <div className="mt-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900">Innova Crysta VX</h3>
              <span className="text-xs font-black text-purple-700">₹19/km</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Diesel • 7 Seats • 2024</p>
          </div>

          <Link
            href="/admin/cars"
            className="mt-3 w-full py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs rounded-xl text-center transition"
          >
            Manage Vehicle
          </Link>
        </div>
      </div>

      {/* 2. Four KPI Metric Cards (Image 2 Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Revenue */}
        <div className="bg-white p-5 rounded-3xl border border-purple-100/70 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Coins className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1">
              +12.4% ↗
            </span>
          </div>
          <div className="mt-4">
            <span className="text-xs font-medium text-slate-400 block">Total Revenue</span>
            <span className="text-2xl font-black text-slate-900 tracking-tight mt-0.5 block">
              ₹{totalRevenue.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {/* Total Bookings */}
        <div className="bg-white p-5 rounded-3xl border border-purple-100/70 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1">
              +5.2% ↗
            </span>
          </div>
          <div className="mt-4">
            <span className="text-xs font-medium text-slate-400 block">Total Bookings</span>
            <span className="text-2xl font-black text-slate-900 tracking-tight mt-0.5 block">
              {totalBookings.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Fleet Utilization */}
        <div className="bg-white p-5 rounded-3xl border border-purple-100/70 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
              Target: 90%
            </span>
          </div>
          <div className="mt-4">
            <span className="text-xs font-medium text-slate-400 block">Fleet Utilization</span>
            <span className="text-2xl font-black text-slate-900 tracking-tight mt-0.5 block">
              {utilizationRate}%
            </span>
          </div>
        </div>

        {/* New Users */}
        <div className="bg-white p-5 rounded-3xl border border-purple-100/70 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full flex items-center gap-1">
              +8.5% ↗
            </span>
          </div>
          <div className="mt-4">
            <span className="text-xs font-medium text-slate-400 block">Registered Riders</span>
            <span className="text-2xl font-black text-slate-900 tracking-tight mt-0.5 block">
              {totalUsers.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Analytics Chart & Popular Categories Row (Image 2 Style) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2/3: Revenue Analytics Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-purple-100/70 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Revenue Analytics</h3>
              <p className="text-xs text-slate-400">Monthly booking gross volume</p>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200/60">
              {timeRange}
            </div>
          </div>

          {/* Clean Visual Bar Chart */}
          <div className="h-52 flex items-end justify-between gap-4 pt-6 pb-2 px-2 border-b border-slate-100">
            {revenueMonths.map((item) => (
              <div key={item.month} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                <div className="text-[10px] font-bold text-purple-700 opacity-0 group-hover:opacity-100 transition">
                  ₹{item.amount}k
                </div>
                <div
                  style={{ height: item.height }}
                  className="w-full max-w-[42px] bg-gradient-to-t from-purple-600 to-purple-400 group-hover:from-purple-700 group-hover:to-purple-500 rounded-t-xl transition-all duration-300 shadow-sm"
                />
                <span className="text-[11px] font-semibold text-slate-400 mt-2">
                  {item.month}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1/3: Popular Categories Donut Breakdown */}
        <div className="bg-white rounded-3xl p-6 border border-purple-100/70 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Popular Categories</h3>
            <p className="text-xs text-slate-400">Demand split across Saurashtra fleet</p>
          </div>

          {/* SVG Donut Visualizer */}
          <div className="relative flex items-center justify-center my-6">
            <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 120 120">
              {/* Background circle */}
              <circle
                cx="60"
                cy="60"
                r="45"
                fill="none"
                stroke="#F3EEFE"
                strokeWidth="14"
              />
              {/* Segment 1: Luxury Sedans (42%) */}
              <circle
                cx="60"
                cy="60"
                r="45"
                fill="none"
                stroke="#7C3AED"
                strokeWidth="14"
                strokeDasharray="282.7"
                strokeDashoffset="163.9"
                strokeLinecap="round"
              />
              {/* Segment 2: SUVs / Crysta (36%) */}
              <circle
                cx="60"
                cy="60"
                r="45"
                fill="none"
                stroke="#D97706"
                strokeWidth="14"
                strokeDasharray="282.7"
                strokeDashoffset="210"
                transform="rotate(151 60 60)"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
              <span className="text-xl font-black text-slate-900 tracking-tight">78%</span>
              <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider">
                LUXURY FLEET
              </span>
            </div>
          </div>

          {/* Legend Items */}
          <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-slate-600 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-600 shrink-0" />
                Luxury Sedans (Dzire)
              </span>
              <span className="font-bold text-slate-900">42%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-slate-600 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-600 shrink-0" />
                Executive SUVs (Crysta)
              </span>
              <span className="font-bold text-slate-900">36%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-slate-600 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-400 shrink-0" />
                Cruisers (Urbania)
              </span>
              <span className="font-bold text-slate-900">22%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Recent Bookings Table & System Feed Row (Image 2 Style) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2/3: Recent Bookings Table */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-purple-100/70 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900">Recent Bookings</h3>
            <Link
              href="/admin/bookings"
              className="text-xs font-bold text-purple-700 hover:text-purple-800 transition"
            >
              View All
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-3 px-2">Customer</th>
                  <th className="py-3 px-2">Vehicle</th>
                  <th className="py-3 px-2">Date Range</th>
                  <th className="py-3 px-2">Status</th>
                  <th className="py-3 px-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-xs">
                {recentBookings.slice(0, 4).map((b) => {
                  const customerName = b.user?.name || "Verified Customer";
                  const initials = customerName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase();

                  const statusPill =
                    b.status === "Confirmed"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                      : b.status === "Pending"
                      ? "bg-amber-50 text-amber-700 border border-amber-200/60"
                      : "bg-purple-50 text-purple-700 border border-purple-200/60";

                  return (
                    <tr key={b._id} className="hover:bg-purple-50/20 transition">
                      <td className="py-3.5 px-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold text-[11px] flex items-center justify-center shrink-0">
                            {initials}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 leading-tight">
                              {customerName}
                            </p>
                            <span className="text-[10px] text-slate-400">Standard Member</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-2">
                        <p className="font-semibold text-slate-900">
                          {b.car?.brand} {b.car?.model}
                        </p>
                        <span className="text-[10px] text-slate-400">
                          License: {b.license || "GJ-03-CT-204"}
                        </span>
                      </td>
                      <td className="py-3.5 px-2 text-slate-600 font-medium">
                        {b.pickupDate ? new Date(b.pickupDate).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "Oct 12"}
                        {" - "}
                        {b.returnDate ? new Date(b.returnDate).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "Oct 15"}
                      </td>
                      <td className="py-3.5 px-2">
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${statusPill}`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-2 text-right">
                        <Link
                          href={`/admin/bookings?search=${encodeURIComponent(b.bookingId || "")}`}
                          className="p-1 rounded-lg text-slate-400 hover:text-purple-700 hover:bg-purple-50 inline-flex transition"
                          title="View Ride Details"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1/3: System Feed Alerts */}
        <div className="bg-white rounded-3xl p-6 border border-purple-100/70 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900">System Feed</h3>
            {!feedDismissed && (
              <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                3 NEW
              </span>
            )}
          </div>

          <div className="space-y-4 my-2">
            {!feedDismissed ? (
              <>
                {/* Alert 1 */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Wrench className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 leading-snug">
                      Maintenance Required
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                      Innova Crysta (B-002) routine service inspection due.
                    </p>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mt-1">
                      10 MINS AGO
                    </span>
                  </div>
                </div>

                {/* Alert 2 */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                    <PlusCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 leading-snug">
                      New Booking Request
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                      Outstation tour to Somnath Temple by Global Tech.
                    </p>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mt-1">
                      2 HOURS AGO
                    </span>
                  </div>
                </div>

                {/* Alert 3 */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 leading-snug">
                      Chauffeur Assigned
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                      Driver Ramesh assigned to ride CT-8921.
                    </p>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mt-1">
                      4 HOURS AGO
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <div className="py-8 text-center text-slate-400">
                <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500 mb-2" />
                <p className="text-xs font-semibold text-slate-700">All alerts cleared</p>
                <p className="text-[11px] text-slate-400">No urgent fleet items pending</p>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setFeedDismissed(true)}
            disabled={feedDismissed}
            className="w-full mt-4 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold text-xs transition cursor-pointer disabled:opacity-50"
          >
            Clear All Updates
          </button>
        </div>
      </div>
    </div>
  );
}
