"use client";

import { ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

type AppRole = "admin" | "student";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: AppRole;
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isHydrated, hasRole } = useAuth();

  useEffect(() => {
    if (!isHydrated) return;

    if (!isAuthenticated) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname || "/")}`);
      return;
    }

    if (requiredRole && !hasRole(requiredRole)) {
      router.replace(requiredRole === "admin" ? "/" : "/admin");
    }
  }, [hasRole, isAuthenticated, isHydrated, pathname, requiredRole, router]);

  if (!isHydrated || !isAuthenticated || (requiredRole && !hasRole(requiredRole))) {
    return null;
  }

  return <>{children}</>;
}
