import { Request, Response, NextFunction } from "express";
import { AppointmentModel } from "../models/AppointmentModel.js";
import { DoctorModel } from "../models/DoctorModels.js";
import { PacientModel } from "../models/PacientModels.js";
import {
  Appointment,
  CreateAppointmentDTO,
  ApiResponse,
} from "../types/index.js";

export class AppointmentController {
  static async create(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      console.log("📥 Recebendo requisição para criar agendamento");
      console.log("📦 Dados recebidos:", req.body);

      const appointmentData: CreateAppointmentDTO = req.body;

      // Verificar se médico existe
      const doctor = await DoctorModel.findById(appointmentData.doctor_id);
      console.log(
        "👨‍⚕️ Médico encontrado:",
        doctor ? `Sim - ${doctor.name}` : "Não"
      );

      if (!doctor) {
        res.status(404).json({
          success: false,
          error: "Médico não encontrado",
        });
        return;
      }

      // Verificar se paciente existe
      const pacient = await PacientModel.findById(appointmentData.pacient_id);
      console.log(
        "👤 Paciente encontrado:",
        pacient ? `Sim - ${pacient.name}` : "Não"
      );

      if (!pacient) {
        res.status(404).json({
          success: false,
          error: "Paciente não encontrado",
        });
        return;
      }

      const id = await AppointmentModel.create(appointmentData);
      console.log("✅ ID do agendamento criado:", id);

      const newAppointment = await AppointmentModel.findById(id);
      console.log("📋 Agendamento recuperado:", newAppointment);

      if (!newAppointment) {
        res.status(500).json({
          success: false,
          error: "Erro ao recuperar consulta criada",
        });
        return;
      }

      const response: ApiResponse<Appointment> = {
        success: true,
        data: newAppointment,
        message: "Consulta agendada com sucesso",
      };

      res.status(201).json(response);
    } catch (error) {
      console.error("❌ Erro ao criar agendamento:", error);
      next(error);
    }
  }

  static async findById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const appointment = await AppointmentModel.findById(String(id));

      if (!appointment) {
        res.status(404).json({
          success: false,
          error: "Consulta não encontrada",
        });
        return;
      }

      const response: ApiResponse<Appointment> = {
        success: true,
        data: appointment,
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  static async findByPacientId(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { patientId } = req.params;
      if (!patientId) {
        res.status(500).json({
          success: false,
          error: "Erro ao recuperar consulta criada",
        });
        return;
      }
      const appointments = await AppointmentModel.findByPacientId(patientId);

      const response: ApiResponse<Appointment[]> = {
        success: true,
        data: appointments,
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  static async findByDoctorId(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { doctorId } = req.params;
      if (!doctorId) {
        res.status(500).json({
          success: false,
          error: "Erro ao recuperar consulta criada",
        });
        return;
      }
      const appointments = await AppointmentModel.findByDoctorId(doctorId);

      const response: ApiResponse<Appointment[]> = {
        success: true,
        data: appointments,
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  static async update(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const appointmentData: Partial<Omit<Appointment, "id" | "created">> =
        req.body;

      await AppointmentModel.update(String(id), appointmentData);
      const updatedAppointment = await AppointmentModel.findById(String(id));
      if (!updatedAppointment) {
        res.status(500).json({
          success: false,
          error: "Erro ao recuperar consulta",
        });
        return;
      }
      const response: ApiResponse<Appointment> = {
        success: true,
        data: updatedAppointment,
        message: "Consulta atualizada com sucesso",
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  static async delete(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      await AppointmentModel.delete(String(id));

      const response: ApiResponse<null> = {
        success: true,
        message: "Consulta removida com sucesso",
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }
}
