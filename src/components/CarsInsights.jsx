"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Users,
  Fuel,
  Sliders,
  Sparkles,
  Calendar,
} from "lucide-react";

const fallbackCars = [
  {
    brand: "Maruti Suzuki",
    model: "Dzire VXi",
    category: "Sedan",
    seatingCapacity: 4,
    transmission: "Manual",
    fuelType: "CNG / Petrol",
    pricePerKm: 12,
    imgUrl: "/car-01.png",
  },
  {
    brand: "Maruti Suzuki",
    model: "Ertiga ZXi",
    category: "SUV",
    seatingCapacity: 6,
    transmission: "Auto",
    fuelType: "Petrol Hybrid",
    pricePerKm: 15,
    imgUrl: "/car-02.png",
  },
  {
    brand: "Toyota",
    model: "Innova Crysta VX",
    category: "SUV",
    seatingCapacity: 7,
    transmission: "Auto",
    fuelType: "Diesel",
    pricePerKm: 19,
    imgUrl: "/car-03.png",
  },
  {
    brand: "Toyota",
    model: "Fortuner 4x2",
    category: "Luxury",
    seatingCapacity: 7,
    transmission: "Auto",
    fuelType: "Diesel",
    pricePerKm: 28,
    imgUrl: "/car-04.png",
  },
  {
    brand: "Force Motors",
    model: "Urbania Luxury",
    category: "Traveller",
    seatingCapacity: 16,
    transmission: "Manual",
    fuelType: "Diesel",
    pricePerKm: 26,
    imgUrl: "/car-05.png",
  },
];

export default function CarsInsights({ isForm = false, showHeader = true }) {
  const [fleet, setFleet] = useState(fallbackCars);

  useEffect(() => {
    async function loadFleet() {
      try {
        const res = await fetch("/api/cars");
        const data = await res.json();
        if (data.success && data.cars?.length > 0) {
          const mapped = data.cars.map((car, idx) => ({
            ...car,
            imgUrl: car.images?.[0]?.url || fallbackCars[idx % fallbackCars.length].imgUrl,
            transmission: car.transmission || (idx % 2 === 0 ? "Auto" : "Manual"),
          }));
          setFleet(mapped);
        }
      } catch (err) {
        console.error("Failed to fetch live fleet, using fallback fleet", err);
      }
    }
    loadFleet();
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {showHeader && (
        <div className="max-w-3xl mx-auto text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-3.5 py-1 rounded-full border border-purple-200/60 inline-flex items-center gap-1.5 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            Verified Saurashtra Fleet
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight font-serif sm:font-sans">
            Our Premium Rental Fleet & Transparent Rates
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Sanitized, GPS-enabled vehicles driven by experienced, courteous local chauffeurs.
          </p>
        </div>
      )}

      {/* Grid of Redesigned Fleet Cards (Matching Image 3) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {fleet.map((car, index) => {
          const carName = `${car.brand} ${car.model}`;
          const primaryFuel = car.fuelType ? car.fuelType.split(" ")[0].replace("/", "") : "Petrol";

          return (
            <div
              key={index}
              className="bg-white rounded-3xl border border-purple-100/70 p-4 shadow-md shadow-purple-500/5 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
            >
              {/* Vehicle Image Container with Floating Glassmorphic Category Badge */}
              <div className="relative w-full h-48 rounded-2xl overflow-hidden bg-slate-50 flex items-center justify-center p-4 border border-slate-100/80">
                <Image
                  src={car.imgUrl || "/car-01.png"}
                  alt={carName}
                  width={420}
                  height={240}
                  className="w-full h-full object-contain transform transition-transform duration-300 group-hover:scale-105"
                />
                {/* Floating Glassmorphic Badge (Top-Right) */}
                <span className="absolute top-3 right-3 text-xs font-bold text-purple-700 bg-white/85 backdrop-blur-md px-3 py-0.5 rounded-full shadow-sm border border-white/60">
                  {car.category || "Luxury"}
                </span>
              </div>

              {/* Vehicle Title & Pricing Row */}
              <div className="pt-4 pb-2 px-1 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight font-serif sm:font-sans leading-tight">
                      {carName}
                    </h3>
                    <div className="text-right shrink-0">
                      <span className="text-lg sm:text-xl font-black text-purple-700 tracking-tight block">
                        ₹{car.pricePerKm}
                      </span>
                      <span className="text-[10px] text-slate-400 font-normal block -mt-1">
                        / km
                      </span>
                    </div>
                  </div>

                  {/* Specs Row: Seats • Transmission • Fuel */}
                  <div className="flex items-center gap-3.5 text-xs text-slate-500 font-medium my-3.5">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{car.seatingCapacity}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Sliders className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{car.transmission || "Auto"}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Fuel className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{primaryFuel}</span>
                    </span>
                  </div>
                </div>

                {/* Full-Width Outlined Purple Button: Book Now 📅 */}
                <Link
                  href={`/Bookings?car=${encodeURIComponent(carName)}`}
                  className="w-full mt-2 py-2.5 rounded-xl border-2 border-purple-600 text-purple-700 hover:bg-purple-600 hover:text-white font-bold text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2 group-hover:bg-purple-600 group-hover:text-white cursor-pointer shadow-xs"
                >
                  <span>Book Now</span>
                  <Calendar className="w-4 h-4" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
