import { Pacient, PacientAddress } from "../types/index.js";
import { runQuery, getQuery, allQuery } from "../database/connection.js";
import { v4 as uuidv4 } from "uuid";

export class PacientModel {
  static async create(
    pacient: Omit<Pacient, "id" | "created">
  ): Promise<string> {
    try {
      const id = uuidv4();
      const sql =
        "INSERT INTO Pacient (id, name, email, password, cpf) VALUES (?, ?, ?,?,?)";
      await runQuery(sql, [
        id,
        pacient.name,
        pacient.email,
        pacient.password,
        pacient.cpf,
      ]);
      return id;
    } catch (error) {
      throw new Error(
        `Erro ao criar paciente: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`
      );
    }
  }

  static async findByName(name: string): Promise<Pacient | undefined> {
    // Corrigido: findByName
    try {
      const sql = "SELECT * FROM Pacient WHERE name = ?";
      return await getQuery<Pacient>(sql, [name]);
    } catch (error) {
      throw new Error(
        `Erro ao buscar paciente por nome: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`
      );
    }
  }

  static async findByEmail(email: string): Promise<Pacient | undefined> {
    try {
      const sql = "SELECT * FROM Pacient WHERE email = ?";
      return await getQuery<Pacient>(sql, [email]);
    } catch (error) {
      throw new Error(
        `Erro ao buscar paciente por email: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`
      );
    }
  }
  static async findByCPF(cpf: string): Promise<Pacient | undefined> {
    try {
      const sql = "SELECT * FROM Pacient WHERE cpf = ?";
      return await getQuery<Pacient>(sql, [cpf]);
    } catch (error) {
      throw new Error(
        `Erro ao buscar paciente pelo cpf: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`
      );
    }
  }

  static async findById(id: string): Promise<Pacient | undefined> {
    // Corrigido: string (minúsculo)
    try {
      const sql = "SELECT * FROM Pacient WHERE id = ?"; // Corrigido: use a variável sql
      return await getQuery<Pacient>(sql, [id]);
    } catch (error) {
      throw new Error(
        `Erro ao buscar paciente por ID: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`
      );
    }
  }

  static async findAll(
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<Pacient[]> {
    try {
      const offset = (page - 1) * limit;
      let sql = "SELECT * FROM Pacient";
      const params: any[] = [];

      if (search) {
        sql += " WHERE name LIKE ? OR email LIKE ?";
        params.push(`%${search}%`, `%${search}%`);
      }

      sql += " ORDER BY created DESC LIMIT ? OFFSET ?";
      params.push(limit, offset);

      return await allQuery<Pacient>(sql, params);
    } catch (error) {
      throw new Error(
        `Erro ao buscar pacientes: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`
      );
    }
  }

  static async count(search?: string): Promise<number> {
    try {
      let sql = "SELECT COUNT(*) as total FROM Pacient";
      const params: any[] = [];

      if (search) {
        sql += " WHERE name LIKE ? OR email LIKE ?"; // Corrigido: espaço antes do WHERE
        params.push(`%${search}%`, `%${search}%`);
      }

      const result = await getQuery<{ total: number }>(sql, params);
      return result?.total || 0;
    } catch (error) {
      throw new Error(
        `Erro ao contar pacientes: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`
      );
    }
  }

  static async update(
    id: string,
    pacient: Partial<Omit<Pacient, "id" | "created">>
  ): Promise<boolean> {
    try {
      const fields = Object.keys(pacient)
        .map((key) => `${key} = ?`)
        .join(", ");
      const values = Object.values(pacient);

      if (fields.length === 0) {
        throw new Error("Nenhum campo fornecido para atualização");
      }

      const sql = `UPDATE Pacient SET ${fields} WHERE id = ?`;
      await runQuery(sql, [...values, id]);
      return true;
    } catch (error) {
      throw new Error(
        `Erro ao atualizar paciente: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`
      );
    }
  }

  static async delete(id: string): Promise<boolean> {
    try {
      const sql = "DELETE FROM Pacient WHERE id = ?";
      await runQuery(sql, [id]);
      return true;
    } catch (error) {
      throw new Error(
        `Erro ao deletar paciente: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`
      );
    }
  }

  static async createAddress(
    address: Omit<PacientAddress, "id">
  ): Promise<number> {
    try {
      const sql = `
      INSERT INTO PacientAddress (cep, rua, number, bairro, fk_id)
      VALUES (?, ?, ?, ?, ?)
    `;
      await runQuery(sql, [
        address.cep,
        address.rua,
        address.number,
        address.bairro,
        address.fk_id,
      ]);
      return 1;
    } catch (error) {
      throw new Error(
        `Erro ao criar endereço do paciente: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`
      );
    }
  }

  static async findAddressByPacientId(
    fk_id: string
  ): Promise<PacientAddress | undefined> {
    try {
      const sql = `SELECT * FROM PacientAddress WHERE fk_id = ?`;
      return await getQuery<PacientAddress>(sql, [fk_id]);
    } catch (error) {
      throw new Error(
        `Erro ao buscar endereço do paciente: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`
      );
    }
  }

  static async updateAddress(
    fk_id: string,
    address: Partial<Omit<PacientAddress, "id" | "fk_id">>
  ): Promise<boolean> {
    try {
      console.log("🔄 Atualizando endereço para fk_id:", fk_id);
      console.log("📦 Dados do endereço:", address);

      const fields = Object.keys(address)
        .map((key) => `${key} = ?`)
        .join(", ");
      const values = Object.values(address);

      if (fields.length === 0) {
        throw new Error("Nenhum campo fornecido para atualização");
      }

      const sql = `UPDATE PacientAddress SET ${fields} WHERE fk_id = ?`;
      console.log("📝 SQL:", sql);
      console.log("🎯 Valores:", [...values, fk_id]);

      await runQuery(sql, [...values, fk_id]);

      console.log("✅ Endereço atualizado com sucesso");
      return true;
    } catch (error) {
      console.error("❌ Erro ao atualizar endereço do paciente:", error);
      throw new Error(
        `Erro ao atualizar endereço do paciente: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`
      );
    }
  }
  static async deleteAddress(fk_id: string): Promise<boolean> {
    try {
      const sql = `DELETE FROM PacientAddress WHERE fk_id = ?`;
      await runQuery(sql, [fk_id]);
      return true;
    } catch (error) {
      throw new Error(
        `Erro ao deletar endereço do paciente: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`
      );
    }
  }
}
