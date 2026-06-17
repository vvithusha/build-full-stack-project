import { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verify token is still valid on mount
    const token = localStorage.getItem("access_token");
    if (token) {
      authAPI
        .getMe()
        .then((res) => {
          setUser(res.data);
          localStorage.setItem("user", JSON.stringify(res.data));
        })
        .catch(() => {
          logout();
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = (tokenResponse) => {
    const { access_token, role, user_id, username } = tokenResponse;
    const userData = { id: user_id, username, role };
    localStorage.setItem("access_token", access_token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const isAuthenticated = !!user;
  const isStudent = user?.role === "student";
  const isTeacher = user?.role === "teacher";
  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider
      value={{ user, loading, isAuthenticated, isStudent, isTeacher, isAdmin, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
