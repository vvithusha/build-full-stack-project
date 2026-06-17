import { useAuth } from "../../context/AuthContext";

export default function AdminDashboard() {
  const { user } = useAuth();
  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        {[
          { icon: "🏠", label: "Overview" },
          { icon: "👨‍🏫", label: "Add Teacher" },
          { icon: "🎓", label: "Students" },
          { icon: "💳", label: "Fee Management" },
          { icon: "📊", label: "Marks Overview" },
          { icon: "🔔", label: "Post Alert" },
        ].map((item) => (
          <button key={item.label} className="sidebar-item"><span>{item.icon}</span> {item.label}</button>
        ))}
      </aside>
      <main className="dashboard-main">
        <h1 className="page-heading">Admin Panel</h1>
        <p className="page-subheading">Welcome, {user?.username}! Manage everything from here. 🛠️</p>
        <div className="stats-grid">
          <div className="stat-card"><div className="stat-label">Total Students</div><div className="stat-value">—</div></div>
          <div className="stat-card"><div className="stat-label">Teachers</div><div className="stat-value">—</div></div>
          <div className="stat-card"><div className="stat-label">Pending Fees</div><div className="stat-value">—</div></div>
          <div className="stat-card"><div className="stat-label">Active Alerts</div><div className="stat-value">—</div></div>
        </div>
        <div className="card"><p className="text-muted text-center" style={{ padding: "var(--space-7)" }}>🛠️ Full admin controls will be available in Phase 4.</p></div>
      </main>
    </div>
  );
}
