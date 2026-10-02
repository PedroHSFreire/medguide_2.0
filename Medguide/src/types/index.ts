export interface Doctor {
  id?: string;
  name: string;
  email: string;
  CRM: string;
  specialty: string;
  password: string;
  cpf: string;
  created?: string;
}

export interface Pacient {
  id?: string;
  name: string;
  email: string;
  password: string;
  cpf: string;
  created?: string;
}

export interface DoctorAddress {
  id?: number;
  cep: string;
  rua: string;
  number: number;
  bairro: string;
  fk_id: string;
}

export interface PacientAddress {
  id?: number;
  cep: string;
  rua: string;
  number: number;
  bairro: string;
  fk_id: string;
}

export interface Appointment {
  id?: string;
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
  created?: string;
}

// Tipos auxiliares para forms e criação
export interface CreateAppointmentDTO {
  date_time: string;
  status: Appointment["status"];
  type: Appointment["type"];
  symptoms: string;
  specialty: string;
  doctor_id: string;
  doctor_name: string;
  pacient_id: string;
  diagnosis?: string;
  prescription?: string;
  doctor_notes?: string;
}

export interface UpdateAppointmentDTO {
  diagnosis?: string;
  prescription?: string;
  doctor_notes?: string;
  status?: Appointment["status"];
  symptoms?: string;
}
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
