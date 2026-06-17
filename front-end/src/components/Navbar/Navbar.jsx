import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const dashboardLink = () => {
    if (!user) return "/login";
    const map = { student: "/student", teacher: "/teacher", admin: "/admin" };
    return map[user.role] || "/";
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        🎓 EduCenter
      </Link>

      <div className="navbar-links">
        {isAuthenticated ? (
          <>
            <Link to={dashboardLink()}>Dashboard</Link>
            <span style={{ color: "var(--txt-muted)", fontSize: "0.82rem" }}>
              {user?.username} ({user?.role})
            </span>
            <button className="btn btn-outline btn-sm" onClick={handleLogout}>
              Sign Out
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="btn btn-primary btn-sm">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
