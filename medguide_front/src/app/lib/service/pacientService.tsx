/* eslint-disable @typescript-eslint/no-explicit-any */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

type RegisterPayload = {
  name: string;
  email: string;
  cpf: string;
  password: string;
};

export default class PacientService {
  baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl ?? (API_BASE_URL || "");
  }

  private getAuthToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  }

  private async tryFetch(path: string, init: RequestInit) {
    const url = this.baseUrl ? `${this.baseUrl}${path}` : path;
    try {
      const token = this.getAuthToken();
      const headers = {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...init.headers,
      };

      const res = await fetch(url, { ...init, headers });
      const json = await res.json().catch(() => null);
      return { ok: res.ok, status: res.status, data: json };
    } catch {
      return { ok: false, status: 0, data: null };
    }
  }

  async registerPacient(payload: RegisterPayload) {
    const result = await this.tryFetch("/api/pacient/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    if (result.ok) return { data: result.data };

    const error = new Error("Erro ao registrar paciente") as any;
    error.response = { status: result.status, data: result.data };
    throw error;
  }

  async updateProfile(data: Partial<RegisterPayload>) {
    const result = await this.tryFetch("/api/pacient/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });

    if (result.ok) return { data: result.data };

    const error = new Error("Erro ao atualizar perfil") as any;
    error.response = { status: result.status, data: result.data };
    throw error;
  }

  async getProfile() {
    const result = await this.tryFetch("/api/pacient/profile", {
      method: "GET",
    });

    if (result.ok) return { data: result.data };

    const error = new Error("Erro ao buscar perfil") as any;
    error.response = { status: result.status, data: result.data };
    throw error;
  }
}
