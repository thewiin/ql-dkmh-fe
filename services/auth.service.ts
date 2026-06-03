import api from "../lib/axios";
import { LoginRequest, LoginResponse, UserProfile } from "../types";

const AuthService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
      const response = await api.post<LoginResponse>("/Auth/login", credentials);
      if (response.data && response.data.token) {
        localStorage.setItem("jwt_token", response.data.token);
        
        // Backend currently checks SinhViens table, so role is student
        const normalizedRole = "student";
        localStorage.setItem("auth_role", normalizedRole);
        
        const fullName = `${response.data.ho} ${response.data.ten}`.trim();
        localStorage.setItem("auth_user_name", fullName);
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
      const response = await api.get<UserProfile>("/Auth/me");
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default AuthService;
