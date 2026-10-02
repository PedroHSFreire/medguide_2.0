/* eslint-disable @typescript-eslint/no-explicit-any */
// components/views/pacient/SignIn.tsx - Login para Pacientes
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Mail,
  Lock,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  Eye,
  EyeOff,
} from "lucide-react";

export default function LoginPacients() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    login: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  // CORREÇÃO NO login do paciente - adicionar mais logs
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess(false);

    try {
      console.log("🔐 Iniciando processo de login...");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/pacient/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            login: formData.login,
            password: formData.password,
          }),
        }
      );

      const data = await response.json();
      console.log("📨 Resposta completa:", data);

      if (!response.ok) {
        throw new Error(data.message || "Erro no login");
      }

      if (data.success && (data.data?.token || data.token)) {
        setSuccess(true);

        const token = data.data?.token || data.token;
        const userData = data.data?.pacient || data.data;

        console.log("💾 Salvando no localStorage...");
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));

        console.log("✅ Login concluído, verificando autenticação...");

        // 🔥 CORREÇÃO: Forçar verificação imediata
        setTimeout(() => {
          console.log("🔄 Redirecionando para dashboard...");
          router.push("/pacient/dashboard");
          // Forçar reload para garantir que o auth seja detectado
          setTimeout(() => {
            window.location.href = "/pacient/dashboard";
          }, 1000);
        }, 1000);
      } else {
        throw new Error("Estrutura de resposta inválida");
      }
    } catch (err: any) {
      console.error("❌ Erro completo:", err);
      setError(err.message || "Erro ao fazer login");
    } finally {
      setIsSubmitting(false);
    }
  };

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

      {/* Login Form */}
      <div className="flex-1 flex items-center justify-center p-4 w-full">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-2xl p-8 w-full">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-linear-to-r from-blue-600 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Login do Paciente
              </h1>
              <p className="text-gray-600">
                Acesse sua conta para gerenciar consultas
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <div className="flex items-center text-red-700">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  <span className="font-medium">{error}</span>
                </div>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                <div className="flex items-center text-green-700">
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  <span className="font-medium">
                    Login realizado com sucesso! Redirecionando...
                  </span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email/CPF */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email ou CPF
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="login"
                    value={formData.login}
                    onChange={handleInputChange}
                    placeholder="seu@email.com ou 123.456.789-00"
                    disabled={isSubmitting}
                    className="w-full text-black pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    required
                  />
                </div>
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
                    placeholder="Sua senha"
                    disabled={isSubmitting}
                    className="w-full text-black pl-12 pr-12 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    disabled={isSubmitting}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Botão de Login */}
              <button
                type="submit"
                disabled={isSubmitting || !formData.login || !formData.password}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Entrando...
                  </>
                ) : (
                  "Entrar"
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-center text-gray-600 text-sm">
                Não tem conta?{" "}
                <Link
                  href="/pacient/register"
                  className="text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Criar conta
                </Link>
              </p>
            </div>

            {/* Debug Info */}
            {process.env.NODE_ENV === "development" && (
              <div className="mt-4 p-3 bg-gray-100 rounded-lg">
                <p className="text-xs text-gray-600">
                  🔍 API: {process.env.NEXT_PUBLIC_API_URL}/api/pacient/login
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
