"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Menu,
  Shield,
  LogOut,
  ExternalLink,
  Radio,
} from "lucide-react";

const pageTitles = {
  "/admin": "Executive Overview & Metrics",
  "/admin/bookings": "Live Bookings Dispatch Desk",
  "/admin/cars": "Fleet Inventory & Vehicle Control",
  "/admin/drivers": "Chauffeurs & Drivers Registry",
  "/admin/users": "Registered User Accounts",
  "/admin/reviews": "Customer Testimonials & Ratings",
};

export default function AdminHeader({ user, setMobileOpen }) {
  const pathname = usePathname();
  const currentTitle = pageTitles[pathname] || "Admin Control Console";

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between shadow-xs">
      {/* Left: Mobile hamburger & Page Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-sm sm:text-base font-black text-slate-900 tracking-tight truncate">
              {currentTitle}
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              <Radio className="w-2.5 h-2.5 text-emerald-500 animate-pulse" />
              <span>Live Engine</span>
            </span>
          </div>
          <p className="text-[11px] text-slate-500 hidden sm:block truncate">
            Rajkot Saurashtra dispatch operations & fleet telemetry
          </p>
        </div>
      </div>

      {/* Right: Actions & User Avatar */}
      <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden lg:inline-flex items-center gap-1.5 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200/60 px-3 py-1.5 rounded-xl transition"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Customer Site</span>
        </a>

        {/* User Role Badge */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
            {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-bold text-slate-900 leading-tight">
              {user?.name || "Admin"}
            </p>
            <div className="flex items-center gap-1">
              <Shield className="w-2.5 h-2.5 text-purple-600" />
              <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider">
                {user?.role || "Admin"}
              </span>
            </div>
          </div>
        </div>

        {/* Logout Quick Button */}
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          title="Sign Out of Admin Console"
          className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
          aria-label="Sign out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
