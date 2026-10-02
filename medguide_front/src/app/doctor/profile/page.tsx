// components/views/doctor/Profile.tsx - VERSÃO CORRIGIDA
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../lib/hooks/useAuth";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Edit3,
  Save,
  X,
  Shield,
  Stethoscope,
  IdCard,
} from "lucide-react";

export default function DoctorProfilePage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    CRM: "",
    specialty: "",
    experience: "",
    education: "",
    bio: "",
  });
  const [saving, setSaving] = useState(false);

  const updateProfileApi = async (data: Partial<typeof formData>) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const baseUrl = apiUrl?.endsWith("/") ? apiUrl.slice(0, -1) : apiUrl;
    const endpoint = `${baseUrl}/api/doctor/profile`;

    const token = localStorage.getItem("token");

    const res = await fetch(endpoint, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "Erro ao atualizar perfil");
    }

    return res.json();
  };

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/doctor/login");
      return;
    }

    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        CRM: user.CRM || "",
        specialty: user.specialty || "",
        experience: user.experience || "",
        education: user.education || "",
        bio: user.bio || "",
      });
    }

    setLoading(false);
  }, [isAuthenticated, user, router]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      await updateProfileApi({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        CRM: formData.CRM,
        specialty: formData.specialty,
        experience: formData.experience,
        education: formData.education,
        bio: formData.bio,
      });

      alert("Perfil atualizado com sucesso!");
      setIsEditing(false);
      // Recarregar a página para atualizar os dados do usuário
      window.location.reload();
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      alert("Erro ao atualizar perfil. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        CRM: user.CRM || "",
        specialty: user.specialty || "",
        experience: user.experience || "",
        education: user.education || "",
        bio: user.bio || "",
      });
    }
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-teal-100">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-teal-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Meu Perfil</h1>
              <p className="text-gray-600">
                Gerencie suas informações profissionais
              </p>
            </div>
            <button
              onClick={() => router.push("/doctor/dashboard")}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              Voltar ao Dashboard
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar com Informações Básicas */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="text-center">
                <div className="w-32 h-32 bg-linear-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
                <p className="text-gray-600">{user.email}</p>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-center gap-2">
                    <Shield className="w-4 h-4 text-blue-600" />
                    <span className="text-blue-700 text-sm font-medium">
                      Médico
                    </span>
                  </div>
                </div>
              </div>

              {/* Estatísticas Rápidas */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-4">
                  Estatísticas
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Consultas Hoje</span>
                    <span className="font-semibold text-black">0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pacientes Atendidos</span>
                    <span className="font-semibold text-black">0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Membro desde</span>
                    <span className="font-semibold text-black">
                      {new Date().getFullYear()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Formulário de Perfil */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  Informações Profissionais
                </h2>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                  >
                    <Edit3 className="w-4 h-4" />
                    Editar Perfil
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleCancel}
                      className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                    >
                      <X className="w-4 h-4" />
                      Cancelar
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                    >
                      <Save className="w-4 h-4" />
                      {saving ? "Salvando..." : "Salvar"}
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Nome */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome Completo
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full p-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <User className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-700">{user.name}</span>
                      </div>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full p-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Mail className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-700">{user.email}</span>
                      </div>
                    )}
                  </div>

                  {/* Telefone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telefone
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="(11) 99999-9999"
                        className="w-full p-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Phone className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-700">
                          {user.phone || "Não informado"}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* CRM */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CRM
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="CRM"
                        value={formData.CRM}
                        onChange={handleInputChange}
                        className="w-full p-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <IdCard className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-700">
                          {user.CRM || "CRM não cadastrado"}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Especialidade */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Especialidade
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="specialty"
                        value={formData.specialty}
                        onChange={handleInputChange}
                        className="w-full p-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Stethoscope className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-700">
                          {user.specialty || "Especialidade não informada"}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Experiência */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Anos de Experiência
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="experience"
                        value={formData.experience}
                        onChange={handleInputChange}
                        placeholder="Ex: 10 anos"
                        className="w-full p-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-700">
                          {user.experience || "Não informado"}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Formação */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Formação
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="education"
                        value={formData.education}
                        onChange={handleInputChange}
                        placeholder="Ex: Medicina pela USP, Residência em..."
                        className="w-full p-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-700">
                          {user.education || "Não informado"}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Endereço */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Endereço Profissional
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Endereço completo do consultório"
                        className="w-full p-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                        <span className="text-gray-700">
                          {user.address || "Endereço não informado"}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Biografia */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Biografia
                    </label>
                    {isEditing ? (
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        rows={4}
                        placeholder="Descreva sua experiência, especializações e abordagem..."
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-700">
                          {user.bio || "Biografia não informada"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Ações de Segurança */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Segurança
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={() => router.push("/auth/change-password")}
                    className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-800">
                          Alterar Senha
                        </p>
                        <p className="text-sm text-gray-600">
                          Atualize sua senha regularmente
                        </p>
                      </div>
                      <Edit3 className="w-4 h-4 text-gray-400" />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
