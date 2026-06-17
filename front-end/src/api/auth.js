import axiosInstance from "./axiosInstance";

export const authAPI = {
  register: (data) => axiosInstance.post("/api/auth/register", data),
  login: (data) => axiosInstance.post("/api/auth/login", data),
  getMe: () => axiosInstance.get("/api/auth/me"),
  health: () => axiosInstance.get("/api/health"),
};
