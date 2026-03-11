// apps/admin/src/features/staff/useStaff.js
import { useEffect, useState } from "react";
import { listStaff, createStaff, updateStaffStatus, updateStaff } from "./staff.api";

export function useStaff() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchStaff = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await listStaff();
      setStaff(res.data || res);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch staff");
    } finally {
      setLoading(false);
    }
  };

  const addStaff = async (payload) => {
    try {
      const res = await createStaff(payload);
      const newStaff = res.data || res;
      setStaff((prev) => [newStaff, ...prev]);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Failed to add staff",
      };
    }
  };

  const editStaff = async (id, payload) => {
    try {
      const res = await updateStaff(id, payload);
      const updated = res.data || res;
      setStaff((prev) =>
        prev.map((item) => (item._id === id || item.id === id ? updated : item))
      );
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Failed to update staff",
      };
    }
  };

  const toggleStaffStatus = async (id, active) => {
    try {
      const res = await updateStaffStatus(id, active);
      const updated = res.data || res;
      setStaff((prev) =>
        prev.map((item) => (item._id === id || item.id === id ? updated : item))
      );
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Failed to update status",
      };
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  return {
    staff,
    loading,
    error,
    fetchStaff,
    addStaff,
    editStaff,
    toggleStaffStatus,
  };
}