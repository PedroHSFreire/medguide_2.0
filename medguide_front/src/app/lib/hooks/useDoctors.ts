// app/hooks/useDoctors.ts - VERSÃO ATUALIZADA
"use client";

import { useState, useEffect, useCallback } from "react";

export interface Doctor {
  id: string;
  name: string;
  email: string;
  CRM: string;
  specialty: string;
  phone?: string;
  address?: string;
  experience?: string;
  education?: string;
  bio?: string;
  rating?: number;
  consultationFee?: number;
  availableSlots?: string[];
  verified?: boolean;
  cpf?: string;
  created?: string;
}

export const useDoctors = (specialty?: string, searchQuery?: string) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDoctors = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");

      // 🔥 ATUALIZAÇÃO: Usar a nova rota de search
      const params = new URLSearchParams();
      if (specialty) params.append("specialty", specialty);
      if (searchQuery) params.append("search", searchQuery);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const baseUrl = apiUrl?.endsWith("/") ? apiUrl.slice(0, -1) : apiUrl;
      const url = `${baseUrl}/api/doctor/search${
        params.toString() ? `?${params.toString()}` : ""
      }`;

      console.log("🔍 Buscando médicos em:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      // 🔥 ATUALIZAÇÃO: Nova estrutura de resposta
      const doctorsData = data.data?.doctors || [];

      console.log("✅ Médicos recebidos:", doctorsData.length);
      setDoctors(doctorsData);
    } catch (err) {
      console.error("❌ Erro ao buscar médicos:", err);
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  }, [specialty, searchQuery]);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  const refetch = useCallback(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  return { doctors, loading, error, refetch };
};

// Hook para buscar um médico específico por ID
export const useDoctor = (doctorId: string) => {
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDoctor = useCallback(async () => {
    if (!doctorId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const baseUrl = apiUrl?.endsWith("/") ? apiUrl.slice(0, -1) : apiUrl;
      const url = `${baseUrl}/api/doctor/${doctorId}`;

      console.log("🔍 Buscando médico específico em:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setDoctor(data.data || data);
    } catch (err) {
      console.error("❌ Erro ao buscar médico:", err);
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      setDoctor(null);
    } finally {
      setLoading(false);
    }
  }, [doctorId]);

  useEffect(() => {
    fetchDoctor();
  }, [fetchDoctor]);

  const refetch = useCallback(() => {
    fetchDoctor();
  }, [fetchDoctor]);

  return { doctor, loading, error, refetch };
};
