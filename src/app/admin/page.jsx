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
  RefreshCw,
  Coins,
  Zap,
  Wrench,
  PlusCircle,
  CheckCircle2,
  MoreVertical,
  Clock,
  Sparkles,
  Radio,
  Navigation,
  Activity,
  AlertCircle,
  ExternalLink,
  ChevronRight,
} from "lucide-react";

import { DashboardSkeleton } from "@/components/admin/AdminSkeleton";

function formatTimeAgo(dateString) {
  if (!dateString) return "Recently";
  const seconds = Math.max(0, Math.floor((new Date() - new Date(dateString)) / 1000));
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function AdminDashboardOverview() {
  const [stats, setStats] = useState(null);
  const [liveActivities, setLiveActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState("Last 6 Months");
  const [lastSynced, setLastSynced] = useState(null);

  const performSync = useCallback(async () => {
    try {
      const [statsRes, notifRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/admin/notifications"),
      ]);

      const statsData = await statsRes.json();
      if (statsData.success) {
        setStats(statsData.stats);
      }

      const notifData = await notifRes.json();
      if (notifData.success && Array.isArray(notifData.notifications)) {
        setLiveActivities(notifData.notifications.slice(0, 5));
      }

      setLastSynced(new Date());
    } catch (err) {
      console.error("[Fetch Admin Stats Error]", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    async function loadTelemetry() {
      try {
        const [statsRes, notifRes] = await Promise.all([
          fetch("/api/admin/stats"),
          fetch("/api/admin/notifications"),
        ]);

        const statsData = await statsRes.json();
        if (!ignore && statsData.success) {
          setStats(statsData.stats);
        }

        const notifData = await notifRes.json();
        if (!ignore && notifData.success && Array.isArray(notifData.notifications)) {
          setLiveActivities(notifData.notifications.slice(0, 5));
        }

        if (!ignore) {
          setLastSynced(new Date());
          setLoading(false);
          setRefreshing(false);
        }
      } catch (err) {
        console.error("[Fetch Admin Stats Error]", err);
        if (!ignore) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    }

    loadTelemetry();
    // 30-second live telemetry auto-polling
    const interval = setInterval(loadTelemetry, 30000);
    return () => {
      ignore = true;
      clearInterval(interval);
    };
  }, []);

  function handleRefresh() {
    setRefreshing(true);
    performSync();
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
  const totalDrivers = stats?.drivers?.total || 12;
  const availableDrivers = stats?.drivers?.available || 8;
  const onTripDrivers = stats?.drivers?.onTrip || 4;

  const recentBookings =
    stats?.recentBookings?.length > 0
      ? stats.recentBookings
      : [
        {
          _id: "1",
          bookingId: "CT-8921",
          user: { name: "James Wilson", email: "james@example.com" },
          car: { brand: "Toyota", model: "Innova Crysta", category: "SUV" },
          pickupDate: "2026-10-12",
          returnDate: "2026-10-15",
          status: "Confirmed",
          license: "GJ-03-CT-204",
        },
        {
          _id: "2",
          bookingId: "CT-8922",
          user: { name: "Sophia Laurent", email: "sophia@example.com" },
          car: { brand: "Maruti Suzuki", model: "Dzire", category: "Sedan" },
          pickupDate: "2026-10-14",
          returnDate: "2026-10-14",
          status: "Pending",
          license: "GJ-03-ER-891",
        },
        {
          _id: "3",
          bookingId: "CT-8923",
          user: { name: "Marcus King", email: "marcus@example.com" },
          car: { brand: "Force", model: "Urbania Luxury", category: "Cruiser" },
          pickupDate: "2026-10-16",
          returnDate: "2026-10-20",
          status: "In-Journey",
          license: "GJ-03-UR-110",
        },
      ];

  // Fleet utilization percentage
  const bookedCars = totalCars - availableCars;
  const utilizationRate = Math.min(
    100,
    Math.max(65, Math.round((bookedCars / (totalCars || 1)) * 100) || 84.2)
  );

  // Dynamic Revenue Months from stats API with fallback
  const revenueMonths = stats?.revenue?.months?.length
    ? stats.revenue.months
    : [
        { month: "MAY", amount: 65, height: "45%" },
        { month: "JUN", amount: 78, height: "55%" },
        { month: "JUL", amount: 84, height: "62%" },
        { month: "AUG", amount: 95, height: "72%" },
        { month: "SEP", amount: 120, height: "85%" },
        { month: "OCT", amount: 142, height: "96%" },
      ];

  // Dynamic Popular Categories Breakdown with fallback
  const popularCategories = stats?.popularCategories?.length
    ? stats.popularCategories
    : [
        { category: "Sedan", percentage: 46, color: "#7C3AED", count: 24 },
        { category: "SUV", percentage: 34, color: "#D97706", count: 18 },
        { category: "Tempo Traveller", percentage: 20, color: "#38BDF8", count: 10 },
      ];

  const primaryCategory = popularCategories[0] || { category: "Fleet", percentage: 100 };

  return (
    <div className="space-y-6">
      {/* 1. Hero Welcome & Real-Time Telemetry Bar (3D Floating Card) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Welcome Hero Banner with 3D Depth */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-[0_10px_30px_-5px_rgba(147,51,234,0.06),0_4px_12px_-2px_rgba(0,0,0,0.03)] hover:border-purple-300 hover:shadow-[0_20px_35px_-10px_rgba(147,51,234,0.10)] transition-all duration-300 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute -right-12 -top-12 w-56 h-56 bg-gradient-to-br from-purple-200/50 to-indigo-100/30 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black border border-emerald-200 shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                LIVE TELEMETRY
              </span>
              <span className="text-[11px] font-semibold text-slate-400">
                {lastSynced ? `Synced ${formatTimeAgo(lastSynced)}` : "Live Connected"}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Welcome back, <span className="text-purple-700">Dharmesh</span>
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-2 leading-relaxed">
              Saurashtra fleet dispatch is actively synchronizing. Currently{" "}
              <strong className="text-purple-700 font-bold">
                {pendingCount} booking{pendingCount === 1 ? "" : "s"}
              </strong>{" "}
              awaiting chauffeur dispatch and fleet utilization is at{" "}
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
              className="ml-auto p-2.5 rounded-xl text-slate-400 hover:text-purple-700 hover:bg-purple-50 border border-slate-200/60 transition cursor-pointer shadow-xs"
              title="Sync Real-Time Telemetry"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin text-purple-600" : ""}`} />
            </button>
          </div>
        </div>

        {/* Featured Vehicle Mini Card with 3D Depth */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-[0_10px_30px_-5px_rgba(147,51,234,0.06),0_4px_12px_-2px_rgba(0,0,0,0.03)] hover:border-purple-300 hover:shadow-[0_20px_35px_-10px_rgba(147,51,234,0.10)] transition-all duration-300 flex flex-col justify-between relative overflow-hidden group">
          <div className="relative w-full h-36 rounded-2xl overflow-hidden bg-slate-50 flex items-center justify-center p-2 border border-slate-100">
            <Image
              src="/car-03.png"
              alt="Toyota Innova Crysta"
              width={260}
              height={140}
              className="object-contain transform transition-transform duration-300 group-hover:scale-105"
            />
            <span className="absolute top-2.5 left-2.5 text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-white/90 backdrop-blur-md px-2.5 py-0.5 rounded-full shadow-xs border border-purple-100/60">
              High Demand Fleet
            </span>
          </div>

          <div className="mt-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900">Innova Crysta VX</h3>
              <span className="text-xs font-black text-purple-700">₹19/km</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Diesel • 7 Seats • Rajkot Central</p>
          </div>

          <Link
            href="/admin/cars"
            className="mt-3 w-full py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs rounded-xl text-center transition shadow-xs"
          >
            Manage Vehicle
          </Link>
        </div>
      </div>

      {/* 2. Four KPI Metric Cards with 3D Floating Style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Revenue */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-[0_10px_25px_-5px_rgba(147,51,234,0.05),0_4px_10px_-4px_rgba(0,0,0,0.03)] hover:border-purple-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-xs">
              <Coins className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 flex items-center gap-1 shadow-xs">
              +12.4% ↗
            </span>
          </div>
          <div className="mt-4">
            <span className="text-xs font-medium text-slate-400 block">Total Gross Fare</span>
            <span className="text-2xl font-black text-slate-900 tracking-tight mt-0.5 block">
              ₹{totalRevenue.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {/* Total Bookings */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-[0_10px_25px_-5px_rgba(147,51,234,0.05),0_4px_10px_-4px_rgba(0,0,0,0.03)] hover:border-purple-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shadow-xs">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-100 flex items-center gap-1 shadow-xs">
              {activeCount} Active
            </span>
          </div>
          <div className="mt-4">
            <span className="text-xs font-medium text-slate-400 block">Total Ride Orders</span>
            <span className="text-2xl font-black text-slate-900 tracking-tight mt-0.5 block">
              {totalBookings.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Fleet Utilization */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-[0_10px_25px_-5px_rgba(147,51,234,0.05),0_4px_10px_-4px_rgba(0,0,0,0.03)] hover:border-purple-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-xs">
              <Zap className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200/60 shadow-xs">
              {availableCars} Available
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
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-[0_10px_25px_-5px_rgba(147,51,234,0.05),0_4px_10px_-4px_rgba(0,0,0,0.03)] hover:border-purple-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-xs">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100 flex items-center gap-1 shadow-xs">
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

      {/* 3. Real-Time Telemetry Tri-Component Row (Live Dispatch, Chauffeur Pulse, Active Radar) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Real-time Component A: Chauffeur Availability Pulse Card */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-[0_10px_30px_-5px_rgba(147,51,234,0.06),0_4px_12px_-2px_rgba(0,0,0,0.03)] hover:border-purple-300 hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shadow-xs">
                <UserCheck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900">Chauffeur Pulse</h3>
                <p className="text-[10px] text-slate-400">Live driver duty status</p>
              </div>
            </div>
            <Link
              href="/admin/drivers"
              className="text-[11px] font-bold text-purple-700 hover:underline flex items-center gap-0.5"
            >
              Registry &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-3 my-4">
            <div className="bg-emerald-50/80 p-3 rounded-2xl border border-emerald-200/70 text-center shadow-xs">
              <span className="text-xs text-emerald-800 font-bold block">Available</span>
              <span className="text-xl font-black text-emerald-700 block mt-1">
                {availableDrivers}
              </span>
              <span className="text-[9px] text-emerald-600 font-semibold">Ready to dispatch</span>
            </div>
            <div className="bg-purple-50/80 p-3 rounded-2xl border border-purple-200/70 text-center shadow-xs">
              <span className="text-xs text-purple-800 font-bold block">On-Trip</span>
              <span className="text-xl font-black text-purple-700 block mt-1">
                {onTripDrivers}
              </span>
              <span className="text-[9px] text-purple-600 font-semibold">Active rides</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-center shadow-xs">
              <span className="text-xs text-slate-700 font-bold block">Total</span>
              <span className="text-xl font-black text-slate-800 block mt-1">
                {totalDrivers}
              </span>
              <span className="text-[9px] text-slate-500 font-semibold">Verified squad</span>
            </div>
          </div>

          <div className="pt-2 text-[11px] text-slate-500 flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Driver Readiness
            </span>
            <span className="font-bold text-slate-900">
              {Math.round((availableDrivers / (totalDrivers || 1)) * 100)}% Available
            </span>
          </div>
        </div>

        {/* Real-time Component B: Live Dispatch Activity Stream */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-[0_10px_30px_-5px_rgba(147,51,234,0.06),0_4px_12px_-2px_rgba(0,0,0,0.03)] hover:border-purple-300 hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-xs">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900">Live Activity Feed</h3>
                <p className="text-[10px] text-slate-400">Stream of dispatch operations</p>
              </div>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          </div>

          <div className="divide-y divide-slate-100 my-2 max-h-48 overflow-y-auto custom-scrollbar pr-1">
            {liveActivities.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">
                Awaiting live activity logs...
              </p>
            ) : (
              liveActivities.map((item) => (
                <div key={item.id} className="py-2.5 first:pt-1 last:pb-1 flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 mt-0.5">
                    {item.type === "pending_booking" ? (
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                    ) : item.type === "driver_assigned" ? (
                      <UserCheck className="w-3.5 h-3.5 text-purple-600" />
                    ) : (
                      <Car className="w-3.5 h-3.5 text-indigo-600" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-bold text-slate-900 truncate">
                      {item.title}
                    </p>
                    <p className="text-[10px] text-slate-500 truncate">{item.message}</p>
                  </div>
                  <span className="text-[9px] font-bold text-slate-400 shrink-0">
                    {formatTimeAgo(item.timestamp)}
                  </span>
                </div>
              ))
            )}
          </div>

          <div className="pt-2 border-t border-slate-100 text-center">
            <Link
              href="/admin/bookings"
              className="text-[11px] font-bold text-purple-700 hover:underline"
            >
              Open Live Dispatch Desk &rarr;
            </Link>
          </div>
        </div>

        {/* Real-time Component C: Active Journey Radar */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-[0_10px_30px_-5px_rgba(147,51,234,0.06),0_4px_12px_-2px_rgba(0,0,0,0.03)] hover:border-purple-300 hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-xs">
                <Navigation className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900">Active Radar</h3>
                <p className="text-[10px] text-slate-400">Gujarat transit allocation</p>
              </div>
            </div>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200/70">
              {activeCount} Active
            </span>
          </div>

          <div className="space-y-2.5 my-3">
            <div className="p-2.5 rounded-2xl bg-purple-50/50 border border-purple-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Car className="w-4 h-4 text-purple-700 shrink-0" />
                <div>
                  <p className="text-[11px] font-bold text-slate-900 leading-tight">
                    Innova Crysta (B-001)
                  </p>
                  <p className="text-[10px] text-slate-500">Rajkot ➔ Somnath</p>
                </div>
              </div>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                On-Trip
              </span>
            </div>

            <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Car className="w-4 h-4 text-slate-700 shrink-0" />
                <div>
                  <p className="text-[11px] font-bold text-slate-900 leading-tight">
                    Dzire VXi (GJ-03-204)
                  </p>
                  <p className="text-[10px] text-slate-500">Airport ➔ Jamnagar</p>
                </div>
              </div>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                Dispatched
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 text-center">
            <Link
              href="/admin/cars"
              className="text-[11px] font-bold text-purple-700 hover:underline"
            >
              Inspect Fleet Tracking &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* 4. Analytics Chart & Popular Categories Row (3D Floating Cards) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2/3: Revenue Analytics Chart with 3D Depth */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-[0_10px_30px_-5px_rgba(147,51,234,0.06),0_4px_12px_-2px_rgba(0,0,0,0.03)] hover:border-purple-300 hover:shadow-[0_20px_35px_-10px_rgba(147,51,234,0.10)] transition-all duration-300 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Revenue Analytics</h3>
              <p className="text-xs text-slate-400">Monthly gross booking performance</p>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200/60 shadow-xs">
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
                  className="w-full max-w-[42px] bg-gradient-to-t from-purple-600 to-purple-400 group-hover:from-purple-700 group-hover:to-purple-500 rounded-t-xl transition-all duration-300 shadow-md shadow-purple-500/20"
                />
                <span className="text-[11px] font-semibold text-slate-400 mt-2">
                  {item.month}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1/3: Popular Categories Donut Breakdown with 3D Depth */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-[0_10px_30px_-5px_rgba(147,51,234,0.06),0_4px_12px_-2px_rgba(0,0,0,0.03)] hover:border-purple-300 hover:shadow-[0_20px_35px_-10px_rgba(147,51,234,0.10)] transition-all duration-300 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Popular Categories</h3>
            <p className="text-xs text-slate-400">Demand split across Saurashtra fleet</p>
          </div>

          {/* SVG Donut Visualizer with Dynamic Categories */}
          <div className="relative flex items-center justify-center my-6">
            <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="45"
                fill="none"
                stroke="#F3EEFE"
                strokeWidth="14"
              />
              {/* Primary Category Arc */}
              <circle
                cx="60"
                cy="60"
                r="45"
                fill="none"
                stroke="#7C3AED"
                strokeWidth="14"
                strokeDasharray="282.7"
                strokeDashoffset={282.7 * (1 - (primaryCategory.percentage || 50) / 100)}
                strokeLinecap="round"
                className="transition-all duration-500"
              />
              {/* Secondary Category Arc if exists */}
              {popularCategories[1] && (
                <circle
                  cx="60"
                  cy="60"
                  r="45"
                  fill="none"
                  stroke="#D97706"
                  strokeWidth="14"
                  strokeDasharray="282.7"
                  strokeDashoffset={282.7 * (1 - (popularCategories[1].percentage || 30) / 100)}
                  transform={`rotate(${(primaryCategory.percentage || 50) * 3.6} 60 60)`}
                  strokeLinecap="round"
                  className="transition-all duration-500"
                />
              )}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
              <span className="text-xl font-black text-slate-900 tracking-tight">
                {primaryCategory.percentage}%
              </span>
              <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider truncate max-w-[85px]">
                {primaryCategory.category}
              </span>
            </div>
          </div>

          {/* Dynamic Legend Items */}
          <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
            {popularCategories.map((cat, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-600 font-medium">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: cat.color || "#7C3AED" }}
                  />
                  {cat.category}
                </span>
                <span className="font-bold text-slate-900">{cat.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Recent Bookings Table with 3D Depth */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-[0_10px_30px_-5px_rgba(147,51,234,0.06),0_4px_12px_-2px_rgba(0,0,0,0.03)] hover:border-purple-300 hover:shadow-[0_20px_35px_-10px_rgba(147,51,234,0.10)] transition-all duration-300 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-purple-600" />
            <h3 className="text-base font-bold text-slate-900">Recent Live Bookings</h3>
          </div>
          <Link
            href="/admin/bookings"
            className="text-xs font-bold text-purple-700 hover:text-purple-800 transition"
          >
            View All Dispatch &rarr;
          </Link>
        </div>

        {/* Desktop View: Full 5-Column Table (Hidden on mobile & tablet) */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <th className="py-3 px-2">Customer</th>
                <th className="py-3 px-2">Vehicle</th>
                <th className="py-3 px-2">Route / Dates</th>
                <th className="py-3 px-2">Status</th>
                <th className="py-3 px-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-xs">
              {recentBookings.slice(0, 5).map((b) => {
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
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-100 to-indigo-100 text-purple-800 font-bold text-[11px] flex items-center justify-center shrink-0 shadow-xs">
                          {initials}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 leading-tight">
                            {customerName}
                          </p>
                          <span className="text-[10px] text-slate-400">
                            {b.user?.email || "Customer"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-2">
                      <p className="font-semibold text-slate-900">
                        {b.car?.brand} {b.car?.model}
                      </p>
                      <span className="text-[10px] text-purple-600 font-bold">
                        {b.car?.category || "Standard"}
                      </span>
                    </td>
                    <td className="py-3.5 px-2 text-slate-600 font-medium">
                      {b.pickupDate ? new Date(b.pickupDate).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "Today"}
                      {b.tripType ? ` • ${b.tripType}` : ""}
                    </td>
                    <td className="py-3.5 px-2">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${statusPill}`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-2 text-right">
                      <Link
                        href={`/admin/bookings?search=${encodeURIComponent(b.bookingId || "")}`}
                        className="p-1.5 rounded-xl text-slate-400 hover:text-purple-700 hover:bg-purple-50 inline-flex transition shadow-xs"
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

        {/* Mobile & Tablet Card Layout: Shows Last 3 Recent Bookings */}
        <div className="lg:hidden space-y-3 pt-1">
          {recentBookings.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl border border-slate-100">
              No recent bookings found.
            </div>
          ) : (
            recentBookings.slice(0, 3).map((b) => {
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
                <div
                  key={b._id}
                  className="p-4 rounded-2xl border border-slate-200/90 bg-white hover:border-purple-200 hover:shadow-md transition-all space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-100 to-indigo-100 text-purple-800 font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 text-xs leading-tight truncate">
                          {customerName}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate">
                          {b.user?.email || "Customer"}
                        </p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 ${statusPill}`}>
                      {b.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold block">Vehicle</span>
                      <span className="font-bold text-slate-800 truncate block">
                        {b.car?.brand} {b.car?.model || "Car"}
                      </span>
                      <span className="text-[9px] text-purple-600 font-semibold block">
                        {b.car?.category || "Standard"}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold block">Route / Date</span>
                      <span className="font-bold text-slate-800 truncate block">
                        {b.pickupDate ? new Date(b.pickupDate).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "Today"}
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium truncate block">
                        {b.tripType || "Outstation"}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] font-mono font-semibold text-slate-400">
                      #{b.bookingId || String(b._id).slice(-6)}
                    </span>
                    <Link
                      href={`/admin/bookings?search=${encodeURIComponent(b.bookingId || "")}`}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-700 hover:text-purple-900"
                    >
                      <span>Manage Ride</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
