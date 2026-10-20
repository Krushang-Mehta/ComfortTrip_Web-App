"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, ShieldCheck } from "lucide-react";

/**
 * Reusable Service-style Booking CTA Banner Component
 * Placed strategically across pages to maximize user conversion to the booking wizard.
 */
export default function BookingCtaBanner({
  title = "Ready to Book Your Next Journey in Rajkot?",
  subtitle = "Join thousands of satisfied travelers who trust Comfort Trip for punctual, safe, and comfortable car rentals across Gujarat.",
  primaryCtaText = "Book Your Ride Now",
  secondaryCtaText = "Explore Vehicle Fleet",
  showPointsBadge = true,
}) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-gradient-to-r from-purple-700 via-purple-800 to-indigo-900 text-white rounded-3xl p-8 sm:p-12 text-center shadow-xl shadow-purple-600/20 relative overflow-hidden">
        {/* Ambient Decorative Blurs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto">
          {showPointsBadge && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-purple-200 text-xs font-semibold mb-3 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-purple-300" />
              <span>Get 100 Reward Points (₹100 Off) on Signup</span>
            </div>
          )}

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
            {title}
          </h2>

          <p className="text-purple-100 text-xs sm:text-sm md:text-base mt-3 leading-relaxed">
            {subtitle}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
            <Link
              href="/Bookings"
              className="bg-white text-purple-800 hover:bg-purple-50 font-bold px-7 py-3 rounded-xl shadow-lg transition-all text-sm flex items-center gap-2 transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>{primaryCtaText}</span>
              <ArrowRight className="w-4 h-4 text-purple-800" />
            </Link>

            <Link
              href="/Cars"
              className="bg-purple-900/40 hover:bg-purple-900/60 text-white font-semibold px-6 py-3 rounded-xl border border-white/20 transition-all text-sm cursor-pointer"
            >
              {secondaryCtaText}
            </Link>
          </div>

          <div className="mt-6 flex items-center justify-center gap-6 text-[11px] text-purple-200 font-medium">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-300" />
              <span>Transparent Per-Km Billing</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-300" />
              <span>24x7 Saurashtra Chauffeurs</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
