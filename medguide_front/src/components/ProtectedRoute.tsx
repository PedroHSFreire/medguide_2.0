"use client";

import { useEffect } from "react";
import { useAuth } from "../app/lib/hooks/useAuth";
import { useRouter } from "next/navigation";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "pacient" | "doctor";
}

export default function ProtectedRoute({
  children,
  requiredRole,
}: ProtectedRouteProps) {
  const { isAuthenticated, user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/pacient/login");
      return;
    }

    if (
      !loading &&
      isAuthenticated &&
      requiredRole &&
      user?.role !== requiredRole
    ) {
      // Redirecionar para o dashboard apropriado
      if (user?.role === "doctor") {
        router.push("/doctor/dashboard");
      } else {
        router.push("/pacient/dashboard");
      }
    }
  }, [isAuthenticated, loading, user, requiredRole, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Acesso não autorizado</p>
      </div>
    );
  }

  return <>{children}</>;
}
