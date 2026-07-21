import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ allowedRole }) {
  const { auth } = useAuth();

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && auth.role !== allowedRole) {
    const redirectPath =
      auth.role === "ADMIN"
        ? "/admin/dashboard"
        : "/customer/dashboard";

    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
}