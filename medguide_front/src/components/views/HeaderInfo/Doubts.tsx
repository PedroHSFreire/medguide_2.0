"use client";
import Header from "./Header";
import { useState } from "react";

export default function Doubts() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems((prev) =>
      prev.includes(index)
        ? prev.filter((item) => item !== index)
        : [...prev, index]
    );
  };

  const faqItems = [
    {
      question: "Como faço login?",
      answer:
        "Você deve acessar a página de login, inserir seu Email/CPF e sua senha cadastrada.",
    },
    {
      question: "Esqueci minha senha, o que faço?",
      answer:
        "Clique em 'Esqueceu a senha?' na tela de login e siga as instruções enviadas ao seu e-mail.",
    },
    {
      question: "Preciso pagar para usar o sistema?",
      answer:
        "Não, o uso do sistema é gratuito para todos os usuários cadastrados.",
    },
    {
      question: "Como entro em contato com o suporte?",
      answer:
        "Você pode acessar a aba Ajuda no menu ou enviar um e-mail diretamente para suporte@sistema.com.",
    },
    {
      question: "Quais navegadores são compatíveis?",
      answer:
        "Nosso sistema funciona perfeitamente nos principais navegadores: Chrome, Firefox, Safari e Edge.",
    },
    {
      question: "Meus dados estão seguros?",
      answer:
        "Sim, utilizamos criptografia avançada e seguimos as melhores práticas de segurança para proteger seus dados.",
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <svg
              className="w-8 h-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Dúvidas Frequentes
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Encontre respostas para as perguntas mais comuns sobre nossa
            plataforma
          </p>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {faqItems.map((item, index) => (
            <div
              key={index}
              className={`border-b border-gray-100 last:border-b-0 transition-all duration-200 ${
                openItems.includes(index) ? "bg-blue-50" : "hover:bg-gray-50"
              }`}
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-6 py-6 text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset rounded-lg"
              >
                <div className="flex items-start space-x-4">
                  <div
                    className={`flex shrink-0 w-8 h-8 rounded-full  items-center justify-center text-sm font-semibold transition-colors duration-200 ${
                      openItems.includes(index)
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 pr-4">
                      {item.question}
                    </h3>
                    {openItems.includes(index) && (
                      <p className="mt-2 text-gray-600 text-left">
                        {item.answer}
                      </p>
                    )}
                  </div>
                </div>
                <svg
                  className={`flex shrink-0 w-5 h-5 text-gray-400 transition-transform duration-200 ${
                    openItems.includes(index) ? "transform rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Expanded Content */}
              {openItems.includes(index) && (
                <div className="px-6 pb-6 pl-16">
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <p className="text-gray-700 leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-8 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Não encontrou o que procurava?
            </h3>
            <p className="text-gray-600 mb-6">
              Nossa equipe de suporte está sempre pronta para ajudar você
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg">
                Enviar Mensagem
              </button>
              <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors duration-200">
                Chat Online
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
