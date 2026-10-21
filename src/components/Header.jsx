"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Menu,
  X,
  User,
  LogOut,
  Shield,
} from "lucide-react";
import LogoutModal from "@/components/common/LogoutModal";

const navigationItems = [
  { href: "/", label: "Home" },
  { href: "/Bookings", label: "Bookings" },
  { href: "/Cars", label: "Cars" },
  { href: "/Services", label: "Services" },
  { href: "/about-us", label: "About Us" },
];

const Header = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const isAdmin = session?.user?.role === "admin" || session?.user?.role === "super-admin";
  const user = session?.user;

  // Suppress public consumer header on administrative routes
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      <header className="bg-white/95 backdrop-blur-md sticky top-0 z-50 shadow-sm border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          {/* Brand Logo - Comfort~Trip in Brand third-color */}
          <Link
            href="/"
            className="text-third-color font-bold text-2xl tracking-tight transform transition-transform duration-300 hover:scale-105"
          >
            Comfort~Trip
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-2">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3.5 py-1.5 rounded-lg text-sm transition-all duration-200 ${
                    isActive
                      ? "text-third-color font-bold bg-purple-50/70 shadow-sm shadow-purple-500/15"
                      : "text-main-color hover:text-third-color font-medium hover:bg-slate-50"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* User Account / Auth Actions */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-third-color hover:bg-purple-700 text-white text-xs font-semibold rounded-lg shadow-sm shadow-purple-500/25 transition-all"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>Admin Desk</span>
                  </Link>
                )}

                {/* Customer Profile Link */}
                <Link
                  href="/profile"
                  className="flex items-center gap-1.5 text-sm font-medium text-main-color hover:text-third-color px-3 py-1.5 rounded-lg hover:bg-purple-50/60 transition-colors"
                >
                  <User className="w-4 h-4 text-third-color" />
                  <span>{user.name?.split(" ")[0] || "Profile"}</span>
                </Link>

                {/* Sign Out Button */}
                <button
                  type="button"
                  onClick={() => setShowLogoutModal(true)}
                  title="Sign out"
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/Login"
                className="text-sm font-medium text-second-color hover:text-third-color px-3.5 py-1.5 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/Register"
                className="text-sm font-semibold text-white bg-third-color hover:bg-purple-700 px-4 py-2 rounded-lg shadow-md shadow-purple-500/30 hover:shadow-purple-500/40 transition-all transform hover:-translate-y-0.5"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <div className="md:hidden flex items-center">
          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
            className="p-2 text-main-color hover:text-third-color rounded-lg transition-colors cursor-pointer"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-purple-100 px-4 pt-2 pb-6 space-y-2 shadow-xl shadow-purple-500/10 animate-in slide-in-from-top-2 duration-200">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-lg text-base transition-all ${
                  isActive
                    ? "bg-purple-50 text-third-color font-bold shadow-sm shadow-purple-500/20"
                    : "text-main-color hover:text-third-color hover:bg-slate-50 font-medium"
                }`}
              >
                {item.label}
              </Link>
            );
          })}

          <div className="pt-4 border-t border-slate-100 space-y-2">
            {user ? (
              <>
                <div className="flex items-center justify-between px-3 py-2 bg-purple-50/70 rounded-lg text-sm shadow-sm shadow-purple-500/10">
                  <span className="font-semibold text-main-color">{user.name}</span>
                  <span className="text-xs text-purple-700 font-semibold">{user.email}</span>
                </div>

                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 bg-third-color text-white text-sm font-semibold rounded-lg shadow-sm shadow-purple-500/25"
                  >
                    <Shield className="w-4 h-4" />
                    <span>Admin Desk</span>
                  </Link>
                )}

                <Link
                  href="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-main-color hover:text-third-color hover:bg-purple-50 rounded-lg text-sm font-medium"
                >
                  <User className="w-4 h-4 text-third-color" />
                  <span>My Profile & Bookings</span>
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    setShowLogoutModal(true);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-lg text-sm font-medium text-left cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign out</span>
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  href="/Login"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-center py-2.5 px-3 border border-purple-200 text-third-color hover:bg-purple-50 rounded-lg text-sm font-medium shadow-sm shadow-purple-500/10 transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  href="/Register"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-center py-2.5 px-3 bg-third-color text-white hover:bg-purple-700 rounded-lg text-sm font-semibold shadow-md shadow-purple-500/30 transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>

    <LogoutModal
      isOpen={showLogoutModal}
      onClose={() => setShowLogoutModal(false)}
      onConfirm={() => signOut({ callbackUrl: "/" })}
    />
  </>
  );
};

export default Header;
