// app/components/pacient/AppointmentModal.tsx - VERSÃO CORRIGIDA
"use client";

import { useState, useEffect, useRef } from "react";
import {
  X,
  Calendar,
  Clock,
  AlertCircle,
  User,
  Stethoscope,
  CheckCircle2,
} from "lucide-react";
import { useAppointment } from "../app/lib/hooks/useAppointments";
import { useAuth } from "../app/lib/hooks/useAuth";
import { CreateAppointmentData } from "../app/lib/service/appointmentService";

// 🔥 INTERFACE PARA O DOCTOR
interface Doctor {
  id: string;
  name: string;
  specialty: string;
  CRM: string;
}

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctor: Doctor;
  onSuccess?: () => void;
}

// 🔥 INTERFACE PARA O FORM DATA
interface FormData {
  date: string;
  time: string;
  symptoms: string;
  notes: string;
  type: string;
}

// 🔥 Estado inicial constante
const INITIAL_FORM_DATA: FormData = {
  date: "",
  time: "",
  symptoms: "",
  notes: "",
  type: "consulta",
};

export default function AppointmentModal({
  isOpen,
  onClose,
  doctor,
  onSuccess,
}: AppointmentModalProps) {
  const { user } = useAuth();
  const { bookAppointment, loading, error, success, resetState } =
    useAppointment();

  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [localError, setLocalError] = useState<string | null>(null);

  // 🔥 CORREÇÃO: Usar useRef para controlar o estado anterior
  const prevIsOpenRef = useRef<boolean>(false);

  // 🔥 CORREÇÃO: Reset apenas quando o modal abre usando useRef
  useEffect(() => {
    if (isOpen && !prevIsOpenRef.current) {
      // Usar setTimeout para evitar atualizações síncronas no effect
      const timer = setTimeout(() => {
        resetState();
        setFormData(INITIAL_FORM_DATA);
        setLocalError(null);
      }, 0);

      return () => clearTimeout(timer);
    }

    prevIsOpenRef.current = isOpen;
  }, [isOpen, resetState]);

  // Generate time slots (8:00 to 18:00, 30min intervals)
  const timeSlots = Array.from({ length: 21 }, (_, i) => {
    const hour = Math.floor(i / 2) + 8;
    const minute = i % 2 === 0 ? "00" : "30";
    return `${hour.toString().padStart(2, "0")}:${minute}`;
  });

  // Get tomorrow's date for min date
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  // Get date 30 days from now for max date
  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    return maxDate.toISOString().split("T")[0];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    try {
      // 🔥 VALIDAÇÃO COMPLETA - USANDO formData CORRETAMENTE
      if (!doctor?.id) {
        setLocalError("Médico não selecionado");
        return;
      }

      if (!user?.id) {
        setLocalError("Usuário não autenticado");
        return;
      }

      if (!formData.date || !formData.time) {
        setLocalError("Data e hora não selecionados");
        return;
      }

      if (!formData.symptoms.trim()) {
        setLocalError("Descrição dos sintomas é obrigatória");
        return;
      }

      // 🔥 CORREÇÃO: Combinar data e hora corretamente com fuso horário
      const selectedDateTime = new Date(`${formData.date}T${formData.time}:00`);
      if (isNaN(selectedDateTime.getTime())) {
        setLocalError("Data e hora inválidas");
        return;
      }

      // 🔥 CORREÇÃO: Verificar se a data não é no passado
      if (selectedDateTime < new Date()) {
        setLocalError("Não é possível agendar para datas passadas");
        return;
      }

      const appointmentData: CreateAppointmentData = {
        doctor_id: doctor.id,
        pacient_id: user.id,
        date_time: selectedDateTime.toISOString(),
        type: "consulta",
        symptoms: formData.symptoms.trim(),
        specialty: doctor.specialty,
        doctor_name: doctor.name,
        patient_name: user.name || "",
        patient_email: user.email || "",
        patient_phone: user.phone || "",
        notes: formData.notes.trim() || undefined,
      };

      console.log("📤 Dados validados para agendamento:", appointmentData);

      await bookAppointment(appointmentData);
    } catch (error) {
      // Erro já é tratado no hook, mas podemos adicionar tratamento local se necessário
      console.error("Erro no submit do modal:", error);
    }
  };

  // 🔥 CORREÇÃO: Fechar modal automaticamente quando sucesso
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        onClose();
        if (onSuccess) {
          onSuccess();
        }
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [success, onClose, onSuccess]);

  // Fechar modal com Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen, onClose]);

  // 🔥 CORREÇÃO: Reset do estado quando o modal fecha usando setTimeout
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        resetState();
        setLocalError(null);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [isOpen, resetState]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-linear-to-r from-blue-600 to-teal-500 p-6 text-white rounded-t-2xl">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold">Agendar Consulta</h2>
              <p className="text-blue-100 mt-1">
                Preencha os dados da consulta
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-blue-200 transition-colors"
              disabled={loading}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Doctor Info */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{doctor.name}</h3>
              <div className="flex items-center text-sm text-gray-600">
                <Stethoscope className="w-4 h-4 mr-1" />
                {doctor.specialty}
              </div>
              <p className="text-xs text-gray-500">CRM: {doctor.CRM}</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center text-green-700">
                <CheckCircle2 className="w-5 h-5 mr-2" />
                <span className="font-medium">
                  Consulta agendada com sucesso!
                </span>
              </div>
              <p className="text-green-600 text-sm mt-1">Redirecionando...</p>
            </div>
          )}

          {/* Error Message */}
          {(error || localError) && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center text-red-700">
                <AlertCircle className="w-5 h-5 mr-2" />
                <span className="font-medium">Erro no agendamento</span>
              </div>
              <p className="text-red-600 text-sm mt-1">{error || localError}</p>
            </div>
          )}

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Data da Consulta
            </label>
            <input
              type="date"
              required
              min={getTomorrowDate()}
              max={getMaxDate()}
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              disabled={loading || success}
              className="w-full p-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            />
          </div>

          {/* Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="w-4 h-4 inline mr-1" />
              Horário
            </label>
            <select
              required
              value={formData.time}
              onChange={(e) =>
                setFormData({ ...formData, time: e.target.value })
              }
              disabled={loading || success}
              className="w-full p-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            >
              <option value="">Selecione um horário</option>
              {timeSlots.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>

          {/* Symptoms */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sintomas / Motivo da Consulta
            </label>
            <textarea
              required
              value={formData.symptoms}
              onChange={(e) =>
                setFormData({ ...formData, symptoms: e.target.value })
              }
              placeholder="Descreva seus sintomas ou o motivo da consulta..."
              rows={3}
              disabled={loading || success}
              className="w-full p-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            />
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observações Adicionais (Opcional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              placeholder="Alguma informação adicional que o médico deve saber..."
              rows={2}
              disabled={loading || success}
              className="w-full p-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            />
          </div>

          {/* Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-3 px-4 text-black bg-gray-300 rounded-lg font-semibold hover:bg-gray-400 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={
                loading ||
                success ||
                !formData.date ||
                !formData.time ||
                !formData.symptoms.trim()
              }
              className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Agendando...
                </div>
              ) : success ? (
                <div className="flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Agendado!
                </div>
              ) : (
                "Confirmar Agendamento"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
