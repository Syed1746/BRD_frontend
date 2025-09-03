// src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ roles }) {
  const role = localStorage.getItem("role"); // "Admin", "Manager", "Employee"
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/" replace />; // not logged in
  if (roles && !roles.includes(role))
    return <Navigate to="/dashboard" replace />; // wrong role

  return <Outlet />;
}
