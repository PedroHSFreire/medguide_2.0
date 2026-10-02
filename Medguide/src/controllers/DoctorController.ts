import { Response, Request, NextFunction } from "express";
import { DoctorModel } from "../models/DoctorModels.js";
import { Doctor, ApiResponse, DoctorAddress } from "../types/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getJwtSecret } from "../config/jwt.js";

export class DoctorController {
  static async login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { login, password } = req.body;

      let doctor: Doctor | null = null;

      console.log("🔐 Tentativa de login:", {
        login,
        passwordLength: password?.length,
      });

      if (login.includes("@")) {
        const result = await DoctorModel.findByEmail(login);
        doctor = result ? result : null;
      } else {
        const cleanCPF = login.replace(/\D/g, "");
        const result = await DoctorModel.findByCPF(cleanCPF);
        doctor = result ? result : null;
      }

      console.log("Doctor encontrado:", doctor ? "Sim" : "Não");

      if (!doctor) {
        console.log(" Doctor não encontrado");
        res.status(401).json({
          success: false,
          error: "Credenciais inválidas",
        });
        return;
      }

      console.log("🔑 Verificando senha...");
      const isPasswordValid = await bcrypt.compare(password, doctor.password);
      console.log("✅ Senha válida:", isPasswordValid);

      if (!isPasswordValid) {
        res.status(401).json({
          success: false,
          error: "Credenciais inválidas",
        });
        return;
      }

      const token = jwt.sign(
        {
          id: doctor.id,
          email: doctor.email,
          type: "doctor",
        },
        getJwtSecret(),
        { expiresIn: "7d" }
      );

      // Remover senha da resposta
      const { password: _, ...doctorWithoutPassword } = doctor;

      const response: ApiResponse<{
        token: string;
        doctor: Omit<Doctor, "password">;
      }> = {
        success: true,
        data: {
          token,
          doctor: doctorWithoutPassword,
        },
        message: "Login realizado com sucesso",
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  static async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const DoctorData: Omit<Doctor, "id" | "created"> = req.body;

      const existingDoctor = await DoctorModel.findByEmail(DoctorData.email);
      if (existingDoctor) {
        res.status(409).json({
          success: false,
          error: "Email já está em uso",
        });
        return;
      }

      const existingDoctorByCPF = await DoctorModel.findByCPF(DoctorData.cpf);
      if (existingDoctorByCPF) {
        res.status(409).json({
          success: false,
          error: "CPF já está em uso",
        });
        return;
      }

      const hashedPassword = await bcrypt.hash(DoctorData.password, 10);
      const doctorDataWithHash = { ...DoctorData, password: hashedPassword };

      const id = await DoctorModel.create(doctorDataWithHash);
      const newDoctor = await DoctorModel.findById(id);

      if (!newDoctor) {
        res.status(500).json({
          success: false,
          error: "Erro ao criar o médico",
        });
        return;
      }

      const { password: _, ...doctorWithoutPassword } = newDoctor;

      const response: ApiResponse<Omit<Doctor, "password">> = {
        success: true,
        data: doctorWithoutPassword,
        message: "Médico criado com sucesso",
      };
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  // 🔥 NOVO: Buscar médicos com filtros
  static async searchDoctors(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { specialty, search } = req.query;

      console.log("🔍 Buscando médicos com filtros:", { specialty, search });

      // Usar o método findAll existente e aplicar filtros
      const doctors = await DoctorModel.findAll(1, 1000, search as string);

      let filteredDoctors = doctors;

      // Aplicar filtro de especialidade se fornecido
      if (specialty) {
        filteredDoctors = filteredDoctors.filter((doctor) =>
          doctor.specialty
            ?.toLowerCase()
            .includes(specialty.toString().toLowerCase())
        );
      }

      // Aplicar filtro de busca se fornecido
      if (search) {
        filteredDoctors = filteredDoctors.filter(
          (doctor) =>
            doctor.name
              .toLowerCase()
              .includes(search.toString().toLowerCase()) ||
            doctor.specialty
              ?.toLowerCase()
              .includes(search.toString().toLowerCase()) ||
            doctor.CRM.toLowerCase().includes(search.toString().toLowerCase())
        );
      }

      // Remover senhas dos resultados
      const doctorsWithoutPassword = filteredDoctors.map((doctor) => {
        const { password, ...doctorWithoutPassword } = doctor;
        return doctorWithoutPassword;
      });

      const response: ApiResponse<{ doctors: Omit<Doctor, "password">[] }> = {
        success: true,
        data: {
          doctors: doctorsWithoutPassword,
        },
        message: `Encontrados ${doctorsWithoutPassword.length} médicos`,
      };

      res.json(response);
    } catch (error: any) {
      console.error("❌ Erro ao buscar médicos:", error);
      res.status(500).json({
        success: false,
        message: "Erro ao buscar médicos",
        error: error.message,
      });
    }
  }

  // 🔥 NOVO: Listar especialidades únicas
  static async getSpecialties(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      console.log("📋 Buscando especialidades disponíveis");

      // Buscar todos os médicos para extrair especialidades únicas
      const doctors = await DoctorModel.findAll(1, 1000);

      // Extrair especialidades únicas
      const specialties = [
        ...new Set(
          doctors
            .map((doctor) => doctor.specialty)
            .filter((specialty) => specialty && specialty.trim() !== "")
        ),
      ].sort();

      // Se não houver especialidades no banco, usar lista padrão
      const defaultSpecialties = [
        "Cardiologista",
        "Dermatologista",
        "Ortopedista",
        "Pediatra",
        "Ginecologista",
        "Oftalmologista",
        "Neurologista",
        "Psiquiatra",
        "Endocrinologista",
        "Gastroenterologista",
        "Urologista",
        "Otorrinolaringologista",
      ];

      const finalSpecialties =
        specialties.length > 0 ? specialties : defaultSpecialties;

      const response: ApiResponse<string[]> = {
        success: true,
        data: finalSpecialties,
        message: `Encontradas ${finalSpecialties.length} especialidades`,
      };

      res.json(response);
    } catch (error: any) {
      console.error("❌ Erro ao buscar especialidades:", error);
      res.status(500).json({
        success: false,
        message: "Erro ao buscar especialidades",
        error: error.message,
      });
    }
  }

  static async getProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const doctorId = req.user?.id;

      if (!doctorId) {
        res.status(401).json({
          success: false,
          error: "Não autorizado",
        });
        return;
      }

      const doctor = await DoctorModel.findById(doctorId);
      if (!doctor) {
        res.status(404).json({
          success: false,
          error: "Médico não encontrado",
        });
        return;
      }

      const { password, ...doctorWithoutPassword } = doctor;

      const response: ApiResponse<Omit<Doctor, "password">> = {
        success: true,
        data: doctorWithoutPassword,
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  static async updateProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const doctorId = req.user?.id;

      if (!doctorId) {
        res.status(401).json({
          success: false,
          error: "Não autorizado",
        });
        return;
      }

      const DoctorData: Partial<Omit<Doctor, "id" | "created">> = req.body;

      if (DoctorData.password) {
        DoctorData.password = await bcrypt.hash(DoctorData.password, 10);
      }

      const existingDoctor = await DoctorModel.findById(doctorId);
      if (!existingDoctor) {
        res.status(404).json({
          success: false,
          error: "Médico não encontrado",
        });
        return;
      }

      if (DoctorData.email && DoctorData.email !== existingDoctor.email) {
        const emailExists = await DoctorModel.findByEmail(DoctorData.email);
        if (emailExists) {
          res.status(409).json({
            success: false,
            error: "Email já está em uso",
          });
          return;
        }
      }

      if (DoctorData.cpf && DoctorData.cpf !== existingDoctor.cpf) {
        const cpfExists = await DoctorModel.findByCPF(DoctorData.cpf);
        if (cpfExists) {
          res.status(409).json({
            success: false,
            error: "CPF já está em uso",
          });
          return;
        }
      }

      await DoctorModel.update(doctorId, DoctorData);
      const updatedDoctor = await DoctorModel.findById(doctorId);

      if (!updatedDoctor) {
        res.status(500).json({
          success: false,
          error: "Erro ao atualizar médico",
        });
        return;
      }

      const { password, ...doctorWithoutPassword } = updatedDoctor;

      const response: ApiResponse<Omit<Doctor, "password">> = {
        success: true,
        data: doctorWithoutPassword,
        message: "Perfil atualizado com sucesso",
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  static async forgotPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email } = req.body;

      const response: ApiResponse<null> = {
        success: true,
        message: "Instruções para redefinição de senha enviadas para o e-mail",
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  static async findAll(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { page = 1, limit = 100, search } = req.query;

      const doctors = await DoctorModel.findAll(
        Number(page),
        Number(limit),
        search as string
      );

      // Remover senhas dos resultados
      const doctorsWithoutPassword = doctors.map((doctor) => {
        const { password, ...doctorWithoutPassword } = doctor;
        return doctorWithoutPassword;
      });

      const response: ApiResponse<{ doctors: Omit<Doctor, "password">[] }> = {
        success: true,
        data: {
          doctors: doctorsWithoutPassword,
        },
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  static async resetPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { token, password } = req.body;

      const response: ApiResponse<null> = {
        success: true,
        message: "Senha redefinida com sucesso",
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    this.register(req, res, next);
  }

  static async findById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({
          success: false,
          message: "ID é obrigatório",
        });
        return;
      }

      const doctor = await DoctorModel.findById(id);
      if (!doctor) {
        res.status(404).json({
          success: false,
          error: "Médico não encontrado",
        });
        return;
      }

      const { password, ...doctorWithoutPassword } = doctor;

      const response: ApiResponse<Omit<Doctor, "password">> = {
        success: true,
        data: doctorWithoutPassword,
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  static async findByEmail(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email } = req.params;
      if (!email) {
        res.status(400).json({
          success: false,
          message: "Email é obrigatório",
        });
        return;
      }

      const doctor = await DoctorModel.findByEmail(email);
      if (!doctor) {
        res.status(404).json({
          success: false,
          error: "Médico não encontrado",
        });
        return;
      }

      const { password, ...doctorWithoutPassword } = doctor;

      const response: ApiResponse<Omit<Doctor, "password">> = {
        success: true,
        data: doctorWithoutPassword,
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  static async findByCPF(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { cpf } = req.params;
      if (!cpf) {
        res.status(400).json({
          success: false,
          message: "CPF é obrigatório",
        });
        return;
      }

      const cleanCPF = cpf.replace(/\D/g, "");
      const doctor = await DoctorModel.findByCPF(cleanCPF);

      if (!doctor) {
        res.status(404).json({
          success: false,
          error: "Médico não encontrado",
        });
        return;
      }

      const { password, ...doctorWithoutPassword } = doctor;

      const response: ApiResponse<Omit<Doctor, "password">> = {
        success: true,
        data: doctorWithoutPassword,
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

      if (!id) {
        res.status(400).json({
          success: false,
          error: "ID é Obrigatório",
        });
        return;
      }

      const DoctorData: Partial<Omit<Doctor, "id" | "created">> = req.body;

      if (DoctorData.password) {
        DoctorData.password = await bcrypt.hash(DoctorData.password, 10);
      }

      const existingDoctor = await DoctorModel.findById(id);
      if (!existingDoctor) {
        res.status(404).json({
          success: false,
          error: "Médico não encontrado",
        });
        return;
      }

      if (DoctorData.email && DoctorData.email !== existingDoctor.email) {
        const emailExists = await DoctorModel.findByEmail(DoctorData.email);
        if (emailExists) {
          res.status(409).json({
            success: false,
            error: "Email já está em uso",
          });
          return;
        }
      }

      if (DoctorData.cpf && DoctorData.cpf !== existingDoctor.cpf) {
        const cpfExists = await DoctorModel.findByCPF(DoctorData.cpf);
        if (cpfExists) {
          res.status(409).json({
            success: false,
            error: "CPF já está em uso",
          });
          return;
        }
      }

      await DoctorModel.update(id, DoctorData);
      const updatedDoctor = await DoctorModel.findById(id);

      if (!updatedDoctor) {
        res.status(500).json({
          success: false,
          error: "Erro ao atualizar médico",
        });
        return;
      }

      const { password, ...doctorWithoutPassword } = updatedDoctor;

      const response: ApiResponse<Omit<Doctor, "password">> = {
        success: true,
        data: doctorWithoutPassword,
        message: "Médico atualizado com sucesso",
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

      if (!id) {
        res.status(400).json({
          success: false,
          error: "ID é obrigatório",
        });
        return;
      }

      const existingDoctor = await DoctorModel.findById(id);
      if (!existingDoctor) {
        res.status(404).json({
          success: false,
          error: "Médico não encontrado",
        });
        return;
      }

      await DoctorModel.delete(id);

      const response: ApiResponse<null> = {
        success: true,
        message: "Médico removido com sucesso",
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  static async createAddress(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({
          success: false,
          message: "ID é obrigatório",
        });
        return;
      }
      const addressData: Omit<DoctorAddress, "id"> = { ...req.body, fk_id: id };
      const doctor = await DoctorModel.findById(id);
      if (!doctor) {
        res.status(404).json({
          success: false,
          error: "Médico não encontrado",
        });
        return;
      }

      // Verificar se já tem endereço
      const existingAddress = await DoctorModel.findAddressByDoctorId(id);
      if (existingAddress) {
        res.status(409).json({
          success: false,
          error: "Médico já possui endereço cadastrado",
        });
        return;
      }

      const addressId = await DoctorModel.createAddress(addressData);

      const response: ApiResponse<{ id: Number }> = {
        success: true,
        data: { id: addressId },
        message: "Endereço do médico criado com sucesso",
      };
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async getAddress(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({
          success: false,
          message: "ID é obrigatório",
        });
        return;
      }
      const address = await DoctorModel.findAddressByDoctorId(id);

      if (!address) {
        res.status(404).json({
          success: false,
          error: "Endereço não encontrado",
        });
        return;
      }

      const response: ApiResponse<DoctorAddress> = {
        success: true,
        data: address,
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  static async findAllWithAddress(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const doctors = await DoctorModel.findAllWithAddress();

      const response: ApiResponse<(Doctor & { address?: DoctorAddress })[]> = {
        success: true,
        data: doctors,
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  static async updateAddress(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({
          success: false,
          message: "ID é obrigatório",
        });
        return;
      }
      const addressData: Partial<Omit<DoctorAddress, "id" | "fk_id">> =
        req.body;

      // Verificar se médico existe
      const doctor = await DoctorModel.findById(id);
      if (!doctor) {
        res.status(404).json({
          success: false,
          error: "Médico não encontrado",
        });
        return;
      }

      // Verificar se endereço existe
      const existingAddress = await DoctorModel.findAddressByDoctorId(id);
      if (!existingAddress) {
        res.status(404).json({
          success: false,
          error: "Endereço não encontrado",
        });
        return;
      }

      await DoctorModel.updateAddress(id, addressData);

      const response: ApiResponse<null> = {
        success: true,
        message: "Endereço atualizado com sucesso",
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  static async deleteAddress(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({
          success: false,
          message: "ID é obrigatório",
        });
        return;
      }
      // Verificar se endereço existe
      const existingAddress = await DoctorModel.findAddressByDoctorId(id);
      if (!existingAddress) {
        res.status(404).json({
          success: false,
          error: "Endereço não encontrado",
        });
        return;
      }

      await DoctorModel.deleteAddress(id);

      const response: ApiResponse<null> = {
        success: true,
        message: "Endereço removido com sucesso",
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }
}
