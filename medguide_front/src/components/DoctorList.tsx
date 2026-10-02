/* eslint-disable @typescript-eslint/no-explicit-any */
// app/components/pacient/DoctorList.tsx - VERSÃO ATUALIZADA
"use client";

import { useState, useEffect } from "react";
import { useDoctors } from "../app/lib/hooks/useDoctors";
import { useAuth } from "../app/lib/hooks/useAuth";
import { appointmentService } from "../app/lib/service/appointmentService";
import { Search, Filter, Star, MapPin, Clock, Calendar } from "lucide-react";
import AppointmentModal from "./AppointmentModal";

export default function DoctorList() {
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [loadingSpecialties, setLoadingSpecialties] = useState(false);
  const { user } = useAuth();

  const { doctors, loading, error, refetch } = useDoctors(
    selectedSpecialty || undefined,
    searchQuery || undefined
  );

  // 🔥 NOVO: Carregar especialidades dinamicamente
  useEffect(() => {
    const loadSpecialties = async () => {
      try {
        setLoadingSpecialties(true);
        const specialtiesData = await appointmentService.getSpecialties();
        setSpecialties(specialtiesData);
      } catch (error) {
        console.error("Erro ao carregar especialidades:", error);
        // Usar lista padrão em caso de erro
        setSpecialties([
          "Cardiologista",
          "Dermatologista",
          "Ortopedista",
          "Pediatra",
          "Ginecologista",
          "Oftalmologista",
          "Neurologista",
          "Psiquiatra",
          "Endocrinologista",
        ]);
      } finally {
        setLoadingSpecialties(false);
      }
    };

    loadSpecialties();
  }, []);

  const handleBookAppointment = (doctor: any) => {
    if (!user) {
      alert("Por favor, faça login para agendar uma consulta.");
      return;
    }
    setSelectedDoctor(doctor);
    setIsModalOpen(true);
  };

  const handleAppointmentSuccess = () => {
    console.log("Consulta agendada com sucesso!");
    // Opcional: refetch dos dados se necessário
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <p className="text-red-600 mb-2">Erro ao carregar médicos: {error}</p>
        <button
          onClick={refetch}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtros e Busca */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Barra de Pesquisa */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por nome, especialidade..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 text-gray-900 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filtro de Especialidade */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              disabled={loadingSpecialties}
              className="w-full pl-10 text-gray-900 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white disabled:bg-gray-100"
            >
              <option value="">Todas as especialidades</option>
              {specialties.map((specialty) => (
                <option key={specialty} value={specialty}>
                  {specialty}
                </option>
              ))}
            </select>
            {loadingSpecialties && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Info de Resultados */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-700 text-sm">
          {doctors.length === 0
            ? "Nenhum médico encontrado com os filtros atuais"
            : `Encontrados ${doctors.length} médico(s)`}
          {selectedSpecialty && ` na especialidade: ${selectedSpecialty}`}
        </p>
      </div>

      {/* Lista de Médicos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg mb-2">
              Nenhum médico encontrado
            </p>
            <p className="text-gray-400">Tente ajustar os filtros de busca</p>
            <button
              onClick={() => {
                setSelectedSpecialty("");
                setSearchQuery("");
              }}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Limpar Filtros
            </button>
          </div>
        ) : (
          doctors.map((doctor) => (
            <DoctorCard
              key={doctor.id}
              doctor={doctor}
              onBookAppointment={handleBookAppointment}
            />
          ))
        )}
      </div>

      {/* Modal de Agendamento */}
      <AppointmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        doctor={selectedDoctor}
        onSuccess={handleAppointmentSuccess}
      />
    </div>
  );
}

// Componente de Card do Médico
function DoctorCard({
  doctor,
  onBookAppointment,
}: {
  doctor: any;
  onBookAppointment: (doctor: any) => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header do Card */}
      <div className="bg-linear-to-r from-blue-600 to-teal-500 p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold">{doctor.name}</h3>
            <p className="text-blue-100">{doctor.specialty}</p>
          </div>
          {doctor.verified && (
            <div className="bg-white text-blue-600 px-2 py-1 rounded-full text-xs font-semibold">
              ✓ Verificado
            </div>
          )}
        </div>
        <div className="flex items-center mt-2 text-blue-100">
          <span className="text-sm">CRM: {doctor.CRM}</span>
        </div>
      </div>

      {/* Informações do Médico */}
      <div className="p-6 space-y-4">
        {/* Rating */}
        {doctor.rating && (
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="ml-1 text-sm font-medium">{doctor.rating}</span>
            <span className="text-gray-500 text-sm ml-1">
              • {doctor.experience || "Experiência"}
            </span>
          </div>
        )}

        {/* Localização */}
        {doctor.address && (
          <div className="flex items-start text-gray-600">
            <MapPin className="w-4 h-4 mt-0.5 mr-2 shrink-0" />
            <span className="text-sm">{doctor.address}</span>
          </div>
        )}

        {/* Horários Disponíveis */}
        {doctor.availableSlots && doctor.availableSlots.length > 0 && (
          <div className="flex items-center text-gray-600">
            <Clock className="w-4 h-4 mr-2 shrink-0" />
            <span className="text-sm">
              {doctor.availableSlots.length} horários disponíveis
            </span>
          </div>
        )}

        {/* Preço da Consulta */}
        {doctor.consultationFee && (
          <div className="flex justify-between items-center pt-2 border-t border-gray-100">
            <span className="text-gray-600 text-sm">Consulta</span>
            <span className="text-lg font-bold text-green-600">
              R$ {doctor.consultationFee}
            </span>
          </div>
        )}
      </div>

      {/* Botão de Ação */}
      <div className="px-6 pb-6">
        <button
          onClick={() => onBookAppointment(doctor)}
          className={`w-full font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center ${
            isHovered
              ? "bg-blue-700 text-white shadow-md"
              : "bg-blue-600 text-white"
          }`}
        >
          <Calendar className="w-5 h-5 mr-2" />
          Agendar Consulta
        </button>
      </div>
    </div>
  );
}
