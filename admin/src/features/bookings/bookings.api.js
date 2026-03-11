import { apiClient } from "../../services/apiClient";

export async function listBookings(params = {}) {
  const res = await apiClient.get("/admin/bookings", { params });
  return res.data.data;
}

export async function updateBookingStatus(id, payload) {
  const res = await apiClient.patch(`/admin/bookings/${id}/status`, payload);
  return res.data.data;
}