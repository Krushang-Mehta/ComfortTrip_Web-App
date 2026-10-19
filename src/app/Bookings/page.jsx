"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  Car,
  MapPin,
  Calendar,
  Users,
  Compass,
  Plane,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Coins,
  Loader2,
  FileText,
  Sparkles,
} from "lucide-react";

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
  "Gondal Road, Rajkot",
  "Raiya Road, Rajkot",
  "Rajkot Junction Railway Station",
];

const destinationSuggestions = [
  "Somnath Temple, Somnath",
  "Dwarkadhish Temple, Dwarka",
  "Sasan Gir National Park",
  "Ahmedabad (SG Highway / Airport)",
  "Jamnagar City Center",
  "Morbi Ceramic Zone",
  "Diu Beach & Fort",
];

export default function BookingsWizard() {
  const { data: session } = useSession();
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [formData, setFormData] = useState({
    tripType: "Outstation-Round",
    pickupAddress: "",
    destinationAddress: "",
    pickupDateTime: "",
    returnDateTime: "",
    passengers: 4,
    carId: "",
    customerNotes: "",
    redeemPoints: false,
  });

  // Fleet & Pricing State
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
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
          setCars(data.cars);
          setSelectedCar(data.cars[0]);
          setFormData((prev) => ({ ...prev, carId: data.cars[0]._id }));
        }
      } catch (err) {
        console.error("Failed to load cars", err);
      } finally {
        setLoadingCars(false);
      }
    }
    loadCars();
  }, []);

  // Update selected car when carId changes
  const handleCarSelect = (car) => {
    setSelectedCar(car);
    setFormData((prev) => ({ ...prev, carId: car._id }));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (error) setError("");
  };

  // Pricing Calculation
  const baseDayRate = selectedCar ? Number(selectedCar.pricePerDay) || 2500 : 2500;
  let estimatedKm = 100;
  if (formData.tripType === "Outstation-Round") estimatedKm = 400;
  else if (formData.tripType === "Outstation-OneWay") estimatedKm = 220;
  else if (formData.tripType === "Airport") estimatedKm = 60;
  else if (formData.tripType === "Local") estimatedKm = 80;

  const perKmRate = selectedCar ? Number(selectedCar.pricePerKm) || 15 : 15;
  const distanceCost = estimatedKm * perKmRate;
  const grossTotal = Math.max(baseDayRate, distanceCost);
  const gstAmount = Math.round(grossTotal * 0.05);

  const availablePoints = session?.user?.rewardPoints ?? 0;
  const maxDiscount = formData.redeemPoints ? Math.min(availablePoints, 200) : 0;
  const netPayable = Math.max(0, grossTotal + gstAmount - maxDiscount);

  // Step 1 Validation
  const validateStep1 = () => {
    if (!formData.pickupAddress.trim()) {
      setError("Please specify your pickup location.");
      return false;
    }
    if (!formData.destinationAddress.trim()) {
      setError("Please specify your drop destination.");
      return false;
    }
    if (!formData.pickupDateTime) {
      setError("Please select your pickup date and time.");
      return false;
    }
    if (formData.tripType === "Outstation-Round" && !formData.returnDateTime) {
      setError("Please select your return date and time for round trips.");
      return false;
    }
    return true;
  };

  const nextStep = () => {
    setError("");
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2 && !selectedCar) {
      setError("Please select a vehicle to proceed.");
      return;
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
      setError("Please sign in or create an account to confirm your booking and earn reward points.");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        carId: formData.carId,
        carModel: `${selectedCar?.brand} ${selectedCar?.model}`,
        carCategory: selectedCar?.category,
        tripType: formData.tripType,
        pickupAddress: formData.pickupAddress,
        destinationAddress: formData.destinationAddress,
        pickupDateTime: new Date(formData.pickupDateTime).toISOString(),
        returnDateTime: formData.returnDateTime ? new Date(formData.returnDateTime).toISOString() : null,
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/20 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Wizard Header */}
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-third-color bg-purple-50 px-3.5 py-1 rounded-full border border-purple-200/60 inline-flex items-center gap-1.5 shadow-sm shadow-purple-500/10">
            <Sparkles className="w-3.5 h-3.5 text-third-color" />
            Instant Cab & Chauffeur Booking
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-main-color mt-3 tracking-tight">
            Book Your Ride with Comfort~Trip
          </h1>
          <p className="text-sm text-second-color mt-1">
            Transparent per-km billing • Verified Saurashtra Chauffeurs • 24x7 Support
          </p>
        </div>

        {/* Wizard Step Indicator */}
        {!createdBooking && (
          <div className="mb-10 max-w-xl mx-auto">
            <div className="flex items-center justify-between relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-slate-200 w-full z-0" />
              <div
                className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-third-color transition-all duration-300 z-0"
                style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
              />

              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    currentStep >= step
                      ? "bg-third-color text-white shadow-md shadow-purple-500/30 scale-105"
                      : "bg-white text-slate-400 border border-slate-300"
                  }`}
                >
                  {step}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs font-semibold text-second-color mt-2 px-1">
              <span>1. Route & Dates</span>
              <span>2. Select Vehicle</span>
              <span>3. Confirm & Pay</span>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-rose-800 text-xs">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-rose-900">Attention Required:</p>
              <p className="mt-0.5 text-rose-700">{error}</p>
            </div>
          </div>
        )}

        {/* Step 1: Trip Type, Route & Timing */}
        {currentStep === 1 && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl shadow-purple-500/5 border border-purple-100/80">
            <h2 className="text-xl font-bold text-main-color mb-6 flex items-center gap-2">
              <Compass className="w-5 h-5 text-third-color" />
              <span>Step 1: Choose Trip Type & Route</span>
            </h2>

            {/* Trip Type Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
              {tripTypes.map((type) => {
                const Icon = type.icon;
                const isSelected = formData.tripType === type.id;
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, tripType: type.id }))}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "border-third-color bg-purple-50/50 shadow-md shadow-purple-500/15"
                        : "border-slate-200 hover:border-purple-200 bg-white"
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-third-color mb-3">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-main-color">{type.label}</p>
                      <p className="text-[11px] text-second-color mt-0.5">{type.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Pickup & Destination Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-main-color mb-1.5">
                  Pickup Location (Rajkot)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <MapPin className="w-4 h-4 text-third-color" />
                  </div>
                  <input
                    type="text"
                    name="pickupAddress"
                    value={formData.pickupAddress}
                    onChange={handleInputChange}
                    placeholder="e.g. 150 Ft Ring Road, Rajkot"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-third-color/30 focus:border-third-color"
                    required
                  />
                </div>
                {/* Quick suggestions */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {rajkotLandmarks.slice(0, 3).map((l, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setFormData((p) => ({ ...p, pickupAddress: l }))}
                      className="text-[10px] text-slate-600 bg-slate-100 hover:bg-purple-100 hover:text-third-color px-2 py-0.5 rounded-full transition-colors cursor-pointer"
                    >
                      + {l.split(",")[0]}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-main-color mb-1.5">
                  Drop Destination
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <MapPin className="w-4 h-4 text-rose-500" />
                  </div>
                  <input
                    type="text"
                    name="destinationAddress"
                    value={formData.destinationAddress}
                    onChange={handleInputChange}
                    placeholder="e.g. Somnath Temple"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-third-color/30 focus:border-third-color"
                    required
                  />
                </div>
                {/* Quick suggestions */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {destinationSuggestions.slice(0, 3).map((d, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setFormData((p) => ({ ...p, destinationAddress: d }))}
                      className="text-[10px] text-slate-600 bg-slate-100 hover:bg-purple-100 hover:text-third-color px-2 py-0.5 rounded-full transition-colors cursor-pointer"
                    >
                      + {d.split(",")[0]}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Timing & Passengers */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-main-color mb-1.5">
                  Pickup Date & Time
                </label>
                <input
                  type="datetime-local"
                  name="pickupDateTime"
                  value={formData.pickupDateTime}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-third-color/30 focus:border-third-color"
                  required
                />
              </div>

              {formData.tripType === "Outstation-Round" ? (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-main-color mb-1.5">
                    Return Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    name="returnDateTime"
                    value={formData.returnDateTime}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-third-color/30 focus:border-third-color"
                    required
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Return Trip
                  </label>
                  <div className="px-3 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-400">
                    Not applicable for {formData.tripType}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-main-color mb-1.5">
                  Passengers
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Users className="w-4 h-4" />
                  </div>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    name="passengers"
                    value={formData.passengers}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-third-color/30 focus:border-third-color"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={nextStep}
                className="bg-third-color hover:bg-purple-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg shadow-purple-500/30 transition-all flex items-center gap-2 cursor-pointer transform hover:-translate-y-0.5 text-sm"
              >
                <span>Continue to Select Vehicle</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Vehicle Selection */}
        {currentStep === 2 && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl shadow-purple-500/5 border border-purple-100/80">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-main-color flex items-center gap-2">
                <Car className="w-5 h-5 text-third-color" />
                <span>Step 2: Select Your Preferred Vehicle</span>
              </h2>
              <span className="text-xs text-slate-500">
                Route: <strong>{formData.pickupAddress.split(",")[0]}</strong> &rarr; <strong>{formData.destinationAddress.split(",")[0]}</strong>
              </span>
            </div>

            {loadingCars ? (
              <div className="py-16 text-center text-slate-500 flex flex-col items-center gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-third-color" />
                <p className="text-sm">Fetching available fleet...</p>
              </div>
            ) : (
              <div className="space-y-4 mb-8">
                {cars.map((car) => {
                  const isSelected = selectedCar?._id === car._id;
                  const carPrice = Math.max(Number(car.pricePerDay), estimatedKm * Number(car.pricePerKm));
                  return (
                    <div
                      key={car._id}
                      onClick={() => handleCarSelect(car)}
                      className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        isSelected
                          ? "border-third-color bg-purple-50/40 shadow-md shadow-purple-500/15 ring-2 ring-third-color/20"
                          : "border-slate-200 hover:border-purple-200 bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-purple-100/60 flex items-center justify-center text-third-color shrink-0">
                          <Car className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-base text-main-color">
                              {car.brand} {car.model}
                            </h3>
                            <span className="text-[11px] font-semibold text-third-color bg-purple-100/60 px-2 py-0.5 rounded-full">
                              {car.category}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-second-color mt-1">
                            <span>{car.seatingCapacity} Passengers</span>
                            <span>•</span>
                            <span>{car.fuelType}</span>
                            <span>•</span>
                            <span>AC Climate Control</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right sm:border-l sm:border-slate-200 sm:pl-6">
                        <div className="text-xs text-slate-400">Estimated Total</div>
                        <div className="text-xl font-extrabold text-third-color">
                          ₹{carPrice.toLocaleString("en-IN")}
                        </div>
                        <div className="text-[11px] text-slate-500">₹{car.pricePerKm}/km</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={prevStep}
                className="text-sm font-semibold text-second-color hover:text-main-color px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer"
              >
                Back to Route
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="bg-third-color hover:bg-purple-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg shadow-purple-500/30 transition-all flex items-center gap-2 cursor-pointer transform hover:-translate-y-0.5 text-sm"
              >
                <span>Continue to Summary</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Passenger Details & Summary */}
        {currentStep === 3 && (
          <form
            onSubmit={handleBookingSubmit}
            className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl shadow-purple-500/5 border border-purple-100/80"
          >
            <h2 className="text-xl font-bold text-main-color mb-6 flex items-center gap-2">
              <FileText className="w-5 h-5 text-third-color" />
              <span>Step 3: Review Fare & Confirm Booking</span>
            </h2>

            {/* Trip Summary Card */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 mb-6 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-400">Selected Vehicle</p>
                  <p className="font-bold text-main-color mt-0.5">
                    {selectedCar?.brand} {selectedCar?.model} ({selectedCar?.category})
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Trip Type</p>
                  <p className="font-bold text-main-color mt-0.5">{formData.tripType}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Pickup Location</p>
                  <p className="font-medium text-main-color mt-0.5">{formData.pickupAddress}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Destination</p>
                  <p className="font-medium text-main-color mt-0.5">{formData.destinationAddress}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Pickup Timing</p>
                  <p className="font-medium text-main-color mt-0.5">
                    {new Date(formData.pickupDateTime).toLocaleString("en-IN")}
                  </p>
                </div>
                {formData.returnDateTime && (
                  <div>
                    <p className="text-xs text-slate-400">Return Timing</p>
                    <p className="font-medium text-main-color mt-0.5">
                      {new Date(formData.returnDateTime).toLocaleString("en-IN")}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Reward Points Wallet Redemption */}
            {session?.user && availablePoints > 0 && (
              <div className="bg-purple-50/70 border border-purple-200/80 rounded-2xl p-4 mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center text-third-color shrink-0">
                    <Coins className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-main-color">
                      Redeem Comfort Trip Wallet Points
                    </p>
                    <p className="text-[11px] text-second-color">
                      You have <strong>{availablePoints} pts</strong> available. Redeem to save ₹{maxDiscount}!
                    </p>
                  </div>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="redeemPoints"
                    checked={formData.redeemPoints}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-third-color rounded border-purple-300 focus:ring-third-color cursor-pointer"
                  />
                  <span className="text-xs font-semibold text-third-color">Apply Discount</span>
                </label>
              </div>
            )}

            {/* Special Instructions */}
            <div className="mb-6">
              <label className="block text-xs font-semibold uppercase tracking-wider text-main-color mb-1.5">
                Special Requests or Chauffeur Instructions (Optional)
              </label>
              <textarea
                name="customerNotes"
                value={formData.customerNotes}
                onChange={handleInputChange}
                rows={2}
                placeholder="e.g. Need child booster seat, arriving with 3 large suitcases"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-third-color/30 focus:border-third-color"
              />
            </div>

            {/* Itemized Fare Table */}
            <div className="border border-slate-200 rounded-2xl p-5 mb-8">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Fare Breakdown & Invoicing Estimate
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-second-color">
                  <span>Base Chauffeur Rental ({estimatedKm} km estimate)</span>
                  <span>₹{grossTotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-second-color">
                  <span>GST (5%)</span>
                  <span>+₹{gstAmount.toLocaleString("en-IN")}</span>
                </div>
                {formData.redeemPoints && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Reward Points Discount</span>
                    <span>-₹{maxDiscount}</span>
                  </div>
                )}
                <div className="border-t border-slate-200 pt-3 flex justify-between items-center">
                  <span className="text-base font-bold text-main-color">Total Estimated Payable:</span>
                  <span className="text-2xl font-black text-third-color">
                    ₹{netPayable.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 mt-3">
                * Tolls, state taxes, and parking fees will be billed as per actual receipts upon journey completion.
              </p>
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={prevStep}
                className="text-sm font-semibold text-second-color hover:text-main-color px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer"
              >
                Back to Vehicles
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="bg-third-color hover:bg-purple-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg shadow-purple-500/30 transition-all flex items-center gap-2 cursor-pointer transform hover:-translate-y-0.5 text-sm disabled:opacity-70"
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {submitting ? "Confirming Booking..." : "Confirm & Place Booking"}
              </button>
            </div>
          </form>
        )}

        {/* Step 4: Booking Confirmed Screen */}
        {currentStep === 4 && createdBooking && (
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-2xl shadow-purple-500/10 border border-purple-100 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5 border border-emerald-200">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Booking Placed Successfully
            </span>

            <h2 className="text-3xl font-extrabold text-main-color mt-3">
              Your Ride is Confirmed!
            </h2>
            <p className="text-sm text-second-color mt-1">
              Booking Reference: <strong className="text-third-color">{createdBooking.bookingId}</strong>
            </p>

            <div className="my-8 p-6 bg-slate-50 rounded-2xl border border-slate-200/80 max-w-md mx-auto text-left text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400 text-xs">Vehicle:</span>
                <span className="font-semibold text-main-color">
                  {selectedCar?.brand} {selectedCar?.model}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 text-xs">Route:</span>
                <span className="font-semibold text-main-color">
                  {createdBooking.pickupAddress?.split(",")[0]} &rarr; {createdBooking.destinationAddress?.split(",")[0]}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 text-xs">Pickup Timing:</span>
                <span className="font-semibold text-main-color">
                  {new Date(createdBooking.pickupDateTime).toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2">
                <span className="text-slate-400 text-xs">Estimated Fare:</span>
                <span className="font-bold text-third-color">
                  ₹{createdBooking.totalEstimatedAmount?.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-8">
              A confirmation receipt has been sent to your email. You can view your driver details and download your official PDF tax invoice once your trip concludes.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/profile"
                className="bg-third-color hover:bg-purple-700 text-white font-semibold px-6 py-2.5 rounded-xl shadow-md shadow-purple-500/25 transition-all text-sm"
              >
                View in My Profile
              </Link>
              <button
                type="button"
                onClick={() => {
                  setCreatedBooking(null);
                  setCurrentStep(1);
                }}
                className="border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium px-5 py-2.5 rounded-xl text-sm transition-colors cursor-pointer"
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
