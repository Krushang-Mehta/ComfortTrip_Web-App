"use client";

import { useState, useEffect, useCallback, useRef } from "react";

const DEFAULT_TTL_MINUTES = 30;

/**
 * useFormDraft Hook
 * Automatically persists form drafts in localStorage for 30 minutes.
 * Discards expired drafts gracefully and provides a clearDraft() method for
 * explicit cancellation or successful submission.
 *
 * @param {string} draftKey - Unique key for the form (e.g., 'booking_form', 'admin_car_modal')
 * @param {object} initialValues - Initial state of the form
 * @param {object} [options] - Options including ttlMinutes
 */
export function useFormDraft(draftKey, initialValues, options = {}) {
  const ttlMs = (options.ttlMinutes || DEFAULT_TTL_MINUTES) * 60 * 1000;
  const storageKey = `ct_draft_${draftKey}`;

  // Initialize form data lazily from localStorage (React 19 compliant)
  const [formData, setFormData] = useState(() => {
    if (typeof window === "undefined") return initialValues;

    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.timestamp && parsed.data) {
          const age = Date.now() - parsed.timestamp;
          if (age < ttlMs) {
            return {
              ...initialValues,
              ...parsed.data,
            };
          } else {
            localStorage.removeItem(storageKey);
          }
        }
      }
    } catch (e) {
      console.warn(`[useFormDraft] Failed to restore draft for "${draftKey}":`, e);
    }
    return initialValues;
  });

  // Initialize isRestored flag lazily from localStorage
  const [isRestored, setIsRestored] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.timestamp && Date.now() - parsed.timestamp < ttlMs) {
          return true;
        }
      }
    } catch {
      // ignore
    }
    return false;
  });

  const isInitialMount = useRef(true);

  // Persist changes with auto-save
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    try {
      const payload = {
        data: formData,
        timestamp: Date.now(),
      };
      localStorage.setItem(storageKey, JSON.stringify(payload));
    } catch (e) {
      console.warn(`[useFormDraft] Failed to persist draft for "${draftKey}":`, e);
    }
  }, [formData, storageKey, draftKey]);

  // Method to clear draft on cancel or submit
  const clearDraft = useCallback(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(storageKey);
      } catch (e) {
        console.warn(`[useFormDraft] Failed to clear draft for "${draftKey}":`, e);
      }
    }
    setFormData(initialValues);
    setIsRestored(false);
  }, [storageKey, initialValues, draftKey]);

  return {
    formData,
    setFormData,
    isRestored,
    clearDraft,
  };
}
