import API from "../api";

const authService = {
  register: (data) => API.post("/auth/register", data),
  verifyOtp: (data) => API.post("/auth/verify-otp", data),
  resendOtp: (data) => API.post("/auth/resend-otp", data),
  login: (data) => API.post("/auth/login", data),
  logout: () => API.post("/auth/logout"),
  getProfile: () => API.get("/auth/profile"),
  updateProfile: (data) => API.put("/auth/profile", data),
  changePassword: (data) => API.put("/auth/change-password", data),
};

export default authService;
