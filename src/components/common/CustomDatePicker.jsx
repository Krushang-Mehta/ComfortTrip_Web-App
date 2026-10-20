"use client";

import React, { useState, useRef, useEffect } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from "lucide-react";

/**
 * CustomDatePicker Component
 * A fully responsive, centered modal calendar date picker styled with brand purple (#9333ea).
 * Positions in the center of the viewport with a soft backdrop to completely eliminate bottom page overflow.
 */
export default function CustomDatePicker({
  value,
  onChange,
  placeholder = "Select date",
  minDate = null,
  maxDate = null,
  disablePast = true,
  isDob = false,
  error = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [customNavDate, setCustomNavDate] = useState(null);
  const containerRef = useRef(null);

  // Close modal when pressing Escape
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Compute active viewing year and month from navigation date or selected value
  const viewDate = customNavDate || (value ? new Date(value + "T00:00:00") : (isDob ? new Date(2000, 0, 1) : new Date()));
  const viewYear = viewDate.getFullYear();
  const viewMonth = viewDate.getMonth();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayHeaders = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  // Navigation handlers
  const handlePrevMonth = () => {
    setCustomNavDate(new Date(viewYear, viewMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setCustomNavDate(new Date(viewYear, viewMonth + 1, 1));
  };

  const handleYearChange = (newYear) => {
    setCustomNavDate(new Date(newYear, viewMonth, 1));
  };

  // Days calculation
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const normalizedMinDate = minDate ? new Date(minDate) : (disablePast ? today : null);
  if (normalizedMinDate) normalizedMinDate.setHours(0, 0, 0, 0);

  const normalizedMaxDate = maxDate ? new Date(maxDate) : (isDob ? today : null);
  if (normalizedMaxDate) normalizedMaxDate.setHours(23, 59, 59, 999);

  const isDayDisabled = (day) => {
    const checkDate = new Date(viewYear, viewMonth, day);
    checkDate.setHours(0, 0, 0, 0);
    if (normalizedMinDate && checkDate < normalizedMinDate) return true;
    if (normalizedMaxDate && checkDate > normalizedMaxDate) return true;
    return false;
  };

  const handleSelectDay = (day) => {
    if (isDayDisabled(day)) return;
    const selected = new Date(viewYear, viewMonth, day);
    const yyyy = selected.getFullYear();
    const mm = String(selected.getMonth() + 1).padStart(2, "0");
    const dd = String(selected.getDate()).padStart(2, "0");
    const formatted = `${yyyy}-${mm}-${dd}`;
    onChange(formatted);
    setCustomNavDate(null);
    setIsOpen(false);
  };

  // Format display date
  const displayValue = value
    ? new Date(value + "T00:00:00").toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Input Field Display Trigger */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-3.5 py-2.5 bg-white border rounded-xl cursor-pointer text-sm transition shadow-sm ${
          error
            ? "border-red-400 focus:ring-2 focus:ring-red-200"
            : isOpen
            ? "border-purple-600 ring-2 ring-purple-100 shadow-md shadow-purple-500/10"
            : "border-gray-200 hover:border-purple-300"
        }`}
      >
        <div className="flex items-center gap-2.5 truncate">
          <CalendarIcon className="w-4 h-4 text-purple-600 shrink-0" />
          <span className={displayValue ? "text-gray-900 font-semibold" : "text-gray-400"}>
            {displayValue || placeholder}
          </span>
        </div>
        {value && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange("");
            }}
            className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Centered Modal Dialog for Calendar Selection */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px] animate-in fade-in duration-150"
          onClick={() => setIsOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[340px] bg-white rounded-2xl shadow-2xl shadow-purple-600/30 border-2 border-purple-200 p-4 animate-in zoom-in-95 duration-150"
          >
            {/* Calendar Header with Month/Year Navigation */}
            <div className="flex items-center justify-between mb-3 px-1">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1.5 rounded-lg text-gray-600 hover:bg-purple-50 hover:text-purple-600 transition"
                aria-label="Previous Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-1.5 text-sm font-bold text-gray-900">
                <span>{monthNames[viewMonth]}</span>
                {isDob ? (
                  <select
                    value={viewYear}
                    onChange={(e) => handleYearChange(Number(e.target.value))}
                    className="bg-purple-50 text-purple-900 font-semibold rounded px-1.5 py-0.5 text-xs border-0 outline-none cursor-pointer"
                  >
                    {Array.from({ length: 80 }, (_, i) => new Date().getFullYear() - i).map((yr) => (
                      <option key={yr} value={yr}>
                        {yr}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span>{viewYear}</span>
                )}
              </div>

              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1.5 rounded-lg text-gray-600 hover:bg-purple-50 hover:text-purple-600 transition"
                aria-label="Next Month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Days of Week Header */}
            <div className="grid grid-cols-7 gap-1 text-center mb-1.5">
              {dayHeaders.map((dh, idx) => (
                <span
                  key={dh}
                  className={`text-[11px] font-semibold ${
                    idx === 0 ? "text-red-500" : "text-gray-400"
                  }`}
                >
                  {dh}
                </span>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1 text-center">
              {/* Empty Leading Cells */}
              {Array.from({ length: firstDayOfMonth }).map((_, idx) => (
                <div key={`empty-${idx}`} className="h-8 w-8" />
              ))}

              {/* Month Day Cells */}
              {Array.from({ length: daysInMonth }).map((_, idx) => {
                const day = idx + 1;
                const disabled = isDayDisabled(day);
                const isSelected =
                  value &&
                  new Date(value + "T00:00:00").getDate() === day &&
                  new Date(value + "T00:00:00").getMonth() === viewMonth &&
                  new Date(value + "T00:00:00").getFullYear() === viewYear;

                return (
                  <button
                    key={day}
                    type="button"
                    disabled={disabled}
                    onClick={() => handleSelectDay(day)}
                    className={`h-8 w-8 mx-auto rounded-lg text-xs flex items-center justify-center transition ${
                      isSelected
                        ? "bg-purple-600 text-white font-bold shadow-md shadow-purple-600/30"
                        : disabled
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-700 hover:bg-purple-50 hover:text-purple-700 font-medium cursor-pointer"
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            {/* Bottom Actions */}
            <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => {
                  const now = new Date();
                  const yyyy = now.getFullYear();
                  const mm = String(now.getMonth() + 1).padStart(2, "0");
                  const dd = String(now.getDate()).padStart(2, "0");
                  onChange(`${yyyy}-${mm}-${dd}`);
                  setCustomNavDate(null);
                  setIsOpen(false);
                }}
                className="text-purple-600 font-semibold hover:underline"
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold px-3 py-1 rounded-lg transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
