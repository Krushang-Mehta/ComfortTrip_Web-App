"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  CalendarCheck,
  Car,
  Users,
  Star,
  UserCheck,
  ExternalLink,
  LogOut,
  Compass,
  ChevronLeft,
  ChevronRight,
  Shield,
  X,
} from "lucide-react";

const navigationItems = [
  {
    name: "Executive Overview",
    href: "/admin",
    icon: LayoutDashboard,
    badge: null,
  },
  {
    name: "Live Dispatch Desk",
    href: "/admin/bookings",
    icon: CalendarCheck,
    badge: "Live",
  },
  {
    name: "Fleet Manager",
    href: "/admin/cars",
    icon: Car,
    badge: null,
  },
  {
    name: "Chauffeur Registry",
    href: "/admin/drivers",
    icon: UserCheck,
    badge: null,
  },
  {
    name: "Registered Users",
    href: "/admin/users",
    icon: Users,
    badge: null,
  },
  {
    name: "Customer Reviews",
    href: "/admin/reviews",
    icon: Star,
    badge: null,
  },
];

export default function AdminSidebar({
  user,
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}) {
  const pathname = usePathname();

  function isItemActive(href) {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(href);
  }

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs md:hidden animate-in fade-in duration-200"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-slate-900 border-r border-slate-800 text-slate-300 transition-all duration-300 ease-in-out ${
          collapsed ? "w-20" : "w-64"
        } ${
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800/80">
          <Link
            href="/admin"
            className="flex items-center gap-3 min-w-0"
            onClick={() => setMobileOpen(false)}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-md shadow-purple-600/30">
              <Compass className="w-5 h-5" />
            </div>
            {!collapsed && (
              <div className="min-w-0 truncate">
                <span className="font-black text-sm text-white tracking-tight block truncate">
                  Comfort~Trip
                </span>
                <span className="text-[10px] font-semibold text-purple-400 uppercase tracking-widest block truncate">
                  Vanil Admin
                </span>
              </div>
            )}
          </Link>

          {/* Close button for Mobile Drawer */}
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = isItemActive(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                title={collapsed ? item.name : undefined}
                className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                  active
                    ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
                }`}
              >
                <Icon
                  className={`w-5 h-5 shrink-0 transition-transform ${
                    active ? "text-white" : "text-slate-400 group-hover:text-purple-400"
                  }`}
                />
                {!collapsed && (
                  <span className="truncate flex-1">{item.name}</span>
                )}
                {!collapsed && item.badge && (
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      active
                        ? "bg-white/20 text-white"
                        : "bg-emerald-500/20 text-emerald-400"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Quick Links & Admin Profile Card */}
        <div className="p-3 border-t border-slate-800/80 space-y-2">
          {/* Storefront Link */}
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            title={collapsed ? "Storefront Preview" : undefined}
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition"
          >
            <ExternalLink className="w-4 h-4 shrink-0 text-slate-400" />
            {!collapsed && <span className="truncate">View Live Storefront</span>}
          </Link>

          {/* Admin User Chip */}
          <div className="p-2.5 rounded-2xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
              </div>
              {!collapsed && (
                <div className="min-w-0 truncate">
                  <p className="text-xs font-bold text-white truncate leading-tight">
                    {user?.name || "Administrator"}
                  </p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Shield className="w-3 h-3 text-purple-400 shrink-0" />
                    <span className="text-[10px] text-purple-300 font-semibold uppercase tracking-wider truncate">
                      {user?.role || "Admin"}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {!collapsed && (
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/admin/login" })}
                title="Log Out"
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-700/50 transition cursor-pointer shrink-0"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Collapse/Expand Toggle (Desktop only) */}
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex w-full items-center justify-center p-1.5 rounded-xl text-slate-500 hover:text-slate-300 hover:bg-slate-800/60 transition cursor-pointer text-xs"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <div className="flex items-center gap-1.5">
                <ChevronLeft className="w-4 h-4" />
                <span>Collapse Sidebar</span>
              </div>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
