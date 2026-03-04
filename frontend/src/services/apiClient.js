// ============================================
// file: apiClient.js
// description: API client for making requests to the backend API
// ============================================

// src/services/apiClient.js
import axios from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 15000,
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err?.response?.data?.message || err.message || "Something went wrong";
    return Promise.reject(new Error(message));
  }
);
