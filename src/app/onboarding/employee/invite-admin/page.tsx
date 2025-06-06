// src/app/onboarding/employee/invite-admin/page.tsx
"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function InviteAdminPage() {
  const router = useRouter();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const adminEmail = (event.currentTarget.elements.namedItem('adminEmail') as HTMLInputElement)?.value;
    // TODO: Implement actual invitation logic (e.g., send email)
    console.log("Admin invitation form submitted for email:", adminEmail);
    alert(`Convite (simulado) enviado para: ${adminEmail}`);
    router.push('/'); // Redirect to home or a confirmation page
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">Convidar Administrador</h1>
          <p className="mt-2 text-sm text-gray-600">
            Informe o email do administrador da sua empresa para que ele possa cadastrá-la.
          </p>
        </div>
        <form className="mt-8 space-y-6 bg-white shadow-md rounded-lg p-8" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="adminEmail" className="block text-sm font-medium text-gray-700">
              Email do Administrador
            </label>
            <input
              id="adminEmail"
              name="adminEmail"
              type="email"
              autoComplete="email"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="admin@empresa.com"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Enviar Convite
            </button>
          </div>
        </form>
        <div className="text-sm text-center">
            <Link href="/onboarding/employee/pre-registration-info" className="font-medium text-blue-600 hover:text-blue-500">
                Voltar
            </Link>
        </div>
      </div>
    </div>
  );
}
