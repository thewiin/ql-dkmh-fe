"use client";

import React, { createContext, useContext, useState } from "react";

interface AuthContextType {
  test: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [testState, setTestState] = useState("Hello");

  return (
    <AuthContext.Provider value={{ test: testState }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
