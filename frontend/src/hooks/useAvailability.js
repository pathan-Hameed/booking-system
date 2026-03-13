import { useState } from "react";
import { getAvailability } from "../services/services.api";

/**
 * Fetch dynamic slot availability
 */
export function useAvailability() {
  const [slotsByStaff, setSlotsByStaff] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchAvailability({ serviceId, date, staffId }) {
    try {
      setLoading(true);
      setError("");

      const data = await getAvailability({ serviceId, date, staffId });
      setSlotsByStaff(data.slotsByStaff || []);
    } catch (e) {
      setError(e.message || "Failed to load availability");
      setSlotsByStaff([]);
    } finally {
      setLoading(false);
    }
  }

  return {
    slotsByStaff,
    loading,
    error,
    fetchAvailability,
  };
}