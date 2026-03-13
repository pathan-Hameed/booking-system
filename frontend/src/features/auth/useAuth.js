import { useEffect, useState } from "react";
import {
  registerUser as registerUserApi,
  loginUser as loginUserApi,
  getCurrentUser,
  logoutUser as logoutUserApi,
  refreshToken,
} from "./auth.api";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [error, setError] = useState("");

  const bootstrapAuth = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("accessToken");

      if (!token) {
        try {
          const refreshed = await refreshToken();
          localStorage.setItem("accessToken", refreshed.accessToken);
          setUser(refreshed.user);
        } catch {
          setUser(null);
        }
      } else {
        const data = await getCurrentUser();
        setUser(data.user);
      }
    } catch {
      try {
        const refreshed = await refreshToken();
        localStorage.setItem("accessToken", refreshed.accessToken);
        setUser(refreshed.user);
      } catch {
        localStorage.removeItem("accessToken");
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload) => {
    try {
      setAuthLoading(true);
      setError("");
      const data = await registerUserApi(payload);
      localStorage.setItem("accessToken", data.accessToken);
      setUser(data.user);
      return { success: true };
    } catch (err) {
      setError(err.message || "Registration failed");
      return { success: false, message: err.message || "Registration failed" };
    } finally {
      setAuthLoading(false);
    }
  };

  const login = async (payload) => {
    try {
      setAuthLoading(true);
      setError("");
      const data = await loginUserApi(payload);
      localStorage.setItem("accessToken", data.accessToken);
      setUser(data.user);
      return { success: true };
    } catch (err) {
      setError(err.message || "Login failed");
      return { success: false, message: err.message || "Login failed" };
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = async () => {
    try {
      await logoutUserApi();
    } finally {
      localStorage.removeItem("accessToken");
      setUser(null);
    }
  };

  useEffect(() => {
    bootstrapAuth();
  }, []);

  return {
    user,
    loading,
    authLoading,
    error,
    register,
    login,
    logout,
    bootstrapAuth,
  };
}