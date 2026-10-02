import { Doctor, DoctorAddress } from "../types/index.js";
import { runQuery, getQuery, allQuery } from "../database/connection.js";
import { v4 as uuidv4 } from "uuid";

export class DoctorModel {
  static async create(doctor: Omit<Doctor, "id" | "created">): Promise<string> {
    try {
      const id = uuidv4();
      const sql =
        "INSERT INTO Doctor (id, name, email, CRM, specialty, password, cpf) VALUES (?, ?, ?, ?, ?, ?, ?)";
      await runQuery(sql, [
        id,
        doctor.name,
        doctor.email,
        doctor.CRM,
        doctor.specialty,
        doctor.password,
        doctor.cpf,
      ]);
      return id;
    } catch (error) {
      throw new Error(
        `Erro ao criar médico: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`
      );
    }
  }

  static async findById(id: string): Promise<Doctor | undefined> {
    try {
      const sql = "SELECT * FROM Doctor WHERE id = ?";
      return await getQuery<Doctor>(sql, [id]);
    } catch (error) {
      throw new Error(
        `Erro ao buscar médico por ID: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`
      );
    }
  }

  static async findByName(name: string): Promise<Doctor | undefined> {
    try {
      const sql = "SELECT * FROM Doctor WHERE name = ?";
      return await getQuery<Doctor>(sql, [name]);
    } catch (error) {
      throw new Error(
        `Erro ao buscar médico por nome: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`
      );
    }
  }

  static async findByEmail(email: string): Promise<Doctor | undefined> {
    try {
      const sql = "SELECT * FROM Doctor WHERE email = ?";
      return await getQuery<Doctor>(sql, [email]);
    } catch (error) {
      throw new Error(
        `Erro ao buscar médico por email: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`
      );
    }
  }

  static async findByCRM(CRM: string): Promise<Doctor | undefined> {
    try {
      const sql = "SELECT * FROM Doctor WHERE CRM = ?";
      return await getQuery<Doctor>(sql, [CRM]);
    } catch (error) {
      throw new Error(
        `Erro ao buscar médico por CRM: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`
      );
    }
  }

  static async findBySpecialty(specialty: string): Promise<Doctor[]> {
    try {
      const sql = "SELECT * FROM Doctor WHERE specialty = ?";
      return await allQuery<Doctor>(sql, [specialty]);
    } catch (error) {
      throw new Error(
        `Erro ao buscar médico por especialidade: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`
      );
    }
  }
  static async findByCPF(cpf: string): Promise<Doctor | undefined> {
    try {
      const sql = `SELECT * FROM Doctor WHERE cpf = ?`;
      return await getQuery<Doctor>(sql, [cpf]);
    } catch (error) {
      throw new Error(
        `Não foi possível achar o cpf: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`
      );
    }
  }

  static async findAll(
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<Doctor[]> {
    try {
      const offset = (page - 1) * limit;
      let sql = "SELECT * FROM Doctor";
      const params: any[] = [];

      if (search) {
        sql += " WHERE name LIKE ? OR email LIKE ? OR specialty LIKE ?";
        params.push(`%${search}%`, `%${search}%`, `%${search}%`);
      }

      sql += " ORDER BY created DESC LIMIT ? OFFSET ?";
      params.push(limit, offset);

      return await allQuery<Doctor>(sql, params);
    } catch (error) {
      throw new Error(
        `Erro ao buscar médicos: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`
      );
    }
  }

  static async count(search?: string): Promise<number> {
    try {
      let sql = "SELECT COUNT(*) as total FROM Doctor";
      const params: any[] = [];

      if (search) {
        sql += " WHERE name LIKE ? OR email LIKE ? OR specialty LIKE ?"; // Corrigido: espaço antes do WHERE
        params.push(`%${search}%`, `%${search}%`, `%${search}%`);
      }

      const result = await getQuery<{ total: number }>(sql, params);
      return result?.total || 0;
    } catch (error) {
      throw new Error(
        `Erro ao contar médicos: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`
      );
    }
  }
  static async update(
    id: string,
    doctor: Partial<Omit<Doctor, "id" | "created">>
  ): Promise<boolean> {
    try {
      const fields = Object.keys(doctor)
        .map((key) => `${key} = ?`)
        .join(", ");
      const values = Object.values(doctor);

      if (fields.length === 0) {
        throw new Error("Nenhum campo fornecido para atualização");
      }

      const sql = `UPDATE Doctor SET ${fields} WHERE id = ?`;
      await runQuery(sql, [...values, id]);
      return true;
    } catch (error) {
      throw new Error(
        `Erro ao atualizar médico: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`
      );
    }
  }

  static async delete(id: string): Promise<boolean> {
    try {
      const sql = "DELETE FROM Doctor WHERE id = ?";
      await runQuery(sql, [id]);
      return true;
    } catch (error) {
      throw new Error(
        `Erro ao deletar médico: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`
      );
    }
  }

  // No DoctorModels.ts - método findAllWithAddress
  static async findAllWithAddress(): Promise<
    (Doctor & { address?: DoctorAddress })[]
  > {
    try {
      console.log("🔍 Iniciando busca de médicos com endereço...");

      const sql = `
      SELECT d.*, da.id as address_id, da.cep, da.rua, da.number, da.bairro, da.fk_id
      FROM Doctor d 
      LEFT JOIN DoctorAddress da ON d.id = da.fk_id
    `;

      console.log("📝 SQL:", sql);

      const results = await allQuery<any>(sql);
      console.log(`🎯 Número de médicos encontrados: ${results.length}`);

      if (results.length === 0) {
        console.log("⚠️ NENHUM médico encontrado na tabela Doctor");

        const checkDoctors = await allQuery<any>("SELECT * FROM Doctor");
        console.log(`👨‍⚕️ Médicos na tabela Doctor: ${checkDoctors.length}`);
        checkDoctors.forEach((doc: any, index: number) => {
          console.log(
            `  ${index + 1}. ${doc.name} - ${doc.specialty} - ID: ${doc.id}`
          );
        });
      }

      const transformed: (Doctor & { address?: DoctorAddress })[] = results.map(
        (row: any) => {
          const doctorData: Doctor = {
            id: row.id,
            name: row.name,
            email: row.email,
            CRM: row.CRM,
            specialty: row.specialty,
            password: row.password,
            cpf: row.cpf,
            created: row.created,
          };

          console.log(
            `👨‍⚕️ Processando médico: ${doctorData.name} - ${doctorData.specialty}`
          );

          if (!row.cep) {
            return doctorData;
          }

          const addressData: DoctorAddress = {
            id: row.address_id,
            cep: row.cep,
            rua: row.rua,
            number: row.number,
            bairro: row.bairro,
            fk_id: row.fk_id,
          };

          return {
            ...doctorData,
            address: addressData,
          };
        }
      );

      console.log("✅ Transformação concluída");
      return transformed;
    } catch (error) {
      console.error("❌ Erro crítico no findAllWithAddress:", error);
      throw error;
    }
  }
  static async createAddress(
    address: Omit<DoctorAddress, "id">
  ): Promise<number> {
    try {
      const sql = `
      INSERT INTO DoctorAddress (cep, rua, number, bairro, fk_id)
      VALUES (?, ?, ?, ?, ?)
    `;
      const result = await runQuery(sql, [
        address.cep,
        address.rua,
        address.number,
        address.bairro,
        address.fk_id,
      ]);
      return 1; // SQLite retorna o ID via callback, mas nossa implementação atual não captura
    } catch (error) {
      throw new Error(
        `Erro ao criar endereço do médico: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`
      );
    }
  }
  static async findAddressByDoctorId(
    fk_id: string
  ): Promise<DoctorAddress | undefined> {
    try {
      const sql = `SELECT * FROM DoctorAddress WHERE fk_id = ?`;
      return await getQuery<DoctorAddress>(sql, [fk_id]);
    } catch (error) {
      throw new Error(
        `Erro ao buscar endereço do médico: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`
      );
    }
  }

  static async updateAddress(
    fk_id: string,
    address: Partial<Omit<DoctorAddress, "id" | "fk_id">>
  ): Promise<boolean> {
    try {
      const fields = Object.keys(address)
        .map((key) => `${key} = ?`)
        .join(", ");
      const values = Object.values(address);

      if (fields.length === 0) {
        throw new Error("Nenhum campo fornecido para atualização");
      }

      const sql = `UPDATE DoctorAddress SET ${fields} WHERE fk_id = ?`;
      await runQuery(sql, [...values, fk_id]);
      return true;
    } catch (error) {
      throw new Error(
        `Erro ao atualizar endereço do médico: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`
      );
    }
  }

  static async deleteAddress(fk_id: string): Promise<boolean> {
    try {
      const sql = `DELETE FROM DoctorAddress WHERE fk_id = ?`;
      await runQuery(sql, [fk_id]);
      return true;
    } catch (error) {
      throw new Error(
        `Erro ao deletar endereço do médico: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`
      );
    }
  }
}
