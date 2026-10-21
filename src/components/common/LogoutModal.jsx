"use client";

import React from "react";
import { LogOut, X } from "lucide-react";

/**
 * LogoutModal Component
 * Custom styled glassmorphic dialog asking user/admin confirmation before terminating session.
 */
export default function LogoutModal({ isOpen, onClose, onConfirm, isLoading = false }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-3xl p-6 sm:p-7 max-w-sm w-full shadow-2xl border border-slate-100 text-center animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="logout-modal-title"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Warning Icon Badge */}
        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4 shadow-xs">
          <LogOut className="w-6 h-6" />
        </div>

        <h3 id="logout-modal-title" className="text-base font-bold text-slate-900 mb-1.5">
          Confirm Sign Out
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed mb-6">
          Are you sure you want to log out of your Comfort~Trip account? You will need to sign in again to access your dashboard and bookings.
        </p>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-500/20 transition cursor-pointer disabled:opacity-50"
          >
            {isLoading ? "Signing out..." : "Yes, Sign Out"}
          </button>
        </div>
      </div>
    </div>
  );
}
