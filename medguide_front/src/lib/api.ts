import * as SecureStore from "expo-secure-store";

export const API_URL = (process.env.EXPO_PUBLIC_API_URL || "http://localhost:8080").replace(/\/$/, "");
const TOKEN_KEY = "medguide_token";
const USER_KEY = "medguide_user";

export type Role = "pacient" | "doctor";
export type User = { id: string; name: string; email: string; role: Role; [key: string]: any };
export type Appointment = {
  id: string; doctor_id?: string; pacient_id?: string; date_time: string; status: string;
  type?: string; symptoms?: string; specialty?: string; doctor_name?: string;
  patient_name?: string; patient_email?: string; patient_phone?: string; diagnosis?: string;
};

export async function saveSession(token: string, user: User) {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
  await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
}
export async function readSession(): Promise<{ token: string; user: User } | null> {
  const [token, raw] = await Promise.all([SecureStore.getItemAsync(TOKEN_KEY), SecureStore.getItemAsync(USER_KEY)]);
  if (!token || !raw) return null;
  try { return { token, user: JSON.parse(raw) as User }; } catch { return null; }
}
export async function clearSession() {
  await Promise.all([SecureStore.deleteItemAsync(TOKEN_KEY), SecureStore.deleteItemAsync(USER_KEY)]);
}

export async function api<T = any>(path: string, options: RequestInit = {}): Promise<T> {
  const token = await SecureStore.getItemAsync(TOKEN_KEY);
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
  } catch {
    throw new Error(`Não foi possível conectar à API em ${API_URL}. Confira a rede e EXPO_PUBLIC_API_URL.`);
  }
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.message || payload.error || `Erro ${response.status}`);
  return payload as T;
}

export function unwrapList<T>(payload: any): T[] {
  const data = payload?.data;
  const list = data?.doctors ?? data?.appointments ?? data ?? payload?.appointments ?? payload;
  return Array.isArray(list) ? list : [];
}
