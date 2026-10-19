import React from "react";
import Link from "next/link";
import Banners from "@/components/Banners";
import Subfooter from "@/components/Subfooter";
import Footer from "@/components/Footer";
import {
  ShieldCheck,
  Clock,
  Car,
  Award,
  MapPin,
  HeartHandshake,
  Sparkles,
  PhoneCall,
  CheckCircle2,
} from "lucide-react";

export const metadata = {
  title: "About Us | Comfort Trip — Leading Car Rental & Taxi Service in Rajkot",
  description:
    "Learn about Comfort Trip Car Rentals in Rajkot, Gujarat. Over a decade of providing affordable car rentals, punctual outstation taxis, airport transfers, and chauffeur-driven cabs across Saurashtra.",
  keywords: [
    "About Comfort Trip",
    "Car Rental Rajkot",
    "Best Car Rentals in Rajkot",
    "Taxi Service in Rajkot",
    "The Comfort trip",
    "Affordable car Rentals in Rajkot",
    "Car Bookings Rajkot",
    "Saurashtra Cab Service",
    "Rajkot cab Services"
  ],
  alternates: {
    canonical: "/about-us",
  },
};

const keyFeatures = [
  {
    icon: ShieldCheck,
    title: "100% Transparent Billing",
    description:
      "Zero hidden driver allowances, night charges, or surprise fees. Clear per-km pricing with automated GST tax invoices.",
  },
  {
    icon: Award,
    title: "Verified Professional Chauffeurs",
    description:
      "Every chauffeur undergoes strict background checks, route verification, and hospitality training for passenger safety.",
  },
  {
    icon: Car,
    title: "Immaculate & Maintained Fleet",
    description:
      "From economical sedans to luxury SUVs and 20-seater Tempo Travellers, all vehicles are thoroughly sanitized before every trip.",
  },
  {
    icon: Clock,
    title: "Punctuality & Airport Guarantee",
    description:
      "Flight-tracked pickups from Rajkot Hirasar International Airport (HCS) and doorstep arrivals 15 minutes before scheduled departure.",
  },
  {
    icon: MapPin,
    title: "Saurashtra & Gujarat Mastery",
    description:
      "Unmatched local knowledge for pilgrimage circuits including Somnath, Dwarka, Girnar, Sasan Gir, and Ahmedabad corridors.",
  },
  {
    icon: HeartHandshake,
    title: "24x7 Trip Coordination Support",
    description:
      "Dedicated help desk ready to assist with customized itineraries, emergency roadside aid, and itinerary adjustments anytime.",
  },
];

const pilgrimageRoutes = [
  {
    title: "Dwarka Dhish & Nageshwar Tour",
    distance: "230 km from Rajkot",
    duration: "Same day / 2 Days",
    desc: "Scenic highway drive to sacred Dwarkadhish Temple, Bet Dwarka, Rukmini Temple, and Nageshwar Jyotirlinga.",
  },
  {
    title: "Somnath Jyotirlinga & Diu Beach",
    distance: "200 km from Rajkot",
    duration: "2 Days Tour",
    desc: "Chauffeur-driven journey to the First Jyotirlinga at Somnath, Bhalka Tirth, and coastal leisure in Diu.",
  },
  {
    title: "Sasan Gir Lion Safari Circuit",
    distance: "160 km from Rajkot",
    duration: "Weekend Getaway",
    desc: "Reliable SUV transfers to the home of Asiatic Lions in Gir National Park and Devalia Safari Park.",
  },
  {
    title: "Ahmedabad & Gandhinagar Express",
    distance: "220 km via 6-lane Express",
    duration: "3.5 Hours Drop",
    desc: "Rapid point-to-point business transfers to SG Highway, GIFT City, Ahmedabad Airport, and Akshardham.",
  },
];

export default function AboutUs() {
  return (
    <main className="min-h-screen bg-slate-50 text-main-color">
      {/* Hero Banner */}
      <Banners
        img="/Our-info-About.png"
        title="About Comfort Trip"
        text="Rajkot's Trusted Partner for Premium Car Rentals & Chauffeur Services."
      />

      {/* Company Overview & Mission */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-third-color bg-purple-50 px-3.5 py-1 rounded-full border border-purple-200/60 inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-third-color" />
            Rajkot’s Premier Cab Service
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-main-color mt-4 tracking-tight leading-tight">
            Setting the Benchmark for Car Rentals in Rajkot & Saurashtra
          </h1>
          <p className="mt-4 text-base text-second-color leading-relaxed">
            Founded with a singular commitment to provide <strong>safe, punctual, and transparent</strong> cab booking
            solutions, <strong>Comfort Trip Car Rentals</strong> has evolved into Gujarat’s preferred choice for local city
            travel, airport transfers, corporate delegations, and outstation pilgrimage tours.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-14">
          {keyFeatures.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-7 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-purple-500/5 transition-all duration-300 group hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-200/60 flex items-center justify-center text-third-color group-hover:bg-third-color group-hover:text-white transition-colors duration-300">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-main-color mt-5">{item.title}</h3>
                <p className="text-sm text-second-color mt-2 leading-relaxed">{item.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Popular Pilgrimage & Outstation Routes */}
      <section className="bg-white py-16 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-main-color">
              Popular Outstation Routes from Rajkot
            </h2>
            <p className="text-sm text-second-color mt-2">
              Explore Saurashtra with our curated pilgrimage, wildlife, and commercial cab packages.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {pilgrimageRoutes.map((route, idx) => (
              <div
                key={idx}
                className="bg-slate-50 rounded-2xl p-6 border border-slate-200/70 hover:border-purple-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <span className="text-xs font-bold text-third-color bg-purple-100/60 px-2.5 py-0.5 rounded-full">
                    {route.duration}
                  </span>
                  <h3 className="text-base font-bold text-main-color mt-3">{route.title}</h3>
                  <p className="text-xs font-semibold text-slate-500 mt-1">{route.distance}</p>
                  <p className="text-xs text-second-color mt-3 leading-relaxed">{route.desc}</p>
                </div>
                <Link
                  href="/Bookings"
                  className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-third-color hover:underline"
                >
                  Book Cab for this Route &rarr;
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Service Guarantees */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-br from-main-color to-second-color text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-third-color/20 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              The Comfort Trip Promise
            </h2>
            <p className="text-slate-300 text-sm mt-3 leading-relaxed">
              When you hire a cab with Comfort Trip, you receive our uncompromised promise of safety,
              transparency, and hospitality.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="text-sm font-medium">Guaranteed On-Time Arrival</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="text-sm font-medium">Zero Hidden Surcharges</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="text-sm font-medium">GPS Enabled Tracking</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="text-sm font-medium">Downloadable Tax Invoices</span>
              </div>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/Bookings"
                className="bg-third-color hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-purple-600/30 transition-all text-sm transform hover:-translate-y-0.5"
              >
                Book Your Cab Now
              </Link>
              <a
                href="tel:+919974833330"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-medium px-5 py-3 rounded-xl transition-all text-sm border border-white/15"
              >
                <PhoneCall className="w-4 h-4" />
                <span>+91 9974833330</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <Subfooter />
      <Footer />
    </main>
  );
}
