// =============================================================
// file: useCreateBooking.jsx
// description: Custom hook for creating a booking 
// =============================================================

// src/hooks/useCreateBooking.js
import { useState } from "react";
import { createBooking } from "../services/MockApi";

export function useCreateBooking() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submitBooking(payload) {
    try {
      setLoading(true);
      setError("");
      return await createBooking(payload);
    } catch (e) {
      setError(e.message || "Booking failed");
      throw e;
    } finally {
      setLoading(false);
    }
  }

  return { loading, error, submitBooking };
}
