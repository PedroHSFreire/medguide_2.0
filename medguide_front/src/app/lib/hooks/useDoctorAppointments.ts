// hooks/useDoctorAppointments.ts
"use client";

import { useState, useEffect, useCallback } from "react";

export interface DoctorAppointment {
  id: string;
  date_time: string;
  status: "agendada" | "confirmada" | "cancelada" | "realizada" | "remarcada";
  type: "presencial" | "online" | "domiciliar" | "urgente";
  symptoms: string;
  diagnosis?: string;
  prescription?: string;
  doctor_notes?: string;
  specialty: string;
  doctor_id: string;
  doctor_name: string;
  pacient_id: string;
  patient_name?: string;
  patient_email?: string;
  patient_phone?: string;
  created?: string;
}

interface UseDoctorAppointmentsReturn {
  appointments: DoctorAppointment[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updateAppointmentStatus: (
    appointmentId: string,
    status: DoctorAppointment["status"]
  ) => Promise<void>;
}

export const useDoctorAppointments = (
  doctorId?: string
): UseDoctorAppointmentsReturn => {
  const [appointments, setAppointments] = useState<DoctorAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = useCallback(async () => {
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
      const url = `${baseUrl}/api/appointments/doctor/${doctorId}`;

      console.log("📅 Buscando agendamentos do médico:", url);

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

      // Ajuste para a estrutura de resposta da API
      const appointmentsData = data.data || data.appointments || data;

      console.log("✅ Agendamentos recebidos:", appointmentsData);
      setAppointments(Array.isArray(appointmentsData) ? appointmentsData : []);
    } catch (err) {
      console.error("❌ Erro ao buscar agendamentos:", err);
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  }, [doctorId]);

  const updateAppointmentStatus = useCallback(
    async (appointmentId: string, status: DoctorAppointment["status"]) => {
      try {
        const token = localStorage.getItem("token");
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const baseUrl = apiUrl?.endsWith("/") ? apiUrl.slice(0, -1) : apiUrl;
        const url = `${baseUrl}/api/appointments/${appointmentId}`;

        console.log("🔄 Atualizando status do agendamento:", {
          appointmentId,
          status,
        });

        const response = await fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify({ status }),
        });

        if (!response.ok) {
          throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }

        // Atualizar o estado local
        setAppointments((prev) =>
          prev.map((apt) =>
            apt.id === appointmentId ? { ...apt, status } : apt
          )
        );

        console.log("✅ Status do agendamento atualizado com sucesso");
      } catch (err) {
        console.error("❌ Erro ao atualizar status do agendamento:", err);
        throw err;
      }
    },
    []
  );

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  // Atualizar a cada 30 segundos para receber novos agendamentos em tempo real
  useEffect(() => {
    if (!doctorId) return;

    const interval = setInterval(() => {
      fetchAppointments();
    }, 30000); // 30 segundos

    return () => clearInterval(interval);
  }, [doctorId, fetchAppointments]);

  return {
    appointments,
    loading,
    error,
    refetch: fetchAppointments,
    updateAppointmentStatus,
  };
};
