"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { Compass, Loader2, ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();

  const [mobileOpen, setMobileOpen] = useState(false);

  // If on login redirect page, render children directly without admin shell
  const isLoginPage = pathname === "/admin/login";

  // Auth Protection Check
  useEffect(() => {
    if (status === "unauthenticated" && !isLoginPage) {
      router.replace(`/Login?callbackUrl=${encodeURIComponent(pathname)}`);
    }
  }, [status, isLoginPage, pathname, router]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  // Loading Session State
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#FAF8FD] flex flex-col items-center justify-center gap-3 text-purple-900">
        <div className="w-12 h-12 rounded-2xl bg-purple-600 flex items-center justify-center shadow-lg shadow-purple-600/30 animate-pulse">
          <Compass className="w-6 h-6 text-white" />
        </div>
        <p className="text-xs font-semibold text-slate-500 flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
          <span>Verifying administrative clearance...</span>
        </p>
      </div>
    );
  }

  // Access Denied for Non-Admin roles
  const userRole = session?.user?.role;
  const isAdmin = userRole === "admin" || userRole === "super-admin";

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#FAF8FD] flex flex-col items-center justify-center p-4 text-center">
        <div className="w-16 h-16 rounded-3xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-500 mb-4 shadow-sm">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-1">Administrative Privileges Required</h2>
        <p className="text-xs text-slate-500 max-w-sm mb-6">
          Your active session does not possess the credentials necessary to access the Comfort~Trip Admin Terminal.
        </p>
        <div className="flex gap-3">
          <Link
            href="/"
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
          >
            Storefront
          </Link>
          <Link
            href="/Login?callbackUrl=/admin"
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-md shadow-purple-600/25 transition"
          >
            Sign In with Admin Account
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8FD] flex">
      {/* Permanent Full-Width Desktop Sidebar */}
      <AdminSidebar
        user={session.user}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 md:ml-64 transition-all duration-200">
        <AdminHeader user={session.user} setMobileOpen={setMobileOpen} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
