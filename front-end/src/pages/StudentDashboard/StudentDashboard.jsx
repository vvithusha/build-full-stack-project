import { useAuth } from "../../context/AuthContext";

export default function StudentDashboard() {
  const { user } = useAuth();
  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        {[
          { icon: "🏠", label: "Overview" },
          { icon: "📊", label: "My Marks" },
          { icon: "💳", label: "Fee Status" },
          { icon: "📚", label: "Homework" },
          { icon: "🔔", label: "Alerts" },
        ].map((item) => (
          <button key={item.label} className="sidebar-item">
            <span>{item.icon}</span> {item.label}
          </button>
        ))}
      </aside>
      <main className="dashboard-main">
        <h1 className="page-heading">Student Dashboard</h1>
        <p className="page-subheading">Welcome back, {user?.username}! 👋</p>
        <div className="stats-grid">
          <div className="stat-card"><div className="stat-label">Overall %</div><div className="stat-value">—</div><div className="stat-sub">Coming in Phase 3</div></div>
          <div className="stat-card"><div className="stat-label">Pending Fees</div><div className="stat-value">—</div><div className="stat-sub">Coming in Phase 3</div></div>
          <div className="stat-card"><div className="stat-label">Homework</div><div className="stat-value">—</div><div className="stat-sub">Coming in Phase 3</div></div>
          <div className="stat-card"><div className="stat-label">Alerts</div><div className="stat-value">—</div><div className="stat-sub">Coming in Phase 3</div></div>
        </div>
        <div className="card"><p className="text-muted text-center" style={{ padding: "var(--space-7)" }}>📊 Full dashboard content will be available in Phase 3.</p></div>
      </main>
    </div>
  );
}
