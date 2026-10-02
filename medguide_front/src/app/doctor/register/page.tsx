// app/components/views/doctor/CadastroMedico.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  Mail,
  Lock,
  IdCard,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  Stethoscope,
  Phone,
} from "lucide-react";

interface RegisterFormData {
  name: string;
  email: string;
  cpf: string;
  crm: string;
  specialty: string;
  phone: string;
  password: string;
}

interface ValidationErrors {
  name?: string;
  email?: string;
  cpf?: string;
  crm?: string;
  specialty?: string;
  phone?: string;
  password?: string;
}

export default function CadastroMedico() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<RegisterFormData>({
    name: "",
    email: "",
    cpf: "",
    crm: "",
    specialty: "",
    phone: "",
    password: "",
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const validateName = (name: string): string | undefined => {
    if (!name) return "Nome completo é obrigatório";
    if (name.length < 3) return "Nome deve ter pelo menos 3 caracteres";
    if (!/^[a-zA-ZÀ-ÿ\s]{3,}$/.test(name))
      return "Nome deve conter apenas letras";
  };

  const validateEmail = (email: string): string | undefined => {
    if (!email) return "E-mail é obrigatório";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "E-mail inválido";
  };

  const validateCPF = (cpf: string): string | undefined => {
    if (!cpf) return "CPF é obrigatório";
    const cleanCPF = cpf.replace(/\D/g, "");
    if (cleanCPF.length !== 11) return "CPF deve ter 11 dígitos";
    return undefined;
  };

  const validateCRM = (crm: string): string | undefined => {
    if (!crm) return "CRM é obrigatório";
    if (crm.length < 4) return "CRM deve ter pelo menos 4 caracteres";
    return undefined;
  };

  const validateSpecialty = (specialty: string): string | undefined => {
    if (!specialty) return "Especialidade é obrigatória";
    return undefined;
  };

  const validatePhone = (phone: string): string | undefined => {
    if (phone && phone.trim()) {
      const cleanPhone = phone.replace(/\D/g, "");
      if (cleanPhone.length < 10)
        return "Telefone deve ter pelo menos 10 dígitos";
      if (cleanPhone.length > 11)
        return "Telefone deve ter no máximo 11 dígitos";
    }
    return undefined;
  };

  const validatePassword = (password: string): string | undefined => {
    if (!password) return "Senha é obrigatória";
    if (password.length < 6) return "Senha deve ter pelo menos 6 caracteres";
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return "Senha deve conter letras maiúsculas, minúsculas e números";
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    const nameError = validateName(formData.name);
    if (nameError) newErrors.name = nameError;

    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;

    const cpfError = validateCPF(formData.cpf);
    if (cpfError) newErrors.cpf = cpfError;

    const crmError = validateCRM(formData.crm);
    if (crmError) newErrors.crm = crmError;

    const specialtyError = validateSpecialty(formData.specialty);
    if (specialtyError) newErrors.specialty = specialtyError;

    const phoneError = validatePhone(formData.phone);
    if (phoneError) newErrors.phone = phoneError;

    const passwordError = validatePassword(formData.password);
    if (passwordError) newErrors.password = passwordError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case "name":
        return validateName(value);
      case "email":
        return validateEmail(value);
      case "cpf":
        return validateCPF(value);
      case "crm":
        return validateCRM(value);
      case "specialty":
        return validateSpecialty(value);
      case "phone":
        return validatePhone(value);
      case "password":
        return validatePassword(value);
      default:
        return undefined;
    }
  };

  const formatCPF = (value: string): string => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return numbers.replace(/(\d{3})(\d)/, "$1.$2");
    if (numbers.length <= 9)
      return numbers.replace(/(\d{3})(\d{3})(\d)/, "$1.$2.$3");
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d)/, "$1.$2.$3-$4");
  };

  const formatCRM = (value: string): string => {
    // Permite letras, números e hífens para CRM
    return value.toUpperCase().replace(/[^A-Z0-9\-]/g, "");
  };

  const formatPhone = (value: string): string => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length === 0) return "";
    if (numbers.length <= 2) return `(${numbers}`;
    if (numbers.length <= 6)
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    if (numbers.length <= 10)
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(
        6
      )}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(
      7,
      11
    )}`;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    let formattedValue = value;
    if (name === "cpf") {
      formattedValue = formatCPF(value);
    } else if (name === "crm") {
      formattedValue = formatCRM(value);
    } else if (name === "phone") {
      formattedValue = formatPhone(value);
    }

    setFormData((prev) => ({ ...prev, [name]: formattedValue }));
    setSubmitError("");
    setSubmitSuccess(false);

    if (touched[name]) {
      const error = validateField(name, formattedValue);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleInputBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Marcar todos os campos como tocados
    setTouched({
      name: true,
      email: true,
      cpf: true,
      crm: true,
      specialty: true,
      phone: true,
      password: true,
    });

    setSubmitError("");
    setSubmitSuccess(false);

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const cpfNumerico = formData.cpf.replace(/\D/g, "");
      const phoneNumerico = formData.phone.replace(/\D/g, "") || "";

      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const baseUrl = apiUrl?.endsWith("/") ? apiUrl.slice(0, -1) : apiUrl;
      const endpoint = `${baseUrl}/api/doctor/register`;

      console.log("🩺 Tentando registrar médico em:", endpoint);

      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        cpf: cpfNumerico,
        CRM: formData.crm.trim().toUpperCase(),
        specialty: formData.specialty,
        phone: phoneNumerico || null,
        password: formData.password,
      };

      console.log("📦 Payload enviado:", {
        ...payload,
        password: "[PROTEGIDO]", // Não logar a senha
      });

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      // 🔥 CORREÇÃO: Melhor tratamento da resposta
      let data;
      const responseText = await response.text();

      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch (parseError) {
        console.error("❌ Erro ao parsear resposta:", parseError);
        throw new Error("Resposta inválida do servidor");
      }

      console.log("📨 Resposta completa:", {
        status: response.status,
        statusText: response.statusText,
        data: data,
      });

      if (!response.ok) {
        // 🔥 CORREÇÃO: Tratamento mais específico de erros
        let errorMessage =
          data?.message || data?.error || `Erro ${response.status} no cadastro`;

        if (response.status === 400) {
          // Tentar obter mais detalhes do erro 400
          if (data.details) {
            errorMessage += ` - ${JSON.stringify(data.details)}`;
          } else if (data.errors) {
            errorMessage += ` - ${JSON.stringify(data.errors)}`;
          }
        } else if (response.status === 409) {
          errorMessage = "CPF, CRM ou e-mail já cadastrado no sistema.";
        } else if (response.status === 500) {
          errorMessage =
            "Erro interno do servidor. Tente novamente em alguns instantes.";
        } else if (response.status === 404) {
          errorMessage = "Serviço de cadastro indisponível no momento.";
        }

        throw new Error(errorMessage);
      }

      // Verificar se o cadastro foi realmente bem-sucedido
      if (data.success === false) {
        throw new Error(data.message || "Falha no cadastro");
      }

      console.log("✅ Cadastro médico realizado com sucesso!", data);
      setSubmitSuccess(true);

      setTimeout(() => {
        router.push("/doctor/login");
      }, 2000);
    } catch (error: unknown) {
      console.error("❌ Erro completo no cadastro do médico:", error);

      let errorMessage = "Erro ao realizar cadastro. Tente novamente.";

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "object" && error !== null) {
        errorMessage = JSON.stringify(error);
      }

      // 🔥 CORREÇÃO: Mensagem mais específica para erro 400
      if (
        errorMessage.includes("400") ||
        errorMessage.toLowerCase().includes("dados inválidos")
      ) {
        errorMessage =
          "Dados inválidos enviados ao servidor. Verifique se todos os campos estão preenchidos corretamente.";
      }

      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    !errors.name &&
    !errors.email &&
    !errors.cpf &&
    !errors.crm &&
    !errors.specialty &&
    !errors.password &&
    formData.name &&
    formData.email &&
    formData.cpf &&
    formData.crm &&
    formData.specialty &&
    formData.password;

  const specialties = [
    "Cardiologia",
    "Dermatologia",
    "Pediatria",
    "Ortopedia",
    "Ginecologia",
    "Neurologia",
    "Oftalmologia",
    "Psiquiatria",
    "Urologia",
    "Endocrinologia",
    "Gastroenterologia",
    "Oncologia",
    "Clínico Geral",
    "Anestesiologia",
    "Radiologia",
    "Cirurgia Geral",
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-teal-100 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              <ArrowLeft className="w-5 h-5" />
              Voltar para Home
            </Link>
            <div className="text-lg font-semibold text-gray-900">MedGuide</div>
          </div>
        </div>
      </div>

      {/* Formulário */}
      <div className="flex-1 flex items-center justify-center p-4 w-full">
        <div className="w-full max-w-2xl">
          <div className="bg-white rounded-3xl shadow-2xl p-8 w-full">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-linear-to-r from-blue-600 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Stethoscope className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Cadastro do Médico
              </h1>
              <p className="text-gray-600">
                Crie sua conta para gerenciar consultas e pacientes
              </p>
            </div>

            {submitError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <div className="flex items-center text-red-700">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  <span className="font-medium">{submitError}</span>
                </div>
                <div className="mt-2 text-sm text-red-600">
                  <p>Verifique se:</p>
                  <ul className="list-disc list-inside ml-2">
                    <li>Todos os campos obrigatórios estão preenchidos</li>
                    <li>O formato do CRM está correto (ex: SP-123456)</li>
                    <li>O CPF tem 11 dígitos</li>
                    <li>A senha atende aos requisitos</li>
                  </ul>
                </div>
              </div>
            )}

            {submitSuccess && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                <div className="flex items-center text-green-700">
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  <span className="font-medium">
                    Cadastro realizado com sucesso! Redirecionando para login...
                  </span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nome */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome Completo *
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      onBlur={handleInputBlur}
                      placeholder="Seu nome completo"
                      className={`w-full text-black pl-12 pr-10 py-3 bg-gray-50 border rounded-xl focus:outline-none transition-all duration-200 ${
                        errors.name
                          ? "border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          : touched.name && !errors.name
                          ? "border-green-500 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          : "border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      }`}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {errors.name ? (
                        <AlertCircle className="w-5 h-5 text-red-500" />
                      ) : touched.name && !errors.name ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : null}
                    </div>
                  </div>
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    E-mail *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      onBlur={handleInputBlur}
                      placeholder="seu@email.com"
                      className={`w-full pl-12 text-black pr-10 py-3 bg-gray-50 border rounded-xl focus:outline-none transition-all duration-200 ${
                        errors.email
                          ? "border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          : touched.email && !errors.email
                          ? "border-green-500 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          : "border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      }`}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {errors.email ? (
                        <AlertCircle className="w-5 h-5 text-red-500" />
                      ) : touched.email && !errors.email ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : null}
                    </div>
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* CPF */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CPF *
                  </label>
                  <div className="relative">
                    <IdCard className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="cpf"
                      value={formData.cpf}
                      onChange={handleInputChange}
                      onBlur={handleInputBlur}
                      placeholder="000.000.000-00"
                      maxLength={14}
                      className={`w-full pl-12 text-black pr-10 py-3 bg-gray-50 border rounded-xl focus:outline-none transition-all duration-200 ${
                        errors.cpf
                          ? "border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          : touched.cpf && !errors.cpf
                          ? "border-green-500 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          : "border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      }`}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {errors.cpf ? (
                        <AlertCircle className="w-5 h-5 text-red-500" />
                      ) : touched.cpf && !errors.cpf ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : null}
                    </div>
                  </div>
                  {errors.cpf && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.cpf}
                    </p>
                  )}
                </div>

                {/* CRM */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CRM *
                  </label>
                  <div className="relative">
                    <IdCard className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="crm"
                      value={formData.crm}
                      onChange={handleInputChange}
                      onBlur={handleInputBlur}
                      placeholder="Ex: SP-123456"
                      className={`w-full pl-12 text-black pr-10 py-3 bg-gray-50 border rounded-xl focus:outline-none transition-all duration-200 ${
                        errors.crm
                          ? "border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          : touched.crm && !errors.crm
                          ? "border-green-500 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          : "border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      }`}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {errors.crm ? (
                        <AlertCircle className="w-5 h-5 text-red-500" />
                      ) : touched.crm && !errors.crm ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : null}
                    </div>
                  </div>
                  {errors.crm && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.crm}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Digite o CRM completo (ex: SP-123456)
                  </p>
                </div>

                {/* Especialidade */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Especialidade *
                  </label>
                  <div className="relative">
                    <Stethoscope className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      name="specialty"
                      value={formData.specialty}
                      onChange={handleInputChange}
                      onBlur={handleInputBlur}
                      className={`w-full pl-12 text-black pr-10 py-3 bg-gray-50 border rounded-xl focus:outline-none transition-all duration-200 ${
                        errors.specialty
                          ? "border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          : touched.specialty && !errors.specialty
                          ? "border-green-500 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          : "border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      }`}
                    >
                      <option value="">Selecione uma especialidade</option>
                      {specialties.map((spec) => (
                        <option key={spec} value={spec}>
                          {spec}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {errors.specialty ? (
                        <AlertCircle className="w-5 h-5 text-red-500" />
                      ) : touched.specialty && !errors.specialty ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : null}
                    </div>
                  </div>
                  {errors.specialty && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.specialty}
                    </p>
                  )}
                </div>

                {/* Telefone */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefone (Opcional)
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      onBlur={handleInputBlur}
                      placeholder="(11) 99999-9999"
                      maxLength={15}
                      className={`w-full pl-12 text-black pr-10 py-3 bg-gray-50 border rounded-xl focus:outline-none transition-all duration-200 ${
                        errors.phone
                          ? "border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          : touched.phone && !errors.phone
                          ? "border-green-500 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          : "border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      }`}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {errors.phone ? (
                        <AlertCircle className="w-5 h-5 text-red-500" />
                      ) : touched.phone && !errors.phone ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : null}
                    </div>
                  </div>
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.phone}
                    </p>
                  )}
                </div>

                {/* Senha */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Senha *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      onBlur={handleInputBlur}
                      placeholder="Sua senha"
                      className={`w-full pl-12 text-black pr-12 py-3 bg-gray-50 border rounded-xl focus:outline-none transition-all duration-200 ${
                        errors.password
                          ? "border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          : touched.password && !errors.password
                          ? "border-green-500 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          : "border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.password}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    A senha deve ter pelo menos 6 caracteres, incluindo letras
                    maiúsculas, minúsculas e números.
                  </p>
                </div>
              </div>

              {/* Botão de Cadastro */}
              <button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className={`w-full py-4 px-6 rounded-xl font-semibold shadow-lg transform transition-all duration-200 ${
                  isFormValid && !isSubmitting
                    ? "cursor-pointer bg-linear-to-r from-blue-600 to-teal-500 text-white hover:shadow-xl hover:-translate-y-0.5"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Cadastrando...
                  </div>
                ) : (
                  "Cadastrar"
                )}
              </button>

              {/* Link para Login */}
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Já tem uma conta?{" "}
                  <Link
                    href="/doctor/login"
                    className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                  >
                    Faça login
                  </Link>
                </p>
              </div>
            </form>

            {/* 🔥 SEÇÃO DE DEBUG - REMOVER EM PRODUÇÃO */}
            <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
              <h3 className="text-sm font-medium text-yellow-800 mb-2">
                Debug Info:
              </h3>
              <div className="text-xs text-yellow-700 space-y-1">
                <p>API URL: {process.env.NEXT_PUBLIC_API_URL}</p>
                <p>
                  Endpoint: {process.env.NEXT_PUBLIC_API_URL}
                  /api/doctor/register
                </p>
                <p>
                  Campos preenchidos:{" "}
                  {
                    Object.keys(formData).filter(
                      (key) => formData[key as keyof RegisterFormData]
                    ).length
                  }
                  /7
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
