/* eslint-disable @typescript-eslint/no-explicit-any */
// app/pacient/dashboard/page.tsx - VERSÃO CORRIGIDA
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../lib/hooks/useAuth";
import { useRouter } from "next/navigation";
import { appointmentService } from "../../lib/service/appointmentService";
import DoctorList from "../../../components/DoctorList";
import {
  Calendar,
  User,
  Clock,
  Search,
  Plus,
  CheckCircle2,
  LogOut,
} from "lucide-react";
import { signOut } from "next-auth/react";

export default function PacientDashboard() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"doctors" | "appointments">(
    "doctors"
  );
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      console.log("❌ Não autenticado, redirecionando...");
      setRedirecting(true);
      router.replace("/pacient/login");
      return;
    }

    if (user) {
      console.log("✅ Usuário autenticado:", user.name);
    }
  }, [authLoading, isAuthenticated, user, router]);

  // 🔥 NOVO: Carregar consultas do paciente
  useEffect(() => {
    const loadAppointments = async () => {
      if (!user?.id) return;

      try {
        setLoadingAppointments(true);
        const patientAppointments =
          await appointmentService.getPatientAppointments(user.id);
        setAppointments(patientAppointments);
      } catch (error) {
        console.error("Erro ao carregar consultas:", error);
      } finally {
        setLoadingAppointments(false);
      }
    };

    if (activeTab === "appointments" && user?.id) {
      loadAppointments();
    }
  }, [activeTab, user?.id]);
  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/pacient/login");
  };
  // 🔥 CORREÇÃO: Mostrar loading durante redirect
  if (authLoading || redirecting) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 to-teal-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">
            {redirecting ? "Redirecionando..." : "Carregando..."}
          </p>
        </div>
      </div>
    );
  }

  // 🔥 CORREÇÃO: Retornar null se não autenticado (já está sendo redirecionado)
  if (!isAuthenticated || !user) {
    return null;
  }

  const upcomingAppointments = appointments.filter(
    (apt) =>
      apt.status === "pending" ||
      apt.status === "confirmed" ||
      apt.status === "agendada"
  );
  const pastAppointments = appointments.filter(
    (apt) =>
      apt.status === "completed" ||
      apt.status === "realizada" ||
      apt.status === "cancelled" ||
      apt.status === "cancelada"
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-teal-100">
      {/* Header */}
      <header className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Dashboard do Paciente
              </h1>
              <p className="text-gray-600 mt-1">Bem-vindo(a), {user.name}!</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push("/pacient/profile")}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                <User className="w-5 h-5" />
                Perfil
              </button>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Consultas Agendadas</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {upcomingAppointments.length}
                </p>
              </div>
              <Calendar className="w-12 h-12 text-blue-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Consultas Realizadas</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {
                    pastAppointments.filter(
                      (apt) =>
                        apt.status === "completed" || apt.status === "realizada"
                    ).length
                  }
                </p>
              </div>
              <CheckCircle2 className="w-12 h-12 text-green-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Próxima Consulta</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {upcomingAppointments.length > 0 ? "Em breve" : "Nenhuma"}
                </p>
              </div>
              <Clock className="w-12 h-12 text-purple-600 opacity-20" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl mb-8">
          <button
            onClick={() => setActiveTab("doctors")}
            className={`flex-1 py-3 px-6 font-semibold rounded-lg transition-colors ${
              activeTab === "doctors"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Search className="w-5 h-5" />
              Buscar Médicos
            </div>
          </button>
          <button
            onClick={() => setActiveTab("appointments")}
            className={`flex-1 py-3 px-6 font-semibold rounded-lg transition-colors ${
              activeTab === "appointments"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Calendar className="w-5 h-5" />
              Minhas Consultas ({appointments.length})
            </div>
          </button>
        </div>

        {/* Conteúdo das Tabs */}
        {activeTab === "doctors" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Encontre o Médico Ideal
              </h2>
              <button
                onClick={() => window.location.reload()} // Recarregar para buscar médicos atualizados
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Plus className="w-5 h-5" />
                Atualizar Lista
              </button>
            </div>
            <DoctorList />
          </div>
        )}

        {activeTab === "appointments" && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Minhas Consultas
            </h2>

            {loadingAppointments ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : appointments.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">
                  Nenhuma consulta agendada
                </p>
                <p className="text-gray-500 mt-2">
                  Encontre um médico e agende sua primeira consulta
                </p>
                <button
                  onClick={() => setActiveTab("doctors")}
                  className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  Buscar Médicos
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Consultas Futuras */}
                {upcomingAppointments.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Próximas Consultas ({upcomingAppointments.length})
                    </h3>
                    <div className="space-y-3">
                      {upcomingAppointments.map((appointment) => (
                        <AppointmentCard
                          key={appointment.id}
                          appointment={appointment}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Consultas Passadas */}
                {pastAppointments.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 mt-8">
                      Consultas Anteriores ({pastAppointments.length})
                    </h3>
                    <div className="space-y-3">
                      {pastAppointments.map((appointment) => (
                        <AppointmentCard
                          key={appointment.id}
                          appointment={appointment}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

// Componente de Card de Consulta (mantido igual)
function AppointmentCard({ appointment }: { appointment: any }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
      case "agendada":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
      case "confirmada":
        return "bg-green-100 text-green-800";
      case "completed":
      case "realizada":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
      case "cancelada":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
      case "agendada":
        return "Agendada";
      case "confirmed":
      case "confirmada":
        return "Confirmada";
      case "completed":
      case "realizada":
        return "Realizada";
      case "cancelled":
      case "cancelada":
        return "Cancelada";
      default:
        return status;
    }
  };

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return {
      date: date.toLocaleDateString("pt-BR"),
      time: date.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  const { date, time } = formatDateTime(appointment.date_time);

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-gray-900">
              {appointment.doctor_name}
            </h4>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                appointment.status
              )}`}
            >
              {getStatusText(appointment.status)}
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-1">{appointment.specialty}</p>
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="w-4 h-4 mr-1" />
            <span>
              {date} às {time}
            </span>
          </div>
          {appointment.symptoms && (
            <p className="text-sm text-gray-600 mt-2">
              <strong>Motivo:</strong> {appointment.symptoms}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
