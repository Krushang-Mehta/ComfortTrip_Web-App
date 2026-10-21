"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Car,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
  Users,
  Fuel,
  Gauge,
  IndianRupee,
  UploadCloud,
  Image as ImageIcon,
} from "lucide-react";
import CustomDropdown from "@/components/common/CustomDropdown";
import { CardGridSkeleton } from "@/components/admin/AdminSkeleton";

const categories = ["All", "Sedan", "SUV", "Luxury", "Tempo Traveller", "Hatchback"];

const categoryOptions = [
  { value: "Sedan", label: "Sedan", subtitle: "Comfortable 4-seater" },
  { value: "SUV", label: "SUV", subtitle: "Spacious 6-7 seater" },
  { value: "Luxury", label: "Luxury", subtitle: "Executive VIP travel" },
  { value: "Tempo Traveller", label: "Tempo Traveller", subtitle: "Group & family tours" },
  { value: "Hatchback", label: "Hatchback", subtitle: "Compact city rides" },
];

const fuelOptions = [
  { value: "Diesel", label: "Diesel", subtitle: "High efficiency & torque" },
  { value: "Petrol", label: "Petrol", subtitle: "Smooth quiet ride" },
  { value: "CNG", label: "CNG", subtitle: "Eco-friendly economical" },
  { value: "Electric", label: "Electric", subtitle: "Zero emissions" },
];

const transmissionOptions = [
  { value: "Manual", label: "Manual", subtitle: "Standard transmission" },
  { value: "Automatic", label: "Automatic", subtitle: "Effortless automatic drive" },
];

const statusOptions = [
  { value: "available", label: "Available", subtitle: "Ready for live customer dispatch" },
  { value: "booked", label: "Booked", subtitle: "Currently reserved on journey" },
  { value: "maintenance", label: "Maintenance", subtitle: "Under routine workshop service" },
];

export default function AdminFleetManager() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [total, setTotal] = useState(0);

  // Modal States
  const [carModalOpen, setCarModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [deleteCarModal, setDeleteCarModal] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);

  // Form Fields
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    category: "Sedan",
    seatingCapacity: 4,
    fuelType: "Diesel",
    transmission: "Manual",
    pricePerKm: 12,
    pricePerDay: 2500,
    features: "Air Conditioning, Power Steering, Bluetooth, GPS Tracking",
    status: "available",
    imageUrl: "",
    cloudinaryPublicId: "",
  });

  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const handleImageFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image size must be less than 5MB");
      return;
    }

    try {
      setUploadingImage(true);
      setUploadError("");
      const body = new FormData();
      body.append("file", file);
      body.append("folder", "comfort-trip/cars");

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body,
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Upload failed");
      }

      setFormData((prev) => ({
        ...prev,
        imageUrl: data.url,
        cloudinaryPublicId: data.publicId,
      }));
    } catch (err) {
      setUploadError(err.message || "Failed to upload image to Cloudinary");
    } finally {
      setUploadingImage(false);
    }
  };

  const fetchCars = useCallback(async () => {
    try {
      const params = new URLSearchParams({ adminMode: "true" });
      if (selectedCategory !== "All") params.set("category", selectedCategory);
      if (searchQuery.trim()) params.set("search", searchQuery.trim());

      const res = await fetch(`/api/cars?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setCars(data.cars || []);
        setTotal(data.total || data.cars?.length || 0);
      }
    } catch (err) {
      console.error("[Fetch Fleet Error]", err);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    let ignore = false;
    async function sync() {
      try {
        const params = new URLSearchParams({ adminMode: "true" });
        if (selectedCategory !== "All") params.set("category", selectedCategory);
        if (searchQuery.trim()) params.set("search", searchQuery.trim());

        const res = await fetch(`/api/cars?${params.toString()}`);
        const data = await res.json();
        if (!ignore && data.success) {
          setCars(data.cars || []);
          setTotal(data.total || data.cars?.length || 0);
        }
      } catch (err) {
        console.error("[Fetch Fleet Error]", err);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }
    sync();
    return () => {
      ignore = true;
    };
  }, [selectedCategory, searchQuery]);

  function openCreateModal() {
    setEditingCar(null);
    setUploadError("");
    setFormData({
      brand: "",
      model: "",
      category: "Sedan",
      seatingCapacity: 4,
      fuelType: "Diesel",
      transmission: "Manual",
      pricePerKm: 12,
      pricePerDay: 2500,
      features: "Air Conditioning, Power Steering, Bluetooth, GPS Tracking",
      status: "available",
      imageUrl: "",
      cloudinaryPublicId: "",
    });
    setCarModalOpen(true);
  }

  function openEditModal(car) {
    setEditingCar(car);
    setUploadError("");
    setFormData({
      brand: car.brand || "",
      model: car.model || "",
      category: car.category || "Sedan",
      seatingCapacity: car.seatingCapacity || 4,
      fuelType: car.fuelType || "Diesel",
      transmission: car.transmission || "Manual",
      pricePerKm: car.pricePerKm || 12,
      pricePerDay: car.pricePerDay || 2500,
      features: Array.isArray(car.features) ? car.features.join(", ") : "",
      status: car.status || "available",
      imageUrl: car.images?.[0]?.url || "",
      cloudinaryPublicId: car.images?.[0]?.publicId || "",
    });
    setCarModalOpen(true);
  }

  async function handleFormSubmit(e) {
    e.preventDefault();
    try {
      setSubmitting(true);
      const payload = {
        brand: formData.brand.trim(),
        model: formData.model.trim(),
        category: formData.category,
        seatingCapacity: Number(formData.seatingCapacity),
        fuelType: formData.fuelType,
        transmission: formData.transmission,
        pricePerKm: Number(formData.pricePerKm),
        pricePerDay: Number(formData.pricePerDay),
        features: formData.features
          ? formData.features.split(",").map((f) => f.trim()).filter(Boolean)
          : [],
        status: formData.status,
      };

      if (formData.imageUrl.trim()) {
        payload.images = [
          {
            url: formData.imageUrl.trim(),
            publicId: formData.cloudinaryPublicId || "manual_url",
          },
        ];
      }

      let res;
      if (editingCar) {
        res = await fetch(`/api/cars/${editingCar._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/cars", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (data.success) {
        setAlertMessage({
          type: "success",
          text: editingCar ? "Vehicle details updated successfully." : "New vehicle added to fleet.",
        });
        setCarModalOpen(false);
        fetchCars();
      } else {
        setAlertMessage({ type: "error", text: data.message || "Failed to save vehicle" });
      }
    } catch (err) {
      console.error("[Save Vehicle Error]", err);
      setAlertMessage({ type: "error", text: "Network error occurred." });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteCar() {
    if (!deleteCarModal) return;
    try {
      setSubmitting(true);
      const res = await fetch(`/api/cars/${deleteCarModal._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setAlertMessage({ type: "success", text: `${deleteCarModal.brand} ${deleteCarModal.model} removed from fleet.` });
        setDeleteCarModal(null);
        fetchCars();
      } else {
        setAlertMessage({ type: "error", text: data.message || "Failed to delete vehicle" });
      }
    } catch (err) {
      console.error("[Delete Vehicle Error]", err);
      setAlertMessage({ type: "error", text: "Network error occurred." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {alertMessage && (
        <div
          className={`p-3.5 rounded-2xl flex items-center justify-between text-xs font-semibold shadow-md ${
            alertMessage.type === "success"
              ? "bg-emerald-600 text-white shadow-emerald-600/20"
              : "bg-rose-600 text-white shadow-rose-600/20"
          }`}
        >
          <span>{alertMessage.text}</span>
          <button
            type="button"
            onClick={() => setAlertMessage(null)}
            className="p-1 rounded-full hover:bg-white/20 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header and Controls */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Car className="w-5 h-5 text-purple-600" />
              <span>Fleet Manager & Vehicle Inventory</span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Configure fleet specifications, per-km rental pricing, and maintenance status
            </p>
          </div>
          <button
            type="button"
            onClick={openCreateModal}
            className="self-start sm:self-auto flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-md shadow-purple-600/30 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Vehicle</span>
          </button>
        </div>

        {/* Filter Tabs & Search */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            {categories.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                    active
                      ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          <div className="relative w-full lg:w-72 shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search brand, model..."
              className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-purple-600 focus:bg-white transition"
            />
          </div>
        </div>
      </div>

      {/* Fleet Grid */}
      {loading ? (
        <CardGridSkeleton count={6} />
      ) : cars.length === 0 ? (
        <div className="text-center py-20 text-slate-400 bg-white rounded-2xl border border-slate-200">
          <Car className="w-10 h-10 mx-auto mb-2 text-slate-300" />
          <p className="text-xs font-semibold text-slate-600">No vehicles found in fleet</p>
          <button
            type="button"
            onClick={openCreateModal}
            className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-purple-600 hover:underline"
          >
            + Register your first car
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {cars.map((car) => {
            const statusBadge = {
              available: "bg-emerald-50 text-emerald-700 border-emerald-200",
              booked: "bg-blue-50 text-blue-700 border-blue-200",
              maintenance: "bg-amber-50 text-amber-700 border-amber-200",
            };

            return (
              <div
                key={car._id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col hover:border-purple-200 transition"
              >
                {/* Image Banner */}
                <div className="relative h-44 bg-slate-100 w-full overflow-hidden">
                  {car.images?.[0]?.url ? (
                    <Image
                      src={car.images[0].url}
                      alt={`${car.brand} ${car.model}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <Car className="w-12 h-12" />
                    </div>
                  )}
                  <span
                    className={`absolute top-3 right-3 text-[10px] font-bold px-2.5 py-0.5 rounded-full border shadow-xs uppercase tracking-wider ${
                      statusBadge[car.status] || "bg-slate-50 text-slate-700 border-slate-200"
                    }`}
                  >
                    {car.status}
                  </span>
                  <span className="absolute bottom-3 left-3 text-xs font-bold bg-slate-900/80 text-white backdrop-blur-xs px-2.5 py-1 rounded-lg">
                    {car.category}
                  </span>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 leading-tight">
                      {car.brand} {car.model}
                    </h3>
                    <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-2">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-purple-600" />
                        <span>{car.seatingCapacity} Seater</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Fuel className="w-3.5 h-3.5 text-purple-600" />
                        <span>{car.fuelType}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Gauge className="w-3.5 h-3.5 text-purple-600" />
                        <span>{car.transmission}</span>
                      </span>
                    </div>

                    {/* Pricing */}
                    <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl mt-3 border border-slate-100">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold uppercase">Per Km</span>
                        <strong className="text-sm font-black text-purple-700">₹{car.pricePerKm}/km</strong>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block font-semibold uppercase">Daily Base</span>
                        <strong className="text-sm font-bold text-slate-900">₹{car.pricePerDay}/day</strong>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-2 pt-4 mt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => openEditModal(car)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5 text-slate-500" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteCarModal(car)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                      title="Remove from fleet"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Add / Edit Vehicle */}
      {carModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto"
          onClick={() => setCarModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 p-5 my-8 animate-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-sm font-bold text-slate-900">
                {editingCar ? "Edit Vehicle Details" : "Register New Fleet Vehicle"}
              </h3>
              <button
                type="button"
                onClick={() => setCarModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Brand</label>
                  <input
                    type="text"
                    required
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="e.g. Toyota"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Model</label>
                  <input
                    type="text"
                    required
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    placeholder="e.g. Innova Crysta"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="relative z-30">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <CustomDropdown
                    value={formData.category}
                    onChange={(val) => setFormData({ ...formData, category: val })}
                    options={categoryOptions}
                    placeholder="Category"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Seats</label>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    required
                    value={formData.seatingCapacity}
                    onChange={(e) => setFormData({ ...formData, seatingCapacity: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white transition"
                  />
                </div>
                <div className="relative z-30">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Fuel</label>
                  <CustomDropdown
                    value={formData.fuelType}
                    onChange={(val) => setFormData({ ...formData, fuelType: val })}
                    options={fuelOptions}
                    placeholder="Fuel"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="relative z-20">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Transmission</label>
                  <CustomDropdown
                    value={formData.transmission}
                    onChange={(val) => setFormData({ ...formData, transmission: val })}
                    options={transmissionOptions}
                    placeholder="Transmission"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Rate / Km (₹)</label>
                  <input
                    type="number"
                    min={5}
                    required
                    value={formData.pricePerKm}
                    onChange={(e) => setFormData({ ...formData, pricePerKm: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Rate / Day (₹)</label>
                  <input
                    type="number"
                    min={500}
                    required
                    value={formData.pricePerDay}
                    onChange={(e) => setFormData({ ...formData, pricePerDay: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white transition"
                  />
                </div>
              </div>

              {/* Fleet Image: Cloudinary Upload + Live Preview */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>Vehicle Photograph (Cloudinary Upload)</span>
                  {formData.imageUrl && (
                    <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Image Linked
                    </span>
                  )}
                </label>

                {/* Upload Box / Dropzone */}
                <div className="border-2 border-dashed border-slate-200 hover:border-purple-400 rounded-2xl p-4 bg-slate-50/70 text-center transition-all">
                  {formData.imageUrl ? (
                    <div className="flex items-center gap-4 text-left">
                      <div className="relative w-20 h-14 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                        <Image
                          src={formData.imageUrl}
                          alt="Vehicle preview"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-800 truncate">
                          {formData.brand || "Vehicle"} {formData.model}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate max-w-xs">
                          {formData.imageUrl}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <label className="text-[11px] text-purple-600 hover:text-purple-700 font-semibold cursor-pointer underline">
                            Replace Photo
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageFileUpload}
                              className="hidden"
                              disabled={uploadingImage}
                            />
                          </label>
                          <span className="text-slate-300">•</span>
                          <button
                            type="button"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                imageUrl: "",
                                cloudinaryPublicId: "",
                              }))
                            }
                            className="text-[11px] text-rose-600 hover:text-rose-700 font-semibold cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <label className="cursor-pointer block py-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileUpload}
                        className="hidden"
                        disabled={uploadingImage}
                      />
                      <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-2 border border-purple-200">
                        {uploadingImage ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <UploadCloud className="w-5 h-5" />
                        )}
                      </div>
                      <p className="text-xs font-semibold text-slate-700">
                        {uploadingImage
                          ? "Uploading asset to Cloudinary..."
                          : "Click to upload car photo"}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        PNG, JPG, WEBP, or AVIF up to 5MB (Stored in comfort-trip/cars)
                      </p>
                    </label>
                  )}

                  {uploadError && (
                    <p className="text-[11px] text-rose-600 font-medium mt-2">
                      {uploadError}
                    </p>
                  )}
                </div>

                {/* Optional Manual URL Fallback Input */}
                <div className="mt-2">
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        imageUrl: e.target.value,
                        cloudinaryPublicId: "manual_url",
                      })
                    }
                    placeholder="Or paste external image URL (e.g. Unsplash or direct CDN link)"
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-800 placeholder-slate-400 focus:outline-none focus:border-purple-600 focus:bg-white transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Features (comma separated)</label>
                <input
                  type="text"
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  placeholder="AC, Luggage Carrier, GPS, Bluetooth..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white transition"
                />
              </div>

              <div className="relative z-10">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
                <CustomDropdown
                  value={formData.status}
                  onChange={(val) => setFormData({ ...formData, status: val })}
                  options={statusOptions}
                  placeholder="Select status"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCarModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-md shadow-purple-600/30 transition disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? "Saving..." : editingCar ? "Update Vehicle" : "Create Vehicle"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Delete Confirmation */}
      {deleteCarModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setDeleteCarModal(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 p-5 animate-in zoom-in-95 duration-150"
          >
            <div className="flex items-center gap-3 text-rose-600 mb-3">
              <div className="w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Remove from Fleet?</h3>
            </div>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Are you sure you want to remove <strong>{deleteCarModal.brand} {deleteCarModal.model}</strong>? This will soft-delete the vehicle from active booking catalogs.
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteCarModal(null)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteCar}
                disabled={submitting}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-md shadow-rose-600/30 transition disabled:opacity-50 cursor-pointer"
              >
                {submitting ? "Removing..." : "Confirm Removal"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
