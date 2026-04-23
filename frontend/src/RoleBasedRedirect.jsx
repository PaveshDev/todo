import { Navigate } from "react-router-dom";

const RoleBasedRedirect = () => {
  const isAuthenticated = localStorage.getItem("isAuthenticated");
  const userRole = localStorage.getItem("userRole");
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (userRole === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }
  // Default to patient dashboard
  return <Navigate to="/" replace />;
};

export default RoleBasedRedirect;