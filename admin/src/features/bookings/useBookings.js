import { useEffect, useState } from "react";
import { listBookings, updateBookingStatus } from "./bookings.api";

export function useBookings() {
  const [bookings, setBookings] = useState([]);
  const [meta, setMeta] = useState({
    total: 0,
    page: 1,
    limit: 20,
  });
  const [filters, setFilters] = useState({
    q: "",
    status: "all",
    page: 1,
    limit: 20,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchBookings = async (override = {}) => {
    try {
      setLoading(true);
      setError("");

      const nextFilters = { ...filters, ...override };
      const res = await listBookings(nextFilters);

      setBookings(res.items || []);
      setMeta({
        total: res.total || 0,
        page: res.page || 1,
        limit: res.limit || 20,
      });
      setFilters(nextFilters);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  const changeStatus = async (id, status) => {
    try {
      const updated = await updateBookingStatus(id, { status });

      setBookings((prev) =>
        prev.map((item) =>
          item._id === id || item.id === id ? updated : item
        )
      );

      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Failed to update booking status",
      };
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return {
    bookings,
    meta,
    filters,
    loading,
    error,
    fetchBookings,
    setFilters,
    changeStatus,
  };
}