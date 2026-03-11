// apps/admin/src/features/staff/staff.api.js
import { apiClient } from "../../services/apiClient";

export async function listStaff() {
  const res = await apiClient.get("/admin/staff");
  return res.data;
}

export async function createStaff(payload) {
  const res = await apiClient.post("/admin/staff", payload);
  return res.data;
}

export async function updateStaff(id, payload) {
  const res = await apiClient.put(`/admin/staff/${id}`, payload);
  return res.data;
}

export async function updateStaffStatus(id, active) {
  const res = await apiClient.patch(`/admin/staff/${id}/toggle`, { active });
  return res.data;
}