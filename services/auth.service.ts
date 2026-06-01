import api from "../lib/api";
import { LoginRequest, LoginResponse, UserProfile } from "../types";

const AuthService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
      const response = await api.post<LoginResponse>("/auth/login", credentials);
      if (response.data && response.data.token) {
        localStorage.setItem("jwt_token", response.data.token);
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  logout: (): void => {
    localStorage.removeItem("jwt_token");
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
