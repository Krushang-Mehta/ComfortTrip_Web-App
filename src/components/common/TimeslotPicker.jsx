"use client";

import React, { useState, useEffect } from "react";
import { Clock, X, Check } from "lucide-react";

/**
 * TimeslotPicker Component
 * Renders as a clean input trigger that opens an elegant, centered
 * responsive timeslot modal grid. Completely eliminates bottom card/page overflow.
 */
export default function TimeslotPicker({
  value,
  onChange,
  placeholder = "Select preferred time slot",
  error = false,
}) {
  const [isOpen, setIsOpen] = useState(false);

  // Close modal on Escape key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

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

  const selectedSlot = timeSlots.find((s) => s.value === value);

  return (
    <div className="relative w-full">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`w-full flex items-center justify-between px-3.5 py-2.5 bg-white border rounded-xl text-left text-sm transition shadow-sm cursor-pointer ${
          error
            ? "border-red-400 focus:ring-2 focus:ring-red-200"
            : isOpen
            ? "border-purple-600 ring-2 ring-purple-100 shadow-md shadow-purple-500/10"
            : "border-gray-200 hover:border-purple-300"
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0 truncate">
          <Clock className="w-4 h-4 text-purple-600 shrink-0" />
          <span className={selectedSlot ? "text-gray-900 font-semibold" : "text-gray-400"}>
            {selectedSlot ? selectedSlot.label : placeholder}
          </span>
        </div>
        <div className="text-purple-600 shrink-0">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Centered Modal Overlay for Timeslot Selection */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px] animate-in fade-in duration-150"
          onClick={() => setIsOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl shadow-purple-600/30 border-2 border-purple-200 p-5 animate-in zoom-in-95 duration-150"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-gray-100 mb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-gray-900 leading-tight">
                    Select Trip Time Slot
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    Choose from 30-minute departure intervals
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Time Slot Grid with Responsive 3-4 Columns and Custom Scrollbar */}
            <div
              className="max-h-72 overflow-y-auto pr-1 grid grid-cols-3 sm:grid-cols-4 gap-2"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "#c084fc #f3e8ff",
              }}
            >
              {timeSlots.map((slot) => {
                const isSelected = slot.value === value;
                return (
                  <button
                    key={slot.value}
                    type="button"
                    onClick={() => {
                      onChange(slot.value);
                      setIsOpen(false);
                    }}
                    className={`py-2 px-2 rounded-xl text-xs font-semibold text-center transition cursor-pointer flex items-center justify-center gap-1 ${
                      isSelected
                        ? "bg-purple-600 text-white shadow-md shadow-purple-600/30 ring-2 ring-purple-600"
                        : "bg-slate-50 text-slate-700 hover:bg-purple-50 hover:text-purple-700 border border-slate-200"
                    }`}
                  >
                    <span>{slot.label}</span>
                    {isSelected && <Check className="w-3 h-3 text-white shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Bottom Actions */}
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
              <span className="text-gray-400">
                Selected: <strong className="text-purple-700">{selectedSlot?.label || "None"}</strong>
              </span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold px-4 py-1.5 rounded-lg transition"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
