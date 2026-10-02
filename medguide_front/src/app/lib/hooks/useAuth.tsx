// app/lib/hooks/useAuth.ts - VERSÃO CORRIGIDA
"use client";

import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from "react";
import { useSession, signOut, signIn } from "next-auth/react";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "pacient" | "doctor";
  phone?: string;
  cpf?: string;
  CRM?: string;
  specialty?: string;
  address?: string;
  experience?: string;
  education?: string;
  bio?: string;
}

interface AuthContextType {
  user: User | null;
  login: (login: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status, update } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // CORREÇÃO NO useAuth.tsx
  useEffect(() => {
    const initializeAuth = async () => {
      if (status === "loading") {
        return; // Não alterar loading até ter certeza
      }

      if (session?.user) {
        const userData: User = {
          id: session.user.id,
          name: session.user.name || "",
          email: session.user.email || "",
          role: (session.user.role as "pacient" | "doctor") || "pacient",
          phone: session.user.phone,
          cpf: session.user.cpf,
          CRM: session.user.CRM,
          specialty: session.user.specialty,
          address: session.user.address,
          experience: session.user.experience,
          education: session.user.education,
          bio: session.user.bio,
        };
        setUser(userData);

        // Sincronizar com localStorage APENAS se necessário
        if (typeof window !== "undefined") {
          const currentStored = localStorage.getItem("user");
          if (!currentStored || currentStored !== JSON.stringify(userData)) {
            localStorage.setItem("user", JSON.stringify(userData));
          }
          if (session.accessToken) {
            localStorage.setItem("token", session.accessToken);
          }
        }
      } else {
        if (typeof window !== "undefined") {
          const storedUser = localStorage.getItem("user");
          const storedToken = localStorage.getItem("token");

          if (storedUser && storedToken) {
            try {
              const userData = JSON.parse(storedUser) as User;
              setUser(userData);
            } catch (error) {
              console.error("Erro ao parsear user do localStorage:", error);
              // Não limpar - pode ser sessão válida
            }
          } else {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      }

      setLoading(false);
    };

    initializeAuth();
  }, [session, status]);

  const login = async (login: string, password: string): Promise<void> => {
    try {
      const result = await signIn("credentials", {
        login,
        password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error("Credenciais inválidas");
      }

      // 🔥 CORREÇÃO: Forçar atualização da sessão
      await update();
    } catch (error) {
      console.error("Erro no login:", error);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      // 🔥 CORREÇÃO: Limpar tudo de forma síncrona antes do signOut
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("doctor_appointments");
        localStorage.removeItem("doctor_exam_requests");
        localStorage.removeItem("patient_appointments");
      }

      setUser(null);
      console.log("🔍 useAuth Status:", {
        status,
        hasSession: !!session,
        sessionUser: session?.user,
        isAuthenticated: !!user,
        loading,
      });
      // Fazer signOut com redirect para garantir limpeza completa
      await signOut({
        redirect: true,
        callbackUrl: "/",
      });
    } catch (error) {
      console.error("Erro no logout:", error);
      throw error;
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        loading,
        updateUser,
      }}
    >
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
