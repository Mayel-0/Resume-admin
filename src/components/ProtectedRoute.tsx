import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading } = useAuth(); 

  if (loading) return null;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return children;
}
