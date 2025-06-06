// src/app/onboarding/employee/pre-registration-info/page.tsx
"use client";

import Link from 'next/link';

export default function PreRegistrationInfoPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4 text-center">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-lg w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Informação para Funcionários
        </h1>
        <p className="text-gray-700 mb-8 text-lg">
          Bem-vindo! O cadastro da sua empresa em nosso sistema é iniciado por um administrador.
          Se sua empresa ainda não está cadastrada, por favor, peça ao administrador para realizar o
          processo inicial.
        </p>
        <p className="text-gray-700 mb-8 text-lg">
          Você pode enviar um convite para que seu administrador cadastre a empresa.
        </p>
        <div className="space-y-4">
          <Link
            href="/onboarding/employee/invite-admin"
            className="block w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg text-lg transition duration-150 ease-in-out"
          >
            Convidar meu Administrador
          </Link>
          <Link
            href="/"
            className="block w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 px-6 rounded-lg text-lg transition duration-150 ease-in-out"
          >
            Voltar para a Página Inicial
          </Link>
        </div>
      </div>
    </div>
  );
}
