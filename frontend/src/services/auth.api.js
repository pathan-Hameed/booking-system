import { apiClient } from "./apiClient";

/**
 * Optional helper to check if user is logged in
 */
export async function getMe() {
  const res = await apiClient.get("/auth/me");
  return res.data.data?.user;
}