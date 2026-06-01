
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

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
    // Example error handling: if JWT is expired or invalid, redirect to login
    if (error.response && error.response.status === 401) {
      console.error("Unauthorized: Invalid or expired token. Redirecting to login.");
      // Optionally, redirect to login page
      // window.location.href = "/login"; 
    }
    return Promise.reject(error);
  }
);

export default api;
