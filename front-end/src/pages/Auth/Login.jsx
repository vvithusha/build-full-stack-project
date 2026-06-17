import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { authAPI } from "../../api/auth";
import toast from "react-hot-toast";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.username.trim()) errs.username = "Username or email is required";
    if (!form.password) errs.password = "Password is required";
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      const res = await authAPI.login({ username: form.username, password: form.password });
      login(res.data);
      toast.success(`Welcome back, ${res.data.username}!`);
      const dashboards = { student: "/student", teacher: "/teacher", admin: "/admin" };
      navigate(dashboards[res.data.role] || "/");
    } catch (err) {
      const msg = err.response?.data?.detail || "Invalid credentials. Please try again.";
      toast.error(msg);
      setErrors({ general: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-logo">🎓 EduCenter</div>
        <p className="auth-subtitle">Sign in to your account</p>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {errors.general && (
            <div className="alert-banner danger" style={{ borderRadius: "var(--radius-md)" }}>
              <span className="alert-banner-msg">{errors.general}</span>
            </div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="login-username">Username or Email</label>
            <input
              id="login-username"
              name="username"
              type="text"
              autoComplete="username"
              className={`form-control ${errors.username ? "error" : ""}`}
              placeholder="Enter your username or email"
              value={form.username}
              onChange={handleChange}
              maxLength={255}
            />
            {errors.username && <span className="form-error">{errors.username}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login-password">Password</label>
            <input
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              className={`form-control ${errors.password ? "error" : ""}`}
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              maxLength={128}
            />
            {errors.password && <span className="form-error">{errors.password}</span>}
          </div>

          <button
            id="login-submit-btn"
            type="submit"
            className="btn btn-primary btn-full btn-lg"
            disabled={loading}
          >
            {loading ? <><span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Signing in…</> : "Sign In"}
          </button>
        </form>

        <div className="auth-footer">
          New student?{" "}
          <Link to="/register" style={{ color: "var(--clr-primary-light)", fontWeight: 600 }}>
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}
