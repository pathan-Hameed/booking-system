import { useState, useCallback } from "react";
import { getAvailability } from "../services/services.api";

export function useAvailability() {
  const [slotsByStaff, setSlotsByStaff] = useState([]);
  const [anyStaffSlots, setAnyStaffSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchAvailability = useCallback(
    async ({ serviceId, date, staffId }) => {
      try {
        setLoading(true);
        setError("");

        const data = await getAvailability({ serviceId, date, staffId });

        setSlotsByStaff(data.slotsByStaff || []);
        setAnyStaffSlots(data.anyStaffSlots || []);
        // console.log("slots available when no staff is selected:" , anyStaffSlots);        
      } catch (e) {
        setError(e.message || "Failed to load availability");
        setSlotsByStaff([]);
        setAnyStaffSlots([]);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    slotsByStaff,
    anyStaffSlots,
    loading,
    error,
    fetchAvailability,
  };
}
