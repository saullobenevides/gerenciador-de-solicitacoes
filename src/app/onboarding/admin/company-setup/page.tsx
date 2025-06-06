// src/app/onboarding/admin/company-setup/page.tsx
"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Changed from 'next/navigation' to prevent potential issues if only 'next/router' is expected by older setups. Reverted if not the case.

export default function CompanySetupPage() {
  const router = useRouter();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // TODO: Implement actual form submission logic
    console.log("Form submitted with:", {
      companyName: (event.currentTarget.elements.namedItem('companyName') as HTMLInputElement)?.value,
      industry: (event.currentTarget.elements.namedItem('industry') as HTMLInputElement)?.value,
      size: (event.currentTarget.elements.namedItem('size') as HTMLInputElement)?.value,
    });
    router.push('/onboarding/admin/admin-signup');
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">Cadastro da Empresa</h1>
        </div>
        <form className="mt-8 space-y-6 bg-white shadow-md rounded-lg p-8" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
              Nome da Empresa
            </label>
            <input
              id="companyName"
              name="companyName"
              type="text"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Ex: Acme Corp"
            />
          </div>
          <div>
            <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
              Setor
            </label>
            <input
              id="industry"
              name="industry"
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Ex: Tecnologia"
            />
          </div>
          <div>
            <label htmlFor="size" className="block text-sm font-medium text-gray-700">
              Tamanho
            </label>
            <input
              id="size"
              name="size"
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Ex: 1-50 funcionários"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Próximo
            </button>
          </div>
        </form>
        <div className="text-sm text-center">
            <Link href="/" className="font-medium text-blue-600 hover:text-blue-500">
                Voltar para a página inicial
            </Link>
        </div>
      </div>
    </div>
  );
}
