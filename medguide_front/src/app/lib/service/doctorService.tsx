/* eslint-disable @typescript-eslint/no-explicit-any */
export interface DoctorSearchFilters {
  specialty?: string;
  name?: string;
  CRM?: string;
  city?: string;
}

export interface DoctorSearchResult {
  id: string;
  name: string;
  CRM: string;
  specialty: string;
  email: string;
  phone?: string;
  address?: string;
  experience?: string;
  education?: string;
  bio?: string;
  rating?: number;
  consultationPrice?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export default class DoctorService {
  private getAuthToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  }

  async searchDoctors(
    filters: DoctorSearchFilters = {}
  ): Promise<DoctorSearchResult[]> {
    try {
      const token = this.getAuthToken();
      const params = new URLSearchParams();
      if (filters.specialty) params.append("specialty", filters.specialty);
      if (filters.name) params.append("search", filters.name);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/doctor?${params.toString()}`,
        {
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );

      if (!response.ok) {
        return [];
      }

      const data = await response.json();
      return data.data?.doctors || data.data || [];
    } catch (error) {
      console.warn("Busca de médicos não disponível - usando fallback", error);
      return [];
    }
  }

  async getAllSpecialties(): Promise<string[]> {
    try {
      const token = this.getAuthToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/doctor/specialties`,
        {
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );

      if (!response.ok) {
        return this.getDefaultSpecialties();
      }

      const data = await response.json();
      return data.data || data.specialties || this.getDefaultSpecialties();
    } catch (error) {
      console.warn("Especialidades não disponíveis - usando fallback", error);
      return this.getDefaultSpecialties();
    }
  }

  private getDefaultSpecialties(): string[] {
    return [
      "Cardiologista",
      "Dermatologista",
      "Ortopedista",
      "Pediatra",
      "Ginecologista",
      "Oftalmologista",
      "Neurologista",
      "Psiquiatra",
      "Endocrinologista",
      "Gastroenterologista",
      "Urologista",
      "Otorrinolaringologista",
    ];
  }

  async getDoctorById(id: string): Promise<DoctorSearchResult | undefined> {
    try {
      const token = this.getAuthToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/doctor/${id}`,
        {
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );

      if (!response.ok) {
        return undefined;
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.warn("Busca de médico não disponível - usando fallback", error);
      return undefined;
    }
  }

  async registerDoctor(data: {
    name: string;
    email: string;
    CRM: string;
    specialty: string;
    password: string;
    cpf: string;
    phone?: string;
  }): Promise<{ success: boolean; data?: any }> {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const baseUrl = apiUrl?.endsWith("/") ? apiUrl.slice(0, -1) : apiUrl;

      const response = await fetch(`${baseUrl}/api/doctor/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          crm: data.CRM,
          specialty: data.specialty,
          password: data.password,
          cpf: data.cpf,
          phone: data.phone || "",
        }),
      });

      return await response.json();
    } catch (error) {
      console.error("Erro ao registrar médico:", error);
      throw error;
    }
  }
}
