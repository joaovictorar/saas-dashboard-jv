import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { getItem } from "../storage";

interface ProtectedRouteProps {
  children: ReactNode;
}

// Sem token salvo, manda de volta para o login. A validação real do
// token acontece no back-end (middleware auth) a cada requisição.
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  if (!getItem("token")) {
    return <Navigate to="/" replace />;
  }

  return children;
}
