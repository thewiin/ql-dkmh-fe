
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

let isHandlingUnauthorized = false;

const clearAuthAndRedirect = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("jwt_token");
  localStorage.removeItem("auth_role");
  localStorage.removeItem("auth_user_name");
  window.location.href = "/login";
};

// Request interceptor for adding JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwt_token"); // Assuming JWT is stored in localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      if (!isHandlingUnauthorized) {
        isHandlingUnauthorized = true;
        clearAuthAndRedirect();
      }
    }
    return Promise.reject(error);
  }
);

export default api;
