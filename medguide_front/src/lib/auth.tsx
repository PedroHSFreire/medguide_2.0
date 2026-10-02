import React, { createContext, useContext, useEffect, useState } from "react";
import { api, clearSession, readSession, Role, saveSession, User } from "./api";

type AuthContextValue = { user: User | null; loading: boolean; signIn: (role: Role, login: string, password: string) => Promise<void>; signUp: (role: Role, data: Record<string,string>) => Promise<void>; signOut: () => Promise<void>; updateUser: (user: User) => Promise<void> };
const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { readSession().then((s) => setUser(s?.user ?? null)).finally(() => setLoading(false)); }, []);
  const signIn = async (role: Role, login: string, password: string) => {
    const kind = role === "doctor" ? "doctor" : "pacient";
    const payload: any = await api(`/api/${kind}/login`, { method: "POST", body: JSON.stringify({ login, password }) });
    const token = payload.data?.token || payload.token || payload.accessToken;
    const profile = payload.data?.[kind] || payload.data?.user || payload.data;
    if (!token || !profile) throw new Error("A API não retornou os dados de acesso esperados.");
    const nextUser = { ...profile, role } as User;
    await saveSession(token, nextUser);
    setUser(nextUser);
  };
  const signUp = async (role: Role, values: Record<string,string>) => {
    const kind = role === "doctor" ? "doctor" : "pacient";
    const payload = role === "doctor" ? { ...values, crm: values.CRM || values.crm } : values;
    await api(`/api/${kind}/register`, { method: "POST", body: JSON.stringify(payload) });
  };
  const signOut = async () => { await clearSession(); setUser(null); };
  const updateUser = async (next: User) => { const session = await readSession(); if (session) await saveSession(session.token, next); setUser(next); };
  return <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, updateUser }}>{children}</AuthContext.Provider>;
}
export function useAuth() { const context = useContext(AuthContext); if (!context) throw new Error("useAuth deve ser usado dentro de AuthProvider"); return context; }
