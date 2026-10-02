// app/components/views/pacient/CadastroPaciente.tsx
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
} from "lucide-react";

interface RegisterFormData {
  name: string;
  email: string;
  cpf: string;
  password: string;
}

interface ValidationErrors {
  name?: string;
  email?: string;
  cpf?: string;
  password?: string;
}

export default function CadastroPaciente() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<RegisterFormData>({
    name: "",
    email: "",
    cpf: "",
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    let formattedValue = value;
    if (name === "cpf") {
      formattedValue = formatCPF(value);
    }

    setFormData((prev) => ({ ...prev, [name]: formattedValue }));
    setSubmitError("");
    setSubmitSuccess(false);

    if (touched[name]) {
      const error = validateField(name, formattedValue);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  // CORREÇÃO DA URL DA API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      name: true,
      email: true,
      cpf: true,
      password: true,
    });
    setSubmitError("");
    setSubmitSuccess(false);

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const cpfNumerico = formData.cpf.replace(/\D/g, "");

      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      const baseUrl = apiUrl?.endsWith("/") ? apiUrl.slice(0, -1) : apiUrl;
      const endpoint = `${baseUrl}/api/pacient/register`;

      console.log("Tentando registrar em:", endpoint);

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          cpf: cpfNumerico,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || data.error || "Erro ao realizar cadastro"
        );
      }

      setSubmitSuccess(true);

      setTimeout(() => {
        router.push("/pacient/login");
      }, 2000);
    } catch (error: unknown) {
      console.error("Erro no cadastro:", error);

      let errorMessage = "Erro ao realizar cadastro. Tente novamente.";

      if (error instanceof Error) {
        if (
          error.message.includes("409") ||
          error.message.toLowerCase().includes("já existe") ||
          error.message.toLowerCase().includes("already exists")
        ) {
          errorMessage = "CPF ou e-mail já cadastrado.";
        } else if (error.message.includes("400")) {
          errorMessage = "Dados inválidos. Verifique os campos.";
        } else if (error.message.includes("404")) {
          errorMessage =
            "Serviço indisponível no momento. Tente novamente mais tarde.";
        } else {
          errorMessage = error.message;
        }
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
    !errors.password &&
    formData.name &&
    formData.email &&
    formData.cpf &&
    formData.password;

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
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-2xl p-8 w-full">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-linear-to-r from-blue-600 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Cadastro do Paciente
              </h1>
              <p className="text-gray-600">
                Crie sua conta para acompanhar sua saúde
              </p>
            </div>

            {submitError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <div className="flex items-center text-red-700">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  <span className="font-medium">{submitError}</span>
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
              {/* Nome */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Completo
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
                        ? "border-red-500 focus:ring-2 focus:ring-red-500"
                        : touched.name && !errors.name
                        ? "border-green-500 focus:ring-2 focus:ring-green-500"
                        : "border-gray-200 focus:ring-2 focus:ring-blue-500"
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  E-mail
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
                        ? "border-red-500 focus:ring-2 focus:ring-red-500"
                        : touched.email && !errors.email
                        ? "border-green-500 focus:ring-2 focus:ring-green-500"
                        : "border-gray-200 focus:ring-2 focus:ring-blue-500"
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
                  CPF
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
                        ? "border-red-500 focus:ring-2 focus:ring-red-500"
                        : touched.cpf && !errors.cpf
                        ? "border-green-500 focus:ring-2 focus:ring-green-500"
                        : "border-gray-200 focus:ring-2 focus:ring-blue-500"
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

              {/* Senha */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Senha
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
                        ? "border-red-500 focus:ring-2 focus:ring-red-500"
                        : touched.password && !errors.password
                        ? "border-green-500 focus:ring-2 focus:ring-green-500"
                        : "border-gray-200 focus:ring-2 focus:ring-blue-500"
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
                    href="/pacient/login"
                    className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                  >
                    Faça login
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
