import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../../api/auth";
import toast from "react-hot-toast";

const PASSWORD_RULES = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
const PHONE_RULES = /^\+?[\d\s\-]{7,20}$/;

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 2-step form
  const [form, setForm] = useState({
    full_name: "", email: "", username: "", password: "", confirm_password: "",
    phone: "", parent_name: "", parent_phone: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateStep1 = () => {
    const errs = {};
    if (!form.full_name.trim() || form.full_name.trim().length < 2) errs.full_name = "Full name must be at least 2 characters";
    if (!/^[A-Za-z\s\-']+$/.test(form.full_name.trim())) errs.full_name = "Name can only contain letters, spaces, hyphens";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Valid email is required";
    if (!form.username.trim() || form.username.length < 3) errs.username = "Username must be at least 3 characters";
    if (!/^[A-Za-z0-9_]+$/.test(form.username)) errs.username = "Only letters, numbers, underscores";
    if (!PASSWORD_RULES.test(form.password)) errs.password = "Min 8 chars, 1 uppercase, 1 lowercase, 1 number";
    if (form.password !== form.confirm_password) errs.confirm_password = "Passwords do not match";
    return errs;
  };

  const validateStep2 = () => {
    const errs = {};
    if (form.phone && !PHONE_RULES.test(form.phone)) errs.phone = "Invalid phone format";
    if (form.parent_phone && !PHONE_RULES.test(form.parent_phone)) errs.parent_phone = "Invalid phone format";
    return errs;
  };

  const handleNext = () => {
    const errs = validateStep1();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validateStep2();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      await authAPI.register({
        full_name: form.full_name.trim(),
        email: form.email.trim().toLowerCase(),
        username: form.username.trim(),
        password: form.password,
        phone: form.phone || null,
        parent_name: form.parent_name || null,
        parent_phone: form.parent_phone || null,
      });
      toast.success("Account created! Please log in.");
      navigate("/login");
    } catch (err) {
      const msg = err.response?.data?.detail || "Registration failed. Please try again.";
      toast.error(msg);
      setErrors({ general: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card" style={{ maxWidth: 500 }}>
        <div className="auth-logo">🎓 EduCenter</div>
        <p className="auth-subtitle">
          {step === 1 ? "Create your student account" : "Almost done! (optional info)"}
        </p>

        {/* Step indicator */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24, justifyContent: "center" }}>
          {[1, 2].map((s) => (
            <div key={s} style={{
              width: 32, height: 4, borderRadius: 9999,
              background: s <= step ? "var(--clr-primary)" : "var(--border-normal)",
              transition: "var(--transition-slow)"
            }} />
          ))}
        </div>

        <form className="auth-form" onSubmit={step === 2 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }} noValidate>
          {errors.general && (
            <div className="alert-banner danger">
              <span className="alert-banner-msg">{errors.general}</span>
            </div>
          )}

          {step === 1 && (
            <>
              <div className="form-group">
                <label className="form-label" htmlFor="reg-full-name">Full Name *</label>
                <input id="reg-full-name" name="full_name" type="text" className={`form-control ${errors.full_name ? "error" : ""}`}
                  placeholder="e.g. John Smith" value={form.full_name} onChange={handleChange} maxLength={150} />
                {errors.full_name && <span className="form-error">{errors.full_name}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="reg-email">Email Address *</label>
                <input id="reg-email" name="email" type="email" className={`form-control ${errors.email ? "error" : ""}`}
                  placeholder="you@example.com" value={form.email} onChange={handleChange} maxLength={255} />
                {errors.email && <span className="form-error">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="reg-username">Username *</label>
                <input id="reg-username" name="username" type="text" className={`form-control ${errors.username ? "error" : ""}`}
                  placeholder="e.g. john_smith" value={form.username} onChange={handleChange} maxLength={50} />
                {errors.username && <span className="form-error">{errors.username}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="reg-password">Password *</label>
                <input id="reg-password" name="password" type="password" className={`form-control ${errors.password ? "error" : ""}`}
                  placeholder="Min 8 chars, uppercase, number" value={form.password} onChange={handleChange} maxLength={128} />
                {errors.password && <span className="form-error">{errors.password}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="reg-confirm">Confirm Password *</label>
                <input id="reg-confirm" name="confirm_password" type="password" className={`form-control ${errors.confirm_password ? "error" : ""}`}
                  placeholder="Repeat your password" value={form.confirm_password} onChange={handleChange} maxLength={128} />
                {errors.confirm_password && <span className="form-error">{errors.confirm_password}</span>}
              </div>

              <button id="reg-next-btn" type="submit" className="btn btn-primary btn-full btn-lg">
                Next →
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <div className="form-group">
                <label className="form-label" htmlFor="reg-phone">Your Phone (optional)</label>
                <input id="reg-phone" name="phone" type="tel" className={`form-control ${errors.phone ? "error" : ""}`}
                  placeholder="+94 77 123 4567" value={form.phone} onChange={handleChange} maxLength={20} />
                {errors.phone && <span className="form-error">{errors.phone}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="reg-parent-name">Parent / Guardian Name</label>
                <input id="reg-parent-name" name="parent_name" type="text" className="form-control"
                  placeholder="Parent's full name" value={form.parent_name} onChange={handleChange} maxLength={150} />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="reg-parent-phone">Parent Phone (optional)</label>
                <input id="reg-parent-phone" name="parent_phone" type="tel" className={`form-control ${errors.parent_phone ? "error" : ""}`}
                  placeholder="+94 77 123 4567" value={form.parent_phone} onChange={handleChange} maxLength={20} />
                {errors.parent_phone && <span className="form-error">{errors.parent_phone}</span>}
              </div>

              <div style={{ display: "flex", gap: 12 }}>
                <button type="button" className="btn btn-outline btn-full" onClick={() => setStep(1)}>
                  ← Back
                </button>
                <button id="reg-submit-btn" type="submit" className="btn btn-primary btn-full" disabled={loading}>
                  {loading ? "Creating…" : "Create Account"}
                </button>
              </div>
            </>
          )}
        </form>

        <div className="auth-footer">
          Already have an account?{" "}
          <Link to="/login" style={{ color: "var(--clr-primary-light)", fontWeight: 600 }}>Sign in</Link>
        </div>
      </div>
    </div>
  );
}
