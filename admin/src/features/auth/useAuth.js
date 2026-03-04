import { useState } from "react";
import { authApi } from "./auth.api";
import { useAuthStore } from "./auth.store";

export function useAuth() {
  const { setAuth, logout, isAuthed, user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function login(values) {
    setLoading(true);
    setError("");
    try {
      const data = await authApi.adminLogin(values);
      setAuth(data);
      return data;
    } catch (e) {
      setError(e.message || "Login failed");
      throw e;
    } finally {
      setLoading(false);
    }
  }

  return { login, logout, isAuthed, user, loading, error };
}