"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  Car,
  MapPin,
  Users,
  Compass,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Coins,
  Loader2,
  FileText,
  Sparkles,
  Plane,
  Clock,
  ShieldAlert,
} from "lucide-react";
import AuthModal from "@/components/common/AuthModal";
import CustomDatePicker from "@/components/common/CustomDatePicker";
import TimeslotPicker from "@/components/common/TimeslotPicker";

const tripTypes = [
  { id: "Outstation-Round", label: "Round Trip", icon: Compass, desc: "Pilgrimage & Multi-day tours" },
  { id: "Outstation-OneWay", label: "One-Way Drop", icon: ArrowRight, desc: "Direct intercity drop" },
  { id: "Airport", label: "Airport Transfer", icon: Plane, desc: "Rajkot Airport (HCS)" },
  { id: "Local", label: "Local City Rental", icon: Clock, desc: "Hourly shopping & meetings" },
];

const rajkotLandmarks = [
  "Rajkot International Airport (HCS)",
  "150 Feet Ring Road, Rajkot",
  "Kalawad Road, Rajkot",
  "Yagnik Road, Rajkot",
];

const destinationSuggestions = [
  "Somnath Temple",
  "Dwarkadhish Temple",
  "Sasan Gir National Park",
  "Ahmedabad SG Highway",
];

export default function BookingsWizard() {
  const { data: session, status } = useSession();
  const [currentStep, setCurrentStep] = useState(1);
  const [dismissedAuthModal, setDismissedAuthModal] = useState(false);
  const showAuthModal = status === "unauthenticated" && !dismissedAuthModal;

  // Form State
  const [formData, setFormData] = useState({
    tripType: "Outstation-Round",
    pickupAddress: "",
    destinationAddress: "",
    pickupDate: "",
    pickupTime: "09:00",
    returnDate: "",
    returnTime: "18:00",
    passengers: 4,
    carId: "",
    customerNotes: "",
    redeemPoints: false,
  });

  // Fleet & Pricing State
  const [cars, setCars] = useState([]);
  const [loadingCars, setLoadingCars] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [createdBooking, setCreatedBooking] = useState(null);

  // Fetch Fleet from API
  useEffect(() => {
    async function loadCars() {
      try {
        const res = await fetch("/api/cars");
        const data = await res.json();
        if (data.success && data.cars?.length > 0) {
          // Strictly active fleet
          const activeOnly = data.cars.filter((c) => c.status === "available" && !c.isDeleted);
          setCars(activeOnly);
          if (activeOnly.length > 0) {
            setFormData((prev) => (prev.carId ? prev : { ...prev, carId: activeOnly[0]._id }));
          }
        }
      } catch (err) {
        console.error("Failed to load cars", err);
      } finally {
        setLoadingCars(false);
      }
    }
    loadCars();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (error) setError("");
  };

  // Passenger Recommendation & Filtering Engine
  const passengerCount = Number(formData.passengers) || 4;

  const processedCars = useMemo(() => {
    if (!cars || cars.length === 0) return [];

    return cars.map((car) => {
      const cap = Number(car.seatingCapacity) || 4;
      const isSedan = car.category === "Sedan" || cap <= 5;
      const isTraveller = car.category === "Tempo Traveller" || cap > 10;

      let isDisabled = false;
      let badge = null;
      let badgeColor = "purple";
      let priority = 2;

      if (passengerCount <= 5) {
        if (isSedan) {
          badge = "Recommended for 1–5 Passengers";
          badgeColor = "emerald";
          priority = 1;
        }
      } else if (passengerCount > 5 && passengerCount <= 12) {
        if (cap < passengerCount) {
          isDisabled = true;
          badge = `Exceeds Capacity (Max ${cap} Pax)`;
          badgeColor = "rose";
          priority = 4;
        } else {
          badge = "Spacious & Recommended for Groups";
          badgeColor = "purple";
          priority = 1;
        }
      } else if (passengerCount > 12) {
        if (!isTraveller || cap < passengerCount) {
          isDisabled = true;
          badge = `Exceeds Capacity (Max ${cap} Pax)`;
          badgeColor = "rose";
          priority = 4;
        } else {
          badge = "Ideal for Large Touring Groups";
          badgeColor = "purple";
          priority = 1;
        }
      }

      return {
        ...car,
        isDisabled,
        badge,
        badgeColor,
        priority,
      };
    }).sort((a, b) => a.priority - b.priority);
  }, [cars, passengerCount]);

  // Pure derived selected car ensuring active and not disabled
  const selectedCar = useMemo(() => {
    if (!processedCars || processedCars.length === 0) return null;
    const current = processedCars.find((c) => c._id === formData.carId && !c.isDisabled);
    if (current) return current;
    return processedCars.find((c) => !c.isDisabled) || processedCars[0];
  }, [processedCars, formData.carId]);

  // Trip duration calculation (in days)
  const tripDays = useMemo(() => {
    if (formData.tripType !== "Outstation-Round" || !formData.pickupDate || !formData.returnDate) {
      return 1;
    }
    const start = new Date(formData.pickupDate);
    const end = new Date(formData.returnDate);
    const diffTime = end - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(1, diffDays);
  }, [formData.tripType, formData.pickupDate, formData.returnDate]);

  // Pricing Calculation based on standard (Car rate/km * 350 km/day basis)
  const ratePerKm = selectedCar ? Number(selectedCar.pricePerKm) || 12 : 12;
  const baseEstimatedFare = ratePerKm * 350 * tripDays;
  const gstAmount = Math.round(baseEstimatedFare * 0.05);

  const availablePoints = session?.user?.rewardPoints ?? 0;
  const maxDiscount = formData.redeemPoints ? Math.min(availablePoints, 200) : 0;
  const totalPayableEstimate = Math.max(0, baseEstimatedFare + gstAmount - maxDiscount);

  // Step 1 Validation
  const validateStep1 = () => {
    if (!formData.pickupAddress.trim()) {
      setError("Please enter your pickup location in Rajkot.");
      return false;
    }
    if (!formData.destinationAddress.trim()) {
      setError("Please enter your drop destination.");
      return false;
    }
    if (!formData.pickupDate) {
      setError("Please select your preferred pickup date.");
      return false;
    }
    if (formData.tripType === "Outstation-Round" && !formData.returnDate) {
      setError("Please select your return date for the round trip.");
      return false;
    }
    return true;
  };

  const nextStep = () => {
    setError("");
    if (currentStep === 1) {
      if (!validateStep1()) return;
      if (status === "unauthenticated") {
        setShowAuthModal(true);
        return;
      }
    }
    if (currentStep === 2) {
      if (!selectedCar || selectedCar.isDisabled) {
        setError("Please choose a vehicle suitable for your passenger group.");
        return;
      }
    }
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  };

  const prevStep = () => {
    setError("");
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!session?.user) {
      setShowAuthModal(true);
      return;
    }

    setSubmitting(true);

    try {
      const pickupDateTime = new Date(`${formData.pickupDate}T${formData.pickupTime}:00`).toISOString();
      const returnDateTime =
        formData.tripType === "Outstation-Round" && formData.returnDate
          ? new Date(`${formData.returnDate}T${formData.returnTime}:00`).toISOString()
          : null;

      const payload = {
        carId: selectedCar._id,
        carModel: `${selectedCar.brand} ${selectedCar.model}`,
        carCategory: selectedCar.category,
        tripType: formData.tripType,
        pickupAddress: formData.pickupAddress,
        destinationAddress: formData.destinationAddress,
        pickupDateTime,
        returnDateTime,
        passengers: Number(formData.passengers) || 4,
        customerNotes: formData.customerNotes,
        redeemedPoints: maxDiscount,
      };

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to confirm booking. Please try again.");
      }

      setCreatedBooking(data.booking);
      setCurrentStep(4);
    } catch (err) {
      setError(err.message || "An unexpected error occurred while placing your booking.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-slate-50 via-purple-50/20 to-slate-100 py-4 sm:py-6 px-3 sm:px-6 lg:px-8 flex flex-col justify-center">
      {/* Auth Gate Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setDismissedAuthModal(true)} />

      <div className="max-w-3xl mx-auto w-full">
        {/* Wizard Compact Header */}
        <div className="text-center mb-5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-3 py-0.5 rounded-full border border-purple-200/60 inline-flex items-center gap-1 shadow-sm">
            <Sparkles className="w-3 h-3 text-purple-600" />
            Instant Cab & Chauffeur Booking
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-main-color mt-1.5 tracking-tight">
            Book Your Ride with Comfort~Trip
          </h1>
          <p className="text-xs text-second-color mt-0.5">
            Transparent per-km billing • Verified Saurashtra Chauffeurs • 24x7 Dispatch Support
          </p>
        </div>

        {/* Wizard Compact Step Indicator */}
        {!createdBooking && (
          <div className="mb-6 max-w-md mx-auto">
            <div className="flex items-center justify-between relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-slate-200 w-full z-0" />
              <div
                className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-purple-600 transition-all duration-300 z-0"
                style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
              />

              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    currentStep >= step
                      ? "bg-purple-600 text-white shadow-md shadow-purple-600/30 scale-105"
                      : "bg-white text-slate-400 border border-slate-300"
                  }`}
                >
                  {step}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-[11px] font-semibold text-second-color mt-1.5 px-0.5">
              <span>1. Trip & Dates</span>
              <span>2. Select Vehicle</span>
              <span>3. Review & Submit</span>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-rose-800 text-xs">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-rose-900">Attention Required:</p>
              <p className="mt-0.5 text-rose-700">{error}</p>
            </div>
          </div>
        )}

        {/* STEP 1: Trip Type, Route & Timing */}
        {currentStep === 1 && (
          <div className="bg-white rounded-2xl p-5 sm:p-7 shadow-lg shadow-purple-500/5 border border-purple-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-main-color flex items-center gap-2">
                <Compass className="w-4 h-4 text-purple-600" />
                <span>Step 1: Choose Trip Details & Route</span>
              </h2>
              <span className="text-xs text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-full font-medium">
                Step 1 of 3
              </span>
            </div>

            {/* Custom Styled Trip Type Dropdown */}
            <div className="mb-4">
              <label className="block text-xs font-semibold uppercase tracking-wider text-main-color mb-1">
                Select Trip Style
              </label>
              <div className="relative">
                <select
                  name="tripType"
                  value={formData.tripType}
                  onChange={handleInputChange}
                  className="w-full pl-3.5 pr-8 py-2.5 bg-purple-50/40 border border-purple-200 rounded-xl text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-600/30 focus:border-purple-600 cursor-pointer appearance-none transition"
                >
                  {tripTypes.map((t) => (
                    <option key={t.id} value={t.id} className="text-gray-800 font-medium">
                      {t.label} — {t.desc}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-purple-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Pickup & Destination Inputs with Action-Oriented Placeholders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-main-color mb-1">
                  Pickup Location in Rajkot
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-purple-600">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    name="pickupAddress"
                    value={formData.pickupAddress}
                    onChange={handleInputChange}
                    placeholder="Enter your pickup address or landmark in Rajkot"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-600/30 focus:border-purple-600"
                    required
                  />
                </div>
                {/* Fast Suggestions */}
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {rajkotLandmarks.map((l, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setFormData((p) => ({ ...p, pickupAddress: l }))}
                      className="text-[10px] text-slate-600 bg-slate-100 hover:bg-purple-100 hover:text-purple-700 px-2 py-0.5 rounded-full transition cursor-pointer"
                    >
                      + {l.split(",")[0]}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-main-color mb-1">
                  Drop Destination
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-rose-500">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    name="destinationAddress"
                    value={formData.destinationAddress}
                    onChange={handleInputChange}
                    placeholder="Enter your drop destination city or address"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-600/30 focus:border-purple-600"
                    required
                  />
                </div>
                {/* Fast Suggestions */}
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {destinationSuggestions.map((d, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setFormData((p) => ({ ...p, destinationAddress: d }))}
                      className="text-[10px] text-slate-600 bg-slate-100 hover:bg-purple-100 hover:text-purple-700 px-2 py-0.5 rounded-full transition cursor-pointer"
                    >
                      + {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Split Date & Time Fields with Responsive Custom Calendar & Timeslot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-main-color mb-1">
                  Pickup Date
                </label>
                <CustomDatePicker
                  value={formData.pickupDate}
                  onChange={(dateStr) => setFormData((p) => ({ ...p, pickupDate: dateStr }))}
                  placeholder="Select pickup date"
                  disablePast={true}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-main-color mb-1">
                  Pickup Time Slot
                </label>
                <TimeslotPicker
                  value={formData.pickupTime}
                  onChange={(timeStr) => setFormData((p) => ({ ...p, pickupTime: timeStr }))}
                  placeholder="Select preferred time slot"
                />
              </div>
            </div>

            {/* Round Trip Return Date & Time */}
            {formData.tripType === "Outstation-Round" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-4 p-3 bg-purple-50/40 rounded-xl border border-purple-100">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-purple-900 mb-1">
                    Return Date
                  </label>
                  <CustomDatePicker
                    value={formData.returnDate}
                    onChange={(dateStr) => setFormData((p) => ({ ...p, returnDate: dateStr }))}
                    placeholder="Select return date"
                    minDate={formData.pickupDate || null}
                    disablePast={true}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-purple-900 mb-1">
                    Return Time Slot
                  </label>
                  <TimeslotPicker
                    value={formData.returnTime}
                    onChange={(timeStr) => setFormData((p) => ({ ...p, returnTime: timeStr }))}
                    placeholder="Select return time slot"
                  />
                </div>
              </div>
            )}

            {/* Passengers Selector */}
            <div className="mb-6">
              <label className="block text-xs font-semibold uppercase tracking-wider text-main-color mb-1">
                Number of Passengers
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-purple-600">
                  <Users className="w-4 h-4" />
                </div>
                <select
                  name="passengers"
                  value={formData.passengers}
                  onChange={handleInputChange}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-600/30 focus:border-purple-600"
                >
                  {Array.from({ length: 16 }, (_, i) => i + 1).map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? "Passenger (Solo)" : num <= 4 ? "Passengers (Sedan / Compact)" : num <= 7 ? "Passengers (SUV)" : "Passengers (Tempo Traveller)"}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={nextStep}
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-2.5 rounded-xl shadow-md shadow-purple-600/25 transition-all flex items-center gap-2 cursor-pointer text-sm"
              >
                <span>Continue to Select Vehicle</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Vehicle Selection with Passenger Recommendation Engine */}
        {currentStep === 2 && (
          <div className="bg-white rounded-2xl p-5 sm:p-7 shadow-lg shadow-purple-500/5 border border-purple-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-main-color flex items-center gap-2">
                <Car className="w-4 h-4 text-purple-600" />
                <span>Step 2: Choose Your Vehicle</span>
              </h2>
              <span className="text-xs text-slate-500">
                Group Size: <strong>{passengerCount} Pax</strong>
              </span>
            </div>

            {loadingCars ? (
              <div className="py-12 text-center text-slate-500 flex flex-col items-center gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
                <p className="text-sm">Fetching verified available fleet...</p>
              </div>
            ) : (
              <div className="space-y-3 mb-6 max-h-[460px] overflow-y-auto pr-1">
                {processedCars.map((car) => {
                  const isSelected = selectedCar?._id === car._id;
                  return (
                    <div
                      key={car._id}
                      onClick={() => {
                        if (!car.isDisabled) {
                          setFormData((p) => ({ ...p, carId: car._id }));
                        }
                      }}
                      className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        car.isDisabled
                          ? "bg-slate-50 border-slate-200 opacity-60 cursor-not-allowed"
                          : isSelected
                          ? "border-purple-600 bg-purple-50/50 shadow-md shadow-purple-600/10 ring-2 ring-purple-600/20 cursor-pointer"
                          : "border-slate-200 hover:border-purple-200 bg-white cursor-pointer"
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                            isSelected ? "bg-purple-600 text-white" : "bg-purple-100 text-purple-600"
                          }`}
                        >
                          <Car className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-bold text-sm text-main-color">
                              {car.brand} {car.model}
                            </h3>
                            <span className="text-[10px] font-semibold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                              {car.category}
                            </span>
                            {car.badge && (
                              <span
                                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                  car.badgeColor === "emerald"
                                    ? "text-emerald-700 bg-emerald-50 border border-emerald-200"
                                    : car.badgeColor === "rose"
                                    ? "text-rose-700 bg-rose-50 border border-rose-200"
                                    : "text-purple-700 bg-purple-50 border border-purple-200"
                                }`}
                              >
                                {car.badge}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-xs text-second-color mt-1">
                            <span>{car.seatingCapacity} Seats</span>
                            <span>•</span>
                            <span>{car.fuelType}</span>
                            <span>•</span>
                            <span>AC Climate Control</span>
                          </div>
                        </div>
                      </div>

                      {/* Explicit Per-Km Rate Display ONLY */}
                      <div className="text-left sm:text-right sm:border-l sm:border-slate-100 sm:pl-4">
                        <div className="text-[11px] text-slate-400">Rate (Excl. Tolls)</div>
                        <div className="text-lg font-black text-purple-700">
                          ₹{car.pricePerKm}
                          <span className="text-xs font-normal text-slate-500"> / km</span>
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {car.isDisabled ? "Not suitable for pax count" : "Active & Available"}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={prevStep}
                className="text-xs font-semibold text-second-color hover:text-main-color px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer"
              >
                Back to Route
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-2.5 rounded-xl shadow-md shadow-purple-600/25 transition-all flex items-center gap-2 cursor-pointer text-sm"
              >
                <span>Continue to Summary</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Summary, 350 km/day Estimation & Compact Submit */}
        {currentStep === 3 && (
          <form
            onSubmit={handleBookingSubmit}
            className="bg-white rounded-2xl p-5 sm:p-7 shadow-lg shadow-purple-500/5 border border-purple-100"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-main-color flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-600" />
                <span>Step 3: Review Fare & Confirm Booking</span>
              </h2>
              <span className="text-xs text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-full font-medium">
                Step 3 of 3
              </span>
            </div>

            {/* Compact Trip Summary Card */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 mb-4 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <p className="text-slate-400 text-[11px]">Selected Vehicle</p>
                  <p className="font-bold text-main-color mt-0.5">
                    {selectedCar?.brand} {selectedCar?.model}
                  </p>
                  <p className="text-purple-600 font-semibold">₹{selectedCar?.pricePerKm}/km</p>
                </div>
                <div>
                  <p className="text-slate-400 text-[11px]">Trip Style</p>
                  <p className="font-semibold text-main-color mt-0.5">{formData.tripType}</p>
                  <p className="text-slate-500">{tripDays} {tripDays === 1 ? "Day" : "Days"}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-[11px]">Pickup Location</p>
                  <p className="font-medium text-main-color mt-0.5 truncate">{formData.pickupAddress}</p>
                  <p className="text-slate-500">{formData.pickupDate} {formData.pickupTime}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-[11px]">Destination</p>
                  <p className="font-medium text-main-color mt-0.5 truncate">{formData.destinationAddress}</p>
                  <p className="text-slate-500">{passengerCount} Passengers</p>
                </div>
              </div>
            </div>

            {/* Loyalty Reward Points Redemption */}
            {session?.user && availablePoints > 0 && (
              <div className="bg-purple-50/60 border border-purple-200 rounded-xl p-3 mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Coins className="w-4 h-4 text-purple-600 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-main-color">Redeem Wallet Points</p>
                    <p className="text-[11px] text-second-color">
                      You have <strong>{availablePoints} pts</strong> available. Save ₹{maxDiscount}!
                    </p>
                  </div>
                </div>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    name="redeemPoints"
                    checked={formData.redeemPoints}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-purple-600 rounded border-purple-300 focus:ring-purple-600 cursor-pointer"
                  />
                  <span className="text-xs font-semibold text-purple-700">Apply</span>
                </label>
              </div>
            )}

            {/* Special Instructions (Compact) */}
            <div className="mb-4">
              <label className="block text-xs font-semibold uppercase tracking-wider text-main-color mb-1">
                Special Requests or Chauffeur Instructions (Optional)
              </label>
              <input
                type="text"
                name="customerNotes"
                value={formData.customerNotes}
                onChange={handleInputChange}
                placeholder="Enter any specific requirements (e.g. child seat, roof luggage carrier)"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-600/30 focus:border-purple-600"
              />
            </div>

            {/* Itemized Fare Estimate based on (Car rate * 350 km/day) */}
            <div className="border border-slate-200 rounded-xl p-4 mb-4 bg-white">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-second-color">
                  <span>
                    Estimated Base Fare ({tripDays} Day × 350 km/day @ ₹{ratePerKm}/km)
                  </span>
                  <span>₹{baseEstimatedFare.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-second-color">
                  <span>GST (5%)</span>
                  <span>+₹{gstAmount.toLocaleString("en-IN")}</span>
                </div>
                {formData.redeemPoints && maxDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Reward Points Discount</span>
                    <span>-₹{maxDiscount}</span>
                  </div>
                )}
                <div className="border-t border-slate-200 pt-2 flex justify-between items-center">
                  <div>
                    <span className="text-sm font-bold text-main-color">Total Estimated Fare:</span>
                    <span className="block text-[10px] text-slate-400">
                      Standard Gujarat basis (350 km/day)
                    </span>
                  </div>
                  <span className="text-xl font-black text-purple-700">
                    ₹{totalPayableEstimate.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>

            {/* Clear Transparent Notice */}
            <div className="mb-5 p-2.5 bg-amber-50/70 rounded-xl border border-amber-200 flex items-start gap-2 text-[11px] text-amber-900 leading-snug">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>Transparent Fare Policy:</strong> The total amount displayed is an estimate based on the standard 350 km/day allowance. The admin dispatch desk will review your route and confirm final adjustments (tolls, parking, state taxes) upon booking approval.
              </span>
            </div>

            {/* Bottom Form Actions */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={prevStep}
                className="text-xs font-semibold text-second-color hover:text-main-color px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer"
              >
                Back to Vehicles
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-2.5 rounded-xl shadow-md shadow-purple-600/25 transition-all flex items-center gap-2 cursor-pointer text-sm disabled:opacity-70"
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {submitting ? "Submitting Booking..." : "Confirm & Send Booking Request"}
              </button>
            </div>
          </form>
        )}

        {/* STEP 4: Booking Placed Successfully Screen */}
        {currentStep === 4 && createdBooking && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl shadow-purple-500/10 border border-purple-100 text-center animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-200">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-0.5 rounded-full border border-emerald-200">
              Booking Request Received
            </span>

            <h2 className="text-2xl font-extrabold text-main-color mt-2.5">
              Your Booking Request is Placed!
            </h2>
            <p className="text-xs text-second-color mt-0.5">
              Booking Reference: <strong className="text-purple-700 font-bold">{createdBooking.bookingId}</strong>
            </p>

            <div className="my-5 p-4 bg-slate-50 rounded-xl border border-slate-200/80 max-w-sm mx-auto text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Vehicle:</span>
                <span className="font-semibold text-main-color">
                  {selectedCar?.brand} {selectedCar?.model}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Route:</span>
                <span className="font-semibold text-main-color truncate max-w-[200px]">
                  {createdBooking.pickupAddress?.split(",")[0]} &rarr; {createdBooking.destinationAddress?.split(",")[0]}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Timing:</span>
                <span className="font-semibold text-main-color">
                  {new Date(createdBooking.pickupDateTime).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })} ({formData.pickupTime})
                </span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2">
                <span className="text-slate-400">Estimated Base:</span>
                <span className="font-bold text-purple-700">
                  ₹{createdBooking.totalEstimatedAmount?.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
              A confirmation email has been dispatched. Our dispatch desk will assign a verified chauffeur and confirm any route adjustments.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/profile"
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-5 py-2 rounded-xl shadow-md shadow-purple-600/25 transition-all text-xs"
              >
                View in Customer Portal
              </Link>
              <button
                type="button"
                onClick={() => {
                  setCreatedBooking(null);
                  setCurrentStep(1);
                }}
                className="border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium px-4 py-2 rounded-xl text-xs transition cursor-pointer"
              >
                Book Another Trip
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
