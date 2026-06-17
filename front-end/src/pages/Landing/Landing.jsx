import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "var(--space-5)", textAlign: "center" }}>
      {/* Glow orbs */}
      <div style={{ position: "fixed", top: "-100px", left: "50%", transform: "translateX(-50%)", width: 600, height: 400, background: "radial-gradient(circle, rgba(108,99,255,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ animation: "slideUp 0.5s ease", maxWidth: 680 }}>
        <div style={{ fontSize: "4rem", marginBottom: "var(--space-4)" }}>🎓</div>

        <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "var(--space-3)", lineHeight: 1.1 }}>
          Welcome to{" "}
          <span style={{ background: "var(--grad-primary)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            EduCenter
          </span>
        </h1>

        <p style={{ fontSize: "1.1rem", color: "var(--txt-secondary)", marginBottom: "var(--space-7)", lineHeight: 1.7, maxWidth: 520, margin: "0 auto var(--space-7)" }}>
          A smart tuition management platform for students, teachers, and administrators. Track marks, fees, homework and more — all in one place.
        </p>

        <div style={{ display: "flex", gap: "var(--space-3)", justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/register" className="btn btn-primary btn-lg">
            Get Started — Register
          </Link>
          <Link to="/login" className="btn btn-outline btn-lg">
            Sign In
          </Link>
        </div>

        {/* Feature pills */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center", marginTop: "var(--space-7)" }}>
          {["📊 Live Marks", "💳 Fee Tracking", "📚 Homework", "🔔 Admin Alerts", "💬 AI Chat"].map((feat) => (
            <span key={feat} className="badge badge-purple" style={{ fontSize: "0.8rem", padding: "6px 14px" }}>{feat}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
