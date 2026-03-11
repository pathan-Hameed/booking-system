import { useEffect, useState } from "react";
import {
  listServices,
  createService,
  updateService,
  toggleService,
} from "./services.api";

export function useServicesAdmin() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await listServices();
      setServices(res.data || res);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch services");
    } finally {
      setLoading(false);
    }
  };

  const addService = async (payload) => {
    try {
      const res = await createService(payload);
      const newService = res.data || res;
      setServices((prev) => [newService, ...prev]);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Failed to add service",
      };
    }
  };

  const editService = async (id, payload) => {
    try {
      const res = await updateService(id, payload);
      const updated = res.data || res;
      setServices((prev) =>
        prev.map((item) => (item._id === id || item.id === id ? updated : item))
      );
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Failed to update service",
      };
    }
  };

  const toggleServiceStatus = async (id) => {
    try {
      const res = await toggleService(id);
      const updated = res.data || res;
      setServices((prev) =>
        prev.map((item) => (item._id === id || item.id === id ? updated : item))
      );
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Failed to update service status",
      };
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return {
    services,
    loading,
    error,
    fetchServices,
    addService,
    editService,
    toggleServiceStatus,
  };
}