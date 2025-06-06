// src/app/onboarding/admin/admin-signup/page.tsx
"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminSignupPage() {
  const router = useRouter();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // TODO: Implement actual form submission logic
    console.log("Admin signup form submitted with:", {
      name: (event.currentTarget.elements.namedItem('name') as HTMLInputElement)?.value,
      email: (event.currentTarget.elements.namedItem('email') as HTMLInputElement)?.value,
      password: (event.currentTarget.elements.namedItem('password') as HTMLInputElement)?.value,
    });
    // For now, just log or redirect to a placeholder success page or dashboard
    alert("Cadastro de administrador (simulado) realizado com sucesso!");
    router.push('/'); // Redirect to home or a dashboard page
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">Cadastro da Conta de Administrador</h1>
        </div>
        <form className="mt-8 space-y-6 bg-white shadow-md rounded-lg p-8" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nome Completo
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Seu nome completo"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="seu@email.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Mínimo 8 caracteres"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cadastrar
            </button>
          </div>
        </form>
        <div className="text-sm text-center">
            <Link href="/onboarding/admin/company-setup" className="font-medium text-blue-600 hover:text-blue-500">
                Voltar para Cadastro da Empresa
            </Link>
        </div>
      </div>
    </div>
  );
}
