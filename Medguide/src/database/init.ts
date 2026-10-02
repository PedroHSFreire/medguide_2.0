import { connectionReady, runQuery } from "./connection.js";

let initialization: Promise<void> | undefined;

export function initializeDatabase(): Promise<void> {
  initialization ??= createTables();
  return initialization;
}

async function createTables(): Promise<void> {
  const createDoctorTable = `
    CREATE TABLE IF NOT EXISTS Doctor (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      CRM TEXT NOT NULL UNIQUE,
      specialty TEXT NOT NULL,
      password TEXT,
      cpf TEXT,
      created DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;

  const createDoctorAddress = `
    CREATE TABLE IF NOT EXISTS DoctorAddress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cep TEXT NOT NULL,
      rua TEXT NOT NULL,
      number INTEGER NOT NULL,
      bairro TEXT NOT NULL,
      fk_id TEXT NOT NULL,
      FOREIGN KEY (fk_id) REFERENCES Doctor(id)
    )
  `;

  const createPacientTable = `
    CREATE TABLE IF NOT EXISTS Pacient (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT,
      cpf TEXT,
      created DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;

  const createPacientAddress = `
    CREATE TABLE IF NOT EXISTS PacientAddress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cep TEXT NOT NULL,
      rua TEXT NOT NULL,
      number INTEGER NOT NULL,
      bairro TEXT NOT NULL,
      fk_id TEXT NOT NULL,
      FOREIGN KEY (fk_id) REFERENCES Pacient(id)
    )
  `;

  const createAppointmentTable = `
    CREATE TABLE IF NOT EXISTS Appointment (
      id TEXT PRIMARY KEY,
      date_time DATETIME NOT NULL,
      status TEXT NOT NULL DEFAULT 'agendada',
      type TEXT NOT NULL,
      symptoms TEXT NOT NULL,
      diagnosis TEXT,
      prescription TEXT,
      doctor_notes TEXT,
      specialty TEXT NOT NULL,
      doctor_id TEXT NOT NULL,
      doctor_name TEXT NOT NULL,
      pacient_id TEXT NOT NULL,
      created DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (doctor_id) REFERENCES Doctor(id),
      FOREIGN KEY (pacient_id) REFERENCES Pacient(id)
    )
  `;

  await connectionReady;
  await runQuery(createDoctorTable);
  await runQuery(createPacientTable);
  await runQuery(createPacientAddress);
  await runQuery(createDoctorAddress);
  await runQuery(createAppointmentTable);
  console.log("✅ Esquema SQLite pronto");
}
