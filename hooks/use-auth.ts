"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import AuthService from "@/services/auth.service";

type AppRole = "admin" | "student";

interface AuthUser {
  name: string;
  role: AppRole;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isHydrated: boolean;
  user: AuthUser | null;
  logout: () => void;
  hasRole: (role: AppRole) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    const role = localStorage.getItem("auth_role");
    const name = localStorage.getItem("auth_user_name") || "Người dùng";

    if (token && role) {
      setUser({
        name,
        role: role === "admin" ? "admin" : "student",
      });
    } else {
      setUser(null);
    }
    setIsHydrated(true);
  }, []);

  const logout = () => {
    AuthService.logout();
    setUser(null);
  };

  const value = useMemo<AuthContextType>(
    () => ({
      isAuthenticated: Boolean(user),
      isHydrated,
      user,
      logout,
      hasRole: (role: AppRole) => user?.role === role,
    }),
    [isHydrated, user],
  );

  return React.createElement(AuthContext.Provider, { value }, children);
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
