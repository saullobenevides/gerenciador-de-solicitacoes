import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-24">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-lg w-full text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Bem-vindo ao Sistema de Gerenciamento de Solicitações Internas
        </h1>
        <div className="space-y-4">
          <Link
            href="/onboarding/admin/company-setup"
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg text-lg transition duration-150 ease-in-out"
          >
            Sou Administrador de uma Empresa
          </Link>
          <Link
            href="/onboarding/employee/pre-registration-info"
            className="block w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg text-lg transition duration-150 ease-in-out"
          >
            Sou Funcionário
          </Link>
        </div>
      </div>
    </main>
  );
}