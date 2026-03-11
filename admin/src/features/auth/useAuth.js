import { useState } from "react";
import { authApi } from "./auth.api";
import { useAuthStore } from "./auth.store";

export function useAuth() {
  const { setAuth, logout: clearAuth, isAuthed, user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function login(values) {
    try {
      setLoading(true);
      setError("");

      const data = await authApi.adminLogin(values);

      // We no longer store token manually because auth is cookie-based.
      setAuth({
        token: "cookie-session",
        user: data.user,
      });

      return data;
    } catch (e) {
      setError(e.message || "Login failed");
      throw e;
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    try {
      await authApi.adminLogout();
    } finally {
      clearAuth();
    }
  }

  return {
    login,
    logout,
    isAuthed,
    user,
    loading,
    error,
  };
}
