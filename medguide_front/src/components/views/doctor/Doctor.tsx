"use client";
import { useState } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Stethoscope,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import Header from "../HeaderInfo/Header";

interface ValidationErrors {
  email?: string;
  password?: string;
  cpf?: string;
}
import Link from "next/link";
export default function LoginDoctor() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    cpf: "",
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email: string): string | undefined => {
    if (!email) return "E-mail é obrigatório";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "E-mail inválido";
  };

  const validateCPF = (cpf: string): string | undefined => {
    if (!cpf) return "CPF é obrigatório";
    const cleanCPF = cpf.replace(/\D/g, "");
    if (cleanCPF.length !== 11) return "CPF deve ter 11 dígitos";
    if (/^(\d)\1{10}$/.test(cleanCPF)) return "CPF inválido";
  };

  const validatePassword = (password: string): string | undefined => {
    if (!password) return "Senha é obrigatória";
    if (password.length < 6) return "Senha deve ter pelo menos 6 caracteres";
    if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(password)) {
      return "Senha deve conter letras e números";
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    const isUsingEmail = formData.email.includes("@");

    if (isUsingEmail) {
      const emailError = validateEmail(formData.email);
      if (emailError) newErrors.email = emailError;
    } else {
      const cpfError = validateCPF(formData.email);
      if (cpfError) newErrors.email = cpfError;
    }

    const passwordError = validatePassword(formData.password);
    if (passwordError) newErrors.password = passwordError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case "email":
        return value.includes("@") ? validateEmail(value) : validateCPF(value);
      case "password":
        return validatePassword(value);
      default:
        return undefined;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Dados válidos:", formData);
    } catch (error) {
      console.error("Erro no login:", error);
      alert("Erro ao fazer login. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    !errors.email && !errors.password && formData.email && formData.password;

  return (
    <div>
      <Header />
      <div className="min-h-screen bg-linear-to-br from-blue-50 to-teal-100 flex flex-col">
        {/* Container flexível que cresce para ocupar espaço disponível */}
        <div className="flex-1 flex items-center justify-center p-4 w-full">
          <div className="w-full max-w-md">
            {/* Card do formulário */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 w-full">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-linear-to-r from-blue-600 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Stethoscope className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  Login do Médico
                </h1>
                <p className="text-gray-600">Acesse seu portal por aqui</p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Campo Email/CPF */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    E-mail ou CPF
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      onBlur={handleInputBlur}
                      placeholder="seu@email.com ou 000.000.000-00"
                      className={`w-full pl-12 pr-10 py-3 bg-gray-50 border text-black rounded-xl focus:outline-none transition-all duration-200 ${
                        errors.email
                          ? "border-red-500 focus:ring-2 focus:ring-red-500"
                          : touched.email && !errors.email
                          ? "border-green-500 focus:ring-2 focus:ring-green-500"
                          : "border-gray-200 focus:ring-2 focus:ring-blue-500"
                      }`}
                    />

                    {/* Ícone de status */}
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
                  {touched.email && !errors.email && (
                    <p className="text-green-500 text-sm mt-1 flex items-center">
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                      Campo válido
                    </p>
                  )}
                </div>

                {/* Campo Senha */}
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
                      className={`w-full pl-12 pr-12 py-3 bg-gray-50 text-black border rounded-xl focus:outline-none transition-all duration-200 ${
                        errors.password
                          ? "border-red-500 focus:ring-2 focus:ring-red-500"
                          : touched.password && !errors.password
                          ? "border-green-500 focus:ring-2 focus:ring-green-500"
                          : "border-gray-200 focus:ring-2 focus:ring-blue-500"
                      }`}
                    />

                    {/* Botão mostrar/ocultar senha */}
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>

                    {/* Ícone de status */}
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {errors.password ? (
                        <AlertCircle className="w-5 h-5 text-red-500" />
                      ) : touched.password && !errors.password ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : null}
                    </div>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.password}
                    </p>
                  )}
                  {touched.password && !errors.password && (
                    <p className="text-green-500 text-sm mt-1 flex items-center">
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                      Senha válida
                    </p>
                  )}

                  {/* Dicas para senha */}
                  {!touched.password && (
                    <div className="text-xs text-gray-500 mt-2 space-y-1">
                      <div>A senha deve conter:</div>
                      <div>• Pelo menos 6 caracteres</div>
                      <div>• Letras e números</div>
                    </div>
                  )}
                </div>

                {/* Botão de Submit */}
                <Link href="">
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
                        Entrando...
                      </div>
                    ) : (
                      "Entrar como Paciente"
                    )}
                  </button>
                </Link>
                {/* Links */}
                <div className="text-center space-y-3">
                  <button
                    type="button"
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200 block w-full"
                  >
                    Esqueceu sua senha?
                  </button>

                  <div className="text-sm text-gray-600">
                    Não tem uma conta?{" "}
                    <button
                      type="button"
                      className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                    >
                      Cadastre-se
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
