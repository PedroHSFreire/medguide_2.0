// app/lib/service/doctorSearchService.ts
export interface DoctorSearchResult {
  id: string;
  name: string;
  specialty: string;
  CRM: string;
  email: string;
  phone?: string;
  address?: string;
  image?: string;
  availability?: string[];
  rating?: number;
  experience?: number;
  languages?: string[];
  consultationFee?: number;
}

export interface SearchFilters {
  specialty?: string;
  availability?: string;
  rating?: number;
  maxFee?: number;
}

export default class DoctorSearchService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
  }

  private getAuthToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  }

  async searchDoctors(
    query: string,
    filters?: SearchFilters
  ): Promise<DoctorSearchResult[]> {
    try {
      const token = this.getAuthToken();
      const params = new URLSearchParams();
      if (query) params.append("search", query);
      if (filters?.specialty) params.append("specialty", filters.specialty);

      const response = await fetch(
        `${this.baseUrl}/api/doctor?${params.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
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
      console.error("Erro na busca de médicos:", error);
      return [];
    }
  }

  async getAllDoctors(filters?: SearchFilters): Promise<DoctorSearchResult[]> {
    try {
      const token = this.getAuthToken();
      const params = new URLSearchParams();
      if (filters?.specialty) params.append("specialty", filters.specialty);

      const response = await fetch(
        `${this.baseUrl}/api/doctor?${params.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data?.doctors || data.data || [];
    } catch (error) {
      console.error("Erro ao carregar médicos:", error);
      return [];
    }
  }

  async getDoctorById(doctorId: string): Promise<DoctorSearchResult | null> {
    try {
      const token = this.getAuthToken();
      const response = await fetch(`${this.baseUrl}/api/doctor/${doctorId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error("Erro ao buscar médico:", error);
      return null;
    }
  }

  async getDoctorSpecialties(): Promise<string[]> {
    try {
      const token = this.getAuthToken();
      const response = await fetch(`${this.baseUrl}/api/doctor/specialties`, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        return this.getDefaultSpecialties();
      }

      const data = await response.json();
      return data.data || data.specialties || this.getDefaultSpecialties();
    } catch (error) {
      console.error("Erro ao buscar especialidades:", error);
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
}
