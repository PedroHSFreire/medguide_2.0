import { Appointment, CreateAppointmentDTO } from "../types/index.js";
import { runQuery, getQuery, allQuery } from "../database/connection.js";
import { v4 as uuidv4 } from "uuid";
export class AppointmentModel {
  static async create(appointment: CreateAppointmentDTO): Promise<string> {
    const id = uuidv4();
    const sql = `
      INSERT INTO Appointment (
        id, date_time, status, type, symptoms, diagnosis,
        prescription, doctor_notes, specialty, doctor_id, 
        doctor_name, pacient_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await runQuery(sql, [
      id,
      appointment.date_time,
      appointment.status,
      appointment.type,
      appointment.symptoms,
      appointment.diagnosis || null,
      appointment.prescription || null,
      appointment.doctor_notes || null,
      appointment.specialty,
      appointment.doctor_id,
      appointment.doctor_name,
      appointment.pacient_id,
    ]);
    return id;
  }

  static async findById(id: string): Promise<Appointment | undefined> {
    const sql = `SELECT * FROM Appointment WHERE id = ?`;
    return await getQuery<Appointment>(sql, [id]);
  }

  static async findByPacientId(pacient_id: string): Promise<Appointment[]> {
    const sql = `SELECT * FROM Appointment WHERE pacient_id = ? ORDER BY date_time DESC`;
    return await allQuery<Appointment>(sql, [pacient_id]);
  }

  static async findByDoctorId(doctor_id: string): Promise<Appointment[]> {
    const sql = `SELECT * FROM Appointment WHERE doctor_id = ? ORDER BY date_time DESC`;
    return await allQuery<Appointment>(sql, [doctor_id]);
  }

  // CORRIGIR: update e delete devem usar string, não number
  static async update(
    id: string, // MUDAR: era number
    appointment: Partial<Omit<Appointment, "id" | "created">>
  ): Promise<boolean> {
    const fields = Object.keys(appointment)
      .map((key) => `${key} = ?`)
      .join(", ");
    const values = Object.values(appointment);
    const sql = `UPDATE Appointment SET ${fields} WHERE id = ?`;
    await runQuery(sql, [...values, id]);
    return true;
  }

  static async delete(id: string): Promise<boolean> {
    // MUDAR: era number
    const sql = `DELETE FROM Appointment WHERE id = ?`;
    await runQuery(sql, [id]);
    return true;
  }
}
