"use client";

import React, { useState } from "react";
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
  X,
  Shield,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import LogoutModal from "@/components/common/LogoutModal";

const navigationItems = [
  {
    name: "Overview",
    href: "/admin",
    icon: LayoutDashboard,
    badge: null,
  },
  {
    name: "Fleet",
    href: "/admin/cars",
    icon: Car,
    badge: null,
  },
  {
    name: "Bookings",
    href: "/admin/bookings",
    icon: CalendarCheck,
    badge: "Live",
  },
  {
    name: "Chauffeurs",
    href: "/admin/drivers",
    icon: UserCheck,
    badge: null,
  },
  {
    name: "Users",
    href: "/admin/users",
    icon: Users,
    badge: null,
  },
  {
    name: "Staff & Admins",
    href: "/admin/admins",
    icon: ShieldCheck,
    badge: "Super",
    superAdminOnly: true,
  },
  {
    name: "CMS & Reviews",
    href: "/admin/reviews",
    icon: Star,
    badge: null,
  },
];

export default function AdminSidebar({ user, mobileOpen, setMobileOpen }) {
  const pathname = usePathname();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const isSuperAdmin = user?.role === "super-admin";

  const visibleItems = navigationItems.filter(
    (item) => !item.superAdminOnly || isSuperAdmin
  );

  function isItemActive(href) {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(href);
  }

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs md:hidden animate-in fade-in duration-200"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* LuxeDrive Styled Admin Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col w-64 bg-white border-r border-purple-100/80 shadow-xs transition-transform duration-300 ease-in-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Brand Header */}
        <div className="h-20 px-6 flex items-center justify-between border-b border-purple-50">
          <Link
            href="/admin"
            className="flex flex-col min-w-0 group"
            onClick={() => setMobileOpen(false)}
          >
            <span className="font-extrabold text-2xl text-purple-700 tracking-tight group-hover:text-purple-800 transition">
              Comfort~Trip
            </span>
            <span className="text-[11px] font-semibold text-slate-400 tracking-wide mt-0.5">
              Admin Terminal
            </span>
          </Link>

          {/* Close button for Mobile Drawer */}
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="md:hidden p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Menu Links */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const active = isItemActive(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`group flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-150 ${
                  active
                    ? "bg-purple-100 text-purple-700 shadow-xs border-r-4 border-purple-600"
                    : "text-slate-500 hover:text-purple-700 hover:bg-purple-50/60 font-semibold"
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    active ? "text-purple-700" : "text-slate-400 group-hover:text-purple-600"
                  }`}
                />
                <span className="truncate flex-1">{item.name}</span>
                {item.badge && (
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      active
                        ? "bg-purple-200/80 text-purple-800"
                        : "bg-emerald-50 text-emerald-600 border border-emerald-200/60"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Profile & Actions Area */}
        <div className="p-4 border-t border-purple-50 space-y-3">
          {/* View Public Storefront link */}
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-purple-700 hover:bg-purple-50/50 transition"
          >
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            <span>Customer Storefront</span>
          </Link>

          {/* Admin User Chip (LuxeDrive style) */}
          <div className="p-3 rounded-2xl bg-purple-50/70 border border-purple-100/80 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
              </div>
              <div className="min-w-0 truncate">
                <p className="text-xs font-bold text-slate-900 truncate leading-tight">
                  {user?.name || "Admin User"}
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-[10px] text-purple-700 font-bold uppercase tracking-wider truncate">
                    {user?.role || "SUPER-ADMIN"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Sign Out Button */}
          <button
            type="button"
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={() => signOut({ callbackUrl: "/Login" })}
      />
    </>
  );
}
