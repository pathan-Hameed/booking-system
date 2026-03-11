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
 * Get current logged-in admin
 */
export async function getAdminMe() {
  const res = await apiClient.get("/auth/admin/me");
  return res.data.data.user;
}

/**
 * Logout admin
 */
export async function adminLogout() {
  const res = await apiClient.post("/auth/admin/logout");
  return res.data;
}

export const authApi = {
  adminLogin,
  getAdminMe,
  adminLogout,
};