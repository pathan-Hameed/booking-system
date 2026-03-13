import { apiClient } from "../../services/apiClient";

export async function registerUser(payload) {
  const res = await apiClient.post("/auth/register", payload);
  return res.data.data;
}

export async function loginUser(payload) {
  const res = await apiClient.post("/auth/login", payload);
  return res.data.data;
}

export async function getCurrentUser() {
  const res = await apiClient.get("/auth/me");
  return res.data.data;
}

export async function logoutUser() {
  const res = await apiClient.post("/auth/logout");
  return res.data;
}

export async function refreshToken() {
  const res = await apiClient.post("/auth/refresh");
  return res.data.data;
}