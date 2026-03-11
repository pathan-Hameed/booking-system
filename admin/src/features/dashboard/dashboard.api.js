import { apiClient } from "../../services/apiClient";

export async function getDashboardStats() {
  const res = await apiClient.get("/admin/dashboard");
  return res.data.data;
}