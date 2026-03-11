import { apiClient } from "../../services/apiClient";

/**
 * Fetch all services from backend for admin panel
 */
export async function listServices() {
  const res = await apiClient.get("/admin/services");
  return res.data.data;
}

/**
 * Create new service
 */
export async function createService(payload) {
  const res = await apiClient.post("/admin/services", payload);
  return res.data.data;
}

/**
 * Update service
 */
export async function updateService(id, payload) {
  const res = await apiClient.put(`/admin/services/${id}`, payload);
  return res.data.data;
}

/**
 * Toggle active/inactive state
 */
export async function toggleService(id) {
  const res = await apiClient.patch(`/admin/services/${id}/toggle`);
  return res.data.data;
}