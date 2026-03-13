import { useState } from "react";
import { authApi } from "./auth.api";
import { useAuthStore } from "./auth.store";

export function useAuth() {
  const { setAuth, logout: clearAuth, isAuthed, user, token, bootstrapping } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function login(values) {
    try {
      setLoading(true);
      setError("");

      const data = await authApi.adminLogin(values);

      setAuth({
        token: data.accessToken,
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
    token,
    loading,
    error,
    bootstrapping,
  };
}