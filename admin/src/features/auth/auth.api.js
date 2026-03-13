import { apiClient } from "../../services/apiClient";

/**
 * Admin login
 */
export async function adminLogin({ email, password }) {
  const res = await apiClient.post("/auth/admin/login", {
    email,
    password,
  });

  return res.data.data;
}

/**
 * Get current logged-in admin/employee
 */
export async function getAdminMe() {
  const res = await apiClient.get("/auth/admin/me");
  return res.data.data.user;
}

/**
 * Refresh access token using refresh-token cookie
 */
export async function refreshAuth() {
  const res = await apiClient.post("/auth/refresh");
  return res.data.data;
}

/**
 * Logout admin
 */
export async function adminLogout() {
  const res = await apiClient.post("/auth/logout");
  return res.data;
}

export const authApi = {
  adminLogin,
  getAdminMe,
  refreshAuth,
  adminLogout,
};