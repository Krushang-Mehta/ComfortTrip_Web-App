"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Menu,
  Bell,
  Download,
  CheckCircle2,
  X,
  CheckCheck,
  CalendarClock,
  UserCheck,
  Star,
  Activity,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

const pageMeta = {
  "/admin": {
    title: "Overview",
    subtitle: "Real-time performance metrics for Comfort~Trip fleet.",
  },
  "/admin/bookings": {
    title: "Bookings Dispatch",
    subtitle: "Live ride orders, chauffeur assignments, and fleet allocation.",
  },
  "/admin/cars": {
    title: "Fleet Control",
    subtitle: "Manage fleet vehicles, rates, categories, and maintenance status.",
  },
  "/admin/drivers": {
    title: "Chauffeur Registry",
    subtitle: "Verified drivers, contact records, and active duty assignments.",
  },
  "/admin/users": {
    title: "User Directory",
    subtitle: "Registered customer accounts, roles, and booking histories.",
  },
  "/admin/reviews": {
    title: "CMS & Reviews",
    subtitle: "Customer testimonials, star ratings, and website publishing.",
  },
};

function formatTimeAgo(dateString) {
  if (!dateString) return "Recently";
  const seconds = Math.max(0, Math.floor((new Date() - new Date(dateString)) / 1000));
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function AdminHeader({ user, setMobileOpen }) {
  const pathname = usePathname();
  const router = useRouter();
  const currentMeta = pageMeta[pathname] || {
    title: "Overview",
    subtitle: "Real-time performance metrics for Comfort~Trip fleet.",
  };

  const [exporting, setExporting] = useState(false);
  const [exportedMsg, setExportedMsg] = useState(false);

  // Real-time notifications state with lazy initializer
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [dismissedIds, setDismissedIds] = useState(() => {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(localStorage.getItem("ct_dismissed_notifications") || "[]");
    } catch {
      return [];
    }
  });
  const [readIds, setReadIds] = useState(() => {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(localStorage.getItem("ct_read_notifications") || "[]");
    } catch {
      return [];
    }
  });
  const popoverRef = useRef(null);

  useEffect(() => {
    let ignore = false;
    async function loadNotifications() {
      try {
        const res = await fetch("/api/admin/notifications");
        if (!res.ok) return;
        const data = await res.json();
        if (!ignore && data.success && Array.isArray(data.notifications)) {
          setNotifications(data.notifications);
        }
      } catch {
        // Silently handle temporary connection drop during dev server restart
      }
    }

    loadNotifications();
    const interval = setInterval(loadNotifications, 30000); // 30s auto-refresh
    return () => {
      ignore = true;
      clearInterval(interval);
    };
  }, []);

  // Click outside and ESC listener to close dropdown
  useEffect(() => {
    function handleClickOutside(e) {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setNotificationsOpen(false);
      }
    }
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        setNotificationsOpen(false);
      }
    }

    if (notificationsOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [notificationsOpen]);

  // Filter out dismissed notifications
  const activeNotifications = notifications.filter((n) => !dismissedIds.includes(n.id));
  const unreadCount = activeNotifications.filter((n) => !readIds.includes(n.id)).length;

  function handleDismiss(e, id) {
    e.stopPropagation();
    const nextDismissed = [...dismissedIds, id];
    setDismissedIds(nextDismissed);
    try {
      localStorage.setItem("ct_dismissed_notifications", JSON.stringify(nextDismissed));
    } catch {}
  }

  function handleMarkAllAsRead() {
    const allIds = activeNotifications.map((n) => n.id);
    const updated = Array.from(new Set([...readIds, ...allIds]));
    setReadIds(updated);
    try {
      localStorage.setItem("ct_read_notifications", JSON.stringify(updated));
    } catch {}
  }

  function handleNotificationClick(n) {
    if (!readIds.includes(n.id)) {
      const updated = [...readIds, n.id];
      setReadIds(updated);
      try {
        localStorage.setItem("ct_read_notifications", JSON.stringify(updated));
      } catch {}
    }
    setNotificationsOpen(false);
    if (n.link) {
      router.push(n.link);
    }
  }

  function handleExport() {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      setExportedMsg(true);
      setTimeout(() => setExportedMsg(false), 3000);
    }, 800);
  }

  function getNotificationIcon(type) {
    switch (type) {
      case "pending_booking":
        return <AlertCircle className="w-4 h-4 text-amber-600" />;
      case "driver_assigned":
        return <UserCheck className="w-4 h-4 text-purple-600" />;
      case "review":
        return <Star className="w-4 h-4 text-amber-500 fill-amber-500" />;
      default:
        return <Activity className="w-4 h-4 text-blue-600" />;
    }
  }

  return (
    <header className="sticky top-0 z-30 h-20 bg-[#FAF8FD]/90 backdrop-blur-md px-4 sm:px-6 lg:px-8 flex items-center justify-between border-b border-purple-100/40">
      {/* Left: Mobile Drawer Toggle & Page Titles */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="md:hidden p-2 rounded-xl text-slate-600 hover:text-purple-700 hover:bg-purple-50 transition cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight truncate">
            {currentMeta.title}
          </h1>
          <p className="text-xs text-slate-500 hidden sm:block truncate mt-0.5">
            {currentMeta.subtitle}
          </p>
        </div>
      </div>

      {/* Right: Actions, Notifications, & Profile */}
      <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0 relative">
        {/* Export Report CTA */}
        <button
          type="button"
          onClick={handleExport}
          disabled={exporting}
          className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold border border-purple-200/60 shadow-xs transition cursor-pointer"
        >
          {exportedMsg ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-700">Report Ready</span>
            </>
          ) : (
            <>
              <Download className="w-3.5 h-3.5" />
              <span>{exporting ? "Generating..." : "Export Report"}</span>
            </>
          )}
        </button>

        {/* Notifications Popover Container */}
        <div className="relative" ref={popoverRef}>
          <button
            type="button"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            aria-label="Notifications"
            className={`relative p-2.5 rounded-xl border transition cursor-pointer ${
              notificationsOpen
                ? "bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-600/20"
                : "bg-white border-purple-100/80 text-slate-600 hover:text-purple-700 hover:bg-purple-50/50 shadow-xs"
            }`}
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 px-1.5 min-w-4 h-4 text-[9px] font-black rounded-full bg-rose-500 text-white flex items-center justify-center ring-2 ring-white animate-pulse">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {/* Real-Time Notification Dropdown Card */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-purple-950/15 border border-purple-100/90 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              {/* Header */}
              <div className="p-4 bg-gradient-to-r from-purple-50/70 via-indigo-50/40 to-white border-b border-purple-100/70 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <h3 className="text-xs font-bold text-slate-900 tracking-tight">
                    Live Dispatch Alerts
                  </h3>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-extrabold text-[10px]">
                      {unreadCount} New
                    </span>
                  )}
                </div>

                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={handleMarkAllAsRead}
                    className="text-[11px] font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1 transition cursor-pointer"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>Mark all read</span>
                  </button>
                )}
              </div>

              {/* Scrollable Notification Items List */}
              <div className="max-h-96 overflow-y-auto divide-y divide-purple-50/60">
                {activeNotifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    </div>
                    <p className="text-xs font-bold text-slate-800">All Caught Up!</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      No unread dispatch alerts at this time.
                    </p>
                  </div>
                ) : (
                  activeNotifications.map((n) => {
                    const isUnread = !readIds.includes(n.id);
                    return (
                      <div
                        key={n.id}
                        onClick={() => handleNotificationClick(n)}
                        className={`p-3.5 flex items-start gap-3 transition cursor-pointer hover:bg-purple-50/40 ${
                          isUnread ? "bg-purple-50/20" : "bg-white"
                        }`}
                      >
                        {/* Icon */}
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                            n.type === "pending_booking"
                              ? "bg-amber-50"
                              : n.type === "driver_assigned"
                              ? "bg-purple-50"
                              : n.type === "review"
                              ? "bg-amber-50"
                              : "bg-blue-50"
                          }`}
                        >
                          {getNotificationIcon(n.type)}
                        </div>

                        {/* Text */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700">
                              {n.category || "DISPATCH"}
                            </span>
                            <span className="text-[10px] text-slate-400 shrink-0">
                              {formatTimeAgo(n.timestamp)}
                            </span>
                          </div>

                          <h4
                            className={`text-xs mt-0.5 truncate leading-tight ${
                              isUnread ? "font-bold text-slate-900" : "font-medium text-slate-700"
                            }`}
                          >
                            {n.title}
                          </h4>

                          <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-snug">
                            {n.message}
                          </p>

                          {n.amount && (
                            <span className="inline-block mt-1 text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                              {n.amount}
                            </span>
                          )}
                        </div>

                        {/* Individual X Dismiss Button */}
                        <button
                          type="button"
                          onClick={(e) => handleDismiss(e, n.id)}
                          className="p-1 rounded-lg text-slate-300 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer shrink-0 mt-0.5"
                          title="Dismiss notification"
                          aria-label="Dismiss notification"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Footer View All */}
              <div className="p-2.5 bg-slate-50 border-t border-purple-50 text-center">
                <Link
                  href="/admin/bookings"
                  onClick={() => setNotificationsOpen(false)}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-700 hover:text-purple-900 hover:underline py-1 transition"
                >
                  <span>Open Live Dispatch Desk</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Pill */}
        <div className="flex items-center gap-2.5 pl-2">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
            {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-xs font-bold text-slate-900 leading-tight">
              {user?.name || "Krushang Mehta"}
            </p>
            <p className="text-[10px] text-purple-600 font-bold uppercase tracking-wider">
              {user?.role || "SUPER-ADMIN"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
