"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Users, Fuel, ShieldCheck, ArrowRight, Sparkles, Car as CarIcon } from "lucide-react";

const fallbackCars = [
  {
    brand: "Maruti Suzuki",
    model: "Dzire VXi",
    category: "Sedan",
    seatingCapacity: 4,
    fuelType: "CNG / Petrol",
    pricePerKm: 12,
    imgUrl: "/car-01.png",
    features: ["AC Climate Control", "Compact Luggage", "Comfort Seats"],
  },
  {
    brand: "Maruti Suzuki",
    model: "Ertiga ZXi",
    category: "SUV",
    seatingCapacity: 6,
    fuelType: "Petrol Hybrid",
    pricePerKm: 15,
    imgUrl: "/car-02.png",
    features: ["6 Passenger Seating", "Rear AC Vents", "Roof Carrier"],
  },
  {
    brand: "Toyota",
    model: "Innova Crysta 2.4 VX",
    category: "SUV",
    seatingCapacity: 7,
    fuelType: "Diesel",
    pricePerKm: 19,
    imgUrl: "/car-03.png",
    features: ["Executive Captain Seats", "High-Torque Chauffeur", "Ample Boot Space"],
  },
  {
    brand: "Toyota",
    model: "Fortuner 4x2 Legender",
    category: "Luxury",
    seatingCapacity: 7,
    fuelType: "Diesel",
    pricePerKm: 28,
    imgUrl: "/car-04.png",
    features: ["VIP Luxury Interiors", "Sunroof & Climate Control", "Premium Chauffeur"],
  },
  {
    brand: "Force Motors",
    model: "Urbania Luxury Cruiser",
    category: "Tempo Traveller",
    seatingCapacity: 16,
    fuelType: "Diesel",
    pricePerKm: 26,
    imgUrl: "/car-05.png",
    features: ["16 Reclining Seats", "Panoramic Windows", "Pilgrimage Touring Spec"],
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
          // Merge image URLs from fallback if cloud image is missing
          const mapped = data.cars.map((car, idx) => ({
            ...car,
            imgUrl: car.images?.[0]?.url || fallbackCars[idx % fallbackCars.length].imgUrl,
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
        <div className="max-w-3xl mx-auto text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-third-color bg-purple-50 px-3.5 py-1 rounded-full border border-purple-200/60 inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-third-color" />
            Verified Saurashtra Fleet
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-main-color mt-3 tracking-tight">
            Our Premium Rental Fleet & Transparent Rates
          </h2>
          <p className="mt-2 text-sm text-second-color">
            Sanitized, GPS-enabled vehicles driven by experienced, courteous local chauffeurs.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {fleet.map((car, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
          >
            {/* Vehicle Image Container */}
            <div className="relative w-full h-48 bg-slate-50 flex items-center justify-center p-4 overflow-hidden border-b border-slate-100">
              <Image
                src={car.imgUrl || "/car-01.png"}
                alt={`${car.brand} ${car.model}`}
                width={400}
                height={240}
                className="w-full h-full object-contain transform transition-transform duration-300 group-hover:scale-105"
              />
              <span className="absolute top-3 right-3 text-[11px] font-bold text-third-color bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200/70 shadow-sm">
                {car.category}
              </span>
            </div>

            {/* Vehicle Details */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-main-color">
                  {car.brand} {car.model}
                </h3>

                {/* Key Specs Pills */}
                <div className="flex flex-wrap items-center gap-2 mt-2.5">
                  <span className="inline-flex items-center gap-1 text-xs text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                    <Users className="w-3.5 h-3.5 text-third-color" />
                    <span>{car.seatingCapacity} Seater</span>
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                    <Fuel className="w-3.5 h-3.5 text-third-color" />
                    <span>{car.fuelType}</span>
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>AC Sanitized</span>
                  </span>
                </div>

                {/* Pricing Display */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-baseline justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 block">Rental Rate</span>
                    <span className="text-2xl font-black text-third-color">
                      ₹{car.pricePerKm}
                      <span className="text-xs font-normal text-slate-500"> / km</span>
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">
                    Excludes tolls & taxes
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <Link
                href={`/Bookings?car=${encodeURIComponent(`${car.brand} ${car.model}`)}`}
                className="mt-4 w-full py-2.5 px-4 rounded-xl bg-third-color hover:bg-purple-700 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-purple-600/25 transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Book This Car</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
