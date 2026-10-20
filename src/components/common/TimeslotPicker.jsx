"use client";

import React from "react";
import { Clock } from "lucide-react";
import CustomDropdown from "./CustomDropdown";

/**
 * TimeslotPicker Component
 * Replaces native OS select with custom scrollable dropdown with purple accents.
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
    <CustomDropdown
      value={value}
      onChange={onChange}
      options={timeSlots}
      placeholder={placeholder}
      icon={Clock}
      maxHeight="max-h-56"
      error={error}
    />
  );
}
