import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authApi } from "./auth.api";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("admin_token") || "");
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("admin_user");
    return raw ? JSON.parse(raw) : null;
  });
  const [bootstrapping, setBootstrapping] = useState(true);

  const setAuth = ({ token, user }) => {
    setToken(token);
    setUser(user);
    localStorage.setItem("admin_token", token);
    localStorage.setItem("admin_user", JSON.stringify(user));
  };

  const logout = () => {
    setToken("");
    setUser(null);
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
  };

  useEffect(() => {
    const bootstrapAuth = async () => {
      try {
        setBootstrapping(true);

        const storedToken = localStorage.getItem("admin_token");
        const storedUser = localStorage.getItem("admin_user");

        if (storedToken && storedUser) {
          try {
            const user = await authApi.getAdminMe();
            setAuth({ token: storedToken, user });
            return;
          } catch {
            // continue to refresh flow
          }
        }

        try {
          const data = await authApi.refreshAuth();
          setAuth({
            token: data.accessToken,
            user: data.user,
          });
        } catch {
          logout();
        }
      } finally {
        setBootstrapping(false);
      }
    };

    bootstrapAuth();
  }, []);

  const value = useMemo(
    () => ({
      token,
      user,
      bootstrapping,
      isAuthed: Boolean(token),
      setAuth,
      logout,
    }),
    [token, user, bootstrapping]
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuthStore() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuthStore must be used inside AuthProvider");
  return ctx;
}