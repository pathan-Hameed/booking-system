import { useState } from "react";
import { createBooking } from "../services/booking.api";

/**
 * Create public booking
 */
export function useCreateBooking() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submitBooking(payload) {
    try {
      setLoading(true);
      setError("");

      const data = await createBooking(payload);
      return data;
    } catch (e) {
      setError(e.message || "Booking failed");
      throw e;
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    error,
    submitBooking,
  };
}