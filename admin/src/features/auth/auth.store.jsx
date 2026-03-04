import { createContext, useContext, useMemo, useState } from "react";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("admin_token") || "");
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("admin_user");
    return raw ? JSON.parse(raw) : null;
  });

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthed: Boolean(token),
      setAuth: ({ token, user }) => {
        setToken(token);
        setUser(user);
        localStorage.setItem("admin_token", token);
        localStorage.setItem("admin_user", JSON.stringify(user));
      },
      logout: () => {
        setToken("");
        setUser(null);
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_user");
      },
    }),
    [token, user]
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuthStore() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuthStore must be used inside AuthProvider");
  return ctx;
}