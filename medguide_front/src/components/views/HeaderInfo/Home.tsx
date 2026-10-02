import Link from "next/link";
export default function HomeComponent() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Como deseja acessar?
        </h1>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Card Paciente com Ícone */}
        <Link
          href="/pacient/login"
          className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 border border-gray-100 text-center group cursor-pointer"
        >
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
            <span className="text-2xl">👤</span>
          </div>
          <h2 className="text-2xl font-bold text-blue-600 mb-4">Paciente</h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            Acesse seu histórico e agende consultas.
          </p>
        </Link>

        {/* Card Médico com Ícone */}
        <Link
          href="/doctor/login"
          className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 border border-gray-100 text-center group cursor-pointer"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
            <span className="text-2xl">👨‍⚕️</span>
          </div>
          <h2 className="text-2xl font-bold text-green-600 mb-4">Médico</h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            Acesse prontuários e gerencie sua agenda.
          </p>
        </Link>
      </div>
    </div>
  );
}
