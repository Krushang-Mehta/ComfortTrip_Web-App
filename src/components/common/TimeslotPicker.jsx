"use client";

import React from "react";
import { Clock } from "lucide-react";

/**
 * TimeslotPicker Component
 * Clean, accessible dropdown for selecting trip pickup timeslots at 30-minute intervals.
 */
export default function TimeslotPicker({
  value,
  onChange,
  placeholder = "Select preferred time slot",
  error = false,
}) {
  // Generate 24-hour slots in 30-min intervals (48 slots)
  const timeSlots = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let min of ["00", "30"]) {
      const h12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      const ampm = hour < 12 ? "AM" : "PM";
      const formattedH = String(h12).padStart(2, "0");
      const label = `${formattedH}:${min} ${ampm}`;
      const val = `${String(hour).padStart(2, "0")}:${min}`;
      timeSlots.push({ label, value: val });
    }
  }

  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-600">
        <Clock className="w-4 h-4" />
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full pl-10 pr-8 py-2.5 bg-white border rounded-xl text-sm transition appearance-none cursor-pointer shadow-sm ${
          error
            ? "border-red-400 focus:ring-2 focus:ring-red-200"
            : "border-gray-200 hover:border-purple-300 focus:border-purple-600 focus:ring-2 focus:ring-purple-100"
        } ${value ? "text-gray-900 font-medium" : "text-gray-400"}`}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {timeSlots.map((slot) => (
          <option key={slot.value} value={slot.value} className="text-gray-800">
            {slot.label}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}
