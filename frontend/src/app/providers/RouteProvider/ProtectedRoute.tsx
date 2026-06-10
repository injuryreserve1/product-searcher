import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../AuthProvider/useAuthContext";

interface Props {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: Props) => {
  // if (!token) {
  //   return <Navigate to="/login" replace />;
  // }

  return children;
};
