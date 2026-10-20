import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

/**
 * Enhanced Hero Banner Component
 * Features optimized background image overlay contrast and responsive action CTAs.
 */
const Banners = ({
  img,
  title,
  text,
  backgroundColor = "#212832",
  showCtas = true,
}) => {
  return (
    <div className="relative w-full">
      <div
        className="h-[45vh] sm:h-[55vh] lg:h-[65vh] bg-no-repeat bg-center bg-cover relative flex items-center justify-center px-4 sm:px-6 lg:px-8"
        style={{ backgroundImage: `url(${img})`, backgroundColor }}
      >
        {/* Optimized Contrast Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/70 to-black/60 backdrop-blur-[1px]" />

        {/* Content Container */}
        <div className="relative z-10 w-full max-w-5xl text-center text-white">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-600/30 border border-purple-400/40 text-purple-200 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-purple-300" />
            <span>Premium Rajkot Chauffeur Service</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mb-3">
            <span className="text-third-color">{title.split(" ")[0]} </span>
            {title.split(" ").slice(1).join(" ")}
          </h1>

          <p className="text-sm sm:text-lg md:text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
            {text}
          </p>

          {showCtas && (
            <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-3.5">
              <Link
                href="/Bookings"
                className="bg-third-color hover:bg-purple-700 text-white font-bold px-7 py-3 rounded-xl shadow-lg shadow-purple-600/30 transition-all text-sm flex items-center gap-2 transform hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Book Your Ride Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/Cars"
                className="bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-xl border border-white/30 backdrop-blur-sm transition-all text-sm cursor-pointer"
              >
                Explore Fleet & Rates
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Banners;
