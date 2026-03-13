import { useEffect, useState } from "react";
import { getStaff } from "../services/services.api";

/**
 * Fetch active staff from backend
 */
export function useStaff() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        setLoading(true);
        setError("");

        const data = await getStaff();

        if (alive) setStaff(data);
      } catch (e) {
        if (alive) setError(e.message || "Failed to load staff");
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();

    return () => {
      alive = false;
    };
  }, []);

  return { staff, loading, error };
}