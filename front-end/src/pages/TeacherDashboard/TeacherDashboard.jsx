import { useAuth } from "../../context/AuthContext";

export default function TeacherDashboard() {
  const { user } = useAuth();
  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        {[
          { icon: "🏠", label: "Overview" },
          { icon: "📝", label: "Assign Homework" },
          { icon: "✏️", label: "Enter Marks" },
          { icon: "👥", label: "My Students" },
        ].map((item) => (
          <button key={item.label} className="sidebar-item"><span>{item.icon}</span> {item.label}</button>
        ))}
      </aside>
      <main className="dashboard-main">
        <h1 className="page-heading">Teacher Dashboard</h1>
        <p className="page-subheading">Hello, {user?.username}! Ready to teach? 📖</p>
        <div className="stats-grid">
          <div className="stat-card"><div className="stat-label">My Classes</div><div className="stat-value">—</div></div>
          <div className="stat-card"><div className="stat-label">Students</div><div className="stat-value">—</div></div>
          <div className="stat-card"><div className="stat-label">Homework Assigned</div><div className="stat-value">—</div></div>
        </div>
        <div className="card"><p className="text-muted text-center" style={{ padding: "var(--space-7)" }}>📝 Full teacher tools will be available in Phase 3.</p></div>
      </main>
    </div>
  );
}
