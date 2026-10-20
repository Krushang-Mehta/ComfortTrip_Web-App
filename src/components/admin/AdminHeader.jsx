"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Menu,
  Bell,
  Download,
  LogOut,
  ExternalLink,
  CheckCircle2,
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

export default function AdminHeader({ user, setMobileOpen }) {
  const pathname = usePathname();
  const currentMeta = pageMeta[pathname] || {
    title: "Overview",
    subtitle: "Real-time performance metrics for Comfort~Trip fleet.",
  };

  const [exporting, setExporting] = useState(false);
  const [exportedMsg, setExportedMsg] = useState(false);

  function handleExport() {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      setExportedMsg(true);
      setTimeout(() => setExportedMsg(false), 3000);
    }, 800);
  }

  return (
    <header className="sticky top-0 z-30 h-20 bg-[#FAF8FD]/90 backdrop-blur-md px-4 sm:px-6 lg:px-8 flex items-center justify-between border-b border-purple-100/40">
      {/* Left: Mobile Drawer Toggle & Page Titles */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="md:hidden p-2 rounded-xl text-slate-600 hover:text-purple-700 hover:bg-purple-50 transition"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-serif sm:font-sans truncate">
            {currentMeta.title}
          </h1>
          <p className="text-xs text-slate-500 hidden sm:block truncate mt-0.5">
            {currentMeta.subtitle}
          </p>
        </div>
      </div>

      {/* Right: Actions, Notifications, & Profile */}
      <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0">
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

        {/* Notifications Bell */}
        <button
          type="button"
          aria-label="Notifications"
          className="relative p-2.5 rounded-xl bg-white border border-purple-100/80 text-slate-500 hover:text-purple-700 hover:bg-purple-50/50 shadow-xs transition cursor-pointer"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
        </button>

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
