import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Redirect to login if not authenticated
export function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}

// Redirect to correct dashboard if wrong role visits
export function RoleRoute({ children, allowedRoles }) {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;

  if (!allowedRoles.includes(user?.role)) {
    // Redirect to their correct dashboard
    const dashboards = { student: "/student", teacher: "/teacher", admin: "/admin" };
    return <Navigate to={dashboards[user?.role] || "/login"} replace />;
  }

  return children;
}

// Redirect logged-in users away from login/register pages
export function GuestRoute({ children }) {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;

  if (isAuthenticated) {
    const dashboards = { student: "/student", teacher: "/teacher", admin: "/admin" };
    return <Navigate to={dashboards[user?.role] || "/"} replace />;
  }

  return children;
}
