import api from "../lib/api";
import { LoginRequest, LoginResponse, UserProfile } from "../types";

const AuthService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
      const response = await api.post<LoginResponse>("/auth/login", credentials);
      if (response.data && response.data.token) {
        localStorage.setItem("jwt_token", response.data.token);
        const normalizedRole =
          response.data.vaiTro?.toLowerCase().includes("admin") ? "admin" : "student";
        localStorage.setItem("auth_role", normalizedRole);
        localStorage.setItem("auth_user_name", response.data.tenNguoiDung || "");
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  logout: (): void => {
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("auth_role");
    localStorage.removeItem("auth_user_name");
  },

  getProfile: async (): Promise<UserProfile> => {
    try {
      const response = await api.get<UserProfile>("/auth/profile");
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default AuthService;
