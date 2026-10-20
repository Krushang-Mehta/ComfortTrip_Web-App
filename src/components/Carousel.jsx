"use client";

import React from "react";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import autoplay from "embla-carousel-autoplay";
import { profile } from "@/Nav-Contants/app_data-links";
import { ArrowRight, Sparkles } from "lucide-react";

const Carousels = () => {
  return (
    <div className="relative w-full overflow-hidden">
      <Carousel
        plugins={[
          autoplay({
            delay: 4000,
          }),
        ]}
      >
        <CarouselContent>
          {profile?.map((slide, index) => (
            <CarouselItem
              key={index}
              style={{ backgroundImage: `url(${slide.img})` }}
              className="w-full h-full bg-cover bg-center bg-no-repeat relative min-h-[500px] sm:min-h-[580px] lg:min-h-[640px] flex items-center justify-center"
            >
              {/* High-Contrast Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/65 to-black/50" />

              {/* Slide Content */}
              <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center text-white py-12">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-600/30 border border-purple-400/30 text-purple-200 text-xs font-semibold mb-4 backdrop-blur-sm">
                  <Sparkles className="w-3.5 h-3.5 text-purple-300" />
                  <span>Verified Saurashtra Chauffeurs • 24x7 Available</span>
                </div>

                <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white mb-4 leading-tight">
                  <span className="text-third-color">{slide.title}</span>
                </h2>

                <p className="text-sm sm:text-lg md:text-xl text-gray-200 max-w-2xl mx-auto mb-8 leading-relaxed font-normal">
                  {slide.text}
                </p>

                {/* High-Converting Responsive CTAs */}
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <Link
                    href="/Bookings"
                    className="bg-third-color hover:bg-purple-700 text-white font-bold px-7 py-3 rounded-xl shadow-lg shadow-purple-600/40 transition-all text-sm flex items-center gap-2 transform hover:-translate-y-0.5 cursor-pointer"
                  >
                    <span>Book Your Ride Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    href="/Cars"
                    className="bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-xl border border-white/25 backdrop-blur-sm transition-all text-sm cursor-pointer"
                  >
                    View Fleet & Rates
                  </Link>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="hidden sm:block">
          <CarouselPrevious className="left-4 bg-white/20 text-white hover:bg-white/40 border-0" />
          <CarouselNext className="right-4 bg-white/20 text-white hover:bg-white/40 border-0" />
        </div>
      </Carousel>
    </div>
  );
};

export default Carousels;
