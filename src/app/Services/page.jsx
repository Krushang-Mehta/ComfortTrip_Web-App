import React from "react";
import Link from "next/link";
import Banners from "@/components/Banners";
import Subfooter from "@/components/Subfooter";
import Footer from "@/components/Footer";
import {
  Plane,
  MapPin,
  Clock,
  Compass,
  Briefcase,
  Users,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  ArrowRight,
} from "lucide-react";

export const metadata = {
  title: "Our Services | Affordable Car Rentals & Outstation Taxis in Rajkot",
  description:
    "Explore comprehensive car rental services by Comfort Trip in Rajkot. Outstation round trips to Somnath and Dwarka, airport pickups at Rajkot International Airport, hourly city cabs, and one-way drop taxis.",
  keywords: [
    "Car Rental Services Rajkot",
    "Taxi Service in Rajkot",
    "Affordable car Rentals in Rajkot",
    "Rajkot Airport Cab",
    "Outstation Cab Rajkot",
    "One Way Taxi Rajkot",
    "Best Car Rentals in Rajkot",
    "Car Bookings Rajkot",
    "The Comfort trip",
  ],
  alternates: {
    canonical: "/Services",
  },
};

const services = [
  {
    icon: Plane,
    title: "Rajkot Airport Transfers (HCS)",
    tag: "24/7 Flight Tracking",
    description:
      "Stress-free pickups and drops to Rajkot Hirasar International Airport (HCS). Our chauffeurs monitor live flight arrival times so your vehicle is ready at the terminal with zero waiting hassle.",
    highlights: ["Complimentary 45-min wait for delayed flights", "Doorstep luggage assistance", "Fixed transparent terminal rates"],
    recommendedFor: "Sedan / Premium SUV",
  },
  {
    icon: Compass,
    title: "Outstation Round Trips",
    tag: "Pilgrimage & Vacation",
    description:
      "Explore Saurashtra’s renowned spiritual and coastal destinations with experienced highway chauffeurs. Ideal for multi-day tours to Somnath, Dwarka, Sasan Gir, Diu, and Ahmedabad.",
    highlights: ["Transparent per-km rate breakdown", "Flexible night halts with zero extra driver surcharge", "Route expert chauffeurs"],
    recommendedFor: "Innova Crysta / Ertiga / Dzire",
  },
  {
    icon: MapPin,
    title: "One-Way Intercity Drop Taxis",
    tag: "Pay Strictly One Way",
    description:
      "Travel between Rajkot and major Gujarat cities without paying return distance or toll fees. Cost-effective one-way drops to Ahmedabad, Jamnagar, Surat, Vadodara, and Morbi.",
    highlights: ["Save up to 45% compared to round-trip cabs", "Door-to-door direct pickup", "Instant booking confirmation"],
    recommendedFor: "Hatchback / Sedan",
  },
  {
    icon: Clock,
    title: "Local Hourly City Rentals",
    tag: "4h / 8h / 12h Packages",
    description:
      "Hire a private car with chauffeur for city shopping, business meetings, medical appointments, or family gatherings in Rajkot without the inconvenience of hailing multiple taxis.",
    highlights: ["Unlimited stops within hourly package", "Air-conditioned comfort between destinations", "Extendable on demand"],
    recommendedFor: "Compact Sedan / Premium SUV",
  },
  {
    icon: Briefcase,
    title: "Corporate & Executive Fleets",
    tag: "Business & VIP Guests",
    description:
      "Professional chauffeur services for corporate delegates, factory visits in Morbi and Shapar, business conferences, and VIP delegations across Saurashtra.",
    highlights: ["Uniformed, English & Hindi fluent chauffeurs", "Monthly corporate consolidated billing", "Executive sedans & luxury SUVs"],
    recommendedFor: "Toyota Innova Crysta / Camry",
  },
  {
    icon: Users,
    title: "Group Tours & Tempo Travellers",
    tag: "Family & Wedding Events",
    description:
      "Spacious 12, 17, and 20-seater luxury Tempo Travellers equipped with push-back seats, powerful dual AC, and abundant luggage storage for wedding parties and large family pilgrimages.",
    highlights: ["Reclining luxury seats with armrests", "Large separate luggage compartments", "Experienced high-capacity bus captains"],
    recommendedFor: "12 / 17 / 20 Seater Tempo Travellers",
  },
];

const faqs = [
  {
    q: "How are car rental fares calculated at Comfort Trip Rajkot?",
    a: "Fares are calculated based on transparent per-kilometer rates plus state tolls, parking, and GST. We provide an exact itemized estimate prior to booking with zero hidden charges.",
  },
  {
    q: "Does Comfort Trip provide 24/7 pickup from Rajkot International Airport?",
    a: "Yes. We operate round the clock at Rajkot Hirasar International Airport (HCS). Our coordinators track your flight number in real time to adjust pickup timing seamlessly in case of flight delays.",
  },
  {
    q: "Can I download a tax invoice for business or reimbursement purposes?",
    a: "Yes! Every trip booked through Comfort Trip automatically generates a sequential, official GST-compliant tax receipt (e.g. CT-2026-001.pdf) available for download from your customer profile once the trip concludes.",
  },
  {
    q: "What reward benefits do customers receive on Comfort Trip?",
    a: "Every new user receives 100 Reward Points instantly upon registration. Additionally, submitting a feedback review after your ride credits another +5 reward points directly to your wallet for discounts on future bookings.",
  },
];

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-main-color">
      {/* Hero Banner */}
      <Banners
        img="/local-01.png"
        title="Car Rental & Taxi Services"
        text="Reliable, Sanitized & Chauffeur-Driven Vehicles Across Rajkot and Gujarat."
      />

      {/* Services Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-third-color bg-purple-50 px-3.5 py-1 rounded-full border border-purple-200/60 inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-third-color" />
            Comprehensive Travel Catalog
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-main-color mt-4 tracking-tight leading-tight">
            Tailored Car Rental Solutions for Every Journey
          </h1>
          <p className="mt-3 text-base text-second-color leading-relaxed">
            Whether you need a quick airport drop, an hourly local meeting car, or an extended pilgrimage tour to Somnath and Dwarka, Comfort Trip guarantees unmatched reliability and fair pricing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-14">
          {services.map((service, idx) => {
            const Icon = service.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-7 border border-slate-200/80 shadow-sm hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-200/60 flex items-center justify-center text-third-color group-hover:bg-third-color group-hover:text-white transition-colors duration-300">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-third-color bg-purple-50 px-3 py-1 rounded-full border border-purple-200/70">
                      {service.tag}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-main-color mt-5">{service.title}</h3>
                  <p className="text-sm text-second-color mt-2.5 leading-relaxed">{service.description}</p>

                  <div className="mt-5 space-y-2 border-t border-slate-100 pt-4">
                    {service.highlights.map((h, hIdx) => (
                      <div key={hIdx} className="flex items-start gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500">
                    Fleet: <strong className="text-main-color">{service.recommendedFor}</strong>
                  </span>
                  <Link
                    href="/Bookings"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-third-color hover:text-purple-700 hover:underline"
                  >
                    <span>Book Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* How Booking Works */}
      <section className="bg-white py-16 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-main-color">
              How It Works: 3 Simple Steps
            </h2>
            <p className="text-sm text-second-color mt-2">
              Booking your next ride with Comfort Trip is seamless and takes less than 2 minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="bg-slate-50 rounded-2xl p-6 text-center border border-slate-200/70">
              <div className="w-10 h-10 mx-auto rounded-full bg-third-color text-white font-bold flex items-center justify-center text-sm shadow-md shadow-purple-500/30">
                1
              </div>
              <h3 className="text-base font-bold text-main-color mt-4">Select Route & Vehicle</h3>
              <p className="text-xs text-second-color mt-2 leading-relaxed">
                Choose your pickup location, drop destination, travel dates, and select from our wide range of sedans and SUVs.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 text-center border border-slate-200/70">
              <div className="w-10 h-10 mx-auto rounded-full bg-third-color text-white font-bold flex items-center justify-center text-sm shadow-md shadow-purple-500/30">
                2
              </div>
              <h3 className="text-base font-bold text-main-color mt-4">Instant Booking Confirmation</h3>
              <p className="text-xs text-second-color mt-2 leading-relaxed">
                Receive instant booking verification with a sequential tracking ID (e.g. CT-2026-001) and transparent cost breakdown.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 text-center border border-slate-200/70">
              <div className="w-10 h-10 mx-auto rounded-full bg-third-color text-white font-bold flex items-center justify-center text-sm shadow-md shadow-purple-500/30">
                3
              </div>
              <h3 className="text-base font-bold text-main-color mt-4">Chauffeur Arrives On Time</h3>
              <p className="text-xs text-second-color mt-2 leading-relaxed">
                Receive driver contact and license details via email. Your verified chauffeur arrives at your doorstep for a smooth journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-third-color bg-purple-50 px-3 py-1 rounded-full border border-purple-200/70 mb-2">
            <HelpCircle className="w-3.5 h-3.5 text-third-color" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-main-color">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-second-color mt-1">
            Answers to common queries regarding car rental bookings in Rajkot
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm"
            >
              <h3 className="text-base font-bold text-main-color flex items-center gap-2">
                <span className="text-third-color font-black">Q.</span>
                <span>{faq.q}</span>
              </h3>
              <p className="text-sm text-second-color mt-2 pl-6 leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-gradient-to-r from-third-color to-purple-800 text-white rounded-3xl p-8 sm:p-12 text-center shadow-xl shadow-purple-500/20 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Ready to Book Your Next Journey in Rajkot?
            </h2>
            <p className="text-purple-100 text-sm mt-3">
              Join thousands of satisfied customers who trust Comfort Trip for punctual, safe, and comfortable car rentals across Gujarat.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/Bookings"
                className="bg-white text-third-color hover:bg-purple-50 font-bold px-7 py-3 rounded-xl shadow-lg transition-all text-sm transform hover:-translate-y-0.5"
              >
                Book Your Cab Now
              </Link>
              <Link
                href="/Cars"
                className="bg-purple-900/40 hover:bg-purple-900/60 text-white font-semibold px-6 py-3 rounded-xl border border-white/20 transition-all text-sm"
              >
                Explore Vehicle Fleet
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Subfooter />
      <Footer />
    </main>
  );
}
