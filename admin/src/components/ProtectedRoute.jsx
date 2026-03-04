import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../features/auth/auth.store";

export default function ProtectedRoute({ children }) {
  const { isAuthed } = useAuthStore();
  const loc = useLocation();

  if (!isAuthed) return <Navigate to="/login" replace state={{ from: loc.pathname }} />;
  return children;
}