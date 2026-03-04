// =============================================================
// file: useAvailability.js
// Description: Custom hook to fetch availability data from the backend API
// =============================================================

// src/hooks/useAvailability.js
import { useState } from "react";
import { getAvailability } from "../services/MockApi";

export function useAvailability() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchAvailability({ date, serviceId }) {
    try {
      setLoading(true);
      setError("");
      const data = await getAvailability({ date, serviceId });
      setSlots(data.slots);
    } catch (e) {
      setError(e.message || "Failed to load availability");
      setSlots([]);
    } finally {
      setLoading(false);
    }
  }

  return { slots, loading, error, fetchAvailability };
}