// app/auth/error/page.tsx
"use client";
import { useSearchParams } from "next/navigation";
import { AlertCircle } from "lucide-react";

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case "CredentialsSignin":
        return "Credenciais inválidas. Verifique seu e-mail/CPF e senha.";
      case "Configuration":
        return "Erro de configuração do servidor.";
      case "AccessDenied":
        return "Acesso negado.";
      case "Verification":
        return "Erro de verificação.";
      default:
        return "Ocorreu um erro durante a autenticação.";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <div className="flex items-center justify-center mb-6">
          <AlertCircle className="w-12 h-12 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-4">
          Erro de Autenticação
        </h1>
        <p className="text-gray-600 text-center">{getErrorMessage(error)}</p>
        <div className="mt-6 text-center">
          <a
            href="/pacient/login"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Voltar para o login
          </a>
        </div>
      </div>
    </div>
  );
}
