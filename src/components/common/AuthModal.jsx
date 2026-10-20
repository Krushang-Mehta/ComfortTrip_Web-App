"use client";

import React from "react";
import Link from "next/link";
import { Lock, Sparkles, UserPlus, LogIn, X, ShieldCheck } from "lucide-react";

/**
 * AuthModal Component
 * Prompts unauthenticated users on the Bookings page with clear CTAs
 * to sign in or register to unlock chauffeur booking and bonus reward points.
 */
export default function AuthModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-purple-100 overflow-hidden transform transition-all scale-100"
        role="dialog"
        aria-modal="true"
      >
        {/* Top Accent Gradient Bar */}
        <div className="h-2 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-800" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
          aria-label="Close auth popup"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 md:p-8 text-center">
          {/* Glowing Purple Icon Badge */}
          <div className="mx-auto w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 shadow-inner mb-4">
            <Lock className="w-8 h-8" />
          </div>

          <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
            Sign In to Book Your Ride
          </h3>

          <p className="mt-2 text-sm text-gray-600 leading-relaxed">
            Please log in or create a free Comfort-Trip account to reserve your verified Saurashtra chauffeur and unlock instant trip perks.
          </p>

          {/* Value Perks Mini-List */}
          <div className="mt-5 p-3.5 bg-purple-50/70 rounded-xl border border-purple-100 text-left space-y-2">
            <div className="flex items-center gap-2.5 text-xs text-purple-900 font-medium">
              <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
              <span>Instant <strong>100 Reward Points (₹100 discount)</strong> on signup</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-purple-900 font-medium">
              <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0" />
              <span>Live chauffeur GPS tracking & digital tax invoice receipts</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="mt-6 flex flex-col gap-3">
            <Link
              href="/Login?callbackUrl=/Bookings"
              className="w-full py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm shadow-md shadow-purple-600/25 flex items-center justify-center gap-2 transition"
            >
              <LogIn className="w-4 h-4" />
              Sign In to Your Account
            </Link>

            <Link
              href="/Register?callbackUrl=/Bookings"
              className="w-full py-3 px-4 rounded-xl border-2 border-purple-600 text-purple-600 hover:bg-purple-50 font-semibold text-sm flex items-center justify-center gap-2 transition"
            >
              <UserPlus className="w-4 h-4" />
              Create New Account (Get 100 Pts)
            </Link>
          </div>

          {/* Dismissible link */}
          <button
            onClick={onClose}
            className="mt-4 text-xs text-gray-400 hover:text-gray-600 underline transition"
          >
            I want to explore rates first
          </button>
        </div>
      </div>
    </div>
  );
}
