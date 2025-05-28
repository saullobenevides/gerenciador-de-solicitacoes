// app/page.tsx
"use client";

import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center p-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Bem-vindo à Plataforma!</h1>

      <p className="text-xl text-gray-700 mb-10">
        Você é o administrador de uma empresa ou um funcionário?
      </p>

      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8">
        <Link href="/onboarding/admin">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg shadow-lg text-lg transition duration-300 ease-in-out transform hover:scale-105">
            Sou Administrador
          </button>
        </Link>
        <Link href="/onboarding/employee">
          <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-lg shadow-lg text-lg transition duration-300 ease-in-out transform hover:scale-105">
            Sou Funcionário
          </button>
        </Link>
      </div>

      <div className="mt-12 text-gray-600">
        <p>Já tem uma conta? <Link href="/auth/signin" className="text-blue-500 hover:underline">Faça login aqui.</Link></p>
      </div>
    </div>
  );
}