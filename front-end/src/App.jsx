import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { GuestRoute, RoleRoute } from "./router/ProtectedRoute";
import Navbar from "./components/Navbar/Navbar";
import Landing from "./pages/Landing/Landing";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import StudentDashboard from "./pages/StudentDashboard/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard/TeacherDashboard";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";

function NotFound() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
      <div style={{ fontSize: "5rem" }}>🔍</div>
      <h1 className="page-heading">404 — Page Not Found</h1>
      <p className="text-muted">The page you're looking for doesn't exist.</p>
      <a href="/" className="btn btn-primary">Go Home</a>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* Public */}
          <Route path="/" element={<Landing />} />

          {/* Guest only (redirect if logged in) */}
          <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
          <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />

          {/* Role-protected dashboards */}
          <Route path="/student/*" element={<RoleRoute allowedRoles={["student"]}><StudentDashboard /></RoleRoute>} />
          <Route path="/teacher/*" element={<RoleRoute allowedRoles={["teacher"]}><TeacherDashboard /></RoleRoute>} />
          <Route path="/admin/*" element={<RoleRoute allowedRoles={["admin"]}><AdminDashboard /></RoleRoute>} />

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>

        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "var(--bg-card)",
              color: "var(--txt-primary)",
              border: "1px solid var(--border-normal)",
              borderRadius: "var(--radius-md)",
              fontSize: "0.88rem",
            },
            success: { iconTheme: { primary: "#22C55E", secondary: "#fff" } },
            error: { iconTheme: { primary: "#EF4444", secondary: "#fff" } },
          }}
        />
      </BrowserRouter>
    </AuthProvider>
  );
}
