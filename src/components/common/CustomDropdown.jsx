"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

/**
 * CustomDropdown Component
 * Fully custom styled select/dropdown with scrollable overflow,
 * brand purple accents (#9333ea), active link shadows, and zero OS native select popup spill.
 */
export default function CustomDropdown({
  value,
  onChange,
  options = [],
  placeholder = "Select an option",
  icon: TriggerIcon,
  maxHeight = "max-h-56",
  error = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-3.5 py-2.5 bg-white border rounded-xl text-left text-sm transition shadow-sm cursor-pointer ${
          error
            ? "border-red-400 focus:ring-2 focus:ring-red-200"
            : isOpen
            ? "border-purple-600 ring-2 ring-purple-100 shadow-md shadow-purple-500/10"
            : "border-gray-200 hover:border-purple-300"
        }`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2.5 min-w-0 flex-1 pr-2">
          {TriggerIcon && <TriggerIcon className="w-4 h-4 text-purple-600 shrink-0" />}
          {selectedOption?.icon && !TriggerIcon && (
            <selectedOption.icon className="w-4 h-4 text-purple-600 shrink-0" />
          )}
          <div className="truncate">
            <span className={selectedOption ? "text-gray-900 font-semibold" : "text-gray-400"}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            {selectedOption?.subtitle && (
              <span className="hidden sm:inline text-xs text-gray-500 ml-1.5 font-normal">
                — {selectedOption.subtitle}
              </span>
            )}
          </div>
        </div>

        <ChevronDown
          className={`w-4 h-4 text-purple-600 shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Custom Dropdown Menu with Scrollable Overflow */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1.5 z-50 bg-white rounded-2xl shadow-2xl shadow-purple-600/20 border border-purple-100 py-1.5 animate-in fade-in zoom-in-95 duration-150 overflow-hidden">
          <ul
            role="listbox"
            className={`${maxHeight} overflow-y-auto divide-y divide-gray-50 focus:outline-none`}
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#c084fc #f3e8ff",
            }}
          >
            {options.map((option) => {
              const isSelected = option.value === value;
              const OptionIcon = option.icon;

              return (
                <li
                  key={option.value}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`px-3.5 py-2.5 text-xs sm:text-sm flex items-center justify-between cursor-pointer transition ${
                    isSelected
                      ? "bg-purple-50/90 text-purple-900 font-bold border-l-4 border-purple-600"
                      : "text-gray-700 hover:bg-purple-50/50 hover:text-purple-700"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {OptionIcon && (
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                          isSelected ? "bg-purple-600 text-white" : "bg-purple-50 text-purple-600"
                        }`}
                      >
                        <OptionIcon className="w-3.5 h-3.5" />
                      </div>
                    )}
                    <div className="truncate">
                      <p className="font-semibold text-gray-900 leading-tight">
                        {option.label}
                      </p>
                      {option.subtitle && (
                        <p className="text-[11px] text-gray-500 mt-0.5 font-normal">
                          {option.subtitle}
                        </p>
                      )}
                    </div>
                  </div>

                  {isSelected && (
                    <Check className="w-4 h-4 text-purple-600 shrink-0 ml-2" />
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
