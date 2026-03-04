// =====================================================================
// file: useServices.js
// Description: Custom hook to fetch services from the backend API
// =====================================================================

// src/hooks/useServices.js
import { useEffect, useState } from "react";
import getServices from "../services/MockApi";

export function useServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getServices();
        if (alive) setServices(data);
      } catch (e) {
        if (alive) setError(e.message || "Failed to load services");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  return { services, loading, error };
}

